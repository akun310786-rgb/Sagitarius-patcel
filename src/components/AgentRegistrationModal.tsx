import React, { useState } from 'react';
import { Agent } from '../types/parcel';
import {
  X,
  Store,
  Coins,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  MapPin,
  CreditCard,
  Building2,
  Sparkles,
  Calculator,
  ArrowRight,
  UserPlus
} from 'lucide-react';

interface AgentRegistrationModalProps {
  onClose: () => void;
  onRegisterAgent: (newAgent: Agent, password: string) => Promise<Agent | null>;
  onGoToRegisterMember?: (agentId: string) => void;
}

export const AgentRegistrationModal: React.FC<AgentRegistrationModalProps> = ({
  onClose,
  onRegisterAgent,
  onGoToRegisterMember
}) => {
  // Form fields
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('');
  const [regency, setRegency] = useState('Kab. Ciamis');
  const [bankName, setBankName] = useState('Bank BRI');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  // Simulator fields
  const [targetPackages, setTargetPackages] = useState<number>(75);
  const [avgPackagePrice] = useState<number>(2000000); // average ~Rp 2.000.000

  // Multi-tier commission math:
  // 1 - 50 paket: 5%
  // 51 - 100 paket: 6%
  // > 100 paket: 7% + bonus Rp 500.000
  const getCommissionRate = (count: number) => {
    if (count > 100) return 0.07;
    if (count > 50) return 0.06;
    return 0.05;
  };

  const currentRate = getCommissionRate(targetPackages);
  const estimatedOmset = targetPackages * avgPackagePrice;
  const baseCommission = Math.round(estimatedOmset * currentRate);
  const bonusCash = targetPackages >= 100 ? 500000 : targetPackages >= 60 ? 250000 : 0;
  const totalCommission = baseCommission + bonusCash;

  const [registeredAgent, setRegisteredAgent] = useState<Agent | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !ownerName.trim() || !phone.trim() || password.length < 12) return;

    const randomNum = Math.floor(30 + Math.random() * 60);
    const code = `AG-0${randomNum}`;

    const newAgent: Agent = {
      id: `ag-${Date.now()}`,
      code,
      name: storeName.trim(),
      storeName: `${storeName.trim()} ${regency.replace('Kab. ', '').replace('Kota ', '')}`,
      ownerName: ownerName.trim(),
      district: district.trim() || 'Pusat Kota',
      regency,
      phone: phone.trim(),
      memberCount: 0,
      totalOmset: 0,
      status: 'Aktif'
    };

    const savedAgent = await onRegisterAgent(newAgent, password);
    if (savedAgent) setRegisteredAgent(savedAgent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-blue-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-1">
            <Coins className="w-4 h-4" />
            <span>Kemitraan Resmi Sagitarius Parcel 2026/2027</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Portal Pendaftaran Agen & Perhitungan Komisi Otomatis
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl">
            Bergabunglah menjadi mitra resmi outlet drop point. Dapatkan komisi bertingkat hingga 7% per paket lunas dan bonus tunai dicairkan H-10 Idul Fitri.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {registeredAgent ? (
            <div className="py-4 text-center space-y-5 max-w-lg mx-auto animate-in fade-in">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Selamat! Pendaftaran Mitra Agen Sukses 🎉
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Outlet <strong>{registeredAgent.storeName}</strong> resmi terdaftar dalam jaringan distribusi resmi <strong>PT. Sagitarius Trinunggal Karya</strong>.
                </p>
              </div>

              {/* Digital Agent Certificate Card */}
              <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 rounded-2xl border-2 border-amber-400/50 shadow-2xl text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                      SERTIFIKAT KEMITRAAN AGEN RESMI
                    </span>
                    <span className="text-xs text-blue-200">Musim Idul Fitri 1448 H / 2026-2027</span>
                  </div>
                  <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                    STATUS: AKTIF & TERVERIFIKASI
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nama Toko & Outlet:</span>
                    <span className="text-lg font-black text-white">{registeredAgent.name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Kode Registrasi Agen:</span>
                      <span className="font-mono font-black text-amber-300 text-base">
                        {registeredAgent.code}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pemilik / PIC:</span>
                      <span className="font-semibold text-slate-200">{registeredAgent.ownerName}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Wilayah / Drop Point:</span>
                      <span className="font-medium text-slate-200">{registeredAgent.district}, {registeredAgent.regency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Koordinator Wilayah (Supervisi):</span>
                      <span className="font-semibold text-amber-300">Budi Santoso (Priangan Timur)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rekening Pencairan Komisi:</span>
                      <span className="font-mono text-emerald-300">
                        {bankName} {accountNumber ? `— ${accountNumber}` : '— Menunggu verifikasi cabang'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 border-t border-white/10 pt-2 flex justify-between items-center">
                  <span>PT. SAGITARIUS TRINUNGGAL KARYA</span>
                  <span className="text-amber-300 font-bold">Komisi s.d 7% + Bonus Tunai</span>
                </div>
              </div>

              {/* Action triggers */}
              <div className="space-y-2 pt-2">
                {onGoToRegisterMember && (
                  <button
                    onClick={() => onGoToRegisterMember(registeredAgent.id)}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md transition"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-200" />
                    <span>Daftarkan Member Pertama di Bawah Toko Ini</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Buka Portal & Dashboard Agen
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Commission Calculator */}
              <div className="lg:col-span-5 bg-gradient-to-br from-blue-50/70 to-indigo-50/60 p-5 rounded-2xl border border-blue-200 space-y-5">
                <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
                  <Calculator className="w-4 h-4 text-blue-700" />
                  <span>Simulator Komisi Otomatis Agen</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Target Member Binaan:</span>
                      <span className="text-blue-700 font-mono text-sm">{targetPackages} Paket</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={200}
                      step={5}
                      value={targetPackages}
                      onChange={(e) => setTargetPackages(parseInt(e.target.value, 10))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                      <span>10 Paket (5%)</span>
                      <span>50 Paket (Tier 2: 6%)</span>
                      <span>100+ Paket (Tier 3: 7%)</span>
                    </div>
                  </div>

                  {/* Tier status indicator */}
                  <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Tier Kemitraan:</span>
                      <span className="font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded text-[11px]">
                        {targetPackages > 100
                          ? 'Tier 3 (Gold Partner - 7%)'
                          : targetPackages > 50
                          ? 'Tier 2 (Silver Partner - 6%)'
                          : 'Tier 1 (Bronze Partner - 5%)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estimasi Total Omset:</span>
                      <span className="font-bold text-slate-800">
                        Rp {estimatedOmset.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bonus Kuota Spesial:</span>
                      <span className="font-bold text-emerald-700">
                        {bonusCash > 0 ? `+Rp ${bonusCash.toLocaleString('id-ID')}` : 'Belum tercapai'}
                      </span>
                    </div>
                  </div>

                  {/* Output commission box */}
                  <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl shadow-md text-center space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold block">
                      Estimasi Total Komisi Bersih
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-amber-300">
                      Rp {totalCommission.toLocaleString('id-ID')}
                    </div>
                    <p className="text-[10px] text-blue-100">
                      Transfer serentak otomatis pada H-10 Idul Fitri (8 Nov 2026)
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-500 leading-normal bg-white/70 p-3 rounded-xl border border-slate-200">
                    💡 <strong>Keuntungan Menjadi Agen:</strong> Tanpa modal stok barang! Sagitarius Parcel menyiapkan seluruh paket siap kirim, kardus, dan spanduk promosi gratis untuk toko Anda.
                  </div>
                </div>
              </div>

              {/* Right Column: Registration Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4 text-xs">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span>Formulir Pendaftaran & Data Rekening Pencairan</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Toko / Outlet *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Toko Barokah Jaya"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Pemilik / Penanggung Jawab *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: H. Agus Supriyanto"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp Aktif *</label>
                    <input
                      type="tel"
                      required
                      placeholder="081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kabupaten / Kota *</label>
                    <select
                      value={regency}
                      onChange={(e) => setRegency(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white font-medium"
                    >
                      <option value="Kab. Ciamis">Kab. Ciamis</option>
                      <option value="Kota Banjar">Kota Banjar</option>
                      <option value="Kota Tasikmalaya">Kota Tasikmalaya</option>
                      <option value="Kab. Tasikmalaya">Kab. Tasikmalaya</option>
                      <option value="Kab. Pangandaran">Kab. Pangandaran</option>
                      <option value="Kab. Garut">Kab. Garut</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password Akun Agen *</label>
                  <input
                    type="password"
                    required
                    minLength={12}
                    autoComplete="new-password"
                    placeholder="Buat password minimal 12 karakter"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kecamatan & Alamat Lengkap Outlet *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kec. Cijeungjing, Jl. Raya Banjar No. 12"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                  />
                </div>

                {/* Bank Account for Automated Commission Payout */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Rekening Bank untuk Pencairan Komisi Otomatis:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">Nama Bank</label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="Bank BRI">Bank BRI</option>
                        <option value="Bank BCA">Bank BCA</option>
                        <option value="Bank Mandiri">Bank Mandiri</option>
                        <option value="Bank BNI">Bank BNI</option>
                        <option value="Bank BJB">Bank BJB</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">Nomor Rekening</label>
                      <input
                        type="text"
                        placeholder="Contoh: 012401004921"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">Atas Nama Rekening</label>
                      <input
                        type="text"
                        placeholder="Nama pemilik buku"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start space-x-2 text-blue-900 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <p>
                    Data rekening akan dienkripsi dan diverifikasi oleh tim keuangan pusat. Komisi dicairkan langsung tanpa potongan biaya transfer antar bank.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow transition transform hover:scale-[1.01]"
                  >
                    Daftar Sebagai Mitra Agen Resmi
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
