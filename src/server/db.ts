import { MongoClient, Db } from 'mongodb';
import { PACKAGES, AGENTS, INITIAL_MEMBERS, INITIAL_TRANSACTIONS, INITIAL_ADMINS } from '../data/mockData.js';

let client: MongoClient | null = null;
let db: Db | null = null;
let isConnected = false;
let lastError: string | null = null;

// In-memory fallback cache so application continues to work seamlessly
let memPackages = [...PACKAGES];
let memAgents = [...AGENTS];
let memMembers = [...INITIAL_MEMBERS];
let memTransactions = [...INITIAL_TRANSACTIONS];
let memAdmins = [...INITIAL_ADMINS];

const allowMemoryFallback = () => process.env.NODE_ENV !== 'production' && !process.env.VERCEL;

export async function getDb(): Promise<{ db: Db | null; isConnected: boolean; error: string | null }> {
  if (db && isConnected) {
    return { db, isConnected: true, error: null };
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    lastError = 'MONGODB_URI is not set in environment';
    return { db: null, isConnected: false, error: lastError };
  }

  try {
    if (!client) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
    }
    await client.connect();
    db = client.db('sagitarius_parcel');
    isConnected = true;
    lastError = null;
    console.log('[MongoDB Atlas] Successfully connected to database: sagitarius_parcel');

    // Auto seed if collections are empty
    await autoSeed(db);

    return { db, isConnected: true, error: null };
  } catch (err: any) {
    if (client) {
      try {
        await client.close();
      } catch {}
      client = null;
    }
    isConnected = false;
    lastError = err?.message || String(err);
    return { db: null, isConnected: false, error: lastError };
  }
}

async function autoSeed(database: Db) {
  // Mock records are useful during local development, but never create demo financial data in production.
  if (!allowMemoryFallback()) return;
  try {
    const pkgCount = await database.collection('packages').countDocuments();
    if (pkgCount === 0) {
      console.log('[MongoDB Atlas] Seeding initial packages...');
      await database.collection('packages').insertMany(PACKAGES.map((p: any) => ({ ...p, _id: p.id })));
    }

    const agentCount = await database.collection('agents').countDocuments();
    if (agentCount === 0) {
      console.log('[MongoDB Atlas] Seeding initial agents...');
      await database.collection('agents').insertMany(AGENTS.map((a: any) => ({ ...a, _id: a.id })));
    }

    const memberCount = await database.collection('members').countDocuments();
    if (memberCount === 0) {
      console.log('[MongoDB Atlas] Seeding initial members...');
      await database.collection('members').insertMany(INITIAL_MEMBERS.map((m: any) => ({ ...m, _id: m.id })));
    }

    const txCount = await database.collection('transactions').countDocuments();
    if (txCount === 0) {
      console.log('[MongoDB Atlas] Seeding initial transactions...');
      await database.collection('transactions').insertMany(INITIAL_TRANSACTIONS.map((t: any) => ({ ...t, _id: t.id })));
    }

    const adminCount = await database.collection('admins').countDocuments();
    if (adminCount === 0) {
      console.log('[MongoDB Atlas] Seeding initial admins...');
      await database.collection('admins').insertMany(INITIAL_ADMINS.map((a: any) => ({ ...a, _id: a.id })));
    }
  } catch (e) {
    console.debug('[MongoDB Atlas] Auto-seed note:', e);
  }
}

// Data access operations with automatic MongoDB or In-Memory fallback

export async function getAllPackages() {
  const { db: database, isConnected: online } = await getDb();
  if (online && database) {
    try {
      const docs = await database.collection('packages').find({}).toArray();
      return docs.map(({ _id, ...rest }) => ({ id: _id ? String(_id) : (rest as any).id, ...rest }));
    } catch (e) {
      console.debug('[MongoDB Atlas] Error getting packages:', e);
      return allowMemoryFallback() ? memPackages : [];
    }
  }
  return allowMemoryFallback() ? memPackages : [];
}

