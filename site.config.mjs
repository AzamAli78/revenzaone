// =============================================================================
// REVENZA ONE — central content & pricing configuration.
// Edit this file to update contact details, services, prices, packages and
// portfolio projects. Then run `npm run build`.
// Any value that still starts with "[INSERT" is treated as "not set yet" and
// is hidden from the public pages automatically.
// =============================================================================

export const site = {
  name: 'REVENZA ONE',
  shortName: 'Revenza One',
  descriptor: 'Digital Growth Agency',
  tagline: 'Build Your Presence. Attract More Customers. Grow Smarter.',
  // Override at build time with the SITE_URL env var. Replace with your real domain.
  siteUrl: process.env.SITE_URL || 'https://revenzaone.site',
  locale: 'en_IN',
  // Optional: set to e.g. 'Jaipur' later to add location-specific SEO copy & schema.
  seoLocation: '',
  currency: '₹',
  year: 2026,
};

export const contact = {
  email: '[INSERT BUSINESS EMAIL]',
  whatsapp: '918302590117', // digits with country code, e.g. 919876543210
  location: '[INSERT BUSINESS LOCATION]',
  instagram: '[INSERT INSTAGRAM URL]',
  linkedin: '[INSERT LINKEDIN URL]',
  facebook: '[INSERT FACEBOOK URL]',
  whatsappMessage:
    "Hi Revenza One! I'm interested in your digital marketing services. I'd like to discuss my business requirements.",
};

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Services', href: '/services/' },
  { label: 'Pricing', href: '/pricing/' },
  { label: 'Portfolio', href: '/portfolio/' },
  { label: 'Contact', href: '/contact/' },
];

export const home = {
  heroTitle: 'Your Business Deserves More Than Just an Online Presence.',
  heroText:
    'We combine creative marketing, AI-powered content and smart digital solutions to help your business get noticed, attract customers and grow.',
  heroTrust: 'Creative Thinking. Smart Technology. Business Growth.',
  introTitle: 'Everything Your Business Needs to Grow Digitally.',
  introText:
    'From building your website and optimizing your Google Business Profile to creating engaging advertisements and automating customer enquiries, Revenza One brings everything together under one roof.',
  highlights: [
    { icon: 'globe', title: 'Build Your Digital Presence', text: 'Websites and Google Business Profiles that make you easy to find and easy to trust.' },
    { icon: 'pen', title: 'Create Powerful Brand Experiences', text: 'Logos, creatives and AI-assisted video that give your brand a consistent, memorable look.' },
    { icon: 'target', title: 'Reach the Right Audience', text: 'Social media, Google Business Profile and AI-powered content aimed at the customers you actually want.' },
    { icon: 'chat', title: 'Convert Attention into Enquiries', text: 'WhatsApp flows, lead capture and follow-ups so no enquiry slips through the cracks.' },
  ],
  pillars: [
    { word: 'We Create', text: 'Websites, branding, flyers, videos and digital experiences.' },
    { word: 'We Market', text: 'Social media, Google Business Profile and AI-powered content.' },
    { word: 'We Automate', text: 'WhatsApp workflows, AI chatbots and lead management.' },
  ],
  why: [
    { title: 'All-in-One Digital Solutions', text: 'From websites and branding to advertisements and automation, manage your digital requirements under one roof.' },
    { title: 'AI-Powered Creativity', text: 'We combine modern AI tools with creative strategy to produce engaging content and promotional videos.' },
    { title: 'Affordable Business Solutions', text: 'Professional digital services designed with local businesses and growing brands in mind.' },
    { title: 'Customized Strategies', text: 'Every business is different. We tailor our solutions according to individual business goals and requirements.' },
    { title: 'Transparent Communication', text: 'Clear deliverables, transparent pricing and regular performance updates.' },
    { title: 'Growth-Focused Approach', text: 'Our focus is on improving digital visibility, generating enquiries and building stronger customer relationships.' },
  ],
  process: [
    { title: 'Discover', text: 'We understand your business, audience, objectives and current digital presence.' },
    { title: 'Strategize', text: 'We create a customized digital strategy based on your requirements.' },
    { title: 'Create & Launch', text: 'Our team develops your digital assets, campaigns, websites and creative content.' },
    { title: 'Optimize & Grow', text: 'We monitor performance, evaluate results and identify opportunities for improvement.' },
  ],
};

