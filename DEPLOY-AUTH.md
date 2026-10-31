# Autentikasi produksi di Vercel

Backend login memakai koleksi `auth_users` dan `auth_sessions` di MongoDB Atlas. Password disimpan sebagai hash scrypt. Cookie sesi hanya dibaca server, memakai `HttpOnly`, `SameSite=Strict`, dan `Secure` di Vercel. Sesi berakhir setelah 12 jam; indeks TTL menghapus sesi kedaluwarsa.

## Variabel Vercel

Di **Vercel → Project → Settings → Environment Variables**, pastikan tersedia:

- `MONGODB_URI`: URI MongoDB Atlas dengan akses ke database `sagitarius_parcel`.
- `AUTH_BOOTSTRAP_ADMIN_USERNAME`: username admin utama.
- `AUTH_BOOTSTRAP_ADMIN_PASSWORD`: password acak minimal 12 karakter.
- `AUTH_BOOTSTRAP_ADMIN_EMAIL`: email admin utama.
- `AUTH_KORWIL_USERNAME`, `AUTH_KORWIL_PASSWORD`, dan `AUTH_KORWIL_REGENCY`: opsional untuk akun Korwil; password minimal 12 karakter dan wilayah harus cocok persis dengan nama Kabupaten/Kota pada profil agen (misalnya `Kab. Ciamis`). Tanpa wilayah, akun Korwil tidak dapat membaca atau memverifikasi transaksi.
- `GEMINI_API_KEY`: API key Gemini untuk chat AI pengunjung. Simpan hanya di environment variables Vercel.
- `GEMINI_MODEL`: opsional untuk memilih model Gemini; default saat ini `gemini-3.8-flash`.

Isi nilai rahasia langsung di pengaturan Vercel, jangan commit nilai sungguhan ke Git. Setelah mengubah environment variables, lakukan redeploy. Login pertama membuat/memperbarui akun utama dengan kredensial dari environment dan menghapus password plaintext lama dari koleksi profil.

## Aktivasi akun yang sudah ada

Akun member atau admin lama yang passwordnya sudah memenuhi syarat akan dimigrasikan ke hash saat login pertama setelah deploy. Password demo umum atau password di bawah 12 karakter dihapus dari profil dan akun ditandai perlu reset.

Admin yang sudah masuk dapat mengatur password baru untuk profil lama melalui `POST /api/admin/accounts/{member|agent|admin}/{id}/password` dengan JSON `{ "password": "password-baru-minimal-12" }`. Endpoint ini memerlukan sesi admin dan mencabut penggunaan password lama. Akun member dan agen baru membuat kredensial saat mendaftar.

Semua role memakai form login yang sama. Jika MongoDB tidak tersedia, login dan pendaftaran ditolak; API privat tidak beralih ke data contoh.

Mode produksi tidak lagi mengisi koleksi kosong dengan transaksi/member contoh dan tidak memakai cache contoh saat MongoDB gagal. Data demo yang telanjur tersimpan di MongoDB lama tidak dihapus otomatis; tinjau dan bersihkan secara manual setelah membuat backup sebelum memakai sistem untuk transaksi nyata.

Chat pengunjung memakai endpoint server `/api/chat`, membatasi jumlah dan ukuran pesan, serta hanya menerima konteks katalog publik. Batas chat 10 permintaan per IP per menit, login 8 kegagalan per 15 menit, serta pendaftaran member/agen dibatasi di MongoDB dengan hash IP. Pesan percakapan tidak disimpan oleh aplikasi. Isi pesan dikirim ke Gemini untuk menghasilkan jawaban, jadi pengunjung diberi tahu agar tidak mengirim password atau informasi pribadi. Jika `GEMINI_API_KEY` belum diset, widget tetap tampil tetapi memberi tahu bahwa AI belum tersedia. API key tidak dimasukkan ke bundle browser.

## Hak akses admin

Pengajuan agen publik berstatus menunggu dan tidak bisa login sampai admin mengaktifkannya dari tab Agen. Akun nonaktif kehilangan sesi aktif; hanya agen aktif yang muncul di direktori publik.

Sub-peran admin tidak memiliki kewenangan yang sama: `superadmin` mengelola akun dan database, `admin` mengelola paket/agen/member, `finance` memverifikasi transaksi, dan `staff` hanya melihat data untuk verifikasi. Role ini tetap memakai pilihan login `Admin`.
