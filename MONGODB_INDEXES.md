# Rekomendasi Index MongoDB — Sagitarius Parcel

Index berikut direkomendasikan untuk mempercepat query dan menjaga integritas data di produksi.

## Koleksi: `auth_users` (Autentikasi)

```js
// Index unik untuk login berdasarkan role + identifier
db.auth_users.createIndex(
  { role: 1, identifiers: 1 },
  { unique: true, name: 'uniq_role_identifiers' }
);
```

## Koleksi: `auth_sessions` (Sesi Login)

```js
// TTL index: hapus otomatis sesi yang kadaluarsa (12 jam)
db.auth_sessions.createIndex(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: 'ttl_expiresAt' }
);

// Index untuk pencarian sesi berdasarkan user
db.auth_sessions.createIndex(
  { 'principal.role': 1, 'principal.id': 1 },
  { name: 'idx_principal_role_id' }
);
```

## Koleksi: `members` (Data Member)

```js
// Cepat cari member per agen (digunakan Agent Dashboard)
db.members.createIndex(
  { agentId: 1, status: 1 },
  { name: 'idx_agentId_status' }
);

// Cepat cari member per wilayah (digunakan Korwil/Admin)
db.members.createIndex(
  { regency: 1 },
  { name: 'idx_regency' }
);

// Cepat cari member berdasarkan kode member
db.members.createIndex(
  { memberCode: 1 },
  { unique: true, name: 'uniq_memberCode' }
);

// Cepat cari member berdasarkan paket
db.members.createIndex(
  { packageId: 1 },
  { name: 'idx_packageId' }
);
```

## Koleksi: `transactions` (Riwayat Setoran)

```js
// Cepat cari transaksi per agen (Agent & Korwil Dashboard)
db.transactions.createIndex(
  { agentId: 1, status: 1, date: -1 },
  { name: 'idx_agentId_status_date' }
);

// Cepat cari transaksi per member (Member Dashboard)
db.transactions.createIndex(
  { memberId: 1, date: -1 },
  { name: 'idx_memberId_date' }
);

// Cepat cari transaksi menunggu verifikasi (Admin/Finance)
db.transactions.createIndex(
  { status: 1, date: -1 },
  { name: 'idx_status_date' }
);

// Cepat cari berdasarkan invoice number
db.transactions.createIndex(
  { invoiceNo: 1 },
  { unique: true, name: 'uniq_invoiceNo' }
);
```

## Koleksi: `packages` (Katalog Paket)

```js
// Cepat filter paket per kategori (Website Publik)
db.packages.createIndex(
  { category: 1 },
  { name: 'idx_category' }
);
```

## Koleksi: `agents` (Data Agen)

```js
// Cepat cari agen per wilayah (Korwil/Admin)
db.agents.createIndex(
  { regency: 1, status: 1 },
  { name: 'idx_regency_status' }
);

// Cepat cari agen berdasarkan kode
db.agents.createIndex(
  { code: 1 },
  { unique: true, name: 'uniq_code' }
);
```

## Koleksi: `admins` (Akun Admin Pusat)

```js
// Cepat cari admin berdasarkan username/email
db.admins.createIndex(
  { username: 1 },
  { unique: true, name: 'uniq_username' }
);

db.admins.createIndex(
  { email: 1 },
  { unique: true, name: 'uniq_email' }
);
```

---

## Cara Apply Index

Jalankan perintah berikut di **MongoDB Atlas** (Data Explorer > Collections > pilih koleksi > tab Indexes) atau via **mongosh**:

```bash
# Contoh via mongosh
mongosh "mongodb+srv://<user>:<pass>@cluster.xxx.mongodb.net/sagitarius_parcel" --eval '
db.auth_users.createIndex({ role: 1, identifiers: 1 }, { unique: true, name: "uniq_role_identifiers" });
db.auth_sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: "ttl_expiresAt" });
db.members.createIndex({ agentId: 1, status: 1 }, { name: "idx_agentId_status" });
db.members.createIndex({ memberCode: 1 }, { unique: true, name: "uniq_memberCode" });
db.transactions.createIndex({ agentId: 1, status: 1, date: -1 }, { name: "idx_agentId_status_date" });
db.transactions.createIndex({ memberId: 1, date: -1 }, { name: "idx_memberId_date" });
db.transactions.createIndex({ status: 1, date: -1 }, { name: "idx_status_date" });
db.transactions.createIndex({ invoiceNo: 1 }, { unique: true, name: "uniq_invoiceNo" });
db.packages.createIndex({ category: 1 }, { name: "idx_category" });
db.agents.createIndex({ regency: 1, status: 1 }, { name: "idx_regency_status" });
db.agents.createIndex({ code: 1 }, { unique: true, name: "uniq_code" });
db.admins.createIndex({ username: 1 }, { unique: true, name: "uniq_username" });
db.admins.createIndex({ email: 1 }, { unique: true, name: "uniq_email" });
'
```

> ⚠️ Pastikan untuk backup database sebelum membuat index di produksi, terutama jika koleksi sudah berisi banyak data.