import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  CloudRain,
  Thermometer,
  Users,
  Wallet,
  ArrowRight,
} from 'lucide-react';
import { trackEvent } from '../services/analytics';
import {
  MONTH_NAMES_FULL,
  MONTH_NAMES_SHORT,
  SEASONAL_GUIDES,
  type SeasonalGuide,
  type Crowding,
} from '../config/seasonalGuide';

const CROWDING_LABEL: Record<Crowding, string> = {
  low: 'Bassa',
  medium: 'Media',
  high: 'Alta',
};

const CROWDING_DOTS: Record<Crowding, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

/**
 * Mappa temperatura a una sfumatura del background.
 * Scala neutra blue→sand→accent per leggibilita su sfondo bianco.
 */
function tempToColor(tempC: number): string {
  if (tempC < 5) return 'rgb(219 234 254)'; // blue-100 — freddo intenso
  if (tempC < 12) return 'rgb(207 250 254)'; // cyan-100 — freddo
  if (tempC < 18) return 'rgb(254 249 195)'; // yellow-100 — mite
  if (tempC < 24) return 'rgb(254 215 170)'; // orange-100 — caldo
  if (tempC < 28) return 'rgb(254 202 202)'; // red-100 — molto caldo
  return 'rgb(254 165 170)'; // rosso piu intenso — torrido
}

interface WhenToGoCalendarProps {
  /** Slug destinazione iniziale (default prima del catalogo). */
  initialSlug?: string;
  /** Source label per analytics. */
  source?: string;
  /** Callback opzionale: chiamato quando l'utente cambia destinazione (cross-link tool). */
  onDestinationChange?: (slug: string) => void;
  /** Callback opzionale: chiamato quando l'utente apre dettaglio mese — usato per
   *  cross-link al CostCalculator pre-popolato. */
  onMonthSelect?: (month: number, destSlug: string) => void;
}

/**
 * WhenToGoCalendar — widget 12-mesi visuale "Quando andare".
 *
 * Marathon FASE 3.B 2026-05-18.
 *
 * Layout Editorial Slow:
 * - Header con selettore destinazione + sintesi annuale R+B
 * - Strip 12 mesi: ogni cella mostra abbr mese + heatmap temp + bollino R+B
 * - Click su mese → dettaglio: temp, pioggia, affollamento, nota R+B, eventi
 * - Riepilogo "Mesi migliori" (R+B picks) + "Mesi da evitare"
 *
 * Coerente con DestinationCostCalculator: stesso set destinazioni baseline,
 * stessa lingua, stesso tono. Insieme formano la "decision toolkit" /strumenti.
 */
