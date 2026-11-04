/**
 * packageService.ts
 * Service untuk manajemen data paket lebaran.
 */

import { ParcelPackage } from '../types/parcel';
import { apiGet, apiPost } from './api';

export const packageService = {
  /**
   * Mengambil daftar semua paket
   */
  getAllPackages: async (role?: string): Promise<ParcelPackage[]> => {
    const url = role ? `/api/packages?role=${role}` : '/api/packages';
    return apiGet<ParcelPackage[]>(url, []);
  },

  /**
   * Simpan atau update paket (hanya admin)
   */
  savePackage: async (packageData: Partial<ParcelPackage> & { id?: string }) => {
    return apiPost('/api/packages', packageData);
  },

  /**
   * Hapus paket (hanya superadmin)
   */
  deletePackage: async (id: string) => {
    // Implementasi delete bisa ditambahkan di api.ts (apiDelete)
    return apiPost(`/api/packages/${id}/delete`, {});
  },
};