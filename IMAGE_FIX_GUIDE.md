# Panduan Perbaikan Gambar Paket Tidak Muncul

## Penyebab Masalah

Semua `imageUrl` di `src/data/mockData.ts` menggunakan path dengan leading slash yang salah:

```
/src/assets/images/parcel_bunda_sembako_1793177821665.jpg
```

Masalah:
1. Path diawali dengan `/`, yang berarti browser mencari di root domain (`https://domain.com/src/assets/images/...`)
2. File di `src/assets/` hanya bisa diakses melalui **import JavaScript** di Vite, bukan langsung lewat URL
3. Dalam production build (Vite), file `src/assets` tidak tersedia di root URL `/src/assets/...`

## Daftar Semua ImageUrl yang Perlu Diperbaiki

| # | Paket | Path Saat Ini (Salah) | Path yang Benar (Opsi A - public/) |
|---|-------|----------------------|-----------------------------------|
| 1 | Paket Bunda — Reguler | `/src/assets/images/parcel_bunda_sembako_1793177821665.jpg` | `/assets/images/parcel_bunda_sembako_1793177821665.jpg` |
| 2 | Paket Bunda — Silver | `/src/assets/images/parcel_bunda_sembako_1793177821665.jpg` | `/assets/images/parcel_bunda_sembako_1793177821665.jpg` |
| 3 | Paket Bunda — Gold | `/src/assets/images/parcel_bunda_mewah_1793177824319.jpg` | `/assets/images/parcel_bunda_mewah_1793177824319.jpg` |
| 4 | Paket Bunda — Platinum | `/src/assets/images/parcel_bunda_mewah_1793177824319.jpg` | `/assets/images/parcel_bunda_mewah_1793177824319.jpg` |
| 5 | Paket Anak — Snack | `/src/assets/images/parcel_anak_snack_1793177823580.jpg` | `/assets/images/parcel_anak_snack_1793177823580.jpg` |
| 6 | Paket Anak — Hebat | `/src/assets/images/parcel_anak_hebat_1793177826965.jpg` | `/assets/images/parcel_anak_hebat_1793177826965.jpg` |
| 7 | Paket Pilihan — Sultan | `/src/assets/images/parcel_sultan_sembako_1793177825873.jpg` | `/assets/images/parcel_sultan_sembako_1793177825873.jpg` |
| 8 | Paket Pilihan — Emperor | `/src/assets/images/parcel_sultan_sembako_1793177825873.jpg` | `/assets/images/parcel_sultan_sembako_1793177825873.jpg` |

Semua ada di baris 39, 70, 107, 140, 174, 212, 252, 294, 344, 382 di `src/data/mockData.ts`.

---

## Opsi A: Pindahkan ke Folder `public/` (Rekomendasi)

Langkah-langkah:

### 1. Pindahkan file gambar

Pindahkan semua file dari `src/assets/images/` ke `public/assets/images/`:

```powershell
# Buat folder tujuan
New-Item -ItemType Directory -Path 'd:\Sagitarius-parcel-main\public\assets\images' -Force

# Pindahkan file gambar
Move-Item 'd:\Sagitarius-parcel-main\src\assets\images\parcel_bunda_sembako_1793177821665.jpg' 'd:\Sagitarius-parcel-main\public\assets\images\'
Move-Item 'd:\Sagitarius-parcel-main\src\assets\images\parcel_bunda_mewah_1793177824319.jpg' 'd:\Sagitarius-parcel-main\public\assets\images\'
Move-Item 'd:\Sagitarius-parcel-main\src\assets\images\parcel_anak_snack_1793177823580.jpg' 'd:\Sagitarius-parcel-main\public\assets\images\'
Move-Item 'd:\Sagitarius-parcel-main\src\assets\images\parcel_anak_hebat_1793177826965.jpg' 'd:\Sagitarius-parcel-main\public\assets\images\'
Move-Item 'd:\Sagitarius-parcel-main\src\assets\images\parcel_sultan_sembako_1793177825873.jpg' 'd:\Sagitarius-parcel-main\public\assets\images\'
```

### 2. Ubah path di `src/data/mockData.ts`

Ubah setiap `imageUrl` dengan menghapus `src/` dari path:

```ts
// Sebelum:
imageUrl: '/src/assets/images/parcel_bunda_sembako_1793177821665.jpg',

// Sesudah:
imageUrl: '/assets/images/parcel_bunda_sembako_1793177821665.jpg',
```

Lakukan untuk semua 10 entri imageUrl di `mockData.ts`.

---

## Opsi B: Impor Gambar via Vite (Alternatif)

Jika Anda ingin tetap menaruh gambar di `src/assets/`:

### 1. Ubah `src/data/mockData.ts`

Tambahkan impor di bagian atas file:

```ts
import pkgBundaSembako from '../assets/images/parcel_bunda_sembako_1793177821665.jpg';
import pkgBundaMewah from '../assets/images/parcel_bunda_mewah_1793177824319.jpg';
import pkgAnakSnack from '../assets/images/parcel_anak_snack_1793177823580.jpg';
import pkgAnakHebat from '../assets/images/parcel_anak_hebat_1793177826965.jpg';
import pkgSultanSembako from '../assets/images/parcel_sultan_sembako_1793177825873.jpg';
```

### 2. Ganti nilai `imageUrl` dengan variabel impor

```ts
// Sebelum:
imageUrl: '/src/assets/images/parcel_bunda_sembako_1793177821665.jpg',

// Sesudah:
imageUrl: pkgBundaSembako,
```

Vite akan otomatis men-generate URL yang benar (termasuk hash untuk caching production).

---

## Verifikasi Setelah Perbaikan

Setelah melakukan perbaikan, pastikan:

1. **Build berhasil:**
   ```powershell
   npm run build
   ```

2. **File gambar tersedia di output build:**
   ```powershell
   Get-ChildItem 'd:\Sagitarius-parcel-main\dist\assets\images\'
   ```

3. **Browser tidak menampilkan 404 untuk gambar** — buka DevTools (F12) > Network, pastikan semua gambar muat dengan status 200.

---

## Catatan

- Jika Anda memilih **Opsi A**, folder `src/assets/images/` akan kosong setelah dipindahkan. File `luxury_hero_bg_1793194496144.jpg` yang diimpor di `PublicWebsite.tsx` baris 4 bisa juga dipindahkan atau dibiarkan di `src/assets/` karena itu menggunakan import Vite.
- Pastikan untuk **commit dan push** perubahan ke GitHub setelah perbaikan selesai.