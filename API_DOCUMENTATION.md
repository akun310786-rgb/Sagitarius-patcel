# Dokumentasi API Sagitarius Parcel

Semua endpoint di bawah prefix `/api`. Response selalu dalam format JSON.

## Autentikasi

- Login menggunakan cookie `sp_session` (HttpOnly, SameSite=Strict, Secure di produksi)
- TTL sesi: 12 jam
- Semua endpoint privat memerlukan sesi yang valid
- Endpoint write (POST/PUT/PATCH/DELETE) dilindungi oleh middleware `requireSameOrigin`

---

## 1. AUTH — Autentikasi

### POST `/api/auth/login`
Login multi-role.

**Body:**
```json
{
  "role": "member" | "agent" | "korwil" | "admin",
  "identifier": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "mem-1",
    "role": "member",
    "name": "Siti Rahma",
    "agentId": "ag-012",
    "adminRole": null
  }
}
```

**Response (401):** `{ "error": "Username atau kata sandi tidak cocok." }`

---

### POST `/api/auth/logout`
Kehapus sesi aktif.

**Header:** Cookie `sp_session` harus ada.

**Response (200):** `{ "success": true }`

---

### GET `/api/auth/me`
Mengambil data pengguna yang sedang login berdasarkan cookie sesi.

**Response (200):** `{ "user": { ... } }` atau `{ "user": null }` jika belum login.

---

## 2. PUBLIC — Katalog & Informasi

### GET `/api/packages`
Mengambil daftar semua paket lebaran.

**Response (200):**
```json
[
  {
    "id": "pkg-bunda-reguler",
    "name": "Paket Bunda — Reguler",
    "category": "bunda",
    "tag": "REGULER 2.000/HARI",
    "targetPrice": 650000,
    "dailyPayment": 2000,
    "weeklyPayment": 14000,
    "durationDays": 325,
    "thrBonus": "THR Rp 200.000",
    "bonusGift": "Travel Bag Eksklusif SP",
    "weight": "± 7.5 kg",
    "imageUrl": "/assets/images/parcel_bunda_sembako_1793177821665.jpg",
    "items": ["Travel Bag Eksklusif SP (Bonus)", "..."]
  }
]
```

---

### GET `/api/agents`
Mengambil daftar agen yang aktif.

**Response (200):** Array of `Agent`

---

### POST `/api/chat`
Chat asisten AI (Gemini) untuk pengunjung. Rate limit: 10 permintaan per IP per menit.

**Body:**
```json
{
  "messages": [
    { "role": "user", "text": "Bagaimana cara mendaftar?" }
  ]
}
```

**Response (200):**
```json
{ "reply": "Untuk mendaftar, silakan hubungi agen terdekat atau daftar melalui website." }
```

**Response (429):** `{ "error": "Terlalu banyak pertanyaan. Silakan coba lagi sebentar." }`

---

## 3. MEMBER — Tabungan & Setoran

### GET `/api/members`
Mengambil daftar member (dibatasi sesuai hak akses role login).

**Query Parameter (opsional):** `?agentId=ag-012`

**Response (200):** Array of `Member`

---

### POST `/api/members`
Mendaftarkan member baru (hanya agen atau admin).

**Body:**
```json
{
  "memberCode": "SP-008129",
  "name": "Siti Rahma",
  "phone": "0813-2438-3479",
  "address": "Kp. Sindangrasa RT 01/08",
  "regency": "Kab. Ciamis",
  "agentId": "ag-012",
  "agentName": "Andi Pratama (Toko Makmur)",
  "packageId": "pkg-bunda-reguler",
  "packageName": "Paket Bunda — Reguler",
  "packagePrice": 650000
}
```

**Response (201):** `{ "member": { ... } }`

---

### POST `/api/transactions`
Buat transaksi setoran baru (status awal: `Menunggu`).

**Body:**
```json
{
  "memberId": "mem-1",
  "amount": 100000,
  "method": "Transfer Bank BRI",
  "notes": "Setoran mingguan ke-12"
}
```

**Response (201):** `{ "transaction": { ... } }`

---

### GET `/api/transactions`
Mengambil daftar transaksi (difilter sesuai role login).

**Query Parameter (opsional):** `?memberId=mem-1`, `?status=Menunggu`

**Response (200):** Array of `Transaction`

---

### PUT `/api/transactions/:id/approve`
Setujui transaksi (hanya admin atau finance).

**Response (200):** `{ "transaction": { ... } }`

---

### PUT `/api/transactions/:id/reject`
Tolak transaksi (hanya admin atau finance).

**Response (200):** `{ "transaction": { ... } }`

---

### GET `/api/transactions/:id/kuitansi`
Unduh/lihat bukti setoran (kuitansi) untuk transaksi tertentu.

**Response (200):** JSON detail kuitansi atau file PDF (tergantung implementasi)

---

## 4. AGEN — Manajemen Agen & Member

### GET `/api/agents`
Lihat daftar agen (publik untuk agen aktif, admin bisa melihat semua termasuk non-aktif).

---

### POST `/api/agents`
Daftarkan agen baru (hanya admin atau superadmin).

**Body:**
```json
{
  "code": "AG-0013",
  "name": "Agen Baru",
  "storeName": "Toko Sejahtera",
  "ownerName": "Budi Santoso",
  "district": "Ciamis",
  "regency": "Kab. Ciamis",
  "phone": "0812-3456-7890",
  "status": "Menunggu"
}
```

---

### PATCH `/api/agents/:id`
Update data agen (hanya admin atau superadmin).

---

### DELETE `/api/agents/:id`
Nonaktifkan agen (hanya superadmin).

