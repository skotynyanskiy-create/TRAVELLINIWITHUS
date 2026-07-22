import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Instagram, Play, X } from 'lucide-react';
import TiltCard from '@/src/components/TiltCard';
import OptimizedImage from '@/src/components/OptimizedImage';
import { getPublishedReels } from '@/src/config/reels';
import { catColor } from '@/src/config/categoryColors';
import { CONTACTS } from '@/src/config/site';
import { trackEvent } from '@/src/services/analytics';

interface PezzoForteProps {
  /** ID del reel da mettere in evidenza. Default: la taverna dei draghi. */
  reelId?: string;
  className?: string;
}

/**
 * "Il pezzo forte" — cover-story della home Atlante Vivo (spec §3).
 * Griglia asimmetrica 60/40: cover 4:5 a sinistra (TiltCard), blocco
 * editoriale a destra su sand. Il click sulla cover apre il reel in lightbox.
 */
export default function PezzoForte({
  reelId = 'reel-toscana-tavernal',
  className,
}: PezzoForteProps) {
  const reel = getPublishedReels().find((entry) => entry.id === reelId);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!reel) return null;

  const cc = catColor(reel.type);
  const [firstLetter, ...rest] = reel.caption;
  const externalUrl = reel.instagramUrl ?? reel.tiktokUrl ?? CONTACTS.instagramUrl;

  const openStory = () => {
    setOpen(true);
    trackEvent('reel_play', {
      source_page: window.location.pathname,
      reel_id: reel.id,
      surface: 'pezzo_forte',
    });
  };

  return (
    <section className={`bg-sand py-20 md:py-28 ${className ?? ''}`.trim()}>
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid items-center gap-10 md:gap-14 lg:grid-cols-[3fr_2fr]">
          {/* Cover 4:5 — sinistra */}
          <TiltCard maxTilt={5} className="w-full">
            <button
              type="button"
              onClick={openStory}
              aria-label={`Apri la storia: ${reel.hook}`}
              className="group relative block w-full aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-ink)] shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-2"
            >
              <OptimizedImage
                src={reel.cover}
                alt={reel.alt}
                priority
                width={880}
                height={1100}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 twu-card-scrim opacity-70" />

              <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                <Play size={10} className="fill-white text-white" />
                Reel
              </span>

              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[var(--color-ink)] shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Play size={26} className="ml-1 fill-current" />
                </span>
              </span>

              <span className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/85">
                  {reel.location}
                </span>
              </span>
            </button>
          </TiltCard>

          {/* Blocco editoriale — destra */}
          <div className="max-w-xl">
            <span
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)]"
              style={{ ['--cc' as string]: cc }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: 'var(--cc)' }}
                aria-hidden="true"
              />
              {reel.type} · {reel.zone}
            </span>

            <h2
              className="font-serif leading-[1.08] text-[var(--color-ink)]"
              style={{ fontSize: 'var(--text-h2)' }}
            >
              {reel.hook}
            </h2>

            <hr
              className="mt-6 mb-7 h-[3px] w-16 border-0"
              style={{ backgroundColor: cc }}
              aria-hidden="true"
            />

            <p className="text-[var(--color-muted-fg)]" style={{ fontSize: 'var(--text-body)' }}>
              <span className="drop-cap">{firstLetter}</span>
              {rest.join('')}
            </p>

            <button
              type="button"
              onClick={openStory}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-sand)]"
            >
              Apri la storia
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox video */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Reel: ${reel.hook}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[210] flex items-center justify-center p-4"
            >
              <div className="relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-[var(--radius-lg)] bg-black shadow-2xl">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Chiudi reel"
                  className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)] transition-colors hover:bg-white"
                >
                  <X size={18} />
                </button>
                <video
                  src={reel.localPath}
                  poster={reel.cover}
                  autoPlay
                  loop
                  playsInline
                  controls
                  aria-label={`Reel: ${reel.hook}`}
                  className="block max-h-[90vh] w-full bg-black"
                >
                  <track kind="captions" label="Italiano" srcLang="it" default />
                </video>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 text-white">
                  <p className="text-sm leading-snug md:text-base">{reel.caption}</p>
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('reel_open_instagram', { reel_id: reel.id })}
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
