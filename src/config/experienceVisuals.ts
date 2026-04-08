import {
  Sparkles,
  UtensilsCrossed,
  Wine,
  BedDouble,
  Heart,
  Landmark,
  Mountain,
  Droplets,
  Zap,
  Route,
  type LucideIcon,
} from 'lucide-react';

export interface ExperienceVisual {
  icon: LucideIcon;
  color: string;
  colorLight: string;
  emoji: string;
}

export const EXPERIENCE_VISUALS: Record<string, ExperienceVisual> = {
  'Posti particolari': {
    icon: Sparkles,
    color: '#C4A47C',
    colorLight: '#FDF0EA',
    emoji: '✨',
  },
  'Food & Ristoranti': {
    icon: UtensilsCrossed,
    color: '#D97706',
    colorLight: '#FEF7ED',
    emoji: '🍝',
  },
  'Locali insoliti': {
    icon: Wine,
    color: '#9333EA',
    colorLight: '#F5F0FF',
    emoji: '🍷',
  },
  'Hotel con carattere': {
    icon: BedDouble,
    color: '#5B8A72',
    colorLight: '#F0F2F0',
    emoji: '🏨',
  },
  'Weekend romantici': {
    icon: Heart,
    color: '#E11D48',
    colorLight: '#FFF0F3',
    emoji: '💑',
  },
  'Borghi e città d\'arte': {
    icon: Landmark,
    color: '#6D5E3D',
    colorLight: '#F4F4F5',
    emoji: '🏛️',
  },
  'Passeggiate panoramiche': {
    icon: Mountain,
    color: '#16A34A',
    colorLight: '#ECFDF5',
    emoji: '🏔️',
  },
  'Relax, terme e spa': {
    icon: Droplets,
    color: '#0EA5E9',
    colorLight: '#EFF9FF',
    emoji: '💧',
  },
  'Esperienze insolite': {
    icon: Zap,
    color: '#F97316',
    colorLight: '#FFF5ED',
    emoji: '⚡',
  },
  'Gite e day trip': {
    icon: Route,
    color: '#8B5CF6',
    colorLight: '#F3EEFF',
    emoji: '🗺️',
  },
};

export function getExperienceVisual(type: string): ExperienceVisual {
  return EXPERIENCE_VISUALS[type] ?? EXPERIENCE_VISUALS['Posti particolari'];
}
