import { supabase } from './supabase';
import { 
  Company, 
  Branch, 
  Product, 
  Customer, 
  SalesOrder, 
  StockItem,
  User,
  Role
} from '../types';

// Company operations
export const companyService = {
  async getCurrent(): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Company>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Branch operations
export const branchService = {
  async getAll(): Promise<Branch[]> {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Branch | null> {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(branch: Omit<Branch, 'id' | 'created_at' | 'updated_at'>): Promise<Branch> {
    const { data, error } = await supabase
      .from('branches')
      .insert(branch)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Branch>): Promise<Branch> {
    const { data, error } = await supabase
      .from('branches')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('branches')
      .update({ active: false })
      .eq('id', id);

    if (error) throw error;
  }
};

// Product operations
export const productService = {
  async getAll(filters?: { search?: string; category_id?: string; active?: boolean }): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*, category:product_categories(*)');

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
    }

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters?.active !== undefined) {
      query = query.eq('is_active', filters.active);
    }

    query = query.order('name');

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:product_categories(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  }
};

// Customer operations
export const customerService = {
  async getAll(filters?: { search?: string; active?: boolean }): Promise<Customer[]> {
    let query = supabase
      .from('customers')
      .select('*');

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,customer_code.ilike.%${filters.search}%`);
    }

    if (filters?.active !== undefined) {
      query = query.eq('is_active', filters.active);
    }

    query = query.order('name');

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async create(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Stock operations
export const stockService = {
  async getStockLevels(filters?: { branch_id?: string; product_id?: string }): Promise<(StockItem & { product: Product; branch: Branch })[]> {
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

    if (filters?.product_id) {
      query = query.eq('product_id', filters.product_id);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async adjustStock(
    productId: string, 
    branchId: string, 
    qtyChange: number, 
    movementType: 'in' | 'out' | 'adjustment',
    notes?: string
  ): Promise<void> {
    // Get current stock
    const { data: currentStock, error: stockError } = await supabase
      .from('stock_items')
      .select('qty_on_hand')
      .eq('product_id', productId)
      .eq('branch_id', branchId)
      .single();

    if (stockError) throw stockError;

    const qtyBefore = currentStock?.qty_on_hand || 0;
    const qtyAfter = qtyBefore + qtyChange;

    // Update stock
    const { error: updateError } = await supabase
      .from('stock_items')
      .upsert({
        product_id: productId,
        branch_id: branchId,
        company_id: 'demo-company-id',
        qty_on_hand: qtyAfter,
        last_movement_date: new Date().toISOString()
      });

    if (updateError) throw updateError;

    // Record movement
    const { error: movementError } = await supabase
      .from('stock_movements')
      .insert({
        company_id: 'demo-company-id',
        branch_id: branchId,
        product_id: productId,
        movement_type: movementType,
        qty_change: qtyChange,
        qty_before: qtyBefore,
        qty_after: qtyAfter,
        notes,
        created_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (movementError) throw movementError;
  }
};

// Sales order operations
export const orderService = {
  async getAll(filters?: { status?: string; branch_id?: string; search?: string }): Promise<(SalesOrder & { customer: Customer; branch: Branch })[]> {
    let query = supabase
      .from('sales_orders')
      .select(`
        *,
        customer:customers(*),
        branch:branches(*)
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
    return data || [];
  },

  async getById(id: string): Promise<(SalesOrder & { customer: Customer; branch: Branch; lines: any[] }) | null> {
    const { data, error } = await supabase
      .from('sales_orders')
      .select(`
        *,
        customer:customers(*),
        branch:branches(*),
        lines:sales_order_lines(*, product:products(*))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(orderData: {
    customer_id: string;
    branch_id: string;
    notes?: string;
    lines: Array<{
      product_id: string;
      qty: number;
      unit_price: number;
      discount_pct?: number;
    }>;
  }): Promise<SalesOrder> {
    // Calculate totals
    const subtotal = orderData.lines.reduce((sum, line) => 
      sum + (line.qty * line.unit_price * (1 - (line.discount_pct || 0) / 100)), 0
    );
    const taxAmount = subtotal * 0.08; // 8% tax
    const totalAmount = subtotal + taxAmount;

    // Generate order number
    const orderNumber = `SO-${Date.now()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('sales_orders')
      .insert({
        company_id: 'demo-company-id',
        branch_id: orderData.branch_id,
        customer_id: orderData.customer_id,
        order_number: orderNumber,
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        notes: orderData.notes,
        created_by: (await supabase.auth.getUser()).data.user?.id
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
    }));

    const { error: linesError } = await supabase
      .from('sales_order_lines')
      .insert(lines);

    if (linesError) throw linesError;

    return order;
  },

  async updateStatus(id: string, status: string): Promise<SalesOrder> {
    const { data, error } = await supabase
      .from('sales_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Dashboard operations
export const dashboardService = {
  async getKPIs(): Promise<{
    revenue_mtd: number;
    accounts_receivable: number;
    accounts_payable: number;
    cash_balance: number;
    inventory_value: number;
  }> {
    // This would normally be calculated from actual data
    // For demo purposes, returning sample data
    return {
      revenue_mtd: 45230,
      accounts_receivable: 18450,
      accounts_payable: 12340,
      cash_balance: 32890,
      inventory_value: 89560
    };
  },

  async getRecentActivity(): Promise<any[]> {
    const { data, error } = await supabase
      .from('sales_orders')
      .select(`
        id,
        order_number,
        total_amount,
        status,
        created_at,
        customer:customers(name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  }
};