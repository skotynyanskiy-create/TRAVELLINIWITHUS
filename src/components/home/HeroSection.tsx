import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, BadgeCheck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import { BRAND_STATS, FEATURED_REEL } from '../../config/site';

const HERO_IMAGE = '/hero-adventure.jpg';
const REEL_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop';

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.06]);
  const heroOpacity = useTransform(heroScroll, [0, 0.82], [1, 0]);

  const reelUrl = FEATURED_REEL.url.trim();
  const reelEmbedUrl =
    reelUrl && reelUrl.includes('/reel/') ? `${reelUrl.replace(/\/?$/, '/')}embed/` : '';
  const showReel = Boolean(reelEmbedUrl);
  const reelThumbnail = FEATURED_REEL.thumbnail.trim();
  const showReelThumbnail = Boolean(reelThumbnail);
  const showPhonePreview = showReel || showReelThumbnail;
  const previewImage = reelThumbnail || REEL_FALLBACK_IMAGE;

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[94svh] w-full items-end overflow-hidden bg-ink pt-28 pb-14 md:min-h-[92svh] md:items-center md:pb-18 xl:min-h-[94svh]"
    >
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="h-full w-full object-cover object-center brightness-[0.94] saturate-[1.05]"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(17,17,17,0.18)_0%,rgba(17,17,17,0.28)_24%,rgba(17,17,17,0.52)_62%,rgba(17,17,17,0.68)_100%)]" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_28%),radial-gradient(circle_at_75%_20%,rgba(196,164,124,0.22),transparent_34%),linear-gradient(90deg,rgba(17,17,17,0.52)_0%,rgba(17,17,17,0.18)_48%,rgba(17,17,17,0.44)_100%)]" />
      <div className="absolute inset-0 z-[1] opacity-15 bg-topo" />

      {/* Text content — left half on desktop */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-6 text-white md:px-12"
        style={{ opacity: heroOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl lg:max-w-[52%]"
        >
          {/* Eyebrow badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/25 px-4 py-2 backdrop-blur-md">
            <BadgeCheck size={14} className="text-[var(--color-gold)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/88 sm:text-xs">
              Rodrigo & Betta / Travelliniwithus
            </span>
          </div>

          {/* Headline */}
          <h1 className="max-w-3xl text-5xl font-serif font-medium leading-[0.9] tracking-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)] sm:text-6xl md:text-7xl xl:text-[6.5rem]">
            Posti particolari, vissuti davvero.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/86 drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)] md:text-lg">
            Guide, idee weekend e luoghi insoliti raccontati da Rodrigo & Betta dopo averli provati
            sul serio.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              to="/destinazioni"
              variant="cta"
              size="lg"
              className="group h-14 min-w-[240px] rounded-lg shadow-[0_0_30px_rgba(196,164,124,0.24)] sm:h-16 sm:min-w-[260px]"
            >
              <span className="text-sm font-bold uppercase tracking-widest">
                Esplora l'archivio
              </span>
              <ArrowRight
                size={20}
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </Button>
            <Button
              to="/chi-siamo"
              variant="outline-light"
              size="lg"
              className="h-14 min-w-[240px] rounded-lg bg-black/15 sm:h-16 sm:min-w-[260px]"
            >
              <span className="text-sm font-bold uppercase tracking-widest">Scopri il metodo</span>
            </Button>
          </div>

          <div className="mt-5 flex max-w-2xl flex-col gap-3 border-t border-white/12 pt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 sm:flex-row sm:items-center sm:gap-4">
            <span>
              {BRAND_STATS.instagramFollowers} Instagram · {BRAND_STATS.destinationsExplored}{' '}
              destinazioni · {BRAND_STATS.yearsOfTravel} anni di viaggi
            </span>
            <Link
              to="/collaborazioni"
              className="w-fit text-[var(--color-gold)] underline underline-offset-4 transition-colors hover:text-white"
            >
              Media kit e collaborazioni
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Reel preview — desktop only */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-0 top-0 bottom-0 z-10 hidden w-[38%] items-center justify-center pr-8 lg:flex xl:pr-16"
      >
        <div className="w-full max-w-[292px] rounded-lg border border-white/14 bg-black/32 p-3 shadow-[0_28px_70px_rgba(0,0,0,0.38)] backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/72">
              Ultimo reel Instagram
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
          </div>

          <div className="relative aspect-[9/12.5] overflow-hidden rounded-lg bg-ink">
            {showReel ? (
              <iframe
                src={reelEmbedUrl}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                title="Ultimo reel Instagram"
              />
            ) : (
              <img
                src={previewImage}
                alt={FEATURED_REEL.caption}
                className="h-full w-full object-cover object-center"
              />
            )}
            {!showPhonePreview && (
              <div className="absolute inset-0 flex items-end bg-gradient-to-b from-black/10 via-black/5 to-black/72 p-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                    Spazio reel
                  </span>
                  <p className="mt-2 max-w-[12rem] text-sm font-semibold leading-snug text-white">
                    Pronto per l'ultimo contenuto Instagram.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-white/10 pt-3">
            <a
              href={reelUrl || 'https://www.instagram.com/travelliniwithus/'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/72 transition-colors hover:text-[var(--color-gold)]"
            >
              Apri su Instagram <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator — desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/70">
          Scorri
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-10 w-6 justify-center rounded-full border border-white/28 pt-2"
        >
          <div className="h-2 w-0.5 rounded-full bg-white/80" />
        </motion.div>
      </motion.div>
    </section>
  );
}
