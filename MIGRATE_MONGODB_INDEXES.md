# Skrip Migrasi Index MongoDB — Sagitarius Parcel

Jalankan skrip ini di MongoDB Atlas (Data Explorer atau mongosh) untuk meningkatkan performa query.

## Skrip Index

```javascript
// ============================================
// KOLLEKSI: auth_users (Autentikasi)
// ============================================
db.auth_users.createIndex(
  { role: 1, identifiers: 1 },
  { unique: true, name: 'uniq_role_identifiers' }
);

// ============================================
// KOLLEKSI: auth_sessions (Sesi Login)
// ============================================
// TTL index: hapus otomatis sesi kadaluarsa (12 jam = 43200 detik)
db.auth_sessions.createIndex(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: 'ttl_expiresAt' }
);

db.auth_sessions.createIndex(
  { 'principal.role': 1, 'principal.id': 1 },
  { name: 'idx_principal_role_id' }
);

// ============================================
// KOLLEKSI: members (Data Member)
// ============================================
db.members.createIndex(
  { agentId: 1, status: 1 },
  { name: 'idx_agentId_status' }
);

db.members.createIndex(
  { regency: 1 },
  { name: 'idx_regency' }
);

db.members.createIndex(
  { memberCode: 1 },
  { unique: true, name: 'uniq_memberCode' }
);

db.members.createIndex(
  { packageId: 1 },
  { name: 'idx_packageId' }
);

// ============================================
// KOLLEKSI: transactions (Riwayat Setoran)
// ============================================
db.transactions.createIndex(
  { agentId: 1, status: 1, date: -1 },
  { name: 'idx_agentId_status_date' }
);

db.transactions.createIndex(
  { memberId: 1, date: -1 },
  { name: 'idx_memberId_date' }
);

db.transactions.createIndex(
  { status: 1, date: -1 },
  { name: 'idx_status_date' }
);

db.transactions.createIndex(
  { invoiceNo: 1 },
  { unique: true, name: 'uniq_invoiceNo' }
);

// ============================================
// KOLLEKSI: packages (Katalog Paket)
// ============================================
db.packages.createIndex(
  { category: 1 },
  { name: 'idx_category' }
);

// ============================================
// KOLLEKSI: agents (Data Agen)
// ============================================
db.agents.createIndex(
  { regency: 1, status: 1 },
  { name: 'idx_regency_status' }
);

db.agents.createIndex(
  { code: 1 },
  { unique: true, name: 'uniq_code' }
);

// ============================================
// KOLLEKSI: admins (Akun Admin Pusat)
// ============================================
db.admins.createIndex(
  { username: 1 },
  { unique: true, name: 'uniq_username' }
);

db.admins.createIndex(
  { email: 1 },
  { unique: true, name: 'uniq_email' }
);

// ============================================
// Verifikasi Index yang Dibuat
// ============================================
print('=== Index auth_users ===');
printjson(db.auth_users.getIndexes());

print('=== Index auth_sessions ===');
printjson(db.auth_sessions.getIndexes());

print('=== Index members ===');
printjson(db.members.getIndexes());

print('=== Index transactions ===');
printjson(db.transactions.getIndexes());

print('=== Index packages ===');
printjson(db.packages.getIndexes());

print('=== Index agents ===');
printjson(db.agents.getIndexes());

print('=== Index admins ===');
printjson(db.admins.getIndexes());

print('Selesai membuat semua index!');
```

## Cara Menjalankan

### Opsi A: Via MongoDB Atlas Data Explorer (Web)
1. Buka [MongoDB Atlas](https://cloud.mongodb.com/)
2. Pilih Cluster Sagitarius Parcel
3. Klik **Data Explorer**
4. Pilih koleksi, lalu tab **Indexes**
5. Klik **Create Index** dan masukkan field sesuai skrip di atas

### Opsi B: Via mongosh (CLI)
```bash
mongosh "mongodb+srv://<user>:<pass>@cluster.xxx.mongodb.net/sagitarius_parcel" --file migrate_indexes.js
```

### Opsi C: Via Node.js Script
Buat file `migrate_indexes.js` lalu jalankan dengan `node migrate_indexes.js`.

> ⚠️ Pastikan backup database sebelum menjalankan index di produksi.