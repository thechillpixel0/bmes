import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, TrendingDown, Package, RefreshCw } from 'lucide-react';
import { useStockLevels, useBranches, useStockAdjustment } from '../../hooks/useDatabase';
import { Modal } from '../../components/UI/Modal';
import { Button } from '../../components/UI/Button';
import { useForm } from 'react-hook-form';

const getStockStatus = (qtyAvailable: number, reorderPoint: number) => {
  if (qtyAvailable <= 0) return 'out';
  if (qtyAvailable <= reorderPoint * 0.5) return 'critical';
  if (qtyAvailable <= reorderPoint) return 'low';
  return 'good';
};

const getStatusIcon = (status: string) => {
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

const getStatusColor = (status: string) => {
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
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustingStock, setAdjustingStock] = useState<any>(null);

  const { data: stockLevels = [], isLoading, refetch } = useStockLevels({
    branch_id: branchFilter || undefined
  });
  const { data: branches = [] } = useBranches();
  const stockAdjustment = useStockAdjustment();

  const adjustForm = useForm({
    defaultValues: {
      adjustment_type: 'adjustment',
      qty_change: 0,
      notes: '',
    }
  });

  const statuses = ['All', 'Good', 'Low', 'Critical', 'Out of Stock'];

  const filteredStock = stockLevels.filter(item => {
    const matchesSearch = item.product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = !branchFilter || item.branch.id === branchFilter;
    const status = getStockStatus(item.qty_available, item.product.reorder_point);
    const matchesStatus = !statusFilter || statusFilter === 'All' || 
                         status === statusFilter.toLowerCase().replace(' ', '');
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const stockSummary = {
    total_items: stockLevels.length,
    low_stock: stockLevels.filter(item => getStockStatus(item.qty_available, item.product.reorder_point) === 'low').length,
    critical: stockLevels.filter(item => getStockStatus(item.qty_available, item.product.reorder_point) === 'critical').length,
    out_of_stock: stockLevels.filter(item => getStockStatus(item.qty_available, item.product.reorder_point) === 'out').length,
    total_value: stockLevels.reduce((sum, item) => sum + (item.qty_on_hand * item.product.cost), 0)
  };

  const handleStockAdjustment = (stockItem: any) => {
    setAdjustingStock(stockItem);
    adjustForm.reset({
      adjustment_type: 'adjustment',
      qty_change: 0,
      notes: '',
    });
    setShowAdjustModal(true);
  };

  const handleAdjustSubmit = async (data: any) => {
    if (!adjustingStock) return;

    try {
      await stockAdjustment.mutateAsync({
        productId: adjustingStock.product_id,
        branchId: adjustingStock.branch_id,
        qtyChange: data.qty_change,
        movementType: data.adjustment_type,
        notes: data.notes,
      });
      setShowAdjustModal(false);
      setAdjustingStock(null);
      adjustForm.reset();
    } catch (error) {
      console.error('Error adjusting stock:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

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
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
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

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={showAdjustModal}
        onClose={() => {
          setShowAdjustModal(false);
          setAdjustingStock(null);
          adjustForm.reset();
        }}
        title="Adjust Stock Level"
      >
        {adjustingStock && (
          <form onSubmit={adjustForm.handleSubmit(handleAdjustSubmit)} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">{adjustingStock.product.name}</h4>
              <p className="text-sm text-gray-600">SKU: {adjustingStock.product.sku}</p>
              <p className="text-sm text-gray-600">Current Stock: {adjustingStock.qty_on_hand}</p>
              <p className="text-sm text-gray-600">Available: {adjustingStock.qty_available}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Type</label>
              <select
                {...adjustForm.register('adjustment_type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="adjustment">Stock Adjustment</option>
                <option value="in">Stock In</option>
                <option value="out">Stock Out</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Change</label>
              <input
                {...adjustForm.register('qty_change', { valueAsNumber: true })}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter positive or negative number"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use positive numbers to increase stock, negative to decrease
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                {...adjustForm.register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Reason for adjustment (optional)"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAdjustModal(false);
                  setAdjustingStock(null);
                  adjustForm.reset();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={stockAdjustment.isPending}
                className="flex-1"
              >
                Adjust Stock
              </Button>
            </div>
          </form>
        )}
      </Modal>

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
            <option value="">All Branches</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
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
                const status = getStockStatus(item.qty_available, item.product.reorder_point);
                const StatusIcon = getStatusIcon(status);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-500 font-mono">{item.sku}</p>
                      </div>
                    </td>
                          <p className="font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-500 font-mono">{item.product.sku}</p>
                        <p className="text-sm font-medium text-gray-900">{item.branch.name}</p>
                        <p className="text-xs text-gray-500">{item.warehouse_code || 'MAIN'} • {item.bin_location || 'A-01-01'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-gray-900">{item.qty_on_hand}</td>
                    <td className="py-4 px-6 text-right text-orange-600">{item.qty_reserved}</td>
                    <td className="py-4 px-6 text-right font-medium text-gray-900">{item.qty_available}</td>
                    <td className="py-4 px-6 text-right text-gray-600">{item.product.reorder_point}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <StatusIcon className="w-4 h-4" />
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                          {status}
                        </span>
                        <button
                          onClick={() => handleStockAdjustment(item)}
                          className="ml-2 p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Adjust Stock"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {new Date(item.last_movement_date).toLocaleDateString()}
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