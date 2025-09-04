/*
  # Complete Business Management System Schema

  1. New Tables
    - `companies` - Business company information
    - `branches` - Company branch locations
    - `users` - System users with roles
    - `roles` - User roles and permissions
    - `customers` - Customer information
    - `suppliers` - Supplier information
    - `products` - Product catalog
    - `product_categories` - Product categorization
    - `stock_items` - Inventory tracking
    - `sales_orders` - Sales order headers
    - `sales_order_lines` - Sales order line items
    - `invoices` - Invoice headers
    - `invoice_lines` - Invoice line items
    - `purchase_orders` - Purchase order headers
    - `purchase_order_lines` - Purchase order line items
    - `stock_movements` - Inventory movement tracking
    - `chart_of_accounts` - Accounting structure
    - `journal_entries` - Financial transactions
    - `journal_entry_lines` - Transaction line items

  2. Security
    - Enable RLS on all tables
    - Add policies for multi-tenant access based on company_id
    - User authentication and authorization

  3. Features
    - Complete multi-tenant architecture
    - Inventory management with real-time tracking
    - Sales order processing workflow
    - Financial accounting integration
    - User role-based permissions
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  industry text NOT NULL,
  company_type text NOT NULL DEFAULT 'Private Limited',
  employee_count text NOT NULL DEFAULT '1-10',
  country text NOT NULL DEFAULT 'United States',
  phone text NOT NULL,
  default_currency text NOT NULL DEFAULT 'USD',
  fiscal_year_start text NOT NULL DEFAULT 'January',
  timezone text NOT NULL DEFAULT 'America/New_York',
  tax_reg_no text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  phone text NOT NULL,
  timezone text,
  manager_user_id uuid,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  permissions jsonb NOT NULL DEFAULT '[]',
  is_system boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES branches(id),
  email text NOT NULL,
  full_name text NOT NULL,
  role_id uuid NOT NULL REFERENCES roles(id),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  parent_id uuid REFERENCES product_categories(id),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  sku text NOT NULL,
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES product_categories(id),
  uom text NOT NULL DEFAULT 'Each',
  cost numeric(10,2) DEFAULT 0,
  sale_price numeric(10,2) NOT NULL,
  tax_code text,
  track_serial boolean DEFAULT false,
  reorder_point integer DEFAULT 0,
  is_active boolean DEFAULT true,
  barcode text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, sku)
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_code text,
  name text NOT NULL,
  email text,
  phone text,
  billing_address text,
  shipping_address text,
  city text,
  state text,
  postal_code text,
  country text,
  tax_id text,
  credit_limit numeric(10,2) DEFAULT 0,
  payment_terms text DEFAULT 'Net 30',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, customer_code)
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  supplier_code text,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  city text,
  state text,
  postal_code text,
  country text,
  tax_id text,
  payment_terms text DEFAULT 'Net 30',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, supplier_code)
);

-- Stock items table
CREATE TABLE IF NOT EXISTS stock_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_code text DEFAULT 'MAIN',
  bin_location text,
  lot_number text,
  serial_number text,
  qty_on_hand numeric(10,2) DEFAULT 0,
  qty_reserved numeric(10,2) DEFAULT 0,
  qty_available numeric(10,2) GENERATED ALWAYS AS (qty_on_hand - qty_reserved) STORED,
  last_movement_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, branch_id, product_id, warehouse_code, COALESCE(lot_number, ''), COALESCE(serial_number, ''))
);

-- Sales orders table
CREATE TABLE IF NOT EXISTS sales_orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id),
  order_number text NOT NULL,
  order_date date DEFAULT CURRENT_DATE,
  delivery_date date,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'reserved', 'picking', 'shipped', 'delivered', 'invoiced', 'paid', 'closed', 'cancelled')),
  subtotal numeric(10,2) DEFAULT 0,
  discount_amount numeric(10,2) DEFAULT 0,
  tax_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, order_number)
);

-- Sales order lines table
CREATE TABLE IF NOT EXISTS sales_order_lines (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  qty numeric(10,2) NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  discount_pct numeric(5,2) DEFAULT 0,
  line_total numeric(10,2) GENERATED ALWAYS AS (qty * unit_price * (1 - discount_pct / 100)) STORED,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id),
  order_id uuid REFERENCES sales_orders(id),
  invoice_number text NOT NULL,
  invoice_date date DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  subtotal numeric(10,2) DEFAULT 0,
  discount_amount numeric(10,2) DEFAULT 0,
  tax_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) DEFAULT 0,
  paid_amount numeric(10,2) DEFAULT 0,
  balance_due numeric(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  currency text DEFAULT 'USD',
  notes text,
  pdf_url text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, invoice_number)
);

-- Purchase orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  supplier_id uuid NOT NULL REFERENCES suppliers(id),
  po_number text NOT NULL,
  po_date date DEFAULT CURRENT_DATE,
  expected_date date,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'confirmed', 'received', 'invoiced', 'paid', 'closed', 'cancelled')),
  subtotal numeric(10,2) DEFAULT 0,
  tax_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, po_number)
);

-- Purchase order lines table
CREATE TABLE IF NOT EXISTS purchase_order_lines (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  po_id uuid NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  qty numeric(10,2) NOT NULL,
  unit_cost numeric(10,2) NOT NULL,
  line_total numeric(10,2) GENERATED ALWAYS AS (qty * unit_cost) STORED,
  qty_received numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stock movements table
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  movement_type text NOT NULL CHECK (movement_type IN ('in', 'out', 'transfer', 'adjustment')),
  reference_type text, -- 'sales_order', 'purchase_order', 'transfer', 'adjustment'
  reference_id uuid,
  qty_change numeric(10,2) NOT NULL,
  qty_before numeric(10,2) NOT NULL,
  qty_after numeric(10,2) NOT NULL,
  unit_cost numeric(10,2),
  warehouse_code text DEFAULT 'MAIN',
  bin_location text,
  lot_number text,
  serial_number text,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Chart of accounts table
CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  account_code text NOT NULL,
  account_name text NOT NULL,
  account_type text NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'income', 'expense')),
  parent_id uuid REFERENCES chart_of_accounts(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, account_code)
);

-- Journal entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES branches(id),
  entry_number text NOT NULL,
  entry_date date DEFAULT CURRENT_DATE,
  reference text,
  description text NOT NULL,
  total_debit numeric(10,2) DEFAULT 0,
  total_credit numeric(10,2) DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'posted', 'reversed')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, entry_number)
);

-- Journal entry lines table
CREATE TABLE IF NOT EXISTS journal_entry_lines (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_id uuid NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES chart_of_accounts(id),
  description text,
  debit_amount numeric(10,2) DEFAULT 0,
  credit_amount numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entry_lines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Users can access their company data" ON companies
  FOR ALL TO authenticated
  USING (id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for branches
CREATE POLICY "Users can access their company branches" ON branches
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for roles
CREATE POLICY "Users can access their company roles" ON roles
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for users
CREATE POLICY "Users can access their company users" ON users
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for product_categories
CREATE POLICY "Users can access their company product categories" ON product_categories
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for products
CREATE POLICY "Users can access their company products" ON products
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for customers
CREATE POLICY "Users can access their company customers" ON customers
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for suppliers
CREATE POLICY "Users can access their company suppliers" ON suppliers
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for stock_items
CREATE POLICY "Users can access their company stock" ON stock_items
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for sales_orders
CREATE POLICY "Users can access their company sales orders" ON sales_orders
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for sales_order_lines
CREATE POLICY "Users can access their company sales order lines" ON sales_order_lines
  FOR ALL TO authenticated
  USING (order_id IN (
    SELECT id FROM sales_orders WHERE company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  ));

-- RLS Policies for invoices
CREATE POLICY "Users can access their company invoices" ON invoices
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for purchase_orders
CREATE POLICY "Users can access their company purchase orders" ON purchase_orders
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for purchase_order_lines
CREATE POLICY "Users can access their company purchase order lines" ON purchase_order_lines
  FOR ALL TO authenticated
  USING (po_id IN (
    SELECT id FROM purchase_orders WHERE company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  ));

-- RLS Policies for stock_movements
CREATE POLICY "Users can access their company stock movements" ON stock_movements
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for chart_of_accounts
CREATE POLICY "Users can access their company chart of accounts" ON chart_of_accounts
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for journal_entries
CREATE POLICY "Users can access their company journal entries" ON journal_entries
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for journal_entry_lines
CREATE POLICY "Users can access their company journal entry lines" ON journal_entry_lines
  FOR ALL TO authenticated
  USING (entry_id IN (
    SELECT id FROM journal_entries WHERE company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_branches_company_id ON branches(company_id);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(company_id, sku);
CREATE INDEX IF NOT EXISTS idx_customers_company_id ON customers(company_id);
CREATE INDEX IF NOT EXISTS idx_stock_items_company_branch_product ON stock_items(company_id, branch_id, product_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_company_id ON sales_orders(company_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_status ON sales_orders(company_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_company_product ON stock_movements(company_id, product_id);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_orders_updated_at BEFORE UPDATE ON sales_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stock_items_updated_at BEFORE UPDATE ON stock_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();