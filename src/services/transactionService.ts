/**
 * transactionService.ts
 * Service untuk manajemen transaksi setoran.
 */

import { Transaction } from '../types/parcel';
import { apiGet, apiPost } from './api';

export const transactionService = {
  /**
   * Mengambil daftar transaksi
   */
  getAllTransactions: async (filters?: {
    memberId?: string;
    agentId?: string;
    status?: string;
    role?: string;
  }): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (filters?.memberId) params.set('memberId', filters.memberId);
    if (filters?.agentId) params.set('agentId', filters.agentId);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.role) params.set('role', filters.role);
    const url = `/api/transactions${params.toString() ? '?' + params.toString() : ''}`;
    return apiGet<Transaction[]>(url, []);
  },

  /**
   * Buat transaksi setoran baru
   */
  createTransaction: async (transactionData: {
    memberId: string;
    amount: number;
    method: string;
    notes?: string;
  }) => {
    return apiPost('/api/transactions', transactionData);
  },

  /**
   * Setujui transaksi (hanya admin/finance)
   */
  approveTransaction: async (id: string) => {
    return apiPost(`/api/transactions/${id}/approve`, {});
  },

  /**
   * Tolak transaksi (hanya admin/finance)
   */
  rejectTransaction: async (id: string) => {
    return apiPost(`/api/transactions/${id}/reject`, {});
  },

  /**
   * Ambil kuitansi transaksi
   */
  getKuitansi: async (id: string) => {
    return apiGet(`/api/transactions/${id}/kuitansi`, null);
  },
};