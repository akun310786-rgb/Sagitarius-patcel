/**
 * useAppData.ts
 * Custom hook untuk mengelola data aplikasi (paket, agen, member, transaksi, admin).
 * Mengambil data dari API dengan fallback ke data lokal jika API tidak tersedia.
 */

import { useState, useEffect, useCallback } from 'react';
import { ParcelPackage, Agent, Member, Transaction, AdminAccount } from '../types/parcel';
import { safeFetchJson } from '../utils/apiClient';

interface UseAppDataReturn {
  packages: ParcelPackage[];
  agents: Agent[];
  members: Member[];
  transactions: Transaction[];
  adminAccounts: AdminAccount[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAppData = (initialRole: string = 'public'): UseAppDataReturn => {
  const [packages, setPackages] = useState<ParcelPackage[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch data secara paralel
      const [pkgs, ags, mems, txs, admins] = await Promise.allSettled([
        safeFetchJson<ParcelPackage[]>(`/api/packages?role=${initialRole}`, []),
        safeFetchJson<Agent[]>(`/api/agents?role=${initialRole}`, []),
        safeFetchJson<Member[]>(`/api/members?role=${initialRole}`, []),
        safeFetchJson<Transaction[]>(`/api/transactions?role=${initialRole}`, []),
        safeFetchJson<AdminAccount[]>(`/api/admins?role=${initialRole}`, []),
      ]);

      if (pkgs.status === 'fulfilled') setPackages(pkgs.value);
      if (ags.status === 'fulfilled') setAgents(ags.value);
      if (mems.status === 'fulfilled') setMembers(mems.value);
      if (txs.status === 'fulfilled') setTransactions(txs.value);
      if (admins.status === 'fulfilled') setAdminAccounts(admins.value);

      const failed = [pkgs, ags, mems, txs, admins].filter(
        (r) => r.status === 'rejected'
      );

      if (failed.length > 0) {
        setError('Beberapa data gagal dimuat. Silakan muat ulang halaman.');
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat data aplikasi.');
    } finally {
      setIsLoading(false);
    }
  }, [initialRole]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    packages,
    agents,
    members,
    transactions,
    adminAccounts,
    isLoading,
    error,
    refetch: fetchData,
  };
};