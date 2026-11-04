/**
 * memberService.ts
 * Service untuk manajemen data member tabungan.
 */

import { Member } from '../types/parcel';
import { apiGet, apiPost } from './api';

export const memberService = {
  /**
   * Mengambil daftar member
   */
  getAllMembers: async (agentId?: string, role?: string): Promise<Member[]> => {
    const params = new URLSearchParams();
    if (agentId) params.set('agentId', agentId);
    if (role) params.set('role', role);
    const url = `/api/members${params.toString() ? '?' + params.toString() : ''}`;
    return apiGet<Member[]>(url, []);
  },

  /**
   * Daftarkan member baru
   */
  registerMember: async (memberData: Omit<Member, 'id' | 'qrToken'>) => {
    return apiPost('/api/members', memberData);
  },

  /**
   * Update data member
   */
  updateMember: async (id: string, memberData: Partial<Member>) => {
    return apiPost(`/api/members/${id}`, memberData);
  },
};