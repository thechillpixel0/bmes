export interface Company {
  id: string;
  name: string;
  industry: string;
  default_currency: string;
  fiscal_year_start: string;
  timezone: string;
  tax_reg_no?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  company_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  timezone?: string;
  manager_user_id?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  company_id: string;
  branch_id?: string;
  email: string;
  full_name: string;
  role_id: string;
  status: 'active' | 'inactive' | 'pending';
  last_login?: string;
  created_at: string;
  updated_at: string;
  role?: Role;
  branch?: Branch;
}

export interface Role {
  id: string;
  company_id: string;
  name: string;
  permissions: string[];
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  uom: string;
  cost: number;
  sale_price: number;
  tax_code?: string;
  track_serial: boolean;
  is_active: boolean;
  barcode?: string;
  created_at: string;
  updated_at: string;
}

export interface StockItem {
  id: string;
  company_id: string;
  branch_id: string;
  product_id: string;
  warehouse_id?: string;
  bin?: string;
  lot?: string;
  serial_no?: string;
  qty_on_hand: number;
  qty_reserved: number;
  created_at: string;
  updated_at: string;
  product?: Product;
  branch?: Branch;
}

export interface Customer {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  billing_address?: string;
  shipping_address?: string;
  tax_id?: string;
  credit_limit: number;
  created_at: string;
  updated_at: string;
}

export interface SalesOrder {
  id: string;
  company_id: string;
  branch_id: string;
  customer_id: string;
  order_number: string;
  total_amount: number;
  currency: string;
  status: 'draft' | 'confirmed' | 'reserved' | 'picking' | 'shipped' | 'delivered' | 'invoiced' | 'paid' | 'closed';
  order_date: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  branch?: Branch;
  lines?: SalesOrderLine[];
}

export interface SalesOrderLine {
  id: string;
  order_id: string;
  product_id: string;
  qty: number;
  unit_price: number;
  discount_pct: number;
  line_total: number;
  product?: Product;
}

export interface Invoice {
  id: string;
  company_id: string;
  order_id?: string;
  customer_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total: number;
  tax_total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  pdf_url?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  order?: SalesOrder;
}

export interface DashboardKPI {
  revenue_mtd: number;
  accounts_receivable: number;
  accounts_payable: number;
  cash_balance: number;
  inventory_value: number;
}

export interface Permission {
  module: string;
  action: string;
  scope: 'global' | 'branch' | 'own';
}

export type UserRole = 'admin' | 'branch_manager' | 'employee' | 'accountant' | 'auditor';