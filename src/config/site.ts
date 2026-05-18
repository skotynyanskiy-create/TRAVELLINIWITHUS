export const SITE_URL = 'https://travelliniwithus.it';

/** Browser theme-color (<meta name="theme-color">). Hex literal required by spec;
 *  mantiene il sand caldo legacy per coerenza brand nella chrome del browser. */
export const THEME_COLOR = '#f7f0e5';

export const CONTACTS = {
  email: 'info@travelliniwithus.it',
  mailto: 'mailto:info@travelliniwithus.it',
  whatsappDisplay: '+39 342 168 1411',
  whatsappUrl: 'https://wa.me/393421681411',
  instagramHandle: '@travelliniwithus',
  instagramUrl: 'https://www.instagram.com/travelliniwithus/',
  tiktokHandle: '@travellini.withus',
  tiktokUrl: 'https://www.tiktok.com/@travellini.withus',
  facebookHandle: 'Travellini With Us',
  facebookUrl: 'https://www.facebook.com/travelwithuss/',
} as const;

export const BRAND_STATS = {
  instagramFollowers: '167K+',
  tiktokFollowers: '90K+',
  engagementRate: '6.5%',
  monthlyReach: '500K+',
  postsPublished: '800+',
  destinationsExplored: '150+',
  yearsOfTravel: '8',
  totalFollowers: '250K+',
} as const;

/** Live counter newsletter (demo: aggiornare manualmente o connettere a Brevo API). */
export const NEWSLETTER_RECENT_SIGNUPS = 184;

/** Soglia minima sotto cui il counter pubblico non viene mostrato — evita
 *  l'anti-conversion "0 lettori iscritti negli ultimi 30 giorni" quando la
 *  lista e' giovane. Sopra soglia mostra il numero reale come trust signal. */
export const NEWSLETTER_COUNTER_MIN_VISIBLE = 50;

/** Aggiornare url con lo shortcode del reel più recente pubblicato su Instagram.
 *  Nessuna API key necessaria: quando `url` punta a /reel/... l'embed
 *  Instagram subentra automaticamente. Fino ad allora usiamo un asset locale
 *  controllato, non hotlink demo.
 */
export const FEATURED_REEL = {
  url: '', // vuoto = fallback su thumbnail + caption sotto
  thumbnail: '/images/brand/couple-travel.webp',
  caption: 'Il lato più immediato del progetto: luoghi, prove sul campo e scelte senza rumore.',
} as const;

export const SOCIAL_COLORS = {
  whatsapp: '#25D366',
  instagram: '#E1306C',
  tiktok: '#000000',
  facebook: '#1877F2',
} as const;
