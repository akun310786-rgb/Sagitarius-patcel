/**
 * AppDataContext.tsx
 * React Context untuk menyediakan data aplikasi (paket, agen, member, transaksi, admin)
 * ke seluruh komponen tanpa prop drilling.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  ParcelPackage,
  Agent,
  Member,
  Transaction,
  AdminAccount,
} from '../types/parcel';
import { safeFetchJson } from '../utils/apiClient';

interface AppDataContextType {
  packages: ParcelPackage[];
  agents: Agent[];
  members: Member[];
  transactions: Transaction[];
  adminAccounts: AdminAccount[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
  initialRole = 'public',
}) => {
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
      const [pkgs, ags, mems, txs, admins] = await Promise.allSettled([
        safeFetchJson<ParcelPackage[]>(
          `/api/packages?role=${initialRole}`,
          []
        ),
        safeFetchJson<Agent[]>(`/api/agents?role=${initialRole}`, []),
        safeFetchJson<Member[]>(`/api/members?role=${initialRole}`, []),
        safeFetchJson<Transaction[]>(
          `/api/transactions?role=${initialRole}`,
          []
        ),
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
        setError('Beberapa data gagal dimuat.');
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

  const value: AppDataContextType = {
    packages,
    agents,
    members,
    transactions,
    adminAccounts,
    isLoading,
    error,
    refetch: fetchData,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData harus digunakan di dalam AppDataProvider');
  }
  return context;
};