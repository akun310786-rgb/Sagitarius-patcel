import React from 'react';
import { UserRole } from '../types/parcel';
import { Globe, User, Store, MapPin, ShieldCheck, Smartphone, DollarSign, HelpCircle, BellRing } from 'lucide-react';

interface TopSwitcherProps {
  currentView: UserRole | 'deposit';
  onSelectView: (view: UserRole | 'deposit') => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenGuide: () => void;
  onSimulateIncoming?: () => void;
}

export const TopSwitcher: React.FC<TopSwitcherProps> = ({
  currentView,
  onSelectView,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenGuide,
  onSimulateIncoming
}) => {
  return (
    <div className="bg-slate-900 text-white text-xs sticky top-0 z-50 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase">
            SP
          </span>
          <span className="font-semibold text-amber-400 hidden sm:inline">SAGITARIUS PARCEL</span>
          <span className="text-slate-400 hidden md:inline">| Mode Pratinjau Sistem:</span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
          <button
            onClick={() => onSelectView('public')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded transition font-medium whitespace-nowrap ${
              currentView === 'public'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>1. Website Publik</span>
          </button>

          <button
            onClick={() => onSelectView('member')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded transition font-medium whitespace-nowrap ${
              currentView === 'member'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5 text-amber-300" />
            <span>2. Dashboard Member</span>
          </button>

          <button
            onClick={() => onSelectView('deposit')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded transition font-medium whitespace-nowrap ${
              currentView === 'deposit'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-teal-300" />
            <span>3. Setor Tabungan</span>
          </button>

          <button
            onClick={() => onSelectView('agent')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded transition font-medium whitespace-nowrap ${
              currentView === 'agent'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-blue-300" />
            <span>4. Dashboard Agen</span>
          </button>

          <button
            onClick={() => onSelectView('korwil')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded transition font-medium whitespace-nowrap ${
              currentView === 'korwil'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-purple-300" />
            <span>5. Dashboard Korwil</span>
          </button>

          <button
            onClick={() => onSelectView('admin')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded transition font-medium whitespace-nowrap ${
              currentView === 'admin'
                ? 'bg-rose-700 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />
            <span>6. Dashboard Admin Pusat</span>
          </button>
        </div>

        {/* Right Tools: Mobile Frame & Guide */}
        <div className="flex items-center space-x-2">
          {onSimulateIncoming && (
            <button
              onClick={onSimulateIncoming}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 border border-emerald-500/50 rounded text-xs font-bold transition shadow-xs"
              title="Simulasikan ada transaksi baru masuk untuk melihat toast notifikasi langsung"
            >
              <BellRing className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Simulasi Setoran Masuk</span>
            </button>
          )}

          <button
            onClick={onToggleMobileFrame}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded text-xs transition border ${
              isMobileFrame
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Simulasikan tampilan layar handphone / mobile"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">7. Tampilan Mobile</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-2.5 py-1.5 rounded shadow transition"
            title="Panduan Analisis & Dokumen Persiapan Lengkap"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Panduan & Persiapan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
