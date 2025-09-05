import React, { useState } from 'react';
import { Menu, Search, Bell, User, ChevronDown, Building2, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBranches } from '../../hooks/useDatabase';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, signOut, currentBranch, setCurrentBranch } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBranchSelector, setShowBranchSelector] = useState(false);

  const { data: branches = [] } = useBranches();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowBranchSelector(!showBranchSelector)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Building2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{currentBranch?.name || 'Select Branch'}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showBranchSelector && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 px-2 py-1">Select Branch</div>
                  {branches.map(branch => (
                    <button
                      key={branch.id}
                      onClick={() => {
                        setCurrentBranch(branch);
                        setShowBranchSelector(false);
                      }}
                      className={`w-full text-left px-2 py-2 rounded-md hover:bg-gray-50 transition-colors ${
                        currentBranch?.id === branch.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="font-medium">{branch.name}</div>
                      <div className="text-xs text-gray-500">{branch.city}</div>
                    </button>
                  ))}
                  <hr className="my-2" />
                  <button className="w-full text-left px-2 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                    All Branches (Consolidated)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <div className="px-2 py-1 text-sm text-gray-500">
                    {user?.user_metadata?.full_name || user?.email}
                  </div>
                  <hr className="my-2" />
                  <button
                    onClick={signOut}
                    className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};