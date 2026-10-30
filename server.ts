import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
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
  saveAdmin,
  forceSeed,
  getDb
} from './src/server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.resolve(__dirname, 'public')));

// Initial DB connection attempt in background (silent, non-blocking)
getDb().catch(() => {});

// ---------------- API ROUTES ----------------

// Database Status & Diagnostics
app.get('/api/db/status', async (req: Request, res: Response) => {
  try {
    const status = await getDbStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Gagal memeriksa status database' });
  }
});

// Force Reconnect
app.post('/api/db/reconnect', async (req: Request, res: Response) => {
  try {
    const status = await getDb();
    const info = await getDbStatus();
    res.json(info);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Gagal reconnect ke MongoDB Atlas' });
  }
});

// Force Seed Data
app.post('/api/db/seed', async (req: Request, res: Response) => {
  try {
    const result = await forceSeed();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Gagal melakukan seed data' });
  }
});

// Packages
app.get('/api/packages', async (req: Request, res: Response) => {
  try {
    const pkgs = await getAllPackages();
    res.json(pkgs);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

app.post('/api/packages', async (req: Request, res: Response) => {
  try {
    const saved = await savePackage(req.body);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

// Members
app.get('/api/members', async (req: Request, res: Response) => {
  try {
    const members = await getAllMembers();
    res.json(members);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

app.post('/api/members', async (req: Request, res: Response) => {
  try {
    const saved = await saveMember(req.body);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

// Agents
app.get('/api/agents', async (req: Request, res: Response) => {
  try {
    const agents = await getAllAgents();
    res.json(agents);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

app.post('/api/agents', async (req: Request, res: Response) => {
  try {
    const saved = await saveAgent(req.body);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

// Transactions
app.get('/api/transactions', async (req: Request, res: Response) => {
  try {
    const transactions = await getAllTransactions();
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

app.post('/api/transactions', async (req: Request, res: Response) => {
  try {
    const saved = await saveTransaction(req.body);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

// Admins
app.get('/api/admins', async (req: Request, res: Response) => {
  try {
    const admins = await getAllAdmins();
    res.json(admins);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

app.post('/api/admins', async (req: Request, res: Response) => {
  try {
    const saved = await saveAdmin(req.body);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

// ---------------- VITE MIDDLEWARE / STATIC FILES ----------------

async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Sagitarius Parcel Server] Berjalan pada port ${PORT} (http://localhost:${PORT})`);
  });
}

setupServer().catch((err) => {
  console.error('[Server Error] Gagal menjalankan server:', err);
});
