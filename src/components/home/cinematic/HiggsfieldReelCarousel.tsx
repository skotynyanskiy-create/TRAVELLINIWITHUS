import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Volume2, X, Instagram, Sparkles } from 'lucide-react';
import { getPublishedReels, type ReelEntry } from '@/src/config/reels';

export default function HiggsfieldReelCarousel() {
  const reels = getPublishedReels();
  const [selectedReel, setSelectedReel] = useState<ReelEntry | null>(null);

  return (
    <section className="bg-[var(--color-ink,#1a2b3c)] py-20 md:py-28 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent,#c85a32)]">
              <Sparkles size={14} />
              In Viaggio Con Noi · Reels &amp; Storie
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight md:text-5xl">
              I nostri Reel sul posto in 9:16.
            </h2>
          </div>
          <p className="mt-4 max-w-md text-sm text-white/70 md:mt-0 md:text-right">
            Clicca su una storia per ascoltare la dritta vocale di Rodrigo e Betta con atmosfera ed
            i costi veri.
          </p>
        </div>

        {/* Horizontal Reel Cards Stream */}
        <div className="flex items-center gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none">
          {reels.map((reel) => (
            <motion.div
              key={reel.id}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedReel(reel)}
              className="group relative h-[420px] w-[260px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[var(--radius-lg,16px)] bg-black/50 shadow-xl border border-white/15"
            >
              <img
                src={reel.cover}
                alt={reel.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                <Play size={10} className="fill-white" />
                Reel 9:16
              </span>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[var(--color-ink)] shadow-2xl">
                  <Play size={22} className="ml-1 fill-current" />
                </span>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent,#c85a32)]">
                  {reel.type} · {reel.zone}
                </span>
                <h4 className="mt-1 font-serif text-base font-normal leading-snug text-white line-clamp-2">
                  {reel.hook}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reel Lightbox */}
      <AnimatePresence>
        {selectedReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setSelectedReel(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-[var(--radius-lg,16px)] bg-black shadow-2xl border border-white/20"
            >
              <button
                type="button"
                onClick={() => setSelectedReel(null)}
                className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black hover:bg-white"
              >
                <X size={18} />
              </button>

              {/* I reel sono muti e senza parlato: una traccia vuota soddisfa
                  l'a11y senza promettere sottotitoli che non esistono. */}
              <video
                src={selectedReel.localPath}
                poster={selectedReel.cover}
                autoPlay
                loop
                muted
                controls
                className="w-full max-h-[85vh] object-cover"
              >
                <track kind="captions" />
              </video>

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5 text-white">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[var(--color-accent,#c85a32)]">
                  <Volume2 size={14} />
                  Consiglio Vocale · {selectedReel.location}
                </div>
                <p className="text-sm leading-relaxed text-white/90">{selectedReel.caption}</p>
                {selectedReel.instagramUrl && (
                  <a
                    href={selectedReel.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white underline-offset-4 hover:underline"
                  >
                    <Instagram size={14} /> Guarda su Instagram
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
