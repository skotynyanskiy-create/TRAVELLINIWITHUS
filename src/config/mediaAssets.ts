/**
 * Central media asset registry.
 *
 * Single source of truth for images used across the site.
 * Current values mirror what's live today (mix Unsplash + local assets).
 * `localAlternatives` documents the public/images/* files available for swap
 * when ready to migrate away from stock photography (e.g. to Instagram photos).
 *
 * To swap one asset: change the value here, no other file touched.
 */

export const MEDIA = {
  hero: {
    primary:
      'https://images.unsplash.com/photo-1549144511-f099e773c147?q=80&w=2000&auto=format&fit=crop',
    reelFallback:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
  },
  couple: {
    intro:
      'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=800&auto=format&fit=crop&q=80',
  },
  destinationGroups: {
    Italia:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1600&auto=format&fit=crop',
    Europa:
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1600&auto=format&fit=crop',
    Asia:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop',
    Americhe:
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1600&auto=format&fit=crop',
    Africa:
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1600&auto=format&fit=crop',
    Oceania:
      'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1600&auto=format&fit=crop',
  },
  experienceCards: {
    'Posti particolari':
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop',
    'Food & Ristoranti':
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=900&auto=format&fit=crop',
    'Hotel con carattere':
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=900&auto=format&fit=crop',
    'Weekend romantici':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop',
    "Borghi e città d'arte":
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=900&auto=format&fit=crop',
    'Relax, terme e spa':
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=900&auto=format&fit=crop',
  },
} as const;

/**
 * Proprietary assets already in /public/images — ready to swap when the user
 * validates them (or replaces them with Instagram photos).
 *
 * To migrate: replace the MEDIA.* value above with the corresponding entry here.
 */
export const LOCAL_ALTERNATIVES = {
  heroPrimary: '/images/hero-amalfi.png',
  coupleIntro: '/images/brand/couple-travel.png',
  aboutEditorial: '/images/brand/about-editorial.png',
  collabWork: '/images/brand/collab-work.png',
  destinations: {
    africa: '/images/destinations/africa.png',
    americhe: '/images/destinations/americhe.png',
    dolomiti: '/images/destinations/dolomiti.png',
    giappone: '/images/destinations/giappone.png',
    islanda: '/images/destinations/islanda.png',
    oceania: '/images/destinations/oceania.png',
    puglia: '/images/destinations/puglia.png',
    sardegna: '/images/destinations/sardegna.png',
    toscana: '/images/destinations/toscana.png',
  },
  experiences: {
    avventura: '/images/experiences/avventura.png',
    gastronomia: '/images/experiences/gastronomia.png',
    insolito: '/images/experiences/insolito.png',
    romantico: '/images/experiences/romantico.png',
  },
} as const;
