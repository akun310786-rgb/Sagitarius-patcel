# Autentikasi produksi di Vercel

Backend login memakai koleksi `auth_users` dan `auth_sessions` di MongoDB Atlas. Password disimpan sebagai hash scrypt. Cookie sesi hanya dibaca server, memakai `HttpOnly`, `SameSite=Strict`, dan `Secure` di Vercel. Sesi berakhir setelah 12 jam; indeks TTL menghapus sesi kedaluwarsa.

## Variabel Vercel

Di **Vercel → Project → Settings → Environment Variables**, pastikan tersedia:

- `MONGODB_URI`: URI MongoDB Atlas dengan akses ke database `sagitarius_parcel`.
- `AUTH_BOOTSTRAP_ADMIN_USERNAME`: username admin utama.
- `AUTH_BOOTSTRAP_ADMIN_PASSWORD`: password acak minimal 12 karakter.
- `AUTH_BOOTSTRAP_ADMIN_EMAIL`: email admin utama.
- `AUTH_KORWIL_USERNAME` dan `AUTH_KORWIL_PASSWORD`: opsional untuk akun Korwil; password minimal 12 karakter.

Isi nilai rahasia langsung di pengaturan Vercel, jangan commit nilai sungguhan ke Git. Setelah mengubah environment variables, lakukan redeploy. Login pertama membuat/memperbarui akun utama dengan kredensial dari environment dan menghapus password plaintext lama dari koleksi profil.

## Aktivasi akun yang sudah ada

Akun member atau admin lama yang passwordnya sudah memenuhi syarat akan dimigrasikan ke hash saat login pertama setelah deploy. Password demo umum atau password di bawah 12 karakter dihapus dari profil dan akun ditandai perlu reset.

Admin yang sudah masuk dapat mengatur password baru untuk profil lama melalui `POST /api/admin/accounts/{member|agent|admin}/{id}/password` dengan JSON `{ "password": "password-baru-minimal-12" }`. Endpoint ini memerlukan sesi admin dan mencabut penggunaan password lama. Akun member dan agen baru membuat kredensial saat mendaftar.

Semua role memakai form login yang sama. Jika MongoDB tidak tersedia, login dan pendaftaran ditolak; API privat tidak beralih ke data contoh.
