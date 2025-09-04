import React from 'react';
import { AlertTriangle, Clock, TrendingDown, UserX } from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  action?: string;
  actionPath?: string;
}

const alerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Low Stock Alert',
    description: '5 products below reorder point',
    action: 'View Products',
    actionPath: '/inventory/levels'
  },
  {
    id: '2',
    type: 'error',
    title: 'Overdue Invoices',
    description: '3 invoices overdue by 30+ days',
    action: 'View Invoices',
    actionPath: '/invoices?filter=overdue'
  },
  {
    id: '3',
    type: 'info',
    title: 'Pending Approvals',
    description: '2 purchase orders awaiting approval',
    action: 'Review',
    actionPath: '/purchase-orders?filter=pending'
  }
];

const getAlertIcon = (type: Alert['type']) => {
  switch (type) {
    case 'warning':
      return AlertTriangle;
    case 'error':
      return TrendingDown;
    case 'info':
      return Clock;
    default:
      return AlertTriangle;
  }
};

const getAlertColor = (type: Alert['type']) => {
  switch (type) {
    case 'warning':
      return 'bg-orange-50 border-orange-200 text-orange-800';
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'info':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

export const AlertsCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
          {alerts.length} active
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = getAlertIcon(alert.type);
          const colorClass = getAlertColor(alert.type);

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${colorClass}`}
            >
              <div className="flex items-start space-x-3">
                <Icon className="w-5 h-5 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{alert.title}</p>
                  <p className="text-sm opacity-75 mt-1">{alert.description}</p>
                  {alert.action && (
                    <button className="text-sm font-medium mt-2 hover:underline">
                      {alert.action} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};