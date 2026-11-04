/**
 * AuthContext.tsx
 * React Context untuk menyediakan state autentikasi ke seluruh aplikasi.
 * Digunakan untuk refactoring App.tsx agar tidak perlu meng-prop-drill auth state.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthenticatedUser, UserRole } from '../types/parcel';
import { safePostJson } from '../utils/apiClient';

interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isLoading: boolean;
  login: (role: UserRole, identifier: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const result = await safePostJson<{ user: AuthenticatedUser | null }>(
          '/api/auth/me',
          {}
        );
        if (result.ok && result.data?.user) {
          setUser(result.data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (
    role: UserRole,
    identifier: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await safePostJson<{ user: AuthenticatedUser }>(
        '/api/auth/login',
        { role, identifier: identifier.trim(), password }
      );

      if (!result.ok || !result.data?.user) {
        return false;
      }

      setUser(result.data.user);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await safePostJson('/api/auth/logout', {});
    } catch {
      // Abaikan error logout
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    role: user?.role || null,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};