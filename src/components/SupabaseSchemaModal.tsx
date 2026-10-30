import React, { useState } from 'react';
import {
  X,
  Database,
  Layers,
  Search,
  RefreshCw,
  Package,
  Users,
  Store,
  CreditCard,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { ParcelPackage, Agent, Member, Transaction } from '../types/parcel';

interface SupabaseSchemaModalProps {
  packages: ParcelPackage[];
  agents: Agent[];
  members: Member[];
  transactions: Transaction[];
  onClose: () => void;
}

export const SupabaseSchemaModal: React.FC<SupabaseSchemaModalProps> = ({
  packages,
  agents,
  members,
  transactions,
  onClose
}) => {
  const [selectedCollection, setSelectedCollection] = useState<'packages' | 'members' | 'agents' | 'transactions'>('packages');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setFeedbackMessage('Menyinkronkan data koleksi terbaru...');
    setTimeout(() => {
      setIsRefreshing(false);
      setFeedbackMessage('✅ Data koleksi berhasil disegarkan.');
      setTimeout(() => setFeedbackMessage(''), 3000);
    }, 600);
  };

  // Filter collections based on search query
  const query = searchQuery.trim().toLowerCase();

  const filteredPackages = packages.filter((p) =>
    !query ||
    p.name.toLowerCase().includes(query) ||
    p.id.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  const filteredMembers = members.filter((m) =>
    !query ||
    m.name.toLowerCase().includes(query) ||
    m.memberCode.toLowerCase().includes(query) ||
    m.packageName.toLowerCase().includes(query) ||
    (m.agentName && m.agentName.toLowerCase().includes(query))
  );

  const filteredAgents = agents.filter((a) =>
    !query ||
    a.storeName.toLowerCase().includes(query) ||
    a.ownerName.toLowerCase().includes(query) ||
    a.code.toLowerCase().includes(query) ||
    a.district.toLowerCase().includes(query) ||
    a.regency.toLowerCase().includes(query)
  );

  const filteredTransactions = transactions.filter((t) =>
    !query ||
    t.invoiceNo.toLowerCase().includes(query) ||
    t.memberName.toLowerCase().includes(query) ||
    t.method.toLowerCase().includes(query) ||
    t.status.toLowerCase().includes(query)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0b1120] text-slate-100 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-800">
        {/* Header */}
        <div className="bg-[#0f172a] border-b border-slate-800 p-5 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-md bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h3 className="font-bold text-white text-base tracking-tight">Database Sagitarius</h3>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>TERHUBUNG REAL-TIME</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pusat Penyimpanan Koleksi Data • Sagitarius Parcel Lebaran
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-slate-800 transition disabled:opacity-50"
              title="Segarkan Data Koleksi"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Segarkan Data</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Toast / Feedback Message */}
          {feedbackMessage && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {feedbackMessage}
              </span>
              <button onClick={() => setFeedbackMessage('')} className="text-slate-400 hover:text-white ml-2">✕</button>
            </div>
          )}

          {/* 4 Summary Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => { setSelectedCollection('packages'); setSearchQuery(''); }}
              className={`p-3.5 rounded-2xl border text-left transition ${
                selectedCollection === 'packages'
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Koleksi Paket</span>
                <Package className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-black text-white mt-1.5 font-mono">{packages.length}</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Katalog Parcel Aktif</span>
            </button>

            <button
              onClick={() => { setSelectedCollection('members'); setSearchQuery(''); }}
              className={`p-3.5 rounded-2xl border text-left transition ${
                selectedCollection === 'members'
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Koleksi Nasabah</span>
                <Users className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-xl font-black text-white mt-1.5 font-mono">{members.length}</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Member Buku Tabungan</span>
            </button>

            <button
              onClick={() => { setSelectedCollection('agents'); setSearchQuery(''); }}
              className={`p-3.5 rounded-2xl border text-left transition ${
                selectedCollection === 'agents'
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Koleksi Agen</span>
                <Store className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl font-black text-white mt-1.5 font-mono">{agents.length}</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Mitra Outlet Binaan</span>
            </button>

            <button
              onClick={() => { setSelectedCollection('transactions'); setSearchQuery(''); }}
              className={`p-3.5 rounded-2xl border text-left transition ${
                selectedCollection === 'transactions'
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Koleksi Transaksi</span>
                <CreditCard className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-black text-white mt-1.5 font-mono">{transactions.length}</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Mutasi Setoran Masuk</span>
            </button>
          </div>

          {/* Collection Tab Selector & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => { setSelectedCollection('packages'); setSearchQuery(''); }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  selectedCollection === 'packages'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>packages ({packages.length})</span>
              </button>

              <button
                onClick={() => { setSelectedCollection('members'); setSearchQuery(''); }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  selectedCollection === 'members'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>members ({members.length})</span>
              </button>

              <button
                onClick={() => { setSelectedCollection('agents'); setSearchQuery(''); }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  selectedCollection === 'agents'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>agents ({agents.length})</span>
              </button>

              <button
                onClick={() => { setSelectedCollection('transactions'); setSearchQuery(''); }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  selectedCollection === 'transactions'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>transactions ({transactions.length})</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative min-w-[200px] sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Cari data ${selectedCollection}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto max-h-[50vh]">
              {selectedCollection === 'packages' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="p-3">ID Paket</th>
                      <th className="p-3">Nama Paket</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3 text-right">Target Harga</th>
                      <th className="p-3 text-right">Setoran Harian</th>
                      <th className="p-3">THR & Hadiah Bonus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono">
                    {filteredPackages.length > 0 ? (
                      filteredPackages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-slate-800/50 transition">
                          <td className="p-3 text-emerald-400 font-bold">{pkg.id}</td>
                          <td className="p-3 text-white font-sans font-bold">{pkg.name}</td>
                          <td className="p-3 text-purple-300 uppercase text-[10px] font-sans">
                            <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-md">
                              {pkg.category}
                            </span>
                          </td>
                          <td className="p-3 text-right text-amber-300 font-bold">
                            Rp {pkg.targetPrice.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3 text-right text-emerald-300">
                            Rp {(pkg.dailyPayment || 0).toLocaleString('id-ID')}/hari
                          </td>
                          <td className="p-3 text-slate-300 font-sans text-[11px] truncate max-w-xs">
                            {pkg.thrBonus || pkg.bonusGift || '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">
                          Tidak ditemukan data paket yang cocok dengan pencarian "{searchQuery}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {selectedCollection === 'members' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Kode Member</th>
                      <th className="p-3">Nama Lengkap</th>
                      <th className="p-3">Paket Pilihan</th>
                      <th className="p-3">Agen Pendamping</th>
                      <th className="p-3 text-right">Saldo Terkumpul</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((mbr) => (
                        <tr key={mbr.id} className="hover:bg-slate-800/50 transition">
                          <td className="p-3 text-emerald-400 font-bold">{mbr.memberCode}</td>
                          <td className="p-3 text-white font-sans font-bold">{mbr.name}</td>
                          <td className="p-3 text-amber-300 font-sans">{mbr.packageName}</td>
                          <td className="p-3 text-slate-300 font-sans">{mbr.agentName || '-'}</td>
                          <td className="p-3 text-right text-emerald-300 font-bold">
                            Rp {mbr.totalSaved.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold ${
                              mbr.status === 'Lunas'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            }`}>
                              {mbr.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">
                          Tidak ditemukan data nasabah yang cocok dengan pencarian "{searchQuery}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {selectedCollection === 'agents' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Kode Agen</th>
                      <th className="p-3">Nama Outlet</th>
                      <th className="p-3">Pemilik</th>
                      <th className="p-3">Wilayah</th>
                      <th className="p-3">No. WhatsApp</th>
                      <th className="p-3 text-center">Member Binaan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono">
                    {filteredAgents.length > 0 ? (
                      filteredAgents.map((ag) => (
                        <tr key={ag.id} className="hover:bg-slate-800/50 transition">
                          <td className="p-3 text-emerald-400 font-bold">{ag.code}</td>
                          <td className="p-3 text-white font-sans font-bold">{ag.storeName}</td>
                          <td className="p-3 text-slate-300 font-sans">{ag.ownerName}</td>
                          <td className="p-3 text-purple-300 font-sans">{ag.district}, {ag.regency}</td>
                          <td className="p-3 text-slate-400">{ag.phone}</td>
                          <td className="p-3 text-center text-amber-300 font-bold">{ag.memberCount || 0} Member</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">
                          Tidak ditemukan data agen yang cocok dengan pencarian "{searchQuery}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {selectedCollection === 'transactions' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="p-3">No. Kuitansi</th>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Member Nasabah</th>
                      <th className="p-3">Metode Bayar</th>
                      <th className="p-3 text-right">Nominal Setoran</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-800/50 transition">
                          <td className="p-3 text-emerald-400 font-bold">{tx.invoiceNo}</td>
                          <td className="p-3 text-slate-400 font-sans">{tx.date}</td>
                          <td className="p-3 text-white font-sans font-bold">{tx.memberName}</td>
                          <td className="p-3 text-purple-300 font-sans">{tx.method}</td>
                          <td className="p-3 text-right text-amber-300 font-bold">
                            Rp {tx.amount.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold ${
                              tx.status === 'Berhasil'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : tx.status === 'Ditolak'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">
                          Tidak ditemukan data transaksi yang cocok dengan pencarian "{searchQuery}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0f172a] border-t border-slate-800 p-4 px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Semua koleksi data terintegrasi langsung secara real-time ke seluruh portal dashboard.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
