import express, { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import {
  getDbStatus,
  getAllPackages,
  savePackage,
  getAllMembers,
  saveMember,
  getAllAgents,
  saveAgent,
  getAllTransactions,
  saveTransaction,
  getAllAdmins,
  forceSeed,
  getDb
} from './db.js';
import {
  AccountRole,
  attachPrincipal,
  clearSessionCookie,
  createAuthAccount,
  createSession,
  destroySession,
  initializeAuth,
  requireAuth,
  requireRoles,
  requireSameOrigin,
  setSessionCookie,
  verifyCredentials
} from './auth.js';

const app = express();
app.set('trust proxy', 1);
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
app.use(express.json({ limit: '1mb' }));
app.use('/api', (_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
app.use(attachPrincipal);
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    requireSameOrigin(req, res, next);
    return;
  }
  next();
});

const adminOnly = requireRoles('admin');
const signedIn = requireAuth;

const stripSecrets = (record: any): any => {
  const { password: _password, passwordHash: _passwordHash, passwordResetRequired: _passwordResetRequired, ...safeRecord } = record;
  return safeRecord;
};

function canReadMember(principal: NonNullable<Request['auth']>, member: any): boolean {
  if (principal.role === 'admin' || principal.role === 'korwil') return true;
  if (principal.role === 'member') return String(member.id) === principal.id;
  return principal.role === 'agent' && String(member.agentId) === principal.id;
}

function canReadTransaction(principal: NonNullable<Request['auth']>, transaction: any): boolean {
  if (principal.role === 'admin' || principal.role === 'korwil') return true;
  if (principal.role === 'member') return String(transaction.memberId) === principal.id;
  return principal.role === 'agent' && String(transaction.agentId) === principal.id;
}

async function requireOnlineDatabase(res: Response): Promise<boolean> {
  const { db, isConnected } = await getDb();
  if (!db || !isConnected) {
    res.status(503).json({ error: 'Layanan akun sementara tidak tersedia.' });
    return false;
  }
  return true;
}

// Session endpoints
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const key = String(req.ip || req.socket.remoteAddress || 'unknown');
    const now = Date.now();
    for (const [ip, value] of loginAttempts) if (value.resetAt <= now) loginAttempts.delete(ip);
    const attempt = loginAttempts.get(key);
    if (attempt && attempt.resetAt > now && attempt.count >= 8) {
      res.status(429).json({ error: 'Terlalu banyak percobaan login. Coba lagi dalam beberapa menit.' });
      return;
    }
    if (!(await requireOnlineDatabase(res))) return;
    await initializeAuth();
    const role = req.body?.role as AccountRole;
    const identifier = typeof req.body?.identifier === 'string' ? req.body.identifier : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!['member', 'agent', 'korwil', 'admin'].includes(role) || !identifier || !password || password.length > 256) {
      res.status(400).json({ error: 'Masukkan jenis akun, username, dan kata sandi.' });
      return;
    }

    const user = await verifyCredentials(role, identifier, password);
    if (!user) {
      const current = loginAttempts.get(key);
      loginAttempts.set(key, { count: current && current.resetAt > now ? current.count + 1 : 1, resetAt: current && current.resetAt > now ? current.resetAt : now + 15 * 60 * 1000 });
      res.status(401).json({ error: 'Username atau kata sandi tidak cocok.' });
      return;
    }

    loginAttempts.delete(key);
    const token = await createSession(user);
    setSessionCookie(res, token);
    res.json({ user });
  } catch (error) {
    console.error('[Auth] Login gagal:', error);
    res.status(503).json({ error: 'Layanan login sementara tidak tersedia.' });
  }
});

app.get('/api/auth/me', signedIn, (req: Request, res: Response) => {
  res.json({ user: req.auth });
});

