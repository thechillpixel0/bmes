import { Permission, UserRole } from '../types';

export const PERMISSIONS = {
  // Dashboard
  'dashboard.read': 'View dashboard',
  
  // Companies & Branches
  'companies.read': 'View company information',
  'companies.write': 'Manage company settings',
  'branches.read': 'View branches',
  'branches.write': 'Manage branches',
  
  // Products & Inventory
  'products.read': 'View products',
  'products.write': 'Manage products',
  'inventory.read': 'View inventory',
  'inventory.write': 'Manage inventory',
  'inventory.transfer': 'Transfer inventory',
  'inventory.adjust': 'Adjust inventory',
  
  // Sales
  'sales.read': 'View sales data',
  'sales.write': 'Create and manage sales',
  'pos.access': 'Access POS system',
  'orders.read': 'View orders',
  'orders.write': 'Manage orders',
  'quotes.read': 'View quotes',
  'quotes.write': 'Manage quotes',
  'invoices.read': 'View invoices',
  'invoices.write': 'Manage invoices',
  
  // Purchases
  'purchases.read': 'View purchases',
  'purchases.write': 'Manage purchases',
  'suppliers.read': 'View suppliers',
  'suppliers.write': 'Manage suppliers',
  
  // Finance
  'finance.read': 'View financial data',
  'finance.write': 'Manage financial data',
  'accounting.read': 'View accounting data',
  'accounting.write': 'Manage accounting',
  
  // HR
  'hr.read': 'View HR data',
  'hr.write': 'Manage HR',
  'payroll.read': 'View payroll',
  'payroll.write': 'Manage payroll',
  
  // CRM
  'crm.read': 'View CRM data',
  'crm.write': 'Manage CRM',
  'customers.read': 'View customers',
  'customers.write': 'Manage customers',
  
  // Projects
  'projects.read': 'View projects',
  'projects.write': 'Manage projects',
  'tasks.read': 'View tasks',
  'tasks.write': 'Manage tasks',
  
  // System
  'users.read': 'View users',
  'users.write': 'Manage users',
  'roles.read': 'View roles',
  'roles.write': 'Manage roles',
  'settings.read': 'View settings',
  'settings.write': 'Manage settings',
  'integrations.read': 'View integrations',
  'integrations.write': 'Manage integrations',
  'automation.read': 'View automation',
  'automation.write': 'Manage automation',
  'reports.read': 'View reports',
  'reports.write': 'Generate reports',
  'audit.read': 'View audit logs',
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'], // All permissions
  branch_manager: [
    'dashboard.read',
    'branches.read',
    'products.read', 'products.write',
    'inventory.read', 'inventory.write', 'inventory.transfer', 'inventory.adjust',
    'sales.read', 'sales.write',
    'pos.access',
    'orders.read', 'orders.write',
    'quotes.read', 'quotes.write',
    'invoices.read', 'invoices.write',
    'customers.read', 'customers.write',
    'reports.read',
    'users.read',
  ],
  employee: [
    'dashboard.read',
    'pos.access',
    'orders.read',
    'products.read',
    'inventory.read',
    'customers.read',
  ],
  accountant: [
    'dashboard.read',
    'finance.read', 'finance.write',
    'accounting.read', 'accounting.write',
    'invoices.read', 'invoices.write',
    'reports.read', 'reports.write',
    'customers.read',
    'suppliers.read',
  ],
  auditor: [
    'dashboard.read',
    'finance.read',
    'accounting.read',
    'reports.read',
    'audit.read',
    'orders.read',
    'invoices.read',
  ],
};

export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  
  // Admin has all permissions
  if (rolePermissions.includes('*')) {
    return true;
  }
  
  // Check exact permission
  if (rolePermissions.includes(permission)) {
    return true;
  }
  
  // Check wildcard permissions (e.g., 'sales.*' includes 'sales.read')
  return rolePermissions.some(p => {
    if (p.endsWith('.*')) {
      const module = p.slice(0, -2);
      return permission.startsWith(module + '.');
    }
    return false;
  });
};

export const filterMenuByPermissions = (userRole: UserRole, menuItems: any[]) => {
  return menuItems.filter(item => {
    if (item.permission) {
      return hasPermission(userRole, item.permission);
    }
    return true;
  });
};