# Panduan Refactoring App.tsx (Bagian 1: Setup)

Dokumen ini memberikan langkah-langkah aman untuk refactoring `App.tsx` menggunakan hooks dan context yang telah dibuat. Tidak ada file asli yang diubah — semua di bawah adalah referensi yang bisa Anda salin dan adaptasi.

## File yang Telah Dibuat sebagai Referensi

| File | Path | Keterangan |
|------|------|------------|
| Main terintegrasi | `src/main.integrated.tsx` | Contoh `main.tsx` dengan AuthProvider, AppDataProvider, ToastProvider |
| Hook API | `src/hooks/useApi.ts` | Hook untuk fetch/post dengan loading & error state |
| Admin Service | `src/services/adminService.ts` | Service untuk manajemen akun admin |
| Panduan ini | `PENYEMPURNAAN_APPX_GUIDE.md` | Langkah-langkah refactoring |

---

## Langkah 1: Update `src/main.tsx`

Ganti isi `src/main.tsx` dengan yang berikut:

```tsx
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { AppDataProvider } from './contexts/AppDataContext';
import { ToastProvider } from './contexts/ToastContext';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <AppDataProvider initialRole="public">
      <ToastProvider>
        <App />
      </ToastProvider>
    </AppDataProvider>
  </AuthProvider>
);
```

Simpan juga `main.tsx` asli sebagai backup sebelum mengganti:

```powershell
Copy-Item 'src\main.tsx' 'src\main.tsx.backup'
Copy-Item 'src\main.integrated.tsx' 'src\main.tsx'
```

---

## Langkah 2: Refactor `src/App.tsx` (Bagian 2: Kode Komponen)

Ganti isi `src/App.tsx` dengan kode berikut. Kode ini menggunakan hooks dan context yang telah dibuat:

