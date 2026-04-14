import type { DestinationGroup } from './contentTaxonomy';

export interface DestinationVisual {
  image: string;
  description: string;
}

export const DESTINATION_GROUP_VISUALS: Record<DestinationGroup, DestinationVisual> = {
  Italia: {
    image: '/images/destinations/toscana.png',
    description: "Borghi nascosti, panorami mozzafiato e tavole autentiche. L'Italia che non ti aspetti.",
  },
  Europa: {
    image: '/images/destinations/islanda.png',
    description: 'Capitali vibranti, natura selvaggia e itinerari europei dal taglio pratico.',
  },
  Asia: {
    image: '/images/destinations/giappone.png',
    description: 'Tradizioni millenarie, templi nascosti e viaggi da preparare con cura.',
  },
  Americhe: {
    image: '/images/destinations/americhe.png',
    description: 'Strade panoramiche, metropoli e mete fuori rotta da scoprire.',
  },
  Africa: {
    image: '/images/destinations/africa.png',
    description: 'Paesaggi potenti, culture profonde e viaggi da vivere senza superficialità.',
  },
  Oceania: {
    image: '/images/destinations/oceania.png',
    description: 'Natura incontaminata, costa infinita e avventure da progettare con calma.',
  },
};

export function getDestinationVisual(group: DestinationGroup) {
  return DESTINATION_GROUP_VISUALS[group];
}
