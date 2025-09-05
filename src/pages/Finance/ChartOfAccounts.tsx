import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, ChevronRight, ChevronDown, FolderOpen, Folder } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

const useChartOfAccounts = () => {
  return useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chart_of_accounts')
        .select('*')
        .order('account_code');

      if (error) throw error;
      return data || [];
    },
  });
};

const getTypeColor = (type: Account['type']) => {
  switch (type) {
    case 'asset':
      return 'bg-blue-100 text-blue-800';
    case 'liability':
      return 'bg-red-100 text-red-800';
    case 'equity':
      return 'bg-purple-100 text-purple-800';
    case 'income':
      return 'bg-green-100 text-green-800';
    case 'expense':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ChartOfAccounts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAccounts, setExpandedAccounts] = useState<string[]>(['acc-1000', 'acc-1100', 'acc-2000', 'acc-2100', 'acc-5000']);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: accounts = [], isLoading } = useChartOfAccounts();

  const toggleExpanded = (accountId: string) => {
    setExpandedAccounts(prev =>
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  // Build hierarchical structure
  const buildAccountTree = (accounts: any[]) => {
    const accountMap = new Map();
    const rootAccounts: any[] = [];

    // First pass: create map of all accounts
    accounts.forEach(account => {
      accountMap.set(account.id, { ...account, children: [] });
    });

    // Second pass: build hierarchy
    accounts.forEach(account => {
      if (account.parent_id) {
        const parent = accountMap.get(account.parent_id);
        if (parent) {
          parent.children.push(accountMap.get(account.id));
        }
      } else {
        rootAccounts.push(accountMap.get(account.id));
      }
    });

    return rootAccounts;
  };

  const renderAccount = (account: any, level = 0) => {
    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = expandedAccounts.includes(account.id);
    const paddingLeft = level * 24;

    // Calculate balance (for demo, using static values)
    const balance = account.account_code === '1110' ? 32890 :
                   account.account_code === '1120' ? 18450 :
                   account.account_code === '1130' ? 89560 :
                   account.account_code === '2110' ? 12340 :
                   0;

    return (
      <React.Fragment key={account.id}>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="py-3 px-6" style={{ paddingLeft: `${paddingLeft + 24}px` }}>
            <div className="flex items-center space-x-2">
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(account.id)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              ) : (
                <div className="w-6 h-6" />
              )}
              {hasChildren ? (
                <FolderOpen className="w-4 h-4 text-gray-400" />
              ) : (
                <Folder className="w-4 h-4 text-gray-400" />
              )}
              <span className="font-mono text-sm text-gray-600">{account.code}</span>
              <span className="font-medium text-gray-900">{account.account_name}</span>
            </div>
          </td>
          <td className="py-3 px-6">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(account.account_type)}`}>
              {account.account_type}
            </span>
          </td>
          <td className="py-3 px-6 text-right font-medium text-gray-900">
            ${balance.toLocaleString()}
          </td>
          <td className="py-3 px-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              {!hasChildren && (
                <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </td>
        </tr>
        {hasChildren && isExpanded && account.children?.map(child => renderAccount(child, level + 1))}
      </React.Fragment>
    );
  };

  const accountTree = buildAccountTree(accounts);

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
          <h1 className="text-2xl font-bold text-gray-900">Chart of Accounts</h1>
          <p className="text-gray-600">Manage your accounting structure and account hierarchy</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Import COA
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search accounts by code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-gray-900">Account</th>
              <th className="text-left py-4 px-6 font-medium text-gray-900">Type</th>
              <th className="text-right py-4 px-6 font-medium text-gray-900">Balance</th>
              <th className="text-center py-4 px-6 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {accountTree.map(account => renderAccount(account))}
          </tbody>
        </table>
      </div>

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Account</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Code</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 1140"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Prepaid Expenses"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="">Select Type</option>
                  <option value="asset">Asset</option>
                  <option value="liability">Liability</option>
                  <option value="equity">Equity</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Account</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="">None (Top Level)</option>
                  <option value="2">1100 - Current Assets</option>
                  <option value="6">1200 - Fixed Assets</option>
                  <option value="10">2100 - Current Liabilities</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};