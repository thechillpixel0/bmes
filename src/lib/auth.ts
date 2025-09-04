import { supabase } from './supabase';
import { User, Company, Branch } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    company_name?: string;
    industry?: string;
    branch_name?: string;
  };
}

export const authService = {
  async signUp(email: string, password: string, userData: {
    full_name: string;
    company_name: string;
    industry: string;
    company_type: string;
    employee_count: string;
    country: string;
    phone: string;
    branch_name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    branch_phone: string;
  }) {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name,
        }
      }
    });

    if (authError) return { data: authData, error: authError };

    // If user was created successfully, create company and branch data
    if (authData.user) {
      try {
        // Create company
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: userData.company_name,
            industry: userData.industry,
            company_type: userData.company_type,
            employee_count: userData.employee_count,
            country: userData.country,
            phone: userData.phone,
          })
          .select()
          .single();

        if (companyError) throw companyError;

        // Create main branch
        const { data: branch, error: branchError } = await supabase
          .from('branches')
          .insert({
            company_id: company.id,
            name: userData.branch_name,
            address: userData.address,
            city: userData.city,
            state: userData.state,
            postal_code: userData.postal_code,
            phone: userData.branch_phone,
          })
          .select()
          .single();

        if (branchError) throw branchError;

        // Create admin role
        const { data: role, error: roleError } = await supabase
          .from('roles')
          .insert({
            company_id: company.id,
            name: 'Administrator',
            permissions: ['*'],
            is_system: true,
          })
          .select()
          .single();

        if (roleError) throw roleError;

        // Create user profile
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            company_id: company.id,
            branch_id: branch.id,
            email: authData.user.email!,
            full_name: userData.full_name,
            role_id: role.id,
          });

        if (userError) throw userError;
      } catch (error) {
        // If there's an error creating company data, we should clean up the auth user
        console.error('Error creating company data:', error);
      }
    }

    return { data: authData, error: authError };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user as AuthUser | null;
  },

  async getUserProfile(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        company:companies(*),
        branch:branches(*),
        role:roles(*)
      `)
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user as AuthUser | null);
    });
  }
};