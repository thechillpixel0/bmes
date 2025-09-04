import { supabase } from './supabase';
import { User } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    company_id: string;
    role: string;
  };
}

export const authService = {
  async signUp(email: string, password: string, userData: {
    full_name: string;
    company_name: string;
    industry: string;
    branch_name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name,
          company_name: userData.company_name,
          industry: userData.industry,
          branch_name: userData.branch_name,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          postal_code: userData.postal_code,
          phone: userData.phone,
        }
      }
    });

    return { data, error };
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