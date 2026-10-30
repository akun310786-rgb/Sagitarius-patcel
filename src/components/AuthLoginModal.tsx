import React, { useState } from 'react';
import { Member, Agent, UserRole, AdminAccount } from '../types/parcel';
import {
  X,
  User,
  Store,
  MapPin,
  Unlock,
  AlertCircle,
  LogIn
} from 'lucide-react';

interface AuthLoginModalProps {
  onClose: () => void;
  onLoginSuccess: (role: UserRole, targetId?: string) => void;
  members: Member[];
  agents: Agent[];
  adminAccounts?: AdminAccount[];
  initialRole?: UserRole;
}

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({
  onClose,
  onLoginSuccess,
  members,
  agents,
  adminAccounts = [],
  initialRole = 'member'
}) => {
  const [selectedRole, setSelectedRole] = useState<'member' | 'agent' | 'korwil'>(
    initialRole === 'agent' ? 'agent' : initialRole === 'korwil' ? 'korwil' : 'member'
  );
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleChange = (role: 'member' | 'agent' | 'korwil') => {
    setSelectedRole(role);
    setIdentifier('');
    setPassword('');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const id = identifier.trim().toLowerCase();
    const pwd = password.trim();

    if (!id) {
      setErrorMessage('Silakan masukkan username, email, atau ID Anda.');
      return;
    }

    // 1. UNIVERSAL ADMIN LOGIN CHECK:
    // Admin can log in from ANY tab/form as long as username/email and password match!
    const effectiveAdmins = adminAccounts.length > 0 ? adminAccounts : [
      {
        id: 'admin-001',
        name: 'Super Admin Pusat',
        username: 'admin',
        email: 'admin@sagitariusparcel.com',
        password: 'admin123',
        role: 'superadmin' as const,
        roleLabel: 'Super Admin HQ',
        createdAt: '2026-01-01',
        status: 'Aktif' as const
      }
    ];

    const matchedAdmin = effectiveAdmins.find((adm) => {
      const isUsername = adm.username.toLowerCase() === id;
      const isEmail = adm.email.toLowerCase() === id;
      return isUsername || isEmail;
    });

    if (matchedAdmin) {
      if (matchedAdmin.status === 'Non-aktif') {
        setErrorMessage('Akun admin ini berstatus Non-aktif. Silakan hubungi Super Admin HQ.');
        return;
      }
      if (matchedAdmin.password && matchedAdmin.password !== pwd) {
        setErrorMessage('Password salah. Silakan coba lagi.');
        return;
      }

      // Success login as Admin Pusat / Super Admin!
      onLoginSuccess('admin', matchedAdmin.id);
      onClose();
      return;
    }

    // 2. MEMBER LOGIN
    if (selectedRole === 'member') {
      const found = members.find((m) => {
        const emailMatch = m.email && m.email.toLowerCase() === id;
        const userMatch = m.username && m.username.toLowerCase() === id;
        const codeMatch = m.memberCode.toLowerCase() === id;
        const phoneMatch = m.phone.replace(/[^0-9]/g, '') === id.replace(/[^0-9]/g, '');
        const nameMatch = m.name.toLowerCase() === id;
        return emailMatch || userMatch || codeMatch || phoneMatch || nameMatch;
      });

      if (!found) {
        setErrorMessage('Akun member tidak ditemukan. Periksa email, username, atau nomor telepon Anda.');
        return;
      }

      if (password && found.password && found.password !== password) {
        setErrorMessage('Password salah. Silakan coba lagi.');
        return;
      }

      onLoginSuccess('member', found.id);
      onClose();
    } else if (selectedRole === 'agent') {
      // 3. AGENT LOGIN
      const found = agents.find((a) => {
        const codeMatch = a.code.toLowerCase() === id;
        const phoneMatch = a.phone.replace(/[^0-9]/g, '') === id.replace(/[^0-9]/g, '');
        const ownerMatch = a.ownerName.toLowerCase().includes(id);
        const storeMatch = a.storeName.toLowerCase().includes(id);
        const idMatch = a.id.toLowerCase() === id;
        return codeMatch || phoneMatch || ownerMatch || storeMatch || idMatch;
      });

      if (!found) {
        setErrorMessage('Akun mitra agen tidak ditemukan. Periksa kode agen atau nomor WhatsApp.');
        return;
      }

      onLoginSuccess('agent', found.id);
      onClose();
    } else if (selectedRole === 'korwil') {
      // 4. KORWIL LOGIN
      if (id.includes('korwil') || id.includes('priangan') || id.includes('budi') || id === 'korwil@sp.id') {
        onLoginSuccess('korwil');
        onClose();
      } else {
        onLoginSuccess('korwil');
        onClose();
      }
    }
  };

  const handleQuickLogin = (role: UserRole, targetId?: string) => {
    onLoginSuccess(role, targetId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1c0836] via-[#2d0e54] to-[#150628] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-purple-200 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start space-x-3.5 mb-2 pr-6">
            <img
              src="/assets/aistudio/file_00000000ca58820ba2ac5348f000d329_d1d25037.png"
              alt="Sagitarius Parcel Logo"
              className="w-12 h-12 rounded-xl object-contain shadow-md border border-purple-400/30 bg-black shrink-0"
            />
            <div>
              <div className="flex items-center space-x-1.5 text-amber-300 text-[11px] font-bold tracking-wider uppercase">
                <LogIn className="w-3.5 h-3.5" />
                <span>Portal Resmi Sagitarius Parcel</span>
              </div>
              <h3 className="font-black text-xl text-white leading-tight mt-0.5">
                Masuk ke Dashboard
              </h3>
              <p className="text-xs text-purple-200 mt-1">
                Pilih jenis akun Anda untuk mengakses buku tabungan atau laporan kemitraan agen.
              </p>
            </div>
          </div>

          {/* Role Tabs - Only Member, Agent, Korwil visible to public */}
          <div className="grid grid-cols-3 gap-1.5 mt-4 p-1 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/15">
            <button
              type="button"
              onClick={() => handleRoleChange('member')}
              className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                selectedRole === 'member'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-purple-200 hover:bg-white/10'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[11px]">Member</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('agent')}
              className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                selectedRole === 'agent'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-purple-200 hover:bg-white/10'
              }`}
            >
              <Store className="w-4 h-4" />
              <span className="text-[11px]">Mitra Agen</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('korwil')}
              className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                selectedRole === 'korwil'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-purple-200 hover:bg-white/10'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="text-[11px]">Korwil</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {selectedRole === 'member' && 'Email / Username / No. ID Member *'}
                {selectedRole === 'agent' && 'Kode Agen / No. WhatsApp / Nama Toko *'}
                {selectedRole === 'korwil' && 'Email / Username Koordinator Wilayah *'}
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  selectedRole === 'member'
                    ? 'siti@gmail.com atau sitirahma'
                    : selectedRole === 'agent'
                    ? 'ag-012 atau 081234567890'
                    : 'korwil@sp.id'
                }
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-600 font-medium text-xs bg-slate-50/50 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Password Akun *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi akun Anda"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-600 font-medium text-xs bg-slate-50/50 text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 hover:from-purple-900 hover:via-indigo-900 hover:to-slate-950 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>
                Masuk ke Dashboard{' '}
                {selectedRole === 'member'
                  ? 'Member'
                  : selectedRole === 'agent'
                  ? 'Mitra Agen'
                  : 'Korwil'}
              </span>
            </button>
          </form>

          {/* Quick Demo Access (1-Klik) */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Akses Cepat Pengujian Demo (1-Klik Masuk):
            </span>

            {selectedRole === 'member' && (
              <div className="space-y-1.5">
                {members.slice(0, 3).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleQuickLogin('member', m.id)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-purple-500 bg-slate-50 hover:bg-purple-50/60 flex items-center justify-between transition text-left cursor-pointer"
                  >
                    <div>
                      <strong className="text-slate-900 block text-xs">{m.name}</strong>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {m.email || `${m.memberCode.toLowerCase()}@member.sp`} · {m.packageName}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md shrink-0">
                      Masuk Langsung
                    </span>
                  </button>
                ))}
              </div>
            )}

            {selectedRole === 'agent' && (
              <div className="space-y-1.5">
                {agents.slice(0, 3).map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => handleQuickLogin('agent', a.id)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/60 flex items-center justify-between transition text-left cursor-pointer"
                  >
                    <div>
                      <strong className="text-slate-900 block text-xs">{a.storeName} ({a.ownerName})</strong>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Kode: {a.code} · {a.regency}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md shrink-0">
                      Masuk Agen
                    </span>
                  </button>
                ))}
              </div>
            )}

            {selectedRole === 'korwil' && (
              <button
                type="button"
                onClick={() => handleQuickLogin('korwil')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-purple-500 bg-slate-50 hover:bg-purple-50/60 flex items-center justify-between transition text-left cursor-pointer"
              >
                <div>
                  <strong className="text-slate-900 block text-xs">Budi Santoso (Korwil Priangan Timur)</strong>
                  <span className="text-[10px] text-slate-500">
                    Membawahi Ciamis, Tasikmalaya, Banjar, Pangandaran
                  </span>
                </div>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md shrink-0">
                  Masuk Korwil
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
