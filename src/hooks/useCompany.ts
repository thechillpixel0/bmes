import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Company, Branch } from '../types';

export const useCompany = () => {
  return useQuery({
    queryKey: ['company'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .single();

      if (error) throw error;
      return data as Company;
    },
  });
};

export const useBranches = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      return data as Branch[];
    },
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (branchData: Omit<Branch, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('branches')
        .insert(branchData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
};