app.post('/api/auth/logout', async (req: Request, res: Response) => {
  try {
    await destroySession(req);
    clearSessionCookie(res);
    res.json({ success: true });
  } catch {
    clearSessionCookie(res);
    res.status(200).json({ success: true });
  }
});

app.post('/api/admin/accounts/:role/:id/password', adminOnly, async (req: Request, res: Response) => {
  try {
    const role = String(req.params.role) as AccountRole;
    const id = String(req.params.id || '');
    const password = req.body?.password;
    const configuration: Record<string, { collection: string; identifiers: string[] }> = {
      member: { collection: 'members', identifiers: ['username', 'email', 'phone', 'memberCode'] },
      agent: { collection: 'agents', identifiers: ['code', 'phone', 'storeName'] },
      admin: { collection: 'admins', identifiers: ['username', 'email'] }
    };
    const config = configuration[role];
    if (!config || !id || typeof password !== 'string' || password.length < 12) {
      res.status(400).json({ error: 'Pilih akun yang valid dan kata sandi minimal 12 karakter.' });
      return;
    }
    const { db } = await getDb();
    if (!db) { res.status(503).json({ error: 'Database tidak tersedia.' }); return; }
    const account = await db.collection(config.collection).findOne({ _id: id });
    if (!account) { res.status(404).json({ error: 'Profil akun tidak ditemukan.' }); return; }
    const identifiers = config.identifiers.map((field) => account[field]).filter((value) => typeof value === 'string' && value.trim());
    await createAuthAccount({ id, role, name: String(account.name || account.ownerName || account.username || 'Pengguna'), identifiers, password, status: account.status === 'Non-aktif' ? 'Non-aktif' : 'Aktif', ...(role === 'agent' ? { agentId: id } : {}) });
    await db.collection(config.collection).updateOne({ _id: id }, { $unset: { password: '' }, $set: { passwordResetRequired: false } });
    await db.collection('auth_sessions').deleteMany({ 'principal.role': role, 'principal.id': id });
    res.json({ success: true });
  } catch (error: any) {
    if (error?.code === 11000) { res.status(409).json({ error: 'Identitas akun dipakai oleh akun lain.' }); return; }
    res.status(500).json({ error: 'Kata sandi akun tidak dapat diperbarui.' });
  }
});

// Public registration. Passwords are stored only in the authentication collection as hashes.
app.post('/api/register/member', async (req: Request, res: Response) => {
  try {
    if (!(await requireOnlineDatabase(res))) return;
    const member = req.body?.member;
    const password = req.body?.password;
    if (!member || typeof password !== 'string' || password.length < 12 || password.length > 256 || !member.name || !member.phone || !member.packageId || !member.agentId) {
      res.status(400).json({ error: 'Lengkapi data member dan buat kata sandi minimal 12 karakter.' });
      return;
    }
    const { db } = await getDb();
    const pkg = await db!.collection('packages').findOne({ _id: String(member.packageId) });
    const agent = await db!.collection('agents').findOne({ _id: String(member.agentId) });
    if (!pkg || !agent || agent.status !== 'Aktif') {
      res.status(400).json({ error: 'Paket atau agen yang dipilih tidak tersedia.' });
      return;
    }
    const safeMember = {
      id: `mem-${randomUUID()}`,
      memberCode: `SP-${randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase()}`,
      name: String(member.name).trim().slice(0, 120),
      phone: String(member.phone).trim().slice(0, 32),
      ...(typeof member.email === 'string' && member.email.trim() ? { email: member.email.trim().toLowerCase().slice(0, 254) } : {}),
      ...(typeof member.username === 'string' && member.username.trim() ? { username: member.username.trim().slice(0, 64) } : {}),
      address: typeof member.address === 'string' ? member.address.trim().slice(0, 250) : '',
      regency: typeof member.regency === 'string' ? member.regency.slice(0, 100) : '',
      agentId: String(agent.id || agent._id), agentName: `${agent.ownerName} (${agent.storeName})`,
      packageId: String(pkg.id || pkg._id), packageName: String(pkg.name), packagePrice: Number(pkg.targetPrice),
      totalSaved: 0, lastDepositAmount: 0, lastDepositDate: '-', status: 'Aktif',
      joinDate: new Date().toLocaleDateString('id-ID'), pickupDate: String(pkg.pickupDate || ''), qrToken: randomUUID()
    };
    await createAuthAccount({
      id: String(safeMember.id),
      role: 'member',
      name: String(safeMember.name),
      identifiers: [safeMember.username, safeMember.email, safeMember.phone, safeMember.memberCode].filter(Boolean),
      password
    });
    try { await db!.collection('members').insertOne({ ...safeMember, _id: safeMember.id }); }
    catch (error) { await db!.collection('auth_users').deleteOne({ _id: `member:${safeMember.id}` }); throw error; }
    const saved = safeMember;
    const user = { id: String(saved.id), role: 'member' as const, name: String(saved.name) };
    setSessionCookie(res, await createSession(user));
    res.status(201).json({ member: stripSecrets(saved), user });
  } catch (error: any) {
    if (error?.code === 11000) {
      res.status(409).json({ error: 'Username, email, atau nomor telepon sudah terdaftar.' });
      return;
    }
    console.error('[Register] Member gagal:', error);
    res.status(503).json({ error: 'Pendaftaran member sementara tidak tersedia.' });
  }
});