export const services = [
  {
    id: 'website',
    icon: 'globe',
    visual: 'website',
    title: 'Website & Digital Presence',
    short: 'Websites, landing pages, Google Business Profile that make your business easy to find.',
    list: ['Custom Website Development', 'Business Websites', 'Landing Pages', 'E-commerce Websites', 'Google Business Profile Setup', 'Google Business Profile Optimization', 'Google Business Profile Management', 'Website Maintenance'],
    detail: 'Your website and Google listing are often the first thing a customer sees. We build fast, mobile-friendly sites with click-to-call and WhatsApp enquiry buttons, and set up your Google Business Profile so nearby customers can find you.',
  },
  {
    id: 'social',
    icon: 'share',
    visual: 'social',
    title: 'Social Media Marketing',
    short: 'Strategy, creatives, reels and community management for Instagram and Facebook.',
    list: ['Instagram Management', 'Facebook Management', 'Social Media Strategy', 'Content Calendar', 'Post and Carousel Designing', 'Instagram Reels', 'Content Scheduling', 'Community Management', 'Social Media Reporting'],
    detail: 'A steady, on-brand presence on social platforms. We plan the content, design it, schedule it and report on it, so you stay active without it taking over your week.',
  },
  {
    id: 'ai-studio',
    icon: 'sparkles',
    visual: 'ugc',
    title: 'AI Creative Studio',
    short: 'AI UGC-style video ads, spokesperson videos and product visuals for modern short-form marketing.',
    list: ['AI UGC Video Advertisements', 'AI Spokesperson Videos', 'AI Product Videos', 'Promotional Video Advertisements', 'AI-Assisted Product Visuals', 'Short-Form Video Content', 'Festival Promotional Creatives'],
    detail: 'We combine AI tools with real creative direction: concept, script, voiceover, editing and a clear call-to-action. AI-generated content is labelled as such, and is never presented as a genuine customer testimonial.',
  },
  {
    id: 'branding',
    icon: 'pen',
    visual: 'brand',
    title: 'Branding & Creative Design',
    short: 'Logos, brand kits, flyers, festival creatives, menus and catalogues, ready for print and digital.',
    list: ['Logo Design', 'Brand Identity', 'Promotional Flyers', 'Festival Creatives', 'Posters and Banners', 'Visiting Cards', 'Menu Design', 'Brochures', 'Product Catalogues', 'Social Media Creative Packs'],
    detail: 'Consistent, professional design across everything your customers see. Print-ready files are supplied for print jobs; printing itself is billed separately.',
  },
  {
    id: 'automation',
    icon: 'zap',
    visual: 'chat',
    title: 'Business Automation & Growth',
    short: 'WhatsApp Business, automated replies, chatbots, CRM and follow-ups that capture every lead.',
    list: ['WhatsApp Business Setup', 'WhatsApp Automation', 'Automated Customer Responses', 'AI Chatbots', 'Lead Management Automation', 'CRM Setup', 'Appointment Booking Automation', 'Automated Follow-ups'],
    detail: 'Reply faster, organise your leads and follow up automatically. Third-party software, API and messaging charges (for example WhatsApp Business API fees) are extra where applicable.',
  },
];

const OT = 'One-time';
const MO = 'Monthly';

