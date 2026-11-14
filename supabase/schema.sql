-- ============================================================================
-- SAGITARIUS PARCEL — SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- Jalankan script ini di Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. Tabel Katalog Paket Lebaran (packages)
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bunda', 'anak', 'pilihan', 'uang', 'satuan')),
  tag TEXT NOT NULL,
  tier TEXT,
  description TEXT NOT NULL,
  target_price BIGINT NOT NULL DEFAULT 0,
  daily_payment BIGINT NOT NULL DEFAULT 0,
  weekly_payment BIGINT NOT NULL DEFAULT 0,
  duration_days INTEGER DEFAULT 325,
  thr_bonus TEXT,
  bonus_gift TEXT,
  weight TEXT NOT NULL,
  image_url TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabel Mitra Agen Binaan (agents)
CREATE TABLE IF NOT EXISTS public.agents (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  store_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  district TEXT NOT NULL,
  regency TEXT NOT NULL,
  phone TEXT NOT NULL,
  member_count INTEGER NOT NULL DEFAULT 0,
  total_omset BIGINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Non-aktif')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabel Nasabah / Member Tabungan (members)
CREATE TABLE IF NOT EXISTS public.members (
  id TEXT PRIMARY KEY,
  member_code TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  username TEXT,
  password TEXT,
  address TEXT NOT NULL,
  regency TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  package_price BIGINT NOT NULL DEFAULT 0,
  total_saved BIGINT NOT NULL DEFAULT 0,
  last_deposit_amount BIGINT NOT NULL DEFAULT 0,
  last_deposit_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Lunas', 'Menunggu')),
  join_date TEXT NOT NULL,
  pickup_date TEXT NOT NULL,
  qr_token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabel Transaksi Setoran Tabungan (transactions)
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  invoice_no TEXT NOT NULL,
  member_id TEXT NOT NULL,
  member_name TEXT NOT NULL,
  member_code TEXT NOT NULL,
  package_name TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  amount BIGINT NOT NULL DEFAULT 0,
  method TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Menunggu' CHECK (status IN ('Berhasil', 'Menunggu', 'Ditolak')),
  notes TEXT,
  proof_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tabel Akun Pengurus & Super Admin (admins)
CREATE TABLE IF NOT EXISTS public.admins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('superadmin', 'admin', 'finance', 'staff')),
  role_label TEXT NOT NULL,
  phone TEXT,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Non-aktif')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk performa pencarian
CREATE INDEX IF NOT EXISTS idx_members_phone ON public.members (phone);
CREATE INDEX IF NOT EXISTS idx_members_agent_id ON public.members (agent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_member_id ON public.transactions (member_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions (status);
CREATE INDEX IF NOT EXISTS idx_admins_username ON public.admins (username);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Mengizinkan aplikasi web (publishable key) membaca & menyinkronkan data
-- ============================================================================
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow app full access packages" ON public.packages;
CREATE POLICY "Allow app full access packages" ON public.packages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow app full access agents" ON public.agents;
CREATE POLICY "Allow app full access agents" ON public.agents FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow app full access members" ON public.members;
CREATE POLICY "Allow app full access members" ON public.members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow app full access transactions" ON public.transactions;
CREATE POLICY "Allow app full access transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow app full access admins" ON public.admins;
CREATE POLICY "Allow app full access admins" ON public.admins FOR ALL USING (true) WITH CHECK (true);

-- Seed Akun Super Admin Awal
INSERT INTO public.admins (id, name, username, email, password, role, role_label, phone, created_at, status)
VALUES (
  'admin-001',
  'Super Admin Pusat',
  'admin',
  'admin@sagitariusparcel.com',
  'admin123',
  'superadmin',
  'Super Admin HQ',
  '0813-2438-3479',
  '2026-01-01',
  'Aktif'
)
ON CONFLICT (id) DO NOTHING;
