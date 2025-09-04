import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, TrendingDown, Package, RefreshCw } from 'lucide-react';

interface StockItem {
  id: string;
  sku: string;
  product_name: string;
  branch: string;
  warehouse: string;
  bin: string;
  qty_on_hand: number;
  qty_reserved: number;
  qty_available: number;
  reorder_point: number;
  last_movement: string;
  status: 'good' | 'low' | 'critical' | 'out';
}

const sampleStock: StockItem[] = [
  {
    id: '1',
    sku: 'SKU-001',
    product_name: 'Wireless Bluetooth Headphones',
    branch: 'Main Branch',
    warehouse: 'WH-001',
    bin: 'A-01-01',
    qty_on_hand: 150,
    qty_reserved: 25,
    qty_available: 125,
    reorder_point: 50,
    last_movement: '2025-01-14',
    status: 'good'
  },
  {
    id: '2',
    sku: 'SKU-002',
    product_name: 'Organic Coffee Beans',
    branch: 'Downtown',
    warehouse: 'WH-002',
    bin: 'B-02-03',
    qty_on_hand: 15,
    qty_reserved: 5,
    qty_available: 10,
    reorder_point: 25,
    last_movement: '2025-01-13',
    status: 'low'
  },
  {
    id: '3',
    sku: 'SKU-003',
    product_name: 'Cotton T-Shirt',
    branch: 'Main Branch',
    warehouse: 'WH-001',
    bin: 'C-01-05',
    qty_on_hand: 5,
    qty_reserved: 3,
    qty_available: 2,
    reorder_point: 20,
    last_movement: '2025-01-12',
    status: 'critical'
  },
  {
    id: '4',
    sku: 'SKU-004',
    product_name: 'Stainless Steel Water Bottle',
    branch: 'Uptown',
    warehouse: 'WH-003',
    bin: 'A-03-02',
    qty_on_hand: 0,
    qty_reserved: 0,
    qty_available: 0,
    reorder_point: 15,
    last_movement: '2025-01-10',
    status: 'out'
  }
];

const getStatusIcon = (status: StockItem['status']) => {
  switch (status) {
    case 'critical':
    case 'out':
      return AlertTriangle;
    case 'low':
      return TrendingDown;
    default:
      return Package;
  }
};

const getStatusColor = (status: StockItem['status']) => {
  switch (status) {
    case 'good':
      return 'bg-green-100 text-green-800';
    case 'low':
      return 'bg-yellow-100 text-yellow-800';
    case 'critical':
      return 'bg-orange-100 text-orange-800';
    case 'out':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const StockLevels: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const branches = ['All', 'Main Branch', 'Downtown', 'Uptown'];
  const statuses = ['All', 'Good', 'Low', 'Critical', 'Out of Stock'];

  const filteredStock = sampleStock.filter(item => {
    const matchesSearch = item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = !branchFilter || branchFilter === 'All' || item.branch === branchFilter;
    const matchesStatus = !statusFilter || statusFilter === 'All' || 
                         item.status === statusFilter.toLowerCase().replace(' ', '');
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const stockSummary = {
    total_items: sampleStock.length,
    low_stock: sampleStock.filter(item => item.status === 'low').length,
    critical: sampleStock.filter(item => item.status === 'critical').length,
    out_of_stock: sampleStock.filter(item => item.status === 'out').length,
    total_value: sampleStock.reduce((sum, item) => sum + (item.qty_on_hand * 25), 0) // Estimated value
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Levels</h1>
          <p className="text-gray-600">Monitor inventory levels across all locations</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Sync Stock</span>
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Stock Adjustment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stockSummary.total_items}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{stockSummary.low_stock}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-orange-600">{stockSummary.critical}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stockSummary.out_of_stock}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-green-600">${stockSummary.total_value.toLocaleString()}</p>
            </div>
            <Package className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by SKU or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {branches.map(branch => (
              <option key={branch} value={branch === 'All' ? '' : branch}>
                {branch}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status === 'All' ? '' : status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Product</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Location</th>
                <th className="text-right py-4 px-6 font-medium text-gray-900">On Hand</th>
                <th className="text-right py-4 px-6 font-medium text-gray-900">Reserved</th>
                <th className="text-right py-4 px-6 font-medium text-gray-900">Available</th>
                <th className="text-right py-4 px-6 font-medium text-gray-900">Reorder Point</th>
                <th className="text-center py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Last Movement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStock.map((item) => {
                const StatusIcon = getStatusIcon(item.status);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-500 font-mono">{item.sku}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.branch}</p>
                        <p className="text-xs text-gray-500">{item.warehouse} • {item.bin}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-gray-900">{item.qty_on_hand}</td>
                    <td className="py-4 px-6 text-right text-orange-600">{item.qty_reserved}</td>
                    <td className="py-4 px-6 text-right font-medium text-gray-900">{item.qty_available}</td>
                    <td className="py-4 px-6 text-right text-gray-600">{item.reorder_point}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <StatusIcon className="w-4 h-4" />
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {new Date(item.last_movement).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};