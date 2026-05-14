import React from 'react';
import { motion } from 'motion/react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
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
  id,
  spacing = 'default',
  divider,
  maxWidth = 'default',
  ornament,
}: SectionProps) {
  return (
    <section id={id} className={`${spacingMap[spacing]} ${className}`}>
      <motion.div
        className={`${maxWidthMap[maxWidth]} mx-auto px-6 md:px-12 ${divider ? 'subtle-divider' : ''}`}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {(title || subtitle) && (
          <div className="mb-10 text-center md:mb-14">
            {ornament && (
              <div className="mb-5 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-[var(--color-border)]" />
                <span className="h-1 w-1 rotate-45 bg-[var(--color-accent)]" />
                <span className="h-px w-8 bg-[var(--color-border)]" />
              </div>
            )}
            {subtitle && (
              <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="font-serif font-medium leading-tight tracking-tight text-[var(--color-ink)] text-3xl md:text-4xl lg:text-5xl">
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
