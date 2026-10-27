import React, { useState } from 'react';
import { ParcelPackage, Agent } from '../types/parcel';
import { COMPANY_INFO, PAKET_UANG_DATA, BARANG_SATUAN_DATA } from '../data/mockData';
import {
  Package,
  Calendar,
  ShieldCheck,
  Truck,
  PhoneCall,
  MapPin,
  ChevronDown,
  CheckCircle2,
  Calculator,
  Search,
  MessageCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Info,
  Coins,
  Gift,
  Trophy,
  Banknote,
  Clock,
  Filter
} from 'lucide-react';

interface PublicWebsiteProps {
  packages: ParcelPackage[];
  agents: Agent[];
  onGoToMember: () => void;
  onGoToDeposit: () => void;
  onOpenRegister: (packageId?: string) => void;
  onOpenGuide: () => void;
  onOpenAgentRegistration: () => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  packages,
  agents,
  onGoToMember,
  onGoToDeposit,
  onOpenRegister,
  onOpenGuide,
  onOpenAgentRegistration
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [agentSearch, setAgentSearch] = useState<string>('');
  const [activePackageDetail, setActivePackageDetail] = useState<ParcelPackage | null>(null);
  const [simulationWeeks, setSimulationWeeks] = useState<number>(45);
  const [simSelectedPackageId, setSimSelectedPackageId] = useState<string>(packages[0]?.id || 'pkg-bunda-reguler');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Dedicated flyer state
  const [paketUangScheme, setPaketUangScheme] = useState<'lebaranHarian' | 'lebaranMingguan' | 'munggahanHarian' | 'munggahanMingguan'>('lebaranHarian');
  const [barangSearch, setBarangSearch] = useState<string>('');
  const [customMoneyRate, setCustomMoneyRate] = useState<number>(5000);

  const filteredPackages =
    selectedCategory === 'all'
      ? packages
      : packages.filter((p) => p.category === selectedCategory);

  const filteredAgents = agents.filter(
    (ag) =>
      ag.storeName.toLowerCase().includes(agentSearch.toLowerCase()) ||
      ag.ownerName.toLowerCase().includes(agentSearch.toLowerCase()) ||
      ag.regency.toLowerCase().includes(agentSearch.toLowerCase()) ||
      ag.district.toLowerCase().includes(agentSearch.toLowerCase())
  );

  const filteredBarangSatuan = BARANG_SATUAN_DATA.filter(
    (item) =>
      item.name.toLowerCase().includes(barangSearch.toLowerCase()) ||
      item.no.toString().includes(barangSearch)
  );

