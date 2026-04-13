import type { DestinationGroup } from './contentTaxonomy';

export interface DestinationVisual {
  image: string;
  description: string;
}

export const DESTINATION_GROUP_VISUALS: Record<DestinationGroup, DestinationVisual> = {
  Italia: {
    image:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200&auto=format&fit=crop',
    description: "Borghi, citta d'arte, tavole locali e weekend da costruire bene.",
  },
  Europa: {
    image:
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop',
    description: 'Capitali, natura e itinerari europei con taglio pratico.',
  },
  Asia: {
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
    description: 'Luoghi iconici, tradizioni e viaggi da preparare con attenzione.',
  },
  Americhe: {
    image:
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1200&auto=format&fit=crop',
    description: 'Strade panoramiche, grandi citta e mete fuori rotta.',
  },
  Africa: {
    image:
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1200&auto=format&fit=crop',
    description: 'Paesaggi potenti, cultura e viaggi da leggere senza superficialita.',
  },
  Oceania: {
    image:
      'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1200&auto=format&fit=crop',
    description: 'Natura, costa e itinerari lunghi da progettare con calma.',
  },
};

export function getDestinationVisual(group: DestinationGroup) {
  return DESTINATION_GROUP_VISUALS[group];
}
