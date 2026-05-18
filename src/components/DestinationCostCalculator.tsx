import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../services/analytics';
import { DESTINATION_BASELINES, calculateBudget, type TravelStyle } from '../config/costBaselines';

const STYLE_OPTIONS: Array<{ id: TravelStyle; label: string; sub: string }> = [
  { id: 'lean', label: 'Essenziale', sub: 'B&B, trattorie, mezzi pubblici' },
  { id: 'medium', label: 'Equilibrato', sub: 'Hotel 3-4*, cene curate, auto' },
  { id: 'premium', label: 'Curato', sub: 'Boutique, ristoranti firma, esperienze' },
];

const MONTH_LABELS = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre',
];

interface DestinationCostCalculatorProps {
  embedded?: boolean;
  source?: string;
  /** Destinazione iniziale (slug). Controllabile via prop per cross-link tool. */
  initialDest?: string;
  /** Mese iniziale 1-12. Controllabile via prop per cross-link tool. */
  initialMonth?: number;
}

/**
 * DestinationCostCalculator — stima budget per destinazione specifica
 * con stagionalita e voci dettagliate.
 *
 * Marathon FASE 3.C 2026-05-17.
 *
 * Caratteristiche:
 * - 6 destinazioni baseline pillar Travellini (Salento, Sicilia, Dolomiti,
 *   Toscana, Sardegna, Lisbona)
 * - 3 stili (lean / medium / premium) × 4 voci (alloggio / cibo / trasporti
 *   / attivita) = 12 range per destinazione
 * - Moltiplicatore stagionale automatico (alta/spalla/bassa) dal mese scelto
 * - Mostra "alta stagione" warning quando applicabile
 * - Disclaimer chiaro: range NON garanzia, voli/traghetti esclusi, timestamp
 * - CTA al pillar article della destinazione + al Club
 *
 * Differenziatore vs BudgetCalculator generico esistente: granulare per
 * destinazione reale dove R+B hanno field report.
 */
