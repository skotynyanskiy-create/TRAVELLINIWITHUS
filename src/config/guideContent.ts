/**
 * Contenuto visivo e descrittivo per le categorie tematiche del blog Guide di Viaggio.
 */

import {
  Backpack,
  BookOpen,
  CalendarDays,
  DollarSign,
  type LucideIcon,
  Map,
  Moon,
  UtensilsCrossed,
  Zap,
} from 'lucide-react';
import type { GuideCategory } from './contentTaxonomy';

export interface GuideCategoryVisual {
  icon: LucideIcon;
  color: string;
  colorLight: string;
  description: string;
  cta: string;
}

export const GUIDE_CATEGORY_VISUALS: Record<GuideCategory, GuideCategoryVisual> = {
  'Itinerari completi': {
    icon: Map,
    color: '#6366F1',
    colorLight: '#EEF2FF',
    description:
      'Giornate già organizzate, tappe, tempi e tutto quello che serve per partire senza pensieri.',
    cta: 'Leggi gli itinerari',
  },
  'Consigli pratici': {
    icon: Zap,
    color: '#A8865A',
    colorLight: '#F3EFE9',
    description:
      'Dritte concrete su trasporti, app, sim card, valuta locale e piccole cose che fanno la differenza.',
    cta: 'Scopri i consigli',
  },
  'Cosa portare': {
    icon: Backpack,
    color: '#059669',
    colorLight: '#ECFDF5',
    description:
      'Le packing list giuste per ogni tipo di viaggio: mare, montagna, city break o lungo raggio.',
    cta: 'Prepara la valigia',
  },
  'Food guide': {
    icon: UtensilsCrossed,
    color: '#DC2626',
    colorLight: '#FEF2F2',
    description:
      'Dove mangiare davvero bene: indirizzi testati, mercati, specialità locali e come scegliere.',
    cta: 'Esplora il food',
  },
  'Dove dormire': {
    icon: Moon,
    color: '#7C3AED',
    colorLight: '#F5F3FF',
    description:
      'Hotel con carattere, B&B nascosti, agriturismi e strutture che valgono davvero il prezzo.',
    cta: "Trova l'alloggio",
  },
  'Budget & Costi': {
    icon: DollarSign,
    color: '#B45309',
    colorLight: '#FFFBEB',
    description:
      "Cifre reali, trucchi per risparmiare e come ottimizzare il budget senza rinunciare all'esperienza.",
    cta: 'Calcola il budget',
  },
  Pianificazione: {
    icon: CalendarDays,
    color: '#0891B2',
    colorLight: '#ECFEFF',
    description:
      'Quando andare, come prenotare, quanto tempo serve e tutto quello da fare prima di partire.',
    cta: 'Pianifica il viaggio',
  },
  'Weekend & Day trip': {
    icon: BookOpen,
    color: '#BE185D',
    colorLight: '#FDF2F8',
    description:
      'Idee per uscite brevi, weekend fuori porta e gite di un giorno da organizzare in pochi minuti.',
    cta: "Trova l'idea",
  },
};

export function getGuideCategoryVisual(category: GuideCategory): GuideCategoryVisual {
  return GUIDE_CATEGORY_VISUALS[category];
}

export const GUIDE_CATEGORY_VISUAL_CLASSES: Record<GuideCategory, string> = {
  'Itinerari completi': 'guide-visual-itinerari-completi',
  'Consigli pratici': 'guide-visual-consigli-pratici',
  'Cosa portare': 'guide-visual-cosa-portare',
  'Food guide': 'guide-visual-food-guide',
  'Dove dormire': 'guide-visual-dove-dormire',
  'Budget & Costi': 'guide-visual-budget-costi',
  Pianificazione: 'guide-visual-pianificazione',
  'Weekend & Day trip': 'guide-visual-weekend-day-trip',
};

export function getGuideCategoryVisualClass(category: GuideCategory): string {
  return GUIDE_CATEGORY_VISUAL_CLASSES[category];
}
