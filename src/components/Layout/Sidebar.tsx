import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  ShoppingCart,
  CreditCard,
  Package,
  Truck,
  DollarSign,
  Users,
  Calendar,
  FolderKanban,
  Zap,
  Settings,
  ChevronDown,
  ChevronRight,
  Home,
  Receipt,
  FileText,
  RotateCcw,
  Boxes,
  TrendingUp,
  Warehouse,
  RefreshCw,
  UserCheck,
  ShoppingBag,
  FileSpreadsheet,
  Banknote,
  PieChart,
  UserPlus,
  Clock,
  Briefcase,
  Target,
  CheckSquare,
  Workflow,
  Plug,
  HelpCircle
} from 'lucide-react';

interface NavItem {
  name: string;
  path?: string;
  icon: React.ComponentType<any>;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Branches', path: '/branches', icon: Building2 },
  {
    name: 'Sales',
    icon: ShoppingCart,
    children: [
      { name: 'POS', path: '/pos', icon: CreditCard },
      { name: 'Orders', path: '/orders', icon: ShoppingBag },
      { name: 'Quotes', path: '/quotes', icon: FileText },
      { name: 'Invoices', path: '/invoices', icon: Receipt },
      { name: 'Returns', path: '/returns', icon: RotateCcw },
    ]
  },
  {
    name: 'Products & Inventory',
    icon: Package,
    children: [
      { name: 'Products', path: '/products', icon: Boxes },
      { name: 'Stock Levels', path: '/inventory/levels', icon: TrendingUp },
      { name: 'Transfers', path: '/inventory/transfers', icon: Truck },
      { name: 'Cycle Counts', path: '/inventory/counts', icon: RefreshCw },
    ]
  },
  {
    name: 'Purchases',
    icon: Truck,
    children: [
      { name: 'Suppliers', path: '/suppliers', icon: UserCheck },
      { name: 'Purchase Orders', path: '/purchase-orders', icon: FileSpreadsheet },
      { name: 'Goods Receipt', path: '/grn', icon: Warehouse },
      { name: 'Bills', path: '/bills', icon: Banknote },
    ]
  },
  {
    name: 'Finance',
    icon: DollarSign,
    children: [
      { name: 'Chart of Accounts', path: '/finance/coa', icon: PieChart },
      { name: 'Journal Entries', path: '/finance/journals', icon: FileText },
      { name: 'Bank Reconciliation', path: '/finance/reconciliation', icon: RefreshCw },
      { name: 'Reports', path: '/finance/reports', icon: BarChart3 },
    ]
  },
  { name: 'CRM', path: '/crm', icon: Users },
  {
    name: 'HR',
    icon: UserPlus,
    children: [
      { name: 'Employees', path: '/hr/employees', icon: Users },
      { name: 'Attendance', path: '/hr/attendance', icon: Clock },
      { name: 'Payroll', path: '/hr/payroll', icon: Banknote },
    ]
  },
  {
    name: 'Projects',
    icon: FolderKanban,
    children: [
      { name: 'Projects', path: '/projects', icon: Briefcase },
      { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    ]
  },
  { name: 'Automation', path: '/automation', icon: Zap },
  { name: 'Integrations', path: '/integrations', icon: Plug },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Help', path: '/help', icon: HelpCircle },
];

export const Sidebar: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Sales', 'Products & Inventory']);
  const location = useLocation();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isParentActive = (children?: NavItem[]) => {
    if (!children) return false;
    return children.some(child => isActive(child.path));
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const itemIsActive = isActive(item.path) || isParentActive(item.children);

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              itemIsActive
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <item.icon className="w-5 h-5 mr-3" />
              {!collapsed && <span>{item.name}</span>}
            </div>
            {!collapsed && (
              isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {!collapsed && isExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children?.map(child => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.name}
        to={item.path!}
        className={({ isActive }) =>
          `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isActive
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`
        }
      >
        <item.icon className="w-5 h-5 mr-3" />
        {!collapsed && <span>{item.name}</span>}
      </NavLink>
    );
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900">BMS</h1>
                <p className="text-xs text-gray-500">Business Management</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
          {navigation.map(item => renderNavItem(item))}
        </nav>
      </div>
    </div>
  );
};