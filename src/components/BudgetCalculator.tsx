import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Wallet } from 'lucide-react';
import { trackEvent } from '../services/analytics';

type DestinationTier = 'italia' | 'europa' | 'asia' | 'americhe-africa';
type TripStyle = 'slow' | 'romantic' | 'outdoor' | 'design';

const DAILY_COST_MATRIX: Record<TripStyle, Record<DestinationTier, [number, number]>> = {
  slow: {
    italia: [80, 130],
    europa: [100, 180],
    asia: [50, 90],
    'americhe-africa': [70, 130],
  },
  romantic: {
    italia: [110, 180],
    europa: [140, 220],
    asia: [80, 150],
    'americhe-africa': [100, 170],
  },
  outdoor: {
    italia: [70, 120],
    europa: [90, 160],
    asia: [60, 110],
    'americhe-africa': [80, 150],
  },
  design: {
    italia: [180, 300],
    europa: [220, 380],
    asia: [150, 280],
    'americhe-africa': [200, 350],
  },
};

const FLIGHT_COSTS: Record<DestinationTier, [number, number]> = {
  italia: [60, 120],
  europa: [120, 250],
  asia: [450, 800],
  'americhe-africa': [550, 950],
};

const DESTINATION_LABELS: Record<DestinationTier, string> = {
  italia: 'Italia',
  europa: 'Europa',
  asia: 'Asia',
  'americhe-africa': 'Americhe / Africa',
};

const STYLE_LABELS: Record<TripStyle, string> = {
  slow: 'Slow & culturale',
  romantic: 'Romantico in coppia',
  outdoor: 'Avventura outdoor',
  design: 'Boutique & design',
};

interface BudgetCalculatorProps {
  /** Render senza wrapper / shadow per usarlo dentro altre sezioni. */
  embedded?: boolean;
  /** Source label for analytics. */
  source?: string;
}

export default function BudgetCalculator({
  embedded = false,
  source = 'budget_calculator',
}: BudgetCalculatorProps) {
  const [days, setDays] = useState(5);
  const [destination, setDestination] = useState<DestinationTier>('europa');
  const [style, setStyle] = useState<TripStyle>('slow');
  const [hasFired, setHasFired] = useState(false);

  const estimate = useMemo(() => {
    const [dailyMin, dailyMax] = DAILY_COST_MATRIX[style][destination];
    const [flightMin, flightMax] = FLIGHT_COSTS[destination];
    const min = dailyMin * days + flightMin;
    const max = dailyMax * days + flightMax;
    return { min, max, dailyMin, dailyMax, flightMin, flightMax };
  }, [days, destination, style]);

  const handleEstimate = () => {
    if (hasFired) return;
    setHasFired(true);
    trackEvent('budget_calculator_estimate', {
      source,
      days,
      destination,
      style,
      min: estimate.min,
      max: estimate.max,
    });
  };

  const containerClass = embedded
    ? 'w-full'
    : 'rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm md:p-12';

  return (
    <div className={containerClass} onMouseEnter={handleEstimate} onFocusCapture={handleEstimate}>
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
          <Wallet size={22} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
            Calcolatore budget viaggio
          </p>
          <h3 className="mt-2 text-3xl font-serif leading-tight">Quanto puo costarti davvero?</h3>
          <p className="mt-2 text-sm leading-relaxed text-black/55">
            Una stima indicativa basata sui nostri viaggi e su quelli verificati. Voli, alloggi,
            cibo e spostamenti inclusi.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
            Giorni
          </span>
          <input
            type="number"
            min={1}
            max={45}
            value={days}
            onChange={(event) =>
              setDays(Math.min(45, Math.max(1, Number(event.target.value) || 1)))
            }
            className="w-full rounded-full border border-black/10 bg-[var(--color-sand)] px-5 py-3 text-sm font-medium text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
            Area
          </span>
          <select
            value={destination}
            onChange={(event) => setDestination(event.target.value as DestinationTier)}
            className="w-full rounded-full border border-black/10 bg-[var(--color-sand)] px-5 py-3 text-sm font-medium text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
          >
            {(Object.keys(DESTINATION_LABELS) as DestinationTier[]).map((key) => (
              <option key={key} value={key}>
                {DESTINATION_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
            Stile
          </span>
          <select
            value={style}
            onChange={(event) => setStyle(event.target.value as TripStyle)}
            className="w-full rounded-full border border-black/10 bg-[var(--color-sand)] px-5 py-3 text-sm font-medium text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
          >
            {(Object.keys(STYLE_LABELS) as TripStyle[]).map((key) => (
              <option key={key} value={key}>
                {STYLE_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <motion.div
        layout
        className="mt-8 grid gap-5 rounded-[2rem] bg-[var(--color-accent-soft)] p-7 md:grid-cols-[1.05fr_0.95fr]"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
            Stima a testa
          </p>
          <p className="mt-3 font-serif text-5xl leading-none text-[var(--color-ink)] md:text-6xl">
            {estimate.min.toLocaleString('it-IT')}
            <span className="text-3xl"> -</span> {estimate.max.toLocaleString('it-IT')}
            <span className="ml-2 text-2xl text-black/55">EUR</span>
          </p>
          <p className="mt-3 text-sm text-black/55">
            Voli + alloggi + cibo + spostamenti, ipotesi conservative.
          </p>
        </div>
        <ul className="space-y-3 text-sm text-black/65">
          <li>
            <strong className="text-[var(--color-ink)]">Costo giornaliero:</strong>{' '}
            {estimate.dailyMin}-{estimate.dailyMax} EUR
          </li>
          <li>
            <strong className="text-[var(--color-ink)]">Voli a/r:</strong> {estimate.flightMin}-
            {estimate.flightMax} EUR
          </li>
          <li>
            <strong className="text-[var(--color-ink)]">Durata:</strong> {days} giorni
          </li>
        </ul>
      </motion.div>

      <div className="mt-6 flex items-center gap-2 text-xs text-black/40">
        <Sparkles size={12} className="text-[var(--color-accent)]" />
        <span>
          Stima orientativa. I costi reali dipendono da periodo, agilita nella prenotazione e gusto
          personale.
        </span>
      </div>
    </div>
  );
}
