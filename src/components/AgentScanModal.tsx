import React, { useState } from 'react';
import { Member } from '../types/parcel';
import { QrCode, Search, CheckCircle2, AlertTriangle, X, PackageCheck } from 'lucide-react';

interface AgentScanModalProps {
  members: Member[];
  onClose: () => void;
  onFulfill: (memberId: string) => void;
}

export const AgentScanModal: React.FC<AgentScanModalProps> = ({ members, onClose, onFulfill }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [scannedMember, setScannedMember] = useState<Member | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleVerifyToken = () => {
    setErrorMsg('');
    const found = members.find(
      (m) =>
        m.qrToken.toLowerCase() === tokenInput.trim().toLowerCase() ||
        m.memberCode.toLowerCase() === tokenInput.trim().toLowerCase()
    );

    if (!found) {
      setErrorMsg('Kode tiket QR / ID Member tidak ditemukan di database.');
      setScannedMember(null);
      return;
    }

    setScannedMember(found);
  };

  const handleConfirmFulfillment = () => {
    if (!scannedMember) return;
    onFulfill(scannedMember.id);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-blue-200 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-amber-300">
            <QrCode className="w-6 h-6" />
            <h3 className="font-bold text-lg text-white">Scanner & Validasi Serah Terima</h3>
          </div>
          <p className="text-xs text-blue-100 mt-1">
            Validasi kode QR penukaran paket sebelum menyerahkan parcel kepada member
          </p>
        </div>

        <div className="p-6 space-y-4">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">Paket Berhasil Diserahkan!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Status paket untuk {scannedMember?.name} telah diperbarui menjadi &quot;Selesai / Diterima&quot;. Sistem pusat telah mencatat serah terima ini.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
              >
                Selesai
              </button>
            </div>
          ) : (
            <>
              {/* Token Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Scan Barcode atau Masukkan Kode Tiket / ID Member:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="Contoh: QR-20261012-001... atau SP-008129"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  <button
                    onClick={handleVerifyToken}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Cek
                  </button>
                </div>
                {errorMsg && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{errorMsg}</span>
                  </p>
                )}
              </div>

              {/* Quick sample chips */}
              <div className="p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-1 font-semibold">Coba cepat kode contoh:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setTokenInput('QR-20261014-002-ASEP-SUWANDI');
                    }}
                    className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] hover:bg-blue-50 text-slate-700 font-mono"
                  >
                    Asep (Lunas 100%)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTokenInput('SP-008129');
                    }}
                    className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] hover:bg-blue-50 text-slate-700 font-mono"
                  >
                    Siti Rahma (SP-008129)
                  </button>
                </div>
              </div>

              {/* Scanned Result */}
              {scannedMember && (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{scannedMember.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">{scannedMember.memberCode}</p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        scannedMember.totalSaved >= scannedMember.packagePrice
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {scannedMember.totalSaved >= scannedMember.packagePrice ? 'Tabungan Lunas' : 'Belum Lunas'}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Paket:</span>
                      <span className="font-semibold text-emerald-800">{scannedMember.packageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Terkumpul:</span>
                      <span className="font-semibold text-slate-800">
                        Rp {scannedMember.totalSaved.toLocaleString('id-ID')} / Rp{' '}
                        {scannedMember.packagePrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nomor Kontak:</span>
                      <span className="font-mono">{scannedMember.phone}</span>
                    </div>
                  </div>

                  {scannedMember.totalSaved < scannedMember.packagePrice ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Perhatian:</strong> Tabungan member belum lunas. Sisa kekurangan:{' '}
                        <strong>
                          Rp {(scannedMember.packagePrice - scannedMember.totalSaved).toLocaleString('id-ID')}
                        </strong>
                        . Harap lunasi setoran sebelum penyerahan fisik paket.
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Verifikasi Selesai:</strong> Tabungan telah lunas 100%. Silakan serahkan box paket parcel dan klik tombol konfirmasi di bawah.
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleConfirmFulfillment}
                    disabled={scannedMember.totalSaved < scannedMember.packagePrice}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg shadow transition"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>Konfirmasi Serah Terima Fisik Paket</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
