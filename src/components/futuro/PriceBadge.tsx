interface PriceBadgeProps {
  price: string;
  size?: 'sm' | 'md';
}

/**
 * Badge prezzo mono — visualizza il dato di valore reale dal ContentItem.
 * Font mono per chiarezza numerica (usa font-mono di Tailwind, allineato a Geist Mono
 * se installato in futuro, per ora Inter Mono / system mono).
 */
export function PriceBadge({ price, size = 'md' }: PriceBadgeProps) {
  const isSmall = size === 'sm';
  return (
    <span
      className={`inline-flex items-center font-mono font-semibold tracking-tight rounded ${isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'}`}
      style={{ color: '#E8B04B', background: 'rgba(232, 176, 75, 0.10)' }}
      aria-label={`Prezzo: ${price}`}
    >
      {price}
    </span>
  );
}