export const pricing = {
  disclaimer:
    'All prices are indicative, in Indian Rupees (₹), and exclude applicable taxes. Final quotations depend on project scope. Deliverables, revision limits and timelines are agreed in writing before any work starts.',
  groups: [
    {
      id: 'gbp', title: 'Google Business Profile',
      note: 'We improve how completely and accurately your profile is presented. We do not and cannot guarantee Google rankings.',
      items: [
        { name: 'GBP Setup & Verification Assistance', includes: ['Profile creation or claiming', 'Business category', 'Address and opening hours', 'Basic business information'], price: '₹3,000–5,000', billing: OT },
        { name: 'GBP Full Optimization', includes: ['Business description', 'Services and products', 'Photos', 'Q&A', 'Booking or WhatsApp integration', 'Tracking links'], price: '₹5,000–8,000', billing: OT },
        { name: 'GBP Monthly Management', includes: ['Four posts per month', 'Photo updates', 'Review response management', 'Monthly reporting'], price: '₹3,000–6,000', billing: MO },
      ],
    },
    {
      id: 'websites', title: 'Website Development',
      note: 'Domain registration and hosting are charged at actual third-party cost, separately from our fees.',
      items: [
        { name: 'One-Page Business Website', includes: ['Mobile-friendly design', 'WhatsApp enquiry button', 'Click-to-call functionality', 'Google Maps integration'], price: '₹6,000–12,000', billing: OT },
        { name: 'Professional 3–5 Page Website', includes: ['Home, About, Services, Gallery and Contact pages', 'WhatsApp and call integration'], price: '₹12,000–25,000', billing: OT },
        { name: 'Website Maintenance: Basic', includes: ['Minor updates', 'Backups', 'Security checks'], price: '₹999', billing: MO },
        { name: 'Website Maintenance: Standard', includes: ['Website updates', 'Backups', 'Content changes', 'Technical support'], price: '₹1,999', billing: MO },
        { name: 'Website Maintenance: Premium', includes: ['Everything in Standard', 'Additional content updates', 'Performance monitoring', 'Monthly website report'], price: '₹2,999', billing: MO },
        { name: 'Domain & Hosting Handling', includes: ['Domain purchasing assistance', 'Hosting setup', 'Annual renewal management'], price: '₹2,000–4,000', billing: 'Yearly', extra: 'Handling fee, where applicable. Domain and hosting charges are extra.' },
      ],
    },
    {
      id: 'design', title: 'Branding & Creative Design',
      note: 'Printing is not included. Print-ready files are supplied.',
      items: [
        { name: 'Single Promotional Flyer / Poster', includes: ['One custom flyer or poster design'], price: '₹500–1,500', billing: OT },
        { name: 'Festival & Offer Creative Pack', includes: ['15 promotional creatives'], price: '₹2,500–4,000', billing: OT },
        { name: 'Logo & Mini Brand Kit', includes: ['Logo', 'Brand colours', 'Typography', 'Canva templates'], price: '₹3,000–8,000', billing: OT },
        { name: 'Visiting Card / Menu / Catalogue Design', includes: ['Print-ready design'], price: '₹800–2,500', billing: OT, extra: 'Printing not included.' },
      ],
    },
    {
      id: 'social', title: 'Social Media Management',
      note: 'These plans cover content creation, publishing and community management. Paid advertising is not included.',
      items: [
        { name: 'Starter Plan', includes: ['Instagram and Facebook', '12 posts per month', 'No reels'], price: '₹5,000–8,000', billing: MO },
        { name: 'Standard Plan', includes: ['12 posts per month', 'Four reels per month', 'Comment management', 'Monthly performance report'], price: '₹10,000–15,000', billing: MO },
        { name: 'Reels Only', includes: ['Four short-form videos per month'], price: '₹4,000–8,000', billing: MO },
      ],
    },
    {
      id: 'ugc', title: 'AI UGC Video Advertisements',
      note: 'Duration and deliverables are confirmed before we quote. AI-generated ads are labelled as AI-generated and are never presented as genuine customer testimonials.',
      items: [
        { name: 'Single AI UGC Video', includes: ['Creative concept', 'Scriptwriting', 'AI presenter or UGC-style presentation', 'Voiceover', 'Video editing', 'Call-to-action'], price: '₹1,999–3,999', billing: 'Per video' },
        { name: 'Seven-Video Bundle', includes: ['Seven videos, each with the same inclusions', 'Better value than seven single videos'], price: '₹9,999–23,999', billing: OT, extra: 'Bundle of seven.' },
      ],
    },
    {
      id: 'automation', title: 'WhatsApp & Business Automation',
      note: 'Third-party API, software and messaging charges are extra wherever applicable.',
      items: [
        { name: 'WhatsApp Business Setup', includes: ['Business profile', 'Catalogue', 'Greeting messages', 'Quick replies'], price: '₹1,499', billing: OT },
        { name: 'WhatsApp Automation', includes: ['Automated enquiry responses', 'Enquiry routing', 'Basic automated workflows'], price: '₹4,999–9,999', billing: OT },
        { name: 'Lead Management Setup', includes: ['Lead capture', 'Customer information organization', 'Basic workflow automation'], price: '₹3,999–7,999', billing: OT },
        { name: 'AI Chatbots & Advanced Automation', includes: ['Scoped around your requirements'], price: 'Custom quotation', billing: 'Custom' },
      ],
    },
  ],
  bundles: [
    {
      name: 'Starter Combo', price: '₹10,000–15,000', billing: 'One-time',
      includes: ['Google Business Profile setup and verification assistance', 'One-page business website', 'Three promotional flyers'],
      best: 'New businesses looking to establish their online presence.',
      cta: 'Get Started', service: 'Starter Combo', featured: false,
    },
    {
      name: 'Local Growth Plan', price: '₹5,000–12,000', billing: 'Monthly',
      includes: ['Monthly Google Business Profile management', 'Eight to twelve social media posts or reels', 'WhatsApp support for edits and enquiries', 'Monthly performance report'],
      best: 'Local businesses that want to maintain an active digital presence.',
      cta: 'Choose Growth Plan', service: 'Local Growth Plan', featured: true,
    },
    {
      name: 'Custom Growth Solution', price: 'Custom pricing', billing: 'Scoped to you',
      includes: ['Website development', 'Social media management', 'AI UGC videos', 'Branding and creative design', 'WhatsApp automation'],
      best: 'Growing brands requiring a broader digital marketing strategy. We combine only what you need.',
      cta: 'Request Custom Quote', service: 'Custom Growth Solution', featured: false,
    },
  ],
  terms: [
    'Prices are indicative and final quotations depend on project scope.',
    'One-time projects and monthly services are billed separately and are never combined into one charge.',
    'Domain, hosting and printing costs are additional wherever applicable.',
    'Revision limits and deliverables are agreed before a project starts.',
    'We never guarantee Google rankings, followers, leads, sales or advertising results.',
    'AI-generated advertising content is identified as such where required.',
  ],
};

