# Sagitarius Parcel - Tabungan & Paket Lebaran

Platform manajemen dan tabungan paket Idul Fitri multi-role untuk **Member, Agen, Korwil, dan Admin Pusat** bersama PT. Sagitarius Trinunggal Karya.

## 📋 Fitur Utama

| Role | Fitur |
|------|-------|
| **Pengunjung / Publik** | Lihat katalog paket, simulasi tabungan, daftar agen, chat AI asisten |
| **Member** | Dashboard tabungan, buat setoran, lihat kuitansi, QR code, riwayat transaksi |
| **Agen** | Manajemen member, setoran cepat, scan QR, simulasi komisi |
| **Korwil** | Verifikasi transaksi wilayah, export laporan CSV, daftar agen per wilayah |
| **Admin Pusat** | Manajemen transaksi, katalog paket, agen, dan akun admin (superadmin/admin/finance/staff) |

## 🚀 Quick Start

### Prasyarat
- Node.js 18+
- MongoDB Atlas (untuk produksi) atau running lokal
- Akun Vercel (untuk deployment)

### Instalasi Development

```bash
# Clone repository
git clone git@github.com:akun310786-rgb/Sagitarius-patcel.git
cd Sagitarius-patcel

# Install dependencies
npm install

# Salin contoh environment
cp .env.example .env

# Isi nilai di file .env (jangan commit file ini!)
# Minimal: MONGODB_URI, AUTH_BOOTSTRAP_ADMIN_*, GEMINI_API_KEY

# Jalankan development server
npm run dev

# Build untuk produksi
npm run build

# Jalankan production build secara lokal
npm run start
```

## 🔐 Environment Variables

Buat file `.env` di root project (tidak di-commit ke Git):

```env
# MongoDB Atlas connection URI
MONGODB_URI="mongodb+srv://<user>:<pass>@cluster.xxx.mongodb.net/sagitarius_parcel?retryWrites=true&w=majority"

# Port server (default: 3000)
PORT=3000

# Bootstrap Admin (diatur saat login pertama kali)
AUTH_BOOTSTRAP_ADMIN_USERNAME="admin"
AUTH_BOOTSTRAP_ADMIN_PASSWORD="minimal12karakter"
AUTH_BOOTSTRAP_ADMIN_EMAIL="admin@sagitariusparcel.com"

# Optional: Korwil account
AUTH_KORWIL_USERNAME="korwil1"
AUTH_KORWIL_PASSWORD="minimal12karakter"
AUTH_KORWIL_REGENCY="Kab. Ciamis"

# Gemini API untuk chat AI pengunjung (server-side only)
GEMINI_API_KEY="<your-gemini-api-key>"
GEMINI_MODEL="gemini-3.6-flash"
GEMINI_FALLBACK_MODEL="gemini-3.5-flash-lite"
```

> ⚠️ Jangan pernah commit nilai asli `.env` ke Git. File `.env.example` adalah satu-satunya yang boleh di-commit.

## 🏗️ Arsitektur

```
Sagitarius-parcel-main/
├── api/
│   └── index.ts              # Vercel serverless function entrypoint
├── public/                   # Aset statis (gambar, screenshot, dll.)
├── src/
│   ├── App.tsx               # Root component (routing & layout utama)
│   ├── main.tsx              # React entry point
│   ├── index.css             # Tailwind CSS import
│   ├── assets/images/        # Gambar paket & branding
│   ├── components/           # Semua komponen UI per role
│   ├── data/mockData.ts      # Data contoh (paket, agen, member, transaksi)
│   ├── server/
│   │   ├── app.ts            # Express app + semua route API
│   │   ├── auth.ts           # Custom auth (scrypt hash, session cookie)
│   │   └── db.ts             # MongoDB koneksi & query
│   ├── types/                # TypeScript type definitions
│   ├── utils/apiClient.ts    # Safe fetch wrapper dengan fallback
│   └── types/parcel.ts       # Interface: Member, Transaction, Package, Agent, Admin
├── server.ts                 # Express server entry (dev & prod)
├── vercel.json               # Konfigurasi Vercel deployment
├── vite.config.ts            # Konfigurasi Vite build
├── tsconfig.json             # Konfigurasi TypeScript
├── .env.example              # Template environment variables
├── .gitignore                # File yang diabaikan Git
├── DEPLOY-AUTH.md            # Panduan autentikasi produksi
└── metadata.json             # Metadata aplikasi
```

## 📦 Deployment ke Vercel

1. Push kode ke GitHub repository `main`
2. Import project ke Vercel
3. Set semua Environment Variables di **Vercel → Project → Settings → Environment Variables**
4. Tambahkan IP Vercel ke **MongoDB Atlas Network Access** (IP Whitelist)
5. Deploy otomatis akan berjalan pada setiap push ke `main`

```json
// vercel.json sudah dikonfigurasi untuk:
// - API routes melalui /api/index.ts (serverless function)
// - SPA fallback ke index.html untuk routes non-API
```

## 🔑 Role & Hak Akses

| Role | Login Via | Akses Utama |
|------|-----------|-------------|
| Member | Email / Username / Nomor Member | Dashboard tabungan, setoran, kuitansi |
| Agen | Kode Agen / Nomor WhatsApp | Manajemen member, setoran cepat, QR scan |
| Korwil | Username Korwil | Verifikasi transaksi wilayah, laporan CSV |
| Admin | Username / Email Admin | Manajemen transaksi, paket, agen, admin accounts |

### Sub-role Admin
- **superadmin**: Kelola akun & database (hanya yang bisa tambah/hapus admin)
- **admin**: Kelola paket, agen, member
- **finance**: Verifikasi transaksi
- **staff**: Hanya melihat data untuk verifikasi

## 📊 Database (MongoDB Atlas)

Koleksi utama:
- `packages` — Katalog paket lebaran
- `agents` — Data agen dan toko mitra
- `members` — Data member tabungan
- `transactions` — Riwayat setoran & status verifikasi
- `admins` — Akun admin pusat
- `auth_users` — Kredensial login (hash scrypt)
- `auth_sessions` — Sesi aktif (dengan TTL 12 jam)

## 🧪 Testing

```bash
# TypeScript type check (tidak ada emit)
npm run lint

# Build production
npm run build
```

## 📄 Lisensi

Internal use — PT. Sagitarius Trinunggal Karya.

## 📞 Kontak

- **WhatsApp**: 0813-2438-3479
- **Website**: www.sagitariusparcel.com
- **Alamat**: Bantar Peundeuy RT. 006 RW. 001 Margajaya Mangunreja, Kab. Tasikmalaya, Jawa Barat 46462