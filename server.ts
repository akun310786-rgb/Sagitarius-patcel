import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './src/server/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;

app.use(express.static(path.resolve(__dirname, 'public')));

async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Sagitarius Parcel Server] Berjalan pada port ${PORT}`);
  });
}

setupServer().catch((error) => {
  console.error('[Server Error] Gagal menjalankan server:', error);
});
