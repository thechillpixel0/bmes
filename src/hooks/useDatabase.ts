import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  companyService, 
  branchService, 
  productService, 
  customerService, 
  stockService, 
  orderService,
  dashboardService 
} from '../lib/database';
import { Product, Customer, Branch, SalesOrder } from '../types';
import toast from 'react-hot-toast';

// Company hooks
export const useCompany = () => {
  return useQuery({
    queryKey: ['company'],
    queryFn: companyService.getCurrent,
  });
};

// Branch hooks
export const useBranches = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: branchService.getAll,
  });
};

export const useBranch = (id: string) => {
  return useQuery({
    queryKey: ['branch', id],
    queryFn: () => branchService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: branchService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create branch');
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Branch> }) =>
      branchService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update branch');
    },
  });
};

// Product hooks
export const useProducts = (filters?: { search?: string; category_id?: string; active?: boolean }) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAll(filters),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      productService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
};

// Customer hooks
export const useCustomers = (filters?: { search?: string; active?: boolean }) => {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => customerService.getAll(filters),
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create customer');
    },
  });
};

// Stock hooks
export const useStockLevels = (filters?: { branch_id?: string; product_id?: string }) => {
  return useQuery({
    queryKey: ['stock-levels', filters],
    queryFn: () => stockService.getStockLevels(filters),
  });
};

export const useStockAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      productId, 
      branchId, 
      qtyChange, 
      movementType, 
      notes 
    }: {
      productId: string;
      branchId: string;
      qtyChange: number;
      movementType: 'in' | 'out' | 'adjustment';
      notes?: string;
    }) => stockService.adjustStock(productId, branchId, qtyChange, movementType, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-levels'] });
      toast.success('Stock adjusted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to adjust stock');
    },
  });
};

// Order hooks
export const useOrders = (filters?: { status?: string; branch_id?: string; search?: string }) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => orderService.getAll(filters),
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['stock-levels'] });
      toast.success('Order created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create order');
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order status');
    },
  });
};

// Dashboard hooks
export const useDashboardKPIs = () => {
  return useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: dashboardService.getKPIs,
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: dashboardService.getRecentActivity,
  });
};