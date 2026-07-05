import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';

/**
 * Device di apertura sezione. Alternarli rompe la monotonia dell'occhiello
 * uppercase-tracked (il tell AI-slop n.1): riservare 'eyebrow' a max 1-2 sezioni
 * per pagina e variare le altre con 'rule' (filetto + parola) o 'standfirst'
 * (frase-lead serif corsivo).
 */
type SubtitleVariant = 'eyebrow' | 'rule' | 'standfirst';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  subtitleVariant?: SubtitleVariant;
  align?: 'center' | 'left';
  id?: string;
  spacing?: 'tight' | 'default' | 'spacious';
  divider?: boolean;
  maxWidth?: 'narrow' | 'default' | 'wide';
  ornament?: boolean;
}

const spacingMap = {
  tight: 'py-12 md:py-16',
  default: 'py-16 md:py-24',
  spacious: 'py-24 md:py-36',
};

const maxWidthMap = {
  narrow: 'max-w-4xl',
  default: 'max-w-7xl',
  wide: 'max-w-[1440px]',
};

export default function Section({
  children,
  className = '',
  title,
  subtitle,
  subtitleVariant = 'eyebrow',
  align = 'center',
  id,
  spacing = 'default',
  divider,
  maxWidth = 'default',
  ornament,
}: SectionProps) {
  const reduced = useReducedMotion();
  const alignHeader = align === 'left' ? 'text-left' : 'text-center';
  const alignItems = align === 'left' ? 'justify-start' : 'justify-center';

  return (
    <section id={id} className={`${spacingMap[spacing]} ${className}`}>
      {/* Reveal = enhancement, non gate di visibilita: con reduced-motion il
          contenuto e' visibile subito (initial=false), mai opacity:0 permanente. */}
      <motion.div
        className={`${maxWidthMap[maxWidth]} mx-auto px-6 md:px-12 ${divider ? 'subtle-divider' : ''}`}
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={reduced ? undefined : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {(title || subtitle) && (
          <div className={`mb-10 ${alignHeader} md:mb-14`}>
            {ornament && (
              <div className={`mb-5 flex items-center gap-2 ${alignItems}`}>
                <span className="h-px w-8 bg-[var(--color-border)]" />
                <span className="h-1 w-1 rotate-45 bg-[var(--color-accent)]" />
                <span className="h-px w-8 bg-[var(--color-border)]" />
              </div>
            )}
            {subtitle && subtitleVariant === 'eyebrow' && (
              <span className="mb-3 block text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-accent-text)]">
                {subtitle}
              </span>
            )}
            {subtitle && subtitleVariant === 'rule' && (
              <span className={`mb-4 flex items-center gap-3 ${alignItems}`}>
                <span className="h-px w-8 bg-[var(--color-accent)]" aria-hidden="true" />
                <span className="text-sm font-medium text-[var(--color-muted-fg-2)]">
                  {subtitle}
                </span>
              </span>
            )}
            {subtitle && subtitleVariant === 'standfirst' && (
              <p className="mb-4 font-serif text-lg italic text-[var(--color-ink-2)] md:text-xl">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-ink)] md:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}
          </div>
        )}
        <div>{children}</div>
      </motion.div>
    </section>
  );
}
