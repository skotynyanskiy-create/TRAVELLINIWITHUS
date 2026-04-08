import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Compass, CornerDownRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import type { HomeContent, HomeProofItem } from '../../config/siteContent';

const HERO_IMAGE = '/hero-adventure.jpg';

const pillarIcons = [Sparkles, Compass, CornerDownRight];

function ProofCard({ item, index }: { item: HomeProofItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75 + index * 0.08, duration: 0.55 }}
      className="proof-rail"
    >
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]/90">
        {item.label}
      </div>
      <div className="text-2xl font-serif leading-none text-white md:text-[2rem]">{item.value}</div>
      <p className="mt-3 text-sm leading-relaxed text-white/72">{item.context}</p>
    </motion.div>
  );
}

interface HeroSectionProps {
  content: HomeContent['hero'];
  proofRail: HomeContent['proofRail'];
}

export default function HeroSection({ content, proofRail }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.08]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] overflow-hidden bg-[var(--color-ink)] pb-10 pt-28 md:pb-12"
    >
      <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
        <img
          src={HERO_IMAGE}
          alt={content.artDirection.imageAlt}
          className="h-full w-full object-cover object-center brightness-[0.93] saturate-[1.02]"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <div className="absolute inset-0" style={{ background: 'var(--color-overlay-hero)' }} />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at top left, rgba(255,255,255,0.14), transparent 28%), radial-gradient(circle at 78% 18%, rgba(196,164,124,0.30), transparent 24%), linear-gradient(90deg, rgba(12,12,12,0.52) 0%, rgba(12,12,12,0.18) 45%, rgba(12,12,12,0.50) 100%)',
        }}
      />
      <div className="absolute inset-0 bg-topo opacity-10" />

      <motion.div
        style={{ opacity: heroOpacity }}
        className="relative z-10 mx-auto flex min-h-[calc(100svh-7rem)] max-w-7xl flex-col justify-between px-6 md:px-8"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.72fr)] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/18 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[var(--color-gold)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/88 sm:text-xs">
                {content.eyebrow}
              </span>
            </div>

            <h1 className="mt-7 max-w-5xl text-5xl font-serif font-medium leading-[0.9] tracking-tight text-white drop-shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:text-6xl md:text-7xl lg:text-[5.8rem]">
              {content.titleMain}
              <span className="mt-3 block max-w-4xl font-sans text-[0.34em] font-medium uppercase leading-[1.18] tracking-[0.12em] text-white/90 sm:text-[0.3em]">
                {content.titleAccent}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/88 drop-shadow-[0_4px_18px_rgba(0,0,0,0.26)] sm:text-lg md:text-[1.1rem]">
              {content.description}
            </p>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/66 sm:text-[0.95rem]">
              {content.proofLine}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                to={content.ctaPrimary.link}
                variant="cta"
                size="lg"
                className="group h-14 min-w-[240px] rounded-full shadow-[0_0_32px_rgba(196,164,124,0.26)] sm:h-16 sm:min-w-[260px]"
              >
                <span className="text-sm font-bold uppercase tracking-widest">
                  {content.ctaPrimary.label}
                </span>
                <ArrowRight
                  size={18}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </Button>

              <Link
                to={content.ctaSecondary.link}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/82 transition-all hover:gap-3 hover:text-white"
              >
                {content.ctaSecondary.label}
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {content.quickPillars.map((item, index) => {
                const Icon = pillarIcons[index] ?? Sparkles;
                return (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[1.35rem] border border-white/10 bg-black/16 px-4 py-4 backdrop-blur-md"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/8 text-[var(--color-gold)]">
                      <Icon size={15} />
                    </div>
                    <p className="text-sm leading-relaxed text-white/74">{item}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="hidden self-end lg:block"
          >
            <div className="rounded-[2rem] border border-white/10 bg-black/28 p-6 text-white shadow-2xl backdrop-blur-2xl">
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]/88">
                {content.artDirection.shotIntent}
              </div>
              <p className="mt-5 text-lg font-serif leading-snug text-white">
                {content.artDirection.imageCaption}
              </p>
              <div className="mt-8 border-t border-white/10 pt-5 text-[11px] uppercase tracking-[0.22em] text-white/48">
                Overlay tone: {content.artDirection.overlayTone}
              </div>
            </div>
          </motion.aside>
        </div>

        <div className="mt-12">
          <div className="mb-4 flex items-center gap-3 text-white/74">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]/88">
              {proofRail.eyebrow}
            </span>
            <div className="h-px flex-1 bg-white/12" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {proofRail.items.map((item, index) => (
              <ProofCard key={`${item.label}-${index}`} item={item} index={index} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