export default function WhenToGoCalendar({
  initialSlug = 'salento',
  source = 'when_to_go_calendar',
  onDestinationChange,
  onMonthSelect,
}: WhenToGoCalendarProps) {
  const destinations = useMemo(() => Object.values(SEASONAL_GUIDES), []);
  const [slug, setSlug] = useState(initialSlug);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const guide: SeasonalGuide | undefined = SEASONAL_GUIDES[slug];

  const selectedMonthData = useMemo(() => {
    if (!guide || selectedMonth === null) return null;
    return guide.months.find((m) => m.month === selectedMonth) ?? null;
  }, [guide, selectedMonth]);

  const handleDestChange = (newSlug: string) => {
    setSlug(newSlug);
    setSelectedMonth(null);
    trackEvent('when_to_go_destination_change', { destination: newSlug, source });
    onDestinationChange?.(newSlug);
  };

  const handleMonthSelect = (month: number) => {
    const nextMonth = selectedMonth === month ? null : month;
    setSelectedMonth(nextMonth);
    trackEvent('when_to_go_month_select', { destination: slug, month, source });
    if (nextMonth !== null) {
      onMonthSelect?.(nextMonth, slug);
    }
  };

  if (!guide) {
    return null;
  }

  return (
    <div className="rounded-[var(--radius-xl)] border border-black/8 bg-white p-8 shadow-[var(--shadow-md)] md:p-12">
      {/* Header */}
      <div className="mb-10">
        <span className="text-eyebrow inline-flex items-center gap-2">
          <Calendar size={14} /> Quando andare
        </span>
        <h2 className="mt-5 font-serif font-medium leading-[1.1] tracking-tight text-[var(--color-ink)] text-[clamp(1.75rem,3vw+0.5rem,2.75rem)]">
          Il calendario di chi ci e&apos; tornato
          <br />
          <span className="italic text-black/55">in ogni stagione.</span>
        </h2>
      </div>

      {/* Selettore destinazione */}
      <div className="mb-8">
        <label className="text-eyebrow block mb-3" htmlFor="when-dest-select">
          Destinazione
        </label>
        <select
          id="when-dest-select"
          value={slug}
          onChange={(e) => handleDestChange(e.target.value)}
          className="w-full rounded-[var(--radius-md)] border border-black/12 bg-white px-5 py-3.5 font-serif text-lg text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none md:max-w-md"
        >
          {destinations.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sintesi annuale R+B */}
      <p className="mb-10 text-body-editorial italic">&ldquo;{guide.yearSummary}&rdquo;</p>

      {/* Strip 12 mesi */}
      <div className="grid grid-cols-6 gap-2 md:grid-cols-12 md:gap-3">
        {guide.months.map((monthData) => {
          const isSelected = selectedMonth === monthData.month;
          const isAvoid = guide.avoidMonths.includes(monthData.month);
          const isBest = guide.bestMonths.includes(monthData.month);

          return (
            <button
              key={monthData.month}
              type="button"
              onClick={() => handleMonthSelect(monthData.month)}
              aria-pressed={isSelected}
              aria-label={`${MONTH_NAMES_FULL[monthData.month - 1]}: ${monthData.tempC}°C, affollamento ${CROWDING_LABEL[monthData.crowding].toLowerCase()}${isBest ? ', mese consigliato' : ''}${isAvoid ? ', mese da evitare' : ''}`}
              className={`group relative flex flex-col items-stretch rounded-[var(--radius-md)] border p-2.5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                isSelected
                  ? 'border-[var(--color-ink)] shadow-[var(--shadow-sm)]'
                  : 'border-black/8 hover:border-black/25'
              }`}
              style={{
                backgroundColor: tempToColor(monthData.tempC),
              }}
            >
              {/* Mese abbreviato */}
              <span className="text-eyebrow !text-[var(--color-ink)]">
                {MONTH_NAMES_SHORT[monthData.month - 1]}
              </span>

              {/* Temperatura */}
              <span className="mt-1.5 font-serif text-lg font-medium leading-none text-[var(--color-ink)]">
                {monthData.tempC}°
              </span>

              {/* Affollamento (dots) */}
              <span className="mt-2 flex gap-0.5" aria-hidden="true">
                {[1, 2, 3].map((dot) => (
                  <span
                    key={dot}
                    className={`h-1 w-1 rounded-full ${
                      dot <= CROWDING_DOTS[monthData.crowding]
                        ? 'bg-[var(--color-ink)]/70'
                        : 'bg-[var(--color-ink)]/15'
                    }`}
                  />
                ))}
              </span>

              {/* Bollini R+B */}
              {isBest && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-sm"
                  title="Mese consigliato"
                >
                  <CheckCircle2 size={11} strokeWidth={2.5} />
                </span>
              )}
              {isAvoid && !isBest && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[var(--color-ink)] shadow-sm ring-1 ring-[var(--color-ink)]/40"
                  title="Mese da evitare"
                >
                  <AlertTriangle size={10} strokeWidth={2.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-eyebrow !text-black/55">
        <span className="inline-flex items-center gap-2">
          <CheckCircle2 size={11} className="text-[var(--color-ink)]" /> Mesi consigliati R+B
        </span>
        <span className="inline-flex items-center gap-2">
          <AlertTriangle size={11} /> Da evitare
        </span>
        <span className="inline-flex items-center gap-2">
          <Users size={11} /> Affollamento (dots)
        </span>
        <span className="inline-flex items-center gap-2">
          <Thermometer size={11} /> Temperatura media (heatmap)
        </span>
      </div>

      {/* Dettaglio mese selezionato */}
      <AnimatePresence mode="wait">
        {selectedMonthData && (
          <motion.div
            key={`${slug}-${selectedMonth}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 overflow-hidden"
          >
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-sand)] p-7 md:p-9">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-serif font-medium leading-tight text-[var(--color-ink)] text-[clamp(1.5rem,2.5vw+0.5rem,2.25rem)]">
                  {MONTH_NAMES_FULL[selectedMonthData.month - 1]} in {guide.name}
                </h3>
                {guide.bestMonths.includes(selectedMonthData.month) && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-3 py-1 text-eyebrow !text-white">
                    <CheckCircle2 size={11} /> R+B consigliato
                  </span>
                )}
                {guide.avoidMonths.includes(selectedMonthData.month) && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-eyebrow ring-1 ring-[var(--color-ink)]/30">
                    <AlertTriangle size={11} /> Sconsigliato
                  </span>
                )}
              </div>

              {/* 3 metriche concrete */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <span className="text-eyebrow inline-flex items-center gap-1.5">
                    <Thermometer size={11} /> Temperatura media
                  </span>
                  <p className="mt-2 font-serif text-2xl text-[var(--color-ink)]">
                    {selectedMonthData.tempC}°C
                  </p>
                </div>
                <div>
                  <span className="text-eyebrow inline-flex items-center gap-1.5">
                    <CloudRain size={11} /> Giorni piovosi
                  </span>
                  <p className="mt-2 font-serif text-2xl text-[var(--color-ink)]">
                    {selectedMonthData.rainDays}
                    <span className="text-base text-black/45"> / mese</span>
                  </p>
                </div>
                <div>
                  <span className="text-eyebrow inline-flex items-center gap-1.5">
                    <Users size={11} /> Affollamento
                  </span>
                  <p className="mt-2 font-serif text-2xl text-[var(--color-ink)]">
                    {CROWDING_LABEL[selectedMonthData.crowding]}
                  </p>
                </div>
              </div>

              {/* Nota R+B */}
              {selectedMonthData.note && (
                <p className="mt-7 border-l-2 border-[var(--color-ink)] pl-5 text-body-editorial italic">
                  &ldquo;{selectedMonthData.note}&rdquo;
                </p>
              )}

              {/* Eventi */}
              {selectedMonthData.events && selectedMonthData.events.length > 0 && (
                <div className="mt-7">
                  <span className="text-eyebrow">Eventi notabili</span>
                  <ul className="mt-3 space-y-1.5 text-sm leading-snug text-black/70">
                    {selectedMonthData.events.map((event) => (
                      <li key={event} className="flex items-baseline gap-2">
                        <span className="text-[var(--color-ink)]">·</span>
                        <span>{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA cross-tool: calcola budget per questo mese (solo se callback fornito) */}
              {onMonthSelect && (
                <div className="mt-8 border-t border-black/10 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('when_to_go_cta_cost', {
                        destination: slug,
                        month: selectedMonthData.month,
                      });
                      onMonthSelect(selectedMonthData.month, slug);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-eyebrow !text-white transition-colors hover:bg-[var(--color-accent)]"
                  >
                    <Wallet size={13} />
                    Calcola budget per {MONTH_NAMES_FULL[selectedMonthData.month - 1].toLowerCase()}
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Riepilogo mesi top/avoid */}
      <div className="mt-10 grid gap-6 border-t border-black/8 pt-8 md:grid-cols-2">
        <div>
          <span className="text-eyebrow inline-flex items-center gap-2">
            <CheckCircle2 size={11} /> Mesi consigliati R+B
          </span>
          <p className="mt-3 font-serif text-lg leading-snug text-[var(--color-ink)]">
            {guide.bestMonths.map((m) => MONTH_NAMES_FULL[m - 1]).join(' · ')}
          </p>
        </div>
        {guide.avoidMonths.length > 0 && (
          <div>
            <span className="text-eyebrow inline-flex items-center gap-2">
              <AlertTriangle size={11} /> Mesi da evitare
            </span>
            <p className="mt-3 font-serif text-lg leading-snug text-[var(--color-ink)]">
              {guide.avoidMonths.map((m) => MONTH_NAMES_FULL[m - 1]).join(' · ')}
            </p>
          </div>
        )}
      </div>

      {/* Disclaimer + freshness */}
      <p className="mt-7 text-xs leading-relaxed text-black/55">
        Dati climatici medi 1991-2020. Affollamento e mesi consigliati: osservazione diretta R+B.
        Aggiornato: {guide.updatedAt}.
      </p>
    </div>
  );
}
