# Patch: Perbaiki Gambar Paket Tidak Muncul di Production

## Masalah

Di `src/App.tsx`, data paket dan agen hanya dimuat dari `PACKAGES` / `AGENTS` (mock data) saat development (`import.meta.env.DEV === true`). Di production:

```tsx
// Baris 32 - Hanya di DEV
const [packages, setPackages] = useState<ParcelPackage[]>(import.meta.env.DEV ? PACKAGES : []);

// Baris 33 - Hanya di DEV
const [agents, setAgents] = useState<Agent[]>(import.meta.env.DEV ? AGENTS : []);
```

Dan saat fetch API (baris 72):
```tsx
safeFetchJson<ParcelPackage[]>('/api/packages', import.meta.env.DEV ? PACKAGES : []).then(setPackages);
```

Di production, `packages` dimulai sebagai `[]`. Jika API `/api/packages` gagal (karena MongoDB tidak terhubung dan `allowMemoryFallback` di `db.ts` nonaktif di production), `packages` tetap kosong → tidak ada gambar yang ditampilkan.

## Solusi

Ubah inisialisasi state di `src/App.tsx` agar `PACKAGES` dan `AGENTS` selalu tersedia sebagai data awal, meski di production. Data akan di-overwrite jika API berhasil merespons.

### File yang perlu diubah: `src/App.tsx`

#### 1. Ubah inisialisasi `packages` (baris 32)

**Sebelum:**
```tsx
const [packages, setPackages] = useState<ParcelPackage[]>(import.meta.env.DEV ? PACKAGES : []);
```

**Sesudah:**
```tsx
const [packages, setPackages] = useState<ParcelPackage[]>(PACKAGES);
```

#### 2. Ubah inisialisasi `agents` (baris 33)

**Sebelum:**
```tsx
const [agents, setAgents] = useState<Agent[]>(import.meta.env.DEV ? AGENTS : []);
```

**Sesudah:**
```tsx
const [agents, setAgents] = useState<Agent[]>(AGENTS);
```

#### 3. Ubah fallback fetch `packages` (baris 72)

**Sebelum:**
```tsx
safeFetchJson<ParcelPackage[]>('/api/packages', import.meta.env.DEV ? PACKAGES : []).then(setPackages);
```

**Sesudah:**
```tsx
safeFetchJson<ParcelPackage[]>('/api/packages', PACKAGES).then(setPackages);
```

#### 4. Ubah fallback fetch `agents` (baris 74)

**Sebelum:**
```tsx
const visibleAgents = await safeFetchJson<Agent[]>('/api/agents', import.meta.env.DEV ? AGENTS : []);
```

**Sesudah:**
```tsx
const visibleAgents = await safeFetchJson<Agent[]>('/api/agents', AGENTS);
```

---

## Cara Apply

```powershell
# Backup file asli
Copy-Item 'src\App.tsx' 'src\App.tsx.backup'

# Lakukan edit manual sesuai instruksi di atas, atau gunakan patch berikut:
```

Jika Anda ingin saya langsung mengubah file `App.tsx`, silakan konfirmasi (karena sebelumnya kami setuju untuk tidak mengubah kode asli, namun perbaikan ini diperlukan untuk mengatasi bug gambar tidak muncul).

---

## Verifikasi

Setelah apply patch dan redeploy:

1. Buka website publik
2. Gambar paket di katalog seharusnya sudah muncul
3. Buka DevTools (F12) → Network → cari permintaan gambar, pastikan status 200
4. Jika API gagal, data mock (`PACKAGES`, `AGENTS`) akan tetap ditampilkan sebagai fallback