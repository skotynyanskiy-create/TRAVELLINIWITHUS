import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';

export default function WowTactileJournal() {
  const [activeTab, setActiveTab] = useState<'metodo' | 'promessa' | 'storia'>('metodo');

  return (
    <section className="bg-white py-20 md:py-28 text-[var(--color-ink)] overflow-hidden border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Left Column: Story & Method */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent,#c85a32)]">
              <BookOpen size={14} />
              Rodrigo &amp; Betta · Travelliniwithus
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight md:text-5xl">
              Come scegliamo e verifichiamo ogni posto.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-muted-fg)] md:text-lg">
              Non siamo un'agenzia né un aggregatore automatico. Siamo una coppia che viaggia, paga
              il conto e scrive su questo registro solo i luoghi che valgono davvero il ricordo.
            </p>

            {/* Interactive Tabs */}
            <div className="mt-8 flex flex-wrap gap-2 border-b border-[var(--color-border)] pb-4">
              {[
                { id: 'metodo' as const, label: '01. Il Metodo' },
                { id: 'promessa' as const, label: '02. La Promessa' },
                { id: 'storia' as const, label: '03. Chi Siamo' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] transition-all ${
                    activeTab === tab.id
                      ? 'bg-[var(--color-ink)] text-white shadow-sm'
                      : 'bg-[var(--color-sand)] text-[var(--color-muted-fg)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="mt-6 min-h-[160px]">
              <AnimatePresence mode="wait">
                {activeTab === 'metodo' && (
                  <motion.div
                    key="metodo"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-1 text-[var(--color-accent)]" size={20} />
                      <div>
                        <h4 className="font-bold text-sm">
                          Provato di persona prima di pubblicare
                        </h4>
                        <p className="text-xs text-[var(--color-muted-fg)]">
                          Ogni foto ed ogni consiglio nascono da una nostra visita reale.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="mt-1 text-[var(--color-accent)]" size={20} />
                      <div>
                        <h4 className="font-bold text-sm">Costi trasparenti e dettagliati</h4>
                        <p className="text-xs text-[var(--color-muted-fg)]">
                          Trascriviamo scontrini, prezzi a persona e periodo consigliato.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'promessa' && (
                  <motion.div
                    key="promessa"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-sm italic leading-relaxed text-[var(--color-ink)]">
                      "Se un posto non ci ha emozionato o se ha prezzi sproporzionati rispetto alla
                      qualità, semplicemente non entra nell'Atlante."
                    </p>
                    <span className="block text-xs font-bold text-[var(--color-accent)]">
                      — Rodrigo &amp; Betta
                    </span>
                  </motion.div>
                )}

                {activeTab === 'storia' && (
                  <motion.div
                    key="storia"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-xs leading-relaxed text-[var(--color-muted-fg)]">
                      Siamo una coppia di creator basati in Italia con la passione per il bello
                      accessibile, i borghi nascosti e l'ospitalità autentica.
                    </p>
                    <Link
                      to="/chi-siamo"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-accent)] hover:underline"
                    >
                      Leggi la nostra storia completa <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Visual Tactile Paper Card */}
          <div className="relative rounded-[var(--radius-lg,16px)] border border-[var(--color-border)] bg-[var(--color-sand,#faf7f2)] p-8 shadow-lg">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Registro di Campo #2026
              </span>
              <span className="rounded-full bg-[var(--color-accent)]/15 px-3 py-1 text-[10px] font-bold text-[var(--color-accent)]">
                Verificato
              </span>
            </div>

            <div className="my-6 space-y-4 font-mono text-xs text-black/80">
              <div className="flex justify-between">
                <span>POSTI ISPEZZIONATI:</span>
                <span className="font-bold">150+</span>
              </div>
              <div className="flex justify-between">
                <span>TASSI DI RACCOMANDAZIONE:</span>
                <span className="font-bold text-[var(--color-accent)]">98.4%</span>
              </div>
              <div className="flex justify-between">
                <span>BORGHI ED HOTEL TRACCIATI:</span>
                <span className="font-bold">14 Regioni</span>
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-4 text-center">
              <p className="font-serif text-lg italic text-[var(--color-ink)]">
                "La bellezza non ha bisogno di filtri falsi."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
