import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Edit, Trash2, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts, useUpdateProduct } from '../../hooks/useDatabase';
import { Modal } from '../../components/UI/Modal';
import { Button } from '../../components/UI/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const productSchema = z.object({
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().optional(),
  uom: z.string().min(1, 'Unit of measure is required'),
  cost: z.number().min(0, 'Cost must be positive'),
  sale_price: z.number().min(0, 'Sale price must be positive'),
  reorder_point: z.number().min(0, 'Reorder point must be positive'),
});

export const ProductsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const navigate = useNavigate();

  const { data: products = [], isLoading, refetch } = useProducts({
    search: searchTerm,
    active: true
  });
  const updateProduct = useUpdateProduct();

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: '',
      name: '',
      description: '',
      uom: 'Each',
      cost: 0,
      sale_price: 0,
      reorder_point: 0,
    }
  });

  const categories = ['All', 'Electronics', 'Food & Beverage', 'Apparel', 'Home & Garden'];

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || 
                           (product.category as any)?.name === selectedCategory;
    return matchesCategory;
  });

  const handleCreateProduct = async (data: any) => {
    try {
      await updateProduct.mutateAsync({
        id: editingProduct?.id || 'new',
        updates: {
          ...data,
          company_id: 'demo-company-id',
          category_id: 'cat-electronics', // Default category
        }
      });
      setShowCreateModal(false);
      setEditingProduct(null);
      form.reset();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    form.reset({
      sku: product.sku,
      name: product.name,
      description: product.description || '',
      uom: product.uom,
      cost: product.cost,
      sale_price: product.sale_price,
      reorder_point: product.reorder_point,
    });
    setShowCreateModal(true);
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
            onClick={() => setShowCreateModal(true)}
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
                        <BarChart3 className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 font-mono">{product.sku}</td>
                  <td className="py-4 px-6 text-gray-600">{(product.category as any)?.name || 'Uncategorized'}</td>
                  <td className="py-4 px-6 text-gray-600">{product.uom}</td>
                  <td className="py-4 px-6 text-right text-gray-900">${product.cost.toFixed(2)}</td>
                  <td className="py-4 px-6 text-right font-medium text-gray-900">${product.sale_price.toFixed(2)}</td>
                  <td className="py-4 px-6 text-right font-medium text-gray-900">-</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.is_active ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to deactivate this product?')) {
                            updateProduct.mutate({
                              id: product.id,
                              updates: { is_active: false }
                            });
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
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

      {/* Create/Edit Product Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingProduct(null);
          form.reset();
        }}
        title={editingProduct ? 'Edit Product' : 'Create New Product'}
        size="lg"
      >
        <form onSubmit={form.handleSubmit(handleCreateProduct)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
              <input
                {...form.register('sku')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., SKU-001"
              />
              {form.formState.errors.sku && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.sku.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measure *</label>
              <select
                {...form.register('uom')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Each">Each</option>
                <option value="Kg">Kilogram</option>
                <option value="Lb">Pound</option>
                <option value="L">Liter</option>
                <option value="M">Meter</option>
                <option value="Box">Box</option>
                <option value="Pack">Pack</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                {...form.register('name')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter product name"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                {...form.register('description')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Product description (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price *</label>
              <input
                {...form.register('cost', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0.00"
              />
              {form.formState.errors.cost && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.cost.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price *</label>
              <input
                {...form.register('sale_price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0.00"
              />
              {form.formState.errors.sale_price && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.sale_price.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Point</label>
              <input
                {...form.register('reorder_point', { valueAsNumber: true })}
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setEditingProduct(null);
                form.reset();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={updateProduct.isPending}
              className="flex-1"
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};