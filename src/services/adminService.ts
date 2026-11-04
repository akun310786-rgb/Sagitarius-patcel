/**
 * adminService.ts
 * Service untuk manajemen akun admin pusat.
 */

import { AdminAccount } from '../types/parcel';
import { apiGet, apiPost } from './api';

export const adminService = {
  /**
   * Mengambil daftar admin
   */
  getAllAdmins: async (role?: string): Promise<AdminAccount[]> => {
    const url = role ? `/api/admins?role=${role}` : '/api/admins';
    return apiGet<AdminAccount[]>(url, []);
  },

  /**
   * Tambah admin baru (hanya superadmin)
   */
  createAdmin: async (adminData: {
    name: string;
    username: string;
    email: string;
    role: 'superadmin' | 'admin' | 'finance' | 'staff';
    password: string;
    status?: 'Aktif' | 'Non-aktif';
  }) => {
    return apiPost('/api/admins', adminData);
  },

  /**
   * Update admin (hanya superadmin atau admin dengan kewenangan)
   */
  updateAdmin: async (id: string, adminData: Partial<AdminAccount>) => {
    return apiPost(`/api/admins/${id}`, adminData);
  },

  /**
   * Nonaktifkan admin (hanya superadmin)
   */
  deleteAdmin: async (id: string) => {
    return apiPost(`/api/admins/${id}/delete`, {});
  },

  /**
   * Reset password member/agen/admin (hanya admin pusat)
   */
  resetPassword: async (
    type: 'member' | 'agent' | 'admin',
    id: string,
    password: string
  ) => {
    return apiPost(
      `/api/admin/accounts/${type}/${id}/password`,
      { password }
    );
  },
};