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
  yearsOfTravel: '10',
  totalFollowers: '250K+',
} as const;

export const BRAND_COPY = {
  aboutHeroAccent: `+ ${BRAND_STATS.yearsOfTravel} anni di viaggi`,
  signature:
    'Budget travel, food experience e posti che valgono davvero.',
  bio:
    `Siamo una coppia che viaggia insieme da ${BRAND_STATS.yearsOfTravel} anni. ` +
    'Raccontiamo posti particolari, food experience e itinerari reali con budget accessibile e senza filtri.',
  community:
    `Con ${BRAND_STATS.instagramFollowers} su Instagram e ${BRAND_STATS.tiktokFollowers} su TikTok, ` +
    'Travelliniwithus e una community reale di viaggiatori che si fida dell esperienza diretta.',
} as const;

export const SOCIAL_COLORS = {
  whatsapp: '#25D366',
  instagram: '#E1306C',
  tiktok: '#000000',
  facebook: '#1877F2',
} as const;
