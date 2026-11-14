// Zero-dependency static site generator for Revenza One.
// Usage: node build.mjs   (outputs to ./dist)
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ASSET_V = Date.now().toString(36);
import {
  site, contact, nav, home, services, pricing, portfolio, portfolioCategories,
  about, industries, serviceOptions, budgetOptions, faqs,
} from './site.config.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

// ---------- helpers ----------
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const isSet = (v) => typeof v === 'string' && v.trim() !== '' && !v.trim().startsWith('[INSERT');
const digits = (v) => (isSet(v) ? v.replace(/\D/g, '') : '');
const waLink = (msg = contact.whatsappMessage) => {
  const n = digits(contact.whatsapp);
  return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`;
};
const telHref = () => (digits(contact.whatsapp) ? 'tel:+' + digits(contact.whatsapp) : '');
const phoneText = () => '+' + digits(contact.whatsapp).replace(/^91(\d{5})(\d{5})$/, '91 $1 $2');
const abs = (p) => site.siteUrl.replace(/\/$/, '') + p;

const ICONS = {
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  sparkles: '<path d="m12 3 1.9 5.8 5.8 1.9-5.8 1.9L12 18.4l-1.9-5.8L4.3 10.7l5.8-1.9z"/><path d="M19 3v4M17 5h4M5 17v4M3 19h4"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  pen: '<path d="m12 19 7-7 3 3-7 7z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18z"/><path d="m2 2 7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
  sound: '<path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
  mute: '<path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="m22 9-6 6M16 9l6 6"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  insta: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
};
const icon = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
const WA_SVG = '<svg viewBox="0 0 32 32" aria-hidden="true" class="wa-ic"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.1 19.7L3 29l6.5-1.7A13 13 0 1 0 16 3zm0 2.4a10.6 10.6 0 1 1-5.4 19.7l-.4-.2-3.8 1 1-3.7-.3-.4A10.6 10.6 0 0 1 16 5.4zm-4 5.6c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.4 3.7 1.5 3.9c.2.3 2.6 4.1 6.4 5.6 3.2 1.2 3.8 1 4.5.9.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5l-2.600-1.200c-.3-.1-.6-.2-.9.2-.3.4-1 1.200-1.200 1.500-.2.200-.4.300-.8.100-.4-.2-1.600-.6-3-1.900-1.100-1-1.900-2.200-2.100-2.600-.2-.4 0-.6.200-.8l.6-.7c.2-.2.300-.4.400-.6.100-.3.100-.5 0-.7l-1.200-2.900c-.3-.7-.6-.7-.9-.7z"/></svg>';

const ctaLabel = 'Get a Free Consultation';

// ---------- mockup visuals (pure HTML/CSS, no fake data) ----------
function visual(type, hue = 45) {
  const s = `style="--h:${hue}"`;
  switch (type) {
    case 'website':
      return `<div class="vis vis-website" ${s} aria-hidden="true"><div class="v-bar"><i></i><i></i><i></i></div><div class="v-hero"><b></b><s></s><em></em></div><div class="v-cols"><u></u><u></u><u></u></div></div>`;
    case 'social':
      return `<div class="vis vis-social" ${s} aria-hidden="true">${[0, 1, 2, 3, 4, 5].map((i) => `<div class="v-tile t${i}"><b></b><s></s></div>`).join('')}</div>`;
    case 'ugc':
      return `<div class="vis vis-ugc" ${s} aria-hidden="true"><div class="v-phone"><div class="v-person"></div><div class="v-play"></div><div class="v-caption"><b></b><s></s></div></div></div>`;
    case 'flyer':
      return `<div class="vis vis-flyer" ${s} aria-hidden="true"><div class="v-poster"><span></span><b></b><s></s><s></s><em></em></div></div>`;
    case 'brand':
      return `<div class="vis vis-brand" ${s} aria-hidden="true"><div class="v-logo">R</div><div class="v-sw"><i></i><i></i><i></i><i></i></div><div class="v-type"><b>Aa</b><s></s></div></div>`;
    case 'campaign':
      return `<div class="vis vis-campaign" ${s} aria-hidden="true"><div class="v-chart">${[38, 52, 44, 66, 58, 78, 70].map((h) => `<i style="height:${h}%"></i>`).join('')}</div><div class="v-funnel"><b></b><b></b><b></b></div></div>`;
    case 'chat':
      return `<div class="vis vis-chat" ${s} aria-hidden="true"><div class="m in">Hi! I'd like to know more.</div><div class="m out">Thanks for reaching out. How can we help?</div><div class="m in short"></div><div class="m out typing"><i></i><i></i><i></i></div></div>`;
    default:
      return '';
  }
}

const videoTag = (p, attrs = '') => `<video controls playsinline preload="none" poster="${esc(p.image)}" aria-label="${esc(p.alt || p.title)}" ${attrs}><source src="${esc(p.video)}" type="video/mp4" /></video>`;

function heroFilm() {
  return `<figure class="hero-film">
      <div class="hf-frame">
        <video id="hero-film" autoplay muted loop playsinline preload="auto" poster="/assets/video/revenza-film-poster.jpg" aria-label="30-second Revenza One showreel: client websites, flyer designs, an AI video ad, pricing and the enquiry form">
          <source src="/assets/video/revenza-film.mp4" type="video/mp4">
        </video>
        <button class="hf-sound" type="button" aria-pressed="false">${icon('play')}<span>Watch with sound</span></button>
      </div>
      <figcaption>Our work in 30 seconds</figcaption>
    </figure>`;
}

