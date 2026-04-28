import type { DestinationGroup } from './contentTaxonomy';

export interface DestinationVisual {
  image: string;
  description: string;
}

export const DESTINATION_GROUP_VISUALS: Record<DestinationGroup, DestinationVisual> = {
  Italia: {
    image: '/images/destinations/toscana.png',
    description:
      "Borghi nascosti, panorami mozzafiato e tavole autentiche. L'Italia che non ti aspetti.",
  },
  Grecia: {
    image:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1600&auto=format&fit=crop',
    description: 'Cicladi e Dodecaneso, calette nascoste e taverne fuori dai radar.',
  },
  Portogallo: {
    image:
      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=1600&auto=format&fit=crop',
    description: 'Lisbona lenta, Alentejo profondo, scogliere atlantiche e ritmo umano.',
  },
};

export function getDestinationVisual(group: DestinationGroup) {
  return DESTINATION_GROUP_VISUALS[group];
}
