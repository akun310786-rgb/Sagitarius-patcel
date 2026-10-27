import React, { useState } from 'react';
import { PACKAGES, AGENTS } from '../data/mockData';
import { Member, ParcelPackage, Agent } from '../types/parcel';
import {
  X,
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  Gift,
  Coins,
  QrCode,
  ArrowRight,
  Sparkles,
  Store,
  Calendar,
  Wallet
} from 'lucide-react';

interface RegisterMemberModalProps {
  onClose: () => void;
  onRegister: (newMember: Member) => void;
  onGoToDeposit?: (memberId: string) => void;
  defaultPackageId?: string;
  packages?: ParcelPackage[];
  agents?: Agent[];
}

export const RegisterMemberModal: React.FC<RegisterMemberModalProps> = ({
  onClose,
  onRegister,
  onGoToDeposit,
  defaultPackageId,
  packages = PACKAGES,
  agents = AGENTS
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [regency, setRegency] = useState('Kab. Ciamis');
  const [packageId, setPackageId] = useState(defaultPackageId || packages[0]?.id || 'pkg-bunda-reguler');
  const [agentId, setAgentId] = useState(agents[0]?.id || 'ag-012');
  const [paymentFrequency, setPaymentFrequency] = useState<'harian' | 'mingguan' | 'bulanan'>('harian');
  const [registeredMember, setRegisteredMember] = useState<Member | null>(null);

  const selectedPkg = packages.find((p) => p.id === packageId) || packages[0] || PACKAGES[0];
  const selectedAgent = agents.find((a) => a.id === agentId) || agents[0] || AGENTS[0];

  // Daily, weekly, monthly calculations
  const dailyRate = selectedPkg.dailyPayment || Math.round(selectedPkg.targetPrice / 325);
  const weeklyRate = selectedPkg.weeklyPayment || Math.round(selectedPkg.targetPrice / 45);
  const monthlyRate = Math.round(selectedPkg.targetPrice / 10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const randomIdNumber = Math.floor(1000 + Math.random() * 9000);
    const newMemberId = `mem-${Date.now()}`;
    const generatedUsername = username.trim() || name.trim().toLowerCase().replace(/\s+/g, '') + randomIdNumber;
    const generatedEmail = email.trim() || `${generatedUsername}@gmail.com`;

    const newMember: Member = {
      id: newMemberId,
      memberCode: `SP-00${randomIdNumber}`,
      name: name.trim(),
      phone: phone.trim(),
      username: generatedUsername,
      email: generatedEmail,
      password: password.trim() || 'password123',
      address: address.trim() || 'Jl. Raya Ciamis No. 10',
      regency,
      agentId: selectedAgent.id,
      agentName: `${selectedAgent.ownerName} (${selectedAgent.storeName})`,
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      packagePrice: selectedPkg.targetPrice,
      totalSaved: 0,
      lastDepositAmount: 0,
      lastDepositDate: '-',
      status: 'Aktif',
      joinDate: '26 Okt 2026',
      pickupDate: '18 Nov 2026 (H-7 Lebaran)',
      qrToken: `QR-20261026-${randomIdNumber}-${name.toUpperCase().replace(/\s+/g, '-')}`
    };

    onRegister(newMember);
    setRegisteredMember(newMember);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-1">
            <UserPlus className="w-4 h-4" />
            <span>Pendaftaran Member Baru — Lebaran 2026/2027</span>
          </div>
          <h3 className="font-black text-xl text-white">
            Formulir Buku Tabungan Digital Sagitarius
          </h3>
          <p className="text-xs text-emerald-100 mt-0.5">
            Pilih paket Idul Fitri resmi flyer, hubungkan dengan outlet agen terdekat, dan mulai menabung cicilan ringan amanah.
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {registeredMember ? (
            <div className="space-y-5 text-center py-2 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <div>
                <h4 className="text-xl font-black text-slate-900">
                  Selamat! Pendaftaran Member Berhasil 🎉
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Buku tabungan digital resmi <strong>PT. Sagitarius Trinunggal Karya</strong> telah diterbitkan dan langsung aktif.
                </p>
              </div>

              {/* Digital Member Card Preview */}
              <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-5 rounded-2xl border border-emerald-500/40 shadow-xl text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase block">
                      KARTU MEMBER RESMI SAGITARIUS
                    </span>
                    <span className="text-xs text-emerald-200">Idul Fitri 1448 H / 2027 M</span>
                  </div>
                  <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                    {registeredMember.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nama Anggota:</span>
                    <span className="text-base font-black text-white">{registeredMember.name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Nomor ID Member:</span>
                      <span className="font-mono font-bold text-amber-300 text-sm">
                        {registeredMember.memberCode}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">WhatsApp:</span>
                      <span className="font-mono text-slate-200">{registeredMember.phone}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Paket Terpilih:</span>
                      <span className="font-bold text-amber-300">{registeredMember.packageName}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-emerald-200 mt-1">
                      <span>Target Nilai Tabungan:</span>
                      <span className="font-bold font-mono">
                        Rp {registeredMember.packagePrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                      <span>Agen Pembina:</span>
                      <span className="truncate max-w-[200px] text-slate-200">
                        {registeredMember.agentName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10">
                  <span className="font-mono">{registeredMember.qrToken}</span>
                  <span className="text-amber-300 font-bold">Jadwal Ambil: H-7 Lebaran</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {onGoToDeposit && (
                  <button
                    onClick={() => onGoToDeposit(registeredMember.id)}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-lg transition transform hover:scale-[1.01]"
                  >
                    <Wallet className="w-4 h-4 text-slate-950" />
                    <span>⚡ Langsung Setor Cicilan Pertama Sekarang</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Buka Dashboard Buku Tabungan
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Personal Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap Member *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Ibu Kurniawati"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Account Credentials for Member Login */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    Akun Login Dashboard Member
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Dipakai untuk login melihat saldo & progres
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Contoh: kurniawati99"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kurniawati@gmail.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Password Login *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 karakter"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Package Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Pilihan Paket Lebaran Resmi Flyer *</span>
                  <span className="text-[10px] text-emerald-700 font-bold">10 Pilihan Paket Siap Tabung</span>
                </label>
                <select
                  value={packageId}
                  onChange={(e) => setPackageId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-800"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — Rp {pkg.targetPrice.toLocaleString('id-ID')} (Cicilan Rp {pkg.dailyPayment?.toLocaleString('id-ID') || Math.round(pkg.targetPrice / 325).toLocaleString('id-ID')}/hari)
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Package Highlight Preview */}
              <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50/70 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                      {selectedPkg.category.toUpperCase()}
                    </span>
                    <h5 className="font-black text-slate-900 text-sm mt-1">{selectedPkg.name}</h5>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Total Target:</span>
                    <span className="font-mono font-black text-emerald-800 text-sm">
                      Rp {selectedPkg.targetPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Frequency Tab Switcher */}
                <div className="pt-1">
                  <div className="text-[11px] font-semibold text-slate-600 mb-1">
                    Simulasi Pilihan Tempo Cicilan Tabungan:
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-emerald-200">
                    <button
                      type="button"
                      onClick={() => setPaymentFrequency('harian')}
                      className={`py-1.5 px-2 rounded-lg text-center transition ${
                        paymentFrequency === 'harian'
                          ? 'bg-emerald-700 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-[10px]">Harian (325 Hari)</div>
                      <div className="font-mono font-bold text-xs">
                        Rp {dailyRate.toLocaleString('id-ID')}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentFrequency('mingguan')}
                      className={`py-1.5 px-2 rounded-lg text-center transition ${
                        paymentFrequency === 'mingguan'
                          ? 'bg-emerald-700 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-[10px]">Mingguan (45 Minggu)</div>
                      <div className="font-mono font-bold text-xs">
                        Rp {weeklyRate.toLocaleString('id-ID')}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentFrequency('bulanan')}
                      className={`py-1.5 px-2 rounded-lg text-center transition ${
                        paymentFrequency === 'bulanan'
                          ? 'bg-emerald-700 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-[10px]">Bulanan (10 Bulan)</div>
                      <div className="font-mono font-bold text-xs">
                        Rp {monthlyRate.toLocaleString('id-ID')}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Perks & Bonus from flyer */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="flex items-center space-x-1.5 text-emerald-900 bg-white/80 p-2 rounded-xl border border-emerald-200">
                    <Gift className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate"><strong>Hadiah:</strong> {selectedPkg.bonusGift || 'Kemasan Cantik SP'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-amber-900 bg-white/80 p-2 rounded-xl border border-amber-200">
                    <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate"><strong>Bonus:</strong> {selectedPkg.thrBonus || 'Kupon Undian'}</span>
                  </div>
                </div>
              </div>

              {/* Agent Picker */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pilih Agen Pembina Terdekat (Drop Point) *</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{agents.length} Agen Tersedia</span>
                </label>
                <select
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-800"
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.storeName} ({agent.ownerName}) — {agent.regency}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Paket Idul Fitri akan diantar oleh armada PT. Sagitarius ke toko agen ini pada H-7 Lebaran untuk Anda ambil.
                </p>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kabupaten / Kota *
                  </label>
                  <select
                    value={regency}
                    onChange={(e) => setRegency(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                  >
                    <option value="Kab. Ciamis">Kab. Ciamis</option>
                    <option value="Kota Tasikmalaya">Kota Tasikmalaya</option>
                    <option value="Kab. Tasikmalaya">Kab. Tasikmalaya</option>
                    <option value="Kota Banjar">Kota Banjar</option>
                    <option value="Kab. Pangandaran">Kab. Pangandaran</option>
                    <option value="Kab. Garut">Kab. Garut</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alamat Lengkap Domisili
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nama jalan, RT/RW, Dusun/Kelurahan..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Security info */}
              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-start space-x-2 text-[11px] text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Amanah & Bebas Biaya Admin:</strong> Tabungan Anda dicatat transparan di buku tabungan digital dengan kuitansi resmi. Uang utuh 100% menjadi paket parcel berkualitas.
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition transform hover:scale-[1.01]"
                >
                  Daftar & Terbitkan Buku Tabungan
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
