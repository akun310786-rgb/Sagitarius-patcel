import React, { useState } from 'react';
import { AGENTS, KORWIL_REGIONS } from '../data/mockData';
import { Transaction, Agent } from '../types/parcel';
import {
  MapPin,
  Store,
  Users,
  Target,
  BadgeDollarSign,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  TrendingUp,
  Check,
  LogOut
} from 'lucide-react';

interface KorwilDashboardProps {
  pendingTransactions: Transaction[];
  onVerifyKorwil: (txId: string) => void;
  agents?: Agent[];
  onOpenAgentRegister?: () => void;
  onLogout?: () => void;
}

export const KorwilDashboard: React.FC<KorwilDashboardProps> = ({
  pendingTransactions,
  onVerifyKorwil,
  agents = AGENTS,
  onOpenAgentRegister,
  onLogout
}) => {
  const allAgents = agents && agents.length > 0 ? agents : AGENTS;
  const [verifiedList, setVerifiedList] = useState<string[]>([]);

  const handleVerify = (txId: string) => {
    setVerifiedList((prev) => [...prev, txId]);
    onVerifyKorwil(txId);
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Wilayah,Target,Terkumpul,Persentase\n' +
      KORWIL_REGIONS.map(
        (r) => `${r.name},${r.targetAmount},${r.currentAmount},${Math.round((r.currentAmount / r.targetAmount) * 100)}%`
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'laporan_wilayah_priangan_timur_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingList = pendingTransactions.filter((tx) => !verifiedList.includes(tx.id));

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Korwil Profile Header */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900">Halo, Budi Santoso</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Korwil Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Koordinator Wilayah ·{' '}
                <strong className="text-slate-700">Jawa Barat (Priangan Timur)</strong> · Kode:{' '}
                <span className="font-mono">KW-01</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-1.5 px-3 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition"
                title="Keluar dari Dashboard Korwil"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            )}
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Download className="w-4 h-4 text-purple-300" />
              <span>Export Laporan Wilayah</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Total Agen Binaan</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{allAgents.length}</div>
            <div className="text-xs text-slate-400 mt-1">Tersebar di 5 Kab/Kota Jabar</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Total Member Wilayah</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">540</div>
            <div className="text-xs text-slate-400 mt-1">Total peserta aktif tahun 2026/2027</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Target Realisasi Wilayah</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">Rp 210.000.000</div>
            <div className="text-xs text-slate-400 mt-1">Target akumulasi wilayah</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Dana Terkumpul Wilayah</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <BadgeDollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700">Rp 160.000.000</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              76.1% tercapai per Oktober 2026
            </div>
          </div>
        </div>

        {/* Regional Performance Progress Meters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Performa Wilayah Priangan Timur</h3>
            <p className="text-xs text-slate-500">
              Pencapaian setoran tabungan berdasarkan kabupaten & kota
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {KORWIL_REGIONS.map((reg) => {
              const pct = Math.round((reg.currentAmount / reg.targetAmount) * 100);
              return (
                <div key={reg.id} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800">{reg.name}</span>
                    <span className="text-slate-600">
                      <strong className="text-emerald-700">
                        Rp {reg.currentAmount.toLocaleString('id-ID')}
                      </strong>{' '}
                      / Rp {reg.targetAmount.toLocaleString('id-ID')} ({pct}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 p-0.5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daftar Agen Binaan Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daftar Agen Binaan</h3>
              <p className="text-xs text-slate-500">
                Performa dan status outlet aktif di bawah supervisi Anda
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-purple-50 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                {allAgents.length} Agen Terdaftar
              </span>
              {onOpenAgentRegister && (
                <button
                  onClick={onOpenAgentRegister}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-lg text-xs shadow-xs transition"
                >
                  + Daftarkan Agen Baru
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">Kode & Nama Outlet</th>
                  <th className="py-2.5 px-3">Pemilik & Wilayah</th>
                  <th className="py-2.5 px-3 text-center">Member</th>
                  <th className="py-2.5 px-3 text-right">Omset</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{agent.storeName}</div>
                      <div className="text-[10px] font-mono text-blue-700 font-semibold">
                        {agent.code}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{agent.ownerName}</div>
                      <div className="text-[11px] text-slate-500">
                        {agent.district}, {agent.regency}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700">
                      {agent.memberCount}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-800">
                      Rp {agent.totalOmset.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {agent.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaksi Setoran Menunggu Verifikasi Korwil */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-amber-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Transaksi Setoran Menunggu Verifikasi Korwil
                </h3>
                <p className="text-xs text-slate-500">
                  Penyetoran transfer bank yang memerlukan verifikasi kelayakan sebelum diteruskan ke admin pusat
                </p>
              </div>
            </div>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {pendingList.length} Menunggu
            </span>
          </div>

          {pendingList.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl text-xs text-slate-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-semibold text-slate-700">Semua setoran wilayah telah diverifikasi!</p>
              <p className="text-[11px] text-slate-400">Tidak ada transaksi yang tertunda saat ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                    <th className="py-2.5 px-3">No Invoice</th>
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3">Paket</th>
                    <th className="py-2.5 px-3">Nominal</th>
                    <th className="py-2.5 px-3">Metode</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3 text-right">Aksi Korwil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingList.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {tx.invoiceNo}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{tx.memberName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{tx.memberCode}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{tx.packageName}</td>
                      <td className="py-3 px-3 font-bold text-emerald-800">
                        Rp {tx.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{tx.method}</td>
                      <td className="py-3 px-3 text-slate-500">{tx.date}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleVerify(tx.id)}
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition"
                        >
                          Verifikasi Cepat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
