import { motion } from 'motion/react';
import type { ContentItem } from '../../types/content';
import { VerdictBadge, deriveVerdict } from './VerdictBadge';
import { PriceBadge } from './PriceBadge';

const PARTNERSHIP_LABEL: Record<string, string> = {
  organic: '',
  adv: 'ADV',
  invited: 'INVITO',
  gifted: 'GIFTED',
  collaboration: 'COLLAB',
  affiliate: 'AFFILIAZIONE',
};

interface AtlanteCardProps {
  item: ContentItem;
  /** 'hero' = prima card grande, 'standard' = card griglia */
  variant?: 'hero' | 'standard';
  /** Se true, card è "in luce" (matched dal concierge). Se false, attenuata. */
  highlighted?: boolean;
  /** true se il concierge ha prodotto un match attivo */
  hasActiveQuery?: boolean;
}

export function AtlanteCard({
  item,
  variant = 'standard',
  highlighted = true,
  hasActiveQuery = false,
}: AtlanteCardProps) {
  const verdict = deriveVerdict(item);
  const advLabel = PARTNERSHIP_LABEL[item.partnership.kind];
  const isHero = variant === 'hero';

  /* Cover: usa cover reale se presente, altrimenti pattern scuro ember */
  const hasCover = Boolean(item.cover);

  return (
    <motion.article
      layout
      layoutId={`atlante-card-${item.id}`}
      animate={{
        opacity: hasActiveQuery ? (highlighted ? 1 : 0.25) : 1,
        scale: hasActiveQuery ? (highlighted ? 1 : 0.97) : 1,
        filter: hasActiveQuery && !highlighted ? 'brightness(0.5)' : 'brightness(1)',
      }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`atlante-card relative overflow-hidden rounded-2xl flex flex-col group cursor-pointer ${
        isHero ? 'row-span-2 min-h-[480px]' : 'min-h-[280px]'
      }`}
      style={{ background: '#16130F' }}
      role="article"
      aria-label={item.title}
    >
      {/* Cover / sfondo */}
      {hasCover ? (
        <img
          src={item.cover}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        /* Trattamento scuro+ember per card senza cover reale */
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255, 91, 46, 0.18) 0%, transparent 70%),
              #16130F
            `,
          }}
          aria-hidden="true"
        />
      )}

      {/* Scrim narrativo — luce dal basso verso l'alto */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to top, rgba(11, 10, 9, 0.92) 0%, rgba(11, 10, 9, 0.55) 45%, rgba(11, 10, 9, 0.10) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Badge ADV in alto a destra — disclosure AGCOM */}
      {advLabel && (
        <div className="absolute top-3 right-3 z-20">
          <span
            className="text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded"
            style={{ color: '#B7AE9F', background: 'rgba(46, 40, 32, 0.85)' }}
          >
            {advLabel}
          </span>
        </div>
      )}

      {/* Highlighted glow border quando matched */}
      {highlighted && hasActiveQuery && (
        <div
          className="absolute inset-0 z-10 rounded-2xl pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 0 1.5px rgba(255, 91, 46, 0.6)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Contenuto card — in basso */}
      <div className="relative z-20 mt-auto p-4 md:p-5 flex flex-col gap-2">
        {/* Hook a domanda — voce R+B */}
        <p
          className={`font-sans leading-snug ${isHero ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}
          style={{ color: '#B7AE9F' }}
        >
          {item.hook}
        </p>

        {/* Titolo */}
        <h3
          className={`font-serif font-black leading-tight ${isHero ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}
          style={{ color: '#F4EEE3' }}
        >
          {item.title}
        </h3>

        {/* Città + zona */}
        <p className="text-xs font-sans uppercase tracking-widest" style={{ color: '#6E665A' }}>
          {[item.place.city, item.place.country].filter(Boolean).join(' · ')}
        </p>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <VerdictBadge verdict={verdict} size="sm" />
          {item.value?.price && <PriceBadge price={item.value.price} size="sm" />}
        </div>
      </div>
    </motion.article>
  );
}
