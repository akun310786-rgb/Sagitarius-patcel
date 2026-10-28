import React, { useState } from 'react';
import { UserRole, Member, Transaction, ParcelPackage, Agent } from './types/parcel';
import { ToastNotification } from './types/toast';
import { INITIAL_MEMBERS, INITIAL_TRANSACTIONS, PACKAGES, AGENTS } from './data/mockData';
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

export default function App() {
  const [currentView, setCurrentView] = useState<UserRole | 'deposit'>('public');
  const [authSession, setAuthSession] = useState<{ role: UserRole; id?: string; name?: string } | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Dynamic application state
  const [packages, setPackages] = useState<ParcelPackage[]>(PACKAGES);
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(INITIAL_MEMBERS[0].id);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(AGENTS[0].id);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Modals state
  const [kuitansiTx, setKuitansiTx] = useState<Transaction | null>(null);
  const [qrMember, setQrMember] = useState<Member | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [registerPackageId, setRegisterPackageId] = useState<string | undefined>(undefined);
  const [packageDetailModal, setPackageDetailModal] = useState<ParcelPackage | null>(null);

  // New priority modules modals
  const [isAgentRegModalOpen, setIsAgentRegModalOpen] = useState<boolean>(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  const activeMember = members.find((m) => m.id === selectedMemberId) || members[0];

  // Helper to trigger a toast
  const showToast = (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const newToast: ToastNotification = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Simulate an incoming transaction in real-time
  const handleSimulateIncomingTransaction = () => {
    const randomMember = members[Math.floor(Math.random() * members.length)];
    const amounts = [25000, 50000, 75000, 100000, 150000, 250000];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    const methods: Transaction['method'][] = [
      'Transfer Bank BCA',
      'Transfer Bank BRI',
      'QRIS Instant',
      'Tunai Agen'
    ];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const randomInv = Math.floor(1000 + Math.random() * 9000);

    const newTx: Transaction = {
      id: `tx-sim-${Date.now()}`,
      invoiceNo: `INV-20261026-${randomInv}`,
      memberId: randomMember.id,
      memberName: randomMember.name,
      memberCode: randomMember.memberCode,
      packageName: randomMember.packageName,
      agentId: randomMember.agentId,
      agentName: randomMember.agentName,
      amount,
      date: '26 Okt 2026',
      method,
      status: 'Menunggu',
      notes: `Setoran via ${method}`
    };

    setTransactions((prev) => [newTx, ...prev]);

    showToast({
      title: '📥 Transaksi Baru Masuk!',
      message: `Setoran sebesar Rp ${amount.toLocaleString('id-ID')} dari ${randomMember.name} (${newTx.invoiceNo}) berhasil dicatat. Status: Menunggu Verifikasi.`,
      type: 'warning',
      invoiceNo: newTx.invoiceNo,
      amount
    });
  };

  // Deposit completed handler
  const handleDepositComplete = (newTx: Transaction, amount: number) => {
    setTransactions((prev) => [newTx, ...prev]);

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === newTx.memberId) {
          const newTotal = m.totalSaved + amount;
          return {
            ...m,
            totalSaved: newTotal,
            lastDepositAmount: amount,
            lastDepositDate: newTx.date,
            status: newTotal >= m.packagePrice ? 'Lunas' : 'Aktif'
          };
        }
        return m;
      })
    );

    showToast({
      title: '📥 Setoran Baru Berhasil Dicatat!',
      message: `${newTx.memberName} berhasil menyetor Rp ${amount.toLocaleString('id-ID')} via ${newTx.method}. Menunggu approval Admin Pusat.`,
      type: 'info',
      invoiceNo: newTx.invoiceNo,
      amount
    });
  };

  // Agent quick deposit for a member
  const handleAgentQuickDeposit = (member: Member) => {
    setSelectedMemberId(member.id);
    setCurrentView('deposit');
  };

  // Admin approves transaction
  const handleApproveTransaction = (txId: string) => {
    const targetTx = transactions.find((t) => t.id === txId);
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === txId) {
          return { ...t, status: 'Berhasil' };
        }
        return t;
      })
    );

    showToast({
      title: 'Transaksi Disetujui! ✅',
      message: `Setoran ${targetTx?.invoiceNo || txId} (${targetTx?.memberName || 'Member'}) senilai Rp ${(targetTx?.amount || 0).toLocaleString('id-ID')} telah disahkan oleh Super Admin.`,
      type: 'success',
      invoiceNo: targetTx?.invoiceNo,
      amount: targetTx?.amount
    });
  };

  // Admin rejects transaction
  const handleRejectTransaction = (txId: string) => {
    const targetTx = transactions.find((t) => t.id === txId);
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === txId) {
          return { ...t, status: 'Ditolak' };
        }
        return t;
      })
    );

    showToast({
      title: 'Transaksi Ditolak! ❌',
      message: `Setoran ${targetTx?.invoiceNo || txId} (${targetTx?.memberName || 'Member'}) telah ditolak. Catatan revisi dikirimkan ke Agen Binaan.`,
      type: 'error',
      invoiceNo: targetTx?.invoiceNo,
      amount: targetTx?.amount
    });
  };

  // Korwil rapid verification
  const handleVerifyKorwil = (txId: string) => {
    const targetTx = transactions.find((t) => t.id === txId);
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === txId) {
          return { ...t, status: 'Berhasil', notes: 'Diverifikasi langsung oleh Korwil Priangan Timur' };
        }
        return t;
      })
    );

    showToast({
      title: 'Verifikasi Kilat Korwil! ⚡',
      message: `Setoran ${targetTx?.invoiceNo || txId} (${targetTx?.memberName || 'Member'}) dinyatakan valid oleh Korwil Priangan Timur.`,
      type: 'success',
      invoiceNo: targetTx?.invoiceNo,
      amount: targetTx?.amount
    });
  };

  // Agent fulfills package with barcode scan
  const handleFulfillMember = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return { ...m, status: 'Lunas' };
        }
        return m;
      })
    );

    showToast({
      title: 'Paket Berhasil Diserahkan! 🎁',
      message: `Paket Idul Fitri untuk ${member?.name || 'Member'} telah diserahkan resmi oleh Agen Binaan.`,
      type: 'success'
    });
  };

  // Register new member
  const handleRegisterMember = (newMember: Member) => {
    setMembers((prev) => [newMember, ...prev]);
    setSelectedMemberId(newMember.id);

    showToast({
      title: 'Member Baru Terdaftar! 🎉',
      message: `${newMember.name} (${newMember.memberCode}) telah bergabung dengan paket ${newMember.packageName}.`,
      type: 'success'
    });
  };

  // Register new agent
  const handleRegisterAgent = (newAgent: Agent) => {
    setAgents((prev) => [newAgent, ...prev]);
    setSelectedAgentId(newAgent.id);
    setCurrentView('agent');

    showToast({
      title: 'Mitra Agen Baru Terdaftar! 🏪',
      message: `Toko ${newAgent.storeName} (${newAgent.ownerName}) resmi menjadi Agen Binaan Sagitarius Parcel.`,
      type: 'success'
    });
  };

  // Catalog update package
  const handleUpdatePackage = (updatedPkg: ParcelPackage) => {
    setPackages((prev) => prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p)));

    showToast({
      title: 'Katalog Paket Diperbarui! 📦',
      message: `Perubahan pada ${updatedPkg.name} berhasil disimpan dan disinkronkan ke seluruh portal.`,
      type: 'info'
    });
  };

  // Catalog add new package
  const handleAddNewPackage = (newPkg: ParcelPackage) => {
    setPackages((prev) => [...prev, newPkg]);

    showToast({
      title: 'Paket Baru Ditambahkan! ✨',
      message: `${newPkg.name} telah masuk ke katalog resmi Lebaran 2026-2027.`,
      type: 'success'
    });
  };

  // Handle Login Success from AuthLoginModal
  const handleLoginSuccess = (role: UserRole, targetId?: string) => {
    let userName = 'Pengguna';
    if (role === 'member') {
      const m = members.find((x) => x.id === targetId) || members[0];
      setSelectedMemberId(m.id);
      userName = m.name;
    } else if (role === 'agent') {
      const a = agents.find((x) => x.id === targetId) || agents[0];
      setSelectedAgentId(a.id);
      userName = `${a.ownerName} (${a.storeName})`;
    } else if (role === 'korwil') {
      userName = 'Budi Santoso (Korwil Priangan Timur)';
    } else if (role === 'admin') {
      userName = 'Super Admin HQ';
    }

    setAuthSession({ role, id: targetId, name: userName });
    setCurrentView(role);

    showToast({
      title: `Selamat Datang, ${userName}! 👋`,
      message: `Berhasil masuk ke Dashboard ${
        role === 'member'
          ? 'Buku Tabungan'
          : role === 'agent'
          ? 'Mitra Agen'
          : role === 'korwil'
          ? 'Korwil'
          : 'Admin Pusat'
      }.`,
      type: 'success'
    });
  };

  // Handle Logout
  const handleLogout = () => {
    setAuthSession(null);
    setCurrentView('public');

    showToast({
      title: 'Berhasil Keluar',
      message: 'Sesi akun Anda telah ditutup. Kembali ke website publik.',
      type: 'info'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-900 selection:bg-amber-400 selection:text-slate-950 relative">
      {/* Toast Notification Floating Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
        currentRole={currentView}
      />

      {/* Authenticated Top Status Bar - Only shown when logged into an internal dashboard */}
      {currentView !== 'public' && authSession && (
        <div className="bg-gradient-to-r from-[#19072f] via-[#2a0e4f] to-[#130526] text-white text-xs sticky top-0 z-50 border-b border-purple-900/50 py-2.5 px-4 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <img
                src="/assets/aistudio/file_00000000ca58820ba2ac5348f000d329_d1d25037.png"
                alt="Sagitarius Parcel Logo"
                className="w-7 h-7 rounded-lg object-contain shadow-sm border border-purple-800/80 bg-black shrink-0"
              />
              <span className="font-bold text-amber-400">SAGITARIUS PARCEL</span>
              <span className="text-slate-400 hidden sm:inline">
                · Dashboard{' '}
                <strong className="text-white uppercase">
                  {authSession.role === 'member'
                    ? 'Buku Tabungan'
                    : authSession.role === 'agent'
                    ? 'Mitra Agen'
                    : authSession.role === 'korwil'
                    ? 'Korwil Wilayah'
                    : 'Admin Pusat'}
                </strong>
                : <span className="text-purple-300 font-semibold">{authSession.name}</span>
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-rose-950 hover:text-rose-200 text-purple-200 hover:text-white rounded-xl text-xs font-semibold border border-white/15 hover:border-rose-500/50 transition shadow-xs cursor-pointer"
            >
              <span>← Keluar ke Website Publik</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Container or Mobile Frame Wrapper */}
      <main className={isMobileFrame ? 'py-8 flex justify-center bg-slate-900 min-h-screen' : 'min-h-screen'}>
        <div
          className={
            isMobileFrame
              ? 'w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-800 transition-all'
              : 'w-full'
          }
        >
          {/* Active View Router */}
          {currentView === 'public' && (
            <PublicWebsite
              packages={packages}
              agents={agents}
              onOpenLogin={() => setIsLoginModalOpen(true)}
              onGoToDeposit={() => {
                if (authSession?.role === 'member') {
                  setCurrentView('deposit');
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              onOpenRegister={(pkgId) => {
                setRegisterPackageId(pkgId);
                setIsRegisterModalOpen(true);
              }}
              onOpenGuide={() => setIsGuideOpen(true)}
              onOpenAgentRegistration={() => setIsAgentRegModalOpen(true)}
            />
          )}

          {currentView === 'member' && (
            authSession?.role === 'member' ? (
              <MemberDashboard
                member={activeMember}
                transactions={transactions.filter((t) => t.memberId === activeMember.id)}
                onGoToDeposit={() => setCurrentView('deposit')}
                onOpenQR={() => setQrMember(activeMember)}
                onViewKuitansi={(tx) => setKuitansiTx(tx)}
                onOpenPackageDetail={(pkg) => setPackageDetailModal(pkg)}
                allMembers={members}
                onSelectMember={(id) => setSelectedMemberId(id)}
                onLogout={handleLogout}
              />
            ) : (
              <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200 space-y-4">
                  <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
                    🔒
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Perlu Login Member</h3>
                  <p className="text-xs text-slate-600">
                    Silakan masukkan email/username dan password Anda terlebih dahulu untuk membuka buku tabungan digital.
                  </p>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition shadow-md"
                  >
                    Masuk Sekarang
                  </button>
                  <button
                    onClick={() => setCurrentView('public')}
                    className="w-full py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                  >
                    Kembali ke Website
                  </button>
                </div>
              </div>
            )
          )}

          {currentView === 'deposit' && (
            <MemberDepositFlow
              member={activeMember}
              onDepositComplete={handleDepositComplete}
              onBackToDashboard={() => setCurrentView('member')}
            />
          )}

          {currentView === 'agent' && (
            authSession?.role === 'agent' ? (
              <AgentDashboard
                members={members}
                agents={agents}
                activeAgentId={selectedAgentId}
                onSelectAgent={(id) => setSelectedAgentId(id)}
                onOpenRegister={() => setIsRegisterModalOpen(true)}
                onOpenScan={() => setIsScanModalOpen(true)}
                onOpenQuickDeposit={handleAgentQuickDeposit}
                onOpenQR={(m) => setQrMember(m)}
                onOpenCommissionSimulator={() => setIsAgentRegModalOpen(true)}
                onLogout={handleLogout}
              />
            ) : (
              <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200 space-y-4">
                  <div className="w-14 h-14 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
                    🏪
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Perlu Login Mitra Agen</h3>
                  <p className="text-xs text-slate-600">
                    Silakan masukkan kode agen atau nomor WhatsApp toko Anda untuk membuka portal agen.
                  </p>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition shadow-md"
                  >
                    Masuk Mitra Agen
                  </button>
                  <button
                    onClick={() => setCurrentView('public')}
                    className="w-full py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                  >
                    Kembali ke Website
                  </button>
                </div>
              </div>
            )
          )}

          {currentView === 'korwil' && (
            authSession?.role === 'korwil' ? (
              <KorwilDashboard
                agents={agents}
                pendingTransactions={transactions.filter((t) => t.status === 'Menunggu')}
                onVerifyKorwil={handleVerifyKorwil}
                onOpenAgentRegister={() => setIsAgentRegModalOpen(true)}
                onLogout={handleLogout}
              />
            ) : (
              <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200 space-y-4">
                  <div className="w-14 h-14 bg-purple-100 text-purple-800 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
                    📍
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Perlu Login Korwil</h3>
                  <p className="text-xs text-slate-600">
                    Silakan masukkan akun koordinator wilayah Anda untuk memvalidasi transaksi regional.
                  </p>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs transition shadow-md"
                  >
                    Masuk Korwil
                  </button>
                  <button
                    onClick={() => setCurrentView('public')}
                    className="w-full py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                  >
                    Kembali ke Website
                  </button>
                </div>
              </div>
            )
          )}

          {currentView === 'admin' && (
            authSession?.role === 'admin' ? (
              <AdminDashboard
                transactions={transactions}
                packages={packages}
                agents={agents}
                members={members}
                onApproveTransaction={handleApproveTransaction}
                onRejectTransaction={handleRejectTransaction}
                onViewKuitansi={(tx) => setKuitansiTx(tx)}
                onOpenCatalogManager={() => setIsCatalogModalOpen(true)}
                onOpenSupabaseConsole={() => setIsSupabaseModalOpen(true)}
                onOpenAgentRegistration={() => setIsAgentRegModalOpen(true)}
                onLogout={handleLogout}
              />
            ) : (
              <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200 space-y-4">
                  <div className="w-14 h-14 bg-rose-100 text-rose-800 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
                    🛡️
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Perlu Login Super Admin</h3>
                  <p className="text-xs text-slate-600">
                    Akses terbatas untuk tim manajemen pusat PT. Sagitarius Trinunggal Karya.
                  </p>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs transition shadow-md"
                  >
                    Masuk Super Admin
                  </button>
                  <button
                    onClick={() => setCurrentView('public')}
                    className="w-full py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                  >
                    Kembali ke Website
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </main>

      {/* Floating System Tools Quick-Access (Hanya Tampil untuk Super Admin) */}
      {authSession?.role === 'admin' && (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <button
            onClick={() => setIsCatalogModalOpen(true)}
            className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3.5 py-2 rounded-full shadow-xl transition transform hover:scale-105 border border-emerald-500/50 text-xs"
          >
            <span>📦</span>
            <span>Kelola Katalog</span>
          </button>

          <button
            onClick={() => setIsAgentRegModalOpen(true)}
            className="flex items-center space-x-1.5 bg-blue-700 hover:bg-blue-600 text-white font-bold px-3.5 py-2 rounded-full shadow-xl transition transform hover:scale-105 border border-blue-500/50 text-xs"
          >
            <span>🏪</span>
            <span>Portal Agen & Komisi</span>
          </button>

          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold px-3.5 py-2 rounded-full shadow-xl transition transform hover:scale-105 border border-emerald-500/40 text-xs"
          >
            <span>⚡</span>
            <span>Supabase Cloud DB</span>
          </button>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-2 rounded-full shadow-2xl transition transform hover:scale-105 border-2 border-white/40 text-xs"
          >
            <span>📋</span>
            <span>Panduan Bisnis</span>
          </button>
        </div>
      )}

      {/* Auth Login Modal */}
      {isLoginModalOpen && (
        <AuthLoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          members={members}
          agents={agents}
          initialRole={currentView === 'public' || currentView === 'deposit' ? 'member' : currentView}
        />
      )}

      {/* Modals */}
      {kuitansiTx && (
        <KuitansiModal transaction={kuitansiTx} onClose={() => setKuitansiTx(null)} />
      )}

      {qrMember && (
        <QRCodeModal member={qrMember} onClose={() => setQrMember(null)} />
      )}

      {isScanModalOpen && (
        <AgentScanModal
          members={members}
          onClose={() => setIsScanModalOpen(false)}
          onFulfill={handleFulfillMember}
        />
      )}

      {isRegisterModalOpen && (
        <RegisterMemberModal
          packages={packages}
          agents={agents}
          defaultPackageId={registerPackageId}
          onClose={() => setIsRegisterModalOpen(false)}
          onRegister={(newM) => {
            handleRegisterMember(newM);
          }}
          onGoToDeposit={(memberId) => {
            setSelectedMemberId(memberId);
            setIsRegisterModalOpen(false);
            setCurrentView('deposit');
          }}
        />
      )}

      {isAgentRegModalOpen && (
        <AgentRegistrationModal
          onClose={() => setIsAgentRegModalOpen(false)}
          onRegisterAgent={handleRegisterAgent}
          onGoToRegisterMember={(agentId) => {
            setSelectedAgentId(agentId);
            setIsAgentRegModalOpen(false);
            setIsRegisterModalOpen(true);
          }}
        />
      )}

      {isCatalogModalOpen && (
        <CatalogManagerModal
          packages={packages}
          onClose={() => setIsCatalogModalOpen(false)}
          onUpdatePackage={handleUpdatePackage}
          onAddNewPackage={handleAddNewPackage}
        />
      )}

      {isSupabaseModalOpen && (
        <SupabaseSchemaModal
          packages={packages}
          agents={agents}
          members={members}
          transactions={transactions}
          onClose={() => setIsSupabaseModalOpen(false)}
        />
      )}

      {isGuideOpen && (
        <PreparationGuideModal onClose={() => setIsGuideOpen(false)} />
      )}
    </div>
  );
}
