# Sagitarius Parcel: Portal Agen & Manajemen Katalog Terintegrasi Supabase

Platform operasional terpadu untuk ekspansi jaringan kemitraan agen paket Lebaran dengan kalkulator komisi otomatis berjenjang serta modul manajemen katalog dinamis yang memungkinkan admin mengelola dan mengkustomisasi isi paket parcel Idul Fitri secara real-time.

### User Review & Critical Decisions

> [!IMPORTANT]
> **Keputusan yang Telah Dikonfirmasi Pengguna (Fase Klarifikasi & Implementasi):**
> 1. **Prioritas Modul:** Berfokus pada **Poin 3 (Portal Pendaftaran Agen & Perhitungan Komisi Otomatis)** dan **Poin 4 (Pengaturan Katalog Paket & Kustomisasi Isi Parcel)**.
> 2. **Sistem Pendaftaran & Autentikasi Member:** Formulir pendaftaran member dilengkapi input Username, Email, dan Password. Dashboard Member memverifikasi status login sebelum menampilkan detail tabungan pribadi, dengan demo login 1-klik untuk kemudahan pengujian.
> 3. **Visualisasi Progress Bar Target Tabungan (Selesai):** Dashboard Member menampilkan visualisasi progress bar yang responsif dengan milestone tracking (0%, 25%, 50%, 75%, 100%), perbandingan target harga vs terkumpul, sisa pelunasan dalam format Rupiah (`tabular-nums`), estimasi tempo cicilan harian/mingguan, serta status selebrasi saat target 100% lunas.
> 4. **Arsitektur Penyimpanan Produksi:** Mengadopsi arsitektur **Cloud Database dengan Supabase (PostgreSQL)** lengkap dengan skema tabel relasional, autentikasi berbasis role (RBAC), dan Row Level Security (RLS).
> 
> **Pilihan Terbuka & Rekomendasi:**
> - **Skema Komisi Agen:** Rekomendasi sistem komisi bertingkat (*Tiered Commission*): 5% untuk 1–50 paket, 6% untuk 51–100 paket, dan 7% untuk >100 paket lunas, ditambah bonus pencapaian kuota H-10 Lebaran.
> - **Kustomisasi Paket oleh Member:** Member dapat memilih varian rasa kue kering (misal nastar reguler vs keju) atau menambahkan item sembako tambahan (*add-on*), dengan penyesuaian nominal cicilan mingguan secara otomatis.

---

### 1. Overview & Core Concept

- **What It Does**: Memberikan portal mandiri bagi calon mitra agen untuk mendaftar, melengkapi verifikasi identitas/outlet, memantau perolehan komisi dan bonus penjualan secara transparan, serta menyediakan panel admin interaktif untuk mengedit katalog parcel (harga target, berat, cicilan mingguan, dan daftar item bahan/kue) dengan sinkronisasi ke Supabase.
- **Target Audience / Persona**:
  - *Calon & Mitra Agen*: Pemilik warung, ibu-ibu paguyuban/PKK, dan tokoh lingkungan yang ingin memperoleh penghasilan tambahan menjelang hari raya Idul Fitri.
  - *Admin Katalog & Pusat*: Tim operasional pusat Sagitarius Parcel yang bertanggung jawab atas penyesuaian harga pasar sembako dan varian kemasan toples.
- **Key Value**: Menghilangkan proses hitung manual komisi agen yang rawan selisih, mempercepat rekrutmen jaringan outlet di berbagai kabupaten, dan mempermudah penyesuaian isi paket sembako sesuai ketersediaan stok distributor pabrik.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Alur Pendaftaran & Verifikasi Agen (Portal Mandiri)**:
   - Calon mitra membuka tab "Gabung Mitra Agen" pada website publik.
   - Mengisi form identitas: Nama Outlet, Nama Penanggung Jawab, Nomor WhatsApp aktif, Alamat Toko, Kecamatan/Kabupaten, Titik GPS, dan Rekening Bank pencairan komisi.
   - Sistem melakukan *instant preview* kartu agen dan menghasilkan kode registrasi sementara yang menunggu approval Korwil/Pusat.
2. **Kalkulator & Simulator Komisi Agen**:
   - Agen dapat menggeser target paket terjual (misal 50, 100, 250 paket) dan melihat proyeksi komisi cair H-10, estimasi reward bonus tunai, serta margin bersih per paket.
3. **Panel Admin Katalog & Kustomisasi Parcel**:
   - Super Admin dapat menambah paket baru, mengubah harga cicilan mingguan, menambah/menghapus item kue kering/sembako, dan mengaktifkan varian paket hemat/premium.
   - Perubahan katalog langsung tercermin di Website Publik dan simulasi cicilan member.

#### Visual Identity & Theme
- **Dominant Neutral Canvas**: Slate gelap terstruktur (`#090d16` / `#0f172a`) untuk sistem navigasi dan canvas putih bersih (`#f8fafc`) dengan batas garis *hairline* 1px (`#e2e8f0`).
- **Brand Accents**: Emas Idul Fitri (`#d97706` / `#f59e0b`) dipadukan dengan hijau zamrud amanah (`#059669` / `#047857`) dan indigo untuk aksen manajemen data.
- **Typography & Formatting**: *Plus Jakarta Sans* untuk tampilan judul yang humanis dan berkarakter, dipadukan dengan angka tabular (`font-mono tabular-nums`) untuk semua nilai nominal rupiah, persentase komisi, dan hitungan bobot kilogram.
- **Micro-Interactions**: Transisi halus kalkulator komisi, badge status verifikasi real-time, dan dialog modal interaktif saat menyimpan perubahan item katalog.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Engine Komisi Multi-Tier Otomatis**
  - *Chosen Approach*: Menghitung komisi secara dinamis berdasarkan total akumulasi paket yang diselesaikan (*fulfilled*) oleh agen dengan rumus bertingkat (5% dasar, 6% untuk >50 paket, 7% untuk >100 paket).
  - *Why*: Memotivasi agen lokal untuk menambah member binaan di lingkungannya tanpa memerlukan perhitungan manual di akhir tahun buku.
  - *Alternatives Considered*: Komisi flat per paket (kurang memicu insentif volume tinggi).
