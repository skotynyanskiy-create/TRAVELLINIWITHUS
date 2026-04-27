export interface Milestone {
  date: string;
  label: string;
  description?: string;
  category: 'reach' | 'progetto' | 'partner' | 'stampa';
}

/**
 * Milestone editoriali del progetto Travelliniwithus.
 * Timeline pubblica per /press-reach. Aggiornare quando si raggiungono nuovi
 * traguardi (soglie follower, partnership notabili, primi articoli stampa).
 * Niente date inventate: meglio una timeline corta e vera.
 */
export const PROJECT_MILESTONES: Milestone[] = [
  {
    date: '2018',
    label: 'Avvio del progetto',
    description: 'Rodrigo & Betta iniziano a documentare i viaggi su Instagram.',
    category: 'progetto',
  },
  {
    date: '2022',
    label: '100K follower su Instagram',
    description: 'La community supera la prima soglia significativa.',
    category: 'reach',
  },
  {
    date: '2024',
    label: 'Lancio del sito Travelliniwithus.it',
    description: 'Primo asset editoriale autonomo: archivio guide + itinerari.',
    category: 'progetto',
  },
  {
    date: '2025',
    label: '150K follower + 90K TikTok',
    description: 'Espansione su TikTok come secondo canale principale.',
    category: 'reach',
  },
  {
    date: '2026',
    label: '167K+ Instagram, 250K+ totali',
    description: 'Reach mensile cumulato oltre 500K, engagement 6.5%.',
    category: 'reach',
  },
];
