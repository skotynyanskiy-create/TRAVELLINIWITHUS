import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Instagram, Play, X } from 'lucide-react';
import { BRAND_CREDENTIALS, BRAND_STATS, CONTACTS } from '../config/site';
import { getPublishedReels, type ReelEntry } from '../config/reels';
import { trackEvent } from '../services/analytics';

interface InstaItem {
  image: string;
  type: 'reel' | 'post';
  caption: string;
  /** Alt descrittivo dell'immagine effettiva (per i placeholder brand la caption
      descrive un luogo non mostrato — l'alt deve descrivere ciò che si vede). */
  alt?: string;
  url: string;
  /** Span on lg+ grid. 'feature' = 2×2, 'tall' = 1×2, 'wide' = 2×1, 'square' = 1×1 */
  span: 'feature' | 'tall' | 'wide' | 'square';
  /** Path locale del video MP4 (solo per reel live dal manifest). */
  videoSrc?: string;
  /** ID stabile del reel per tracking. */
  reelId?: string;
}

const FALLBACK_ITEMS: InstaItem[] = [
  {
    image: '/images/brand/couple-travel.webp',
    type: 'reel',
    caption: "Catania prima dell'alba — i posti che nessuno ti racconta",
    alt: 'Rodrigo e Betta in viaggio',
    url: 'https://www.instagram.com/travelliniwithus/',
    span: 'feature',
  },
  {
    image: '/images/brand/about-editorial.webp',
    type: 'reel',
    caption: 'Tre rifugi delle Dolomiti che ti fanno cambiare idea',
    alt: 'Rodrigo e Betta durante la selezione dei contenuti',
    url: 'https://www.instagram.com/travelliniwithus/',
    span: 'tall',
  },
  {
    image: '/images/brand/collab-work.webp',
    type: 'reel',
    caption: 'Andalusia in 4 giorni: dove ci siamo persi davvero',
    alt: 'Travelliniwithus al lavoro su un contenuto travel',
    url: 'https://www.instagram.com/travelliniwithus/',
    span: 'square',
  },
  {
    image: '/images/brand/couple-travel.webp',
    type: 'post',
    caption: 'Mercato del pesce a Brucoli',
    alt: 'Rodrigo e Betta in viaggio',
    url: 'https://www.instagram.com/travelliniwithus/',
    span: 'square',
  },
  {
    image: '/images/brand/about-editorial.webp',
    type: 'post',
    caption: 'Tramonto in Triana, Siviglia',
    alt: 'Rodrigo e Betta durante la selezione dei contenuti',
    url: 'https://www.instagram.com/travelliniwithus/',
    span: 'wide',
  },
  {
    image: '/images/brand/collab-work.webp',
    type: 'reel',
    caption: 'Tre cose che nessuno ti dice prima di andare in Sicilia',
    alt: 'Travelliniwithus al lavoro su un contenuto travel',
    url: 'https://www.instagram.com/travelliniwithus/',
    span: 'tall',
  },
];

// Span pattern editoriale per i 5 reel live: feature, tall, square, wide, tall.
// Crea ritmo masonry asimmetrico stesso del fallback.
const REEL_SPAN_PATTERN: InstaItem['span'][] = ['feature', 'tall', 'square', 'wide', 'tall'];

function reelsToItems(reels: ReelEntry[]): InstaItem[] {
  return reels.map((reel, index) => ({
    image: reel.cover,
    type: 'reel' as const,
    caption: reel.caption,
    url: reel.instagramUrl ?? reel.tiktokUrl ?? CONTACTS.instagramUrl,
    span: REEL_SPAN_PATTERN[index] ?? 'square',
    videoSrc: reel.localPath,
    reelId: reel.id,
  }));
}

const SPAN_CLASS: Record<InstaItem['span'], string> = {
  feature: 'lg:col-span-2 lg:row-span-2',
  tall: 'lg:row-span-2',
  wide: 'lg:col-span-2',
  square: '',
};

