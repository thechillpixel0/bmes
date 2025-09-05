import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, Trash2, Search } from 'lucide-react';
import { useCustomers, useProducts, useBranches, useCreateOrder } from '../../hooks/useDatabase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/UI/Button';
import toast from 'react-hot-toast';

const orderSchema = z.object({
  customer_id: z.string().min(1, 'Customer is required'),
  branch_id: z.string().min(1, 'Branch is required'),
  notes: z.string().optional(),
  lines: z.array(z.object({
    product_id: z.string().min(1, 'Product is required'),
    qty: z.number().min(1, 'Quantity must be at least 1'),
    unit_price: z.number().min(0, 'Price must be positive'),
    discount_pct: z.number().min(0).max(100, 'Discount must be between 0 and 100').default(0),
  })).min(1, 'Order must have at least one line item'),
});

type OrderFormData = z.infer<typeof orderSchema>;

export const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const { currentBranch } = useAuth();
  const [productSearch, setProductSearch] = useState('');

  const { data: customers = [] } = useCustomers({ active: true });
  const { data: branches = [] } = useBranches();
  const { data: products = [] } = useProducts({ search: productSearch, active: true });
  const createOrder = useCreateOrder();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer_id: '',
      branch_id: currentBranch?.id || '',
      notes: '',
      lines: [{ product_id: '', qty: 1, unit_price: 0, discount_pct: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lines'
  });

  const watchedLines = form.watch('lines');

  const calculateLineTotal = (qty: number, unitPrice: number, discountPct: number) => {
    return qty * unitPrice * (1 - discountPct / 100);
  };

  const calculateOrderTotal = () => {
    return watchedLines.reduce((sum, line) => 
      sum + calculateLineTotal(line.qty || 0, line.unit_price || 0, line.discount_pct || 0), 0
    );
  };

  const onSubmit = async (data: OrderFormData) => {
    try {
      await createOrder.mutateAsync(data);
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      form.setValue(`lines.${index}.product_id`, productId);
      form.setValue(`lines.${index}.unit_price`, product.sale_price);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Sales Order</h1>
          <p className="text-gray-600">Create a new sales order for your customer</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer *</label>
              <select
                {...form.register('customer_id')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.customer_id && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.customer_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch *</label>
              <select
                {...form.register('branch_id')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.branch_id && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.branch_id.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                {...form.register('notes')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Order notes (optional)"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Order Lines</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ product_id: '', qty: 1, unit_price: 0, discount_pct: 0 })}
              icon={Plus}
            >
              Add Line
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-lg">
                <div className="col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <select
                    {...form.register(`lines.${index}.product_id`)}
                    onChange={(e) => handleProductSelect(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                  <input
                    {...form.register(`lines.${index}.qty`, { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                  <input
                    {...form.register(`lines.${index}.unit_price`, { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                  <input
                    {...form.register(`lines.${index}.discount_pct`, { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                  <div className="px-3 py-2 bg-gray-100 rounded-lg text-right font-medium">
                    ${calculateLineTotal(
                      watchedLines[index]?.qty || 0,
                      watchedLines[index]?.unit_price || 0,
                      watchedLines[index]?.discount_pct || 0
                    ).toFixed(2)}
                  </div>
                </div>

                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    icon={Trash2}
                    disabled={fields.length === 1}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${calculateOrderTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%):</span>
                  <span className="font-medium">${(calculateOrderTotal() * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span>${(calculateOrderTotal() * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/orders')}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createOrder.isPending}
            className="flex-1"
          >
            Create Order
          </Button>
        </div>
      </form>
    </div>
  );
};