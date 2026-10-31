import React, { useState } from 'react';
import { Agent, Member, Transaction } from '../types/parcel';
import {
  Store,
  Users,
  PackageCheck,
  TrendingUp,
  Coins,
  QrCode,
  UserPlus,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Eye,
  Check,
  ArrowUpRight,
  LogOut
} from 'lucide-react';

interface AgentDashboardProps {
  members: Member[];
  transactions: Transaction[];
  onOpenRegister: () => void;
  onOpenScan: () => void;
  onOpenQuickDeposit: (member: Member) => void;
  onOpenQR: (member: Member) => void;
  onOpenCommissionSimulator: () => void;
  agents: Agent[];
  activeAgentId?: string;
  onSelectAgent?: (agentId: string) => void;
  onLogout?: () => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  members,
  transactions,
  onOpenRegister,
  onOpenScan,
  onOpenQuickDeposit,
  onOpenQR,
  onOpenCommissionSimulator,
  agents,
  activeAgentId,
  onSelectAgent,
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Aktif' | 'Lunas'>('all');
  const allAgents = agents;
  const currentAgent = allAgents.find((a) => a.id === activeAgentId);
  if (!currentAgent) return <div className="min-h-screen flex items-center justify-center p-6 text-center"><div className="max-w-md bg-white rounded-2xl border border-slate-200 p-6"><h1 className="font-bold text-slate-900">Profil agen belum tersedia</h1><p className="text-sm text-slate-600 mt-2">Data agen belum berhasil dimuat dari server. Silakan muat ulang halaman atau hubungi admin.</p></div></div>;

  const agentSpecificMembers = members.filter((m) => m.agentId === currentAgent.id);
  const displayMembers = agentSpecificMembers;
  const agentTransactions = transactions.filter((tx) => tx.agentId === currentAgent.id);
  const verifiedTransactions = agentTransactions.filter((tx) => tx.status === 'Berhasil');
  const verifiedTotal = verifiedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const recentTransactions = agentTransactions.slice(0, 3);

  const filteredMembers = displayMembers.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.memberCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm);
    if (statusFilter === 'all') return matchSearch;
    return matchSearch && m.status === statusFilter;
  });

  const totalOmset = displayMembers.reduce((acc, m) => acc + m.totalSaved, 0);
  const totalPaketTerjual = displayMembers.length;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Agent Profile Header with Switcher */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Halo, {currentAgent.ownerName}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  {currentAgent.code} · {currentAgent.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                <strong className="text-slate-800">{currentAgent.storeName}</strong> · {currentAgent.district}, {currentAgent.regency}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onSelectAgent && allAgents.length > 1 && (
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] text-slate-500 font-semibold px-1 hidden sm:inline">Pilih Agen:</span>
                <select
                  value={currentAgent.id}
                  onChange={(e) => onSelectAgent(e.target.value)}
                  className="bg-white font-medium text-slate-800 px-2 py-1 rounded-lg border border-slate-300 text-xs focus:outline-hidden"
                >
                  {allAgents.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.storeName} ({ag.ownerName})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition"
                title="Keluar dari Dashboard Agen"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            )}

            <button
              onClick={onOpenRegister}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Daftarkan Member</span>
            </button>
            <button
              onClick={() => {
                if (displayMembers.length > 0) onOpenQuickDeposit(displayMembers[0]);
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Input Setoran Tunai</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Total Member Binaan</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{totalPaketTerjual}</div>
            <div className="flex items-center space-x-1 text-xs text-emerald-600 font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Binaan aktif {currentAgent.storeName}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Paket Terdaftar</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <PackageCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{totalPaketTerjual}</div>
            <div className="text-xs text-slate-400 mt-1">
              Total member yang terdaftar
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Penjualan Paket (Omset)</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              Rp {totalOmset.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Akumulasi setoran masuk
            </div>
          </div>

          <div
            onClick={onOpenCommissionSimulator}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Estimasi Komisi Agen</span>
              <div className="p-2 bg-amber-50 group-hover:bg-amber-100 text-amber-600 rounded-lg transition">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="text-base font-black text-amber-700">
              Dihitung setelah verifikasi
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span className="text-slate-600 font-medium">Ketentuan komisi mengikuti perjanjian</span>
              <span className="text-blue-600 font-semibold group-hover:underline">
                Rincian &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Agent summary & recent transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Ringkasan Setoran Terverifikasi</h3>
            <p className="text-2xl font-black text-emerald-700">Rp {verifiedTotal.toLocaleString('id-ID')}</p>
            <p className="text-xs text-slate-500">Berdasarkan {verifiedTransactions.length} transaksi berstatus berhasil pada data akun ini. Grafik tren belum tersedia.</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Transaksi Terbaru</h3>
            {recentTransactions.length ? recentTransactions.map((tx) => (
              <div key={tx.id} className="border-b border-slate-100 pb-2 last:border-0">
                <div className="flex items-center justify-between gap-2 text-xs"><strong className="text-slate-800">{tx.memberName}</strong><span className="text-slate-500">{tx.status}</span></div>
                <p className="text-[11px] text-slate-500">Rp {tx.amount.toLocaleString('id-ID')} · {tx.invoiceNo} · {tx.date}</p>
              </div>
            )) : <p className="text-xs text-slate-500">Belum ada transaksi untuk agen ini.</p>}
          </div>
        </div>

        {/* Member Table Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Daftar Member Binaan Agen</h3>
              <p className="text-xs text-slate-500">
                Kelola data tabungan dan status paket dari member di outlet Anda
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama / kode member..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-semibold"
              >
                <option value="all">Semua Status</option>
                <option value="Aktif">Aktif Menabung</option>
                <option value="Lunas">Lunas (100%)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">No</th>
                  <th className="py-2.5 px-3">Nama Member</th>
                  <th className="py-2.5 px-3">Paket Pilihan</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Tgl Daftar</th>
                  <th className="py-2.5 px-3">Terkumpul</th>
                  <th className="py-2.5 px-3 text-right">Aksi Cepat Agen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((mem, index) => (
                  <tr key={mem.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 text-slate-500">{index + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{mem.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {mem.memberCode} · {mem.phone}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-emerald-800">{mem.packageName}</div>
                      <div className="text-[10px] text-slate-400">
                        Target: Rp {mem.packagePrice.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          mem.status === 'Lunas'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {mem.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{mem.joinDate}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      Rp {mem.totalSaved.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenQuickDeposit(mem)}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded text-[11px] border border-emerald-200"
                        >
                          + Setor
                        </button>
                        <button
                          onClick={() => onOpenQR(mem)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px]"
                        >
                          QR
                        </button>
                        <button
                          onClick={() =>
                            alert(
                              `Detail Member: ${mem.name}\nAlamat: ${mem.address}\nTotal Terkumpul: Rp ${mem.totalSaved.toLocaleString('id-ID')}\nTarget: Rp ${mem.packagePrice.toLocaleString('id-ID')}`
                            )
                          }
                          className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-600 font-semibold rounded text-[11px] border border-slate-200"
                        >
                          Detail
                        </button>
                      </div>
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
