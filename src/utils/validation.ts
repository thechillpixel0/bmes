import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().min(10, 'Phone number must be at least 10 digits');
export const currencySchema = z.number().min(0, 'Amount must be positive');
export const percentageSchema = z.number().min(0).max(100, 'Percentage must be between 0 and 100');

// Company validation
export const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(1, 'Industry is required'),
  default_currency: z.string().length(3, 'Currency code must be 3 characters'),
  fiscal_year_start: z.string().min(1, 'Fiscal year start is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  tax_reg_no: z.string().optional(),
});

// Branch validation
export const branchSchema = z.object({
  name: z.string().min(2, 'Branch name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  postal_code: z.string().min(3, 'Postal code must be at least 3 characters'),
  phone: phoneSchema,
  timezone: z.string().optional(),
});

// Product validation
export const productSchema = z.object({
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  uom: z.string().min(1, 'Unit of measure is required'),
  cost: currencySchema,
  sale_price: currencySchema,
  tax_code: z.string().optional(),
  track_serial: z.boolean().default(false),
  reorder_point: z.number().min(0, 'Reorder point must be positive'),
});

// Customer validation
export const customerSchema = z.object({
  name: z.string().min(2, 'Customer name must be at least 2 characters'),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  billing_address: z.string().optional(),
  shipping_address: z.string().optional(),
  tax_id: z.string().optional(),
  credit_limit: currencySchema.default(0),
  customer_code: z.string().optional(),
});

// Order validation
export const orderSchema = z.object({
  customer_id: z.string().uuid('Invalid customer ID'),
  branch_id: z.string().uuid('Invalid branch ID'),
  notes: z.string().optional(),
  lines: z.array(z.object({
    product_id: z.string().uuid('Invalid product ID'),
    qty: z.number().min(1, 'Quantity must be at least 1'),
    unit_price: currencySchema,
    discount_pct: percentageSchema.default(0),
  })).min(1, 'Order must have at least one line item'),
});

// User validation
export const userSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: emailSchema,
  role_id: z.string().uuid('Invalid role ID'),
  branch_id: z.string().uuid('Invalid branch ID').optional(),
});

// Validation helper functions
export const validateSKU = (sku: string, existingSKUs: string[] = []): string | null => {
  if (sku.length < 3) return 'SKU must be at least 3 characters';
  if (existingSKUs.includes(sku)) return 'SKU already exists';
  return null;
};

export const validateEmail = (email: string, existingEmails: string[] = []): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  if (existingEmails.includes(email)) return 'Email already exists';
  return null;
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 10) {
    errors.push('Password must be at least 10 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return errors;
};