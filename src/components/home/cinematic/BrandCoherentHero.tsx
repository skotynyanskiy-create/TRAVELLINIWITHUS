import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowRight, Map, Stamp, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import SchedaVerifica from '@/src/components/atlante/SchedaVerifica';
import { getContentById } from '@/src/config/contentLibrary';

const FEATURED_POSTO_ID = 'campania-burton-juice';

export default function BrandCoherentHero() {
  const [schedaOpen, setSchedaOpen] = useState(false);
  const featured = getContentById(FEATURED_POSTO_ID);

  return (
    <section className="relative w-full bg-[var(--color-sand,#faf7f2)] py-12 md:py-20 text-[var(--color-ink,#1a2b3c)] overflow-hidden border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          {/* Left Editorial Copy */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent,#c85a32)]/30 bg-[var(--color-accent,#c85a32)]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent,#c85a32)]">
              <Sparkles size={13} />
              Rodrigo &amp; Betta · Travelliniwithus
            </div>

            <h1 className="font-serif text-4xl font-normal leading-[1.06] text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
              Posti che sembrano inventati. <br />
              <span className="italic text-[var(--color-accent,#c85a32)]">
                Ma esistono davvero.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-muted-fg)] sm:text-lg">
              Siamo Rodrigo e Betta. Li proviamo prima di persona, poi vi diciamo se valgono davvero
              il viaggio — con prezzi reali, periodo giusto ed atmosfera.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#pagina-02"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-md transition-all hover:bg-[var(--color-accent,#c85a32)]"
              >
                Apri il registro <ArrowDown size={16} />
              </a>
              <Link
                to="/mappa"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-ink)] hover:text-[var(--color-accent)]"
              >
                Vai alla mappa <Map size={16} />
              </Link>
            </div>

            {/* Proof Signals */}
            <div className="mt-8 flex items-center gap-6 border-t border-[var(--color-border)] pt-5 text-xs font-semibold text-[var(--color-muted-fg)]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[var(--color-accent)]" />
                Esperienze reali
              </span>
              <span>·</span>
              <span>Costi trasparenti</span>
              <span>·</span>
              <span>Periodo consigliato</span>
            </div>

            {/* Verification Stamp Button & Drawer */}
            {featured && (
              <div className="mt-8">
                <button
                  type="button"
                  aria-expanded={schedaOpen}
                  onClick={() => setSchedaOpen((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent,#c85a32)] bg-[var(--color-sand)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent,#c85a32)] shadow-sm transition-all hover:bg-[var(--color-accent)] hover:text-white"
                >
                  <Stamp size={14} />
                  {schedaOpen ? 'Chiudi la scheda' : 'Provato — apri la scheda'}
                </button>

                {schedaOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-xl"
                  >
                    <SchedaVerifica item={featured} />
                    <Link
                      to={`/posto/${featured.id}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)] hover:underline"
                    >
                      Apri la scheda completa <ArrowRight size={15} />
                    </Link>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Right Tactile Cover Image & Handwritten Note */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[var(--radius-lg,20px)] border border-[var(--color-border)] bg-white p-3 shadow-xl">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-xl">
                <img
                  src="/images/home-journal/hero-impossible.png"
                  alt="Betta al Burton Juice"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-3 text-center text-xs font-serif italic text-[var(--color-muted-fg)]">
                The Burton Juice · Somma Vesuviana
              </p>
            </div>

            {/* Handwritten Note Sticker */}
            <div className="absolute -bottom-6 -left-6 max-w-xs rotate-[-3deg] rounded-2xl border border-[var(--color-border)] bg-[var(--color-sand,#faf7f2)] p-4 shadow-lg">
              <p className="font-serif text-sm italic leading-snug text-[var(--color-ink)]">
                "La strada giusta non è quella più breve."
              </p>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent,#c85a32)]">
                — Rodrigo &amp; Betta
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
