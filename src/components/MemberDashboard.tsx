import React, { useState } from 'react';
import { Member, Transaction, ParcelPackage } from '../types/parcel';
import { PACKAGES } from '../data/mockData';
import {
  Wallet,
  Clock,
  PiggyBank,
  QrCode,
  PlusCircle,
  FileText,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Bell,
  ChevronRight,
  Eye,
  Store,
  Info,
  Lock,
  Unlock,
  LogOut,
  KeyRound,
  TrendingUp,
  Target,
  Sparkles,
  ShieldCheck,
  Calendar,
  Check,
  AlertTriangle,
  Hourglass
} from 'lucide-react';

interface MemberDashboardProps {
  member: Member;
  transactions: Transaction[];
  onGoToDeposit: () => void;
  onOpenQR: () => void;
  onViewKuitansi: (tx: Transaction) => void;
  onOpenPackageDetail: (pkg: ParcelPackage) => void;
  allMembers?: Member[];
  onSelectMember?: (memberId: string) => void;
  onLogout?: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  member,
  transactions,
  onGoToDeposit,
  onOpenQR,
  onViewKuitansi,
  onOpenPackageDetail,
  allMembers = [],
  onSelectMember,
  onLogout
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  const [statusFilter, setStatusFilter] = useState<'all' | 'Berhasil' | 'Menunggu'>('all');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');

    const query = loginIdentifier.trim().toLowerCase();
    if (!query) {
      setLoginError('Silakan masukkan email atau username Anda.');
      return;
    }

