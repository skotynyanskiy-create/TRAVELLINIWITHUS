import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calculator,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  Bookmark,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';

interface BudgetTier {
  id: string;
  budget: number;
  label: string;
  tagline: string;
  reachEstimate: string;
  engagementEstimate: string;
  savesEstimate: string;
  deliverables: string[];
  recommendedFor: string;
}

const BUDGET_TIERS: BudgetTier[] = [
  {
    id: 'tier-1',
    budget: 1200,
    label: 'Focus Singolo / Highlight',
    tagline: 'Ideale per boutique hotel, singoli ristoranti o esperienze specifiche.',
    reachEstimate: '25.000 – 45.000',
    engagementEstimate: '6.5% – 8.5%',
    savesEstimate: '1.200 – 2.500',
    deliverables: [
      '1 Reel HD cinematografico (0-60s) con recensione autentica',
      'Sequenza di 3 Stories sul campo con link diretto e tag',
      'Geolocalizzazione e inserimento nella Mappa Interattiva',
      'Diritti di riuso foto/video sui canali proprietari del partner',
    ],
    recommendedFor: 'Boutique stay, ristoranti d’autore, prodotti singoli',
  },
  {
    id: 'tier-2',
    budget: 3000,
    label: 'Progetto Territoriale & Experience',
    tagline: 'Il formato più scelto da DMO, consorzi turistici e resort di charme.',
    reachEstimate: '75.000 – 130.000',
    engagementEstimate: '7.0% – 9.2%',
    savesEstimate: '4.500 – 8.000',
    deliverables: [
      '2 Video Reel HD coordinati (Focus Territorio + Experience Soggiorno)',
      'Sequenza di 8 Stories in-loco durante l’itinerario',
      'Articolo dedicato / Guida di destinazione permanente sul sito',
      'Inserimento in evidenza nella sezione Esplora & Mappa',
      'Kit contenuti grezzi (UGC) per le campagne adv del brand',
    ],
    recommendedFor: 'Ente del turismo, Consorzio borghi, Resort & SPA',
  },
  {
    id: 'tier-3',
    budget: 6000,
    label: 'Campagna Integrata 360°',
    tagline: 'Massima presenza multi-canale on-the-road con impatto prolungato.',
    reachEstimate: '180.000 – 300.000+',
    engagementEstimate: '8.0% – 11.0%',
    savesEstimate: '12.000 – 20.000+',
    deliverables: [
      '4 Video Reel / TikTok multi-formato a coprire l’intero itinerario',
      'Copertura Stories giornaliera durante l’intera permanenza (3-5 giorni)',
      'Pillar Article territoriale sul sito con posizionamento SEO duraturo',
      'Newsletter dedicata inviata alla community di viaggiatori',
      'Asset kit foto/video in alta risoluzione per la comunicazione del partner',
      'Licenza d’uso commerciale illimitata per Paid Media',
    ],
    recommendedFor: 'Campagne regionali, Brand travel & hospitality a livello nazionale',
  },
];

export default function RoiCalculatorWidget() {
  const [selectedTierId, setSelectedTierId] = useState<string>('tier-2');
  const selectedTier = BUDGET_TIERS.find((t) => t.id === selectedTierId) ?? BUDGET_TIERS[1];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--color-ink)]/10 bg-[var(--color-surface)] p-6 shadow-xl md:p-12 my-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent-soft)] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
            <Calculator size={13} />
            Calcolatore Stime &amp; Deliverables B2B
          </span>
          <h2 className="mt-4 font-serif text-3xl font-normal leading-tight md:text-4xl">
            Simula il valore ed i deliverables della tua collaborazione
          </h2>
          <p className="mt-3 text-base text-[var(--color-ink-2)] max-w-2xl mx-auto">
            Seleziona la tipologia di investimento per scoprire la composizione del pacchetto ed i
            volumi stimati di copertura.
          </p>
        </div>

        {/* Tier Selector Buttons */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {BUDGET_TIERS.map((tier) => {
            const isSelected = tier.id === selectedTierId;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTierId(tier.id)}
                className={`relative flex flex-col justify-between rounded-2xl p-6 text-left transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[var(--color-accent)] bg-[var(--color-sand)] shadow-md scale-[1.02]'
                    : 'border border-[var(--color-ink)]/12 bg-white hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-sand)]/40'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-xs">
                    <CheckCircle2 size={14} />
                  </span>
                )}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)]">
                    {tier.label}
                  </span>
                  <div className="mt-2 font-serif text-3xl font-bold text-[var(--color-ink)]">
                    €{tier.budget.toLocaleString('it-IT')}
                    <span className="text-xs font-sans font-normal text-[var(--color-ink-2)]">
                      {' '}
                      +IVA
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-ink-2)]">
                    {tier.tagline}
                  </p>
                </div>
                <div className="mt-6 border-t border-[var(--color-ink)]/10 pt-4 text-[10px] uppercase font-bold tracking-wider text-[var(--color-accent)]">
                  Destinato a: {tier.recommendedFor}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Detail Panel */}
        <motion.div
          key={selectedTier.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-ink-deep)] p-6 md:p-8 text-white shadow-2xl"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Deliverables Column */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-[var(--color-accent-on-dark)] mb-4">
                <Sparkles size={16} />
                <h3 className="font-serif text-xl text-white font-medium">Deliverables Inclusi</h3>
              </div>
              <ul className="space-y-3">
                {selectedTier.deliverables.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-xs leading-relaxed text-white/85"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent-on-dark)]">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Estimated Metrics Column */}
            <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/15 pt-6 lg:pt-0 lg:pl-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-on-dark)]">
                  Stime di Copertura
                </span>
                <p className="mt-1 text-[11px] text-white/60">
                  Basate sulle medie storiche Meta Insights &amp; TikTok Analytics.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-white/5 p-3.5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-[var(--color-accent-on-dark)]" />
                      <span className="text-xs text-white/80 font-medium">
                        Monthly Reach Stimata
                      </span>
                    </div>
                    <span className="font-serif text-lg font-bold text-white">
                      {selectedTier.reachEstimate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-white/5 p-3.5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-[var(--color-accent-on-dark)]" />
                      <span className="text-xs text-white/80 font-medium">Engagement Rate</span>
                    </div>
                    <span className="font-serif text-lg font-bold text-white">
                      {selectedTier.engagementEstimate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-white/5 p-3.5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <Bookmark size={16} className="text-[var(--color-accent-on-dark)]" />
                      <span className="text-xs text-white/80 font-medium">Salvataggi stimati</span>
                    </div>
                    <span className="font-serif text-lg font-bold text-white">
                      {selectedTier.savesEstimate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-white/50">
                  <HelpCircle size={12} />
                  <span>Stime orientative non vincolanti</span>
                </div>
                <Link
                  to="/contatti"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[var(--color-accent-hover)]"
                >
                  Richiedi Briefing
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grounded Disclaimer */}
        <p className="mt-6 text-center text-[11px] leading-relaxed text-[var(--color-ink-2)]/70 max-w-3xl mx-auto">
          * Note di Trasparenza: Le stime numeriche si basano sui risultati medi registrati dalle
          campagne 2024-2026 del brand Travelliniwithus (snapshot Meta Business Suite). Le
          performance effettive di ciascun contenuto variano in funzione dell’attrattività
          intrinseca della destinazione/struttura, della stagionalità e dell’interesse naturale
          mostrato dalla community.
        </p>
      </div>
    </section>
  );
}
