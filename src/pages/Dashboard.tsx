import React from 'react';
import { DollarSign, TrendingUp, Users, Package, BarChart3, Calendar } from 'lucide-react';
import { KPICard } from '../components/Dashboard/KPICard';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { QuickActions } from '../components/Dashboard/QuickActions';
import { AlertsCard } from '../components/Dashboard/AlertsCard';
import { useDashboardKPIs, useRecentActivity } from '../hooks/useDatabase';
import { useAuth } from '../contexts/AuthContext';
import { useDashboardKPIs, useRecentActivity } from '../hooks/useDatabase';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const salesData = [
  { name: 'Jan', sales: 4000, orders: 24 },
  { name: 'Feb', sales: 3000, orders: 18 },
  { name: 'Mar', sales: 5000, orders: 32 },
  { name: 'Apr', sales: 4500, orders: 28 },
  { name: 'May', sales: 6000, orders: 38 },
  { name: 'Jun', sales: 5500, orders: 35 },
];

export const Dashboard: React.FC = () => {
  const { company, currentBranch } = useAuth();
  const { data: kpis, isLoading: kpisLoading } = useDashboardKPIs();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();

  if (kpisLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const { company, currentBranch } = useAuth();
  const { data: kpis, isLoading: kpisLoading } = useDashboardKPIs();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();

  if (kpisLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with {company?.name || 'your business'}.
          </p>
          {currentBranch && (
            <p className="text-sm text-indigo-600">Current branch: {currentBranch.name}</p>
          )}
            Welcome back! Here's what\'s happening with {company?.name || 'your business'}.
          </p>
          {currentBranch && (
            <p className="text-sm text-indigo-600">Current branch: {currentBranch.name}</p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>This month</option>
            <option>This quarter</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          title="Revenue MTD"
          value={`$${kpis?.revenue_mtd?.toLocaleString() || '0'}`}
          change="+12.5% from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <KPICard
          title="Accounts Receivable"
          value={`$${kpis?.accounts_receivable?.toLocaleString() || '0'}`}
          change="+5.2% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <KPICard
          title="Accounts Payable"
          value={`$${kpis?.accounts_payable?.toLocaleString() || '0'}`}
          change="-8.1% from last month"
          changeType="positive"
          icon={BarChart3}
        />
        <KPICard
          title="Cash Balance"
          value={`$${kpis?.cash_balance?.toLocaleString() || '0'}`}
          change="+15.3% from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <KPICard
          title="Inventory Value"
          value={`$${kpis?.inventory_value?.toLocaleString() || '0'}`}
          change="+2.1% from last month"
          changeType="positive"
          icon={Package}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#4f46e5" 
                strokeWidth={3}
                dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActions />
        <RecentActivity />
        <AlertsCard />
      </div>
    </div>
  );
};