    const memberPool = allMembers && allMembers.length > 0 ? allMembers : [member];
    const found = memberPool.find((m) => {
      const emailMatch = m.email && m.email.toLowerCase() === query;
      const usernameMatch = m.username && m.username.toLowerCase() === query;
      const phoneMatch = m.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '');
      const codeMatch = m.memberCode.toLowerCase() === query;
      const nameMatch = m.name.toLowerCase() === query;
      return emailMatch || usernameMatch || phoneMatch || codeMatch || nameMatch;
    });

    if (!found) {
      setLoginError('Akun member tidak ditemukan. Periksa email atau username Anda.');
      return;
    }

    // Verify password if set
    if (loginPassword && found.password && found.password !== loginPassword) {
      setLoginError('Password tidak sesuai. Silakan coba lagi.');
      return;
    }

    if (onSelectMember) {
      onSelectMember(found.id);
    }
    setIsLoggedIn(true);
    setLoginError('');
  };

  const handleQuickDemoLogin = (targetMember: Member) => {
    if (onSelectMember) {
      onSelectMember(targetMember.id);
    }
    setLoginIdentifier(targetMember.email || targetMember.username || targetMember.memberCode);
    setLoginPassword(targetMember.password || 'password123');
    setIsLoggedIn(true);
    setLoginError('');
  };

  const filteredTransactions = transactions.filter((t) => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  const percent = Math.min(100, Math.round((member.totalSaved / member.packagePrice) * 100));
  const remaining = Math.max(0, member.packagePrice - member.totalSaved);

  // Status dan kalkulasi 'Hampir Jatuh Tempo' (< 3 bulan / 90 hari menjelang Hari Raya)
  const isNotFullyPaid = remaining > 0 && member.status !== 'Lunas';
  // Hari raya dan serah terima paket H-7 Lebaran berada dalam rentang ±55 hari (< 90 hari)
  const daysUntilDue = 55;
  const isDueSoon = isNotFullyPaid && daysUntilDue < 90;
  // Rekomendasi percepatan nominal agar target tercapai tepat waktu
  const acceleratedDailyRate = Math.ceil(remaining / daysUntilDue);
  const acceleratedWeeklyRate = Math.ceil(remaining / Math.ceil(daysUntilDue / 7));

  const currentPkg =
    PACKAGES.find((p) => p.id === member.packageId) ||
    PACKAGES.find((p) => p.name === member.packageName) ||
    PACKAGES[0];

  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);

  const pendingTransactions = transactions.filter((t) => t.status === 'Menunggu');
  const recentSuccess = transactions.filter((t) => t.status === 'Berhasil');

  const initials = member.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'MB';

  if (!isLoggedIn) {
    return (
      <div className="bg-[#fbf9fd] min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden animate-in fade-in">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#1c0836] via-[#2d0e54] to-[#150628] text-white p-6 text-center relative">
            <img
              src="/assets/aistudio/file_00000000ca58820ba2ac5348f000d329_d1d25037.png"
              alt="Sagitarius Parcel Logo"
              className="w-16 h-16 rounded-2xl object-contain mx-auto mb-3 shadow-lg border border-purple-400/30 bg-black"
            />
            <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase block mb-1">
              PORTAL BUKU TABUNGAN DIGITAL
            </span>
            <h2 className="text-xl font-black text-white">Verifikasi Login Member</h2>
            <p className="text-xs text-purple-200 mt-1">
              Masukkan email atau username dan password untuk melihat data tabungan, histori setoran, dan progres target paket.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email / Username / No. ID Member *
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="Contoh: siti@gmail.com atau sitirahma"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-600 font-medium text-xs bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Password Akun *
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Masukkan password akun Anda"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-600 font-medium text-xs bg-slate-50/50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 hover:from-purple-900 hover:via-indigo-900 hover:to-slate-950 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Verifikasi & Masuk Dashboard</span>
            </button>

            {/* Quick Demo Login selector */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                Atau Masuk Cepat dengan Akun Terdaftar:
              </span>
              <div className="space-y-1.5">
                {(allMembers && allMembers.length > 0 ? allMembers : [member]).slice(0, 4).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(m)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-purple-500 bg-slate-50 hover:bg-purple-50/50 flex items-center justify-between transition text-left cursor-pointer"
                  >
                    <div>
                      <strong className="text-slate-900 block text-xs">{m.name}</strong>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {m.email || `${m.memberCode.toLowerCase()}@member.sp`} · {m.packageName}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md shrink-0">
                      Pilih
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Real-time Status Alert Banner if any transaction is pending */}
        {pendingTransactions.length > 0 && (
          <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-200/70 text-amber-900 rounded-xl">
                <Clock className="w-5 h-5 text-amber-700 animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-amber-950 block text-sm">
                  {pendingTransactions.length} Setoran Anda Sedang Diverifikasi Pusat
                </span>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Setoran terbaru sebesar <strong className="font-mono">Rp {pendingTransactions[0]?.amount.toLocaleString('id-ID')}</strong> ({pendingTransactions[0]?.invoiceNo}) sedang diperiksa oleh Admin HQ Sagitarius Parcel.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-3 py-1 rounded-full uppercase tracking-wider font-mono shrink-0">
              Menunggu Approval
            </span>
          </div>
        )}

        {/* Notifikasi & Indikator Visual: Hampir Jatuh Tempo (< 3 Bulan Menuju Hari Raya) */}
        {isDueSoon && (
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50/90 border-2 border-amber-400/90 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs shadow-md animate-in fade-in">
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="p-2.5 bg-amber-500 text-slate-950 rounded-2xl shadow-sm shrink-0">
                <AlertTriangle className="w-5 h-5 text-slate-950" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-amber-950 text-sm">
                    Peringatan: Target Paket Belum Lunas & Hari Raya Makin Dekat!
                  </span>
                  <span className="bg-amber-200 text-amber-950 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-300">
                    Jatuh Tempo &lt; 3 Bulan (±{daysUntilDue} Hari Lagi)
                  </span>
                </div>
                <p className="text-amber-900 text-xs leading-relaxed">
                  Target paket <strong>{member.packageName}</strong> masih memiliki sisa kekurangan sebesar <strong className="font-mono text-amber-950">Rp {remaining.toLocaleString('id-ID')}</strong> ({100 - percent}% lagi). Estimasi serah terima barang pada <strong>{member.pickupDate}</strong>. Tingkatkan cicilan menjadi <strong className="font-mono">Rp {acceleratedWeeklyRate.toLocaleString('id-ID')}/minggu</strong> (atau <strong className="font-mono">Rp {acceleratedDailyRate.toLocaleString('id-ID')}/hari</strong>) agar paket Anda lunas tepat waktu dan siap diambil.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end pt-1 md:pt-0">
              <button
                onClick={onGoToDeposit}
                className="w-full md:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Percepat Setoran</span>
              </button>
            </div>
          </div>
        )}

        {/* Top Member Profile Header */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-md border border-amber-300">
              {initials}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900">{member.name}</h2>
                <span className="bg-purple-100 text-purple-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                  {member.status}
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                  <ShieldCheck className="w-3 h-3 text-purple-700" />
                  Terverifikasi
                </span>
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                ID: {member.memberCode} · WA: {member.phone} {member.email && `· ${member.email}`}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {onSelectMember && allMembers && allMembers.length > 1 && (
              <div className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] text-slate-500 font-semibold">Ganti Akun:</span>
                <select
                  value={member.id}
                  onChange={(e) => onSelectMember(e.target.value)}
                  className="bg-white font-medium text-slate-800 px-2 py-1 rounded-lg border border-slate-300 text-xs focus:outline-hidden"
                >
                  {allMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.memberCode} - {m.packageName})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => {
                if (onLogout) {
                  onLogout();
                } else {
                  setIsLoggedIn(false);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition"
              title="Kunci Akses / Logout Akun"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>

            <div className="text-xs text-slate-600 sm:text-right space-y-1 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
              <div>
                <span className="text-slate-400">Agen Pembina: </span>
                <strong className="text-slate-800">{member.agentName}</strong>
              </div>
              <div>
                <span className="text-slate-400">Bergabung: </span>
                <span className="font-medium text-slate-700">{member.joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Shortcut Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs">
          <button
            onClick={() => {}}
            className="p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 shadow-xs flex items-center justify-center space-x-1.5 hover:bg-slate-50"
          >
            <span>Ringkasan</span>
          </button>
          <button
            onClick={onGoToDeposit}
            className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md flex items-center justify-center space-x-1.5 col-span-2 sm:col-span-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Buat Setoran</span>
          </button>
          <a
            href="#histori-buku"
            className="p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center space-x-1 text-center"
          >
            <span>Buku Tabungan</span>
            <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {transactions.length}
            </span>
          </a>
          <button
            onClick={onOpenQR}
            className="p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center space-x-1.5"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-600" />
            <span>Tiket QR</span>
            <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full font-semibold">
              Siap
            </span>
          </button>
          <button
            onClick={() => onOpenPackageDetail(currentPkg)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center space-x-1"
          >
            <span>Detail Paket</span>
          </button>
          <button
            onClick={() => setShowNotificationModal(true)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center space-x-1"
          >
            <Bell className="w-3.5 h-3.5 text-emerald-600" />
            <span>Notifikasi</span>
            {pendingTransactions.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>
          <button
            onClick={() => setShowAddressModal(true)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center space-x-1"
          >
            <span>Alamat Kirim</span>
          </button>
        </div>

        {/* Notification Status Modal */}
        {showNotificationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base text-slate-900">Pusat Notifikasi Tabungan</h3>
                </div>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs max-h-60 overflow-y-auto pr-1">
                {transactions.slice(0, 5).map((t) => (
                  <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-2.5">
                    {t.status === 'Berhasil' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">{t.invoiceNo}</strong>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${t.status === 'Berhasil' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Setoran Rp {t.amount.toLocaleString('id-ID')} via {t.method} pada {t.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowNotificationModal(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">Alamat Penyerahan Parcel</h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Penerima:</span>
                  <span className="font-bold text-slate-900 text-sm">{member.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Alamat Pengiriman / Domisili:</span>
                  <span className="text-slate-800 font-medium">{member.address}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Wilayah / Kabupaten:</span>
                  <span className="text-slate-800 font-semibold">{member.regency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Titik Pengambilan:</span>
                  <span className="text-emerald-800 font-bold">{member.agentName} (H-7 Idul Fitri)</span>
                </div>
              </div>

              <button
                onClick={() => setShowAddressModal(false)}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition"
              >
                Selesai
              </button>
            </div>
          </div>
        )}

        {/* Outlet Agen Anda Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-amber-900 block text-sm">Outlet Agen Anda:</span>
              <p className="text-amber-800">
                Punya pertanyaan atau ingin setor tunai langsung? Temui Agen Andi di <strong>Toko Makmur Ciamis</strong>.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/6285298765432"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs shrink-0 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Agen (0852-9876-5432)</span>
          </a>
        </div>

        {/* Dashboard Title & Quick Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Dashboard Tabungan Hari Raya
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900">Halo, {member.name} 👋</h1>
            </div>
            <p className="text-xs text-slate-500">
              ID Member: <span className="font-mono font-bold text-slate-700">{member.memberCode}</span> | Paket Aktif:{' '}
              <strong className="text-purple-900">{member.packageName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToDeposit}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-900 hover:to-indigo-900 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-950/20 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Setor Tabungan</span>
            </button>
            <button
              onClick={onOpenQR}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-amber-700" />
              <span>Kode Pengambilan</span>
            </button>
          </div>
        </div>

        {/* 3 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Total Setoran Terkumpul</span>
              <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              Rp {member.totalSaved.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center space-x-1 text-xs text-purple-700 font-medium mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{percent}% dari target tabungan</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Setoran Terakhir</span>
              <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              Rp {member.lastDepositAmount.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Diverifikasi pada {member.lastDepositDate}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Sisa Target Paket</span>
              <div className={`p-2 rounded-lg ${isDueSoon ? 'bg-amber-100 text-amber-800' : 'bg-amber-50 text-amber-700'}`}>
                <PiggyBank className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-700 font-mono tabular-nums">
              Rp {remaining.toLocaleString('id-ID')}
            </div>
            {isDueSoon ? (
              <div className="flex items-center space-x-1.5 text-[11px] text-amber-900 bg-amber-50 border border-amber-300 px-2 py-1 rounded-lg font-bold mt-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Hampir Jatuh Tempo (&lt; 3 Bulan)</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 mt-2">
                Target total: Rp {member.packagePrice.toLocaleString('id-ID')}
              </div>
            )}
          </div>
        </div>

        {/* Visualisasi Progres Tabungan Menuju Target Harga Paket */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-7 space-y-6">
          {/* Header of Progress Card */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  <Target className="w-3.5 h-3.5 text-purple-700" />
                  Target Tabungan Paket
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentPkg.category.toUpperCase()} TIER
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {member.packageName}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Estimasi serah terima: <strong className="text-slate-700">{member.pickupDate}</strong> di <span className="font-semibold text-purple-900">{member.agentName}</span>
              </p>
            </div>

            {/* Percentage KPI Badge */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-purple-50/70 to-indigo-50/50 p-3 sm:px-4 sm:py-3 rounded-2xl border border-purple-100 shrink-0">
              <div className="text-right">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Capaian Tabungan
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-purple-900 tabular-nums">
                  {percent}%
                </div>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${
                percent >= 100
                  ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                  : 'bg-gradient-to-br from-purple-800 to-indigo-800 text-white'
              }`}>
                {percent >= 100 ? (
                  <Sparkles className="w-6 h-6" />
                ) : (
                  <TrendingUp className="w-5 h-5" />
                )}
              </div>
            </div>
          </div>

          {/* 3 Metric Cards: Terkumpul, Sisa, Target */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-1">
              <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
                Dana Terkumpul Saat Ini
              </span>
              <div className="text-xl sm:text-2xl font-black text-purple-950 font-mono tabular-nums">
                Rp {member.totalSaved.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-purple-700 font-medium">
                {percent}% dari total target paket
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                Sisa Target Pelunasan
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-950 font-mono tabular-nums">
                Rp {remaining.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-amber-800 font-medium">
                {remaining === 0 ? 'Target paket telah lunas!' : 'Kekurangan dana menuju pelunasan'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Target Harga Paket
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tabular-nums">
                Rp {member.packagePrice.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                Harga resmi flyer katalog 2026-2027
              </div>
            </div>
          </div>

          {/* Main Visual Progress Bar Track with Milestones */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-600">Visualisasi Kemajuan Tabungan Menuju Target</span>
              <span className="font-mono text-purple-900">
                {percent >= 100 ? '✅ Target Terpenuhi 100%' : `${percent}% / 100% Target`}
              </span>
            </div>

            {/* The Visual Progress Bar */}
            <div className="relative">
              {/* Outer track */}
              <div className="w-full bg-slate-100 rounded-2xl h-6 sm:h-7 p-1 border border-slate-200 shadow-inner overflow-hidden relative">
                {/* Fill bar */}
                <div
                  className={`h-full rounded-xl transition-all duration-1000 ease-out flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-white shadow-sm ${
                    percent >= 100
                      ? 'bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-500'
                      : 'bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600'
                  }`}
                  style={{ width: `${Math.max(6, percent)}%` }}
                >
                  {percent >= 15 && (
                    <span className="drop-shadow-xs font-mono">{percent}%</span>
                  )}
                </div>
              </div>

              {/* Milestone Checkpoints (0%, 25%, 50%, 75%, 100%) */}
              <div className="grid grid-cols-5 gap-1 pt-3 text-center">
                {[
                  { label: '0%', text: 'Mulai', pct: 0 },
                  { label: '25%', text: 'Awal Baik', pct: 25 },
                  { label: '50%', text: 'Setengah Jalan', pct: 50 },
                  { label: '75%', text: 'Hampir Tuntas', pct: 75 },
                  { label: '100%', text: 'Lunas & Siap', pct: 100 }
                ].map((m, idx) => {
                  const isReached = percent >= m.pct;
                  return (
                    <div key={m.label} className="flex flex-col items-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-xs ${
                          isReached
                            ? 'bg-purple-700 text-white ring-2 ring-purple-200'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isReached ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[10px] font-bold mt-1 font-mono ${isReached ? 'text-purple-900' : 'text-slate-400'}`}>
                        {m.label}
                      </span>
                      <span className="text-[9px] text-slate-500 hidden sm:block truncate max-w-[80px]">
                        {m.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contextual Projection / Celebration Box */}
          {percent >= 100 ? (
            <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 rounded-2xl p-4 sm:p-5 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/90 text-amber-800 flex items-center justify-center font-black text-xl shrink-0 shadow-sm">
                  🎁
                </div>
                <div>
                  <h4 className="font-black text-base tracking-tight">
                    Alhamdulillah, Target Tabungan Telah 100% LUNAS!
                  </h4>
                  <p className="text-xs text-slate-900 mt-0.5 leading-relaxed font-medium">
                    Paket <strong>{member.packageName}</strong> telah lunas sepenuhnya dan dijadwalkan serah terima pada <strong>{member.pickupDate}</strong> di {member.agentName}.
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenQR}
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-lg shrink-0 flex items-center gap-1.5 transition"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Buka Tiket Pengambilan QR</span>
              </button>
            </div>
          ) : (
            <div className={`rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
              isDueSoon
                ? 'bg-gradient-to-r from-amber-50/90 to-orange-50/70 border-amber-300 shadow-xs'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                  isDueSoon ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isDueSoon ? (
                    <Hourglass className="w-4 h-4 text-amber-900" />
                  ) : (
                    <Clock className="w-4 h-4 text-emerald-800" />
                  )}
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      Estimasi Sisa Menuju Pelunasan: Rp {remaining.toLocaleString('id-ID')}
                    </span>
                    {isDueSoon && (
                      <span className="bg-amber-200 text-amber-950 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-300">
                        Jatuh Tempo &lt; 3 Bulan
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">
                    {isDueSoon ? (
                      <>
                        Waktu penyerahan paket makin dekat dalam <strong className="text-amber-950">±{daysUntilDue} hari</strong> lagi. Disarankan percepat setoran menjadi <strong className="text-slate-900 font-mono">Rp {acceleratedWeeklyRate.toLocaleString('id-ID')}/minggu</strong> (atau <strong className="text-slate-900 font-mono">Rp {acceleratedDailyRate.toLocaleString('id-ID')}/hari</strong>) agar lunas sebelum Idul Fitri.
                      </>
                    ) : (
                      <>
                        Dengan cicilan harian <strong className="text-slate-800 font-mono">Rp {(currentPkg.dailyPayment || 2000).toLocaleString('id-ID')}/hari</strong>, target akan tuntas dalam <strong className="font-mono">± {Math.ceil(remaining / (currentPkg.dailyPayment || 2000))} hari</strong> lagi. Atau cicilan mingguan <strong className="text-slate-800 font-mono">Rp {(currentPkg.weeklyPayment || 14000).toLocaleString('id-ID')}/minggu</strong> (<strong className="font-mono">± {Math.ceil(remaining / (currentPkg.weeklyPayment || 14000))} minggu</strong>).
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={onGoToDeposit}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDueSoon
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-900 hover:to-indigo-900 text-white'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isDueSoon ? '+ Percepat Setoran' : '+ Setor Tabungan'}</span>
                </button>
                <button
                  onClick={() => onOpenPackageDetail(currentPkg)}
                  className="w-full sm:w-auto px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Isi Paket
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Split: Active Package Card & Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Package Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  PAKET TERDAFTAR
                </span>
                <span className="bg-amber-100 text-amber-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                  SP-2027
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{currentPkg.name}</h3>

              <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <img
                  src={currentPkg.imageUrl}
                  alt={currentPkg.name}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="text-xs space-y-1">
                  <p className="text-slate-600 line-clamp-2">{currentPkg.description}</p>
                  <span className="text-[11px] font-semibold text-purple-900">
                    {currentPkg.items.length} macam item eksklusif
                  </span>
                </div>
              </div>

              <div className="text-xs flex justify-between py-1 border-t border-slate-100">
                <span className="text-slate-400">Jadwal Pengambilan:</span>
                <span className="font-bold text-amber-800">{member.pickupDate}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onOpenPackageDetail(currentPkg)}
                className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Rincian Isi Paket
              </button>
              <button
                onClick={onOpenQR}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Lihat Tiket QR</span>
              </button>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-purple-700" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Notifikasi Terbaru
                  </span>
                </div>
                <button
                  onClick={() => alert('Semua riwayat notifikasi WhatsApp & SMS sudah tersinkronisasi.')}
                  className="text-[11px] text-purple-800 font-semibold hover:underline"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Setoran Anda Diverifikasi</span>
                    <span className="text-[10px] text-slate-400">12 Okt 2026</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Setoran sebesar Rp 100.000 (TRX-20261012-001) telah diverifikasi oleh Agen Andi Pratama.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Penyesuaian Jadwal Pengambilan Paket</span>
                    <span className="text-[10px] text-slate-400">10 Okt 2026</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Paket Keluarga 2027 siap diambil di Toko Makmur mulai tanggal 18 Nov 2026 dengan menunjukkan Kode QR.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-900">Promo Spesial Lebaran</span>
                    <span className="text-[10px] text-slate-400">08 Okt 2026</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Dapatkan bonus 1 botol sirup tambahan untuk pelunasan sebelum akhir Oktober 2026!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onGoToDeposit}
              className="w-full py-2.5 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-900 hover:to-indigo-900 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
            >
              + Buat Setoran Baru
            </button>
          </div>
        </div>

        {/* Digital Passbook / History Table */}
        <div id="histori-buku" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Histori Setoran Tabungan (Buku Tabungan Digital)
              </h3>
              <p className="text-xs text-slate-500">
                Catatan seluruh setoran yang telah diserahkan dan diverifikasi
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-purple-600"
              >
                <option value="all">Semua Status</option>
                <option value="Berhasil">Berhasil Diverifikasi</option>
                <option value="Menunggu">Menunggu Verifikasi</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">No Transaksi</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Nominal</th>
                  <th className="py-2.5 px-3">Metode</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-mono font-medium text-slate-800">
                      {tx.invoiceNo}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{tx.date}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-700">{tx.method}</span>
                      {tx.method === 'Tunai Agen' && (
                        <span className="text-[10px] text-slate-400 block">via Andi Pratama</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === 'Berhasil'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : tx.status === 'Menunggu'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onViewKuitansi(tx)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-300 hover:border-purple-500 hover:text-purple-700 rounded-lg text-[11px] font-medium text-slate-700 transition cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        <span>Kuitansi</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
