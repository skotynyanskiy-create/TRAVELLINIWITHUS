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

export const BIO_LINKS = {
  instagram: `${SITE_URL}/guida-in-regalo?utm_source=ig_bio&utm_medium=social&utm_campaign=lead_magnet`,
  tiktok: `${SITE_URL}/guida-in-regalo?utm_source=tt_bio&utm_medium=social&utm_campaign=lead_magnet`,
} as const;

// Numeri allineati al profilo IG live (snapshot 2026-05-29).
// IG verificato (badge Meta), iscritti elenco influencer AGCOM (Italia).
export const BRAND_STATS = {
  instagramFollowers: '172K',
  tiktokFollowers: '90K+',
  engagementRate: '6.5%',
  monthlyReach: '500K+',
  postsPublished: '1.272',
  destinationsExplored: '150+',
  yearsOfTravel: '8',
  totalFollowers: '260K+',
} as const;

export const BRAND_STATS_SOURCE = {
  label: 'Snapshot pubblico IG (nascita del brand 2018; Family sub-brand separato)',
  observedAt: '2026-07-23',
  nextVerification: 'Aggiornare con export Meta Business Suite e TikTok Analytics',
} as const;

/** Credibility signals dichiarabili: AGCOM (autorita' garanzia comunicazioni
 *  italiana) e verifica Meta (badge blu IG). Sono asset reali utilizzati nella
 *  bio IG live — vanno valorizzati come trust signal sul sito. */
export const BRAND_CREDENTIALS = {
  agcomRegistered: true,
  metaVerified: true,
  agcomLabel: 'Iscritti elenco AGCOM',
  metaVerifiedLabel: 'Profilo Instagram verificato',
  disclosurePolicyLabel: 'Disclosure pubblicitaria sempre dichiarata',
} as const;

export const PUBLIC_PROOF_SIGNALS = [
  {
    title: 'Emilia-Fantastica / Castelli del Ducato',
    label: 'Progetto territoriale',
    description:
      'Travellini with Us citati tra i creator coinvolti nel progetto di promozione territoriale tra Piacenza, borghi e Castelli del Ducato.',
    url: 'https://www.castellidelducato.it/castellidelducato/notizia.asp?el=emilia-fantastica-5-influencer-in-arrivo-tra-castelli-ducato-citta-d-arte-borghi',
  },
  {
    title: 'Storie in Viaggio a Piacenza',
    label: 'Menzione partner',
    description:
      'Castelli del Ducato descrive il loro racconto come dinamico, curato nei dettagli e capace di coinvolgere la community.',
    url: 'https://www.castellidelducato.it/castellidelducato/notizia.asp?el=travellini-with-us-a-piacenza-per-storie-in-viaggio-castelli-ducato',
  },
  {
    title: 'Menzioni editoriali da post Instagram',
    label: 'Earned media',
    description:
      'Articoli terzi riprendono contenuti Instagram di Rodrigo & Betta su luoghi particolari, eventi e locali scenografici.',
    url: 'https://tuttonotizie.eu/2025/04/15/il-giardino-piu-romantico-del-nord-italia-passeggiate-da-sogno-e-un-acquario-segreto/',
  },
] as const;

/** Counter pubblico disattivato finche la lista non e' verificata da Brevo/Firestore. */
export const NEWSLETTER_RECENT_SIGNUPS = 0;

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
  thumbnail: '/images/reels/reel-1-cover.webp',
  caption: 'Il lato più immediato del progetto: luoghi, prove sul campo e scelte senza rumore.',
} as const;

export const SOCIAL_COLORS = {
  whatsapp: '#25D366',
  instagram: '#E1306C',
  tiktok: '#000000',
  facebook: '#1877F2',
} as const;
