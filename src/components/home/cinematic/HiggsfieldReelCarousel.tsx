import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Instagram, Sparkles, ExternalLink } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import OptimizedImage from '@/src/components/OptimizedImage';
import { getPublishedReels, type ReelEntry } from '@/src/config/reels';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';

export default function HiggsfieldReelCarousel() {
  const reels = getPublishedReels();
  const [selectedReel, setSelectedReel] = useState<ReelEntry | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

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

  return (
    <section className="overflow-hidden bg-[var(--color-ink,#1a2b3c)] py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent-on-dark)]">
              <Sparkles size={14} />
              In Viaggio Con Noi · Reels
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight md:text-5xl">
              I nostri Reel sul posto in 9:16.
            </h2>
          </div>
          <p className="mt-4 max-w-md text-sm text-white/70 md:mt-0 md:text-right">
            Apri un reel per il video locale. Se esiste la scheda sul sito, la trovi sotto al
            player.
          </p>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none">
          {reels.map((reel) => (
            <motion.div
              key={reel.id}
              role="button"
              tabIndex={0}
              aria-label={`Apri reel: ${reel.hook}`}
              whileHover={reducedMotion ? undefined : { y: -4 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedReel(reel)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedReel(reel);
                }
              }}
              className="group relative h-[420px] w-[260px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[var(--radius-lg,16px)] border border-white/15 bg-black/50 shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-ink)]"
            >
              <OptimizedImage
                src={reel.cover}
                alt={reel.alt}
                sizes="260px"
                responsiveWidths={[320, 480]}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                <Play size={10} className="fill-white" />
                Reel 9:16
              </span>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[var(--color-ink)] shadow-2xl">
                  <Play size={22} className="ml-1 fill-current" />
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent,#c85a32)]">
                  {reel.type} · {reel.zone}
                </span>
                <h3 className="mt-1 line-clamp-2 font-serif text-base font-normal leading-snug text-white">
                  {reel.hook}
                </h3>
              </div>
            </motion.div>
          ))}
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
              className="relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-[var(--radius-lg,16px)] border border-white/20 bg-black shadow-2xl"
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

              <video
                src={selectedReel.localPath}
                poster={selectedReel.cover}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="max-h-[70vh] w-full object-cover"
              >
                <track kind="captions" />
              </video>

              <div className="space-y-3 bg-[var(--color-ink)] p-5 text-white">
                <p className="text-sm leading-relaxed text-white/90">{selectedReel.caption}</p>
                <div className="flex flex-wrap gap-3">
                  {selectedReel.postoId && (
                    <Link
                      to={`/posto/${selectedReel.postoId}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-accent)] underline-offset-4 hover:underline"
                      onClick={() => setSelectedReel(null)}
                    >
                      <ExternalLink size={14} /> Apri la scheda sul sito
                    </Link>
                  )}
                  {selectedReel.instagramUrl && (
                    <a
                      href={selectedReel.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline"
                    >
                      <Instagram size={14} /> Instagram
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
