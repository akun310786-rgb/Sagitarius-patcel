import React, { useState } from 'react';
import { AdminAccount } from '../types/parcel';
import {
  X,
  ShieldCheck,
  UserPlus,
  Users,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Mail,
  User,
  Phone,
  ShieldAlert,
  Trash2,
  Power
} from 'lucide-react';

interface AdminManagerModalProps {
  onClose: () => void;
  adminAccounts: AdminAccount[];
  onAddAdmin: (newAdmin: AdminAccount, password: string) => Promise<boolean>;
  onToggleStatus?: (id: string) => void;
  onDeleteAdmin?: (id: string) => void;
}

export const AdminManagerModal: React.FC<AdminManagerModalProps> = ({
  onClose,
  adminAccounts,
  onAddAdmin,
  onToggleStatus,
  onDeleteAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

  // Form state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'superadmin' | 'admin' | 'finance' | 'staff'>('admin');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanUsername || !cleanEmail || !password.trim() || !name.trim()) {
      setErrorMessage('Harap lengkapi seluruh kolom yang bertanda bintang (*).');
      return;
    }

    if (password.length < 12) {
      setErrorMessage('Kata sandi minimal harus 12 karakter.');
      return;
    }

    // Check duplicate
    const exists = adminAccounts.some(
      (a) => a.username.toLowerCase() === cleanUsername || a.email.toLowerCase() === cleanEmail
    );
    if (exists) {
      setErrorMessage('Username atau Email tersebut sudah terdaftar sebagai akun admin lain.');
      return;
    }

    const roleLabels: Record<string, string> = {
      superadmin: 'Super Admin HQ',
      admin: 'Admin Operasional',
      finance: 'Admin Keuangan',
      staff: 'Staff Verifikasi'
    };

    const newAdmin: AdminAccount = {
      id: `admin-${Date.now()}`,
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      phone: phone.trim() || undefined,
      role,
      roleLabel: roleLabels[role] || 'Admin',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Aktif'
    };

    const created = await onAddAdmin(newAdmin, password.trim());
    if (!created) return;
    setSuccessMessage(`Akun admin ${newAdmin.name} (@${newAdmin.username}) berhasil ditambahkan!`);

    // Reset form
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setPhone('');
    setRole('admin');

    setTimeout(() => {
      setActiveTab('list');
      setSuccessMessage('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#0b1120] text-slate-100 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-800">
        {/* Header */}
        <div className="bg-[#0f172a] border-b border-slate-800 p-5 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-md bg-rose-500/20 text-rose-400 border-rose-500/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">Manajemen Akun Admin</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {adminAccounts.length} Akun Terdaftar
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola hak akses dan penambahan pengurus operasional Sagitarius Parcel
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-900 p-1 rounded-xl text-xs font-semibold border border-slate-800">
              <button
                onClick={() => { setActiveTab('list'); setErrorMessage(''); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === 'list'
                    ? 'bg-rose-700 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Daftar Admin</span>
              </button>
              <button
                onClick={() => { setActiveTab('add'); setErrorMessage(''); }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === 'add'
                    ? 'bg-rose-700 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Tambah Admin</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Messages */}
          {successMessage && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-950/70 border border-rose-500/50 rounded-2xl text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: LIST ADMIN */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Manajemen Akun Admin</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Password disimpan sebagai hash di server dan tidak ditampilkan kembali setelah akun dibuat.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md shrink-0 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Tambah Akun Baru</span>
                </button>
              </div>

              {/* Admin Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {adminAccounts.map((adm) => {
                  const isPrimarySuperAdmin = adm.id === 'admin-001';

                  return (
                    <div
                      key={adm.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5 hover:border-slate-700 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            adm.role === 'superadmin'
                              ? 'bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-md'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {adm.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h5 className="font-bold text-white text-sm">{adm.name}</h5>
                              {isPrimarySuperAdmin && (
                                <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                                  Utama
                                </span>
                              )}
                            </div>
                            <span className="text-slate-400 text-xs font-mono">@{adm.username}</span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          adm.role === 'superadmin'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : adm.role === 'finance'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}>
                          {adm.roleLabel || adm.role}
                        </span>
                      </div>

                      <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" /> Email:
                          </span>
                          <span className="text-white truncate max-w-[200px]">{adm.email}</span>
                        </div>

                        {adm.phone && (
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-500 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" /> WhatsApp:
                            </span>
                            <span className="text-slate-300">{adm.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${adm.status === 'Aktif' ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                          <span className="text-slate-400">Status: <strong className={adm.status === 'Aktif' ? 'text-emerald-400' : 'text-rose-400'}>{adm.status}</strong></span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {onToggleStatus && !isPrimarySuperAdmin && (
                            <button
                              onClick={() => onToggleStatus(adm.id)}
                              className="text-slate-400 hover:text-amber-300 transition flex items-center gap-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700"
                              title="Ubah Status Aktif / Non-aktif"
                            >
                              <Power className="w-3 h-3" />
                              <span>{adm.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}</span>
                            </button>
                          )}

                          {onDeleteAdmin && !isPrimarySuperAdmin && (
                            <button
                              onClick={() => {
                                if (confirm(`Hapus akun admin ${adm.name}?`)) {
                                  onDeleteAdmin(adm.id);
                                }
                              }}
                              className="text-rose-400 hover:text-rose-300 transition p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60"
                              title="Hapus Akun Admin"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: FORM TAMBAH ADMIN */}
          {activeTab === 'add' && (
            <form onSubmit={handleCreateAdmin} className="space-y-4 max-w-xl mx-auto bg-slate-900/70 p-5 rounded-2xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-rose-400" />
                  <span>Formulir Pendaftaran Akun Admin Baru</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Akun yang dibuat akan langsung aktif dan dapat digunakan untuk masuk ke dashboard admin.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Nama Lengkap Admin *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Hendra Wijaya"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Username Login *
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Contoh: hendra_admin"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Huruf kecil tanpa spasi</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Email Kantor *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hendra@sagitariusparcel.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Password Akun *
                    </label>
                    <div className="relative">
                      <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={12}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 12 karakter"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      No. WhatsApp / HP
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="081234567890"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Level Akses / Peran *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-rose-500"
                  >
                    <option value="superadmin">Super Admin HQ (Akses Penuh Seluruh Portal)</option>
                    <option value="admin">Admin Operasional (Kelola Katalog & Jaringan Agen)</option>
                    <option value="finance">Admin Keuangan (Verifikasi Setoran & Laporan CSV)</option>
                    <option value="staff">Staff Logistik & Verifikasi Lapangan</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-md transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Simpan Akun Admin</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#0f172a] border-t border-slate-800 p-4 px-6 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-400">
            Akun admin disimpan permanen dan dapat langsung digunakan login di seluruh perangkat.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Selesai & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
