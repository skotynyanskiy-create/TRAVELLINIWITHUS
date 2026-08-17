import type { LucideIcon } from 'lucide-react';
import { Baby, BriefcaseBusiness, Compass } from 'lucide-react';
import type { Audience } from '../context/AudienceContext';

export interface AudienceEditionChoice {
  key: Audience;
  icon: LucideIcon;
  title: string;
  description: string;
  /** Rotta di atterraggio quando si sceglie questa edizione; null = resta dov'è (home). */
  to: string | null;
}

/**
 * Fonte unica delle tre edizioni del sito — usata dal gate del primo accesso
 * (`AudienceGate.tsx`) e dal chip di edizione in navbar
 * (`AudienceEditionChip.tsx`). Prima le descrizioni vivevano solo nel gate ed
 * erano duplicate a mano ovunque servisse lo stesso testo.
 *
 * «Brand» è l'unico nome per il terzo pubblico: prima ne aveva quattro
 * («Brand & aziende», «Collaborazioni», «Modalità Partner Attiva», «Hub
 * B2B»), ed è anche il valore del tipo `Audience`.
 */
export const AUDIENCE_EDITIONS: AudienceEditionChoice[] = [
  {
    key: 'viaggiatori',
    icon: Compass,
    title: 'Viaggiatori',
    description: 'Posti particolari provati di persona: atlante, mappa e come ci siamo andati.',
    to: null,
  },
  {
    key: 'family',
    icon: Baby,
    title: 'Family',
    description: 'Gravidanza, viaggi col pancione e — presto — col piccolo.',
    to: '/family',
  },
  {
    key: 'brand',
    icon: BriefcaseBusiness,
    title: 'Brand',
    description: 'Collaborazioni, media kit e come lavoriamo con i partner.',
    to: '/collaborazioni',
  },
];