---

## 5. ADMIN — Manajemen Sistem

### GET `/api/admins`
Daftar akun admin (hanya superadmin atau admin).

---

### POST `/api/admins`
Tambah akun admin baru (hanya superadmin).

**Body:**
```json
{
  "name": "Admin Cabang",
  "username": "admin2",
  "email": "admin2@sagitariusparcel.com",
  "role": "finance",
  "password": "minimal12karakter",
  "status": "Aktif"
}
```

---

### PATCH `/api/admins/:id`
Update akun admin (hanya superadmin atau admin dengan kewenangan).

---

### DELETE `/api/admins/:id`
Nonaktifkan akun admin (hanya superadmin, tidak bisa menghapus admin-001 atau diri sendiri).

---

### POST `/api/admin/accounts/{member|agent|admin}/{id}/password`
Setel ulang password untuk member, agen, atau admin (hanya admin pusat).

**Body:**
```json
{
  "password": "password-baru-minimal-12"
}
```

---

### GET `/api/db/status`
Status koneksi MongoDB Atlas (hanya superadmin).

**Response (200):**
```json
{
  "connected": true,
  "database": "sagitarius_parcel",
  "maskedUri": "mongodb+srv://***:***@cluster.xxx.mongodb.net/sagitarius_parcel",
  "collections": [
    { "name": "packages", "count": 12 },
    { "name": "agents", "count": 8 },
    { "name": "members", "count": 150 },
    { "name": "transactions", "count": 450 }
  ],
  "error": null
}
```

---

### POST `/api/db/reconnect`
Mencoba kembali mengkoneksikan ke MongoDB (hanya superadmin).

---

### POST `/api/db/seed`
Mengisi ulang data contoh ke database (hanya superadmin, hanya development).

**Response (200):**
```json
{ "success": true, "message": "Berhasil melakukan seed ulang ke MongoDB Atlas!" }
```

---

## 6. Type Definitions (TypeScript)

### Member
```ts
interface Member {
  id: string;
  memberCode: string;
  name: string;
  phone: string;
  email?: string;
  username?: string;
  address: string;
  regency: string;
  agentId: string;
  agentName: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  totalSaved: number;
  lastDepositAmount: number;
  lastDepositDate: string;
  status: 'Aktif' | 'Lunas' | 'Menunggu';
  joinDate: string;
  pickupDate: string;
  qrToken: string;
}
```

### Transaction
```ts
interface Transaction {
  id: string;
  invoiceNo: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  packageName: string;
  agentId: string;
  agentName: string;
  amount: number;
  method: 'Transfer Bank BRI' | 'Transfer Bank BCA' | 'QRIS Instant' | 'Tunai Agen';
  date: string;
  status: 'Berhasil' | 'Menunggu' | 'Ditolak';
  notes?: string;
  proofUrl?: string;
}
```

### ParcelPackage
```ts
interface ParcelPackage {
  id: string;
  name: string;
  category: 'bunda' | 'anak' | 'pilihan' | 'uang' | 'satuan';
  tag: string;
  tier?: string;
  description: string;
  targetPrice: number;
  dailyPayment: number;
  weeklyPayment: number;
  durationDays?: number;
  thrBonus?: string;
  bonusGift?: string;
  weight: string;
  imageUrl: string;
  items: string[];
}
```

### Agent
```ts
interface Agent {
  id: string;
  code: string;
  name: string;
  storeName: string;
  ownerName: string;
  district: string;
  regency: string;
  phone: string;
  memberCount: number;
  totalOmset: number;
  status: 'Aktif' | 'Non-aktif' | 'Menunggu';
}
```

### AdminAccount
```ts
interface AdminAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'superadmin' | 'admin' | 'finance' | 'staff';
  roleLabel: string;
  phone?: string;
  createdAt: string;
  status: 'Aktif' | 'Non-aktif';
}
```

---

## 7. Error Response Format

Semua error mengembalikan format standar:

```json
{
  "error": "Pesan deskripsi error dalam bahasa Indonesia"
}
```

**Kode Status Umum:**
- `200` — Berhasil
- `201` — Dibuat
- `400` — Permintaan tidak valid
- `401` — Tidak terautentikasi
- `403` — Tidak diizinkan (forbidden)
- `404` — Tidak ditemukan
- `429` — Terlalu banyak permintaan (rate limit)
- `500` — Error server internal
- `503` — Layanan tidak tersedia (database down)

---

## 8. Rate Limiting

| Endpoint | Batas |
|----------|-------|
| `/api/chat` | 10 permintaan per IP per menit |
| `/api/auth/login` | 8 kegagalan per 15 menit per IP |
| Pendaftaran member/agen | Dibatasi dengan hash IP di MongoDB |

---

## 9. Contoh Penggunaan (JavaScript/Fetch)

### Login
```javascript
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    role: 'member',
    identifier: 'SP-008129',
    password: 'password123'
  }),
  credentials: 'include' // penting untuk cookie
});
const data = await res.json();
```

### Buat Setoran
```javascript
const res = await fetch('/api/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    memberId: 'mem-1',
    amount: 100000,
    method: 'Transfer Bank BRI'
  }),
  credentials: 'include'
});
```

---

## 10. Catatan Deployment

- Semua endpoint API di-routekan melalui `api/index.ts` (Vercel serverless function)
- Pastikan `MONGODB_URI` di-set di Vercel Environment Variables
- Pastikan IP Vercel ditambahkan ke MongoDB Atlas Network Access
- Jangan expose `GEMINI_API_KEY` ke frontend; hanya digunakan server-side di `/api/chat`