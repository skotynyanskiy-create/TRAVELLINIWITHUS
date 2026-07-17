import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Instagram, Play, X } from 'lucide-react';
import OptimizedImage from '@/src/components/OptimizedImage';
import { CONTACTS } from '@/src/config/site';
import { getPublishedReels, type ReelEntry } from '@/src/config/reels';
import { CAT_COLOR, CAT_SHORT_LABEL, catColor } from '@/src/config/categoryColors';
import type { ContentType } from '@/src/config/contentTaxonomy';
import { trackEvent } from '@/src/services/analytics';

interface ReelStripProps {
  reels?: ReelEntry[];
}

function videoSrcFor(reel: ReelEntry, index: number): string {
  return reel.localPath || `/video/reel-${index + 1}.mp4`;
}

export default function ReelStrip({ reels = getPublishedReels() }: ReelStripProps) {
  const prefersReducedMotion = useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
  });
  const [openReel, setOpenReel] = useState<{ reel: ReelEntry; index: number } | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // ESC chiude il lightbox + blocca lo scroll di fondo
  useEffect(() => {
    if (!openReel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenReel(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'unset';
    };
  }, [openReel]);

  const handlePlay = (reel: ReelEntry, index: number) => {
    setOpenReel({ reel, index });
    trackEvent('reel_play', {
      source_page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      reel_id: reel.id,
      position: index,
    });
  };

  if (reels.length === 0) return null;

  // Rubriche della riga-indice: solo i tipi mappati in CAT_COLOR, dedup in ordine di apparizione.
  const rubriche = reels.reduce<ContentType[]>((acc, reel) => {
    if (CAT_COLOR[reel.type] && !acc.includes(reel.type)) acc.push(reel.type);
    return acc;
  }, []);

  return (
    <section className="bg-[var(--color-ink)] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent)]">
                In questo numero
              </span>
              <h2 className="font-serif text-3xl text-[var(--color-sand)] md:text-5xl">
                I reel di Rodrigo &amp; Betta
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/70 md:text-base">
                Posti particolari, food insolito e dietro le quinte. Tocca per guardare il video.
              </p>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Reel precedenti"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Reel successivi"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Regola d'indice: conteggio reale + rubriche colorate, come il sommario di un numero. */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
              {reels.length} {reels.length === 1 ? 'storia' : 'storie'}
            </span>
            {rubriche.map((type) => (
              <span key={type} className="inline-flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: catColor(type) }}
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                  {CAT_SHORT_LABEL[type] ?? type}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Embla viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y gap-4">
            {reels.map((reel, index) => {
              const cc = catColor(reel.type);
              return (
                <div
                  key={reel.id}
                  className="min-w-0 flex-[0_0_78%] sm:flex-[0_0_44%] lg:flex-[0_0_31%] xl:flex-[0_0_23.5%]"
                >
                  <button
                    type="button"
                    onClick={() => handlePlay(reel, index)}
                    aria-label={`Guarda il reel: ${reel.hook} — ${reel.location}`}
                    className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-ink)] text-left"
                  >
                    <OptimizedImage
                      src={reel.cover}
                      alt={reel.alt}
                      width={405}
                      height={720}
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 24vw"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Scrim editoriale in fondo */}
                    <div className="twu-card-scrim pointer-events-none absolute inset-x-0 bottom-0 h-2/3" />

                    {/* Chip categoria: dot colorato + micro-label, testo bianco su scrim scuro */}
                    <div
                      className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 backdrop-blur-md"
                      style={{ ['--cc' as string]: cc }}
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: 'var(--cc)' }}
                      />
                      <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white">
                        {reel.type}
                      </span>
                    </div>

                    {/* Indice editoriale 01-05 — i 5 reel letti come sommario curato,
                        non come scarsità (thin-content friendly). */}
                    <span
                      aria-hidden="true"
                      className="dispatch-index-number dispatch-index-number--invert absolute right-3.5 top-3 text-right"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Play badge centrale */}
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/92 text-[var(--color-ink)] shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <Play size={22} className="ml-0.5 fill-current" />
                      </span>
                    </span>

                    {/* Copy in fondo: hook in serif + location meta */}
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <p className="font-serif text-base leading-snug md:text-lg">{reel.hook}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/75">
                        {reel.location}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={CONTACTS.instagramUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('reel_strip_profile_click')}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <Instagram size={15} /> Apri il profilo
          </a>
        </div>
      </div>

      {/* Lightbox video (click-to-play, MP4 locale) */}
      <AnimatePresence>
        {openReel && (
          <>
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenReel(null)}
              className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Reel: ${openReel.reel.hook}`}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[210] flex items-center justify-center p-4"
            >
              <div className="relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-[var(--radius-lg)] bg-black shadow-2xl">
                <button
                  type="button"
                  onClick={() => setOpenReel(null)}
                  aria-label="Chiudi reel"
                  className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)] transition-colors hover:bg-white"
                >
                  <X size={18} />
                </button>
                <video
                  src={videoSrcFor(openReel.reel, openReel.index)}
                  poster={openReel.reel.cover}
                  autoPlay
                  loop
                  playsInline
                  controls
                  aria-label={`Reel: ${openReel.reel.hook}`}
                  className="block max-h-[90vh] w-full bg-black"
                >
                  {/* Track vuoto ma presente per a11y (jsx-a11y/media-has-caption).
                      I reel non hanno VTT separato; la caption testuale e' sotto il video. */}
                  <track kind="captions" label="Italiano" srcLang="it" default />
                </video>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 text-white">
                  <p className="font-serif text-base leading-snug md:text-lg">
                    {openReel.reel.hook}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/70">
                    {openReel.reel.location}
                  </p>
                  <a
                    href={
                      openReel.reel.instagramUrl ?? openReel.reel.tiktokUrl ?? CONTACTS.instagramUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('reel_open_instagram', { reel_id: openReel.reel.id })}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-white/85 underline-offset-4 hover:underline"
                  >
                    <Instagram size={13} /> Vedi su Instagram
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
