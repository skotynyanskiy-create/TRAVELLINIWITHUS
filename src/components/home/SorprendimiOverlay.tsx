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
            /* A colonna singola la larghezza della scheda non la sceglie il
               telefono, la sceglie quel che avanza in altezza: un 9:16 a
               tutta larghezza su 375x812 e' alto 610px e lascia 150px al
               testo. Qui la scheda e' larga quanto il reel puo' essere alto
               senza schiacciare la spiegazione — niente bande nere, niente
               ritaglio. Da md comanda l'altezza e la formula non serve piu'. */
            className="relative flex max-h-[94vh] w-full max-w-[max(16rem,min(22rem,calc((94vh-14.5rem)*9/16)))] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-white/15 bg-[var(--color-ink)] shadow-2xl md:max-h-[88vh] md:w-auto md:max-w-3xl md:flex-row"
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

            {/* Il reel in 9:16 vero, mai ritagliato.
                La regola: **un solo lato puo' comandare per volta.** Su telefono
                comanda la larghezza (`w-full` + `aspect`), su desktop comanda
                l'altezza (`h-[72vh]` + `w-auto`, che dentro un flex-row calcola
                la larghezza dal rapporto). Un `max-h` insieme a `w-full`
                accorcia il riquadro senza stringerlo: il rapporto salta e
                `object-cover` mangia la testa e i piedi dell'inquadratura.
                Il `max-h-[70vh]` sotto md e' solo una rete per le finestre
                basse — su un telefono in verticale non scatta mai (540px = 66vh
                a 375x812). */}
            <div className="relative aspect-[9/16] max-h-[70vh] w-full shrink-0 bg-black md:h-[72vh] md:max-h-none md:w-auto">
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
                    sizes="(min-width: 768px) 365px, 300px"
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
                  chiusura: senza, «Su invito» finisce sotto la X. Da md la X
                  passa sopra la colonna di testo e il vincolo cade. */}
              <span className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2 pr-14 md:pr-0">
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

            {/* La spiegazione: cosa e' quel posto, scritto da chi c'e' stato.
                Il testo scorre, i bottoni no: a colonna singola la descrizione
                piu' lunga li spingerebbe sotto il bordo dello schermo. */}
            <div className="flex min-h-0 flex-1 flex-col text-white md:w-[23rem] md:shrink-0 md:justify-center">
              {/* Su desktop il testo prende l'altezza che gli serve e il gruppo
                  si centra: a piena altezza una descrizione corta lasciava
                  mezza colonna di nero. `flex-initial` + `min-h-0` fa si' che,
                  se il testo e' lungo, scorra invece di sfondare il centraggio. */}
              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 pb-3 pt-5 md:flex-initial md:pr-14">
                <h2 className="font-serif text-2xl leading-tight">{item.title}</h2>
                <p className="text-sm leading-relaxed text-white/80">{item.description}</p>

                {item.value?.price && (
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent-on-dark)]">
                    {item.value.price}
                  </p>
                )}
              </div>

              <div className="relative shrink-0 border-t border-white/10 px-5 pb-4 pt-3.5 md:border-t-0 md:pt-1">
                {/* La sfumatura dice che sotto il taglio il testo continua.
                    Senza, la descrizione tronca sul bordo e sembra rotta. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-[var(--color-ink)] to-transparent"
                />
                {/* Griglia a due colonne, non `flex-wrap`: su una scheda
                    stretta i due pill sforavano la riga di tre pixel e si
                    impilavano, e la barra rubava 90px alla descrizione. */}
                <div className="grid grid-cols-2 items-center gap-2 md:flex md:flex-wrap">
                  <button
                    type="button"
                    onClick={estrai}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[var(--color-accent)] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-ink)] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:px-5 md:tracking-[0.16em]"
                  >
                    <Shuffle size={14} /> Un altro
                  </button>

                  <Link
                    to={`/mappa?posto=${item.id}`}
                    onClick={onChiudi}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/25 px-3 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition-colors hover:border-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:px-5 md:tracking-[0.16em]"
                  >
                    <Compass size={14} /> Vedi dov&apos;è
                  </Link>

                  <Link
                    to={`/posto/${item.id}`}
                    onClick={onChiudi}
                    className="col-span-2 inline-flex items-center gap-1 px-2 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    La scheda <ArrowUpRight size={13} />
                  </Link>
                </div>

                <p className="pt-2.5 text-[11px] uppercase tracking-[0.14em] text-white/40">
                  {visti.length} scoperti in questo giro
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
