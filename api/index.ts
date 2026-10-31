import type { Request, Response } from 'express';
import app from '../src/server/app.js';

export default function handler(req: Request, res: Response) {
  const requestUrl = new URL(req.url || '/', 'http://vercel.local');
  const route = requestUrl.searchParams.get('__route');

  if (!route) {
    res.status(404).json({ error: 'Rute API tidak ditemukan.' });
    return;
  }

  requestUrl.searchParams.delete('__route');
  const query = requestUrl.searchParams.toString();
  req.url = `/api/${route.replace(/^\/+/, '')}${query ? `?${query}` : ''}`;
  app(req, res);
}
