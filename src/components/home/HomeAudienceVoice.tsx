import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import OptimizedImage from '@/src/components/OptimizedImage';
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
 * **Le tre foto sono la parte che conta.** Prima qui c'erano solo un titolo e
 * tre numeri: onesto ma magro, e su schermo largo restava mezza fascia vuota.
 * Ora ogni audience vede tre scatti veri presi dal proprio inventario — posti
 * per chi viaggia, consigli per chi parte coi bambini, collaborazioni per chi
 * valuta se ospitarci — e la stessa fotografia significa una cosa diversa a
 * seconda di chi la guarda: luogo, categoria o rapporto dichiarato.
 *
 * Niente immagini decorative: se un item non ha copertura reale non entra, e la
 * vetrina si accorcia da sola invece di riempirsi di riquadri vuoti.
 */
export default function HomeAudienceVoice() {
  const { audience } = useAudience();
  const reducedMotion = useReducedMotion();
  const { voice } = compositionFor(audience);

  const rivela = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      aria-labelledby="voce-audience"
      className="border-y border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
        <AnimatePresence mode="wait">
          {/* La chiave sull'audience e' cio' che rende visibile il cambio: si
              vede la pagina ricomporsi invece di trovarla gia' cambiata. */}
          <motion.div key={audience} exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
              <motion.div {...rivela(0)} className="flex flex-col justify-start">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                  {voice.eyebrow}
                </p>
                <h2
                  id="voce-audience"
                  className="mt-5 max-w-[16ch] text-balance font-serif text-[2rem] font-normal leading-[1.08] md:text-[3.25rem]"
                >
                  {voice.claim}
                </h2>
                <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-[var(--color-muted-fg)]">
                  {voice.support}
                </p>

                <Link
                  to={voice.cta.to}
                  className="group mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  {voice.cta.label}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>

              {/* Le prove visive. Sfalsate come scatti appoggiati sul tavolo:
                  il linguaggio della carta che il progetto usa gia' altrove. */}
              <div className="grid grid-cols-3 gap-3 md:gap-5">
                {voice.showcase.map((scatto, indice) => (
                  <motion.div
                    key={scatto.id}
                    {...rivela(0.08 + indice * 0.08)}
                    className={
                      indice === 1 ? 'lg:-translate-y-6' : indice === 2 ? 'lg:translate-y-4' : ''
                    }
                  >
                    <Link
                      to={scatto.to}
                      className="group block focus-visible:outline-none"
                      aria-label={`${scatto.title} — ${scatto.meta}`}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-ink-deep)] shadow-[var(--shadow-md)] transition-shadow group-hover:shadow-[var(--shadow-lg)] group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-accent)]">
                        {/* `coverFocusY` sposta il crop verso il basso: le
                            copertine sono frame TikTok con la didascalia
                            impressa in cima, e senza questo la vetrina mostra
                            pezzi di titolo tagliati a meta'. */}
                        <OptimizedImage
                          src={scatto.cover}
                          alt={scatto.alt}
                          sizes="(max-width: 1024px) 30vw, 200px"
                          responsiveWidths={[320, 480]}
                          style={{ objectPosition: `50% ${scatto.focusY}%` }}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                        <span className="absolute inset-x-3 bottom-3">
                          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent-on-dark)]">
                            {scatto.meta}
                          </span>
                          <span className="mt-1 flex items-start gap-1 font-serif text-sm leading-tight text-white">
                            <span className="line-clamp-2">{scatto.title}</span>
                            <ArrowUpRight
                              size={12}
                              className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                            />
                          </span>
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Le prove numeriche chiudono la fascia in orizzontale: contate dai
                dati, mai scritte a mano. */}
            <motion.dl
              {...rivela(0.32)}
              className="mt-12 grid grid-cols-3 gap-6 border-t border-[var(--color-border)] pt-8"
            >
              {voice.proof.map((prova) => (
                <div key={prova.label}>
                  <dt className="sr-only">{prova.label}</dt>
                  <dd>
                    <span className="block font-serif text-3xl leading-none tabular-nums md:text-[2.75rem]">
                      {prova.value}
                    </span>
                    <span className="mt-2.5 block max-w-[22ch] text-[11px] uppercase leading-snug tracking-[0.12em] text-[var(--color-muted-fg)]">
                      {prova.label}
                    </span>
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
