import React, { useState } from 'react';
import { Agent, Member, Transaction } from '../types/parcel';
import { AGENTS } from '../data/mockData';
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
  onOpenRegister: () => void;
  onOpenScan: () => void;
  onOpenQuickDeposit: (member: Member) => void;
  onOpenQR: (member: Member) => void;
  onOpenCommissionSimulator: () => void;
  agents?: Agent[];
  activeAgentId?: string;
  onSelectAgent?: (agentId: string) => void;
  onLogout?: () => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  members,
  onOpenRegister,
  onOpenScan,
  onOpenQuickDeposit,
  onOpenQR,
  onOpenCommissionSimulator,
  agents = AGENTS,
  activeAgentId,
  onSelectAgent,
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Aktif' | 'Lunas'>('all');
  const [chartRange, setChartRange] = useState<'7' | '30' | '1y'>('30');

  const allAgents = agents && agents.length > 0 ? agents : AGENTS;
  const currentAgent = allAgents.find((a) => a.id === activeAgentId) || allAgents[0];

  // Specific members for this agent (or fallback to all members if none assigned yet)
  const agentSpecificMembers = members.filter((m) => m.agentId === currentAgent.id);
  const displayMembers = agentSpecificMembers.length > 0 ? agentSpecificMembers : members;

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
  const commissionRate = totalPaketTerjual > 100 ? 0.07 : totalPaketTerjual > 50 ? 0.06 : 0.05;
  const estimasiKomisi = Math.round(totalOmset * commissionRate);

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
                <strong className="text-slate-800">{currentAgent.storeName}</strong> · {currentAgent.district}, {currentAgent.regency} · Koordinator: <strong className="text-slate-700">Budi Santoso (Priangan Timur)</strong>
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
              Target kemitraan: 100 Paket
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
            <div className="text-2xl font-black text-amber-700">
              Rp 1.750.000
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                Tier 2 (6% Silver)
              </span>
              <span className="text-blue-600 font-semibold group-hover:underline">
                Rincian &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Chart & Quick Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Grafik Penjualan & Setoran Agen
                </h3>
                <p className="text-xs text-slate-500">
                  Tren perkembangan setoran tabungan masuk di outlet Toko Makmur Ciamis
                </p>
              </div>

              <div className="flex gap-1 text-[11px] bg-slate-100 p-1 rounded-lg font-semibold">
                <button
                  onClick={() => setChartRange('7')}
                  className={`px-2 py-0.5 rounded ${
                    chartRange === '7' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
                  }`}
                >
                  7 Hari
                </button>
                <button
                  onClick={() => setChartRange('30')}
                  className={`px-2 py-0.5 rounded ${
                    chartRange === '30' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
                  }`}
                >
                  30 Hari
                </button>
                <button
                  onClick={() => setChartRange('1y')}
                  className={`px-2 py-0.5 rounded ${
                    chartRange === '1y' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
                  }`}
                >
                  1 Tahun
                </button>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="h-52 w-full pt-4">
              <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
                {/* Horizontal grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#e2e8f0" strokeWidth="1" />

                {/* Curve 1: Penjualan Paket */}
                <path
                  d="M 20 130 Q 120 110 200 70 T 360 40 T 480 50"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Curve 2: Akumulasi Setoran Masuk */}
                <path
                  d="M 20 145 Q 120 130 200 95 T 360 70 T 480 65"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />

                {/* Dots on Curve 1 */}
                <circle cx="20" cy="130" r="4" fill="#059669" />
                <circle cx="200" cy="70" r="4" fill="#059669" />
                <circle cx="360" cy="40" r="4" fill="#059669" />
                <circle cx="480" cy="50" r="5" fill="#059669" />

                {/* Dots on Curve 2 */}
                <circle cx="20" cy="145" r="3.5" fill="#d97706" />
                <circle cx="200" cy="95" r="3.5" fill="#d97706" />
                <circle cx="360" cy="70" r="3.5" fill="#d97706" />
                <circle cx="480" cy="65" r="4" fill="#d97706" />
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                  <span>Penjualan Paket (Rp)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-1 bg-amber-600 inline-block" />
                  <span>Akumulasi Setoran Masuk</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400">Update Real-Time 2026</span>
            </div>
          </div>

          {/* Activities Card & Scan CTA */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Aktivitas Terbaru</h3>
                <span className="text-[11px] text-blue-600 cursor-pointer font-semibold">
                  Lihat Semua
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start space-x-2.5">
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                    <UserPlus className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Member baru mendaftar</span>
                    <span className="text-slate-600">Siti Rahma mendaftar Paket Keluarga 2027</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">12 Okt 2026, 14:31</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Setoran diverifikasi</span>
                    <span className="text-slate-600">Setoran Rp 100.000 Siti Rahma telah divalidasi</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">12 Okt 2026, 14:35</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg shrink-0 mt-0.5">
                    <PackageCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Paket lunas & siap ambil</span>
                    <span className="text-slate-600">Asep Suwandi telah melunasi Paket Sembako</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">14 Okt 2026, 11:20</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenScan}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Scan Pengambilan Member</span>
            </button>
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