export default function InstagramGrid() {
  const [openVideo, setOpenVideo] = useState<InstaItem | null>(null);

  const publishedReels = getPublishedReels();
  const items = publishedReels.length > 0 ? reelsToItems(publishedReels) : FALLBACK_ITEMS;
  const usingLiveReels = publishedReels.length > 0;

  // ESC chiude il modal video
  useEffect(() => {
    if (!openVideo) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenVideo(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'unset';
    };
  }, [openVideo]);

  const handleItemClick = (event: React.MouseEvent, item: InstaItem, position: number) => {
    if (item.videoSrc) {
      // Reel live → apri modal inline player
      event.preventDefault();
      setOpenVideo(item);
      trackEvent('reel_play', {
        source_page: window.location.pathname,
        reel_id: item.reelId,
        position,
      });
      return;
    }
    // Fallback: link esterno IG
    trackEvent('instagram_grid_click', { type: item.type, position });
  };

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              {usingLiveReels ? 'Reel del mese' : 'Visto su Instagram'}
            </span>
            <h2 className="text-3xl font-serif text-[var(--color-ink)] md:text-5xl">
              Reel e foto di Rodrigo &amp; Betta
            </h2>
            <p className="mt-3 text-sm text-black/55 md:text-base">
              <span className="font-semibold text-black/70">{CONTACTS.instagramHandle}</span> ·{' '}
              <span className="inline-flex items-center gap-1 font-medium text-[var(--color-accent-text)]">
                {BRAND_STATS.instagramFollowers} community · {BRAND_CREDENTIALS.metaVerifiedLabel}
              </span>
              <br className="sm:hidden" /> Posti particolari, dietro le quinte e short-form video.
            </p>
          </div>
          <a
            href={CONTACTS.instagramUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('instagram_grid_profile_click')}
            className="hidden items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:inline-flex"
          >
            <Instagram size={14} /> Guarda il profilo
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:auto-rows-[220px] lg:grid-cols-4 lg:gap-4 [grid-auto-flow:dense]">
          {items.map((item, idx) => (
            <motion.a
              key={item.reelId ?? idx}
              href={item.url}
              target={item.videoSrc ? undefined : '_blank'}
              rel="noreferrer"
              onClick={(event) => handleItemClick(event, item, idx)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.5 }}
              className={`group relative overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-ink)] ${
                item.type === 'reel' ? 'aspect-[9/14]' : 'aspect-[3/4]'
              } lg:aspect-auto lg:h-full ${SPAN_CLASS[item.span]}`}
            >
              <img
                src={item.image}
                alt={item.alt ?? item.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

              {item.type === 'reel' && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  <Play size={10} className="fill-white text-white" />
                  Reel
                </div>
              )}

              {/* Play badge centrale solo per reel live (cliccabili) */}
              {item.videoSrc && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[var(--color-ink)] shadow-lg">
                    <Play size={22} className="ml-1 fill-current" />
                  </span>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-3 text-white md:p-4">
                <p className="line-clamp-3 text-xs leading-tight md:text-sm">{item.caption}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <a
            href={CONTACTS.instagramUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('instagram_grid_profile_click_mobile')}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <Instagram size={14} /> Guarda il profilo
          </a>
        </div>
      </div>

      {/* Modal video player inline */}
      <AnimatePresence>
        {openVideo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenVideo(null)}
              className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Reel: ${openVideo.caption}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[210] flex items-center justify-center p-4"
            >
              <div className="relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-[var(--radius-lg)] bg-black shadow-2xl">
                <button
                  type="button"
                  onClick={() => setOpenVideo(null)}
                  aria-label="Chiudi reel"
                  className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)] transition-colors hover:bg-white"
                >
                  <X size={18} />
                </button>
                <video
                  src={openVideo.videoSrc}
                  poster={openVideo.image}
                  autoPlay
                  loop
                  playsInline
                  controls
                  aria-label={`Reel: ${openVideo.caption}`}
                  className="block max-h-[90vh] w-full bg-black"
                >
                  {/* Track captions vuoto ma presente per a11y (jsx-a11y/media-has-caption).
                      I reel Instagram non hanno VTT separato; la caption testuale e' gia
                      mostrata sotto il video (descrizione accessibile). */}
                  <track kind="captions" label="Italiano" srcLang="it" default />
                </video>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 text-white">
                  <p className="text-sm leading-snug md:text-base">{openVideo.caption}</p>
                  <a
                    href={openVideo.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('reel_open_instagram', { reel_id: openVideo.reelId })}
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
