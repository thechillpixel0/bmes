import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Product, StockItem } from '../types';

export const useProducts = (filters?: { search?: string; category?: string; active?: boolean }) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*');

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.active !== undefined) {
        query = query.eq('is_active', filters.active);
      }

      query = query.order('name');

      const { data, error } = await query;

      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useStockLevels = (filters?: { branch_id?: string; status?: string }) => {
  return useQuery({
    queryKey: ['stock-levels', filters],
    queryFn: async () => {
      let query = supabase
        .from('stock_items')
        .select(`
          *,
          product:products(*),
          branch:branches(*)
        `);

      if (filters?.branch_id) {
        query = query.eq('branch_id', filters.branch_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (StockItem & { product: Product; branch: any })[];
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};