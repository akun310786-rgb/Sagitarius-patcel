/**
 * useAuth.ts
 * Custom hook untuk mengelola autentikasi dan sesi pengguna di sisi klien.
 * Digunakan untuk refactoring App.tsx yang saat ini menjadi "God Component".
 *
 * Cara pakai:
 *   const { user, login, logout, isAuthenticated, role } = useAuth();
 */

import { useState, useEffect, useCallback } from 'react';
import { AuthenticatedUser, UserRole } from '../types/parcel';
import { safePostJson } from '../utils/apiClient';

interface UseAuthReturn {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (role: UserRole, identifier: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cek sesi saat mount
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

  const login = useCallback(
    async (role: UserRole, identifier: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await safePostJson<{ user: AuthenticatedUser }>(
          '/api/auth/login',
          { role, identifier: identifier.trim(), password }
        );

        if (!result.ok || !result.data?.user) {
          setError(result.error || 'Username atau kata sandi tidak cocok.');
          return false;
        }

        setUser(result.data.user);
        return true;
      } catch (err: any) {
        setError(err?.message || 'Gagal masuk. Silakan coba lagi.');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await safePostJson('/api/auth/logout', {});
    } catch {
      // Abaikan error logout, tetap bersihkan state lokal
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    role: user?.role || null,
    login,
    logout,
    isLoading,
    error,
  };
};