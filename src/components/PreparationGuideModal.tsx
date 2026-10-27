import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  Users,
  Boxes,
  Cpu,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  CheckCircle2
} from 'lucide-react';

interface PreparationGuideModalProps {
  onClose: () => void;
}

export const PreparationGuideModal: React.FC<PreparationGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'legal' | 'jaringan' | 'logistik' | 'teknis' | 'timeline'>(
    'ringkasan'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Blueprint & Analisis Sistem Bisnis Sagitarius Parcel</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Hal-Hal Utama yang Harus Disiapkan untuk Membangun Sistem Paket Lebaran
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl">
            Panduan komprehensif dari aspek operasional, legalitas dana, skema kemitraan agen, pengadaan logistik, hingga arsitektur teknis aplikasi web.
          </p>

          {/* Navigation Tabs inside Guide */}
          <div className="flex gap-1.5 overflow-x-auto mt-5 pt-3 border-t border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('ringkasan')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'ringkasan' ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              1. Ringkasan Kunci
            </button>
            <button
              onClick={() => setActiveTab('legal')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'legal' ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              2. Legal & Keuangan
            </button>
            <button
              onClick={() => setActiveTab('jaringan')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'jaringan' ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              3. Jaringan Agen & Korwil
            </button>
            <button
              onClick={() => setActiveTab('logistik')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'logistik' ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              4. Pengadaan & Logistik
            </button>
            <button
              onClick={() => setActiveTab('teknis')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'teknis' ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              5. Arsitektur Teknis / Web
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'timeline' ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              6. Roadmap Timeline
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {activeTab === 'ringkasan' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                <h4 className="font-bold text-amber-900 text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Karakteristik Bisnis Paket Lebaran & Tabungan
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Bisnis tabungan parcel Idul Fitri memegang <strong>dana amanah masyarakat dalam siklus 10-12 bulan</strong>. 
                  Kunci keberhasilannya bukan hanya tampilan website yang bagus, melainkan <strong>kredibilitas pencatatan, transparansi mutasi dana, mitigasi kenaikan harga bahan pokok, serta ketepatan serah terima H-7 Lebaran</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <span>A. Persiapan Legalitas & Rekening Amanah</span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>Badan usaha resmi (Koperasi Simpan Pinjam / PT Jasa Perdagangan).</li>
                    <li>Rekening giro bank penampung terpisah (Escrow / Amanah), bukan rekening pribadi campur aduk.</li>
                    <li>Surat perjanjian & syarat ketentuan (SOP mutasi, pembatalan, gagal bayar).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center space-x-2 text-blue-800 font-bold">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>B. Struktur Organisasi Jaringan Multi-Tingkat</span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                    <li><strong>Admin Pusat:</strong> Kontrol keuangan, gudang utama, verifikasi rekening, audit stok.</li>
                    <li><strong>Korwil (Koordinator Wilayah):</strong> Mengkoordinir kabupaten/kota, supervisi agen, validasi setoran wilayah.</li>
                    <li><strong>Agen (Toko Kelontong/Mitra):</strong> Menghimpun member lokal, setor tunai, serah terima paket via QR.</li>
                    <li><strong>Member:</strong> Menabung berkala, memantau buku tabungan, ambil paket pakai tiket QR.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-800 font-bold">
                    <Boxes className="w-5 h-5 text-purple-600" />
                    <span>C. Rantai Pasok & Mitigasi Fluktuasi Harga</span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>Kontrak awal (Lock Price) dengan distributor beras, minyak, sirup, kaleng wafer pada H-6 bulan.</li>
                    <li>Vendor pengrajin kue kering higienis (P-IRT / Halal BPJPH) kapasitas ribuan toples.</li>
                    <li>Gudang transit packing & armada logistik serentak H-14 hingga H-7 sebelum hari raya.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center space-x-2 text-teal-800 font-bold">
                    <Cpu className="w-5 h-5 text-teal-600" />
                    <span>D. Fitur Sistem Aplikasi Web (Seperti Desain Ini)</span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>Katalog paket lengkap dengan kalkulator cicilan mingguan / bulanan.</li>
                    <li>Buku tabungan digital real-time & download bukti kuitansi resmi.</li>
                    <li>Metode bayar beragam (QRIS Instant, Virtual Account BRI/BCA, Tunai Agen).</li>
                    <li>Tiket serah terima QR Code anti-penipuan & scanner agen.</li>
                    <li>Integrasi notifikasi WhatsApp Gateway otomatis saat setoran disetujui.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-base">1. Legalitas, Regulasi & Manajemen Risiko Keuangan</h4>
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <strong className="text-slate-900 block text-sm">Bentuk Badan Hukum</strong>
                  <p>
                    Pengumpulan dana tabungan paket masyarakat harus berpayung hukum jelas, paling ideal adalah berbentuk <strong>Koperasi Konsumen</strong> (anggota menabung untuk pengadaan barang hari raya) atau <strong>PT / CV Perdagangan Komoditas</strong> dengan kontrak pemesanan di muka (Pre-Order Tabungan Berjangka).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <strong className="text-slate-900 block text-sm">Rekening Penampungan Khusus (Escrow Account)</strong>
                  <p>
                    Dana tabungan tidak boleh tercampur dengan kas operasional harian. Pisahkan menjadi 3 rekening:
                  </p>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-slate-600">
                    <li><strong>Rekening Tabungan Member (Escrow):</strong> 100% dialokasikan untuk pembelian isi parcel & sembako.</li>
                    <li><strong>Rekening Margin & Komisi:</strong> Alokasi komisi agen, korwil, dan keuntungan kotor.</li>
                    <li><strong>Rekening Operasional:</strong> Biaya admin server, armada pengiriman, kardus packing, dan gaji staf.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <strong className="text-slate-900 block text-sm">Kebijakan SOP Gagal Bayar / Anggota Menunggak</strong>
                  <p>
                    Tentukan aturan jika ada member yang tidak sanggup melunasi sampai batas waktu (misal H-14 Lebaran):
                  </p>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-slate-600">
                    <li><strong>Opsi Downgrade Paket:</strong> Jika menabung Rp 1.000.000 dari target Rp 2.250.000, dialihkan otomatis ke Paket Sembako seharga tabungan terkumpul.</li>
                    <li><strong>Opsi Pengembalian Dana:</strong> Ada potongan biaya administrasi wajar (misal 5-10%) untuk mengganti biaya packaging dan operasional agen.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jaringan' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-base">2. Skema Jaringan & Komisi Kemitraan (Agen & Korwil)</h4>
              <p className="text-xs text-slate-600">
                Sistem paket lebaran bertumpu pada kedekatan lokal para pemilik warung kelontong, ibu-ibu PKK, dan tokoh RT/RW sebagai Agen Resmi.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-700" />
                    <span>Peran & Insentif Agen</span>
                  </div>
                  <ul className="space-y-1.5 text-blue-800 list-disc list-inside">
                    <li>Rekrut member baru dari tetangga atau pelanggan warung.</li>
                    <li>Menerima setoran uang tunai jika member enggan transfer bank.</li>
                    <li>Menjadi titik distribusi (drop point) serah terima paket H-7.</li>
                    <li><strong>Komisi Agen:</strong> Rata-rata 5% - 7% per paket lunas (misal Rp 50.000 - Rp 150.000 per paket).</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2">
                  <div className="font-bold text-purple-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-purple-700" />
                    <span>Peran & Insentif Korwil (Koordinator Wilayah)</span>
                  </div>
                  <ul className="space-y-1.5 text-purple-800 list-disc list-inside">
                    <li>Membina 10-30 agen di wilayah kabupaten/kota masing-masing.</li>
                    <li>Memvalidasi kebenaran setoran tunai dari agen sebelum disetor ke rekening pusat.</li>
                    <li>Mengkoordinir jadwal dropping truk logistik dari gudang pusat ke warung agen.</li>
                    <li><strong>Insentif Korwil:</strong> 1% - 2% dari total akumulasi omset wilayah yang dibina.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logistik' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-base">3. Manajemen Pengadaan, Quality Control & Distribusi H-7</h4>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-900 block text-sm">Kunci Sukses: Negosiasi Harga di Awal (Lock Price)</span>
                  <p className="text-slate-600 leading-relaxed">
                    Harga sembako dan mentega biasanya melonjak 15-30% menjelang bulan Ramadhan. Agar tidak merugi, lakukan MoU pemesanan dengan distributor resmi pabrik (misal Wings, Indofood, distributor beras) pada bulan ke-6 tabungan dengan DP jaminan harga tetap.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-900 block text-sm">Expired Date & Standardisasi Kue Kering</span>
                  <p className="text-slate-600 leading-relaxed">
                    Kue kering (nastar, kastengel, putri salju) sebaiknya baru diproduksi massal pada H-30 hingga H-15 sebelum Idul Fitri agar tetap renyah, fresh, dan higienis saat disantap di hari raya. Gunakan toples tebal dengan segel shrink wrap rapat anti-melempem.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-900 block text-sm">Jadwal Perakitan & Packaging Gudang</span>
                  <p className="text-slate-600 leading-relaxed">
                    Siapkan kardus custom dengan branding Sagitarius Parcel, bubble wrap, dan lakban khusus. Proses packing dimulai H-20 di gudang pusat regional, lalu pengiriman truk ke outlet agen dilakukan serentak pada H-10 sampai H-7.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teknis' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-base">4. Kebutuhan Teknis Sistem & Integrasi Website</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Multi-Role Authentication & Access Control
                  </strong>
                  <p className="text-slate-600">
                    Membedakan hak akses Member, Agen, Korwil, dan Super Admin Pusat secara ketat dengan audit log setiap perubahan saldo tabungan.
                  </p>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    Payment Gateway / Mutasi Otomatis
                  </strong>
                  <p className="text-slate-600">
                    Integrasi payment gateway (Midtrans / Xendit / Tripay) untuk QRIS Dinamis dan Virtual Account bank, serta sistem upload bukti transfer manual untuk setoran agen.
                  </p>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    WhatsApp Notification Gateway
                  </strong>
                  <p className="text-slate-600">
                    Setiap kali setoran diverifikasi agen/admin, sistem otomatis mengirimkan pesan WhatsApp konfirmasi ke nomor HP member agar member merasa aman dan percaya.
                  </p>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Boxes className="w-4 h-4 text-emerald-600" />
                    Tiket QR Pengambilan Paket
                  </strong>
                  <p className="text-slate-600">
                    Kode QR sekali pakai (one-time token) yang hanya terbit saat tabungan mencapai 100% lunas, untuk discan oleh agen saat fisik parcel diserahterimakan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-base">5. Kalender Kerja Siklus 1 Tahun Tabungan Paket Lebaran</h4>
              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-emerald-200">
                <div className="relative flex items-start space-x-3 text-xs pl-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-800">Bulan Ke-1 s.d 2 (Bulan Syawal - Dzulqa&apos;dah):</span>
                    <p className="text-slate-600">Evaluasi paket tahun sebelumnya, penetapan katalog paket baru, rekrutmen agen baru & sosialisasi brosur.</p>
                  </div>
                </div>

                <div className="relative flex items-start space-x-3 text-xs pl-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-800">Bulan Ke-3 s.d 8:</span>
                    <p className="text-slate-600">Periode setoran aktif rutin (mingguan/bulanan), rekapitulasi dana oleh Korwil & Admin Pusat, monitoring absensi setoran.</p>
                  </div>
                </div>

                <div className="relative flex items-start space-x-3 text-xs pl-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-800">Bulan Ke-9 (H-3 Bulan):</span>
                    <p className="text-slate-600">Lock order & PO sembako/biskuit kaleng ke pabrik distributor dengan deposit jaminan harga.</p>
                  </div>
                </div>

                <div className="relative flex items-start space-x-3 text-xs pl-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-800">Bulan Ke-10 (Bulan Rajab/Sya&apos;ban):</span>
                    <p className="text-slate-600">Produksi kue kering fresh, persiapan cetak dus kardus eksklusif, audit final pelunasan member.</p>
                  </div>
                </div>

                <div className="relative flex items-start space-x-3 text-xs pl-2">
                  <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-800">Bulan Ke-11 (Bulan Ramadhan H-14 s.d H-7):</span>
                    <p className="text-slate-600">Finishing packing di gudang pusat, distribusi armada truk ke outlet agen, dan serah terima ke member via Tiket QR.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <span className="text-slate-500">
            Aplikasi demo di bawah ini telah mengimplementasikan seluruh alur di atas.
          </span>
          <button
            onClick={onClose}
            className="flex items-center space-x-1 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow transition"
          >
            <span>Eksplorasi Aplikasi Web Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