// -----------------------------------------------------------------------------
// PORTFOLIO — add a new object to this array to add a project.
// kind: 'Concept' (demonstration/concept work) or 'Client' (real, approved work).
// Do not mark something as 'Client' unless it really is client work you may show.
// visual: website | social | ugc | flyer | brand | campaign
// image: optional path like '/assets/img/portfolio/my-project.jpg' to replace the
//        generated mockup with a real screenshot.
// -----------------------------------------------------------------------------
export const portfolioCategories = [
  { id: 'website', label: 'Website Development' },
  { id: 'ugc', label: 'AI UGC Advertisements' },
  { id: 'social', label: 'Social Media Creatives' },
  { id: 'flyer', label: 'Flyer & Poster Design' },
  { id: 'brand', label: 'Brand Identity' },
];

export const portfolio = [
  { id: 'neekita', category: 'website', kind: 'Client', wide: true, ratio: '1440 / 740', url: 'https://neekita.netlify.app/', image: '/assets/img/portfolio/neekita-creator-website.webp', alt: 'Homepage of the Talks With Neekita creator website with the headline A little chaos. A lot of laughs. and a portrait of the creator on a beach', title: 'Talks With Neekita: Creator Website', description: 'A bold, personality-led portfolio website for a comedy and lifestyle content creator, with a reels section, photo gallery, brand collaboration area and contact links.', details: ['Creator profile and story', 'Reels and Instagram links', 'Photo gallery', 'Brand collaboration and contact sections'] },
  { id: 'bright-future', category: 'website', kind: 'Client', wide: true, url: 'https://brightfuturetuitionpoint.vercel.app/', image: '/assets/img/portfolio/bright-future-tuition-website.webp', alt: 'Homepage of the Bright Future Tuition Point website showing the centre name, tagline, founder photo and a Join Today button', title: 'Bright Future Tuition Point: Website', description: 'A clean, mobile-friendly website for a tuition centre in Udaipur, covering classes offered, subjects, about the founder, location and contact with a call and enquiry button.', details: ['Classes and subjects sections', 'Click-to-call and Join Today buttons', 'Location and contact section', 'Mobile-friendly layout'] },
  { id: 'cafe-site', category: 'website', kind: 'Concept', visual: 'website', hue: 38, title: 'Neighbourhood Café Website', description: 'A one-page website concept with menu highlights, Google Maps, click-to-call and a WhatsApp ordering button.', details: ['One-page layout', 'Menu section', 'WhatsApp and call buttons', 'Google Maps embed'] },
  { id: 'clinic-site', category: 'website', kind: 'Concept', visual: 'website', hue: 190, title: 'Local Clinic Website', description: 'A five-page website concept: services, doctor profile, gallery, enquiry form and appointment button.', details: ['5-page structure', 'Appointment enquiry', 'Mobile-first layout'] },
  { id: 'ai-ugc-sample', category: 'ugc', kind: 'Sample', video: '/assets/video/ai-ugc-sample.mp4', image: '/assets/video/ai-ugc-sample-poster.jpg', alt: 'Still from an AI-generated UGC-style video ad showing a presenter at a cafe table with a packaged chocolate biscuit product', title: 'AI UGC-Style Product Video', description: 'A vertical, short-form UGC-style video ad for a packaged food product, with an AI presenter, natural cafe setting and voiceover. AI-generated sample content.', details: ['9:16 vertical for Reels and Shorts', 'AI presenter and voiceover', 'Product-in-hand framing'] },
  { id: 'salon-social', category: 'social', kind: 'Concept', visual: 'social', hue: 320, title: 'Salon Instagram Content Pack', description: 'A month-view social content concept: offer posts, carousels and reel covers in one consistent style.', details: ['Posts and carousels', 'Reel covers', 'Consistent grid'] },
  { id: 'festival-pack', category: 'social', kind: 'Concept', visual: 'social', hue: 28, title: 'Festival Offer Creative Pack', description: 'A festive creative pack concept for retail businesses, sized for Instagram, Facebook and WhatsApp status.', details: ['Multi-size exports', 'Editable Canva files'] },
  { id: 'sandy-sandwich', category: 'flyer', kind: 'Client', image: '/assets/img/portfolio/sandy-sandwich-flyer.webp', alt: 'Promotional flyer for Sandy Sandwich showing a grilled sandwich, momos and a cold drink with address and delivery number', title: 'Sandy Sandwich: Promotional Flyer', description: 'A bold, appetising flyer for a local sandwich cafe, combining the storefront, hero food photography, menu icons and a clear call-to-action.', details: ['Social media and print-ready format', 'Menu icons and offer strip', 'Address and phone call-to-action'] },
  { id: 'fitness-empire', category: 'flyer', kind: 'Client', image: '/assets/img/portfolio/fitness-empire-flyer.webp', alt: 'Promotional flyer for Fitness Empire gym with equipment photo, services icons, address and phone number', title: 'Fitness Empire: Gym Promotion Flyer', description: 'A high-energy flyer for a local gym with a strong headline, real facility photography, service icons and contact details.', details: ['Headline and tagline', 'Services icon row', 'Location, phone and opening hours'] },
  { id: 'is-organic-soap', category: 'flyer', kind: 'Client', image: '/assets/img/portfolio/is-organic-lemon-soap.webp', alt: 'Product creative for Is Organic Lemon Soap with rose-shaped soaps, lemon and leaves', title: 'Is Organic: Lemon Soap Creative', description: 'A fresh, nature-led product creative for an organic soap brand, with benefit icons and trust badges.', details: ['Product hero visual', 'Benefit icons and trust badges', 'Brand tagline'] },
  { id: 'pulse-fitness', category: 'flyer', kind: 'Concept', image: '/assets/img/portfolio/pulse-fitness-flyer.webp', alt: 'Concept flyer for Pulse Fitness Studio with an athlete in a starting stance and the headline Train Smarter. Not Longer.', title: 'Pulse Fitness Studio: Concept Flyer', description: 'A concept flyer showing a bold, high-contrast direction for a fitness studio free-trial offer.', details: ['Concept design', 'High-contrast typography', 'Free-trial call-to-action'] },
  { id: 'brand-kit', category: 'brand', kind: 'Concept', visual: 'brand', hue: 45, title: 'Mini Brand Kit', description: 'A logo, colour palette and typography concept with starter templates for social media.', details: ['Logo', 'Colours and fonts', 'Canva templates'] },
];

