import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Instagram, Play, Sparkles, X } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { CONTACTS } from '@/src/config/site';
import { getContentById } from '@/src/config/contentLibrary';
import { getPublishedReels, type ReelEntry } from '@/src/config/reels';
import { trackEvent } from '@/src/services/analytics';

export default function DiarioReelStream() {
  const [openReel, setOpenReel] = useState<ReelEntry | null>(null);
  const publishedReels = getPublishedReels();

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

  const handleReelClick = (reel: ReelEntry, position: number) => {
    setOpenReel(reel);
    trackEvent('reel_stream_play', {
      source_page: '/_dev/diario-preview',
      reel_id: reel.id,
      position,
    });
  };

  return (
    <section className="border-b border-[var(--color-border)] bg-white py-20 text-[var(--color-ink)] md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Header */}
        <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
              <Sparkles size={14} />
              Dai Reel alle Schede
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-[var(--color-ink)] md:text-5xl">
              I Reel più visti di Rodrigo &amp; Betta.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-muted-fg)] md:text-base">
              Guarda i video brevi e poi apri la scheda completa del posto con prezzi, dettagli e
              consigli di viaggio.
            </p>
          </div>

          <a
            href={CONTACTS.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)] md:mt-0"
          >
            <Instagram size={14} /> Guarda su Instagram
          </a>
        </div>

        {/* 9:16 Reel Cards Stream */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {publishedReels.map((reel, idx) => {
            const posto = reel.postoId ? getContentById(reel.postoId) : undefined;
            return (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative flex flex-col overflow-hidden rounded-[var(--radius-xl,20px)] border border-[var(--color-border)] bg-[var(--color-ink-deep)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Reel Cover Box */}
                <button
                  type="button"
                  onClick={() => handleReelClick(reel, idx)}
                  className="relative aspect-[9/14] w-full overflow-hidden text-left focus:outline-none"
                >
                  <img
                    src={reel.cover}
                    alt={reel.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="twu-bottom-scrim absolute inset-0" />

                  {/* Play badge */}
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                    <Play size={10} className="fill-white text-white" />
                    Reel
                  </div>

                  {/* Center Play Circle */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[var(--color-ink)] shadow-lg">
                      <Play size={20} className="ml-0.5 fill-current" />
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
                    <p className="line-clamp-2 text-xs font-medium leading-snug">{reel.hook}</p>
                    <p className="mt-1 text-[10px] text-white/70">{reel.location}</p>
                  </div>
                </button>

                {/* Bottom Card Action Link */}
                <div className="bg-white p-3 text-center">
                  {posto ? (
                    <Link
                      to={`/posto/${posto.id}`}
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent-text)] hover:underline"
                    >
                      Apri la Scheda <ArrowRight size={11} />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleReelClick(reel, idx)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)] hover:text-[var(--color-accent-text)]"
                    >
                      Riproduci Video <Play size={10} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Inline Modal Video Player */}
      <AnimatePresence>
        {openReel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenReel(null)}
              className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Reel: ${openReel.caption}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[210] flex items-center justify-center p-4"
            >
              <div className="relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-[var(--radius-xl,24px)] bg-black shadow-2xl">
                <button
                  type="button"
                  onClick={() => setOpenReel(null)}
                  aria-label="Chiudi reel"
                  className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)] transition-colors hover:bg-white"
                >
                  <X size={18} />
                </button>
                <video
                  src={openReel.localPath}
                  poster={openReel.cover}
                  autoPlay
                  loop
                  playsInline
                  controls
                  className="block max-h-[85vh] w-full bg-black"
                >
                  <track kind="captions" label="Italiano" srcLang="it" default />
                </video>
                <div className="bg-black p-4 text-white">
                  <p className="text-xs leading-relaxed text-white/90">{openReel.caption}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                    {openReel.postoId ? (
                      <Link
                        to={`/posto/${openReel.postoId}`}
                        onClick={() => setOpenReel(null)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-accent-text)] hover:underline"
                      >
                        Vai alla Scheda del Posto <ArrowRight size={13} />
                      </Link>
                    ) : (
                      <span className="text-[10px] text-white/50">{openReel.location}</span>
                    )}
                    <a
                      href={openReel.instagramUrl ?? CONTACTS.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white"
                    >
                      <Instagram size={12} /> IG
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
