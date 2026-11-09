// Node-style handler for POST /api/contact (local preview via scripts/serve.mjs; also works on Vercel).
// The live site runs on Cloudflare Pages: see functions/api/contact.js. Both use lib/contact.js.
import { handleContact } from '../lib/contact.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim() || 'unknown';
  const { status, data } = await handleContact({ body, ip, env: process.env });
  return res.status(status).json(data);
}