export default function DestinationCostCalculator({
  embedded = false,
  source = 'destination_cost_calculator',
  initialDest,
  initialMonth,
}: DestinationCostCalculatorProps) {
  const destinations = useMemo(() => Object.values(DESTINATION_BASELINES), []);
  const [destSlug, setDestSlug] = useState<string>(
    initialDest ?? destinations[0]?.slug ?? 'salento'
  );
  const [days, setDays] = useState(5);
  const [style, setStyle] = useState<TravelStyle>('medium');
  const [month, setMonth] = useState(initialMonth ?? new Date().getMonth() + 1);
  const [hasFired, setHasFired] = useState(false);

  // Sync con prop quando cambia (cross-link tool: WhenToGoCalendar → CostCalculator).
  // Pattern adjust-state-during-render React 19 per evitare set-state-in-effect.
  const [prevInitialDest, setPrevInitialDest] = useState(initialDest);
  const [prevInitialMonth, setPrevInitialMonth] = useState(initialMonth);
  if (initialDest !== undefined && initialDest !== prevInitialDest) {
    setPrevInitialDest(initialDest);
    setDestSlug(initialDest);
  }
  if (initialMonth !== undefined && initialMonth !== prevInitialMonth) {
    setPrevInitialMonth(initialMonth);
    setMonth(initialMonth);
  }

  const result = useMemo(
    () => calculateBudget(destSlug, days, style, month),
    [destSlug, days, style, month]
  );
  const destination = DESTINATION_BASELINES[destSlug];

  // Fire analytics solo la prima interazione "completa" (post-input change).
  if (!hasFired && result && days >= 2) {
    setHasFired(true);
    trackEvent('cost_calculator_first_compute', {
      destination: destSlug,
      days,
      style,
      month,
      source,
    });
  }

  if (!destination || !result) {
    return null;
  }

  const containerClass = embedded
    ? ''
    : 'rounded-[var(--radius-xl)] border border-black/8 bg-white p-8 shadow-[var(--shadow-md)] md:p-12';

  return (
    <div className={containerClass}>
      <div className="mb-10">
        <span className="text-eyebrow inline-flex items-center gap-2">
          <Wallet size={14} /> Calcolo budget viaggio
        </span>
        <h2 className="mt-5 font-serif font-medium leading-[1.1] tracking-tight text-[var(--color-ink)] text-[clamp(1.75rem,3vw+0.5rem,2.75rem)]">
          Quanto costa davvero,
          <br />
          <span className="italic text-black/55">su una destinazione che conosciamo.</span>
        </h2>
        <p className="mt-5 text-body-editorial">
          Stima realistica per coppia su sei destinazioni dove abbiamo viaggiato ripetutamente.
          Range basato sui nostri field report — non e' una garanzia, ma e' la cifra che vi diremmo
          se ce lo chiedeste in DM.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[0.55fr_0.45fr]">
        {/* Form input */}
        <div className="space-y-8">
          {/* Destinazione */}
          <div>
            <label className="text-eyebrow block mb-3" htmlFor="dest-select">
              Destinazione
            </label>
            <select
              id="dest-select"
              value={destSlug}
              onChange={(e) => {
                setDestSlug(e.target.value);
                trackEvent('cost_calculator_destination_change', { destination: e.target.value });
              }}
              className="w-full rounded-[var(--radius-md)] border border-black/12 bg-white px-5 py-3.5 font-serif text-lg text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none"
            >
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} ({d.region})
                </option>
              ))}
            </select>
          </div>

          {/* Giorni */}
          <div>
            <label className="text-eyebrow flex justify-between mb-3" htmlFor="days-slider">
              <span>Durata</span>
              <span className="text-[var(--color-ink)]">
                {days} {days === 1 ? 'giorno' : 'giorni'}
              </span>
            </label>
            <input
              id="days-slider"
              type="range"
              min={2}
              max={14}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full accent-[var(--color-ink)]"
            />
            <div className="mt-2 flex justify-between text-eyebrow !text-black/45">
              <span>2gg</span>
              <span>14gg</span>
            </div>
          </div>

          {/* Mese */}
          <div>
            <label className="text-eyebrow flex justify-between mb-3" htmlFor="month-select">
              <span>
                <Calendar size={11} className="inline mr-1" /> Quando partite
              </span>
              {result.isHighSeason && (
                <span className="text-[var(--color-accent-text)]">Alta stagione</span>
              )}
            </label>
            <select
              id="month-select"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full rounded-[var(--radius-md)] border border-black/12 bg-white px-5 py-3.5 font-serif text-lg text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none"
            >
              {MONTH_LABELS.map((label, idx) => (
                <option key={label} value={idx + 1}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Stile */}
          <fieldset>
            <legend className="text-eyebrow block mb-3">Stile viaggio</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {STYLE_OPTIONS.map((opt) => {
                const isActive = style === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStyle(opt.id)}
                    aria-pressed={isActive}
                    className={`rounded-[var(--radius-md)] border px-4 py-3 text-left transition-all ${
                      isActive
                        ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white'
                        : 'border-black/10 bg-white text-[var(--color-ink)] hover:border-black/25'
                    }`}
                  >
                    <span className="font-serif text-base font-medium">{opt.label}</span>
                    <span
                      className={`mt-1 block text-xs ${isActive ? 'text-white/65' : 'text-black/55'}`}
                    >
                      {opt.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Risultato */}
        <AnimatePresence mode="wait">
          <motion.aside
            key={`${destSlug}-${days}-${style}-${month}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[var(--radius-lg)] bg-[var(--color-sand)] p-7 md:p-9"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[var(--color-accent)]" />
              <span className="text-eyebrow">Stima per coppia · {days}gg</span>
            </div>
            <p className="mt-5 font-serif font-medium leading-[0.95] tracking-tight text-[var(--color-ink)] text-[clamp(2rem,4vw+0.5rem,3.75rem)]">
              €{result.min.toLocaleString('it-IT')}
              <span className="text-black/35"> – </span>€{result.max.toLocaleString('it-IT')}
            </p>
            <p className="mt-2 text-eyebrow">
              {destination.name} · {MONTH_LABELS[month - 1]} ·{' '}
              {STYLE_OPTIONS.find((s) => s.id === style)?.label}
            </p>

            {result.isHighSeason && (
              <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-4">
                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-[var(--color-accent-text)]"
                />
                <p className="text-sm leading-snug text-[var(--color-ink)]">
                  In alta stagione i costi sono aumentati di un{' '}
                  <strong>{Math.round((result.multiplier - 1) * 100)}%</strong> rispetto al
                  baseline.
                </p>
              </div>
            )}

            <div className="mt-7 space-y-3 border-t border-black/8 pt-6">
              <p className="text-eyebrow mb-3">Cosa include (al giorno)</p>
              {[
                ['Alloggio', result.breakdown.alloggio],
                ['Cibo', result.breakdown.cibo],
                ['Trasporti locali', result.breakdown.trasporti],
                ['Attivita & ingressi', result.breakdown.attivita],
              ].map(([label, range]) => (
                <div
                  key={label as string}
                  className="flex items-baseline justify-between gap-3 text-sm"
                >
                  <span className="text-black/65">{label as string}</span>
                  <span className="font-serif text-base text-[var(--color-ink)]">
                    €{(range as [number, number])[0]} – €{(range as [number, number])[1]}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs leading-relaxed text-black/55">
              <strong>Non incluso:</strong> voli/traghetti per la destinazione. Aggiornato:{' '}
              {destination.updatedAt}.
            </p>

            {destination.notes && (
              <p className="mt-3 text-xs leading-relaxed text-black/65 italic">
                {destination.notes}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/esplora"
                onClick={() =>
                  trackEvent('cost_calculator_cta_explore', {
                    destination: destSlug,
                    min: result.min,
                    max: result.max,
                  })
                }
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-eyebrow text-white transition-colors hover:bg-[var(--color-accent)]"
              >
                Guide su {destination.name}
              </Link>
            </div>
          </motion.aside>
        </AnimatePresence>
      </div>
    </div>
  );
}