```tsx
import React, { useState, useCallback } from 'react';
import {
  UserRole,
  Member,
  Transaction,
  ParcelPackage,
  Agent,
  AdminAccount,
  AuthenticatedUser,
} from './types/parcel';
import { PublicWebsite } from './components/PublicWebsite';
import { MemberDashboard } from './components/MemberDashboard';
import { MemberDepositFlow } from './components/MemberDepositFlow';
import { AgentDashboard } from './components/AgentDashboard';
import { KorwilDashboard } from './components/KorwilDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { KuitansiModal } from './components/KuitansiModal';
import { QRCodeModal } from './components/QRCodeModal';
import { AgentScanModal } from './components/AgentScanModal';
import { RegisterMemberModal } from './components/RegisterMemberModal';
import { PreparationGuideModal } from './components/PreparationGuideModal';
import { AgentRegistrationModal } from './components/AgentRegistrationModal';
import { CatalogManagerModal } from './components/CatalogManagerModal';
import { SupabaseSchemaModal } from './components/SupabaseSchemaModal';
import { ToastContainer } from './components/ToastContainer';
import { AuthLoginModal } from './components/AuthLoginModal';
import { AIChatWidget } from './components/AIChatWidget';
import { useAuth } from './hooks/useAuth';
import { useAppData } from './hooks/useAppData';
import { useToasts } from './hooks/useToasts';
import { memberService, transactionService, adminService } from './services';

export default function App() {
  const {
    user,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();

  const {
    packages,
    agents,
    members,
    transactions,
    adminAccounts,
    isLoading: dataLoading,
    refetch: refetchData,
  } = useAppData(user?.role || 'public');

  const { toasts, addToast, removeToast, success, error, warning, info } =
    useToasts();

  const [currentView, setCurrentView] = useState<UserRole | 'deposit'>('public');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [kuitansiTx, setKuitansiTx] = useState<Transaction | null>(null);
  const [qrMember, setQrMember] = useState<Member | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [registerPackageId, setRegisterPackageId] = useState<string | undefined>(
    undefined
  );
  const [packageDetailModal, setPackageDetailModal] = useState<ParcelPackage | null>(
    null
  );
  const [isAgentRegModalOpen, setIsAgentRegModalOpen] = useState<boolean>(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    members[0]?.id || ''
  );
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
  // === Handlers ===

  const handleLoginSuccess = useCallback(
    async (authUser: AuthenticatedUser) => {
      setSelectedMemberId('');
      setSelectedAgentId('');
      if (authUser.role === 'member') {
        setCurrentView('member');
      } else if (authUser.role === 'agent') {
        setCurrentView('agent');
      } else if (authUser.role === 'korwil') {
        setCurrentView('korwil');
      } else if (authUser.role === 'admin') {
        setCurrentView('admin');
      }
      await refetchData();
      success('Login Berhasil', `Selamat datang, ${authUser.name}`);
    },
    [refetchData, success]
  );

  const handleLogoutWrap = useCallback(async () => {
    await handleLogout();
    setCurrentView('public');
    setSelectedMemberId('');
    setSelectedAgentId('');
    info('Sesi Berakhir', 'Anda telah keluar dari akun.');
  }, [handleLogout, info]);

  const handleRegisterMember = useCallback(
    async (memberData: any) => {
      try {
        await memberService.registerMember(memberData);
        await refetchData();
        success('Registrasi Berhasil', 'Member baru telah terdaftar.');
        setIsRegisterModalOpen(false);
      } catch (err: any) {
        error('Registrasi Gagal', err?.message || 'Terjadi kesalahan.');
      }
    },
    [refetchData, success, error]
  );

  const handleRegisterAgent = useCallback(
    async (agentData: any) => {
      try {
        await refetchData();
        success('Registrasi Agen Berhasil', 'Agen baru telah terdaftar.');
        setIsAgentRegModalOpen(false);
      } catch (err: any) {
        error('Registrasi Agen Gagal', err?.message || 'Terjadi kesalahan.');
      }
    },
    [refetchData, success, error]
  );

  const handleDepositComplete = useCallback(
    async (newTx: Transaction, amount: number) => {
      try {
        const result = await transactionService.createTransaction({
          memberId: newTx.memberId,
          amount: newTx.amount,
          method: newTx.method,
          notes: newTx.notes,
        });
        if (result.ok) {
          await refetchData();
          success('Setoran Berhasil', `Rp ${amount.toLocaleString('id-ID')} telah disetor.`);
          return result.data as Transaction;
        }
        error('Setoran Gagal', result.error || 'Terjadi kesalahan.');
        return null;
      } catch (err: any) {
        error('Setoran Gagal', err?.message || 'Terjadi kesalahan.');
        return null;
      }
    },
    [refetchData, success, error]
  );

  const handleApproveTransaction = useCallback(
    async (txId: string) => {
      try {
        await transactionService.approveTransaction(txId);
        await refetchData();
        success('Transaksi Disetujui', 'Status transaksi telah diperbarui.');
      } catch (err: any) {
        error('Gagal Disetujui', err?.message || 'Terjadi kesalahan.');
      }
    },
    [refetchData, success, error]
  );

  const handleRejectTransaction = useCallback(
    async (txId: string) => {
      try {
        await transactionService.rejectTransaction(txId);
        await refetchData();
        warning('Transaksi Ditolak', 'Status transaksi telah diperbarui.');
      } catch (err: any) {
        error('Gagal Ditolak', err?.message || 'Terjadi kesalahan.');
      }
    },
    [refetchData, success, warning, error]
  );

  const handleUpdatePackage = useCallback(
    async (pkg: ParcelPackage) => {
      try {
        await refetchData();
        success('Paket Diupdate', 'Data paket telah diperbarui.');
        setIsCatalogModalOpen(false);
      } catch (err: any) {
        error('Gagal Update Paket', err?.message || 'Terjadi kesalahan.');
      }
    },
    [refetchData, success, error]
  );

  const handleAddNewPackage = useCallback(
    async (pkg: Partial<ParcelPackage>) => {
      try {
        await refetchData();
        success('Paket Ditambahkan', 'Paket baru telah tersedia.');
        setIsCatalogModalOpen(false);
      } catch (err: any) {
        error('Gagal Tambah Paket', err?.message || 'Terjadi kesalahan.');
      }
    },
    [refetchData, success, error]
  );

  const handleFulfillMember = useCallback(
    async (memberId: string) => {
      try {
        await refetchData();
        success('Member Terpenuhi', 'Status member telah diperbarui.');
        setIsScanModalOpen(false);
      } catch (err: any) {
        error('Gagal Memproses', err?.message || 'Terjadi kesalahan.');
      }
    },
    [refetchData, success, error]
  );
    agents[0]?.id || ''
  );

  const activeMember = members.find((m) => m.id === selectedMemberId) || members[0];
```