app.post('/api/register/agent', async (req: Request, res: Response) => {
  try {
    if (!(await requireOnlineDatabase(res))) return;
    const agent = req.body?.agent;
    const password = req.body?.password;
    if (!agent || typeof password !== 'string' || password.length < 12 || password.length > 256 || !agent.ownerName || !agent.storeName || !agent.phone) {
      res.status(400).json({ error: 'Lengkapi data agen dan buat kata sandi minimal 12 karakter.' });
      return;
    }
    const { db } = await getDb();
    const safeAgent = {
      id: `ag-${randomUUID()}`,
      code: `AG-${randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase()}`,
      name: String(agent.storeName).trim().slice(0, 120),
      storeName: String(agent.storeName).trim().slice(0, 120),
      ownerName: String(agent.ownerName).trim().slice(0, 120),
      district: typeof agent.district === 'string' ? agent.district.trim().slice(0, 120) : '',
      regency: typeof agent.regency === 'string' ? agent.regency.slice(0, 100) : '',
      phone: String(agent.phone).trim().slice(0, 32),
      memberCount: 0, totalOmset: 0, status: 'Aktif' as const
    };
    await createAuthAccount({
      id: String(safeAgent.id),
      role: 'agent',
      name: String(safeAgent.ownerName),
      identifiers: [safeAgent.code, safeAgent.phone, safeAgent.storeName].filter(Boolean),
      password,
      agentId: String(safeAgent.id)
    });
    try { await db!.collection('agents').insertOne({ ...safeAgent, _id: safeAgent.id }); }
    catch (error) { await db!.collection('auth_users').deleteOne({ _id: `agent:${safeAgent.id}` }); throw error; }
    const saved = safeAgent;
    const user = { id: String(saved.id), role: 'agent' as const, name: String(saved.ownerName), agentId: String(saved.id) };
    setSessionCookie(res, await createSession(user));
    res.status(201).json({ agent: stripSecrets(saved), user });
  } catch (error: any) {
    if (error?.code === 11000) {
      res.status(409).json({ error: 'Kode agen, toko, atau nomor telepon sudah terdaftar.' });
      return;
    }
    console.error('[Register] Agen gagal:', error);
    res.status(503).json({ error: 'Pendaftaran agen sementara tidak tersedia.' });
  }
});

// Public catalog and agent directory contain no account credentials.
app.get('/api/packages', async (_req: Request, res: Response) => {
  try { res.json((await getAllPackages()).map((item) => stripSecrets(item as any))); }
  catch { res.status(500).json({ error: 'Katalog tidak dapat dimuat.' }); }
});

