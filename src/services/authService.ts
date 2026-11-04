/**
 * authService.ts
 * Service untuk autentikasi (login, logout, cek sesi).
 */

import { AuthenticatedUser } from '../types/parcel';
import { apiPost } from './api';

export const authService = {
  /**
   * Login multi-role
   */
  login: async (
    role: string,
    identifier: string,
    password: string
  ): Promise<{ user: AuthenticatedUser } | null> => {
    const result = await apiPost('/api/auth/login', {
      role,
      identifier: identifier.trim(),
      password,
    });
    return result?.ok && result.data?.user ? result.data : null;
  },

  /**
   * Logout
   */
  logout: async (): Promise<boolean> => {
    try {
      await apiPost('/api/auth/logout', {});
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Cek sesi pengguna yang sedang login
   */
  me: async (): Promise<AuthenticatedUser | null> => {
    const result = await apiPost('/api/auth/me', {});
    return result?.ok && result.data?.user ? result.data.user : null;
  },
};