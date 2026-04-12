import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Instagram, Compass } from 'lucide-react';
import Button from '../Button';
import OptimizedImage from '../OptimizedImage';
import { BRAND_STATS } from '../../config/site';

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <section ref={heroRef} className="relative h-[85vh] md:h-svh w-full flex items-center justify-center overflow-hidden bg-ink">
      <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
        <OptimizedImage
          // TODO(@travelliniwithus): PLACEHOLDER — servono foto hero principale — coppia Rodrigo e Betta in viaggio
          src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2560&auto=format&fit=crop"
          alt="Rodrigo e Betta in viaggio davanti a un paesaggio montano"
          priority
          className="h-full w-full object-cover"
          /* TODO: sostituire con foto reale del brand */
        />
        <div className="absolute inset-0 bg-linear-to-b from-[var(--color-ink)]/80 via-[var(--color-ink)]/55 to-[var(--color-ink)]" />
      </motion.div>

      <motion.div className="relative z-10 w-full max-w-5xl px-6 text-center" style={{ opacity: heroOpacity }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Social proof badge */}
          <div className="mx-auto mb-8 inline-flex items-center gap-3 rounded-full border border-[var(--color-gold)]/30 bg-white/10 px-8 py-3 backdrop-blur-md shadow-lg">
            <Instagram size={14} className="text-[var(--color-gold)]" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/90">
              {BRAND_STATS.instagramFollowers} travellini su Instagram
            </span>
          </div>

          {/* Gold ornament */}
          <div className="mx-auto mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-gold)]/60" />
            <Compass size={16} className="text-[var(--color-gold)]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-gold)]/60" />
          </div>

          <h1 className="text-5xl font-serif font-medium leading-none tracking-tight text-white md:text-8xl lg:text-9xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
            Posti particolari<br />
            <span className="font-script text-[0.65em] text-white/90">che valgono davvero.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg font-normal leading-relaxed text-white/90 md:text-xl md:mt-10 drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
            Posti veri, esperienze reali, budget reale. Guide scritte da chi quei luoghi li ha vissuti davvero — non solo fotografati.
          </p>

          <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <Button
              to="/destinazioni"
              variant="primary"
              size="lg"
              className="group h-16 min-w-[260px] rounded-full bg-[var(--color-accent)] text-white hover:brightness-110 transition-all duration-500 shadow-[0_0_30px_rgba(196,164,124,0.3)] hover:-translate-y-1"
            >
              <span className="text-sm font-bold uppercase tracking-widest">Scopri i posti</span>
              <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              to="/club"
              variant="outline"
              size="lg"
              className="h-16 min-w-[260px] rounded-full border-white/40 text-white hover:bg-white hover:text-ink transition-all duration-500 backdrop-blur-md"
            >
              <span className="text-sm font-bold uppercase tracking-widest">Entra nel Club</span>
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator — mouse icon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--color-gold)]">Scorri</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 justify-center rounded-full border border-[var(--color-gold)]/40 pt-2"
        >
          <div className="h-2 w-0.5 rounded-full bg-[var(--color-gold)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
