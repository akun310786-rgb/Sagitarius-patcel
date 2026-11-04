# Panduan Kompresi Gambar ke WebP — Sagitarius Parcel

Gambar paket saat ini berukuran 800KB–1.1MB per file, yang menyebabkan loading website publik lambat. Direkomendasikan mengonversi ke format WebP.

## Ukuran Saat Ini

| File | Ukuran | Estimasi WebP | Penghematan |
|------|--------|---------------|-------------|
| parcel_bunda_sembako_1793177821665.jpg | 930 KB | ~300 KB | ~68% |
| parcel_bunda_mewah_1793177824319.jpg | 870 KB | ~280 KB | ~68% |
| parcel_anak_snack_1793177823580.jpg | 934 KB | ~300 KB | ~68% |
| parcel_anak_hebat_1793177826965.jpg | 1,012 KB | ~320 KB | ~68% |
| parcel_sultan_sembako_1793177825873.jpg | 1,002 KB | ~320 KB | ~68% |
| luxury_hero_bg_1793194496144.jpg | 1,102 KB | ~350 KB | ~68% |
| **Total** | **~5.8 MB** | **~1.9 MB** | **~67%** |

## Cara Konversi

### Opsi A: Online Konverter (Cepat)
Gunakan situs seperti:
- https://cloudconvert.com/jpg-to-webp
- https://ezgif.com/jpg-to-webp
- https://squoosh.app (dari Google)

Upload setiap file JPG, unduh hasil WebP, lalu ganti file lama.

### Opsi B: Command Line (cwebp)
Jika Anda memiliki `cwebp` (dari libwebp):

```bash
# Konversi semua file JPG ke WebP
cwebp -q 80 parcel_bunda_sembako_1793177821665.jpg -o parcel_bunda_sembako_1793177821665.webp
cwebp -q 80 parcel_bunda_mewah_1793177824319.jpg -o parcel_bunda_mewah_1793177824319.webp
cwebp -q 80 parcel_anak_snack_1793177823580.jpg -o parcel_anak_snack_1793177823580.webp
cwebp -q 80 parcel_anak_hebat_1793177826965.jpg -o parcel_anak_hebat_1793177826965.webp
cwebp -q 80 parcel_sultan_sembako_1793177825873.jpg -o parcel_sultan_sembako_1793177825873.webp
cwebp -q 80 luxury_hero_bg_1793194496144.jpg -o luxury_hero_bg_1793194496144.webp
```

### Opsi C: ImageMagick
```bash
magick parcel_bunda_sembako_1793177821665.jpg parcel_bunda_sembako_1793177821665.webp
# dstlbnya untuk file lainnya
```

## Setelah Konversi

1. Ganti file JPG lama dengan WebP di `public/assets/images/`
2. Perbarui ekstensi di `src/data/mockData.ts`:
   ```ts
   // Dari:
   imageUrl: '/assets/images/parcel_bunda_sembako_1793177821665.jpg',
   // Menjadi:
   imageUrl: '/assets/images/parcel_bunda_sembako_1793177821665.webp',
   ```
3. Uji di browser — pastikan gambar tampil dengan benar
4. Commit dan push ke GitHub, lalu redeploy di Vercel

> ⚠️ WebP didukung oleh semua browser modern (Chrome, Firefox, Edge, Safari 14+). Untuk browser lama, tambahkan fallback menggunakan `<picture>` dengan source JPG.