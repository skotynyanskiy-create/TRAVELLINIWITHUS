import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Shuffle, Compass, ArrowUpRight } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import OptimizedImage from '@/src/components/OptimizedImage';
import { PARTNERSHIP_LABEL } from '@/src/types/content';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { prossimaSorpresa, type PostoSorpresa } from '@/src/lib/sorprendimi';

/**
 * «Portami in un posto a caso»: un reel vero, la spiegazione di chi c'e'
 * stato, e l'uscita sul globo.
 *
 * Tre scelte che vale la pena conoscere prima di modificarlo:
 *
 * 1. **La copertina prima, il video su tap.** I reel pesano in media 9,5 MB
 *    (il piu' grosso 30): partire da soli al caricamento sarebbe brutale su
 *    rete mobile. Si vede il frame, si preme, parte.
 * 2. **Niente MapLibre finche' non serve.** Il globo pesa ~1 MB e vive su una
 *    rotta lazy: qui c'e' solo un link a `/mappa?posto=<id>`, quindi il gesto
 *    veloce resta veloce e il globo se lo paga chi lo vuole.
 * 3. **Si mostra la descrizione, non un verdetto.** Il campo `review` e' vuoto
 *    su tutte le schede e il mestiere del brand e' spiegare il posto, non dargli
 *    un voto. `description` e' popolata su 29 schede su 29.
 */
export default function SorprendimiOverlay({
  aperto,
  onChiudi,
}: {
  aperto: boolean;
  onChiudi: () => void;
}) {
  const [sorpresa, setSorpresa] = useState<PostoSorpresa | null>(null);
  const [visti, setVisti] = useState<string[]>([]);
  const [videoAttivo, setVideoAttivo] = useState(false);
  const chiudiRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  const estrai = () => {
    const esito = prossimaSorpresa(visti);
    if (!esito) return;
    setVisti(esito.visti);
    setSorpresa(esito.sorpresa);
    setVideoAttivo(false);
  };

  // Prima estrazione all'apertura, e blocco dello scroll dietro l'overlay.
  useEffect(() => {
    if (!aperto) return;
    if (!sorpresa) estrai();

    const overflowPrec = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChiudi();
    };
    window.addEventListener('keydown', onKey);
    chiudiRef.current?.focus();

    return () => {
      document.body.style.overflow = overflowPrec;
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aperto]);

  const item = sorpresa?.item;
  const reel = sorpresa?.reel;
  const disclosure = item ? PARTNERSHIP_LABEL[item.partnership.kind] : '';
  const luogo = item
    ? [item.place.city, item.place.region ?? item.place.country].filter(Boolean).join(', ')
    : '';

  return (
    <AnimatePresence>
      {aperto && item && reel && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Un posto a caso: ${item.title}`}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          onClick={onChiudi}
          className="fixed inset-0 z-[260] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <motion.div
            key={item.id}
            initial={reducedMotion ? false : { scale: 0.96, y: 14, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={reducedMotion ? undefined : { scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-[var(--radius-lg)] border border-white/15 bg-[var(--color-ink)] shadow-2xl"
          >
            <button
              ref={chiudiRef}
              type="button"
              aria-label="Chiudi"
              onClick={onChiudi}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={18} />
            </button>

            {/* Il reel, in 9:16 come e' stato girato. Il tetto in vh e' piu'
                basso su telefono: a 375x812 un 9:16 pieno mangia lo spazio dei
                bottoni e «La scheda» finisce sotto il bordo. */}
            <div className="relative aspect-[9/16] max-h-[46vh] w-full shrink-0 bg-black sm:max-h-[56vh]">
              {videoAttivo ? (
                <video
                  src={reel.localPath}
                  poster={reel.cover}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="h-full w-full object-cover"
                >
                  <track kind="captions" />
                </video>
              ) : (
                <button
                  type="button"
                  onClick={() => setVideoAttivo(true)}
                  aria-label={`Riproduci il reel di ${item.title}`}
                  className="group relative block h-full w-full focus-visible:outline-none"
                >
                  <OptimizedImage
                    src={reel.cover}
                    alt={reel.alt}
                    sizes="448px"
                    responsiveWidths={[320, 480]}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/10">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[var(--color-ink)] shadow-2xl transition-transform group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-white">
                      <Play size={26} className="ml-1 fill-current" />
                    </span>
                  </span>
                </button>
              )}

              {/* `pr-14` tiene il timbro fuori dal raggio del pulsante di
                  chiusura: senza, «Su invito» finisce sotto la X. */}
              <span className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2 pr-14">
                <span className="truncate rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                  {luogo}
                </span>
                {disclosure && (
                  <span className="-rotate-3 shrink-0 whitespace-nowrap rounded-sm border border-[var(--color-accent-on-dark)]/80 bg-black/50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-on-dark)] backdrop-blur-sm">
                    {disclosure}
                  </span>
                )}
              </span>
            </div>

            {/* La spiegazione: cosa e' quel posto, scritto da chi c'e' stato. */}
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5 text-white">
              <h2 className="font-serif text-2xl leading-tight">{item.title}</h2>
              <p className="text-sm leading-relaxed text-white/80">{item.description}</p>

              {item.value?.price && (
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent-on-dark)]">
                  {item.value.price}
                </p>
              )}

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={estrai}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-ink)] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Shuffle size={14} /> Un altro
                </button>

                <Link
                  to={`/mappa?posto=${item.id}`}
                  onClick={onChiudi}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:border-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Compass size={14} /> Vedi dov&apos;è
                </Link>

                <Link
                  to={`/posto/${item.id}`}
                  onClick={onChiudi}
                  className="inline-flex items-center gap-1 px-2 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  La scheda <ArrowUpRight size={13} />
                </Link>
              </div>

              <p className="pt-1 text-[11px] uppercase tracking-[0.14em] text-white/40">
                {visti.length} scoperti in questo giro
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
