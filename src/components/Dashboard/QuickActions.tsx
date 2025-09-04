import React from 'react';
import { Plus, ShoppingCart, CreditCard, Package, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    name: 'Create Invoice',
    description: 'Generate new invoice',
    icon: FileText,
    path: '/invoices/new',
    color: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
  },
  {
    name: 'POS Sale',
    description: 'Start point of sale',
    icon: CreditCard,
    path: '/pos',
    color: 'bg-green-50 text-green-600 hover:bg-green-100'
  },
  {
    name: 'Add Product',
    description: 'Create new product',
    icon: Package,
    path: '/products/new',
    color: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
  },
  {
    name: 'New Order',
    description: 'Create sales order',
    icon: ShoppingCart,
    path: '/orders/new',
    color: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
  }
];

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.name}
            onClick={() => navigate(action.path)}
            className={`p-4 rounded-lg transition-all duration-200 text-left group ${action.color}`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{action.name}</p>
                <p className="text-xs opacity-75">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};