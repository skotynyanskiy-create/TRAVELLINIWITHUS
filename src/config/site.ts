export const SITE_URL = 'https://travelliniwithus.it';

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

/** Aggiornare url con lo shortcode del reel più recente pubblicato su Instagram.
 *  Nessuna API key necessaria — aggiornamento manuale dopo ogni nuovo reel.
 *  Esempio: url: 'https://www.instagram.com/reel/ABC123XYZ/'
 */
export const FEATURED_REEL = {
  url: '', // lasciare vuoto → mostra hero-adventure.jpg come fallback
  thumbnail: '',
  caption: 'Ultimo reel',
} as const;

export const SOCIAL_COLORS = {
  whatsapp: '#25D366',
  instagram: '#E1306C',
  tiktok: '#000000',
  facebook: '#1877F2',
} as const;
