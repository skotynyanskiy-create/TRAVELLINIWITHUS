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

export default function Section({ children, className = '', title, subtitle, id, spacing = 'default', divider, maxWidth = 'default', ornament }: SectionProps) {
  return (
    <section id={id} className={`${spacingMap[spacing]} ${className}`}>
      <motion.div
        className={`${maxWidthMap[maxWidth]} mx-auto px-6 md:px-12 ${divider ? 'editorial-divider' : ''}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        {(title || subtitle) && (
          <div className="text-center mb-12 md:mb-16">
            {ornament && (
              <div className="ornament-gold mb-6">
                <div className="h-1.5 w-1.5 rotate-45 bg-[var(--color-gold)]" />
              </div>
            )}
            {subtitle && (
              <span className="uppercase tracking-[0.25em] text-[10px] md:text-xs font-bold text-[var(--color-accent-text)] mb-4 block">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight leading-tight text-[var(--color-ink)]">
                {title}
              </h2>
            )}
          </div>
        )}
        <div>
          {children}
        </div>
      </motion.div>
    </section>
  );
}
