import React, { useEffect } from 'react';
import { ToastNotification } from '../types/toast';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  BellRing,
  X,
  CreditCard,
  ArrowRight
} from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
  currentRole?: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  currentRole
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 sm:right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
          currentRole={currentRole}
        />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: () => void;
  currentRole?: string;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss, currentRole }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          border: 'border-emerald-500/70',
          bg: 'bg-slate-900/95',
          iconColor: 'text-emerald-400',
          iconBg: 'bg-emerald-950/80 border-emerald-500/40',
          progressColor: 'bg-emerald-400',
          tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          Icon: CheckCircle2
        };
      case 'error':
        return {
          border: 'border-rose-500/70',
          bg: 'bg-slate-900/95',
          iconColor: 'text-rose-400',
          iconBg: 'bg-rose-950/80 border-rose-500/40',
          progressColor: 'bg-rose-500',
          tagBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          Icon: XCircle
        };
      case 'warning':
        return {
          border: 'border-amber-500/70',
          bg: 'bg-slate-900/95',
          iconColor: 'text-amber-400',
          iconBg: 'bg-amber-950/80 border-amber-500/40',
          progressColor: 'bg-amber-400',
          tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          Icon: AlertCircle
        };
      case 'info':
      default:
        return {
          border: 'border-blue-500/70',
          bg: 'bg-slate-900/95',
          iconColor: 'text-sky-400',
          iconBg: 'bg-sky-950/80 border-sky-500/40',
          progressColor: 'bg-sky-400',
          tagBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          Icon: BellRing
        };
    }
  };

  const { border, bg, iconColor, iconBg, progressColor, tagBg, Icon } = getStyle();

  return (
    <div
      className={`pointer-events-auto rounded-2xl shadow-2xl border ${border} ${bg} text-white p-4 backdrop-blur-md relative overflow-hidden transition-all duration-300 transform translate-y-0 opacity-100 hover:shadow-emerald-500/10 animate-in fade-in slide-in-from-top-3`}
      role="alert"
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-xl border ${iconBg} ${iconColor} shrink-0 mt-0.5 shadow-sm`}>
          <Icon className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tagBg}`}>
              {toast.type === 'success'
                ? 'Status: Disetujui'
                : toast.type === 'error'
                ? 'Status: Ditolak'
                : toast.type === 'warning'
                ? 'Menunggu Verifikasi'
                : 'Transaksi Masuk'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {toast.timestamp}
            </span>
          </div>

          <h4 className="text-sm font-bold text-white tracking-tight">
            {toast.title}
          </h4>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {toast.message}
          </p>

          {toast.invoiceNo && (
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Invoice: <strong className="text-emerald-400">{toast.invoiceNo}</strong></span>
              {toast.amount && (
                <span className="text-amber-400 font-bold">
                  Rp {toast.amount.toLocaleString('id-ID')}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          aria-label="Tutup notifikasi"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-dismiss animated bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
        <div
          className={`h-full ${progressColor} animate-[shrink_5.5s_linear_forwards]`}
          style={{
            animation: 'shrink 5.5s linear forwards'
          }}
        />
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};