  const simPkg = packages.find((p) => p.id === simSelectedPackageId) || packages[0] || {
    id: 'pkg-default',
    name: 'Paket Bunda — Reguler',
    category: 'bunda' as const,
    tag: 'REGULER 2.000/HARI',
    description: '',
    targetPrice: 650000,
    dailyPayment: 2000,
    weeklyPayment: 14000,
    durationDays: 325,
    thrBonus: 'THR Rp 200.000',
    bonusGift: 'Travel Bag Eksklusif SP',
    weight: '± 7.5 kg',
    imageUrl: '',
    items: []
  };
  const weeklyInstallment = Math.round(simPkg.targetPrice / simulationWeeks);
  const dailyInstallment = Math.round(simPkg.targetPrice / (simulationWeeks * 7));

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen">
      {/* Top Banner Ribbon */}
      <div className="bg-[#0f2e24] text-emerald-200 text-xs py-2 px-4 border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-100">
              Pendaftaran Paket Lebaran 1448 H / 2027 Resmi Dibuka!
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-emerald-300">
            <button
              onClick={onOpenAgentRegistration}
              className="flex items-center space-x-1 text-amber-300 hover:text-amber-200 font-bold underline"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Daftar Mitra Agen (Komisi s.d 7%)</span>
            </button>
            <span className="flex items-center space-x-1">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Hotline CS: 0822-1234-5678</span>
            </span>
            <span className="hidden sm:flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Gudang: Ciamis - Tasik - Banjar</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-10 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md border border-amber-300">
              SP
            </div>
            <div>
              <div className="font-black text-lg tracking-tight text-slate-900 leading-none">
                SAGITARIUS PARCEL
              </div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                Parcel & Tabungan Idul Fitri
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600">
            <a href="#katalog" className="hover:text-emerald-700 transition">
              Katalog Paket
            </a>
            <a href="#simulasi" className="hover:text-emerald-700 transition">
              Simulasi Tabungan
            </a>
            <a href="#agen" className="hover:text-emerald-700 transition">
              Daftar Agen Terdekat
            </a>
            <button
              onClick={onOpenAgentRegistration}
              className="text-blue-700 hover:text-blue-800 font-bold transition flex items-center gap-1"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Gabung Agen</span>
            </button>
            <a href="#tentang" className="hover:text-emerald-700 transition">
              Tentang Kami
            </a>
            <a href="#faq" className="hover:text-emerald-700 transition">
              FAQ
            </a>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onGoToMember}
              className="px-3.5 py-2 border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Login Portal
            </button>
            <button
              onClick={() => onOpenRegister()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow transition"
            >
              + Daftar Member
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0b271f] via-[#093529] to-[#041a14] text-white pt-12 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background glow & subtle patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.15),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-emerald-900/60 border border-emerald-700/60 rounded-full px-3.5 py-1 text-xs text-amber-300 font-medium backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Solusi Cerdas Tabungan & Paket Idul Fitri 1448 H</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              Wujudkan Kebahagiaan di Hari yang Fitri Bersama{' '}
              <span className="text-amber-400">Sagitarius Parcel</span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
              Paket lebaran untuk keluarga, sahabat dan orang tercinta. Mudah, hemat, aman dan terpercaya dengan sistem tabungan fleksibel serta jaminan kualitas parcel premium.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenRegister()}
                className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition transform active:scale-95"
              >
                Daftar Member Sekarang
              </button>
              <a
                href="#katalog"
                className="px-5 py-3 bg-emerald-900/80 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm border border-emerald-600 transition"
              >
                Pilih Paket Lebaran
              </a>
              <a
                href="#simulasi"
                className="px-4 py-3 text-emerald-200 hover:text-white font-medium text-xs sm:text-sm flex items-center space-x-1.5 transition"
              >
                <Calculator className="w-4 h-4" />
                <span>Simulasi Tabungan</span>
              </a>
            </div>
          </div>

          {/* Counters Row */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mt-10 pt-8 border-t border-emerald-800/60">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">8.500+</div>
              <div className="text-[11px] sm:text-xs text-emerald-200">Member Terdaftar</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">240+</div>
              <div className="text-[11px] sm:text-xs text-emerald-200">Agen Binaan Aktif</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
              <div className="text-[11px] sm:text-xs text-emerald-200">Tepat Waktu H-7</div>
            </div>
          </div>

          {/* Featured Banner Showcase */}
          <div className="mt-12 bg-gradient-to-r from-amber-950/70 via-slate-900/80 to-emerald-950/70 border border-amber-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-600/50">
                Koleksi Eksklusif 2027
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Paket Keluarga & Premium Sultan Siap Dipesan
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Nikmati kue kering butter asli Wijsman, kurma Medjool organik, dan sembako berkualitas pilihan tanpa beban pengeluaran mendadak di akhir Ramadhan.
              </p>
            </div>
            <button
              onClick={() => onOpenRegister('pkg-premium')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl whitespace-nowrap shadow transition"
            >
              Lihat Isi Paket Eksklusif
            </button>
          </div>
        </div>
      </section>

      {/* 4 Feature Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200 flex items-start space-x-3.5 hover:shadow-xl transition">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Paket Lengkap</h4>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Kue kering aneka rasa, biskuit kaleng legendaris, sirup, hingga sembako bermutu tinggi.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200 flex items-start space-x-3.5 hover:shadow-xl transition">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Setoran Fleksibel</h4>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Mulai dari Rp 12.000 / minggu. Bisa ditabung harian, mingguan, atau bulanan sesuai kemampuan.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200 flex items-start space-x-3.5 hover:shadow-xl transition">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-800 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Aman & Terpercaya</h4>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Tercatat resmi dalam buku tabungan digital dengan notifikasi pusat real-time & kuitansi sah.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200 flex items-start space-x-3.5 hover:shadow-xl transition">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-800 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Jangkauan Nasional</h4>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Didukung ratusan agen dan korwil lokal yang siap mendistribusikan langsung serentak H-7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <Package className="w-4 h-4" />
              <span>KATALOG RESMI SAGITARIUS PARCEL 2026 - 2027</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Pilihan Paket Tabungan Idul Fitri Sesuai Flyer Resmi
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pilihan paket lengkap: Paket Bunda, Paket Anak, Paket Pilihan (Sultan & Diamond), Paket Uang, serta 50 Barang Satuan.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/90 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-2 rounded-xl transition ${
                selectedCategory === 'all'
                  ? 'bg-white text-emerald-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Paket (10)
            </button>
            <button
              onClick={() => setSelectedCategory('bunda')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1 ${
                selectedCategory === 'bunda'
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Paket Bunda (4)</span>
            </button>
            <button
              onClick={() => setSelectedCategory('anak')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1 ${
                selectedCategory === 'anak'
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Paket Anak (4)</span>
            </button>
            <button
              onClick={() => setSelectedCategory('pilihan')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1 ${
                selectedCategory === 'pilihan'
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Paket Pilihan (2)</span>
            </button>
            <button
              onClick={() => setSelectedCategory('uang')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1 ${
                selectedCategory === 'uang'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 font-semibold'
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>Paket Uang</span>
            </button>
            <button
              onClick={() => setSelectedCategory('satuan')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1 ${
                selectedCategory === 'satuan'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 font-semibold'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>50 Barang Satuan</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: DEDICATED PAKET UANG (MUNGGAHAN & LEBARAN) */}
        {selectedCategory === 'uang' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-emerald-700/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md">
                    FLYER HALAMAN 5
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                    Paket Uang Tunai: Munggahan & Lebaran
                  </h3>
                  <p className="text-xs text-emerald-200 mt-1 max-w-xl">
                    Paket tabungan uang tunai tanpa risiko barang! Dibagikan <strong>Lebih Awal</strong> sebelum Ramadhan (Munggahan) atau menjelang Idul Fitri (Lebaran).
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <button
                    onClick={() => setPaketUangScheme('lebaranHarian')}
                    className={`px-3.5 py-2 rounded-xl transition ${
                      paketUangScheme === 'lebaranHarian'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-emerald-200 hover:bg-slate-700'
                    }`}
                  >
                    Lebaran (325 Hari)
                  </button>
                  <button
                    onClick={() => setPaketUangScheme('lebaranMingguan')}
                    className={`px-3.5 py-2 rounded-xl transition ${
                      paketUangScheme === 'lebaranMingguan'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-emerald-200 hover:bg-slate-700'
                    }`}
                  >
                    Lebaran (45 Minggu)
                  </button>
                  <button
                    onClick={() => setPaketUangScheme('munggahanHarian')}
                    className={`px-3.5 py-2 rounded-xl transition ${
                      paketUangScheme === 'munggahanHarian'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-emerald-200 hover:bg-slate-700'
                    }`}
                  >
                    Munggahan (295 Hari)
                  </button>
                  <button
                    onClick={() => setPaketUangScheme('munggahanMingguan')}
                    className={`px-3.5 py-2 rounded-xl transition ${
                      paketUangScheme === 'munggahanMingguan'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-emerald-200 hover:bg-slate-700'
                    }`}
                  >
                    Munggahan (42 Minggu)
                  </button>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-emerald-100 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>
                      {paketUangScheme === 'lebaranHarian' && 'Daftar Setoran Harian — Paket Uang Lebaran (325 Hari)'}
                      {paketUangScheme === 'lebaranMingguan' && 'Daftar Setoran Mingguan — Paket Uang Lebaran (45 Minggu)'}
                      {paketUangScheme === 'munggahanHarian' && 'Daftar Setoran Harian — Paket Uang Munggahan (295 Hari)'}
                      {paketUangScheme === 'munggahanMingguan' && 'Daftar Setoran Mingguan — Paket Uang Munggahan (42 Minggu)'}
                    </span>
                  </h4>
                  <span className="text-xs text-amber-300 font-mono">
                    *Tepat Sesuai Flyer Sagitarius
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {paketUangScheme === 'lebaranHarian' &&
                    PAKET_UANG_DATA.lebaran325Hari.map((row, i) => (
                      <div
                        key={i}
                        className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl hover:border-amber-400 transition"
                      >
                        <span className="text-[11px] text-slate-400 block">Setoran Harian:</span>
                        <div className="text-base font-black text-amber-300">
                          Rp {row.daily.toLocaleString('id-ID')} / hari
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-baseline">
                          <span className="text-[10px] text-emerald-200">Terima Uang:</span>
                          <span className="font-bold text-xs text-white font-mono">
                            Rp {row.total.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))}

                  {paketUangScheme === 'lebaranMingguan' &&
                    PAKET_UANG_DATA.lebaran45Minggu.map((row, i) => (
                      <div
                        key={i}
                        className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl hover:border-amber-400 transition"
                      >
                        <span className="text-[11px] text-slate-400 block">Setoran Mingguan:</span>
                        <div className="text-base font-black text-amber-300">
                          Rp {row.weekly.toLocaleString('id-ID')} / mg
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-baseline">
                          <span className="text-[10px] text-emerald-200">Terima Uang:</span>
                          <span className="font-bold text-xs text-white font-mono">
                            Rp {row.total.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))}

                  {paketUangScheme === 'munggahanHarian' &&
                    PAKET_UANG_DATA.munggahan295Hari.map((row, i) => (
                      <div
                        key={i}
                        className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl hover:border-amber-400 transition"
                      >
                        <span className="text-[11px] text-slate-400 block">Setoran Harian:</span>
                        <div className="text-base font-black text-amber-300">
                          Rp {row.daily.toLocaleString('id-ID')} / hari
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-baseline">
                          <span className="text-[10px] text-emerald-200">Terima Uang:</span>
                          <span className="font-bold text-xs text-white font-mono">
                            Rp {row.total.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))}

                  {paketUangScheme === 'munggahanMingguan' &&
                    PAKET_UANG_DATA.munggahan42Minggu.map((row, i) => (
                      <div
                        key={i}
                        className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl hover:border-amber-400 transition"
                      >
                        <span className="text-[11px] text-slate-400 block">Setoran Mingguan:</span>
                        <div className="text-base font-black text-amber-300">
                          Rp {row.weekly.toLocaleString('id-ID')} / mg
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-baseline">
                          <span className="text-[10px] text-emerald-200">Terima Uang:</span>
                          <span className="font-bold text-xs text-white font-mono">
                            Rp {row.total.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-emerald-200 max-w-xl">
                    💡 <em>Paket Uang bisa dicairkan tepat waktu melalui transfer rekening langsung ke member atau tunai via Agen Binaan.</em>
                  </div>
                  <button
                    onClick={() => onOpenRegister('pkg-bunda-reguler')}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition"
                  >
                    Daftar Paket Uang Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: DEDICATED 50 BARANG SATUAN */}
        {selectedCategory === 'satuan' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
                    FLYER HALAMAN 1 (50 PILIHAN SATUAN)
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    50 Macam Pilihan Barang Satuan (325 Hari)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                    Pilihan hemat satuan sembako, daging sapi, daging ayam, biskuit kaleng Khong Guan & Monde, hingga sirup. Daging & Telur dibagikan H-2 Idul Fitri.
                  </p>
                </div>

                {/* Search input */}
                <div className="relative min-w-[280px]">
                  <input
                    type="text"
                    placeholder="Cari komoditas (misal: Bimoli, Daging, Khong Guan)..."
                    value={barangSearch}
                    onChange={(e) => setBarangSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-xl">No</th>
                      <th className="p-3">Nama Komoditas / Barang</th>
                      <th className="p-3 text-right">Setoran Harian</th>
                      <th className="p-3 text-right">Estimasi Total (325 Hari)</th>
                      <th className="p-3 text-center rounded-r-xl">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBarangSatuan.map((item) => (
                      <tr key={item.no} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-mono font-bold text-slate-500">{item.no}</td>
                        <td className="p-3 font-bold text-slate-900">
                          {item.name}
                          {(item.name.includes('Daging') || item.name.includes('Telur')) && (
                            <span className="ml-2 text-[10px] font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                              Dibagikan H-2
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-700">
                          Rp {item.daily.toLocaleString('id-ID')} / hari
                        </td>
                        <td className="p-3 text-right font-mono font-semibold text-slate-800">
                          Rp {(item.daily * 325).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => onOpenRegister('pkg-bunda-reguler')}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-semibold transition"
                          >
                            Pilih Satuan
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
                <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Catatan Penyaluran Barang Satuan Sagitarius:</strong>
                  <span>
                    Jika terdapat kelangkaan atau lonjakan harga signifikan pada komoditas tertentu, maka akan diganti produk bernilai setara setelah koordinasi resmi dengan member.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: STANDARD PARCEL PACKAGES (BUNDLE FLYER) */}
        {selectedCategory !== 'uang' && selectedCategory !== 'satuan' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image and Weight Badge */}
                  <div className="relative h-56 bg-slate-100 overflow-hidden group">
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-black text-[11px] tracking-wider uppercase px-3 py-1 rounded-lg shadow-md border border-amber-300">
                      {pkg.tag}
                    </div>
                    <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                      {pkg.weight}
                    </div>
                  </div>

                  {/* Info Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                        Paket {pkg.category.toUpperCase()} — {pkg.tier || 'Eksklusif'}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {pkg.durationDays || 325} Hari Menabung
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900">{pkg.name}</h3>
                    
                    {/* Flyer Direct Bonus Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {pkg.thrBonus && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center space-x-2 text-xs">
                          <Banknote className="w-4 h-4 text-amber-700 shrink-0" />
                          <div>
                            <span className="text-[10px] text-amber-800 font-semibold block uppercase">Bonus THR Tunai:</span>
                            <strong className="text-amber-950 font-bold">{pkg.thrBonus}</strong>
                          </div>
                        </div>
                      )}
                      {pkg.bonusGift && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2 text-xs">
                          <Gift className="w-4 h-4 text-emerald-700 shrink-0" />
                          <div>
                            <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Hadiah Langsung:</span>
                            <strong className="text-emerald-950 font-bold truncate block">{pkg.bonusGift}</strong>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {pkg.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Total Target Tabungan:</span>
                        <span className="text-xl font-black text-slate-900 font-mono">
                          Rp {pkg.targetPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Setoran Harian / Minggu:</span>
                        <div className="text-sm font-black text-emerald-700 font-mono">
                          Rp {pkg.dailyPayment?.toLocaleString('id-ID') || Math.round(pkg.weeklyPayment / 7).toLocaleString('id-ID')}/hari
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          (Rp {pkg.weeklyPayment.toLocaleString('id-ID')}/minggu)
                        </span>
                      </div>
                    </div>

                    {/* Highlight items preview */}
                    <div className="pt-2 text-xs space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <span className="text-[11px] font-bold text-slate-600 block uppercase">
                        Komposisi Isi Parcel ({pkg.items.length} Macam):
                      </span>
                      {pkg.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                      {pkg.items.length > 3 && (
                        <div className="text-[11px] text-emerald-700 font-semibold pt-1">
                          +{pkg.items.length - 3} item lainnya...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-5 sm:p-6 pt-0 flex gap-2.5">
                  <button
                    onClick={() => setActivePackageDetail(pkg)}
                    className="flex-1 py-3 border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition"
                  >
                    Lihat Isi Lengkap
                  </button>
                  <button
                    onClick={() => onOpenRegister(pkg.id)}
                    className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition"
                  >
                    Daftar Paket Ini
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Door Prize Program Banner from Flyer */}
      <section id="doorprize" className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-amber-300 relative overflow-hidden">
          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-slate-950 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>PROGRAM RESMI DOOR PRIZE SAGITARIUS PARCEL 2026 - 2027</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-slate-950 leading-tight">
              Raih Hadiah Utama 1 Unit Sepeda Motor & Elektronik Rumah Tangga!
            </h3>

            <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed max-w-2xl">
              Setiap Member berhak mendapatkan <strong>Kupon Door Prize</strong> apabila pembayaran tabungan lancar memenuhi syarat rules pembayaran. Pengundian dilakukan secara <strong>LIVE</strong> di akun sosial media resmi Sagitarius Parcel!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl text-center shadow-sm border border-amber-300">
                <div className="text-xl">🛵</div>
                <div className="font-black text-slate-900 text-xs mt-1">Motor Beat</div>
                <span className="text-[10px] text-amber-800 font-bold">Grand Prize</span>
              </div>
              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl text-center shadow-sm border border-amber-300">
                <div className="text-xl">❄️</div>
                <div className="font-black text-slate-900 text-xs mt-1">Kulkas 2 Pintu</div>
                <span className="text-[10px] text-emerald-800 font-semibold">Elektronik</span>
              </div>
              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl text-center shadow-sm border border-amber-300">
                <div className="text-xl">📱</div>
                <div className="font-black text-slate-900 text-xs mt-1">HP Android</div>
                <span className="text-[10px] text-emerald-800 font-semibold">Smartphone</span>
              </div>
              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl text-center shadow-sm border border-amber-300">
                <div className="text-xl">🔥</div>
                <div className="font-black text-slate-900 text-xs mt-1">Kompor Gas Kaca</div>
                <span className="text-[10px] text-emerald-800 font-semibold">Dapur Modern</span>
              </div>
              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl text-center shadow-sm border border-amber-300">
                <div className="text-xl">🍚</div>
                <div className="font-black text-slate-900 text-xs mt-1">Magic Com Digital</div>
                <span className="text-[10px] text-emerald-800 font-semibold">Rice Cooker</span>
              </div>
              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl text-center shadow-sm border border-amber-300">
                <div className="text-xl">🍲</div>
                <div className="font-black text-slate-900 text-xs mt-1">Panci Presto</div>
                <span className="text-[10px] text-emerald-800 font-semibold">Stainless Steel</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator Tabungan Section */}
      <section id="simulasi" className="bg-emerald-950 text-white py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-slate-900/90 rounded-3xl border border-emerald-700/50 p-6 sm:p-10 shadow-2xl">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
              <Calculator className="w-3.5 h-3.5" />
              <span>Kalkulator & Simulator Cicilan Ringan</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Hitung Sendiri Tabungan Santai Anda
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200">
              Sesuaikan jangka waktu menabung mingguan atau harian agar tidak membebani kantong keluarga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Pilih Paket Impian:</label>
                <select
                  value={simSelectedPackageId}
                  onChange={(e) => setSimSelectedPackageId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — Rp {pkg.targetPrice.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1.5">
                  <span>Durasi Menabung:</span>
                  <span className="text-amber-400">{simulationWeeks} Minggu (~{Math.round(simulationWeeks / 4)} Bulan)</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={48}
                  step={2}
                  value={simulationWeeks}
                  onChange={(e) => setSimulationWeeks(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>12 Minggu (3 Bulan)</span>
                  <span>30 Minggu (~7 Bulan)</span>
                  <span>48 Minggu (~11 Bulan)</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-900/50 rounded-2xl border border-emerald-700/60 space-y-1">
                <span className="text-amber-300 font-bold flex items-center gap-1.5 text-xs">
                  <Info className="w-4 h-4" />
                  Tips Hemat Cerdas
                </span>
                <p className="text-[11px] text-emerald-100 leading-relaxed">
                  Menabung mulai sekarang hanya membutuhkan simpanan uang receh Rp {dailyInstallment.toLocaleString('id-ID')} per hari untuk menyambut Idul Fitri tanpa hutang.
                </p>
              </div>
            </div>

            {/* Results card */}
            <div className="bg-gradient-to-br from-emerald-800 to-teal-900 p-6 rounded-2xl border border-emerald-500/40 text-center space-y-4 shadow-xl">
              <span className="text-xs uppercase font-bold text-emerald-200 tracking-wider">
                Estimasi Setoran Rekomendasi
              </span>
              <div className="py-2 border-y border-emerald-600/50 space-y-1">
                <span className="text-xs text-emerald-200">Setiap Minggu:</span>
                <div className="text-3xl sm:text-4xl font-black text-amber-300">
                  Rp {weeklyInstallment.toLocaleString('id-ID')}
                </div>
                <span className="text-[11px] text-emerald-200">
                  atau setara <strong className="text-white">Rp {dailyInstallment.toLocaleString('id-ID')}/hari</strong>
                </span>
              </div>

              <div className="text-xs text-emerald-100 space-y-1">
                <div>Paket: <strong>{simPkg.name}</strong></div>
                <div>Target Pelunasan: <strong>Rp {simPkg.targetPrice.toLocaleString('id-ID')}</strong></div>
              </div>

              <button
                onClick={() => onOpenRegister(simPkg.id)}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow transition"
              >
                Kunci Simulasi Ini & Daftar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Yellow Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 my-12">
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-slate-950">
            <span className="text-[10px] uppercase font-black tracking-wider bg-slate-950 text-amber-300 px-3 py-1 rounded-full">
              KEMUDAHAN & KEAMANAN TERJAMIN
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Daftar Jadi Member Sagitarius Parcel Sekarang!
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-900/90 max-w-xl">
              Dapatkan akses kemudahan belanja parcel, simpanan berkala tanpa bunga tersembunyi, dan garansi serah terima tepat waktu H-7 Idul Fitri.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => onOpenRegister()}
              className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Daftar Sekarang Gratis
            </button>
            <button
              onClick={onGoToMember}
              className="px-6 py-3 bg-amber-200 hover:bg-white text-slate-900 font-bold text-xs rounded-xl shadow transition"
            >
              Buka Demo Member
            </button>
          </div>
        </div>
      </section>

      {/* Agents Map / Directory Section */}
      <section id="agen" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Jaringan Distribusi Wilayah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Temukan Agen Resmi Sagitarius Terdekat
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Anda dapat menyetor tabungan langsung secara tunai atau mengambil paket Idul Fitri di outlet agen binaan resmi kami.
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-lg mx-auto relative">
            <input
              type="text"
              placeholder="Ketik nama kota, kabupaten, atau nama toko..."
              value={agentSearch}
              onChange={(e) => setAgentSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-2xl shadow-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((ag) => (
            <div
              key={ag.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {ag.code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {ag.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">{ag.name}</h4>
                <p className="text-xs text-slate-500 font-medium">
                  Penanggung Jawab: {ag.ownerName}
                </p>

                <div className="text-xs space-y-1 text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{ag.district}, {ag.regency}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 font-mono">
                    <PhoneCall className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{ag.phone}</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    Membina <strong>{ag.memberCount}</strong> Member
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/62${ag.phone.replace(/^0/, '').replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(ag.name)},%20saya%20ingin%20bergabung%20paket%20lebaran%20Sagitarius%20Parcel.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-emerald-200 transition"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hubungi Agen via WhatsApp</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* About Section: 10 Years */}
      <section id="tentang" className="bg-slate-100 py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              TENTANG SAGITARIUS PARCEL
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Dipercaya Lebih Dari 10 Tahun Menemani Hari Kemenangan Idul Fitri
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              Sagitarius Parcel didirikan dengan komitmen memudahkan setiap keluarga muslim menikmati hidangan kue kering khas Idul Fitri dan sembako berkualitas tanpa harus terbebani pengeluaran mendadak di akhir bulan Ramadan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900">Pilih Paket Sesuai Kebutuhan</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pilih salah satu dari 4 paket unggulan kami sesuai selera keluarga Anda.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900">Setor Tabungan Ringan Rutin</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Setor via transfer bank resmi atau tunai langsung ke agen binaan terdekat.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900">Terima Paket Tepat Waktu H-7</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tunjukkan kode QR tiket pengambilan dan parcel siap dibawa pulang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-br from-[#092b21] to-[#041a14] rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="text-center space-y-2 mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-amber-300">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h3>
            <p className="text-xs text-emerald-200">
              Ketahui segala informasi penting mengenai mekanisme tabungan parcel Idul Fitri
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                q: 'Apakah setoran tabungan parcel ini aman?',
                a: 'Sangat aman. Setiap setoran tercatat otomatis dalam buku tabungan digital member dengan notifikasi SMS/WhatsApp langsung dari sistem pusat Sagitarius Parcel.'
              },
              {
                q: 'Bagaimana jika saya berhalangan menyetor di minggu tertentu?',
                a: 'Sistem tabungan kami fleksibel! Anda dapat merapel atau mencicil lebih di minggu berikutnya sebelum tanggal jatuh tempo pelunasan (H-14 Idul Fitri).'
              },
              {
                q: 'Bagaimana cara mengambil paket lebaran saya?',
                a: 'Setelah paket lunas, Anda akan menerima Kode QR Pengambilan. Cukup tunjukkan kode QR tersebut ke Agen Binaan Anda untuk serah terima paket.'
              },
              {
                q: 'Apakah isi kue kering dijamin baru dan tidak kadaluarsa?',
                a: 'Semua kue kering diproduksi secara fresh pada H-30 hingga H-15 Lebaran oleh mitra produsen bersertifikat Halal dan P-IRT terdaftar dengan jaminan toples tersegel kedap udara.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/10 rounded-2xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm text-white flex items-center justify-between gap-2 hover:bg-white/5 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-400 transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-emerald-100/90 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs pt-12 pb-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm">
                SP
              </div>
              <div>
                <span className="font-bold text-white text-sm block">SAGITARIUS PARCEL</span>
                <span className="text-[10px] text-emerald-400 font-semibold">{COMPANY_INFO.name}</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Katalog Resmi Paket Lebaran {COMPANY_INFO.catalogYear}. Solusi amanah tabungan paket Idul Fitri bagi keluarga muslim Indonesia.
            </p>
            <div className="text-amber-400 font-semibold text-[11px]">
              &quot;{COMPANY_INFO.tagline} — {COMPANY_INFO.subTagline}&quot;
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Kategori Paket Resmi</h5>
            <ul className="space-y-2 text-[11px]">
              <li>Paket Bunda (Reguler, Silver, Gold, Platinum)</li>
              <li>Paket Anak (Hemat, Asyik, Ceria, Hebat)</li>
              <li>Paket Pilihan (Diamond & Sultan)</li>
              <li>Paket Uang Munggahan (295 Hari & 42 Minggu)</li>
              <li>Paket Uang Lebaran (325 Hari & 45 Minggu)</li>
              <li>50 Pilihan Barang Satuan Sembako & Daging</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Ketentuan & Bantuan</h5>
            <ul className="space-y-2 text-[11px]">
              <li>Pembayaran selama 325 hari (45 minggu)</li>
              <li>Paket Uang dibagikan Lebih Awal</li>
              <li>Daging & Telur dibagikan H-2 Idul Fitri</li>
              <li>Door Prize diundi LIVE di Media Sosial Resmi</li>
              <li onClick={onOpenGuide} className="text-amber-400 font-semibold cursor-pointer hover:underline">
                Panduan Operasional Sistem & Korwil
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Kantor & Kontak Resmi</h5>
            <ul className="space-y-2 text-[11px]">
              <li>Kantor Pusat: <strong className="text-white block mt-0.5">{COMPANY_INFO.address}</strong></li>
              <li>WhatsApp Hotline: <a href={`https://wa.me/62${COMPANY_INFO.phone.replace(/^0/, '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-400 font-bold hover:underline">{COMPANY_INFO.phone}</a></li>
              <li>Website: <strong className="text-white">{COMPANY_INFO.website}</strong></li>
              <li>Wilayah: Priangan Timur (Tasikmalaya - Ciamis - Banjar - Pangandaran - Garut)</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div>
            © 2026 - 2027 {COMPANY_INFO.name}. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="text-amber-400/90 font-mono">
            Katalog 2026-2027 · Sagitarius Parcel
          </div>
        </div>
      </footer>

      {/* Package Detail Modal */}
      {activePackageDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="relative h-48 bg-slate-100">
              <img
                src={activePackageDetail.imageUrl}
                alt={activePackageDetail.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActivePackageDetail(null)}
                className="absolute top-3 right-3 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-3 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded shadow">
                {activePackageDetail.tag}
              </div>
              <div className="absolute bottom-3 right-3 bg-slate-950/80 text-white font-semibold text-xs px-2.5 py-1 rounded">
                {activePackageDetail.durationDays || 325} Hari Menabung
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Kategori: Paket {activePackageDetail.category.toUpperCase()}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">{activePackageDetail.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{activePackageDetail.description}</p>
              </div>

              {/* Flyer Bonus Highlights */}
              {(activePackageDetail.thrBonus || activePackageDetail.bonusGift) && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {activePackageDetail.thrBonus && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                      <span className="text-[10px] text-amber-800 font-semibold block uppercase">Bonus THR Tunai:</span>
                      <strong className="text-amber-950 font-bold">{activePackageDetail.thrBonus}</strong>
                    </div>
                  )}
                  {activePackageDetail.bonusGift && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Hadiah Langsung:</span>
                      <strong className="text-emerald-950 font-bold truncate block">{activePackageDetail.bonusGift}</strong>
                    </div>
                  )}
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Total Tabungan:</span>
                  <span className="text-base font-black text-emerald-800 font-mono">
                    Rp {activePackageDetail.targetPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-slate-400 block">Setoran Harian:</span>
                  <span className="font-bold text-slate-800 font-mono">
                    Rp {activePackageDetail.dailyPayment?.toLocaleString('id-ID') || Math.round(activePackageDetail.weeklyPayment / 7).toLocaleString('id-ID')} / hari
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Estimasi Bobot:</span>
                  <span className="font-bold text-slate-800">{activePackageDetail.weight}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wide">
                  Daftar Lengkap Isi Parcel ({activePackageDetail.items.length} Macam):
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {activePackageDetail.items.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className={item.includes('(Bonus)') ? 'font-bold text-amber-800' : ''}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => setActivePackageDetail(null)}
                  className="flex-1 py-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    const id = activePackageDetail.id;
                    setActivePackageDetail(null);
                    onOpenRegister(id);
                  }}
                  className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  Daftar Paket Ini
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
