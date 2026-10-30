import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual
} from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { getDb } from './db.js';

export type AccountRole = 'member' | 'agent' | 'korwil' | 'admin';

export interface AuthPrincipal {
  id: string;
  role: AccountRole;
  name: string;
  agentId?: string;
}

const COOKIE_NAME = 'sp_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const SCRYPT_N = 32768;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEY_LENGTH = 64;
let initializationPromise: Promise<void> | null = null;
let indexPromise: Promise<void> | null = null;

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPrincipal;
    }
  }
}

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      SCRYPT_KEY_LENGTH,
      { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P, maxmem: 64 * 1024 * 1024 },
      (error, key) => error ? reject(error) : resolve(key as Buffer)
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString('hex')}$${key.toString('hex')}`;
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const [algorithm, nValue, rValue, pValue, saltHex, keyHex] = encoded.split('$');
  if (algorithm !== 'scrypt' || !saltHex || !keyHex) return false;

  const n = Number(nValue);
  const r = Number(rValue);
  const p = Number(pValue);
  if (![n, r, p].every(Number.isInteger) || n < 16384 || n > 65536 || r < 1 || r > 16 || p < 1 || p > 4) {
    return false;
  }

  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(keyHex, 'hex');
  if (salt.length < 16 || expected.length !== SCRYPT_KEY_LENGTH) return false;

  const actual = await new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, salt, expected.length, { N: n, r, p, maxmem: 64 * 1024 * 1024 }, (error, key) =>
      error ? reject(error) : resolve(key as Buffer)
    );
  });
  return timingSafeEqual(actual, expected);
}

export function normalizeIdentifier(value: string): string[] {
  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();
  const digits = trimmed.replace(/\D/g, '');
  return [...new Set([lower, trimmed.toUpperCase(), ...(digits ? [digits] : [])])];
}

export async function ensureAuthIndexes(): Promise<void> {
  if (indexPromise) return indexPromise;
  indexPromise = (async () => {
  const { db, isConnected } = await getDb();
  if (!db || !isConnected) throw new Error('Database tidak tersedia');
  await db.collection('auth_sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection('auth_users').createIndex({ role: 1, identifiers: 1 }, { unique: true });
  })().catch((error) => { indexPromise = null; throw error; });
  return indexPromise;
}

export async function initializeAuth(): Promise<void> {
  if (initializationPromise) return initializationPromise;
  initializationPromise = (async () => {
    const { db, isConnected } = await getDb();
    if (!db || !isConnected) throw new Error('Database tidak tersedia');
    await ensureAuthIndexes();

    const defaultPasswords = new Set(['password123', 'admin123']);
    for (const [role, collectionName, identifierFields] of [
      ['member', 'members', ['username', 'email', 'phone', 'memberCode']],
      ['admin', 'admins', ['username', 'email']]
    ] as const) {
      const collection = db.collection(collectionName);
      const legacyUsers = await collection.find({ password: { $type: 'string' } }).toArray();
      for (const legacy of legacyUsers) {
        const userId = String(legacy.id || legacy._id || '');
        const password = String(legacy.password || '');
        if (!userId || !password) continue;

        const authId = `${role}:${userId}`;
        const existing = await db.collection('auth_users').findOne({ _id: authId });
        let migrated = Boolean(existing);
        if (!existing && !defaultPasswords.has(password.toLowerCase()) && password.length >= 12) {
          const identifiers = identifierFields
            .map((field) => legacy[field])
            .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
          if (identifiers.length) {
            try {
              await createAuthAccount({
                id: userId,
                role,
                name: String(legacy.name || legacy.username || 'Pengguna'),
                identifiers,
                password,
                status: legacy.status === 'Non-aktif' ? 'Non-aktif' : 'Aktif'
              });
              migrated = true;
            } catch (error) {
              if ((error as any)?.code !== 11000) throw error;
            }
          }
        }

        // Never leave legacy plaintext credentials in profile collections.
        await collection.updateOne(
          { _id: legacy._id },
          { $unset: { password: '' }, $set: { passwordResetRequired: !migrated } }
        );
      }
    }

    const adminUsername = process.env.AUTH_BOOTSTRAP_ADMIN_USERNAME?.trim();
    const adminPassword = process.env.AUTH_BOOTSTRAP_ADMIN_PASSWORD;
    if (adminUsername && adminPassword && adminPassword.length >= 12) {
      const id = 'admin-001';
      const email = process.env.AUTH_BOOTSTRAP_ADMIN_EMAIL?.trim() || `${adminUsername}@sagitariusparcel.local`;
      try {
        await createAuthAccount({ id, role: 'admin', name: 'Super Admin Pusat', identifiers: [adminUsername, email], password: adminPassword });
        await db.collection('admins').updateOne(
          { _id: id },
          { $set: { id, name: 'Super Admin Pusat', username: adminUsername, email, role: 'superadmin', roleLabel: 'Super Admin HQ', status: 'Aktif' }, $setOnInsert: { createdAt: new Date().toISOString().slice(0, 10) } },
          { upsert: true }
        );
      } catch (error) { if ((error as any)?.code !== 11000) throw error; }
    }

    const korwilUsername = process.env.AUTH_KORWIL_USERNAME?.trim();
    const korwilPassword = process.env.AUTH_KORWIL_PASSWORD;
    if (korwilUsername && korwilPassword && korwilPassword.length >= 12) {
      const id = 'bootstrap-korwil';
      const exists = await db.collection('auth_users').findOne({ _id: `korwil:${id}` });
      if (!exists) {
        try { await createAuthAccount({ id, role: 'korwil', name: 'Koordinator Wilayah', identifiers: [korwilUsername], password: korwilPassword }); }
        catch (error) { if ((error as any)?.code !== 11000) throw error; }
      }
    }
  })().catch((error) => {
    initializationPromise = null;
    throw error;
  });
  return initializationPromise;
}

export async function createAuthAccount(input: {
  id: string;
  role: AccountRole;
  name: string;
  identifiers: string[];
  password: string;
  status?: string;
  agentId?: string;
}): Promise<void> {
  const { db, isConnected } = await getDb();
  if (!db || !isConnected) throw new Error('Database tidak tersedia');
  await ensureAuthIndexes();

  const identifiers = [...new Set(input.identifiers.flatMap(normalizeIdentifier))];
  if (!identifiers.length || input.password.length < 12 || input.password.length > 256) throw new Error('Kredensial akun tidak valid');

  const passwordHash = await hashPassword(input.password);
  await db.collection('auth_users').updateOne(
    { _id: `${input.role}:${input.id}` },
    {
      $set: {
        role: input.role,
        userId: input.id,
        name: input.name,
        identifiers,
        passwordHash,
        status: input.status || 'Aktif',
        ...(input.agentId ? { agentId: input.agentId } : {}),
        updatedAt: new Date()
      },
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true }
  );
}

export async function verifyCredentials(
  role: AccountRole,
  identifier: string,
  password: string
): Promise<AuthPrincipal | null> {
  const { db, isConnected } = await getDb();
  if (!db || !isConnected) throw new Error('Database tidak tersedia');

  const normalized = normalizeIdentifier(identifier);
  const account = await db.collection('auth_users').findOne({
    role,
    identifiers: { $in: normalized },
    status: 'Aktif'
  });
  if (!account || typeof account.passwordHash !== 'string') return null;
  if (!(await verifyPassword(password, account.passwordHash))) return null;

  return {
    id: String(account.userId),
    role,
    name: String(account.name || 'Pengguna'),
    ...(account.agentId ? { agentId: String(account.agentId) } : {})
  };
}

export async function createSession(principal: AuthPrincipal): Promise<string> {
  const { db, isConnected } = await getDb();
  if (!db || !isConnected) throw new Error('Database tidak tersedia');
  await ensureAuthIndexes();

  const token = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const createdAt = new Date();
  await db.collection('auth_sessions').insertOne({
    tokenHash,
    principal,
    createdAt,
    expiresAt: new Date(createdAt.getTime() + SESSION_TTL_MS)
  });
  return token;
}

function readCookie(req: Request, name: string): string | null {
  const cookieHeader = req.headers.cookie || '';
  for (const part of cookieHeader.split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return null;
}

export async function loadPrincipal(req: Request): Promise<AuthPrincipal | null> {
  const token = readCookie(req, COOKIE_NAME);
  if (!token) return null;
  const { db, isConnected } = await getDb();
  if (!db || !isConnected) return null;

  const tokenHash = createHash('sha256').update(token).digest('hex');
  const session = await db.collection('auth_sessions').findOne({
    tokenHash,
    expiresAt: { $gt: new Date() }
  });
  return session?.principal || null;
}

export async function destroySession(req: Request): Promise<void> {
  const token = readCookie(req, COOKIE_NAME);
  if (!token) return;
  const { db, isConnected } = await getDb();
  if (!db || !isConnected) return;
  const tokenHash = createHash('sha256').update(token).digest('hex');
  await db.collection('auth_sessions').deleteOne({ tokenHash });
}

export function setSessionCookie(res: Response, token: string): void {
  const maxAgeSeconds = Math.floor(SESSION_TTL_MS / 1000);
  const secure = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAgeSeconds}${secure ? '; Secure' : ''}`);
}

export function clearSessionCookie(res: Response): void {
  const secure = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure ? '; Secure' : ''}`);
}

export async function attachPrincipal(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    req.auth = await loadPrincipal(req) || undefined;
    next();
  } catch {
    next();
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.auth) {
    res.status(401).json({ error: 'Silakan masuk untuk melanjutkan.' });
    return;
  }
  next();
}

export function requireRoles(...roles: AccountRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({ error: 'Silakan masuk untuk melanjutkan.' });
      return;
    }
    if (!roles.includes(req.auth.role)) {
      res.status(403).json({ error: 'Anda tidak memiliki akses untuk tindakan ini.' });
      return;
    }
    next();
  };
}

export function requireSameOrigin(req: Request, res: Response, next: NextFunction): void {
  const origin = req.get('origin');
  if (!origin) {
    res.status(403).json({ error: 'Permintaan lintas situs ditolak.' });
    return;
  }
  try {
    if (new URL(origin).host !== req.get('host')) {
      res.status(403).json({ error: 'Permintaan lintas situs ditolak.' });
      return;
    }
  } catch {
    res.status(403).json({ error: 'Origin tidak valid.' });
    return;
  }
  next();
}
