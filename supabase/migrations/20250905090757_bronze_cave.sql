/*
  # Insert Sample Data for Development

  1. Sample Data
    - Default company and branches
    - Default roles and permissions
    - Sample products and categories
    - Sample customers
    - Sample chart of accounts
    - Initial stock levels

  2. Purpose
    - Provides working data for development and testing
    - Demonstrates system capabilities
    - Enables immediate functionality testing
*/

-- Insert sample company
INSERT INTO companies (id, name, industry, company_type, employee_count, country, phone, default_currency, fiscal_year_start, timezone)
VALUES (
  'demo-company-id',
  'Demo Business Corp',
  'Technology',
  'Private Limited',
  '11-50',
  'United States',
  '+1 (555) 123-4567',
  'USD',
  'January',
  'America/New_York'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample branches
INSERT INTO branches (id, company_id, name, address, city, state, postal_code, phone, active)
VALUES 
  ('branch-main', 'demo-company-id', 'Main Branch', '123 Business Ave', 'New York', 'NY', '10001', '+1 (555) 123-4567', true),
  ('branch-downtown', 'demo-company-id', 'Downtown Store', '456 Commerce St', 'Los Angeles', 'CA', '90001', '+1 (555) 987-6543', true),
  ('branch-uptown', 'demo-company-id', 'Uptown Branch', '789 Market Rd', 'Chicago', 'IL', '60601', '+1 (555) 456-7890', true)
ON CONFLICT (id) DO NOTHING;

-- Insert default roles
INSERT INTO roles (id, company_id, name, permissions, is_system)
VALUES 
  ('role-admin', 'demo-company-id', 'Administrator', '["*"]', true),
  ('role-manager', 'demo-company-id', 'Branch Manager', '["dashboard.read", "products.*", "inventory.*", "sales.*", "customers.*", "reports.read"]', true),
  ('role-employee', 'demo-company-id', 'Employee', '["dashboard.read", "pos.access", "orders.read", "products.read", "customers.read"]', true),
  ('role-accountant', 'demo-company-id', 'Accountant', '["dashboard.read", "finance.*", "accounting.*", "invoices.*", "reports.*"]', true)
ON CONFLICT (id) DO NOTHING;

-- Insert product categories
INSERT INTO product_categories (id, company_id, name, description, active)
VALUES 
  ('cat-electronics', 'demo-company-id', 'Electronics', 'Electronic devices and accessories', true),
  ('cat-food', 'demo-company-id', 'Food & Beverage', 'Food and beverage products', true),
  ('cat-apparel', 'demo-company-id', 'Apparel', 'Clothing and accessories', true),
  ('cat-home', 'demo-company-id', 'Home & Garden', 'Home and garden products', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, company_id, sku, name, description, category_id, uom, cost, sale_price, reorder_point, is_active)
VALUES 
  ('prod-001', 'demo-company-id', 'SKU-001', 'Wireless Bluetooth Headphones', 'High-quality wireless headphones with noise cancellation', 'cat-electronics', 'Each', 45.00, 89.99, 50, true),
  ('prod-002', 'demo-company-id', 'SKU-002', 'Organic Coffee Beans', 'Premium organic coffee beans from sustainable farms', 'cat-food', 'Kg', 12.50, 24.99, 25, true),
  ('prod-003', 'demo-company-id', 'SKU-003', 'Cotton T-Shirt', 'Comfortable 100% cotton t-shirt in various colors', 'cat-apparel', 'Each', 8.00, 19.99, 20, true),
  ('prod-004', 'demo-company-id', 'SKU-004', 'Stainless Steel Water Bottle', 'Insulated stainless steel water bottle', 'cat-home', 'Each', 15.00, 29.99, 15, true),
  ('prod-005', 'demo-company-id', 'SKU-005', 'Smartphone Case', 'Protective case for smartphones', 'cat-electronics', 'Each', 5.00, 14.99, 30, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample customers
INSERT INTO customers (id, company_id, customer_code, name, email, phone, billing_address, city, state, postal_code, country, credit_limit, is_active)
VALUES 
  ('cust-001', 'demo-company-id', 'CUST-001', 'Acme Corporation', 'billing@acme.com', '+1 (555) 111-2222', '100 Corporate Blvd', 'New York', 'NY', '10001', 'United States', 10000.00, true),
  ('cust-002', 'demo-company-id', 'CUST-002', 'Tech Solutions Inc', 'accounts@techsolutions.com', '+1 (555) 333-4444', '200 Innovation Dr', 'San Francisco', 'CA', '94105', 'United States', 15000.00, true),
  ('cust-003', 'demo-company-id', 'CUST-003', 'Global Enterprises', 'finance@global.com', '+1 (555) 555-6666', '300 Enterprise Way', 'Chicago', 'IL', '60601', 'United States', 20000.00, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample suppliers
INSERT INTO suppliers (id, company_id, supplier_code, name, email, phone, address, city, state, postal_code, country, is_active)
VALUES 
  ('supp-001', 'demo-company-id', 'SUPP-001', 'Electronics Wholesale Co', 'orders@electronicswholesale.com', '+1 (555) 777-8888', '400 Wholesale St', 'Los Angeles', 'CA', '90001', 'United States', true),
  ('supp-002', 'demo-company-id', 'SUPP-002', 'Organic Farms Ltd', 'sales@organicfarms.com', '+1 (555) 999-0000', '500 Farm Road', 'Portland', 'OR', '97201', 'United States', true)
ON CONFLICT (id) DO NOTHING;

-- Insert initial stock levels
INSERT INTO stock_items (id, company_id, branch_id, product_id, warehouse_code, qty_on_hand, qty_reserved)
VALUES 
  ('stock-001', 'demo-company-id', 'branch-main', 'prod-001', 'MAIN', 150, 25),
  ('stock-002', 'demo-company-id', 'branch-main', 'prod-002', 'MAIN', 75, 10),
  ('stock-003', 'demo-company-id', 'branch-main', 'prod-003', 'MAIN', 200, 15),
  ('stock-004', 'demo-company-id', 'branch-main', 'prod-004', 'MAIN', 5, 3),
  ('stock-005', 'demo-company-id', 'branch-main', 'prod-005', 'MAIN', 80, 5),
  ('stock-006', 'demo-company-id', 'branch-downtown', 'prod-001', 'MAIN', 100, 15),
  ('stock-007', 'demo-company-id', 'branch-downtown', 'prod-002', 'MAIN', 15, 5),
  ('stock-008', 'demo-company-id', 'branch-downtown', 'prod-003', 'MAIN', 120, 8),
  ('stock-009', 'demo-company-id', 'branch-uptown', 'prod-001', 'MAIN', 75, 10),
  ('stock-010', 'demo-company-id', 'branch-uptown', 'prod-004', 'MAIN', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Insert sample chart of accounts
INSERT INTO chart_of_accounts (id, company_id, account_code, account_name, account_type, parent_id, is_active)
VALUES 
  ('acc-1000', 'demo-company-id', '1000', 'Assets', 'asset', NULL, true),
  ('acc-1100', 'demo-company-id', '1100', 'Current Assets', 'asset', 'acc-1000', true),
  ('acc-1110', 'demo-company-id', '1110', 'Cash and Cash Equivalents', 'asset', 'acc-1100', true),
  ('acc-1120', 'demo-company-id', '1120', 'Accounts Receivable', 'asset', 'acc-1100', true),
  ('acc-1130', 'demo-company-id', '1130', 'Inventory', 'asset', 'acc-1100', true),
  ('acc-1200', 'demo-company-id', '1200', 'Fixed Assets', 'asset', 'acc-1000', true),
  ('acc-1210', 'demo-company-id', '1210', 'Property, Plant & Equipment', 'asset', 'acc-1200', true),
  ('acc-2000', 'demo-company-id', '2000', 'Liabilities', 'liability', NULL, true),
  ('acc-2100', 'demo-company-id', '2100', 'Current Liabilities', 'liability', 'acc-2000', true),
  ('acc-2110', 'demo-company-id', '2110', 'Accounts Payable', 'liability', 'acc-2100', true),
  ('acc-3000', 'demo-company-id', '3000', 'Equity', 'equity', NULL, true),
  ('acc-3100', 'demo-company-id', '3100', 'Owner''s Equity', 'equity', 'acc-3000', true),
  ('acc-4000', 'demo-company-id', '4000', 'Revenue', 'income', NULL, true),
  ('acc-4100', 'demo-company-id', '4100', 'Sales Revenue', 'income', 'acc-4000', true),
  ('acc-5000', 'demo-company-id', '5000', 'Expenses', 'expense', NULL, true),
  ('acc-5100', 'demo-company-id', '5100', 'Cost of Goods Sold', 'expense', 'acc-5000', true),
  ('acc-5200', 'demo-company-id', '5200', 'Operating Expenses', 'expense', 'acc-5000', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample sales orders
INSERT INTO sales_orders (id, company_id, branch_id, customer_id, order_number, order_date, status, subtotal, tax_amount, total_amount, created_by)
VALUES 
  ('order-001', 'demo-company-id', 'branch-main', 'cust-001', 'SO-001234', '2025-01-15', 'confirmed', 1157.41, 92.59, 1250.00, auth.uid()),
  ('order-002', 'demo-company-id', 'branch-downtown', 'cust-002', 'SO-001235', '2025-01-14', 'shipped', 787.04, 62.96, 850.00, auth.uid()),
  ('order-003', 'demo-company-id', 'branch-main', 'cust-003', 'SO-001236', '2025-01-13', 'picking', 1944.44, 155.56, 2100.00, auth.uid())
ON CONFLICT (id) DO NOTHING;

-- Insert sample sales order lines
INSERT INTO sales_order_lines (order_id, product_id, qty, unit_price, discount_pct)
VALUES 
  ('order-001', 'prod-001', 5, 89.99, 0),
  ('order-001', 'prod-002', 10, 24.99, 5),
  ('order-001', 'prod-003', 15, 19.99, 0),
  ('order-002', 'prod-001', 3, 89.99, 0),
  ('order-002', 'prod-004', 8, 29.99, 10),
  ('order-003', 'prod-001', 10, 89.99, 0),
  ('order-003', 'prod-002', 20, 24.99, 0),
  ('order-003', 'prod-003', 25, 19.99, 5),
  ('order-003', 'prod-005', 30, 14.99, 0)
ON CONFLICT DO NOTHING;