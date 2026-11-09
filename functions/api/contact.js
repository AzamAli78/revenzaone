// Cloudflare Pages Function: POST /api/contact
// Env vars (Pages project > Settings > Variables and Secrets): RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.
import { handleContact } from '../../lib/contact.js';

const json = (status, data, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });

export async function onRequestPost({ request, env }) {
  let body = {};
  try { body = await request.json(); } catch { /* invalid JSON -> validation error below */ }
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const { status, data } = await handleContact({ body, ip, env });
  return json(status, data);
}

export const onRequest = () => json(405, { ok: false, error: 'Method not allowed.' }, { Allow: 'POST' });