export async function savePackage(pkg: any) {
  const { db: database, isConnected: online } = await getDb();
  if ((!online || !database) && !allowMemoryFallback()) throw new Error('Database tidak tersedia');
  const id = pkg.id || `pkg-${Date.now()}`;
  const pkgWithId = { ...pkg, id };

  // Always update in-memory
  const existingIdx = memPackages.findIndex((p) => p.id === id);
  if (existingIdx >= 0) {
    memPackages[existingIdx] = pkgWithId;
  } else {
    memPackages.push(pkgWithId);
  }

  if (online && database) {
    try {
      await database.collection('packages').updateOne(
        { _id: id as any },
        { $set: { ...pkgWithId, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    } catch (e) {
      console.debug('[MongoDB Atlas] Error saving package:', e);
      throw e;
    }
  }
  return pkgWithId;
}

export async function getAllMembers() {
  const { db: database, isConnected: online } = await getDb();
  if (online && database) {
    try {
      const docs = await database.collection('members').find({}).toArray();
      return docs.map(({ _id, ...rest }) => ({ id: _id ? String(_id) : (rest as any).id, ...rest }));
    } catch (e) {
      console.debug('[MongoDB Atlas] Error getting members:', e);
      return allowMemoryFallback() ? memMembers : [];
    }
  }
  return allowMemoryFallback() ? memMembers : [];
}

export async function saveMember(member: any) {
  const { db: database, isConnected: online } = await getDb();
  if ((!online || !database) && !allowMemoryFallback()) throw new Error('Database tidak tersedia');
  const id = member.id || `MBR-${Math.floor(100000 + Math.random() * 900000)}`;
  const memberWithId = { ...member, id };

  const existingIdx = memMembers.findIndex((m) => m.id === id);
  if (existingIdx >= 0) {
    memMembers[existingIdx] = memberWithId;
  } else {
    memMembers.unshift(memberWithId);
  }

  if (online && database) {
    try {
      await database.collection('members').updateOne(
        { _id: id as any },
        { $set: { ...memberWithId, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    } catch (e) {
      console.debug('[MongoDB Atlas] Error saving member:', e);
      throw e;
    }
  }
  return memberWithId;
}

export async function getAllAgents() {
  const { db: database, isConnected: online } = await getDb();
  if (online && database) {
    try {
      const docs = await database.collection('agents').find({}).toArray();
      return docs.map(({ _id, ...rest }) => ({ id: _id ? String(_id) : (rest as any).id, ...rest }));
    } catch (e) {
      console.debug('[MongoDB Atlas] Error getting agents:', e);
      return allowMemoryFallback() ? memAgents : [];
    }
  }
  return allowMemoryFallback() ? memAgents : [];
}

export async function saveAgent(agent: any) {
  const { db: database, isConnected: online } = await getDb();
  if ((!online || !database) && !allowMemoryFallback()) throw new Error('Database tidak tersedia');
  const id = agent.id || `AGN-${Math.floor(1000 + Math.random() * 9000)}`;
  const agentWithId = { ...agent, id };

  const existingIdx = memAgents.findIndex((a) => a.id === id);
  if (existingIdx >= 0) {
    memAgents[existingIdx] = agentWithId;
  } else {
    memAgents.unshift(agentWithId);
  }

  if (online && database) {
    try {
      await database.collection('agents').updateOne(
        { _id: id as any },
        { $set: { ...agentWithId, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    } catch (e) {
      console.debug('[MongoDB Atlas] Error saving agent:', e);
      throw e;
    }
  }
  return agentWithId;
}

export async function getAllTransactions() {
  const { db: database, isConnected: online } = await getDb();
  if (online && database) {
    try {
      const docs = await database.collection('transactions').find({}).sort({ createdAt: -1 }).toArray();
      return docs.map(({ _id, ...rest }) => ({ id: _id ? String(_id) : (rest as any).id, ...rest }));
    } catch (e) {
      console.debug('[MongoDB Atlas] Error getting transactions:', e);
      return allowMemoryFallback() ? memTransactions : [];
    }
  }
  return allowMemoryFallback() ? memTransactions : [];
}

export async function saveTransaction(tx: any) {
  const { db: database, isConnected: online } = await getDb();
  if ((!online || !database) && !allowMemoryFallback()) throw new Error('Database tidak tersedia');
  const id = tx.id || `TRX-${Date.now()}`;
  const txWithId = { ...tx, id };

  const existingIdx = memTransactions.findIndex((t) => t.id === id);
  if (existingIdx >= 0) {
    memTransactions[existingIdx] = txWithId;
  } else {
    memTransactions.unshift(txWithId);
  }

  if (online && database) {
    try {
      await database.collection('transactions').updateOne(
        { _id: id as any },
        { $set: { ...txWithId, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    } catch (e) {
      console.debug('[MongoDB Atlas] Error saving transaction:', e);
      throw e;
    }
  }
  return txWithId;
}

export async function approveTransaction(id: string, notes?: string) {
  const { db: database, isConnected: online } = await getDb();
  if (!online || !database || !client) throw new Error('Database tidak tersedia');
  const session = client.startSession();
  let approved: any = null;
  try {
    await session.withTransaction(async () => {
      const current = await database.collection('transactions').findOne({ _id: id }, { session });
      if (!current || current.status !== 'Menunggu') throw new Error('Transaksi sudah diproses atau tidak ditemukan');
      const memberId = String(current.memberId || '');
      const member = await database.collection('members').findOne({ _id: memberId }, { session });
      if (!member) throw new Error('Member transaksi tidak ditemukan');
      const totalSaved = Number(member.totalSaved || 0) + Number(current.amount || 0);
      if (!Number.isFinite(totalSaved) || totalSaved > Number(member.packagePrice || 0)) throw new Error('Setoran melebihi target paket member');
      const updated = { ...current, id: String(current.id || current._id), status: 'Berhasil', ...(notes ? { notes } : {}) };
      delete (updated as any)._id;
      const transactionResult = await database.collection('transactions').updateOne(
        { _id: id, status: 'Menunggu' },
        { $set: { ...updated, updatedAt: new Date().toISOString() } },
        { session }
      );
      if (transactionResult.modifiedCount !== 1) throw new Error('Transaksi sudah diproses');
      await database.collection('members').updateOne(
        { _id: memberId },
        { $set: { totalSaved, lastDepositAmount: Number(current.amount || 0), lastDepositDate: String(current.date || ''), status: totalSaved >= Number(member.packagePrice || 0) ? 'Lunas' : 'Aktif', updatedAt: new Date().toISOString() } },
        { session }
      );
      approved = updated;
    });
    if (!approved) throw new Error('Transaksi tidak dapat disetujui');
    const { _id: _id, ...result } = approved;
    return result;
  } finally {
    await session.endSession();
  }
}

export async function getAllAdmins() {
  const { db: database, isConnected: online } = await getDb();
  if (online && database) {
    try {
      const docs = await database.collection('admins').find({}).toArray();
      return docs.map(({ _id, ...rest }) => ({ id: _id ? String(_id) : (rest as any).id, ...rest }));
    } catch (e) {
      console.debug('[MongoDB Atlas] Error getting admins:', e);
      return allowMemoryFallback() ? memAdmins : [];
    }
  }
  return allowMemoryFallback() ? memAdmins : [];
}

export async function saveAdmin(admin: any) {
  const { db: database, isConnected: online } = await getDb();
  if ((!online || !database) && !allowMemoryFallback()) throw new Error('Database tidak tersedia');
  const id = admin.id || `admin-${Date.now()}`;
  const adminWithId = { ...admin, id };

  const existingIdx = memAdmins.findIndex((a) => a.id === id || a.username === admin.username);
  if (existingIdx >= 0) {
    memAdmins[existingIdx] = adminWithId;
  } else {
    memAdmins.push(adminWithId);
  }

  if (online && database) {
    try {
      await database.collection('admins').updateOne(
        { _id: id as any },
        { $set: { ...adminWithId, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    } catch (e) {
      console.debug('[MongoDB Atlas] Error saving admin:', e);
      throw e;
    }
  }
  return adminWithId;
}

export async function getDbStatus() {
  const { db: database, isConnected: online, error } = await getDb();
  let collections: { name: string; count: number }[] = [];

  if (online && database) {
    try {
      const list = await database.listCollections().toArray();
      for (const col of list) {
        const count = await database.collection(col.name).countDocuments();
        collections.push({ name: col.name, count });
      }
    } catch (e) {
      console.debug('[MongoDB Atlas] Error listing collections:', e);
    }
  } else {
    collections = [
      { name: 'packages', count: memPackages.length },
      { name: 'agents', count: memAgents.length },
      { name: 'members', count: memMembers.length },
      { name: 'transactions', count: memTransactions.length },
    ];
  }

  const uri = process.env.MONGODB_URI || '';
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');

  return {
    connected: online,
    database: 'sagitarius_parcel',
    maskedUri,
    collections,
    error,
    needsIpWhitelist: error ? error.includes('SSL alert number 80') || error.includes('tlsv1 alert internal error') || error.includes('ENOTFOUND') : false
  };
}

export async function forceSeed() {
  const { db: database, isConnected: online } = await getDb();
  if (online && database) {
    await database.collection('packages').deleteMany({});
    await database.collection('agents').deleteMany({});
    await database.collection('members').deleteMany({});
    await database.collection('transactions').deleteMany({});
    await autoSeed(database);
    return { success: true, message: 'Berhasil melakukan seed ulang ke MongoDB Atlas!' };
  }
  return { success: false, message: 'Database MongoDB Atlas belum online / IP belum di-whitelist.' };
}
