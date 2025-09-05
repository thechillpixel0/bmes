import React, { useState } from 'react';
import { Plus, Search, MapPin, Phone, User, MoreHorizontal, Edit, Trash2, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBranches, useCreateBranch, useUpdateBranch } from '../../hooks/useDatabase';
import { Modal } from '../../components/UI/Modal';
import { Button } from '../../components/UI/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBranches, useCreateBranch, useUpdateBranch } from '../../hooks/useDatabase';
import { Modal } from '../../components/UI/Modal';
import { Button } from '../../components/UI/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const branchSchema = z.object({
  name: z.string().min(2, 'Branch name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  postal_code: z.string().min(3, 'Postal code must be at least 3 characters'),
  phone: z.string().min(10, 'Valid phone number required'),
});

export const BranchesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const navigate = useNavigate();

  const { data: branches = [], isLoading } = useBranches();
  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();

  const form = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      phone: '',
    }
  });

  const filteredBranches = branches.filter(branch =>
  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();

  const form = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      phone: '',
    }
  });

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.phone.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const handleCreateBranch = async (data: any) => {
    try {
      if (editingBranch) {
        await updateBranch.mutateAsync({
          id: editingBranch.id,
          updates: data
        });
      } else {
        await createBranch.mutateAsync({
          ...data,
          company_id: 'demo-company-id',
          active: true,
        });
      }
      setShowCreateModal(false);
      setEditingBranch(null);
      form.reset();
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  };

  const handleEditBranch = (branch: any) => {
    setEditingBranch(branch);
    form.reset({
      name: branch.name,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      postal_code: branch.postal_code,
      phone: branch.phone,
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

  const handleCreateBranch = async (data: any) => {
    try {
      if (editingBranch) {
        await updateBranch.mutateAsync({
          id: editingBranch.id,
          updates: data
        });
      } else {
        await createBranch.mutateAsync({
          ...data,
          company_id: 'demo-company-id',
          active: true,
        });
      }
      setShowCreateModal(false);
      setEditingBranch(null);
      form.reset();
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  };

  const handleEditBranch = (branch: any) => {
    setEditingBranch(branch);
    form.reset({
      name: branch.name,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      postal_code: branch.postal_code,
      phone: branch.phone,
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
          <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
          <p className="text-gray-600">Manage your business locations and operations</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Branch</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search branches by name, city, or manager..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{branch.city}, {branch.state}</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => handleEditBranch(branch)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{branch.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{branch.address}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Inventory Value</p>
                  <p className="font-semibold text-gray-900">$125,000</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sales MTD</p>
                  <p className="font-semibold text-green-600">$45,230</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                branch.active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {branch.active ? 'active' : 'inactive'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditBranch(branch);
                  }}
                  className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to deactivate this branch?')) {
                      updateBranch.mutate({
                        id: branch.id,
                        updates: { active: false }
                      });
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Branch Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingBranch(null);
          form.reset();
        }}
        title={editingBranch ? 'Edit Branch' : 'Add New Branch'}
      >
        <form onSubmit={form.handleSubmit(handleCreateBranch)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name *</label>
            <input
              {...form.register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter branch name"
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <textarea
              {...form.register('address')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
              placeholder="Enter full address"
            />
            {form.formState.errors.address && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.address.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                {...form.register('city')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="City"
              />
              {form.formState.errors.city && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.city.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input
                {...form.register('state')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="State"
              />
              {form.formState.errors.state && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.state.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
            <input
              {...form.register('postal_code')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="12345"
            />
            {form.formState.errors.postal_code && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.postal_code.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              {...form.register('phone')}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
            {form.formState.errors.phone && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
            )}
          </div>
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setEditingBranch(null);
                form.reset();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createBranch.isPending || updateBranch.isPending}
              className="flex-1"
            >
              {editingBranch ? 'Update Branch' : 'Create Branch'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};