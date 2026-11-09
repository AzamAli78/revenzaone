// Contact form logic shared by every host (Cloudflare Pages, Vercel, local preview).
// Sends the enquiry by email through Resend (https://resend.com).
// Needs env vars RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL. If they are
// missing it answers 503, so the website shows an honest error instead of a fake success.

const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);

// Very small in-memory rate limit (per running instance). Use a real store for heavy traffic.
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 5;
}

const fail = (status, error) => ({ status, data: { ok: false, error } });

export async function handleContact({ body, ip = 'unknown', env = {} }) {
  body = body && typeof body === 'object' ? body : {};

  // Honeypot: bots fill this. Pretend success without sending.
  if (clean(body.website, 200)) return { status: 200, data: { ok: true } };
  if (limited(ip)) return fail(429, 'Too many requests.');

  const d = {
    name: clean(body.name, 120),
    business: clean(body.business, 160),
    email: clean(body.email, 160),
    phone: clean(body.phone, 40),
    industry: clean(body.industry, 80),
    budget: clean(body.budget, 80),
    services: Array.isArray(body.services) ? body.services.map((s) => clean(s, 60)).filter(Boolean).slice(0, 15) : [],
    details: clean(body.details, 4000),
  };
  if (d.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) || d.phone.replace(/\D/g, '').length < 8 || !d.services.length || d.details.length < 10) {
    return fail(400, 'Please check the form and try again.');
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error('Contact form is not configured: set RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL.');
    return fail(503, 'The enquiry form is not connected yet.');
  }

  const rows = [['Name', d.name], ['Business', d.business], ['Email', d.email], ['Phone / WhatsApp', d.phone], ['Industry', d.industry], ['Budget', d.budget], ['Services', d.services.join(', ')], ['Details', d.details]]
    .filter(([, v]) => v);
  const html = `<h2>New enquiry from the Revenza One website</h2><table cellpadding="8" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="border:1px solid #ddd"><strong>${esc(k)}</strong></td><td style="border:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`).join('')}</table>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: d.email,
        subject: `New enquiry: ${d.name}${d.business ? ` (${d.business})` : ''}`,
        html,
        text,
      }),
    });
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text());
      return fail(502, 'We could not send your enquiry right now.');
    }
    return { status: 200, data: { ok: true } };
  } catch (err) {
    console.error('Contact send failed', err);
    return fail(502, 'We could not send your enquiry right now.');
  }
}
