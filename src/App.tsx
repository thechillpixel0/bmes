import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SignInForm } from './components/Auth/SignInForm';
import { SignUpForm } from './components/Auth/SignUpForm';
import { Dashboard } from './pages/Dashboard';
import { ProductsList } from './pages/Products/ProductsList';
import { POSInterface } from './pages/POS/POSInterface';
import { BranchesList } from './pages/Branches/BranchesList';
import { OrdersList } from './pages/Orders/OrdersList';
import { StockLevels } from './pages/Inventory/StockLevels';
import { ChartOfAccounts } from './pages/Finance/ChartOfAccounts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/signin" element={<Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="branches" element={<BranchesList />} />
        <Route path="products" element={<ProductsList />} />
        <Route path="pos" element={<POSInterface />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="inventory/levels" element={<StockLevels />} />
        <Route path="finance/coa" element={<ChartOfAccounts />} />
        
        {/* Placeholder routes for other modules */}
        <Route path="quotes" element={<div className="p-6"><h1 className="text-2xl font-bold">Quotes - Coming Soon</h1></div>} />
        <Route path="invoices" element={<div className="p-6"><h1 className="text-2xl font-bold">Invoices - Coming Soon</h1></div>} />
        <Route path="returns" element={<div className="p-6"><h1 className="text-2xl font-bold">Returns - Coming Soon</h1></div>} />
        <Route path="inventory/transfers" element={<div className="p-6"><h1 className="text-2xl font-bold">Inventory Transfers - Coming Soon</h1></div>} />
        <Route path="inventory/counts" element={<div className="p-6"><h1 className="text-2xl font-bold">Cycle Counts - Coming Soon</h1></div>} />
        <Route path="suppliers" element={<div className="p-6"><h1 className="text-2xl font-bold">Suppliers - Coming Soon</h1></div>} />
        <Route path="purchase-orders" element={<div className="p-6"><h1 className="text-2xl font-bold">Purchase Orders - Coming Soon</h1></div>} />
        <Route path="grn" element={<div className="p-6"><h1 className="text-2xl font-bold">Goods Receipt - Coming Soon</h1></div>} />
        <Route path="bills" element={<div className="p-6"><h1 className="text-2xl font-bold">Bills - Coming Soon</h1></div>} />
        <Route path="finance/journals" element={<div className="p-6"><h1 className="text-2xl font-bold">Journal Entries - Coming Soon</h1></div>} />
        <Route path="finance/reconciliation" element={<div className="p-6"><h1 className="text-2xl font-bold">Bank Reconciliation - Coming Soon</h1></div>} />
        <Route path="finance/reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Financial Reports - Coming Soon</h1></div>} />
        <Route path="crm" element={<div className="p-6"><h1 className="text-2xl font-bold">CRM - Coming Soon</h1></div>} />
        <Route path="hr/employees" element={<div className="p-6"><h1 className="text-2xl font-bold">Employees - Coming Soon</h1></div>} />
        <Route path="hr/attendance" element={<div className="p-6"><h1 className="text-2xl font-bold">Attendance - Coming Soon</h1></div>} />
        <Route path="hr/payroll" element={<div className="p-6"><h1 className="text-2xl font-bold">Payroll - Coming Soon</h1></div>} />
        <Route path="projects" element={<div className="p-6"><h1 className="text-2xl font-bold">Projects - Coming Soon</h1></div>} />
        <Route path="tasks" element={<div className="p-6"><h1 className="text-2xl font-bold">Tasks - Coming Soon</h1></div>} />
        <Route path="automation" element={<div className="p-6"><h1 className="text-2xl font-bold">Automation - Coming Soon</h1></div>} />
        <Route path="integrations" element={<div className="p-6"><h1 className="text-2xl font-bold">Integrations - Coming Soon</h1></div>} />
        <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
        <Route path="help" element={<div className="p-6"><h1 className="text-2xl font-bold">Help & Documentation - Coming Soon</h1></div>} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;