export const about = {
  title: 'Creative Minds. Smart Technology. Better Business Growth.',
  body: [
    'At Revenza One, we believe every business deserves a strong digital presence.',
    'We are a creative and technology-driven digital marketing agency focused on helping local businesses, entrepreneurs and growing brands navigate the digital world.',
    'From building professional websites and creating attention-grabbing advertisements to optimizing online visibility and implementing smart automation, we bring practical digital solutions under one roof.',
    'Our mission is simple: make digital growth more accessible, effective and achievable for businesses of every size.',
  ],
  blocks: [
    { title: 'Our Mission', text: 'To make digital growth more accessible, effective and achievable for businesses of every size.' },
    { title: 'Our Vision', text: 'A future where every business, big or small, can be found online, look professional and turn attention into enquiries.' },
    { title: 'What We Believe', text: 'Good marketing is clear, honest and useful. We believe in transparent pricing, realistic promises and work you can actually measure.' },
    { title: 'Our Approach', text: 'We start with your goals, build only what you need, and review performance regularly so the next step is always based on evidence.' },
    { title: 'Why Revenza One Exists', text: 'Many growing businesses juggle separate vendors for design, ads, websites and follow-ups. Revenza One brings these together with creative thinking and smart technology.' },
  ],
};

export const industries = ['Restaurant / Café', 'Retail / Shop', 'Salon / Beauty / Wellness', 'Healthcare / Clinic', 'Education / Coaching', 'Real Estate', 'Fitness / Gym', 'Professional Services', 'E-commerce', 'Other'];

export const serviceOptions = ['Website Development', 'Google Business Profile', 'Social Media Management', 'AI UGC Video Ads', 'Flyer & Creative Designing', 'WhatsApp Automation', 'Branding', 'Other'];

export const budgetOptions = ['Under ₹5,000', '₹5,000 – ₹15,000', '₹15,000 – ₹30,000', '₹30,000 – ₹60,000', '₹60,000+', 'Not sure yet'];
