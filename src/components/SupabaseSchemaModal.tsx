import React, { useState } from 'react';
import {
  X,
  Database,
  Code2,
  Table,
  CheckCircle2,
  Copy,
  Server,
  ShieldCheck,
  Download,
  Terminal,
  ExternalLink
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
  const [activeTab, setActiveTab] = useState<'sql' | 'studio' | 'env'>('studio');
  const [copied, setCopied] = useState(false);
  const [selectedTable, setSelectedTable] = useState<'packages' | 'agents' | 'members' | 'transactions'>('packages');

  const sqlSchema = `-- ==============================================================
-- SAGITARIUS PARCEL: PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Database: PostgreSQL 15+ (Supabase Cloud)
-- ==============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel Master Paket Lebaran
CREATE TABLE public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'keluarga', 'premium', 'kue', 'sembako'
    tag VARCHAR(50),
    description TEXT,
    target_price NUMERIC(12,2) NOT NULL,
    weekly_payment NUMERIC(10,2) NOT NULL,
    estimated_weight VARCHAR(30),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Item Bahan Penyusun Parcel
CREATE TABLE public.package_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
    item_name VARCHAR(150) NOT NULL,
    quantity INT DEFAULT 1,
    unit VARCHAR(30) DEFAULT 'pcs',
    is_customizable BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0
);

-- 3. Tabel Outlet Agen & Rekening Pencairan Komisi
CREATE TABLE public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    store_name VARCHAR(100) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    district VARCHAR(60) NOT NULL,
    regency VARCHAR(60) NOT NULL,
    bank_name VARCHAR(40),
    bank_account_number VARCHAR(40),
    bank_account_name VARCHAR(100),
    commission_rate_base NUMERIC(4,2) DEFAULT 0.05,
    status VARCHAR(20) DEFAULT 'Aktif',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Member / Peserta Tabungan Hari Raya
CREATE TABLE public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    regency VARCHAR(60) NOT NULL,
    agent_id UUID REFERENCES public.agents(id),
    package_id UUID REFERENCES public.packages(id),
    total_saved NUMERIC(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Aktif', -- 'Aktif', 'Lunas'
    qr_token VARCHAR(100) UNIQUE NOT NULL,
    pickup_date VARCHAR(60),
    join_date TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Mutasi Setoran Tabungan
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_no VARCHAR(40) UNIQUE NOT NULL,
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.agents(id),
    amount NUMERIC(12,2) NOT NULL,
    method VARCHAR(50) NOT NULL, -- 'Transfer Bank BRI', 'Transfer Bank BCA', 'QRIS Instant', 'Tunai Agen'
    status VARCHAR(30) DEFAULT 'Menunggu', -- 'Berhasil', 'Menunggu', 'Ditolak'
    proof_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabel Komisi Agen Multi-Tier
CREATE TABLE public.agent_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    member_id UUID REFERENCES public.members(id),
    basis_amount NUMERIC(12,2) NOT NULL,
    commission_rate NUMERIC(4,2) NOT NULL, -- 0.05, 0.06, 0.07
    commission_earned NUMERIC(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Tercatat', -- 'Siap_Cair', 'Dicairkan'
    disbursement_date TIMESTAMPTZ
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Public can read packages
CREATE POLICY "Public read packages" ON public.packages FOR SELECT USING (true);

-- Agents can only view their assigned members
CREATE POLICY "Agent member view" ON public.members FOR SELECT
    USING (auth.jwt() ->> 'role' = 'admin' OR agent_id IN (SELECT id FROM public.agents WHERE phone = auth.jwt() ->> 'phone'));
`;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0f172a] text-slate-100 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-800">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-5 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">Supabase Cloud Architecture Console</h3>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded">
                  PostgreSQL 15+
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Skema tabel relasional, foreign keys, dan engine data real-time Sagitarius Parcel
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('studio')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'studio' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Table Studio
              </button>
              <button
                onClick={() => setActiveTab('sql')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'sql' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                SQL Schema
              </button>
              <button
                onClick={() => setActiveTab('env')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'env' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Koneksi & Env
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {activeTab === 'studio' && (
            <div className="space-y-4">
              {/* Table Selector */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                <span className="text-slate-500 font-semibold mr-1">Tabel:</span>
                <button
                  onClick={() => setSelectedTable('packages')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition ${
                    selectedTable === 'packages'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  public.packages ({packages.length})
                </button>
                <button
                  onClick={() => setSelectedTable('agents')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition ${
                    selectedTable === 'agents'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  public.agents ({agents.length})
                </button>
                <button
                  onClick={() => setSelectedTable('members')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition ${
                    selectedTable === 'members'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  public.members ({members.length})
                </button>
                <button
                  onClick={() => setSelectedTable('transactions')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition ${
                    selectedTable === 'transactions'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  public.transactions ({transactions.length})
                </button>
              </div>

              {/* Table Data View */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
                <div className="overflow-x-auto">
                  {selectedTable === 'packages' && (
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead>
                        <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
                          <th className="p-3">id</th>
                          <th className="p-3">name</th>
                          <th className="p-3">category</th>
                          <th className="p-3 text-right">target_price</th>
                          <th className="p-3 text-right">weekly_payment</th>
                          <th className="p-3">weight</th>
                          <th className="p-3">items_count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {packages.map((pkg) => (
                          <tr key={pkg.id} className="hover:bg-slate-800/40">
                            <td className="p-3 text-slate-500 truncate max-w-[120px]">{pkg.id}</td>
                            <td className="p-3 font-bold text-white">{pkg.name}</td>
                            <td className="p-3 text-emerald-400">{pkg.category}</td>
                            <td className="p-3 text-right font-bold text-amber-400">
                              Rp {pkg.targetPrice.toLocaleString('id-ID')}
                            </td>
                            <td className="p-3 text-right">Rp {pkg.weeklyPayment.toLocaleString('id-ID')}</td>
                            <td className="p-3 text-slate-400">{pkg.weight}</td>
                            <td className="p-3 text-cyan-400">{pkg.items.length} macam</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {selectedTable === 'agents' && (
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead>
                        <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
                          <th className="p-3">code</th>
                          <th className="p-3">store_name</th>
                          <th className="p-3">owner_name</th>
                          <th className="p-3">phone</th>
                          <th className="p-3">regency</th>
                          <th className="p-3 text-right">member_count</th>
                          <th className="p-3 text-right">total_omset</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {agents.map((ag) => (
                          <tr key={ag.id} className="hover:bg-slate-800/40">
                            <td className="p-3 font-bold text-emerald-400">{ag.code}</td>
                            <td className="p-3 text-white font-medium">{ag.storeName}</td>
                            <td className="p-3 text-slate-400">{ag.ownerName}</td>
                            <td className="p-3 text-slate-400">{ag.phone}</td>
                            <td className="p-3 text-blue-400">{ag.regency}</td>
                            <td className="p-3 text-right font-bold text-white">{ag.memberCount}</td>
                            <td className="p-3 text-right text-emerald-400 font-bold">
                              Rp {ag.totalOmset.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {selectedTable === 'members' && (
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead>
                        <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
                          <th className="p-3">member_code</th>
                          <th className="p-3">name</th>
                          <th className="p-3">phone</th>
                          <th className="p-3">package_name</th>
                          <th className="p-3 text-right">total_saved</th>
                          <th className="p-3">status</th>
                          <th className="p-3">qr_token</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {members.map((mem) => (
                          <tr key={mem.id} className="hover:bg-slate-800/40">
                            <td className="p-3 font-bold text-blue-400">{mem.memberCode}</td>
                            <td className="p-3 text-white font-bold">{mem.name}</td>
                            <td className="p-3 text-slate-400">{mem.phone}</td>
                            <td className="p-3 text-emerald-400">{mem.packageName}</td>
                            <td className="p-3 text-right font-bold text-white">
                              Rp {mem.totalSaved.toLocaleString('id-ID')}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  mem.status === 'Lunas' ? 'bg-purple-900/60 text-purple-300' : 'bg-emerald-900/60 text-emerald-300'
                                }`}
                              >
                                {mem.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 truncate max-w-[150px]">{mem.qrToken}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {selectedTable === 'transactions' && (
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead>
                        <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
                          <th className="p-3">invoice_no</th>
                          <th className="p-3">member_name</th>
                          <th className="p-3 text-right">amount</th>
                          <th className="p-3">method</th>
                          <th className="p-3">status</th>
                          <th className="p-3">date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-800/40">
                            <td className="p-3 font-bold text-slate-300">{tx.invoiceNo}</td>
                            <td className="p-3 text-white">{tx.memberName}</td>
                            <td className="p-3 text-right font-bold text-emerald-400">
                              Rp {tx.amount.toLocaleString('id-ID')}
                            </td>
                            <td className="p-3 text-slate-400">{tx.method}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  tx.status === 'Berhasil'
                                    ? 'bg-emerald-900/60 text-emerald-300'
                                    : 'bg-amber-900/60 text-amber-300'
                                }`}
                              >
                                {tx.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500">{tx.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">
                  Jalankan skrip ini pada <strong>Supabase SQL Editor</strong> untuk membuat seluruh tabel:
                </span>
                <button
                  onClick={handleCopySQL}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin SQL Schema'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-2xl border border-slate-800 overflow-x-auto max-h-[55vh] leading-relaxed">
                {sqlSchema}
              </pre>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-4 max-w-2xl mx-auto py-2">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-sm">Konfigurasi Koneksi Supabase (.env)</h4>
                <p className="text-slate-400 text-xs">
                  Tambahkan variabel berikut ke environment file produksi Anda:
                </p>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-emerald-400 text-xs space-y-1">
                  <div>VITE_SUPABASE_URL=https://xyzcompany.supabase.co</div>
                  <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</div>
                </div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs">
                <h5 className="font-bold text-white">Panduan Integrasi Supabase Client:</h5>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed">
                  <li>Buat proyek baru di dashboard resmi <strong>Supabase</strong>.</li>
                  <li>Buka tab <strong>SQL Editor</strong>, tempel skrip dari tab SQL Schema, lalu klik Run.</li>
                  <li>Tabel <code>packages</code>, <code>agents</code>, <code>members</code>, dan <code>transactions</code> akan terbuat dengan relasi foreign key otomatis.</li>
                  <li>Aktifkan <strong>Realtime</strong> pada tabel <code>transactions</code> agar verifikasi setoran admin langsung muncul di HP agen & member.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 flex justify-between items-center text-xs">
          <span className="text-slate-500">
            Arsitektur Supabase PostgreSQL siap dipasang ke hosting produksi.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
