import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Instagram, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import OptimizedImage from '@/src/components/OptimizedImage';
import { getPublishedReels, type ReelEntry } from '@/src/config/reels';
import { CONTENT_ITEMS } from '@/src/config/contentLibrary';
import { PARTNERSHIP_LABEL } from '@/src/types/content';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';

/**
 * La striscia dei reel come indice di prove, non come muro di video.
 *
 * Tre vincoli reali hanno deciso questa forma, non il gusto:
 *
 * 1. I video pesano 277 MB in `public/video` (singoli fino a 31 MB): nessun
 *    autoplay inline, il video parte solo su intento esplicito. La copertina
 *    deve quindi bastare da sola a far decidere se vale il click.
 * 2. Le copertine sono frame reali con la caption gia' impressa sopra: ogni
 *    testo che ci sovrapponiamo compete con quello. Percio' la card dice cio'
 *    che il frame NON dice — dove siamo, che rapporto c'era, se esiste la
 *    scheda — e mai cio' che il frame dice gia'.
 * 3. Trentaquattro card in scorrimento orizzontale sono otto schermate: senza
 *    frecce, snap e barra di avanzamento e' un vicolo cieco, non una galleria.
 *
 * Il timbro della partnership e' la firma della sezione: e' l'unico dato
 * popolato al 100% e l'unica cosa che un concorrente non puo' copiare senza
 * esserci stato. Tutto il resto resta silenzioso perche' quello parli.
 */

const CARD_WIDTH = 264;
const CARD_GAP = 20;

const ITEM_BY_ID = new Map(CONTENT_ITEMS.map((item) => [item.id, item]));

/** Dati che la copertina non mostra mai, presi dalla scheda collegata.
 *  Lookup pura, non un hook: viene chiamata dentro il map delle card. */
function reelContext(reel: ReelEntry) {
  const item = reel.postoId ? ITEM_BY_ID.get(reel.postoId) : undefined;
  return {
    item,
    // PARTNERSHIP_LABEL.organic e' stringa vuota: nessun timbro per l'organico,
    // che e' l'assenza di rapporto e non va dichiarata come se fosse un marchio.
    disclosure: item ? PARTNERSHIP_LABEL[item.partnership.kind] : '',
    hasScheda: Boolean(item),
  };
}

