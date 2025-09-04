import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, AuthUser } from '../lib/auth';
import { User } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  userProfile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    authService.getCurrentUser().then(setUser);

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(setUser);

    setLoading(false);

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    return result;
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const result = await authService.signUp(email, password, userData);
    return result;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};