app.post('/api/packages', adminOnly, async (req: Request, res: Response) => {
  try { res.json(await savePackage(stripSecrets(req.body || {}))); }
  catch { res.status(500).json({ error: 'Paket tidak dapat disimpan.' }); }
});

app.get('/api/agents', async (_req: Request, res: Response) => {
  try {
    const agents = await getAllAgents();
    res.json(agents.map((agent: any) => ({
      id: agent.id,
      code: agent.code,
      name: agent.name,
      storeName: agent.storeName,
      ownerName: agent.ownerName,
      district: agent.district,
      regency: agent.regency,
      phone: agent.phone,
      memberCount: agent.memberCount,
      totalOmset: agent.totalOmset,
      status: agent.status
    })));
  } catch { res.status(500).json({ error: 'Daftar agen tidak dapat dimuat.' }); }
});

app.get('/api/members', signedIn, async (req: Request, res: Response) => {
  try {
    const members = await getAllMembers();
    res.json(members.filter((item: any) => canReadMember(req.auth!, item)).map((item: any) => stripSecrets(item)));
  } catch { res.status(500).json({ error: 'Data member tidak dapat dimuat.' }); }
});

app.post('/api/members', requireRoles('admin', 'agent', 'korwil'), async (req: Request, res: Response) => {
  try {
    const memberId = String(req.body?.id || '');
    const current = (await getAllMembers()).find((item: any) => String(item.id) === memberId);
    if (!current || !canReadMember(req.auth!, current)) {
      res.status(404).json({ error: 'Member tidak ditemukan.' });
      return;
    }
    if (req.auth!.role === 'agent') {
      if (req.body?.status !== 'Lunas') { res.status(403).json({ error: 'Agen hanya dapat mencatat penyerahan paket.' }); return; }
      const saved = await saveMember({ ...current, status: 'Lunas' });
      res.json(stripSecrets(saved));
      return;
    }
    const allowed = ['name', 'phone', 'email', 'address', 'regency', 'agentId', 'agentName', 'packageId', 'packageName', 'packagePrice', 'status'];
    const changes = Object.fromEntries(allowed.filter((key) => req.body?.[key] !== undefined).map((key) => [key, req.body[key]]));
    const saved = await saveMember(stripSecrets({ ...current, ...changes, id: memberId }));
    res.json(stripSecrets(saved));
  } catch { res.status(500).json({ error: 'Data member tidak dapat disimpan.' }); }
});

app.get('/api/transactions', signedIn, async (req: Request, res: Response) => {
  try {
    const transactions = await getAllTransactions();
    res.json(transactions.filter((item: any) => canReadTransaction(req.auth!, item)).map((item: any) => stripSecrets(item)));
  } catch { res.status(500).json({ error: 'Transaksi tidak dapat dimuat.' }); }
});

