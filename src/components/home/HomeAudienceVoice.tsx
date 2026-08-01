import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { useAudience } from '@/src/context/AudienceContext';
import { compositionFor } from '@/src/config/homeComposition';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';

/**
 * Il momento in cui il sito si gira verso chi sta guardando.
 *
 * Sta subito sotto l'hero — che resta costante per SEO e LCP — ed e' la prima
 * cosa che cambia davvero fra viaggiatori, family e brand: non l'ordine delle
 * sezioni, ma cosa il sito dichiara di essere per te.
 *
 * Le tre prove sono contate dai dati in `homeComposition.ts`, mai scritte a
 * mano: un numero in pagina che nessuno ricalcola diventa falso senza rumore.
 */
export default function HomeAudienceVoice() {
  const { audience } = useAudience();
  const reducedMotion = useReducedMotion();
  const { voice } = compositionFor(audience);

  return (
    <section
      aria-labelledby="voce-audience"
      className="border-y border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={audience}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                {voice.eyebrow}
              </p>
              <h2
                id="voce-audience"
                className="mt-4 max-w-[18ch] font-serif text-3xl font-normal leading-[1.12] text-balance md:text-[2.75rem]"
              >
                {voice.claim}
              </h2>
              <p className="mt-5 max-w-[52ch] leading-relaxed text-[var(--color-muted-fg)]">
                {voice.support}
              </p>

              <Link
                to={voice.cta.to}
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                {voice.cta.label}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            {/* Le prove: numeri grandi, etichette piccole. La densita' qui e'
                informazione, non decorazione — sono gli unici tre numeri che
                questa audience deve poter verificare da sola. */}
            <dl className="grid grid-cols-3 gap-6 self-end border-t border-[var(--color-border)] pt-8 md:gap-4">
              {voice.proof.map((proof) => (
                <div key={proof.label}>
                  <dt className="sr-only">{proof.label}</dt>
                  <dd>
                    <span className="block font-serif text-3xl leading-none tabular-nums md:text-4xl">
                      {proof.value}
                    </span>
                    <span className="mt-2 block text-[11px] uppercase leading-snug tracking-[0.12em] text-[var(--color-muted-fg)]">
                      {proof.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
