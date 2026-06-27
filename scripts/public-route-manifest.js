export const PUBLIC_ROUTE_MANIFEST = [
  { path: '/', sitemap: true, role: 'home' },
  { path: '/esplora', sitemap: true, role: 'discovery' },
  { path: '/strumenti', sitemap: true, role: 'tools' },
  { path: '/press', sitemap: true, role: 'press' },
  { path: '/mappa', sitemap: true, role: 'map' },
  { path: '/chi-siamo', sitemap: true, role: 'brand' },
  { path: '/collaborazioni', sitemap: true, role: 'b2b-sales' },
  { path: '/media-kit', sitemap: true, role: 'b2b-lead' },
  { path: '/contatti', sitemap: true, role: 'contact' },
  { path: '/risorse', sitemap: true, role: 'resources' },
  { path: '/club', sitemap: true, role: 'waitlist' },
  { path: '/privacy', sitemap: true, role: 'legal' },
  { path: '/cookie', sitemap: true, role: 'legal' },
  { path: '/termini', sitemap: true, role: 'legal' },
  { path: '/disclaimer', sitemap: true, role: 'legal' },

  // No sitemap finche' restano noindex, private, oppure basate solo su
  // contenuti in lavorazione. Le route possono esistere, ma non vanno
  // pubblicizzate ai crawler.
  { path: '/itinerari', sitemap: false, role: 'work-in-progress' },
  { path: '/itinerari/compare', sitemap: false, role: 'utility-noindex' },
  { path: '/shop', sitemap: false, role: 'preorder-waitlist' },
  { path: '/lead-magnet', sitemap: false, role: 'post-submit' },
  { path: '/preferiti', sitemap: false, role: 'personal-area' },
  { path: '/account/acquisti', sitemap: false, role: 'private' },
];
