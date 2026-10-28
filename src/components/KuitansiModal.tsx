import React from 'react';
import { Transaction } from '../types/parcel';
import { CheckCircle2, Printer, X, ShieldCheck } from 'lucide-react';

interface KuitansiModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const KuitansiModal: React.FC<KuitansiModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Receipt Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <img
              src="/assets/aistudio/file_00000000ca58820ba2ac5348f000d329_d1d25037.png"
              alt="Sagitarius Parcel Logo"
              className="w-12 h-12 rounded-xl object-contain shadow-md border border-amber-400/40 bg-black shrink-0"
            />
            <div>
              <h2 className="font-bold text-lg tracking-wide text-amber-300">SAGITARIUS PARCEL</h2>
              <p className="text-xs text-emerald-100">Buku Tabungan & Kuitansi Digital Resmi</p>
            </div>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-4 text-sm text-slate-700">
          <div className="text-center py-2 border-b border-dashed border-slate-300">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Bukti Penerimaan Setoran
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              Rp {transaction.amount.toLocaleString('id-ID')}
            </div>
            <div className="inline-flex items-center space-x-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Status: {transaction.status === 'Berhasil' ? 'Terverifikasi Resmi Pusat' : transaction.status}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Nomor Kuitansi / Invoice:</span>
              <span className="font-mono font-semibold text-slate-900">{transaction.invoiceNo}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Tanggal Transaksi:</span>
              <span className="font-medium text-slate-900">{transaction.date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Nama Member:</span>
              <span className="font-semibold text-slate-900">{transaction.memberName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">ID Anggota:</span>
              <span className="font-mono text-slate-800">{transaction.memberCode}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Paket Terdaftar:</span>
              <span className="font-medium text-emerald-800">{transaction.packageName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Metode Penyetoran:</span>
              <span className="font-medium text-slate-900">{transaction.method}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Agen Pengelola:</span>
              <span className="font-medium text-slate-900">{transaction.agentName}</span>
            </div>
            {transaction.notes && (
              <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600">
                <span className="font-semibold block text-slate-700">Catatan:</span>
                {transaction.notes}
              </div>
            )}
          </div>

          {/* Security stamp */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-start space-x-2 text-xs text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Dokumen ini sah dihasilkan oleh Sistem Komputerisasi Sagitarius Parcel 2026/2027. Setoran terikat jaminan paket Idul Fitri 1448 H.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kuitansi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