app.post('/api/transactions', signedIn, async (req: Request, res: Response) => {
  try {
    const incoming = stripSecrets(req.body || {});
    const transactions = await getAllTransactions();
    const current = transactions.find((item: any) => String(item.id) === String(incoming.id));

    if (current) {
      if (!canReadTransaction(req.auth!, current)) {
        res.status(403).json({ error: 'Transaksi ini berada di luar akun Anda.' });
        return;
      }
      if (current.status !== 'Menunggu' || !['Berhasil', 'Ditolak'].includes(incoming.status) || !['admin', 'korwil'].includes(req.auth!.role)) {
        res.status(403).json({ error: 'Hanya transaksi menunggu yang dapat diproses oleh Admin atau Korwil.' });
        return;
      }
      res.json(await saveTransaction({ ...current, status: incoming.status, notes: incoming.notes || current.notes }));
      return;
    }

    if (!['member', 'agent'].includes(req.auth!.role) || incoming.status !== 'Menunggu' || !Number.isFinite(incoming.amount) || incoming.amount <= 0 || incoming.amount > 100000000) {
      res.status(403).json({ error: 'Akun ini tidak dapat membuat transaksi tersebut.' });
      return;
    }
    if (req.auth!.role === 'member' && String(incoming.memberId) !== req.auth!.id) {
      res.status(403).json({ error: 'Transaksi hanya dapat dibuat untuk akun sendiri.' });
      return;
    }
    const member = (await getAllMembers()).find((item: any) => String(item.id) === String(incoming.memberId));
    if (!member || (req.auth!.role === 'member' && String(member.id) !== req.auth!.id)) {
      res.status(403).json({ error: 'Member transaksi tidak sesuai akun Anda.' });
      return;
    }
    if (req.auth!.role === 'agent' && String(member.agentId) !== req.auth!.id) {
      res.status(403).json({ error: 'Transaksi hanya dapat dibuat untuk member binaan Anda.' });
      return;
    }
    const methods = ['Transfer Bank BRI', 'Transfer Bank BCA', 'QRIS Instant', 'Tunai Agen'];
    if (!methods.includes(incoming.method)) { res.status(400).json({ error: 'Metode pembayaran tidak valid.' }); return; }
    const id = `tx-${randomUUID()}`;
    const transaction = {
      id,
      invoiceNo: `INV-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomUUID().slice(0, 6).toUpperCase()}`,
      memberId: String(member.id), memberName: String(member.name), memberCode: String(member.memberCode),
      packageName: String(member.packageName), agentId: String(member.agentId), agentName: String(member.agentName),
      amount: Number(incoming.amount), method: incoming.method,
      date: new Date().toLocaleDateString('id-ID'), status: 'Menunggu',
      ...(typeof incoming.proofUrl === 'string' ? { proofUrl: incoming.proofUrl.slice(0, 2000) } : {})
    };
    res.status(201).json(await saveTransaction(transaction));
  } catch { res.status(500).json({ error: 'Transaksi tidak dapat disimpan.' }); }
});

app.post('/api/agents', adminOnly, async (req: Request, res: Response) => {
  try { res.json(await saveAgent(stripSecrets(req.body || {}))); }
  catch { res.status(500).json({ error: 'Data agen tidak dapat disimpan.' }); }
});

app.get('/api/admins', adminOnly, async (_req: Request, res: Response) => {
  try { res.json((await getAllAdmins()).map((item: any) => stripSecrets(item))); }
  catch { res.status(500).json({ error: 'Daftar admin tidak dapat dimuat.' }); }
});

