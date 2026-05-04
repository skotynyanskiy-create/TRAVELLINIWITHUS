import { useRef } from 'react';
import { motion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import { CONTACTS, FEATURED_REEL } from '../../config/site';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const HERO_IMAGE_DESKTOP = '/images/brand/couple-travel.png';
const HERO_IMAGE_MOBILE = '/images/hero-amalfi.png';
const REEL_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop';

const HERO_TITLE = 'Posti particolari che valgono davvero.';
const TRUST_PILLS = [
  'Vissuto prima di scritto',
  'Dettagli utili, zero marketing',
  'Criterio, non hype',
];

gsap.registerPlugin(ScrollTrigger);

function getInstagramEmbedUrl(url: string) {
  return url.includes('/reel/') ? `${url.replace(/\/?$/, '/')}embed/` : '';
}

function FeaturedReelPreview() {
  const reelUrl = FEATURED_REEL.url.trim();
  const reelEmbedUrl = getInstagramEmbedUrl(reelUrl);
  const reelThumbnail = FEATURED_REEL.thumbnail.trim();
  const hasConfiguredReel = Boolean(reelEmbedUrl);
  const hasConfiguredVisual = hasConfiguredReel || Boolean(reelThumbnail);
  const previewImage = reelThumbnail || REEL_FALLBACK_IMAGE;
  const instagramHref = reelUrl || CONTACTS.instagramUrl;

  const reelMessage = hasConfiguredVisual
    ? FEATURED_REEL.caption
    : 'Guarda il lato più immediato del progetto sul nostro profilo Instagram.';

  return (
    <motion.aside
      data-hero-reel
      className="w-full max-w-[21rem] justify-self-start lg:justify-self-end"
      aria-label="Ultimo reel Instagram"
    >
      <div className="rounded-lg border border-white/14 bg-black/24 p-3 shadow-[0_24px_64px_rgba(0,0,0,0.3)] backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between gap-4 px-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/72">
            Ultimo reel Instagram
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        </div>

        <div className="relative aspect-[9/12] overflow-hidden rounded-lg bg-ink">
          {hasConfiguredReel ? (
            <iframe
              src={reelEmbedUrl}
              className="absolute inset-0 h-full w-full"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              title="Ultimo reel Instagram"
            />
          ) : (
            <img
              src={previewImage}
              alt={FEATURED_REEL.caption || 'Preview Instagram Travelliniwithus'}
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
          )}

          <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-b from-black/8 via-black/4 to-black/72 p-5">
            <p className="max-w-[14rem] text-sm font-semibold leading-snug text-white">
              {reelMessage}
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 px-1 pt-3">
          <a
            href={instagramHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/68 transition-colors hover:text-[var(--color-accent)]"
          >
            Guarda su Instagram <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </motion.aside>
  );
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const root = heroRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 769px)',
          isMobile: '(max-width: 768px)',
        },
        (ctx) => {
          const conditions = ctx.conditions ?? { isDesktop: false, isMobile: true };
          const { isDesktop } = conditions;

          gsap.set('[data-hero-word]', { yPercent: 100, opacity: 0 });
          gsap.set('[data-hero-eyebrow]', { clipPath: 'inset(0 100% 0 0)' });
          gsap.set('[data-hero-paragraph]', { opacity: 0, y: 24 });
          gsap.set('[data-hero-cta]', { opacity: 0, y: 24 });
          gsap.set('[data-hero-pills]', { opacity: 0, y: 16 });
          gsap.set('[data-hero-reel]', { opacity: 0, x: 60 });

          const intro = gsap.timeline({
            defaults: { ease: 'power3.out' },
          });
          intro
            .to('[data-hero-eyebrow]', { clipPath: 'inset(0 0 0 0)', duration: 0.85 })
            .to(
              '[data-hero-word]',
              { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.05 },
              '-=0.5'
            )
            .to('[data-hero-paragraph]', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
            .to('[data-hero-pills]', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
            .to('[data-hero-cta]', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
            .to('[data-hero-reel]', { opacity: 1, x: 0, duration: 0.9 }, '-=0.6');

          if (isDesktop) {
            const scrub = gsap.timeline({
              scrollTrigger: {
                trigger: root,
                start: 'top top',
                end: '+=120%',
                pin: true,
                pinSpacing: true,
                pinType: 'transform',
                scrub: 0.6,
              },
            });

            scrub
              .to(
                '[data-hero-image]',
                {
                  scale: 1.08,
                  yPercent: -6,
                  ease: 'none',
                },
                0
              )
              .to(
                '[data-hero-overlay]',
                {
                  opacity: 0.55,
                  ease: 'none',
                },
                0
              )
              .to(
                '[data-hero-content]',
                {
                  opacity: 0,
                  y: -40,
                  ease: 'power1.in',
                },
                0.4
              );
          } else {
            gsap.to('[data-hero-image]', {
              scale: 1.04,
              ease: 'none',
              scrollTrigger: {
                trigger: root,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.4,
              },
            });
          }
        }
      );
    },
    { scope: heroRef, dependencies: [reducedMotion] }
  );

  const titleWords = HERO_TITLE.split(/\s+/);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[92svh] w-full items-center overflow-hidden bg-ink px-6 pb-12 pt-32 text-white md:px-12 md:pb-16 md:pt-28 xl:min-h-[94svh]"
    >
      <div data-hero-image className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 768px)" srcSet={HERO_IMAGE_MOBILE} />
          <img
            src={HERO_IMAGE_DESKTOP}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="h-full w-full object-cover object-center brightness-[0.96] saturate-[1.04]"
            referrerPolicy="no-referrer"
          />
        </picture>
      </div>

      <div
        data-hero-overlay
        className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(17,17,17,0.08)_0%,rgba(17,17,17,0.24)_34%,rgba(17,17,17,0.64)_100%)]"
        style={{ opacity: 0.18 }}
      />
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(17,17,17,0.78)_0%,rgba(17,17,17,0.46)_48%,rgba(17,17,17,0.2)_100%)]" />

      <div
        data-hero-content
        className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center lg:gap-16 xl:grid-cols-[minmax(0,1fr)_24rem]"
      >
        <div className="max-w-3xl">
          <span
            data-hero-eyebrow
            className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent)] sm:text-xs"
          >
            Rodrigo &amp; Betta / Travelliniwithus
          </span>

          <h1
            className="mt-5 max-w-4xl font-serif font-medium leading-[0.92] tracking-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
            style={{ fontSize: 'var(--text-display-1, clamp(3rem, 6vw + 1rem, 6.5rem))' }}
          >
            <span className="sr-only">{HERO_TITLE}</span>
            <span aria-hidden="true" className="flex flex-wrap gap-x-[0.28em] overflow-hidden">
              {titleWords.map((word, i) => (
                <span key={`${word}-${i}`} className="inline-block overflow-hidden">
                  <span data-hero-word className="inline-block">
                    {word}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <p
            data-hero-paragraph
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/86 drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)] md:text-xl"
          >
            Guide pratiche scritte da chi ha vissuto il viaggio. Atmosfera, dettagli utili e
            consigli che aiutano a capire se un posto merita davvero.
          </p>

          <div data-hero-pills className="mt-7 flex flex-wrap gap-2">
            {TRUST_PILLS.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/14 bg-white/8 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/78 backdrop-blur-sm"
              >
                {pill}
              </span>
            ))}
          </div>

          <div data-hero-cta className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              to="/destinazioni"
              variant="cta"
              size="lg"
              trackingId="home_hero_destinazioni"
              className="group h-14 min-w-[230px] rounded-lg shadow-[0_18px_44px_rgba(0,0,0,0.18)] sm:h-16"
            >
              <span className="text-sm font-bold uppercase tracking-widest">
                Scopri destinazioni
              </span>
              <ArrowRight
                size={20}
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </Button>

            <Link
              to="/#storie"
              className="inline-flex h-14 min-w-[230px] items-center justify-center rounded-lg border border-white/24 bg-black/5 px-8 text-sm font-bold uppercase tracking-widest text-white/82 transition-all duration-300 hover:border-white/60 hover:bg-white/10 hover:text-white sm:h-16"
            >
              Ultime storie
            </Link>
          </div>

          <p className="mt-6 max-w-xl text-xs font-semibold uppercase tracking-[0.18em] text-white/68">
            Scoperta, utilità e uno sguardo personale prima di prenotare o partire.
          </p>
        </div>

        <FeaturedReelPreview />
      </div>
    </section>
  );
}
