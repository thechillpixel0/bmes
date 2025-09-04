import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { SalesOrder, Customer } from '../types';

export const useOrders = (filters?: { status?: string; branch_id?: string; search?: string }) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      let query = supabase
        .from('sales_orders')
        .select(`
          *,
          customer:customers(*),
          branch:branches(*),
          lines:sales_order_lines(*)
        `);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.branch_id) {
        query = query.eq('branch_id', filters.branch_id);
      }

      if (filters?.search) {
        query = query.or(`order_number.ilike.%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data as (SalesOrder & { customer: Customer; branch: any; lines: any[] })[];
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: {
      customer_id: string;
      branch_id: string;
      lines: Array<{
        product_id: string;
        qty: number;
        unit_price: number;
        discount_pct?: number;
      }>;
    }) => {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('sales_orders')
        .insert({
          company_id: 'demo-company-id', // This should come from auth context
          branch_id: orderData.branch_id,
          customer_id: orderData.customer_id,
          order_number: `SO-${Date.now()}`, // Generate proper order number
          total_amount: orderData.lines.reduce((sum, line) => 
            sum + (line.qty * line.unit_price * (1 - (line.discount_pct || 0) / 100)), 0
          ),
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order lines
      const lines = orderData.lines.map(line => ({
        order_id: order.id,
        product_id: line.product_id,
        qty: line.qty,
        unit_price: line.unit_price,
        discount_pct: line.discount_pct || 0,
        line_total: line.qty * line.unit_price * (1 - (line.discount_pct || 0) / 100),
      }));

      const { error: linesError } = await supabase
        .from('sales_order_lines')
        .insert(lines);

      if (linesError) throw linesError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};