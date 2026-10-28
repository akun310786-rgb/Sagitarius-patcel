import React, { useState } from 'react';
import { Member, Transaction } from '../types/parcel';
import {
  CreditCard,
  QrCode,
  Store,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

interface MemberDepositFlowProps {
  member: Member;
  onDepositComplete: (newTx: Transaction, amount: number) => void;
  onBackToDashboard: () => void;
}

export const MemberDepositFlow: React.FC<MemberDepositFlowProps> = ({
  member,
  onDepositComplete,
  onBackToDashboard
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [amount, setAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [method, setMethod] = useState<'Transfer Bank BRI' | 'Transfer Bank BCA' | 'QRIS Instant' | 'Tunai Agen'>('Transfer Bank BRI');
  const [proofFileName, setProofFileName] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const remaining = Math.max(0, member.packagePrice - member.totalSaved);

  const quickAmounts = [50000, 100000, 150000, 200000, 250000, 500000];

  const handleSelectQuick = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmount(val);
    if (val) {
      setAmount(parseInt(val, 10));
    }
  };

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmitDeposit = () => {
    if (amount <= 0) return;
    setIsSubmitting(true);

    const now = new Date();
    const dateFormatted = `${now.getDate()} Okt 2026`;
    const randomInv = Math.floor(100 + Math.random() * 900);
    const invoiceNo = `TRX-20261026-${randomInv}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      invoiceNo,
      memberId: member.id,
      memberName: member.name,
      memberCode: member.memberCode,
      packageName: member.packageName,
      agentId: member.agentId,
      agentName: member.agentName,
      amount,
      method,
      date: dateFormatted,
      status: method === 'QRIS Instant' ? 'Berhasil' : 'Menunggu',
      notes: method === 'Tunai Agen' ? 'Setoran tunai ke outlet agen' : 'Setoran via transfer rekening'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onDepositComplete(newTx, amount);
      setStep(3);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToDashboard}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard Member</span>
        </button>

        <div className="text-right">
          <span className="text-[11px] text-slate-500 block">Paket Terdaftar:</span>
          <span className="text-xs font-bold text-emerald-800">{member.packageName}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Step indicator */}
        <div className="bg-gradient-to-r from-[#1c0836] via-[#2d0e54] to-[#150628] text-white p-6">
          <h2 className="text-xl font-bold text-amber-300">Buat Setoran Tabungan Baru</h2>
          <p className="text-xs text-purple-200 mt-1">
            Simpanan amanah untuk persiapan Paket Lebaran 2027 Idul Fitri 1448 H
          </p>

          <div className="flex items-center justify-between mt-6 max-w-md mx-auto text-xs">
            <div className="flex items-center space-x-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                  step >= 1 ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-purple-900/60 text-purple-300'
                }`}
              >
                1
              </div>
              <span className={step >= 1 ? 'font-semibold text-white' : 'text-purple-300/70'}>
                Nominal & Metode
              </span>
            </div>
            <div className="h-0.5 w-12 bg-purple-900/60 mx-2" />
            <div className="flex items-center space-x-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                  step >= 2 ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-purple-900/60 text-purple-300'
                }`}
              >
                2
              </div>
              <span className={step >= 2 ? 'font-semibold text-white' : 'text-purple-300/70'}>
                Pembayaran
              </span>
            </div>
            <div className="h-0.5 w-12 bg-purple-900/60 mx-2" />
            <div className="flex items-center space-x-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                  step === 3 ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-purple-900/60 text-purple-300'
                }`}
              >
                3
              </div>
              <span className={step === 3 ? 'font-semibold text-white' : 'text-purple-300/70'}>
                Selesai
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Nominal & Method */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            {/* Balance Overview */}
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Total Tabungan Anda Saat Ini:</span>
                <span className="text-lg font-black text-purple-900">
                  Rp {member.totalSaved.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Sisa Target Pelunasan:</span>
                <span className="text-lg font-black text-amber-700">
                  Rp {remaining.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Quick Amounts */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Pilih Nominal Setoran Cepat:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {quickAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelectQuick(val)}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center cursor-pointer ${
                      amount === val && !customAmount
                        ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-500'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>Rp {val.toLocaleString('id-ID')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Atau Masukkan Nominal Lain:
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs font-bold text-slate-400">Rp</span>
                <input
                  type="text"
                  placeholder="Contoh: 350.000"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Pilih Metode Penyetoran:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setMethod('Transfer Bank BRI')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center space-x-3 ${
                    method === 'Transfer Bank BRI'
                      ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div className="text-xs">
                    <div className="font-bold text-slate-800">Transfer Bank BRI</div>
                    <div className="text-[11px] text-slate-500">Virtual Account / Rekening Pusat</div>
                  </div>
                </div>

                <div
                  onClick={() => setMethod('Transfer Bank BCA')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center space-x-3 ${
                    method === 'Transfer Bank BCA'
                      ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <div className="text-xs">
                    <div className="font-bold text-slate-800">Transfer Bank BCA</div>
                    <div className="text-[11px] text-slate-500">Virtual Account / Rekening Pusat</div>
                  </div>
                </div>

                <div
                  onClick={() => setMethod('QRIS Instant')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center space-x-3 ${
                    method === 'QRIS Instant'
                      ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-purple-700" />
                  <div className="text-xs">
                    <div className="font-bold text-slate-800">QRIS Instant (GoPay/OVO/ShopeePay)</div>
                    <div className="text-[11px] text-purple-800 font-medium">Verifikasi Otomatis Seketika</div>
                  </div>
                </div>

                <div
                  onClick={() => setMethod('Tunai Agen')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center space-x-3 ${
                    method === 'Tunai Agen'
                      ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Store className="w-5 h-5 text-amber-600" />
                  <div className="text-xs">
                    <div className="font-bold text-slate-800">Setor Tunai ke Agen</div>
                    <div className="text-[11px] text-slate-500">Serahkan langsung di {member.agentName}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="button"
                disabled={amount <= 0}
                onClick={() => setStep(2)}
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-900 hover:to-indigo-900 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
              >
                <span>Lanjut ke Instruksi Pembayaran</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Instructions & Confirmation */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Nominal Setoran:</span>
                <span className="text-base font-black text-emerald-800">
                  Rp {amount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Metode Terpilih:</span>
                <span className="font-bold text-slate-800">{method}</span>
              </div>
            </div>

            {/* Method Details */}
            {method === 'Transfer Bank BRI' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3 text-xs">
                <span className="font-bold text-blue-900 block">Rekening Resmi Operasional Sagitarius Parcel:</span>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Bank BRI (Kode: 002)</span>
                    <span className="font-mono text-base font-bold text-slate-900">0124-01-002345-53-8</span>
                    <span className="text-[11px] text-slate-600 block">a.n. YAYASAN / PT SAGITARIUS PARCEL AMANAH</span>
                  </div>
                  <button
                    onClick={() => handleCopyAccount('0124-01-002345-53-8')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopied ? 'Tersalin!' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            )}

            {method === 'Transfer Bank BCA' && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-3 text-xs">
                <span className="font-bold text-indigo-900 block">Rekening Resmi Operasional Sagitarius Parcel:</span>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Bank BCA (Kode: 014)</span>
                    <span className="font-mono text-base font-bold text-slate-900">774-098-1120</span>
                    <span className="text-[11px] text-slate-600 block">a.n. SAGITARIUS PARCEL INDONESIA</span>
                  </div>
                  <button
                    onClick={() => handleCopyAccount('774-098-1120')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopied ? 'Tersalin!' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            )}

            {method === 'QRIS Instant' && (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <span className="text-xs font-bold text-emerald-900 block">
                  Scan QRIS Dinamis Menggunakan BCA Mobile, BRImo, GoPay, OVO, Dana, atau ShopeePay
                </span>
                <div className="w-44 h-44 bg-white p-2 mx-auto rounded-xl border-2 border-emerald-600 shadow-md flex items-center justify-center">
                  <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-slate-900 rounded-lg">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          i % 2 === 0 || i % 3 === 0 ? 'bg-white' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-emerald-800 font-mono">
                  NMID: ID1020261026001 | Sagitarius Parcel
                </p>
              </div>
            )}

            {method === 'Tunai Agen' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900">
                <div className="font-bold flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-amber-700" />
                  <span>Petunjuk Setoran Tunai ke Agen:</span>
                </div>
                <p className="leading-relaxed">
                  Silakan datang langsung ke <strong>{member.agentName}</strong>. Tunjukkan nomor ID Member Anda (
                  <span className="font-mono font-bold text-slate-800">{member.memberCode}</span>) dan serahkan uang tunai sebesar <strong>Rp {amount.toLocaleString('id-ID')}</strong>. Agen akan menginput transaksi langsung ke sistem.
                </p>
              </div>
            )}

            {/* Proof of Transfer Upload */}
            {method !== 'Tunai Agen' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Upload Foto Struk / Screenshot Bukti Transfer (Opsional saat simulasi):
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 cursor-pointer transition">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">
                    {proofFileName ? (
                      <span className="font-bold text-emerald-700">{proofFileName}</span>
                    ) : (
                      'Klik untuk simulasi upload struk transfer ATM / Mobile Banking'
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => setProofFileName('struk_transfer_bri_20261026.jpg')}
                    className="mt-2 text-[11px] text-blue-600 hover:underline font-semibold"
                  >
                    + Pasang contoh file struk demo
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Kembali
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitDeposit}
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-900 hover:to-indigo-900 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
              >
                <span>{isSubmitting ? 'Memproses Setoran...' : 'Konfirmasi & Kirim Setoran'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Completed */}
        {step === 3 && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Setoran Berhasil Diajukan!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Setoran sebesar <strong>Rp {amount.toLocaleString('id-ID')}</strong> telah tercatat pada buku tabungan digital Anda. Saldo tabungan Anda otomatis bertambah dan status telah disinkronkan ke dashboard Korwil & Admin Pusat.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Metode:</span>
                <span className="font-bold text-slate-800">{method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nominal:</span>
                <span className="font-bold text-purple-900">Rp {amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Awal:</span>
                <span className="font-bold text-purple-800">
                  {method === 'QRIS Instant' ? 'Terverifikasi Seketika' : 'Menunggu Validasi Pusat'}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={onBackToDashboard}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-900 hover:to-indigo-900 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
              >
                Buka Buku Tabungan & Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