function heroVisual() {
  return `<div class="hero-art" aria-label="Illustration of a digital marketing ecosystem: website, social creatives, AI video ad and analytics dashboard">
    <div class="ha-glow" aria-hidden="true"></div>
    <div class="ha-browser">${visual('website', 42)}</div>
    <div class="ha-phone">${visual('ugc', 42)}<span class="ha-tag">AI video ad</span></div>
    <div class="ha-social">${visual('social', 42)}</div>
    <div class="ha-dash">${visual('campaign', 42)}<span class="ha-tag">Analytics dashboard</span></div>
    <div class="ha-chip c1">${icon('globe')} Website</div>
    <div class="ha-chip c2">${icon('sparkles')} AI Content</div>
    <div class="ha-chip c3">${icon('chat')} WhatsApp</div>
    <div class="ha-note">Illustrative mockup</div>
  </div>`;
}

// ---------- layout ----------
function jsonLd() {
  const sameAs = [contact.instagram, contact.linkedin, contact.facebook].filter(isSet);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': abs('/#organization'),
    name: site.shortName,
    alternateName: ['Revenzaone', 'REVENZA ONE'],
    url: abs('/'),
    logo: abs('/assets/img/logo-mark.png'),
    image: abs('/assets/img/og-image.png'),
    slogan: site.tagline,
    description: `Revenza One is a digital marketing agency${site.seoLocation ? ` in ${site.seoLocation}, ${site.seoRegion}` : ''} offering website development, Google Business Profile optimization, social media marketing, AI UGC video ads, branding and WhatsApp automation for local businesses across India.`,
    areaServed: [
      ...(site.seoLocation ? [{ '@type': 'City', name: site.seoLocation }, { '@type': 'State', name: site.seoRegion }] : []),
      { '@type': 'Country', name: 'India' },
    ],
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    knowsAbout: ['Website development', 'Google Business Profile optimization', 'Local SEO', 'Social media marketing', 'AI UGC video ads', 'Branding and graphic design', 'WhatsApp Business automation'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital marketing services',
      itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.short, url: abs('/services/') + '#' + s.id } })),
    },
  };
  if (isSet(contact.email)) data.email = contact.email;
  if (digits(contact.whatsapp)) data.telephone = '+' + digits(contact.whatsapp);
  // Service-area business: city and region only, no street address.
  if (site.seoLocation) data.address = { '@type': 'PostalAddress', addressLocality: site.seoLocation, addressRegion: site.seoRegion, addressCountry: 'IN' };
  if (sameAs.length) data.sameAs = sameAs;
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function header(path) {
  const links = nav.map((n) => `<a href="${n.href}"${n.href === path ? ' aria-current="page"' : ''}>${n.label}</a>`).join('');
  return `<header class="site-header" id="top">
  <div class="container hdr">
    <a class="brand" href="/" aria-label="Revenza One home"><img src="/assets/img/logo-mark.png" width="40" height="40" alt="" /><span class="brand-word"><b>REVENZA</b> <em>ONE</em></span></a>
    <nav class="main-nav" id="main-nav" aria-label="Main navigation">${links}<a class="btn btn-gold btn-sm nav-cta-mobile" href="/contact/">${ctaLabel}</a></nav>
    <a class="btn btn-gold btn-sm nav-cta" href="/contact/">${ctaLabel}</a>
    <button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">${icon('menu', 'm-open')}${icon('close', 'm-close')}</button>
  </div>
</header>`;
}

function footer() {
  const social = [
    isSet(contact.instagram) && `<a href="${esc(contact.instagram)}" rel="noopener" target="_blank" aria-label="Instagram">${icon('insta')}</a>`,
    isSet(contact.linkedin) && `<a href="${esc(contact.linkedin)}" rel="noopener" target="_blank" aria-label="LinkedIn">${icon('linkedin')}</a>`,
    isSet(contact.facebook) && `<a href="${esc(contact.facebook)}" rel="noopener" target="_blank" aria-label="Facebook">${icon('facebook')}</a>`,
  ].filter(Boolean).join('');
  const li = (label, v, href, ic) => (isSet(v) ? `<li>${icon(ic)}<a href="${href}"${href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${label}</a></li>` : '');
  return `<footer class="site-footer">
  <div class="container foot-grid">
    <div class="foot-brand">
      <a class="brand" href="/" aria-label="Revenza One home"><img src="/assets/img/logo-mark.png" width="44" height="44" alt="" /><span class="brand-word"><b>REVENZA</b> <em>ONE</em></span></a>
      <p class="foot-desc">AI-Powered Digital Growth Agency.</p>
      <p class="foot-tag">“${site.tagline}”</p>
      ${social ? `<div class="social">${social}</div>` : ''}
    </div>
    <div><h2 class="foot-h">Quick Links</h2><ul>
      <li><a href="/">Home</a></li><li><a href="/about/">About Us</a></li><li><a href="/services/">Services</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/portfolio/">Portfolio</a></li><li><a href="/contact/">Contact</a></li>${cityPath ? `<li><a href="${cityPath}">Digital Marketing in ${esc(site.seoLocation)}</a></li>` : ''}</ul></div>
    <div><h2 class="foot-h">Our Services</h2><ul>
      <li><a href="/services/#website">Website Development</a></li><li><a href="/pricing/#gbp">Google Business Profile</a></li><li><a href="/services/#social">Social Media Marketing</a></li><li><a href="/services/#ai-studio">AI UGC Advertisements</a></li><li><a href="/services/#branding">Branding &amp; Design</a></li><li><a href="/services/#automation">Business Automation</a></li></ul></div>
    <div><h2 class="foot-h">Contact</h2><ul class="foot-contact">
      ${li(esc(contact.email), contact.email, 'mailto:' + esc(contact.email), 'mail')}
      ${telHref() ? `<li>${icon('phone')}<a href="${telHref()}">${phoneText()}</a></li>` : ''}
      <li>${icon('chat')}<a href="${waLink()}" target="_blank" rel="noopener">WhatsApp us</a></li>
      ${isSet(contact.location) ? `<li>${icon('pin')}<span>${esc(contact.location)}</span></li>` : ''}
      ${li('Instagram', contact.instagram, esc(contact.instagram), 'insta')}
      ${li('LinkedIn', contact.linkedin, esc(contact.linkedin), 'linkedin')}
    </ul></div>
  </div>
  <div class="container foot-bottom">
    <p>© ${site.year} Revenza One. All Rights Reserved.</p>
    <p><a href="/privacy-policy/">Privacy Policy</a> · <a href="/terms-and-conditions/">Terms &amp; Conditions</a></p>
  </div>
</footer>
<a class="wa-float" href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat with Revenza One on WhatsApp">${WA_SVG}<span>Chat on WhatsApp</span></a>`;
}

