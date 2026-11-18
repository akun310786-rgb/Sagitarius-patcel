import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual
} from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { supabaseAdmin, isSupabaseConfigured } from './supabaseAdmin.js';
import { saveAdmin } from './db.js';

export type AccountRole = 'member' | 'agent' | 'korwil' | 'admin';

export interface AuthPrincipal {
  id: string;
  role: AccountRole;
  name: string;
  agentId?: string;
  korwilRegency?: string;
  adminRole?: 'superadmin' | 'admin' | 'finance' | 'staff';
}

const COOKIE_NAME = 'sp_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const SCRYPT_N = 32768;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEY_LENGTH = 64;
let initializationPromise: Promise<void> | null = null;

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
  // Supabase handles indexes via schema; no runtime index creation needed
  console.log('[Supabase Auth] Indexes managed by Supabase schema');
}

export async function initializeAuth(): Promise<void> {
  if (initializationPromise) return initializationPromise;
  initializationPromise = (async () => {
    if (!isSupabaseConfigured()) {
      console.warn('[Supabase Auth] Supabase not configured, auth will use fallback');
      return;
    }
    await ensureAuthIndexes();

    try {
      const { error } = await supabaseAdmin.from('auth_users').select('id', { head: true });
      if (error) {
        console.warn('[Supabase Auth] auth_users table not ready:', error.message);
      }
      console.log('[Supabase Auth] Initialized');
    } catch (e) {
      console.warn('[Supabase Auth] Init warning:', e);
    }

    // Bootstrap admin account from env
    const adminUsername = process.env.AUTH_BOOTSTRAP_ADMIN_USERNAME?.trim();
    const adminPassword = process.env.AUTH_BOOTSTRAP_ADMIN_PASSWORD;
    if (adminUsername && adminPassword && adminPassword.length >= 12) {
      const id = 'admin-001';
      const email = process.env.AUTH_BOOTSTRAP_ADMIN_EMAIL?.trim() || `${adminUsername}@sagitariusparcel.local`;
      try {
        await createAuthAccount({ id, role: 'admin', adminRole: 'superadmin', name: 'Super Admin Pusat', identifiers: [adminUsername, email], password: adminPassword });
        await saveAdmin({ id, name: 'Super Admin Pusat', username: adminUsername, email, role: 'superadmin', roleLabel: 'Super Admin HQ', phone: '', createdAt: new Date().toISOString().slice(0, 10), status: 'Aktif' });
      } catch (error) { /* ignore duplicate */ }
    }

    const korwilUsername = process.env.AUTH_KORWIL_USERNAME?.trim();
    const korwilPassword = process.env.AUTH_KORWIL_PASSWORD;
    if (korwilUsername && korwilPassword && korwilPassword.length >= 12) {
      const id = 'bootstrap-korwil';
      try {
        await createAuthAccount({ id, role: 'korwil', name: 'Koordinator Wilayah', identifiers: [korwilUsername], password: korwilPassword, korwilRegency: process.env.AUTH_KORWIL_REGENCY || 'Kab. Ciamis' });
      } catch (error) { /* ignore duplicate */ }
    }
  })().catch((error) => { initializationPromise = null; throw error; });
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
  korwilRegency?: string;
  adminRole?: 'superadmin' | 'admin' | 'finance' | 'staff';
}): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error('Supabase tidak dikonfigurasi');
  await ensureAuthIndexes();

  const identifiers = [...new Set(input.identifiers.flatMap(normalizeIdentifier))];
  if (!identifiers.length || input.password.length < 12 || input.password.length > 256) throw new Error('Kredensial akun tidak valid');

  const passwordHash = await hashPassword(input.password);
  const principal: AuthPrincipal = {
    id: input.id,
    role: input.role,
    name: input.name,
    ...(input.agentId ? { agentId: input.agentId } : {}),
    ...(input.korwilRegency ? { korwilRegency: input.korwilRegency } : {}),
    ...(input.adminRole ? { adminRole: input.adminRole } : {}),
  };

  const doc = {
    id: `${input.role}:${input.id}`,
    role: input.role,
    userId: input.id,
    name: input.name,
    identifiers,
    password: passwordHash,
    status: input.status || 'Aktif',
    principal,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin.from('auth_users').upsert(doc, { onConflict: 'id' });
  if (error) throw error;
}

export async function verifyCredentials(
  role: AccountRole,
  identifier: string,
  password: string
): Promise<AuthPrincipal | null> {
  if (!isSupabaseConfigured()) return null;

  const normalized = normalizeIdentifier(identifier);
  const { data, error } = await supabaseAdmin.from('auth_users').select('*').eq('role', role).eq('status', 'Aktif');
  if (error || !data) return null;
  const account = data.find((u: any) => normalized.some((v) => u.identifiers?.includes(v)));
  if (!account || typeof account.passwordHash !== 'string') return null;
  if (!(await verifyPassword(password, account.passwordHash))) return null;

  return {
    id: String(account.userId),
    role,
    name: String(account.name || 'Pengguna'),
    ...(role === 'korwil' && account.korwilRegency ? { korwilRegency: String(account.korwilRegency) } : {}),
    ...(role === 'admin' ? { adminRole: account.adminRole || 'staff' } : {}),
    ...(account.agentId ? { agentId: String(account.agentId) } : {})
  };
}

export async function createSession(principal: AuthPrincipal): Promise<string> {
  if (!isSupabaseConfigured()) throw new Error('Supabase tidak dikonfigurasi');
  await ensureAuthIndexes();

  const token = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const createdAt = new Date();
  const { error } = await supabaseAdmin.from('auth_sessions').insert({
    token_hash: tokenHash,
    principal,
    created_at: createdAt.toISOString(),
    expires_at: new Date(createdAt.getTime() + SESSION_TTL_MS).toISOString(),
  });
  if (error) throw error;
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
  if (!isSupabaseConfigured()) return null;

  const tokenHash = createHash('sha256').update(token).digest('hex');
  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from('auth_sessions')
    .select('*')
    .eq('token_hash', tokenHash)
    .gt('expires_at', now)
    .maybeSingle();

  if (error || !data) return null;
  return data.principal as AuthPrincipal;
}

export async function destroySession(req: Request): Promise<void> {
  const token = readCookie(req, COOKIE_NAME);
  if (!token) return;
  if (!isSupabaseConfigured()) return;

  const tokenHash = createHash('sha256').update(token).digest('hex');
  await supabaseAdmin.from('auth_sessions').delete().eq('token_hash', tokenHash);
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
