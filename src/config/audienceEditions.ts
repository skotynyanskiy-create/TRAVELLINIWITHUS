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
 * (`AudienceGate.tsx`), dalla fascia di edizione in navbar e dal segmented
 * control del drawer mobile. Prima le descrizioni vivevano solo nel gate ed
 * erano duplicate a mano ovunque servisse lo stesso testo.
 *
 * Il terzo pubblico si chiama «Collaborazioni» ovunque nel sito pubblico —
 * chip/fascia, voce di menu, footer — per decisione esplicita dell'owner
 * (2026-08-17), che si è scostato dalla raccomandazione di tenere «Brand» nel
 * commutatore e «Collaborazioni» solo come voce di menu. Il valore del tipo
 * `Audience` resta `'brand'`: è una chiave interna, non testo pubblico.
 */
export const AUDIENCE_EDITIONS: AudienceEditionChoice[] = [
  {
    key: 'viaggiatori',
    icon: Compass,
    title: 'Viaggiatori',
    description: 'Posti particolari provati di persona: mete, mappa e come ci siamo andati.',
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
    title: 'Collaborazioni',
    description: 'Collaborazioni, media kit e come lavoriamo con i partner.',
    to: '/collaborazioni',
  },
];
