import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Wallet } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import DemoContentNotice from '../components/DemoContentNotice';
import OptimizedImage from '../components/OptimizedImage';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { DEMO_ITINERARIES } from '../config/demoItineraries';
import {
  ITINERARY_BUDGETS,
  ITINERARY_DURATIONS,
  ITINERARY_STYLES,
} from '../config/contentTaxonomy';
import { SITE_URL } from '../config/site';

type DurationOption = 'all' | (typeof ITINERARY_DURATIONS)[number];
type StyleOption = 'all' | (typeof ITINERARY_STYLES)[number];
type BudgetOption = 'all' | (typeof ITINERARY_BUDGETS)[number]['id'];

export default function Itinerari() {
  const [duration, setDuration] = useState<DurationOption>('all');
  const [style, setStyle] = useState<StyleOption>('all');
  const [budget, setBudget] = useState<BudgetOption>('all');

  const filteredItineraries = useMemo(() => {
    return DEMO_ITINERARIES.filter((item) => {
      if (duration !== 'all' && item.duration !== duration) return false;
      if (style !== 'all' && item.style !== style) return false;
      if (budget !== 'all' && item.budgetTier !== budget) return false;
      return true;
    });
  }, [duration, style, budget]);

  return (
    <PageLayout>
      <SEO
        title="Itinerari di viaggio in coppia nel Sud Italia"
        description="Itinerari pratici giorno per giorno per coppie nel Sud Italia: Sicilia, Calabria, Puglia, Basilicata. Filtrabili per durata, stile e budget."
        canonical={`${SITE_URL}/itinerari`}
        noindex
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Itinerari', url: `${SITE_URL}/itinerari` },
        ]}
      />

      <Section className="pt-8">
        <Breadcrumbs items={[{ label: 'Itinerari' }]} />

        <div className="mt-8 max-w-3xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
            Itinerari Travelliniwithus
          </span>
          <h1 className="mt-4 text-5xl font-serif leading-[1.05] tracking-tight md:text-6xl">
            Viaggi già letti.
            <br />
            <span className="italic text-black/55"> Pronti da personalizzare.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-black/70">
            Itinerari costruiti dopo aver fatto il viaggio, non dopo aver copiato un brief. Filtra
            per ritmo, stile e budget per trovare il punto di partenza giusto.
          </p>
        </div>

        <DemoContentNotice
          className="mt-10 max-w-3xl"
          title="Anteprima itinerari"
          message="Stai vedendo itinerari in lavorazione: mostrano ritmo, filtri e formato editoriale. Verranno aggiornati con dati, foto e note verificate prima della pubblicazione completa."
        />
      </Section>

      <Section className="pt-4">
        <div className="rounded-[var(--radius-lg)] border border-black/5 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-5 md:grid-cols-3">
            <FilterSelect
              label="Durata"
              value={duration}
              onChange={(value) => setDuration(value as DurationOption)}
              options={[
                { value: 'all', label: 'Tutte le durate' },
                ...ITINERARY_DURATIONS.map((item) => ({ value: item, label: item })),
              ]}
            />
            <FilterSelect
              label="Stile"
              value={style}
              onChange={(value) => setStyle(value as StyleOption)}
              options={[
                { value: 'all', label: 'Tutti gli stili' },
                ...ITINERARY_STYLES.map((item) => ({ value: item, label: item })),
              ]}
            />
            <FilterSelect
              label="Budget"
              value={budget}
              onChange={(value) => setBudget(value as BudgetOption)}
              options={[
                { value: 'all', label: 'Tutti i budget' },
                ...ITINERARY_BUDGETS.map((item) => ({ value: item.id, label: item.label })),
              ]}
            />
          </div>
          <p className="mt-5 text-xs text-black/45">
            {filteredItineraries.length}{' '}
            {filteredItineraries.length === 1
              ? 'itinerario corrispondente'
              : 'itinerari corrispondenti'}{' '}
            ai filtri.
          </p>
        </div>
      </Section>

      <Section>
        {filteredItineraries.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-black/5 bg-[var(--color-sand)] p-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
              Nessun risultato
            </p>
            <p className="mt-4 text-base leading-relaxed text-black/65">
              Allarga i filtri per vedere più itinerari, oppure scrivici cosa stai cercando.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredItineraries.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-black/5 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-premium)]"
              >
                <Link
                  to={`/itinerari/${item.slug}`}
                  className="relative block aspect-[5/4] overflow-hidden"
                >
                  <OptimizedImage
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/20 bg-white/80 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] backdrop-blur-md shadow-sm">
                      {item.style}
                    </span>
                    {item.isDemo && (
                      <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-sm animate-pulse">
                        Anteprima
                      </span>
                    )}
                  </div>
                </Link>
                <div className="flex flex-1 flex-col gap-4 p-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
                    {item.destination}
                  </p>
                  <Link to={`/itinerari/${item.slug}`} className="block">
                    <h3 className="text-2xl font-serif leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent-text)]">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="line-clamp-3 text-sm leading-relaxed text-black/60">
                    {item.excerpt}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 border-t border-black/5 pt-5">
                    <FactPill icon={<Clock size={11} />} label={`${item.durationDays} gg`} />
                    <FactPill icon={<Calendar size={11} />} label={item.period} />
                    <FactPill icon={<Wallet size={11} />} label={item.budgetTier} />
                  </div>
                  <div className="mt-4 border-t border-black/5 pt-4">
                    <Link
                      to={`/itinerari/${item.slug}`}
                      className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent-text)]"
                    >
                      Apri itinerario{' '}
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </Section>

      <Section className="my-12">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 md:flex md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
              Hai già 2-3 candidati?
            </p>
            <p className="mt-2 font-serif text-2xl text-[var(--color-ink)]">
              Confronta itinerari side-by-side.
            </p>
            <p className="mt-2 text-sm text-black/55">
              Durata, stile, budget e cosa li rende diversi in una tabella.
            </p>
          </div>
          <Link
            to="/itinerari/compare"
            className="mt-5 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-ink)] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)] md:mt-0"
          >
            Apri il confronto <ArrowRight size={14} />
          </Link>
        </div>
      </Section>
    </PageLayout>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-left">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-full border border-black/5 bg-white px-6 py-3.5 pr-10 text-sm font-medium text-[var(--color-ink)] shadow-sm transition-all duration-300 hover:border-[var(--color-accent)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/20 cursor-pointer"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Freccia custom */}
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-black/45">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </label>
  );
}

function FactPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--color-accent-soft)]/45 px-3 py-1.5 text-[var(--color-ink)] text-[10px] font-semibold transition-all duration-300 hover:bg-[var(--color-accent-soft)]">
      <span className="text-[var(--color-accent)] shrink-0">{icon}</span>
      <span className="truncate text-black/75">{label}</span>
    </span>
  );
}
