import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Edit, Trash2, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  uom: string;
  cost: number;
  sale_price: number;
  stock: number;
  status: 'active' | 'inactive';
}

const sampleProducts: Product[] = [
  {
    id: '1',
    sku: 'SKU-001',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    uom: 'Each',
    cost: 45.00,
    sale_price: 89.99,
    stock: 150,
    status: 'active'
  },
  {
    id: '2',
    sku: 'SKU-002',
    name: 'Organic Coffee Beans',
    category: 'Food & Beverage',
    uom: 'Kg',
    cost: 12.50,
    sale_price: 24.99,
    stock: 75,
    status: 'active'
  },
  {
    id: '3',
    sku: 'SKU-003',
    name: 'Cotton T-Shirt',
    category: 'Apparel',
    uom: 'Each',
    cost: 8.00,
    sale_price: 19.99,
    stock: 200,
    status: 'active'
  },
  {
    id: '4',
    sku: 'SKU-004',
    name: 'Stainless Steel Water Bottle',
    category: 'Home & Garden',
    uom: 'Each',
    cost: 15.00,
    sale_price: 29.99,
    stock: 5,
    status: 'active'
  }
];

export const ProductsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const categories = ['All', 'Electronics', 'Food & Beverage', 'Apparel', 'Home & Garden'];

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog and inventory</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => navigate('/products/new')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category === 'All' ? '' : category}>
                {category}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Level</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All</option>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All</option>
                  <option>$0 - $25</option>
                  <option>$25 - $100</option>
                  <option>$100+</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Product</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">SKU</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Category</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">UOM</th>
                <th className="text-right py-4 px-6 font-medium text-gray-900">Cost</th>
                <th className="text-right py-4 px-6 font-medium text-gray-900">Sale Price</th>
                <th className="text-right py-4 px-6 font-medium text-gray-900">Stock</th>
                <th className="text-center py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-center py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 font-mono">{product.sku}</td>
                  <td className="py-4 px-6 text-gray-600">{product.category}</td>
                  <td className="py-4 px-6 text-gray-600">{product.uom}</td>
                  <td className="py-4 px-6 text-right text-gray-900">${product.cost.toFixed(2)}</td>
                  <td className="py-4 px-6 text-right font-medium text-gray-900">${product.sale_price.toFixed(2)}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`font-medium ${
                      product.stock < 10 ? 'text-red-600' : 
                      product.stock < 50 ? 'text-orange-600' : 
                      'text-green-600'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
            Showing 1 to {filteredProducts.length} of {filteredProducts.length} products
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