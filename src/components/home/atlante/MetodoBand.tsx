import { motion, useReducedMotion } from 'motion/react';
import { BadgeCheck, FileCheck2, ShieldCheck, type LucideIcon } from 'lucide-react';
import Section from '@/src/components/Section';
import Button from '@/src/components/Button';
import { BRAND_CREDENTIALS } from '@/src/config/site';
import { siteContentDefaults } from '@/src/config/siteContent';
import { useSiteContent } from '@/src/hooks/useSiteContent';

interface MetodoBandProps {
  className?: string;
  id?: string;
}

interface Credential {
  label: string;
  icon: LucideIcon;
}

const CREDENTIALS: Credential[] = [
  { label: BRAND_CREDENTIALS.agcomLabel, icon: ShieldCheck },
  { label: BRAND_CREDENTIALS.metaVerifiedLabel, icon: BadgeCheck },
  { label: BRAND_CREDENTIALS.disclosurePolicyLabel, icon: FileCheck2 },
];

export default function MetodoBand({ className = '', id }: MetodoBandProps) {
  const reduceMotion = useReducedMotion();
  const { data: home } = useSiteContent('home');
  const { data: about } = useSiteContent('about');

  const copy = home ?? siteContentDefaults.home;
  const quote = (about ?? siteContentDefaults.about).quoteText;
  const quoteAuthor = (about ?? siteContentDefaults.about).quoteAuthor;

  return (
    <Section id={id} spacing="spacious" className={`bg-[var(--color-surface-2)] ${className}`}>
      <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          {/* Entry device "rule + label" — rompe la ripetizione dell'occhiello
              accent-uppercase centrato usato altrove sulla home. */}
          <div className="mb-4 flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-[var(--color-accent)]" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-2)]">
              {copy.aboutEyebrow}
            </span>
          </div>
          <h2 className="font-serif font-medium leading-tight tracking-tight text-[var(--color-ink)] text-3xl md:text-4xl lg:text-5xl">
            {copy.aboutTitleMain}
            <br />
            <span className="text-[var(--color-accent-text)]">{copy.aboutTitleAccent}</span>
          </h2>

          <blockquote className="mt-8 border-l-2 border-[var(--color-accent)] pl-5 font-serif text-xl italic leading-snug text-[var(--color-ink-2)] md:text-2xl">
            &ldquo;{quote}&rdquo;
            <footer className="mt-3 font-sans text-xs font-semibold uppercase not-italic tracking-[0.18em] text-[var(--color-muted)]">
              {quoteAuthor}
            </footer>
          </blockquote>

          <div className="mt-9">
            <Button
              to={copy.aboutButtonLink}
              variant="primary"
              size="lg"
              trackingId="metodo_band_chi_siamo"
            >
              {copy.aboutButtonLabel}
            </Button>
          </div>
        </div>

        <ul className="flex flex-col gap-4">
          {CREDENTIALS.map(({ label, icon: Icon }, i) => (
            <motion.li
              key={label}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.4,
                delay: reduceMotion ? 0 : i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)]"
              >
                <Icon className="h-5 w-5 text-[var(--color-accent-text)]" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-semibold leading-snug text-[var(--color-ink)] md:text-base">
                {label}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
