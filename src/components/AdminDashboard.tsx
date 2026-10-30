import React, { useState } from 'react';
import { Transaction, ParcelPackage, Agent, Member, AdminAccount } from '../types/parcel';
import { PACKAGES, AGENTS, INITIAL_ADMINS } from '../data/mockData';
import { AdminManagerModal } from './AdminManagerModal';
import {
  ShieldAlert,
  Users,
  Store,
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
  XCircle,
  PackageCheck,
  Truck,
  RotateCcw,
  Search,
  Filter,
  FileText,
  Database,
  Plus,
  Edit2,
  Package,
  Gift,
  Banknote,
  Boxes,
  Sparkles,
  Layers,
  CreditCard,
  Building2,
  UserPlus,
  LogOut,
  ShieldCheck,
  KeyRound,
  Mail,
  Phone,
  Power,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminDashboardProps {
  transactions: Transaction[];
  packages?: ParcelPackage[];
  agents?: Agent[];
  members?: Member[];
  adminAccounts?: AdminAccount[];
  onAddAdminAccount?: (newAdmin: AdminAccount) => void;
  onToggleAdminStatus?: (id: string) => void;
  onDeleteAdminAccount?: (id: string) => void;
  onApproveTransaction: (txId: string) => void;
  onRejectTransaction: (txId: string) => void;
  onViewKuitansi: (tx: Transaction) => void;
  onOpenCatalogManager: () => void;
  onOpenSupabaseConsole: () => void;
  onOpenAgentRegistration?: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  transactions,
  packages = PACKAGES,
  agents = AGENTS,
  members = [],
  adminAccounts = INITIAL_ADMINS,
  onAddAdminAccount,
  onToggleAdminStatus,
  onDeleteAdminAccount,
  onApproveTransaction,
  onRejectTransaction,
  onViewKuitansi,
  onOpenCatalogManager,
  onOpenSupabaseConsole,
  onOpenAgentRegistration,
  onLogout
}) => {
  const [adminTab, setAdminTab] = useState<'transaksi' | 'katalog' | 'agen' | 'logistik' | 'admins'>('transaksi');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Menunggu' | 'Berhasil' | 'Ditolak'>('all');
  const [catalogCategory, setCatalogCategory] = useState<string>('all');
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [agentSearch, setAgentSearch] = useState<string>('');

  const allAgents = agents && agents.length > 0 ? agents : AGENTS;

  const allPackages = packages && packages.length > 0 ? packages : PACKAGES;

  const filteredCatalog = allPackages.filter((pkg) => {
    const matchCat = catalogCategory === 'all' || pkg.category === catalogCategory;
    const matchSearch =
      pkg.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      pkg.items.some((it) => it.toLowerCase().includes(catalogSearch.toLowerCase()));
    return matchCat && matchSearch;
  });

  const filteredTransactions = transactions.filter((tx) => {
    const matchSearch =
      tx.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.memberCode.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'all') return matchSearch;
    return matchSearch && tx.status === statusFilter;
  });

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Invoice,Member,ID,Paket,Nominal,Metode,Status,Tanggal\n' +
      transactions
        .map(
          (t) =>
            `${t.invoiceNo},${t.memberName},${t.memberCode},${t.packageName},${t.amount},${t.method},${t.status},${t.date}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sagitarius_rekap_pusat_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Admin Header */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-700 text-white flex items-center justify-center shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900">Selamat Datang, Admin Pusat</h1>
                <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Super Admin HQ
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                PT. Sagitarius Trinunggal Karya · Kantor Pusat Operasional Nasional · ID:{' '}
                <span className="font-mono font-semibold">ADM-HQ-001</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs transition"
              title="Kelola Akun Admin & Tambah Akun Baru"
            >
              <ShieldCheck className="w-4 h-4 text-rose-200" />
              <span>+ Kelola & Tambah Admin</span>
            </button>

            <button
              onClick={onOpenCatalogManager}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <PackageCheck className="w-4 h-4 text-emerald-300" />
              <span>+ Tambah / Edit Paket</span>
            </button>

            <button
              onClick={onOpenSupabaseConsole}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold shadow-xs transition"
              title="Lihat Database Sagitarius"
            >
              <Database className="w-4 h-4" />
              <span>Lihat Database</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export CSV</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition"
                title="Keluar dari Dashboard Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setAdminTab('transaksi')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              adminTab === 'transaksi'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Verifikasi Setoran & Transaksi</span>
          </button>

          <button
            onClick={() => setAdminTab('katalog')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              adminTab === 'katalog'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-300'
            }`}
          >
            <Boxes className="w-4 h-4 text-amber-400" />
            <span>Kelola Paket & Komposisi ({allPackages.length})</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.5 rounded-md font-black">
              Flyer
            </span>
          </button>

          <button
            onClick={() => setAdminTab('agen')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              adminTab === 'agen'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white text-blue-900 hover:bg-blue-50 border border-blue-200'
            }`}
          >
            <Store className="w-4 h-4 text-blue-400" />
            <span>Mitra Agen & Jaringan ({allAgents.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('logistik')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              adminTab === 'logistik'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Gudang & Logistik Distribusi</span>
          </button>

          <button
            onClick={() => setAdminTab('admins')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              adminTab === 'admins'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-white text-rose-800 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-500" />
            <span>Akun Admin ({adminAccounts.length})</span>
          </button>
        </div>

        {/* TAB 1: TRANSAKSI & VERIFIKASI */}
        {adminTab === 'transaksi' && (
          <div className="space-y-6">
            {/* 4 Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Total Member Nasional</span>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">8.542</div>
                <div className="flex items-center space-x-1 text-xs text-emerald-600 font-medium mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% dari tahun lalu</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Total Agen Binaan</span>
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Store className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">246</div>
                <div className="text-xs text-slate-400 mt-1">Terverifikasi & Aktif</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Target Omset Keseluruhan</span>
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">Rp 2.9 Miliar</div>
                <div className="text-xs text-slate-400 mt-1">Target akumulasi paket 2027</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Total Dana Tabungan Terkumpul</span>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-700">Rp 2.4 Miliar</div>
                <div className="text-xs text-emerald-600 font-medium mt-1">
                  84.0% terhimpun aman di rekening
                </div>
              </div>
            </div>

            {/* Growth Chart & Verification Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly Growth Trend */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Grafik Tren Pertumbuhan Tabungan Bulanan
                    </h3>
                    <p className="text-xs text-slate-500">
                      Total akumulasi dana setoran tabungan masuk per bulan (Jan - Okt 2026)
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Tahun Buku 2026
                  </span>
                </div>

                {/* Custom SVG Area Growth Chart */}
                <div className="h-48 w-full pt-2">
                  <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="adminGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal reference lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f5f9" strokeWidth="1" />

                    {/* Area fill */}
                    <path
                      d="M 20 120 L 70 115 L 120 105 L 170 95 L 220 85 L 270 75 L 320 62 L 370 50 L 420 40 L 480 25 L 480 145 L 20 145 Z"
                      fill="url(#adminGradient)"
                    />

                    {/* Growth Line */}
                    <path
                      d="M 20 120 L 70 115 L 120 105 L 170 95 L 220 85 L 270 75 L 320 62 L 370 50 L 420 40 L 480 25"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Target Dashed Line */}
                    <line
                      x1="20"
                      y1="110"
                      x2="480"
                      y2="35"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    {/* Data points */}
                    <circle cx="20" cy="120" r="4" fill="#059669" />
                    <circle cx="170" cy="95" r="4" fill="#059669" />
                    <circle cx="320" cy="62" r="4" fill="#059669" />
                    <circle cx="480" cy="25" r="5" fill="#059669" />
                  </svg>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>Mei</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Agu</span>
                  <span>Sep</span>
                  <span className="text-emerald-700 font-bold">Okt</span>
                </div>
              </div>

              {/* Verification Ratio Donut */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Status Verifikasi Setoran</h3>
                  <p className="text-xs text-slate-500">
                    Distribusi status seluruh transaksi yang masuk ke sistem
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center py-2">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {/* Background Circle */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                      {/* Verified: 78% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#059669"
                        strokeWidth="12"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 * (1 - 0.78)}
                        strokeLinecap="round"
                      />
                      {/* Pending: 15% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#f59e0b"
                        strokeWidth="12"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 * (1 - 0.15)}
                        strokeLinecap="round"
                        className="opacity-70"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-xl font-black text-slate-900">78%</span>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Lolos Cek</span>
                    </div>
                  </div>

                  <div className="w-full space-y-2 mt-4 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                        <span className="text-slate-600">Terverifikasi Resmi</span>
                      </div>
                      <span className="font-bold text-slate-800">78% (6.662)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                        <span className="text-slate-600">Menunggu Verifikasi</span>
                      </div>
                      <span className="font-bold text-slate-800">15% (1.281)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                        <span className="text-slate-600">Dibatalkan / Revisi</span>
                      </div>
                      <span className="font-bold text-slate-800">7% (599)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Approval & Verification Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Verifikasi Pembayaran & Setoran Member Masuk
                  </h3>
                  <p className="text-xs text-slate-500">
                    Persetujuan langsung setoran bank dan tunai dari seluruh agen binaan
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari invoice / nama..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-semibold"
                  >
                    <option value="all">Semua Status</option>
                    <option value="Menunggu">Menunggu Verifikasi</option>
                    <option value="Berhasil">Berhasil</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                      <th className="py-2.5 px-3">No Invoice</th>
                      <th className="py-2.5 px-3">Member & ID</th>
                      <th className="py-2.5 px-3">Paket</th>
                      <th className="py-2.5 px-3">Nominal</th>
                      <th className="py-2.5 px-3">Metode</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Aksi Verifikasi Super Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">
                          {tx.invoiceNo}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{tx.memberName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{tx.memberCode}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-700">{tx.packageName}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          Rp {tx.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{tx.method}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.status === 'Berhasil'
                                ? 'bg-emerald-100 text-emerald-800'
                                : tx.status === 'Menunggu'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {tx.status === 'Menunggu' ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => onApproveTransaction(tx.id)}
                                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow-xs transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => onRejectTransaction(tx.id)}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs shadow-xs transition"
                              >
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => onViewKuitansi(tx)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 rounded-lg text-[11px] font-medium text-slate-700 transition"
                            >
                              <FileText className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Kuitansi</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PANEL MANAJEMEN KATALOG & TAMBAH/EDIT PAKET (FITUR UTAMA ADMIN) */}
        {adminTab === 'katalog' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Panel Katalog */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-700/50">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center space-x-2 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  <PackageCheck className="w-4 h-4 text-slate-950" />
                  <span>PUSAT KENDALI PRODUK & PAKET LEBARAN HQ</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Panel Manajemen Katalog & Komposisi Paket Lebaran
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Di panel ini Anda dapat <strong>mengedit harga paket, target tabungan, setoran harian (Rp/hari)</strong>, bonus THR tunai, hadiah langsung (Koper Dewasa/Container Box), serta <strong>menambahkan paket baru</strong> yang langsung sinkron ke Website Publik dan Portal Member.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button
                  onClick={onOpenCatalogManager}
                  className="px-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center space-x-2 transition transform active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Paket Baru</span>
                </button>
                <button
                  onClick={onOpenCatalogManager}
                  className="px-5 py-3.5 bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm border border-emerald-500/50 flex items-center justify-center space-x-2 transition"
                >
                  <Edit2 className="w-4 h-4 text-emerald-300" />
                  <span>Buka Form Edit Lengkap</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar for Packages */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                <button
                  onClick={() => setCatalogCategory('all')}
                  className={`px-3 py-2 rounded-xl transition ${
                    catalogCategory === 'all'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Semua ({allPackages.length})
                </button>
                <button
                  onClick={() => setCatalogCategory('bunda')}
                  className={`px-3 py-2 rounded-xl transition ${
                    catalogCategory === 'bunda'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Paket Bunda (4)
                </button>
                <button
                  onClick={() => setCatalogCategory('anak')}
                  className={`px-3 py-2 rounded-xl transition ${
                    catalogCategory === 'anak'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Paket Anak (4)
                </button>
                <button
                  onClick={() => setCatalogCategory('pilihan')}
                  className={`px-3 py-2 rounded-xl transition ${
                    catalogCategory === 'pilihan'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Paket Pilihan (2)
                </button>
              </div>

              <div className="relative min-w-[260px]">
                <input
                  type="text"
                  placeholder="Cari nama paket atau item kue/sembako..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Packages Grid with Direct Edit Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalog.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Image and Badges */}
                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md shadow">
                        {pkg.tag}
                      </div>
                      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        {pkg.durationDays || 325} Hari Menabung
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          Paket {pkg.category.toUpperCase()}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 font-mono">
                          {pkg.weight}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-slate-900 leading-tight">
                        {pkg.name}
                      </h3>

                      {/* Flyer Bonuses */}
                      <div className="space-y-1.5 text-xs pt-1">
                        {pkg.thrBonus && (
                          <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 flex items-center space-x-2">
                            <Banknote className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span className="text-[11px] text-amber-900 font-bold truncate">
                              {pkg.thrBonus}
                            </span>
                          </div>
                        )}
                        {pkg.bonusGift && (
                          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center space-x-2">
                            <Gift className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span className="text-[11px] text-emerald-900 font-bold truncate">
                              {pkg.bonusGift}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pricing Specs */}
                      <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Target Pelunasan:</span>
                          <span className="text-sm font-black text-slate-900 font-mono">
                            Rp {pkg.targetPrice.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Setoran Harian:</span>
                          <span className="text-xs font-black text-emerald-700 font-mono">
                            Rp {pkg.dailyPayment?.toLocaleString('id-ID') || Math.round(pkg.weeklyPayment / 7).toLocaleString('id-ID')}/hari
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">
                          Isi Parcel ({pkg.items.length} Komoditas):
                        </span>
                        {pkg.items.slice(0, 2).map((it, idx) => (
                          <div key={idx} className="flex items-center space-x-1.5 text-slate-700 truncate">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate text-[11px]">{it}</span>
                          </div>
                        ))}
                        {pkg.items.length > 2 && (
                          <span className="text-[10px] text-emerald-700 font-bold block pt-0.5">
                            +{pkg.items.length - 2} item lainnya...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Direct Edit Button */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={onOpenCatalogManager}
                      className="w-full py-2.5 bg-slate-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Edit & Kustomisasi Paket Ini</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Helper Note for Admin */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-xs text-emerald-900">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Sinkronisasi Otomatis Seluruh Sistem:</strong>
                <span>
                  Setiap kali Admin Pusat menambah, mengedit toples kue, sembako, atau menyesuaikan cicilan harian pada sebuah paket, seluruh perubahannya akan otomatis langsung tampil di Website Publik, Form Pendaftaran Member, dan Buku Tabungan Digital para peserta.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MITRA AGEN & JARINGAN DISTRIBUSI */}
        {adminTab === 'agen' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Toolbar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Jaringan Kemitraan Toko & Agen Binaan Sagitarius
                  </h3>
                  <p className="text-xs text-slate-500">
                    Total {allAgents.length} outlet terdaftar di bawah supervisi Koordinator Wilayah Priangan Timur
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari toko, pemilik, atau wilayah..."
                    value={agentSearch}
                    onChange={(e) => setAgentSearch(e.target.value)}
                    className="pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-56 sm:w-64"
                  />
                </div>

                {onOpenAgentRegistration && (
                  <button
                    onClick={onOpenAgentRegistration}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Daftarkan Agen Baru</span>
                  </button>
                )}
              </div>
            </div>

            {/* Agen Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/80">
                      <th className="py-3 px-4">Kode & Nama Outlet</th>
                      <th className="py-3 px-4">Pemilik & Kontak</th>
                      <th className="py-3 px-4">Wilayah Operasional</th>
                      <th className="py-3 px-4 text-center">Member Binaan</th>
                      <th className="py-3 px-4 text-right">Akumulasi Omset</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allAgents
                      .filter((ag) => {
                        const q = agentSearch.toLowerCase();
                        return (
                          ag.storeName.toLowerCase().includes(q) ||
                          ag.ownerName.toLowerCase().includes(q) ||
                          ag.regency.toLowerCase().includes(q) ||
                          ag.district.toLowerCase().includes(q) ||
                          ag.code.toLowerCase().includes(q)
                        );
                      })
                      .map((agent) => (
                        <tr key={agent.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 text-sm">{agent.storeName}</div>
                            <div className="text-[11px] font-mono text-blue-700 font-bold">
                              {agent.code}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">{agent.ownerName}</div>
                            <div className="text-[11px] font-mono text-slate-500">{agent.phone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-700">{agent.district}</div>
                            <div className="text-[11px] text-slate-400">{agent.regency}</div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-800 text-sm">
                            {agent.memberCount}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-800 text-sm">
                            Rp {agent.totalOmset.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {agent.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GUDANG & LOGISTIK DISTRIBUSI */}
        {adminTab === 'logistik' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 4 Warehouse & Logistics Status Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Dalam Pengepakan Gudang</span>
                  <span className="text-2xl font-black text-slate-900">140 Paket</span>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <PackageCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Sedang Didistribusikan</span>
                  <span className="text-2xl font-black text-blue-700">564 Paket</span>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Truck className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Selesai / Diterima Member</span>
                  <span className="text-2xl font-black text-emerald-700">1.580 Paket</span>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Dibatalkan / Retur</span>
                  <span className="text-2xl font-black text-rose-600">22 Paket</span>
                </div>
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                  <RotateCcw className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900">Jadwal & Standar Distribusi Gudang Pusat</h3>
              <p className="text-xs text-slate-500">
                Penyaluran logistik parcel ke 246 Agen Binaan di Priangan Timur (Tasikmalaya, Ciamis, Banjar, Pangandaran, Garut).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-bold">1. Paket Uang (Lebih Awal)</strong>
                  <p className="text-slate-600">
                    Pencairan paket uang munggahan dilakukan sebelum Ramadhan, dan paket uang lebaran disalurkan paling lambat 15 Ramadhan.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-bold">2. Paket Barang & Sembako (H-7)</strong>
                  <p className="text-slate-600">
                    Pengambilan serentak menggunakan QR Code digital yang dipindai oleh Agen Binaan resmi.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-bold">3. Daging Sapi & Telur (H-2)</strong>
                  <p className="text-slate-600">
                    Untuk menjaga kesegaran daging dan telur satuan, penyaluran dilakukan khusus pada H-2 menjelang malam takbiran.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: KELOLA AKUN ADMIN */}
        {adminTab === 'admins' && (
          <div className="space-y-6">
            {/* Admin Header Action Card */}
            <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 border border-rose-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Sistem Hak Akses & Keamanan
                  </span>
                  <span className="text-xs text-slate-400">• Total {adminAccounts.length} Akun</span>
                </div>
                <h2 className="text-xl font-black text-white">Kelola Akun Admin Sagitarius Parcel</h2>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Admin dapat masuk melalui portal login manapun (baik tab Member maupun Mitra Agen). Cukup masukkan Username atau Email beserta Password akun di bawah ini.
                </p>
              </div>

              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="px-5 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold rounded-2xl text-xs flex items-center space-x-2 shadow-lg transition shrink-0 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Tambah Akun Admin Baru</span>
              </button>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Total Akun Terdaftar</span>
                  <span className="text-2xl font-black text-slate-900">{adminAccounts.length} Akun</span>
                </div>
                <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Super Admin HQ</span>
                  <span className="text-2xl font-black text-rose-700">
                    {adminAccounts.filter((a) => a.role === 'superadmin').length} Akun
                  </span>
                </div>
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Status Akun Aktif</span>
                  <span className="text-2xl font-black text-emerald-700">
                    {adminAccounts.filter((a) => a.status === 'Aktif').length} Aktif
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Admin Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminAccounts.map((adm) => {
                const isPrimary = adm.username === 'admin';
                const isRevealed = revealedPasswords[adm.id] || false;

                return (
                  <div
                    key={adm.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm ${
                            adm.role === 'superadmin'
                              ? 'bg-gradient-to-br from-amber-500 to-rose-600 text-white'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {adm.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <h4 className="font-bold text-slate-900 text-sm">{adm.name}</h4>
                              {isPrimary && (
                                <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                                  Utama
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 font-mono">@{adm.username}</span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          adm.role === 'superadmin'
                            ? 'bg-rose-100 text-rose-800'
                            : adm.role === 'finance'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}>
                          {adm.roleLabel || adm.role}
                        </span>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Mail className="w-3.5 h-3.5" /> Email:
                          </span>
                          <span className="font-semibold text-slate-800 truncate max-w-[170px]">{adm.email}</span>
                        </div>

                        <div className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1 text-slate-400">
                            <KeyRound className="w-3.5 h-3.5" /> Password:
                          </span>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono font-bold text-slate-900">
                              {isRevealed ? adm.password : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setRevealedPasswords((prev) => ({ ...prev, [adm.id]: !prev[adm.id] }))}
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                              title={isRevealed ? 'Sembunyikan' : 'Tampilkan'}
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {adm.phone && (
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-1 text-slate-400">
                              <Phone className="w-3.5 h-3.5" /> WhatsApp:
                            </span>
                            <span className="font-medium text-slate-700">{adm.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${adm.status === 'Aktif' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="text-slate-500 font-medium">
                          Status: <strong className={adm.status === 'Aktif' ? 'text-emerald-700' : 'text-rose-700'}>{adm.status}</strong>
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {onToggleAdminStatus && !isPrimary && (
                          <button
                            onClick={() => onToggleAdminStatus(adm.id)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition"
                            title="Ubah Status Aktif/Nonaktif"
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        )}
                        {onDeleteAdminAccount && !isPrimary && (
                          <button
                            onClick={() => {
                              if (confirm(`Hapus akun admin ${adm.name}?`)) {
                                onDeleteAdminAccount(adm.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                            title="Hapus Akun"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Admin Manager Modal */}
      {isAdminModalOpen && (
        <AdminManagerModal
          onClose={() => setIsAdminModalOpen(false)}
          adminAccounts={adminAccounts}
          onAddAdmin={(newAdm) => {
            if (onAddAdminAccount) onAddAdminAccount(newAdm);
          }}
          onToggleStatus={onToggleAdminStatus}
          onDeleteAdmin={onDeleteAdminAccount}
        />
      )}
    </div>
  );
};
