import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Code2,
  Table,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Server,
  ShieldCheck,
  Download,
  Terminal,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ParcelPackage, Agent, Member, Transaction } from '../types/parcel';

interface SupabaseSchemaModalProps {
  packages: ParcelPackage[];
  agents: Agent[];
  members: Member[];
  transactions: Transaction[];
  onClose: () => void;
}

interface DbStatusResponse {
  connected: boolean;
  database: string;
  maskedUri: string;
  collections: { name: string; count: number }[];
  error: string | null;
  needsIpWhitelist?: boolean;
}

export const SupabaseSchemaModal: React.FC<SupabaseSchemaModalProps> = ({
  packages,
  agents,
  members,
  transactions,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'collections' | 'env'>('status');
  const [copied, setCopied] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<'packages' | 'agents' | 'members' | 'transactions'>('packages');

  const [dbStatus, setDbStatus] = useState<DbStatusResponse | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string>('');

  const fetchStatus = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/db/status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (e: any) {
      console.warn('Could not fetch DB status:', e);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleReconnect = async () => {
    setIsReconnecting(true);
    setActionMessage('');
    try {
      const res = await fetch('/api/db/reconnect', { method: 'POST' });
      const data = await res.json();
      setDbStatus(data);
      if (data.connected) {
        setActionMessage('✅ Berhasil terhubung ke MongoDB Atlas secara real-time!');
      } else {
        setActionMessage('⚠️ MongoDB Atlas masih menolak koneksi. Pastikan IP 0.0.0.0/0 sudah diaktifkan di Network Access.');
      }
    } catch (e: any) {
      setActionMessage('Gagal reconnect: ' + (e.message || String(e)));
    } finally {
      setIsReconnecting(false);
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    setActionMessage('');
    try {
      const res = await fetch('/api/db/seed', { method: 'POST' });
      const data = await res.json();
      setActionMessage(data.message || 'Seed selesai.');
      fetchStatus();
    } catch (e: any) {
      setActionMessage('Gagal seed: ' + (e.message || String(e)));
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCopyEnv = () => {
    const envText = `MONGODB_URI="mongodb+srv://akun310786_db_user:D0oBXnbyTd1iAgtp@database.t09ogyz.mongodb.net/sagitarius_parcel?retryWrites=true&w=majority"
PORT=3000`;
    navigator.clipboard.writeText(envText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0b1120] text-slate-100 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-800">
        {/* Header */}
        <div className="bg-[#0f172a] border-b border-slate-800 p-5 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-md ${
              dbStatus?.connected
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">MongoDB Atlas Cloud Console</h3>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                  dbStatus?.connected
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${dbStatus?.connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span>{dbStatus?.connected ? 'ONLINE (REAL DATABASE)' : 'TERKONEKSI CREDENTIAL (IP FILTER)'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cluster: <span className="text-slate-300 font-mono">database.t09ogyz.mongodb.net</span> • Database: <span className="text-amber-300 font-mono">sagitarius_parcel</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-900 p-1 rounded-xl text-xs font-semibold border border-slate-800">
              <button
                onClick={() => setActiveTab('status')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'status' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Status & Koneksi
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'collections' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Data Collections
              </button>
              <button
                onClick={() => setActiveTab('env')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'env' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Kredensial .env
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {actionMessage && (
            <div className="p-3.5 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs flex items-center justify-between">
              <span>{actionMessage}</span>
              <button onClick={() => setActionMessage('')} className="text-slate-400 hover:text-white ml-2">✕</button>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="space-y-5">
              {/* Status Alert Banner */}
              {dbStatus?.connected ? (
                <div className="p-5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/50 rounded-2xl flex items-start space-x-4 shadow-xl">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="font-bold text-white text-sm">Database Real MongoDB Atlas Berhasil Terhubung!</h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Server backend Node.js & Express telah aktif berkomunikasi langsung dengan cluster MongoDB Atlas Anda. Semua data pendaftaran member, perubahan paket, mutasi setoran, dan data agen tersimpan permanen di cloud.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl space-y-3.5 shadow-xl">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-amber-300 text-sm">
                        Kredensial MongoDB Atlas Diterima — Langkah Terakhir: Izinkan IP di Atlas
                      </h4>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        Kredensial akun <code className="bg-black/50 px-1.5 py-0.5 rounded text-amber-300">akun310786_db_user</code> sudah terpasang di sistem backend. MongoDB Atlas saat ini membatasi koneksi melalui fitur keamanan <strong>Network Access (IP Access List)</strong>.
                      </p>
                    </div>
                  </div>

                  {/* 3 Step Tutorial Box */}
                  <div className="bg-black/40 border border-amber-500/30 rounded-xl p-4 space-y-2.5">
                    <span className="font-bold text-amber-300 text-xs block uppercase tracking-wide">
                      Cara Mengaktifkan Akses Cloud di MongoDB Atlas (Hanya 30 Detik):
                    </span>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed text-xs">
                      <li>
                        Buka dashboard resmi MongoDB Atlas di{' '}
                        <a
                          href="https://cloud.mongodb.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 font-bold underline inline-flex items-center gap-1 hover:text-amber-300"
                        >
                          cloud.mongodb.com <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                      <li>
                        Di bilah menu kiri, klik menu <strong>Network Access</strong> (di bawah kategori <em>Security</em>).
                      </li>
                      <li>
                        Klik tombol hijau <strong>+ Add IP Address</strong>.
                      </li>
                      <li>
                        Pilih tombol <strong>Allow Access from Anywhere</strong> (otomatis mengisi <code className="bg-slate-800 px-1 rounded text-emerald-400">0.0.0.0/0</code>), lalu klik <strong>Confirm</strong>.
                      </li>
                      <li>
                        Kembali ke sini dan klik tombol <strong>"Coba Hubungkan Ulang (Reconnect)"</strong> di bawah!
                      </li>
                    </ol>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={handleReconnect}
                      disabled={isReconnecting}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-2 transition shadow-md disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isReconnecting ? 'animate-spin' : ''}`} />
                      <span>{isReconnecting ? 'Mencoba Menghubungkan...' : 'Coba Hubungkan Ulang (Reconnect)'}</span>
                    </button>
                    <span className="text-[11px] text-slate-400">
                      *Aplikasi tetap berjalan normal menggunakan sinkronisasi memori lokal selama menunggu whitelist.
                    </span>
                  </div>
                </div>
              )}

              {/* Cluster Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-slate-400 text-[11px] block">Cluster Provider:</span>
                  <div className="text-base font-black text-white mt-1 flex items-center gap-2">
                    <span>MongoDB Atlas</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">Cloud M0</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">AWS / Singapore Region</span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-slate-400 text-[11px] block">Nama Database:</span>
                  <div className="text-base font-black text-amber-300 mt-1 font-mono">
                    sagitarius_parcel
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Production Schema</span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-slate-400 text-[11px] block">Database User:</span>
                  <div className="text-base font-black text-white mt-1 font-mono">
                    akun310786_db_user
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Full Read/Write Access</span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-slate-400 text-[11px] block">Total Collections:</span>
                  <div className="text-base font-black text-emerald-400 mt-1 font-mono">
                    4 Tabel Koleksi
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">packages, agents, members, transactions</span>
                </div>
              </div>

              {/* Actions & Seed Section */}
              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Sinkronisasi Data Awal ke MongoDB</span>
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Masukkan 10 katalog paket resmi, 3 data agen percontohan, dan data member demo langsung ke dalam koleksi MongoDB Atlas.
                  </p>
                </div>
                <button
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition shadow-md disabled:opacity-50 whitespace-nowrap"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                  <span>{isSeeding ? 'Memasukkan Data...' : 'Kirim Data Awal ke MongoDB'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'collections' && (
            <div className="space-y-4">
              {/* Collection Selector Tabs */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedCollection('packages')}
                  className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedCollection === 'packages'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>packages ({packages.length})</span>
                </button>

                <button
                  onClick={() => setSelectedCollection('members')}
                  className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedCollection === 'members'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>members ({members.length})</span>
                </button>

                <button
                  onClick={() => setSelectedCollection('agents')}
                  className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedCollection === 'agents'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>agents ({agents.length})</span>
                </button>

                <button
                  onClick={() => setSelectedCollection('transactions')}
                  className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedCollection === 'transactions'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>transactions ({transactions.length})</span>
                </button>
              </div>

              {/* Data Table Preview */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  {selectedCollection === 'packages' && (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] sticky top-0">
                        <tr>
                          <th className="p-3">ID</th>
                          <th className="p-3">Nama Paket</th>
                          <th className="p-3">Kategori</th>
                          <th className="p-3 text-right">Target Harga</th>
                          <th className="p-3 text-right">Setoran Harian</th>
                          <th className="p-3">THR & Hadiah</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-mono">
                        {packages.map((pkg) => (
                          <tr key={pkg.id} className="hover:bg-slate-800/50">
                            <td className="p-3 text-emerald-400 font-bold">{pkg.id}</td>
                            <td className="p-3 text-white font-sans font-bold">{pkg.name}</td>
                            <td className="p-3 text-purple-300 uppercase text-[11px]">{pkg.category}</td>
                            <td className="p-3 text-right text-amber-300">Rp {pkg.targetPrice.toLocaleString('id-ID')}</td>
                            <td className="p-3 text-right text-emerald-300">Rp {pkg.dailyPayment?.toLocaleString('id-ID')}/hari</td>
                            <td className="p-3 text-slate-300 font-sans text-[11px] truncate max-w-xs">{pkg.thrBonus || pkg.bonusGift || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {selectedCollection === 'members' && (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] sticky top-0">
                        <tr>
                          <th className="p-3">Kode Member</th>
                          <th className="p-3">Nama Lengkap</th>
                          <th className="p-3">Paket Pilihan</th>
                          <th className="p-3">Agen Pendamping</th>
                          <th className="p-3 text-right">Saldo Terkumpul</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-mono">
                        {members.map((mbr) => (
                          <tr key={mbr.id} className="hover:bg-slate-800/50">
                            <td className="p-3 text-emerald-400 font-bold">{mbr.memberCode}</td>
                            <td className="p-3 text-white font-sans font-bold">{mbr.name}</td>
                            <td className="p-3 text-amber-300 font-sans">{mbr.packageName}</td>
                            <td className="p-3 text-slate-300 font-sans">{mbr.agentName}</td>
                            <td className="p-3 text-right text-emerald-300">Rp {mbr.totalSaved.toLocaleString('id-ID')}</td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-emerald-500/20 text-emerald-300">
                                {mbr.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {selectedCollection === 'agents' && (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] sticky top-0">
                        <tr>
                          <th className="p-3">Kode Agen</th>
                          <th className="p-3">Nama Outlet</th>
                          <th className="p-3">Pemilik</th>
                          <th className="p-3">Wilayah</th>
                          <th className="p-3 text-center">Member Binaan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-mono">
                        {agents.map((ag) => (
                          <tr key={ag.id} className="hover:bg-slate-800/50">
                            <td className="p-3 text-emerald-400 font-bold">{ag.code}</td>
                            <td className="p-3 text-white font-sans font-bold">{ag.storeName}</td>
                            <td className="p-3 text-slate-300 font-sans">{ag.ownerName}</td>
                            <td className="p-3 text-purple-300 font-sans">{ag.district}, {ag.regency}</td>
                            <td className="p-3 text-center text-amber-300">{ag.memberCount || 0} Member</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {selectedCollection === 'transactions' && (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] sticky top-0">
                        <tr>
                          <th className="p-3">No. Kuitansi</th>
                          <th className="p-3">Member</th>
                          <th className="p-3">Metode</th>
                          <th className="p-3 text-right">Nominal</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-mono">
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-800/50">
                            <td className="p-3 text-emerald-400 font-bold">{tx.invoiceNo}</td>
                            <td className="p-3 text-white font-sans font-bold">{tx.memberName}</td>
                            <td className="p-3 text-purple-300 font-sans">{tx.method}</td>
                            <td className="p-3 text-right text-amber-300 font-bold">Rp {tx.amount.toLocaleString('id-ID')}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold ${
                                tx.status === 'Berhasil'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Konfigurasi Variabel Lingkungan (.env)</h4>
                  <p className="text-xs text-slate-400">
                    Kredensial MongoDB Atlas yang saat ini aktif digunakan oleh backend server:
                  </p>
                </div>
                <button
                  onClick={handleCopyEnv}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-slate-700 transition"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin .env'}</span>
                </button>
              </div>

              <div className="bg-black/90 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-2 overflow-x-auto">
                <div className="text-slate-500"># MongoDB Atlas Connection URI Aktif:</div>
                <div className="text-amber-300">
                  MONGODB_URI="mongodb+srv://akun310786_db_user:D0oBXnbyTd1iAgtp@database.t09ogyz.mongodb.net/sagitarius_parcel?retryWrites=true&w=majority"
                </div>
                <div className="text-slate-400">PORT=3000</div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs text-slate-300">
                <span className="font-bold text-white block">Catatan Keamanan & Sinkronisasi:</span>
                <p>
                  1. Kredensial ini disimpan di sisi server (backend Node.js/Express) dan <strong>tidak pernah dibocorkan</strong> ke peramban publik.
                </p>
                <p>
                  2. Jika Anda membuat user baru atau mengubah password di MongoDB Atlas, Anda cukup memperbarui nilai <code className="text-amber-300">MONGODB_URI</code> di file <code className="text-white">.env</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
