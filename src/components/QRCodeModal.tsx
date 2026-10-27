import React from 'react';
import { Member } from '../types/parcel';
import { X, QrCode, ShieldCheck, Download, AlertCircle } from 'lucide-react';

interface QRCodeModalProps {
  member: Member;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ member, onClose }) => {
  const isLunas = member.totalSaved >= member.packagePrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-amber-400 text-slate-900 rounded-full mx-auto flex items-center justify-center font-bold text-xl shadow mb-2">
            SP
          </div>
          <h3 className="font-bold text-lg text-amber-300">Tiket Serah Terima Paket Lebaran</h3>
          <p className="text-xs text-emerald-100">Tunjukkan barcode / QR ini kepada Agen saat pengambilan paket</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Status Badge */}
          <div className="text-center">
            {isLunas ? (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>TABUNGAN LUNAS (100%) - SIAP AMBIL</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>BELUM LUNAS ({Math.round((member.totalSaved / member.packagePrice) * 100)}%) - TIKET PRATINJAU</span>
              </span>
            )}
          </div>

          {/* Interactive QR Display */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl">
            <div className="bg-white p-3 rounded-xl shadow-inner border border-slate-200 relative group">
              {/* Stylized high quality QR representation */}
              <div className="w-48 h-48 bg-white flex flex-col items-center justify-center border-2 border-slate-900 rounded-lg p-2 relative overflow-hidden">
                {/* Visual QR Code Pattern */}
                <div className="grid grid-cols-6 gap-1 w-full h-full p-1">
                  {Array.from({ length: 36 }).map((_, i) => {
                    const isCorner =
                      i === 0 || i === 1 || i === 6 || i === 7 ||
                      i === 4 || i === 5 || i === 10 || i === 11 ||
                      i === 30 || i === 31;
                    const isFilled = isCorner || (i * 7 + 3) % 4 !== 0;
                    return (
                      <div
                        key={i}
                        className={`rounded-xs transition-colors ${
                          isCorner
                            ? 'bg-emerald-900'
                            : isFilled
                            ? 'bg-slate-900'
                            : 'bg-transparent'
                        }`}
                      />
                    );
                  })}
                </div>
                {/* Center Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow border border-amber-500">
                    SP-2027
                  </div>
                </div>
              </div>
            </div>
            <div className="font-mono text-xs font-bold text-slate-700 mt-3 tracking-wider bg-slate-200/70 px-3 py-1 rounded-md">
              {member.qrToken}
            </div>
          </div>

          {/* Details */}
          <div className="text-xs space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Nama Penerima:</span>
              <span className="font-semibold text-slate-800">{member.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ID Anggota:</span>
              <span className="font-mono font-medium text-slate-700">{member.memberCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pilihan Paket:</span>
              <span className="font-semibold text-emerald-800">{member.packageName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Outlet Pengambilan:</span>
              <span className="font-semibold text-slate-800">{member.agentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimasi Serah Terima:</span>
              <span className="font-semibold text-amber-700">{member.pickupDate}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center leading-normal">
            Pastikan fisik paket dicek bersama petugas outlet agen sebelum meninggalkan lokasi serah terima.
          </p>
        </div>

        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              alert('QR Code tersimpan! Gambar tiket telah disiapkan untuk diunduh.');
            }}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Simpan Tiket QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
