import React from 'react';
import { AlertTriangle, Clock, TrendingDown, UserX } from 'lucide-react';
import { useStockLevels } from '../../hooks/useDatabase';

const getAlertIcon = (type: string) => {
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

const getAlertColor = (type: string) => {
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
  const { data: stockLevels = [] } = useStockLevels();

  // Generate alerts based on actual data
  const alerts = [];

  // Low stock alerts
  const lowStockItems = stockLevels.filter(item => 
    item.qty_available <= item.product.reorder_point && item.qty_available > 0
  );
  
  const outOfStockItems = stockLevels.filter(item => 
    item.qty_available <= 0
  );

  if (lowStockItems.length > 0) {
    alerts.push({
      id: 'low-stock',
      type: 'warning',
      title: 'Low Stock Alert',
      description: `${lowStockItems.length} products below reorder point`,
      action: 'View Inventory',
      actionPath: '/inventory/levels'
    });
  }

  if (outOfStockItems.length > 0) {
    alerts.push({
      id: 'out-of-stock',
      type: 'error',
      title: 'Out of Stock',
      description: `${outOfStockItems.length} products out of stock`,
      action: 'View Inventory',
      actionPath: '/inventory/levels'
    });
  }

  // Add some default alerts if no stock alerts
  if (alerts.length === 0) {
    alerts.push({
      id: 'system-ok',
      type: 'info',
      title: 'System Status',
      description: 'All systems operating normally',
      action: 'View Dashboard',
      actionPath: '/dashboard'
    });
  }

  return (
    <div>
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