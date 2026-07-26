import { motion } from 'motion/react';
import { Link } from '@/src/components/TransitionLink';
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, Clock, MapPin, Wallet } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import DemoContentNotice from '../components/DemoContentNotice';
import OptimizedImage from '../components/OptimizedImage';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { DEMO_ITINERARIES } from '../config/demoItineraries';
import { SITE_URL } from '../config/site';

const ITINERARIES_TO_COMPARE = DEMO_ITINERARIES;

const COMPARE_ROWS: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  getValue: (it: (typeof DEMO_ITINERARIES)[number]) => string;
}[] = [
  { label: 'Destinazione', icon: MapPin, getValue: (it) => `${it.destination}, ${it.continent}` },
  {
    label: 'Durata',
    icon: Clock,
    getValue: (it) => `${it.durationDays} giorni`,
  },
  { label: 'Periodo', icon: Calendar, getValue: (it) => it.period },
  { label: 'Stile', icon: CheckCircle2, getValue: (it) => it.style },
  { label: 'Budget', icon: Wallet, getValue: (it) => it.budget },
];

export default function ItinerariCompare() {
  return (
    <PageLayout>
      <SEO
        title="Confronta itinerari"
        description="Confronta gli itinerari Travelliniwithus side-by-side: durata, stile, budget, periodo e cosa li rende diversi."
        canonical={`${SITE_URL}/itinerari/compare`}
      />

      <Section className="pt-8">
        <Breadcrumbs items={[{ label: 'Itinerari', href: '/itinerari' }, { label: 'Confronta' }]} />

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              Confronta itinerari
            </span>
            <h1 className="mt-3 text-4xl font-serif leading-[1.05] tracking-tight md:text-5xl">
              Tre itinerari, una decisione.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-black/65">
              Stessa fascia di prezzo, ritmi diversi. Scegli quello che ti somiglia di più.
            </p>
          </div>
          <Link
            to="/itinerari"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
          >
            <ArrowLeft size={14} /> Torna alla lista
          </Link>
        </div>
      </Section>

      <Section className="pt-0">
        <DemoContentNotice
          className="mb-8 max-w-3xl"
          title="Anteprima confronto"
          message="Prezzi, durate e tappe di questi itinerari sono dati dimostrativi: prima della pubblicazione vanno sostituiti con quelli reali e verificati."
        />
        {/* Cards header con immagini */}
        <div className="grid gap-4 md:grid-cols-3">
          {ITINERARIES_TO_COMPARE.map((it, idx) => (
            <motion.div
              key={it.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <OptimizedImage
                  src={it.image}
                  alt={it.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] backdrop-blur-md">
                  {it.style}
                </div>
              </div>
              <div className="p-5">
                <h2 className="font-serif text-xl leading-tight text-[var(--color-ink)]">
                  {it.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-black/55">
                  {it.excerpt}
                </p>
                <Link
                  to={`/itinerari/${it.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                >
                  Apri itinerario <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabella confronto */}
        <div className="mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white">
          <div className="grid grid-cols-[1.2fr_repeat(3,1fr)] border-b border-[var(--color-border)] bg-[var(--color-surface-2)] text-[10px] font-bold uppercase tracking-[0.2em] text-black/55">
            <div className="p-4">Caratteristica</div>
            {ITINERARIES_TO_COMPARE.map((it) => (
              <div key={it.slug} className="border-l border-[var(--color-border)] p-4">
                {it.destination}
              </div>
            ))}
          </div>

          {COMPARE_ROWS.map((row, idx) => {
            const Icon = row.icon;
            return (
              <div
                key={row.label}
                className={`grid grid-cols-[1.2fr_repeat(3,1fr)] border-b border-[var(--color-border)] last:border-b-0 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-[var(--color-surface-2)]/50'
                }`}
              >
                <div className="flex items-center gap-2 p-4 text-sm font-medium text-[var(--color-ink-2)]">
                  <Icon size={14} className="text-[var(--color-accent)]" />
                  {row.label}
                </div>
                {ITINERARIES_TO_COMPARE.map((it) => (
                  <div
                    key={it.slug}
                    className="border-l border-[var(--color-border)] p-4 text-sm text-[var(--color-ink)]"
                  >
                    {row.getValue(it)}
                  </div>
                ))}
              </div>
            );
          })}

          {/* Highlights row (multi-line) */}
          <div className="grid grid-cols-[1.2fr_repeat(3,1fr)] border-t border-[var(--color-border)]">
            <div className="p-4 text-sm font-medium text-[var(--color-ink-2)]">Top highlights</div>
            {ITINERARIES_TO_COMPARE.map((it) => (
              <div
                key={it.slug}
                className="border-l border-[var(--color-border)] p-4 text-xs leading-relaxed text-black/65"
              >
                <ul className="space-y-1.5">
                  {it.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex gap-1.5">
                      <CheckCircle2
                        size={11}
                        className="mt-0.5 shrink-0 text-[var(--color-accent)]"
                      />
                      <span className="line-clamp-2">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Best for row */}
          <div className="grid grid-cols-[1.2fr_repeat(3,1fr)] border-t border-[var(--color-border)] bg-[var(--color-surface-2)]/50">
            <div className="p-4 text-sm font-medium text-[var(--color-ink-2)]">Pensato per</div>
            {ITINERARIES_TO_COMPARE.map((it) => (
              <div
                key={it.slug}
                className="border-l border-[var(--color-border)] p-4 text-xs leading-relaxed text-black/65"
              >
                {it.bestFor?.[0] || '—'}
              </div>
            ))}
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
