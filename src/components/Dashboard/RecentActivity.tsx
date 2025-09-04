import React from 'react';
import { Clock, ShoppingCart, CreditCard, Package, Users } from 'lucide-react';
import { useRecentActivity } from '../../hooks/useDatabase';

const getActivityIcon = (type: string) => {
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

const getActivityColor = (type: string) => {
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
  const { data: recentOrders = [], isLoading } = useRecentActivity();

  // Transform orders into activity format
  const activities = recentOrders.map(order => ({
    id: order.id,
    type: 'order',
    title: `Order ${order.order_number}`,
    description: `${order.customer?.name} - $${order.total_amount?.toFixed(2)}`,
    time: new Date(order.created_at).toLocaleDateString(),
    user: 'System'
  }));

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

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
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
};