- **Decision 2: Kustomisasi Item Parcel Berbasis Relasi Produk (Supabase)**
  - *Chosen Approach*: Model data terpisah antara `packages` (entitas paket) dan `package_items` (rincian item dan kuantitas), sehingga stok, berat, dan harga pokok penjualan (HPP) dapat dihitung transparan.
  - *Why*: Memudahkan admin mengganti satu komponen (misalnya merek biskuit kaleng) tanpa merusak struktur paket yang sudah terdaftar.
  - *Alternatives Considered*: Hardcoded text string (tidak scalable untuk operasional gudang).

---

### 4. Technical Architecture & Data Strategy

#### Component Architecture & System Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                              │
│ [1. Publik] [2. Member] [3. Setor] [4. Agen] [5. Korwil] [6. Admin]   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│     Modul Portal & Komisi Agen  │   │  Modul Admin Pengaturan Katalog │
│                                 │   │                                 │
│ ├─ Form Registrasi Outlet Mitra │   │ ├─ List Katalog & Status Aktif  │
│ ├─ Simulator Komisi Bertingkat  │   │ ├─ Form Tambah/Edit Paket       │
│ ├─ Tabungan & Dompet Komisi Agen│   │ ├─ Manager Item & Bobot Parcel  │
│ └─ Riwayat Pencairan H-10       │   │ └─ Kalkulator HPP & Margin      │
└────────────────┬────────────────┘   └────────────────┬────────────────┘
                 │                                     │
                 └──────────────────┬──────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Supabase Cloud Architecture (PostgreSQL)             │
│                                                                        │
│  ┌───────────────────────┐              ┌───────────────────────────┐  │
│  │     auth.users        │              │         packages          │  │
│  │ (Role: agent, admin)  │              │ (name, target_price, tag) │  │
│  └───────────┬───────────┘              └─────────────┬─────────────┘  │
│              │ 1:1                                    │ 1:N            │
│              ▼                                        ▼                │
│  ┌───────────────────────┐              ┌───────────────────────────┐  │
│  │        agents         │              │       package_items       │  │
│  │ (store_name, bank,    │              │ (item_name, qty, weight)  │  │
│  │  commission_balance)  │              └───────────────────────────┘  │
│  └───────────┬───────────┘                            ▲                │
│              │ 1:N                                    │                │
│              ▼                                        │                │
│  ┌───────────────────────┐                            │                │
│  │        members        │────────────────────────────┘                │
│  │ (total_saved, status) │                                             │
│  └───────────────────────┘                                             │
└────────────────────────────────────────────────────────────────────────┘
```

#### Supabase Database Schema (PostgreSQL)

```sql
-- 1. Tabel Master Paket Lebaran
CREATE TABLE public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'keluarga', 'premium', 'kue', 'sembako'
    tag VARCHAR(50),
    description TEXT,
    target_price NUMERIC(12,2) NOT NULL,
    weekly_payment NUMERIC(10,2) NOT NULL,
    estimated_weight VARCHAR(30),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Item Penyusun Parcel (Dinamis & Kustom)
CREATE TABLE public.package_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
    item_name VARCHAR(150) NOT NULL,
    quantity INT DEFAULT 1,
    unit VARCHAR(30) DEFAULT 'pcs',
    is_customizable BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0
);

-- 3. Tabel Agen & Akun Rekening Komisi
CREATE TABLE public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL, -- e.g. 'AG-012'
    store_name VARCHAR(100) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    district VARCHAR(60) NOT NULL,
    regency VARCHAR(60) NOT NULL,
    bank_name VARCHAR(40),
    bank_account_number VARCHAR(40),
    bank_account_name VARCHAR(100),
    commission_rate_base NUMERIC(4,2) DEFAULT 0.05,
    status VARCHAR(20) DEFAULT 'Menunggu_Verifikasi', -- 'Aktif', 'Non-aktif'
    korwil_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Transaksi Komisi Agen
CREATE TABLE public.agent_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    package_id UUID REFERENCES public.packages(id),
    basis_amount NUMERIC(12,2) NOT NULL,
    commission_earned NUMERIC(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Tercatat', -- 'Siap_Cair', 'Dicairkan'
    disbursement_date TIMESTAMPTZ
);
```

#### Interactive State Mapping & Handlers
- `handleRegisterAgent(formData)`: Memvalidasi data outlet, menghitung estimasi komisi per target, dan menambahkan agen ke daftar binaan Korwil.
- `handleUpdatePackage(packageId, updatedFields)`: Mengedit harga target dan daftar item parcel, serta memperbarui kalkulasi setoran mingguan di seluruh sistem secara sinkron.
- `handleAddItemToPackage(packageId, newItem)`: Menambahkan komponen sembako/kue baru dengan berat dan kuantitas tertentu.
- `handleSimulateCommission(packageCount, avgPrice)`: Menghitung skema komisi multi-tier real-time untuk calon agen.
