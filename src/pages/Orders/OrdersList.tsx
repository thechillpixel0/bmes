import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Truck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  order_number: string;
  customer: string;
  branch: string;
  total: number;
  status: 'draft' | 'confirmed' | 'reserved' | 'picking' | 'shipped' | 'delivered' | 'invoiced';
  order_date: string;
  items_count: number;
}

const sampleOrders: Order[] = [
  {
    id: '1',
    order_number: 'SO-001234',
    customer: 'Acme Corporation',
    branch: 'Main Branch',
    total: 1250.00,
    status: 'confirmed',
    order_date: '2025-01-15',
    items_count: 5
  },
  {
    id: '2',
    order_number: 'SO-001235',
    customer: 'Tech Solutions Inc',
    branch: 'Downtown',
    total: 850.00,
    status: 'shipped',
    order_date: '2025-01-14',
    items_count: 3
  },
  {
    id: '3',
    order_number: 'SO-001236',
    customer: 'Global Enterprises',
    branch: 'Main Branch',
    total: 2100.00,
    status: 'picking',
    order_date: '2025-01-13',
    items_count: 8
  }
];

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'reserved':
      return 'bg-yellow-100 text-yellow-800';
    case 'picking':
      return 'bg-orange-100 text-orange-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'invoiced':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const OrdersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const filteredOrders = sampleOrders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-gray-600">Track and manage all your sales orders</p>
        </div>
        <button
          onClick={() => navigate('/orders/new')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Order</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="confirmed">Confirmed</option>
            <option value="reserved">Reserved</option>
            <option value="picking">Picking</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="invoiced">Invoiced</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Order</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Customer</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Branch</th>
                <th className="text-right py-4 px-6 font-medium text-gray-900">Total</th>
                <th className="text-center py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Date</th>
                <th className="text-center py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{order.order_number}</p>
                      <p className="text-sm text-gray-500">{order.items_count} items</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{order.customer}</td>
                  <td className="py-4 px-6 text-gray-600">{order.branch}</td>
                  <td className="py-4 px-6 text-right font-medium text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="View Order"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/orders/${order.id}/edit`)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {order.status === 'confirmed' && (
                        <button
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Ship Order"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <button
                          className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Create Invoice"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing 1 to {filteredOrders.length} of {filteredOrders.length} orders
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-white transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};