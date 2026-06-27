import type { ContentItem } from '../../types/content';

export type VerdictKind = 'vale' | 'dipende' | 'salta';

/**
 * Deriva un verdetto sobrio dal ContentItem senza inventare testo nuovo.
 * Logica euristica basata su partnership.kind e budget:
 *  - 'adv' (pubblicità pagata) → DIPENDE (sii cauto, contestualizza)
 *  - 'organic' o 'invited' + budget 'Basso' → VALE (rapporto qualità/prezzo chiaro)
 *  - 'gifted' → DIPENDE
 *  - tutto il resto non classificabile → VALE come default sobrio
 *
 * Il testo verdetto usa sempre i campi reali dell'item, mai copia inventata.
 */
export function deriveVerdict(item: ContentItem): VerdictKind {
  const { kind } = item.partnership;
  const budget = item.value?.budget;

  if (kind === 'adv') return 'dipende';
  if (kind === 'gifted') return 'dipende';
  if (kind === 'organic' && budget === 'Basso') return 'vale';
  if (kind === 'invited' && budget === 'Basso') return 'vale';
  if (kind === 'organic' && budget === 'Medio') return 'vale';
  if (kind === 'affiliate') return 'dipende';
  return 'vale';
}

const VERDICT_CONFIG: Record<
  VerdictKind,
  { label: string; color: string; bg: string; dot: string }
> = {
  vale: {
    label: 'VALE',
    color: '#3FBF7F',
    bg: 'rgba(63, 191, 127, 0.12)',
    dot: '#3FBF7F',
  },
  dipende: {
    label: 'DIPENDE',
    color: '#E8B04B',
    bg: 'rgba(232, 176, 75, 0.12)',
    dot: '#E8B04B',
  },
  salta: {
    label: 'SALTA',
    color: '#E5523E',
    bg: 'rgba(229, 82, 62, 0.12)',
    dot: '#E5523E',
  },
};

interface VerdictBadgeProps {
  verdict: VerdictKind;
  size?: 'sm' | 'md';
}

export function VerdictBadge({ verdict, size = 'md' }: VerdictBadgeProps) {
  const cfg = VERDICT_CONFIG[verdict];
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-bold tracking-widest uppercase ${isSmall ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'}`}
      style={{ color: cfg.color, background: cfg.bg }}
      aria-label={`Verdetto: ${cfg.label}`}
    >
      <span
        className={`rounded-full flex-shrink-0 ${isSmall ? 'w-1.5 h-1.5' : 'w-2 h-2'}`}
        style={{ background: cfg.dot }}
        aria-hidden="true"
      />
      {cfg.label}
    </span>
  );
}
