# Roadmap Penyempurnaan Sagitarius Parcel

Dokumen ini merangkum semua rekomendasi penyempurnaan yang dibuat berdasarkan audit aplikasi. File-file pendukung telah dibuat dalam repository ini tanpa mengubah kode asli.

## File yang Baru Dibuat

| File | Deskripsi |
|------|-----------|
| `README.md` | Panduan setup, deployment, arsitektur, dan role akses |
| `API_DOCUMENTATION.md` | Dokumentasi lengkap semua endpoint API |
| `MONGODB_INDEXES.md` | Rekomendasi index MongoDB untuk optimasi query |
| `PENYEMPURNAAN_ROADMAP.md` | Dokumen ini (roadmap) |
| `src/hooks/useAuth.ts` | Custom hook untuk autentikasi (refactor candidate) |
| `src/hooks/useAppData.ts` | Custom hook untuk data aplikasi (refactor candidate) |
| `src/hooks/useToasts.ts` | Custom hook untuk notifikasi toast (refactor candidate) |
| `src/contexts/AuthContext.tsx` | Context provider untuk auth state |
| `src/contexts/AppDataContext.tsx` | Context provider untuk data aplikasi |
| `src/contexts/ToastContext.tsx` | Context provider untuk toast notifications |
| `src/services/api.ts` | Base API service layer |
| `src/services/packageService.ts` | Service untuk paket lebaran |
| `src/services/memberService.ts` | Service untuk member |
| `src/services/transactionService.ts` | Service untuk transaksi |
| `src/services/authService.ts` | Service untuk autentikasi |

## Roadmap Pelaksanaan

### Fase 1: Stabilisasi Produksi (1–2 minggu)
- [ ] Set semua Environment Variables di Vercel (MONGODB_URI, AUTH_BOOTSTRAP_ADMIN_*, GEMINI_API_KEY)
- [ ] Tambahkan IP Vercel ke MongoDB Atlas Network Access
- [ ] Verifikasi `.env` tidak ter-commit ke Git (cek `.gitignore`)
- [ ] Nonaktifkan memory fallback di produksi (`allowMemoryFallback()` harus false)
- [ ] Buat `README.md` (✅ sudah dibuat)
- [ ] Uji login semua role setelah deploy

### Fase 2: Refactoring Arsitektur (2–3 minggu)
- [ ] Terapkan `AuthContext`, `AppDataContext`, `ToastContext` di `App.tsx`
- [ ] Ganti state global di `App.tsx` dengan custom hooks (`useAuth`, `useAppData`, `useToasts`)
- [ ] Pindahkan panggilan API dari komponen ke `src/services/*`
- [ ] Hapus `alert()` native di `AgentDashboard.tsx`, ganti dengan custom modal/toast
- [ ] Pindahkan hardcoded nilai (misal `daysUntilDue = 55`) ke konstanta/env

### Fase 3: Fitur Bisnis & UX (1–2 minggu)
- [ ] Tambahkan pagination untuk daftar member dan transaksi
- [ ] Tambahkan validasi input frontend yang lebih ketat (telepon, email, nominal)
- [ ] Implementasi polling ringan untuk notifikasi realtime (30–60 detik)
- [ ] Tambah status transaksi: `Diverifikasi Korwil`, `Dibatalkan`, `Gagal Pembayaran`

### Fase 4: Pengujian & Operasional (1–2 minggu)
- [ ] Buat unit test untuk `apiClient.ts`, `auth.ts`, `db.ts`
- [ ] Buat integration test untuk flow login semua role
- [ ] Aktifkan MongoDB Atlas Automated Backups
- [ ] Buat GitHub Actions untuk lint dan build otomatis
- [ ] Kompres gambar paket ke WebP untuk mempercepat load website publik

### Fase 5: Peningkatan Lanjutan (Backlog)
- [ ] Export laporan PDF (selain CSV)
- [ ] Print kuitansi
- [ ] Fitur lupa password (reset via email)
- [ ] Dashboard statistik grafik pertumbuhan tabungan
- [ ] Dark mode toggle
- [ ] 2FA untuk superadmin dan admin

## Catatan Penting

Semua file di atas dibuat sebagai **referensi dan candidate refactoring**. Tidak ada kode asli yang diubah. Anda dapat mengadopsi file-file ini secara bertahap sesuai kebutuhan dan kapasitas tim.

Untuk mengadopsi refactoring `App.tsx`, mulailah dengan:
1. Wrap `App.tsx` dengan `AuthProvider`, `AppDataProvider`, dan `ToastProvider`
2. Ganti state global di `App.tsx` dengan `useAuth()`, `useAppData()`, `useToasts()`
3. Pindahkan fungsi API ke service layer (`src/services/*`)
4. Uji setiap fitur setelah setiap langkah refactoring