export default function HiggsfieldReelCarousel() {
  const reels = getPublishedReels();
  const [selectedReel, setSelectedReel] = useState<ReelEntry | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const openReel = (reel: ReelEntry) => {
    setVideoFailed(false);
    setSelectedReel(reel);
  };

  useEffect(() => {
    if (!selectedReel) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedReel(null);
    };
    window.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedReel]);

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  const scrollByCards = (direction: -1 | 1) => {
    scrollerRef.current?.scrollBy({
      left: direction * (CARD_WIDTH + CARD_GAP) * 2,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section className="overflow-hidden bg-[var(--color-ink)] py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent-on-dark)]">
              Ripreso sul posto
            </span>
            <h2 className="mt-3 max-w-xl font-serif text-3xl font-normal leading-tight md:text-5xl">
              {reels.length} posti, filmati mentre ci eravamo.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/65">
            Ogni frame è nostro. Sotto ciascuno trovi dove siamo stati e che rapporto avevamo con il
            posto — invito, pubblicità o niente.
          </p>
        </div>

        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory items-start gap-5 overflow-x-auto pb-6 pt-2 scrollbar-none"
        >
          {reels.map((reel) => {
            const { item, disclosure, hasScheda } = reelContext(reel);
            return (
              <motion.button
                key={reel.id}
                type="button"
                aria-label={`Apri il reel: ${reel.hook}. ${reel.location}`}
                whileHover={reducedMotion ? undefined : { y: -6 }}
                transition={{ duration: 0.25 }}
                onClick={() => openReel(reel)}
                style={{ width: CARD_WIDTH }}
                className="group relative aspect-[9/16] flex-shrink-0 snap-start overflow-hidden rounded-[var(--radius-lg)] border border-white/12 bg-black/50 text-left shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-on-dark)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink)]"
              >
                <OptimizedImage
                  src={reel.cover}
                  alt={reel.alt}
                  sizes="264px"
                  responsiveWidths={[320, 480]}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {/* Due velature invece di una: la copertina ha gia' del testo
                    impresso a meta' altezza, e un gradiente unico lo spegneva. */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

                {/* Dove siamo — il dato che il frame non dice mai. Il timbro gli
                    sta accanto, non sotto: in basso rubava la riga alla scheda e
                    andava a capo su due righe a 264px. */}
                <span className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                  <span className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 drop-shadow">
                    {reel.location}
                  </span>
                  {disclosure && (
                    <span className="-rotate-3 shrink-0 whitespace-nowrap rounded-sm border border-[var(--color-accent-on-dark)]/80 bg-black/45 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-on-dark)] backdrop-blur-sm">
                      {disclosure}
                    </span>
                  )}
                </span>

                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[var(--color-ink)] shadow-2xl">
                    <Play size={22} className="ml-0.5 fill-current" />
                  </span>
                </span>

                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-on-dark)]">
                    {reel.type}
                  </span>
                  <span className="mt-1 line-clamp-2 block font-serif text-base font-normal leading-snug text-white">
                    {reel.hook}
                  </span>

                  <span className="mt-3 flex items-center gap-2 whitespace-nowrap">
                    {hasScheda ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/75">
                        Scheda <ArrowUpRight size={11} />
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                        Solo reel
                      </span>
                    )}
                    {item?.value?.price && (
                      <>
                        <span aria-hidden="true" className="text-white/25">
                          ·
                        </span>
                        <span className="truncate text-[10px] font-bold text-white/75">
                          {item.value.price}
                        </span>
                      </>
                    )}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Avanzamento e frecce: trentaquattro card sono otto schermate. */}
        <div className="mt-2 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/15">
            <div
              className="h-px bg-[var(--color-accent-on-dark)] transition-[width] duration-150"
              style={{ width: `${Math.max(8, progress * 100)}%` }}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Reel precedenti"
              onClick={() => scrollByCards(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-on-dark)]"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Reel successivi"
              onClick={() => scrollByCards(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-on-dark)]"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedReel && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Reel: ${selectedReel.hook}`}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setSelectedReel(null)}
          >
            <motion.div
              initial={reducedMotion ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reducedMotion ? undefined : { scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] w-full max-w-[19rem] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-white/20 bg-black shadow-2xl"
            >
              <button
                ref={closeBtnRef}
                type="button"
                aria-label="Chiudi reel"
                onClick={() => setSelectedReel(null)}
                className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black hover:bg-white"
              >
                <X size={18} />
              </button>

              {/* Cinque reel su 34 dichiarano un localPath il cui file non esiste
                  (verificato: video.error === 4). Invece di lasciare un player
                  morto a 0:00, la copertina resta e la mancanza si dichiara. */}
              {videoFailed ? (
                <div className="relative shrink-0">
                  <OptimizedImage
                    src={selectedReel.cover}
                    alt={selectedReel.alt}
                    sizes="304px"
                    responsiveWidths={[320, 480]}
                    className="aspect-[9/16] w-full object-cover"
                  />
                  <p className="absolute inset-x-0 bottom-0 bg-black/75 px-5 py-3 text-xs leading-relaxed text-white/80 backdrop-blur-sm">
                    Il video di questo reel non è ancora caricato sul sito.
                    {selectedReel.instagramUrl ? ' Puoi guardarlo su Instagram.' : ''}
                  </p>
                </div>
              ) : (
                <video
                  key={selectedReel.id}
                  src={selectedReel.localPath}
                  poster={selectedReel.cover}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  preload="none"
                  onError={() => setVideoFailed(true)}
                  className="aspect-[9/16] w-full shrink-0 object-cover"
                >
                  <track kind="captions" />
                </video>
              )}

              {/* Il 9:16 lo detta la larghezza della scheda, e basta. Prima qui
                  c'era `max-h-[70vh] w-full`: l'altezza si accorciava, la
                  larghezza no, e `object-cover` tagliava testa e piedi
                  dell'inquadratura. */}
              <div className="min-h-0 flex-1 overflow-y-auto">
                <ReelDetails reel={selectedReel} onNavigate={() => setSelectedReel(null)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** Il pannello sotto al player: la scheda e' la destinazione, non una nota. */
function ReelDetails({ reel, onNavigate }: { reel: ReelEntry; onNavigate: () => void }) {
  const { item, disclosure } = reelContext(reel);

  return (
    <div className="space-y-4 bg-[var(--color-ink)] p-5 text-white">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-accent-on-dark)]">
          {reel.location}
        </p>
        {disclosure && (
          <span className="-rotate-3 shrink-0 rounded-sm border border-[var(--color-accent-on-dark)]/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-on-dark)]">
            {disclosure}
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-white/85">{reel.caption}</p>

      {item ? (
        <Link
          to={`/posto/${item.id}`}
          onClick={onNavigate}
          className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-white/10 px-4 py-3 transition-colors hover:bg-white/15"
        >
          <span>
            <span className="block font-serif text-base leading-tight text-white">
              {item.title}
            </span>
            <span className="mt-0.5 block text-[11px] uppercase tracking-[0.14em] text-white/60">
              Apri la scheda{item.value?.price ? ` · ${item.value.price}` : ''}
            </span>
          </span>
          <ArrowUpRight size={18} className="shrink-0 text-[var(--color-accent-on-dark)]" />
        </Link>
      ) : (
        <p className="rounded-[var(--radius-md)] bg-white/5 px-4 py-3 text-xs leading-relaxed text-white/55">
          Di questo posto non abbiamo ancora fatto la scheda. Per ora c'è solo il reel.
        </p>
      )}

      {reel.instagramUrl && (
        <a
          href={reel.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline"
        >
          <Instagram size={14} /> Vedi il post originale
        </a>
      )}
    </div>
  );
}
