import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, AuthUser } from '../lib/auth';
import { User, Company, Branch } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  userProfile: User | null;
  company: Company | null;
  currentBranch: Branch | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  setCurrentBranch: (branch: Branch) => void;
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
  const [company, setCompany] = useState<Company | null>(null);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    authService.getCurrentUser().then(async (user) => {
      setUser(user);
      if (user) {
        try {
          const profile = await authService.getUserProfile();
          setUserProfile(profile);
          if (profile) {
            setCompany(profile.company as Company);
            setCurrentBranch(profile.branch as Branch);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (user) => {
      setUser(user);
      if (user) {
        try {
          const profile = await authService.getUserProfile();
          setUserProfile(profile);
          if (profile) {
            setCompany(profile.company as Company);
            setCurrentBranch(profile.branch as Branch);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
        setCompany(null);
        setCurrentBranch(null);
      }
    });

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
    setCompany(null);
    setCurrentBranch(null);
  };

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  const value = {
    user,
    userProfile,
    company,
    currentBranch,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    setCurrentBranch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};