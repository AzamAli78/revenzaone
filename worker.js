// Cloudflare Workers entry: serves the built site from ./dist and handles the contact form.
// Runs before static files (run_worker_first) so it can send www traffic to the main domain.
import { handleContact } from './lib/contact.js';

const json = (status, data, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === '/api/contact' || url.pathname === '/api/contact/') {
      if (request.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed.' }, { Allow: 'POST' });
      let body = {};
      try { body = await request.json(); } catch { /* invalid JSON -> validation error */ }
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const { status, data } = await handleContact({ body, ip, env });
      return json(status, data);
    }
    return env.ASSETS.fetch(request);
  },
};
