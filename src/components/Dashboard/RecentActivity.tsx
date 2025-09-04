import React from 'react';
import { Clock, ShoppingCart, CreditCard, Package, Users } from 'lucide-react';

interface Activity {
  id: string;
  type: 'order' | 'payment' | 'inventory' | 'user';
  title: string;
  description: string;
  time: string;
  user: string;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Order #SO-001234',
    description: 'Order created for $1,250.00',
    time: '2 minutes ago',
    user: 'John Smith'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    description: 'Invoice #INV-001230 paid $850.00',
    time: '15 minutes ago',
    user: 'System'
  },
  {
    id: '3',
    type: 'inventory',
    title: 'Stock Alert',
    description: 'Product SKU-123 below reorder point',
    time: '1 hour ago',
    user: 'System'
  },
  {
    id: '4',
    type: 'user',
    title: 'New User Added',
    description: 'Sarah Johnson added to Downtown branch',
    time: '2 hours ago',
    user: 'Admin'
  }
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'order':
      return ShoppingCart;
    case 'payment':
      return CreditCard;
    case 'inventory':
      return Package;
    case 'user':
      return Users;
    default:
      return Clock;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'order':
      return 'bg-blue-50 text-blue-600';
    case 'payment':
      return 'bg-green-50 text-green-600';
    case 'inventory':
      return 'bg-orange-50 text-orange-600';
    case 'user':
      return 'bg-purple-50 text-purple-600';
    default:
      return 'bg-gray-50 text-gray-600';
  }
};

export const RecentActivity: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-500">View All</button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);

          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-gray-500">{activity.time}</p>
                  <span className="text-xs text-gray-400">•</span>
                  <p className="text-xs text-gray-500">by {activity.user}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};