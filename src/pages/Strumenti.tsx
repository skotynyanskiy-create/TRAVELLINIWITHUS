import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Calendar, Compass, Map, MapPin, Wallet } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import BudgetCalculator from '../components/BudgetCalculator';
import DestinationCostCalculator from '../components/DestinationCostCalculator';
import ItineraryBuilder from '../components/ItineraryBuilder';
import WhenToGoCalendar from '../components/WhenToGoCalendar';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { SITE_URL } from '../config/site';
import { DESTINATION_BASELINES } from '../config/costBaselines';

const TOOL_LINKS = [
  {
    title: 'Quiz: trova il tuo viaggio',
    description:
      'Sette domande per scoprire il vostro archetipo di coppia + 3 destinazioni firmate R+B.',
    href: '/quiz',
    icon: Compass,
  },
  {
    title: 'Mappa interattiva',
    description: 'Esplora le destinazioni che abbiamo verificato sul posto.',
    href: '/mappa',
    icon: Map,
  },
];

export default function Strumenti() {
  // Cross-link state: il WhenToGoCalendar puo' pre-popolare il CostCalculator
  // quando l'utente clicca "Calcola budget per [mese]" nel dettaglio mese.
  // Stato condiviso lifted qui per orchestrare i 2 tool insieme.
  const [costInitialDest, setCostInitialDest] = useState<string | undefined>(undefined);
  const [costInitialMonth, setCostInitialMonth] = useState<number | undefined>(undefined);
  const costCalcRef = useRef<HTMLDivElement>(null);

  const handleWhenToGoCta = (month: number, slug: string) => {
    // Solo destinazioni presenti in entrambi i cataloghi possono pre-popolare.
    if (DESTINATION_BASELINES[slug]) {
      setCostInitialDest(slug);
      setCostInitialMonth(month);
      // Smooth scroll al cost calculator.
      window.requestAnimationFrame(() => {
        costCalcRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  return (
    <PageLayout>
      <SEO
        title="Strumenti di viaggio"
        description="Calendario meteo + affollamento per destinazione, calcolatore budget granulare, quiz di archetipo, mappa interattiva. Strumenti pratici per decidere meglio."
        canonical={`${SITE_URL}/strumenti`}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Strumenti', url: `${SITE_URL}/strumenti` },
        ]}
      />

      <Section className="pt-8">
        <Breadcrumbs items={[{ label: 'Strumenti' }]} />

        <div className="mt-8 max-w-3xl">
          <span className="text-eyebrow">Strumenti Travelliniwithus</span>
          <h1 className="mt-5 font-serif font-medium leading-[1.05] tracking-tight text-[var(--color-ink)] text-[clamp(2.5rem,5vw+0.5rem,5.5rem)]">
            Pianifica meglio.
            <br />
            <span className="italic text-black/55">Stressati di meno.</span>
          </h1>
          <p className="mt-7 text-body-editorial">
            Quattro strumenti per le due domande pre-viaggio che ricorrono di piu: quando partire e
            quanto costa davvero. Le risposte vengono dai nostri field report — non da mercatini di
            promesse.
          </p>
        </div>
      </Section>

      {/* Calendar "Quando andare" (Marathon FASE 3.B 2026-05-18) — cross-link aware */}
      <Section className="pt-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex items-center gap-3">
            <Calendar className="text-[var(--color-accent)]" size={22} />
            <h2 className="text-2xl font-serif">Quando andare: il calendario R+B</h2>
          </div>
          <WhenToGoCalendar source="strumenti_page" onMonthSelect={handleWhenToGoCta} />
        </motion.div>
      </Section>

      {/* Calculator granulare per destinazione (Marathon FASE 3.C 2026-05-17) — cross-link target */}
      <Section className="pt-12">
        <div ref={costCalcRef} className="scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <MapPin className="text-[var(--color-accent)]" size={22} />
              <h2 className="text-2xl font-serif">Quanto costa: per destinazione</h2>
            </div>
            <DestinationCostCalculator
              source="strumenti_page"
              initialDest={costInitialDest}
              initialMonth={costInitialMonth}
            />
          </motion.div>
        </div>
      </Section>

      {/* Itinerary Builder MVP (Marathon FASE 3.A 2026-05-18) */}
      <Section className="pt-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex items-center gap-3">
            <CalendarDays className="text-[var(--color-accent)]" size={22} />
            <h2 className="text-2xl font-serif">Costruisci il tuo itinerario</h2>
          </div>
          <ItineraryBuilder source="strumenti_page" />
        </motion.div>
      </Section>

      {/* Calculator generico (fallback per destinazioni non ancora in catalogo) */}
      <Section className="pt-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex items-center gap-3">
            <Wallet className="text-[var(--color-accent)]" size={22} />
            <h2 className="text-2xl font-serif">Calcolatore generico (per area)</h2>
          </div>
          <p className="mb-6 max-w-2xl text-body-editorial">
            Se la destinazione non e&apos; ancora nel catalogo specifico, usa il calcolatore
            generico per area geografica.
          </p>
          <BudgetCalculator source="strumenti_page" />
        </motion.div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {TOOL_LINKS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                to={tool.href}
                className="group flex items-center justify-between gap-5 rounded-[var(--radius-lg)] border border-black/5 bg-white p-7 transition-all hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-md"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-[var(--color-ink)] group-hover:text-[var(--color-accent-text)]">
                      {tool.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-black/55">{tool.description}</p>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="text-black/35 transition-transform group-hover:translate-x-1"
                />
              </Link>
            );
          })}
        </div>
      </Section>
    </PageLayout>
  );
}