function layout({ path, title, description, body, noindex = false, ogType = 'website' }) {
  const canonical = abs(path);
  const fullTitle = path === '/' ? title : `${title} | Revenza One`;
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${canonical}" />
${noindex ? '<meta name="robots" content="noindex" />' : '<meta name="robots" content="index, follow" />'}
<meta name="theme-color" content="#050507" />
${isSet(site.googleSiteVerification) ? `<meta name="google-site-verification" content="${esc(site.googleSiteVerification)}" />` : ''}
<meta property="og:type" content="${ogType}" />
<meta property="og:site_name" content="Revenza One" />
<meta property="og:title" content="${esc(fullTitle)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:image" content="${abs('/assets/img/og-image.png')}" />
<meta property="og:locale" content="${site.locale}" />
${site.seoLocation ? `<meta name="geo.region" content="IN-RJ" />
<meta name="geo.placename" content="${esc(site.seoLocation)}" />` : ''}
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" type="image/png" href="/assets/img/logo-mark.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/css/styles.css?v=${ASSET_V}" />
${jsonLd()}
${site.cfAnalyticsToken ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${esc(site.cfAnalyticsToken)}"}'></script>` : ''}
</head>
<body>
<script>document.documentElement.classList.add('js')</script>
<a class="skip" href="#main">Skip to content</a>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/js/main.js?v=${ASSET_V}" defer></script>
</body>
</html>`;
}

const pageHead = (eyebrow, title, text) => `<section class="page-head"><div class="container narrow">
  <p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${text ? `<p class="lead">${text}</p>` : ''}</div></section>`;

const ctaBanner = (title = 'Ready to grow your business?', text = 'Tell us what you want to achieve. We will suggest the right mix of services, with clear deliverables and pricing.') => `<section class="section"><div class="container"><div class="cta-banner reveal">
  <div><h2>${title}</h2><p>${text}</p></div>
  <div class="cta-actions"><a class="btn btn-gold" href="/contact/">Start Your Project ${icon('arrow')}</a><a class="btn btn-ghost" href="${waLink()}" target="_blank" rel="noopener">Talk to Our Team</a></div>
</div></div></section>`;


// FAQ block + FAQPage structured data. {price:Name} pulls the price from the pricing list.
const priceOf = (name) => {
  const it = [...pricing.groups.flatMap((g) => g.items), ...pricing.bundles].find((x) => x.name === name);
  if (!it) throw new Error('FAQ refers to unknown price: ' + name);
  return it.price;
};
const fillPrices = (s) => s.replace(/{price:([^}]+)}/g, (_, n) => priceOf(n));
function faqSection(list, title = 'Frequently asked questions') {
  const items = list.map((f) => ({ q: f.q, a: fillPrices(f.a) }));
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return `<section class="section"><div class="container narrow">
  <div class="section-head reveal"><p class="eyebrow">FAQ</p><h2>${title}</h2></div>
  <div class="faq reveal">${items.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>
</div></section>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\u003c')}</script>`;
}


// City landing page for local SEO (e.g. /digital-marketing-agency-udaipur/).
const cityPath = site.seoLocation ? `/digital-marketing-agency-${site.seoLocation.toLowerCase().replace(/[^a-z]+/g, '-')}/` : '';
function cityPage() {
  const city = esc(site.seoLocation), region = esc(site.seoRegion);
  const offers = [
    ['Business websites', 'Mobile-friendly websites with WhatsApp, click-to-call and Google Maps, so customers can reach you in one tap.', 'One-Page Business Website', '', '/services/#website'],
    ['Google Business Profile', `Get found on Google Maps when people in ${city} search for what you sell. Setup, optimization, posts and review replies.`, 'GBP Full Optimization', '', '/pricing/#gbp'],
    ['Social media management', 'Instagram and Facebook posts, reels and comment management in a consistent brand style.', 'Starter Plan', '/month', '/services/#social'],
    ['AI UGC video ads', 'Short vertical video ads with an AI presenter and voiceover, without a film shoot. Clearly labelled as AI-generated.', 'Single AI UGC Video', '/video', '/services/#ai-studio'],
    ['Flyers and branding', 'Offer flyers, festival creatives, menus, visiting cards, logos and brand kits, ready for print and Instagram.', 'Single Promotional Flyer / Poster', '', '/services/#branding'],
    ['WhatsApp automation', 'WhatsApp Business setup, quick replies, greeting messages and automated enquiry handling.', 'WhatsApp Business Setup', '', '/services/#automation'],
  ];
  const body = `${pageHead(`${city}, ${region}`, `Digital Marketing Agency in ${city}`, `Revenza One helps ${city} businesses get found on Google, look professional on Instagram and turn enquiries into customers on WhatsApp. Based in ${city}, working with businesses across India online.`)}
<section class="section tight" style="padding-top:0"><div class="container"><div class="hero-cta" style="justify-content:center">
  <a class="btn btn-wa btn-lg" href="${waLink(`Hi Revenza One! I run a business in ${site.seoLocation} and I'd like to discuss digital marketing.`)}" target="_blank" rel="noopener">${WA_SVG} WhatsApp Us</a>
  ${telHref() ? `<a class="btn btn-ghost btn-lg" href="${telHref()}">${icon('phone')} Call ${phoneText()}</a>` : ''}
</div></div></section>
<section class="section"><div class="container">
  <div class="section-head reveal"><p class="eyebrow">Services in ${city}</p><h2>What we do for local businesses</h2><p>Prices are indicative and confirmed in writing before work starts.</p></div>
  <div class="grid-3">${offers.map(([t, d, item, per, href], i) => `<article class="card reveal" style="--d:${(i % 3) * 70}ms"><h3>${esc(t)}</h3><p>${d}</p><p class="price-line"><strong>${esc(priceOf(item))}</strong>${per} <a class="link-arrow" href="${href}">Details ${icon('arrow')}</a></p></article>`).join('')}</div>
</div></section>
<section class="section tight"><div class="container narrow note-box reveal"><p><strong>Local work:</strong> we built the website for <a href="/portfolio/">Bright Future Tuition Point</a>, a tuition centre in ${city}. See more client work in our <a href="/portfolio/">portfolio</a>.</p></div></section>
${faqSection(faqs.udaipur, `Questions from ${city} businesses`)}
${ctaBanner(`Grow your ${city} business online`, 'Tell us what you sell and who you want to reach. We will suggest a starting plan with clear pricing.')}`;
  return layout({ path: cityPath, title: `Digital Marketing Agency in ${site.seoLocation}, ${site.seoRegion}`, description: `Revenza One is a digital marketing agency in ${site.seoLocation}: websites, Google Business Profile, Instagram, AI video ads, flyers and WhatsApp automation.`, body });
}

// ---------- pages ----------
const contactServiceFor = { website: 'Website Development', social: 'Social Media Management', 'ai-studio': 'AI UGC Video Ads', branding: 'Branding', automation: 'WhatsApp Automation' };
const pricingAnchorFor = { website: 'websites', social: 'social', 'ai-studio': 'ugc', branding: 'design', automation: 'automation' };

function homePage() {
  const body = `
<section class="hero">
  <div class="container hero-grid has-film">
    <div class="hero-copy">
      <p class="eyebrow">Digital Growth Agency</p>
      <h1>${esc(home.heroTitle)}</h1>
      <p class="lead">${esc(home.heroText)}</p>
      <div class="hero-cta"><a class="btn btn-gold btn-lg" href="/contact/">Let's Grow Your Business ${icon('arrow')}</a><a class="btn btn-ghost btn-lg" href="/services/">Explore Our Services</a></div>
      <p class="trust">${icon('check')} ${esc(home.heroTrust)}</p>
    </div>
    ${heroFilm()}
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal"><h2>${esc(home.introTitle)}</h2><p>${esc(home.introText)}</p></div>
    <div class="grid-4">
      ${home.highlights.map((h, i) => `<article class="card hl reveal" style="--d:${i * 70}ms"><span class="ic-wrap">${icon(h.icon)}</span><h3>${esc(h.title)}</h3><p>${esc(h.text)}</p></article>`).join('')}
    </div>
  </div>
</section>

<section class="section" id="core-services">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow">Our Core Services</p><h2>Five ways we help your business grow.</h2></div>
    <div class="clouds reveal">
      ${services.map((s, i) => `<a class="cloud" href="/services/#${s.id}" style="--f:${[7, 9, 8, 10, 6.5][i]}s;--fd:${[0, -3, -5, -2, -6][i]}s"><span class="ic-wrap">${icon(s.icon)}</span><span>${esc(s.title)}</span></a>`).join('')}
    </div>
    <p class="cloud-cta"><a class="btn btn-gold" href="/services/">Explore Services ${icon('arrow')}</a></p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow">Why Revenza One</p><h2>Why Businesses Choose Revenza One.</h2></div>
    <div class="grid-3">
      ${home.why.map((w, i) => `<article class="card why reveal" style="--d:${(i % 3) * 70}ms"><span class="num">0${i + 1}</span><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></article>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow">Our Process</p><h2>From Idea to Impact.</h2></div>
    <ol class="process">
      ${home.process.map((p, i) => `<li class="reveal" style="--d:${i * 90}ms"><span class="step">${i + 1}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section">
  <div class="container"><div class="teaser reveal">
    <div><p class="eyebrow">Clear Pricing</p><h2>Transparent, rupee-priced packages.</h2><p>Starter Combo, Local Growth Plan or a fully custom solution. One-time projects and monthly services are always shown separately.</p></div>
    <a class="btn btn-gold" href="/pricing/">View Pricing &amp; Packages ${icon('arrow')}</a>
  </div></div>
</section>
${faqSection(faqs.home)}
${ctaBanner()}`;
  return layout({
    path: '/',
    title: 'Digital Marketing Agency in Udaipur | Revenza One',
    description: 'Digital marketing agency in Udaipur, Rajasthan. Websites, Google Business Profile, social media, AI video ads and WhatsApp automation for local businesses.',
    body,
  });
}

function aboutPage() {
  const body = `${pageHead('About Us', esc(about.title), '')}
<section class="section tight"><div class="container narrow prose">
  ${about.body.map((p) => `<p>${esc(p)}</p>`).join('')}
</div></section>
<section class="section"><div class="container">
  <div class="grid-3">${about.blocks.map((b, i) => `<article class="card why reveal" style="--d:${(i % 3) * 70}ms"><span class="num">0${i + 1}</span><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></article>`).join('')}</div>
</div></section>
${ctaBanner()}`;
  return layout({ path: '/about/', title: 'About Us: Digital Growth Agency in Udaipur', description: 'Revenza One is a digital marketing agency in Udaipur, Rajasthan, helping local businesses and growing brands across India grow online.', body });
}

function servicesPage() {
  const body = `${pageHead('Services', 'Everything you need to grow digitally, under one roof.', 'Five service categories covering your website, social media, AI-powered creative, branding and business automation.')}
<div class="subnav-wrap"><nav class="subnav container" aria-label="Service categories">${services.map((s) => `<a href="#${s.id}">${esc(s.title)}</a>`).join('')}</nav></div>
${services.map((s, i) => `<section class="section svc-detail" id="${s.id}">
  <div class="container svc-grid ${i % 2 ? 'flip' : ''}">
    <div class="svc-text reveal">
      <span class="ic-wrap lg">${icon(s.icon)}</span>
      <h2>${esc(s.title)}</h2><p class="lead">${esc(s.detail)}</p>
      <ul class="chip-list">${s.list.map((l) => `<li>${icon('check')}${esc(l)}</li>`).join('')}</ul>
      <div class="row-actions"><a class="btn btn-gold" href="/contact/?service=${encodeURIComponent(contactServiceFor[s.id])}">Request a Quote</a><a class="btn btn-ghost" href="/pricing/#${pricingAnchorFor[s.id]}">See Pricing</a></div>
    </div>
    <div class="svc-art reveal${s.id === 'ai-studio' ? ' has-video' : ''}">${s.id === 'ai-studio' ? videoTag(portfolio.find((x) => x.video)) + '<p class="vid-cap">AI-generated sample video</p>' : visual(s.visual, [42, 265, 300, 25, 160][i])}</div>
  </div>
</section>`).join('')}
<section class="section tight"><div class="container narrow note-box"><p><strong>Also available:</strong> Google Business Profile setup, optimization and management. Details and prices are on the <a href="/pricing/#gbp">pricing page</a>.</p></div></section>
${ctaBanner('Not sure which service you need?', 'Tell us about your business. We will recommend a sensible starting point.')}`;
  return layout({ path: '/services/', title: 'Digital Marketing Services in Udaipur', description: 'Website development, Google Business Profile optimization, social media marketing, AI UGC video ads, branding and WhatsApp automation from Revenza One, Udaipur.', body });
}

function pricingPage() {
  const badge = (b) => `<span class="badge b-${b.toLowerCase().replace(/[^a-z]/g, '')}">${esc(b)}</span>`;
  const body = `${pageHead('Pricing & Packages', 'Clear, indicative pricing in Indian Rupees.', esc(pricing.disclaimer))}
<section class="section tight"><div class="container">
  <div class="section-head"><h2>Featured Service Bundles</h2></div>
  <div class="bundles">${pricing.bundles.map((b) => `<article class="card bundle${b.featured ? ' featured' : ''} reveal">
    ${b.featured ? '<span class="pop">Most popular</span>' : ''}
    <h3>${esc(b.name)}</h3><div class="price">${esc(b.price)}</div>${badge(b.billing)}
    <ul class="ticks">${b.includes.map((i) => `<li>${icon('check')}${esc(i)}</li>`).join('')}</ul>
    <p class="best"><strong>Best for:</strong> ${esc(b.best)}</p>
    <a class="btn ${b.featured ? 'btn-gold' : 'btn-ghost'} btn-block" href="/contact/?service=${encodeURIComponent(b.service)}">${esc(b.cta)}</a>
  </article>`).join('')}</div>
</div></section>

<div class="subnav-wrap"><nav class="subnav container" aria-label="Pricing categories">${pricing.groups.map((g) => `<a href="#${g.id}">${esc(g.title)}</a>`).join('')}</nav></div>
${pricing.groups.map((g, gi) => `<section class="section tight price-group" id="${g.id}"><div class="container">
  <h2><span class="letter">${String.fromCharCode(65 + gi)}</span>${esc(g.title)}</h2>
  <p class="group-note">${esc(g.note)}</p>
  <div class="ptable" role="table" aria-label="${esc(g.title)} pricing">
    <div class="prow phead" role="row"><div role="columnheader">Service</div><div role="columnheader">What's included</div><div role="columnheader">Price</div></div>
    ${g.items.map((it) => `<div class="prow" role="row">
      <div class="pname" role="cell">${esc(it.name)}</div>
      <div class="pinc" role="cell"><ul>${it.includes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>${it.extra ? `<p class="pextra">${esc(it.extra)}</p>` : ''}</div>
      <div class="pprice" role="cell"><strong>${esc(it.price)}</strong>${it.billing === 'Monthly' ? '<span class="per">/month</span>' : it.billing === 'Yearly' ? '<span class="per">/year</span>' : it.billing === 'Per video' ? '<span class="per">/video</span>' : ''}${badge(it.billing)}</div>
    </div>`).join('')}
  </div>
</div></section>`).join('')}
<section class="section"><div class="container narrow"><div class="card terms">
  <h2>Important pricing notes</h2>
  <ul class="ticks">${pricing.terms.map((t) => `<li>${icon('check')}${esc(t)}</li>`).join('')}</ul>
</div></div></section>
${faqSection(faqs.pricing, 'Pricing questions')}
${ctaBanner('Want an exact quote?', 'Share your requirements and we will confirm deliverables, timelines and a final price before starting.')}`;
  return layout({ path: '/pricing/', title: 'Digital Marketing Pricing in Udaipur (₹)', description: 'Indicative pricing in ₹ from Revenza One, Udaipur: websites, Google Business Profile, social media, AI video ads, branding and WhatsApp automation.', body });
}

function portfolioPage() {
  const data = JSON.stringify(portfolio.map((p) => ({ id: p.id, title: p.title, description: p.description, details: p.details, kind: p.kind, url: p.url || '', category: portfolioCategories.find((c) => c.id === p.category)?.label, visual: p.video ? videoTag(p) : p.image ? `<img src="${p.image}" alt="${esc(p.alt || p.title)}" />` : visual(p.visual, p.hue) }))).replace(/</g, '\\u003c');
  const body = `${pageHead('Portfolio', 'Our creative and technical capabilities.', 'These are demonstration and concept projects created to show what we can build. They are clearly labelled and are not client work. Real client projects will appear here once approved for display.')}
<section class="section tight"><div class="container">
  <div class="filters" role="group" aria-label="Filter projects"><button class="chip active" data-filter="all" aria-pressed="true">All</button>${portfolioCategories.map((c) => `<button class="chip" data-filter="${c.id}" aria-pressed="false">${esc(c.label)}</button>`).join('')}</div>
  <div class="carousel" aria-label="Portfolio projects">
    <div class="carousel-track port-grid">
      ${portfolio.map((p) => `<article class="card port" data-cat="${p.category}">
        <div class="port-vis${p.image ? ' has-img' : ''}${p.wide ? ' wide' : ''}"${p.ratio ? ` style="aspect-ratio:${p.ratio}"` : ''}>${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.alt || p.title)}" width="1000" loading="lazy" />` : visual(p.visual, p.hue)}${p.video ? '<span class="play-badge" aria-hidden="true"></span>' : ''}<span class="kind k-${p.kind.toLowerCase()}">${p.kind === 'Concept' ? 'Concept project' : p.kind === 'Sample' ? 'AI-generated sample' : p.kind === 'Service' ? 'Our work' : 'Client project'}</span></div>
        <p class="cat">${esc(portfolioCategories.find((c) => c.id === p.category)?.label)}</p>
        <h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>
        <button class="link-arrow btn-link" data-open="${p.id}">View Project ${icon('arrow')}</button></article>`).join('')}
    </div>
    <div class="carousel-nav"><button class="carousel-btn prev" aria-label="Previous">${icon('arrow')}</button><div class="carousel-dots"></div><button class="carousel-btn next" aria-label="Next">${icon('arrow')}</button></div>
  </div>
  <p class="empty" hidden>No projects in this category yet.</p>
</div></section>
<dialog id="proj-dialog" aria-labelledby="pd-title"><div class="pd">
  <button class="pd-close" aria-label="Close">${icon('close')}</button>
  <div class="pd-vis" id="pd-vis"></div>
  <div class="pd-body"><p class="cat" id="pd-cat"></p><h2 id="pd-title"></h2><p id="pd-desc"></p><ul class="ticks" id="pd-list"></ul><p class="pd-kind" id="pd-kind"></p>
  <div class="row-actions"><a class="btn btn-gold" href="/contact/">Start a Similar Project</a><a class="btn btn-ghost" id="pd-visit" href="#" target="_blank" rel="noopener" hidden>Visit Live Website</a></div></div></div></dialog>
<script type="application/json" id="portfolio-data">${data}</script>
${ctaBanner('Have a project in mind?', 'Tell us what you need. We will share ideas and a clear scope.')}`;
  return layout({ path: '/portfolio/', title: 'Portfolio: Websites, Flyers & AI Video Ads', description: 'Client websites, promotional flyers, an AI-generated sample video ad and brand concepts from Revenza One, a digital marketing agency in Udaipur.', body });
}

function contactPage() {
  const email = isSet(contact.email) ? `<li>${icon('mail')}<a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></li>` : '';
  const loc = isSet(contact.location) ? `<li>${icon('pin')}<span>${esc(contact.location)}</span></li>` : '';
  const body = `${pageHead('Contact Us', "Let's Talk About Your Business Growth.", "Tell us about your business and what you want to achieve. We'll help you find the right digital solutions.")}
<section class="section tight"><div class="container contact-grid">
  <form id="enquiry-form" class="card form" novalidate>
    <div class="fgrid">
      <div class="field"><label for="f-name">Full Name <span class="req">*</span></label><input id="f-name" name="name" type="text" autocomplete="name" required /><small class="err" data-for="name"></small></div>
      <div class="field"><label for="f-biz">Business Name</label><input id="f-biz" name="business" type="text" autocomplete="organization" /></div>
      <div class="field"><label for="f-email">Email Address <span class="req">*</span></label><input id="f-email" name="email" type="email" autocomplete="email" required /><small class="err" data-for="email"></small></div>
      <div class="field"><label for="f-phone">Phone / WhatsApp Number <span class="req">*</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="e.g. +91 98765 43210" required /><small class="err" data-for="phone"></small></div>
      <div class="field"><label for="f-ind">Industry</label><select id="f-ind" name="industry"><option value="">Select industry</option>${industries.map((i) => `<option>${esc(i)}</option>`).join('')}</select></div>
      <div class="field"><label for="f-budget">Estimated Budget</label><select id="f-budget" name="budget"><option value="">Select budget</option>${budgetOptions.map((i) => `<option>${esc(i)}</option>`).join('')}</select></div>
    </div>
    <fieldset class="field"><legend>Services Required <span class="req">*</span> <span class="hint">(select all that apply)</span></legend>
      <div class="checks">${serviceOptions.map((s, i) => `<label class="check"><input type="checkbox" name="services" value="${esc(s)}" /><span>${esc(s)}</span></label>`).join('')}</div><small class="err" data-for="services"></small></fieldset>
    <div class="field"><label for="f-details">Project Details <span class="req">*</span></label><textarea id="f-details" name="details" rows="5" required placeholder="What would you like to achieve?"></textarea><small class="err" data-for="details"></small></div>
    <div class="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off" /></label></div>
    <div class="form-actions"><button class="btn btn-gold btn-lg" type="submit" id="submit-btn">Get My Free Consultation</button>
      <a class="btn btn-wa btn-lg" id="wa-from-form" href="${waLink()}" target="_blank" rel="noopener">${WA_SVG} Discuss on WhatsApp</a></div>
    <div id="form-status" class="form-status" role="status" aria-live="polite" tabindex="-1"></div>
    <p class="fine">By submitting, you agree to be contacted about your enquiry. See our <a href="/privacy-policy/">Privacy Policy</a>.</p>
  </form>
  <aside class="side">
    <div class="card"><h2>Prefer to chat?</h2><p>Message us directly on WhatsApp with your requirements.</p>
      <a class="btn btn-wa btn-block" href="${waLink()}" target="_blank" rel="noopener">${WA_SVG} Chat on WhatsApp</a></div>
    <div class="card"><h2>Contact details</h2><ul class="foot-contact">${telHref() ? `<li>${icon('phone')}<a href="${telHref()}">${phoneText()}</a></li>` : ''}${email}${loc}
      <li>${icon('chat')}<a href="${waLink()}" target="_blank" rel="noopener">WhatsApp</a></li>
      ${isSet(contact.instagram) ? `<li>${icon('insta')}<a href="${esc(contact.instagram)}" target="_blank" rel="noopener">Instagram</a></li>` : ''}
      ${isSet(contact.linkedin) ? `<li>${icon('linkedin')}<a href="${esc(contact.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></li>` : ''}
      ${isSet(contact.facebook) ? `<li>${icon('facebook')}<a href="${esc(contact.facebook)}" target="_blank" rel="noopener">Facebook</a></li>` : ''}
    </ul>${!isSet(contact.email) && !isSet(contact.location) ? '<p class="fine">More contact details coming soon.</p>' : ''}</div>
    <div class="card"><h2>What happens next?</h2><ol class="mini-steps"><li>We review your requirements.</li><li>We reply with suggestions and a clear scope.</li><li>You approve deliverables and pricing before we start.</li></ol></div>
  </aside>
</div></section>`;
  return layout({ path: '/contact/', title: 'Contact Us in Udaipur: Free Consultation', description: 'Call, WhatsApp or email Revenza One in Udaipur. Request a free consultation for website development, social media, Google Business Profile, ads and automation.', body });
}

function legalPage(kind) {
  const privacy = kind === 'privacy';
  const em = isSet(contact.email) ? esc(contact.email) : 'the email address listed on our Contact page';
  const sections = privacy ? [
    ['Who we are', 'Revenza One ("we", "us") is a digital marketing agency. This policy explains how we handle information you give us through this website.'],
    ['Information we collect', 'When you submit our enquiry form we collect your name, business name, email address, phone or WhatsApp number, industry, services required, budget range and the project details you write. If you contact us on WhatsApp, WhatsApp processes your messages under its own policy.'],
    ['How we use it', 'We use your information only to respond to your enquiry, prepare quotations, deliver agreed services and keep reasonable business records. We do not sell your personal information.'],
    ['Who we share it with', 'We use trusted service providers (such as email delivery, hosting and analytics providers) strictly to operate this website and respond to you. We may disclose information if required by law.'],
    ['Cookies and analytics', 'This website may use cookies or similar technologies for basic analytics. If analytics or advertising pixels are enabled, we will describe them here and, where required, ask for consent.'],
    ['Retention and your rights', `We keep enquiry information only as long as needed for the purposes above. You may ask us to access, correct or delete your information by contacting ${em}.`],
    ['Security', 'We take reasonable steps to protect submitted information, but no method of transmission over the internet is completely secure.'],
    ['Changes', 'We may update this policy from time to time. The latest version will always be on this page.'],
  ] : [
    ['About these terms', 'By using this website you agree to these terms. Services we provide are governed by the written quotation or agreement we agree with you for each project.'],
    ['Indicative pricing', 'Prices on this website are indicative, in Indian Rupees (₹), and exclude applicable taxes. Final quotations depend on project scope and are confirmed in writing before work begins.'],
    ['One-time and monthly services', 'One-time projects and monthly subscriptions are billed separately. Monthly services continue until cancelled in line with the agreed notice terms.'],
    ['Third-party costs', 'Advertising budgets, domain registration, hosting, printing, software, API and messaging charges are paid separately by the client unless stated otherwise.'],
    ['Deliverables and revisions', 'Deliverables, timelines and revision limits are agreed before a project starts. Additional work outside the agreed scope may be quoted separately.'],
    ['No guarantee of results', 'Digital marketing outcomes depend on many factors outside our control. We do not guarantee Google rankings, followers, leads, sales or advertising results.'],
    ['AI-generated content', 'Some deliverables are produced with AI tools. AI-generated advertising content is identified as such where required and is not presented as a genuine customer testimonial.'],
    ['Client materials', 'You confirm you have the right to use any logos, images, text and other materials you provide to us.'],
    ['Limitation of liability', 'To the extent permitted by law, our liability is limited to the fees paid for the specific service giving rise to the claim.'],
    ['Contact', `Questions about these terms can be sent to ${em}.`],
  ];
  const title = privacy ? 'Privacy Policy' : 'Terms & Conditions';
  const body = `${pageHead('Legal', esc(title), `Last updated: ${site.year}`)}
<section class="section tight"><div class="container narrow prose legal">
${sections.map(([h, p]) => `<h2>${esc(h)}</h2><p>${esc(p)}</p>`).join('')}
</div></section>`;
  return layout({ path: privacy ? '/privacy-policy/' : '/terms-and-conditions/', title, description: privacy ? 'How Revenza One collects, uses and protects information submitted through its website.' : 'Terms and conditions for using the Revenza One website and engaging our digital marketing services.', body });
}

function notFound() {
  return layout({ path: '/404.html', title: 'Page not found', description: 'The page you are looking for could not be found.', noindex: true, body: `${pageHead('404', 'Page not found', 'The page you are looking for does not exist or has moved.')}<section class="section tight"><div class="container narrow"><a class="btn btn-gold" href="/">Back to Home</a></div></section>` });
}

// ---------- output ----------
function write(rel, content) {
  const full = join(DIST, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
}

if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(ROOT, 'assets'), join(DIST, 'assets'), { recursive: true });
// Bing Webmaster Tools site verification; must stay at the site root.
cpSync(join(ROOT, 'BingSiteAuth.xml'), join(DIST, 'BingSiteAuth.xml'));

write('index.html', homePage());
write('about/index.html', aboutPage());
write('services/index.html', servicesPage());
write('pricing/index.html', pricingPage());
write('portfolio/index.html', portfolioPage());
write('contact/index.html', contactPage());
if (cityPath) write(cityPath.slice(1) + 'index.html', cityPage());
write('privacy-policy/index.html', legalPage('privacy'));
write('terms-and-conditions/index.html', legalPage('terms'));
write('404.html', notFound());

const today = new Date().toISOString().slice(0, 10);
const urls = ['/', '/about/', '/services/', '/pricing/', '/portfolio/', '/contact/', ...(cityPath ? [cityPath] : []), '/privacy-policy/', '/terms-and-conditions/'];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${abs(u)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${abs('/sitemap.xml')}\n`);
// llms.txt (llmstxt.org): a plain summary for AI assistants, generated from the same content as the pages.
write('llms.txt', [
  `# ${site.shortName}`,
  '',
  `> ${site.shortName} is a digital growth agency in India for local businesses and growing brands: websites, Google Business Profile, social media, AI UGC video ads, branding and WhatsApp automation. All prices are indicative, in Indian Rupees.`,
  '',
  '## Services',
  ...services.map((s) => `- [${s.title}](${abs('/services/')}#${s.id}): ${s.short}`),
  '',
  '## Pricing',
  ...pricing.groups.map((g) => `- [${g.title}](${abs('/pricing/')}#${g.id}): ${g.items.map((i) => `${i.name} ${i.price}${i.billing === 'Monthly' ? '/month' : ''}`).join('; ')}`),
  ...pricing.terms.map((t) => `- ${t}`),
  '',
  '## Pages',
  `- [Portfolio](${abs('/portfolio/')}): client websites, flyer designs and an AI-generated sample video`,
  `- [About](${abs('/about/')})`,
  `- [Contact](${abs('/contact/')}): enquiry form and WhatsApp${digits(contact.whatsapp) ? ` (+${digits(contact.whatsapp)})` : ''}`,
  '',
  '## Optional',
  `- [Privacy Policy](${abs('/privacy-policy/')})`,
  `- [Terms & Conditions](${abs('/terms-and-conditions/')})`,
  '',
].join('\n'));
// Cloudflare Pages response headers (Vercel uses vercel.json instead).
write('_headers', `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN

/assets/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
`);

const missing = Object.entries(contact).filter(([k, v]) => k !== 'whatsappMessage' && !isSet(v)).map(([k]) => k);
console.log(`Built ${urls.length + 1} pages to dist/`);
if (!process.env.SITE_URL) console.warn(`! SITE_URL not set. Using ${site.siteUrl} for canonical URLs and sitemap. Set it to your real domain.`);
if (missing.length) console.warn(`! Contact placeholders not filled in site.config.mjs: ${missing.join(', ')}`);
