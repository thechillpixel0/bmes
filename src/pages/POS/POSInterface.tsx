import React, { useState } from 'react';
import { Search, ShoppingCart, CreditCard, DollarSign, Percent, Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

const sampleProducts: Product[] = [
  { id: '1', sku: 'SKU-001', name: 'Wireless Headphones', price: 89.99, stock: 150, category: 'Electronics' },
  { id: '2', sku: 'SKU-002', name: 'Coffee Beans', price: 24.99, stock: 75, category: 'Food' },
  { id: '3', sku: 'SKU-003', name: 'Cotton T-Shirt', price: 19.99, stock: 200, category: 'Apparel' },
  { id: '4', sku: 'SKU-004', name: 'Water Bottle', price: 29.99, stock: 5, category: 'Home' },
];

export const POSInterface: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price
      }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity, total: quantity * item.price }
          : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = subtotal * (discount / 100);
  const tax = (subtotal - discountAmount) * 0.08; // 8% tax
  const total = subtotal - discountAmount + tax;

  const filteredProducts = sampleProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Simulate checkout process
    alert(`Order completed! Total: $${total.toFixed(2)}`);
    setCart([]);
    setDiscount(0);
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Products Section */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Point of Sale</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products or scan barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all duration-200 text-left"
            >
              <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
              <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-indigo-600">${product.price}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product.stock > 10 ? 'bg-green-100 text-green-600' :
                  product.stock > 0 ? 'bg-orange-100 text-orange-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {product.stock} left
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Cart ({cart.length})</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Cart is empty</p>
              <p className="text-sm text-gray-400">Add products to start a sale</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.sku}</p>
                    <p className="text-sm font-medium text-indigo-600">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Discount */}
            <div className="flex items-center space-x-2">
              <Percent className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                placeholder="Discount %"
                value={discount || ''}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount ({discount}%):</span>
                  <span className="font-medium text-red-600">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%):</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'cash', label: 'Cash', icon: DollarSign },
                  { value: 'card', label: 'Card', icon: CreditCard },
                  { value: 'digital', label: 'Digital', icon: ShoppingCart }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setPaymentMethod(value as any)}
                    className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center space-y-1 ${
                      paymentMethod === value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
            >
              Complete Sale - ${total.toFixed(2)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};