/**
 * Contenuto visivo e descrittivo per i FORMAT canonical Esplora.
 *
 * Sostituisce le 8 vecchie GUIDE_CATEGORIES (Itinerari completi, Consigli
 * pratici, Cosa portare, Food guide, Dove dormire, Budget & Costi,
 * Pianificazione, Weekend & Day trip) con i 4 FORMAT ortogonali della
 * tassonomia 3.0.
 */

import { BookOpen, ClipboardList, Map, Sparkles, type LucideIcon } from 'lucide-react';
import type { ContentFormat } from './contentTaxonomy';

export interface FormatVisual {
  icon: LucideIcon;
  color: string;
  colorLight: string;
  description: string;
  cta: string;
}

export const FORMAT_VISUALS: Record<ContentFormat, FormatVisual> = {
  Storia: {
    icon: Sparkles,
    color: '#A8865A',
    colorLight: '#F3EFE9',
    description:
      'Racconti di un posto vissuto, con atmosfera, dettagli e quello che ci ha colpito davvero.',
    cta: 'Leggi la storia',
  },
  Guida: {
    icon: BookOpen,
    color: '#6366F1',
    colorLight: '#EEF2FF',
    description:
      'Tutto quello che ti serve per decidere se andare, quando, dove dormire e cosa salvare.',
    cta: 'Apri la guida',
  },
  Itinerario: {
    icon: Map,
    color: '#059669',
    colorLight: '#ECFDF5',
    description:
      'Giorno per giorno, tappe, tempi reali e logistica già organizzata: parti senza pensieri.',
    cta: "Leggi l'itinerario",
  },
  'Lista pratica': {
    icon: ClipboardList,
    color: '#B45309',
    colorLight: '#FFFBEB',
    description: 'Dritte concrete: cosa portare, quanto costa, come muoversi, dove non sbagliare.',
    cta: 'Apri la lista',
  },
};

export function getFormatVisual(format: ContentFormat): FormatVisual {
  return FORMAT_VISUALS[format];
}

// Back-compat alias durante la migrazione
export const GUIDE_CATEGORY_VISUALS = FORMAT_VISUALS;
export const getGuideCategoryVisual = getFormatVisual;
