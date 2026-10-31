import React from 'react';
import { Transaction, Agent, Member } from '../types/parcel';
import {
  MapPin,
  Store,
  Users,
  Target,
  BadgeDollarSign,
  Download,
  CheckCircle2,
  FileCheck2,
  LogOut
} from 'lucide-react';

interface KorwilDashboardProps {
  pendingTransactions: Transaction[];
  transactions: Transaction[];
  members: Member[];
  name: string;
  onVerifyKorwil: (txId: string) => void;
  agents?: Agent[];
  onOpenAgentRegister?: () => void;
  onLogout?: () => void;
}

export const KorwilDashboard: React.FC<KorwilDashboardProps> = ({
  pendingTransactions,
  transactions,
  members,
  name,
  onVerifyKorwil,
  agents = [],
  onOpenAgentRegister,
  onLogout
}) => {
  const allAgents = agents;
  const handleVerify = (txId: string) => {
    onVerifyKorwil(txId);
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Agen,Member,Setoran berhasil\n' +
      allAgents.map((agent) => {
        const memberCount = members.filter((member) => member.agentId === agent.id).length;
        const total = transactions.filter((tx) => tx.agentId === agent.id && tx.status === 'Berhasil').reduce((sum, tx) => sum + tx.amount, 0);
        return `${agent.storeName},${memberCount},${total}`;
      }).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'laporan-wilayah.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingList = pendingTransactions;
  const verifiedTransactions = transactions.filter((tx) => tx.status === 'Berhasil');
  const verifiedTotal = verifiedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const memberCount = members.length;

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
                <h1 className="text-xl font-bold text-slate-900">Halo, {name}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Korwil Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Koordinator Wilayah · Data sesuai cakupan akun Anda
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
            <div className="text-xs text-slate-400 mt-1">Agen yang tersedia pada akun</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Total Member Wilayah</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{memberCount}</div>
            <div className="text-xs text-slate-400 mt-1">Member pada data akun</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Setoran Menunggu</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{pendingList.length}</div>
            <div className="text-xs text-slate-400 mt-1">Transaksi menunggu verifikasi</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Setoran Berhasil</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <BadgeDollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700">Rp {verifiedTotal.toLocaleString('id-ID')}</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">Total transaksi berhasil</div>
          </div>
        </div>

        {/* Regional Performance Progress Meters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Ringkasan Wilayah</h3>
            <p className="text-xs text-slate-500">
              Ringkasan realisasi berdasarkan transaksi yang berhasil diverifikasi
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {allAgents.map((agent) => {
              const total = transactions.filter((tx) => tx.agentId === agent.id && tx.status === 'Berhasil').reduce((sum, tx) => sum + tx.amount, 0);
              return (
                <div key={agent.id} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800">{agent.storeName} · {agent.regency}</span>
                    <strong className="text-emerald-700">Rp {total.toLocaleString('id-ID')}</strong>
                  </div>
                </div>
              );
            })}
            {!allAgents.length && <p className="text-xs text-slate-500">Belum ada agen dalam data akun.</p>}
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
                      {members.filter((member) => member.agentId === agent.id).length}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-800">
                      Rp {transactions.filter((tx) => tx.agentId === agent.id && tx.status === 'Berhasil').reduce((sum, tx) => sum + tx.amount, 0).toLocaleString('id-ID')}
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
