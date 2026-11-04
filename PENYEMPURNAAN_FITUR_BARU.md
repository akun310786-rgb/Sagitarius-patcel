# Panduan Implementasi Fitur Baru — Sagitarius Parcel

Dokumen ini berisi rekomendasi implementasi untuk fitur-fitur baru yang direkomendasikan.

## 1. Reset Password (Lupa Password)

### Endpoint Baru: `POST /api/auth/forgot-password`
```ts
// Di src/server/app.ts
app.post('/api/auth/forgot-password', async (req, res) => {
  const { identifier, role } = req.body;
  // 1. Cari user berdasarkan identifier + role di auth_users
  // 2. Generate reset token (random, expiry 1 jam)
  // 3. Simpan token di auth_users atau collection terpisah
  // 4. Kirim email dengan link reset (perlu SMTP service)
  // 5. Respon sukses tanpa mengakui apakah email ada atau tidak (security)
});
```

### Endpoint Baru: `POST /api/auth/reset-password`
```ts
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;
  // 1. Validasi token (belum expired)
  // 2. Hash password baru dengan scrypt
  // 3. Update password di auth_users
  // 4. Hapus token
  // 5. Respon sukses
});
```

### Perlu Ditambahkan
- Email service (SMTP) — gunakan Nodemailer atau layanan seperti SendGrid, Mailgun
- Template email reset password
- Halaman frontend untuk input email dan password baru

## 2. Export Laporan PDF

### Library Direkomendasikan
- `jspdf` + `html2canvas` untuk export PDF dari HTML
- Atau `pdfkit` di server-side untuk generate PDF

### Implementasi Sederhana (Client-side)
```tsx
// Di KorwilDashboard atau AdminDashboard
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const exportToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  const canvas = await html2canvas(element!);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
  pdf.save(filename);
};
```

### Langkah
1. Install: `npm install jspdf html2canvas`
2. Tambah tombol "Export PDF" di KorwilDashboard dan AdminDashboard
3. Uji export laporan transaksi

## 3. Grafik Statistik (Dashboard Admin)

### Library Direkomendasikan
- `recharts` — React chart library yang ringan
- Atau `chart.js` + `react-chartjs-2`

### Implementasi
```tsx
// Di AdminDashboard.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Data: pertumbuhan tabungan per bulan
const data = [
  { name: 'Jan', total: 40000000 },
  { name: 'Feb', total: 55000000 },
  // ...
];

<LineChart width={600} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="total" stroke="#8884d8" />
</LineChart>
```

### Langkah
1. Install: `npm install recharts`
2. Tambah tab "Statistik" di AdminDashboard
3. Tampilkan grafik pertumbuhan tabungan, jumlah member, transaksi per bulan

## 4. Dark Mode

### Implementasi dengan Tailwind CSS
```tsx
// Di App.tsx atau komponen terpisah
const [darkMode, setDarkMode] = useState(false);

// Toggle class di html element
useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);

// Gunakan class dark: di elemen
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
```

### Langkah
1. Tambah `darkMode` state di App.tsx
2. Tambah tombol toggle di header
3. Perbarui komponen dengan class `dark:`

## 5. 2FA (Two-Factor Authentication)

### Library Direkomendasikan
- `speakeasy` — generate dan verifikasi TOTP
- `qrcode` — generate QR code untuk Google Authenticator

### Implementasi
1. Admin aktifkan 2FA di profil
2. Generate secret key + QR code
3. Admin scan QR dengan Google Authenticator
4. Saat login, masukkan kode 6 digit setelah password

> Prioritas: Tinggi untuk superadmin dan admin.

---

## Prioritas Implementasi

| Fitur | Prioritas | Estimasi Waktu |
|-------|-----------|----------------|
| Reset Password | Tinggi | 3–5 hari |
| Export PDF | Menengah | 1–2 hari |
| Grafik Statistik | Menengah | 2–3 hari |
| Dark Mode | Rendah | 1–2 hari |
| 2FA | Tinggi | 4–6 hari |

---

## Catatan

Semua fitur di atas adalah rekomendasi. Pilih sesuai kebutuhan bisnis dan kapasitas tim. Untuk implementasi spesifik, silakan beri tahu saya fitur mana yang ingin dikerjakan terlebih dahulu.