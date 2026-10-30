import React, { useState } from 'react';
import { AuthenticatedUser, UserRole } from '../types/parcel';
import { safePostJson } from '../utils/apiClient';
import { AlertCircle, Building2, LogIn, ShieldCheck, Store, User, X } from 'lucide-react';

interface AuthLoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: AuthenticatedUser) => Promise<void> | void;
  initialRole?: UserRole;
}

type LoginRole = AuthenticatedUser['role'];

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({ onClose, onLoginSuccess, initialRole = 'member' }) => {
  const [selectedRole, setSelectedRole] = useState<LoginRole>(
    initialRole === 'admin' || initialRole === 'agent' || initialRole === 'korwil' ? initialRole : 'member'
  );
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const result = await safePostJson<{ user: AuthenticatedUser }>('/api/auth/login', {
        role: selectedRole,
        identifier: identifier.trim(),
        password
      });
      if (!result.ok || !result.data?.user) {
        setErrorMessage(result.error || 'Username atau kata sandi tidak cocok.');
        return;
      }
      await onLoginSuccess(result.data.user);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles: Array<{ id: LoginRole; label: string; icon: React.ReactNode }> = [
    { id: 'member', label: 'Member', icon: <User className="w-4 h-4" /> },
    { id: 'agent', label: 'Agen', icon: <Store className="w-4 h-4" /> },
    { id: 'korwil', label: 'Korwil', icon: <Building2 className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-[#1c0836] via-[#2d0e54] to-[#150628] text-white p-5 sm:p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-purple-200 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition" aria-label="Tutup">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-start space-x-3.5 mb-2 pr-6">
            <img src="/assets/aistudio/file_00000000ca58820ba2ac5348f000d329_d1d25037.png" alt="Sagitarius Parcel Logo" className="w-12 h-12 rounded-xl object-contain shadow-md border border-purple-400/30 bg-black shrink-0" />
            <div>
              <div className="flex items-center space-x-1.5 text-amber-300 text-[11px] font-bold tracking-wider uppercase">
                <LogIn className="w-3.5 h-3.5" /><span>Portal Resmi Sagitarius Parcel</span>
              </div>
              <h3 className="font-black text-xl text-white leading-tight mt-0.5">Masuk ke Dashboard</h3>
              <p className="text-xs text-purple-200 mt-1">Masuk dengan akun terdaftar untuk membuka dashboard Anda.</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1.5 mt-4 p-1 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/15">
            {roles.map((role) => (
              <button key={role.id} type="button" onClick={() => { setSelectedRole(role.id); setIdentifier(''); setPassword(''); setErrorMessage(''); }}
                className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${selectedRole === role.id ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-purple-200 hover:bg-white/10'}`}>
                {role.icon}<span className="text-[11px]">{role.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" /><span>{errorMessage}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label htmlFor="login-identifier" className="block font-semibold text-slate-700 mb-1">
                {selectedRole === 'member' ? 'Email / Username / Nomor Member' : selectedRole === 'agent' ? 'Kode Agen / Nomor WhatsApp' : selectedRole === 'korwil' ? 'Username Korwil' : 'Username / Email Admin'}
              </label>
              <input id="login-identifier" type="text" required autoComplete="username" value={identifier} onChange={(event) => setIdentifier(event.target.value)}
                placeholder={selectedRole === 'member' ? 'Masukkan username, email, atau nomor member' : selectedRole === 'agent' ? 'Masukkan kode agen atau nomor WhatsApp' : selectedRole === 'korwil' ? 'Masukkan username Korwil' : 'Masukkan username atau email admin'}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-600 font-medium text-xs bg-slate-50/50 text-slate-900" />
            </div>
            <div>
              <label htmlFor="login-password" className="block font-semibold text-slate-700 mb-1">Password</label>
              <input id="login-password" type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan kata sandi akun Anda"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-600 font-medium text-xs bg-slate-50/50 text-slate-900" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 hover:from-purple-900 hover:via-indigo-900 hover:to-slate-950 disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" /><span>{isSubmitting ? 'Memeriksa akun…' : 'Masuk'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