app.post('/api/admins', adminOnly, async (req: Request, res: Response) => {
  try {
    const admin = req.body || {};
    if (!admin.id || !admin.username || !admin.email || !admin.name) {
      res.status(400).json({ error: 'Data admin tidak lengkap.' });
      return;
    }
    const { db } = await getDb();
    if (!db) { res.status(503).json({ error: 'Database tidak tersedia.' }); return; }
    const accountId = `admin:${String(admin.id)}`;
    if (String(admin.id) === req.auth!.id || String(admin.id) === 'admin-001') {
      res.status(400).json({ error: 'Akun utama tidak dapat diubah melalui pengelolaan admin.' });
      return;
    }
    if (admin.status !== undefined && !['Aktif', 'Non-aktif'].includes(admin.status)) {
      res.status(400).json({ error: 'Status akun tidak valid.' });
      return;
    }
    if (!['superadmin', 'admin', 'finance', 'staff'].includes(String(admin.role))) {
      res.status(400).json({ error: 'Peran admin tidak valid.' });
      return;
    }
    const existingAccount = await db.collection('auth_users').findOne({ _id: accountId });
    if (!existingAccount) {
      if (typeof admin.password !== 'string' || admin.password.length < 12) {
        res.status(400).json({ error: 'Akun admin memerlukan kata sandi minimal 12 karakter.' });
        return;
      }
      await createAuthAccount({ id: String(admin.id), role: 'admin', name: String(admin.name), identifiers: [admin.username, admin.email], password: admin.password, status: admin.status || 'Aktif' });
    } else {
      const submittedIdentifiers = [String(admin.username), String(admin.email)].map((value) => value.trim().toLowerCase()).sort();
      const storedIdentifiers = (existingAccount.identifiers || []).filter((value: any) => typeof value === 'string').sort();
      const normalizedStored = [...new Set(storedIdentifiers.flatMap((value: string) => [value.toLowerCase()]))];
      if (!admin.password && submittedIdentifiers.some((value) => !normalizedStored.includes(value))) {
        res.status(400).json({ error: 'Untuk mengganti username atau email, atur kata sandi baru minimal 12 karakter.' });
        return;
      }
      await db.collection('auth_users').updateOne({ _id: accountId }, { $set: { status: admin.status || 'Aktif', name: String(admin.name) } });
      if (admin.status === 'Non-aktif') {
        await db.collection('auth_sessions').deleteMany({ 'principal.role': 'admin', 'principal.id': String(admin.id) });
      }
      if (typeof admin.password === 'string' && admin.password.length >= 12) {
        await createAuthAccount({ id: String(admin.id), role: 'admin', name: String(admin.name), identifiers: [admin.username, admin.email], password: admin.password, status: admin.status || 'Aktif' });
        await db.collection('auth_sessions').deleteMany({ 'principal.role': 'admin', 'principal.id': String(admin.id) });
      }
    }
    const safeAdmin = stripSecrets(admin);
    const savedAdmin = { ...safeAdmin, id: String(admin.id), status: admin.status === 'Non-aktif' ? 'Non-aktif' : 'Aktif' };
    await db.collection('admins').updateOne({ _id: String(admin.id) }, { $set: { ...savedAdmin, updatedAt: new Date().toISOString() } }, { upsert: true });
    res.json(stripSecrets(savedAdmin));
  } catch (error: any) {
    if (error?.code === 11000) { res.status(409).json({ error: 'Username atau email sudah dipakai.' }); return; }
    res.status(500).json({ error: 'Akun admin tidak dapat disimpan.' });
  }
});

app.delete('/api/admins/:id', adminOnly, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || '');
    if (!id || id === req.auth!.id || id === 'admin-001') {
      res.status(400).json({ error: 'Akun ini tidak dapat dinonaktifkan.' });
      return;
    }
    const { db } = await getDb();
    if (!db) { res.status(503).json({ error: 'Database tidak tersedia.' }); return; }
    const result = await db.collection('auth_users').updateOne({ _id: `admin:${id}` }, { $set: { status: 'Non-aktif', updatedAt: new Date() } });
    if (!result.matchedCount) { res.status(404).json({ error: 'Akun admin tidak ditemukan.' }); return; }
    await db.collection('admins').updateOne({ _id: id }, { $set: { status: 'Non-aktif' } });
    await db.collection('auth_sessions').deleteMany({ 'principal.role': 'admin', 'principal.id': id });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Akun admin tidak dapat dinonaktifkan.' });
  }
});

app.get('/api/db/status', adminOnly, async (_req: Request, res: Response) => {
  try { res.json(await getDbStatus()); }
  catch { res.status(500).json({ error: 'Status database tidak dapat dibaca.' }); }
});

app.post('/api/db/reconnect', adminOnly, async (_req: Request, res: Response) => {
  try { await getDb(); res.json(await getDbStatus()); }
  catch { res.status(500).json({ error: 'Database tidak dapat dihubungkan.' }); }
});

app.post('/api/db/seed', adminOnly, async (_req: Request, res: Response) => {
  try { res.json(await forceSeed()); }
  catch { res.status(500).json({ error: 'Data contoh tidak dapat dimuat.' }); }
});

export default app;
