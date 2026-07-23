import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowUpRight, Play, CheckCircle2, X } from 'lucide-react';
import Button from '@/src/components/Button';
import OptimizedImage from '@/src/components/OptimizedImage';

export default function WowHomeHero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="relative w-full min-h-[90svh] overflow-hidden bg-[var(--color-ink-deep,#0b0805)] text-white">
      {/* Background Hero Photography */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src="/images/reels/reel-3-cover.webp"
          alt="Rodrigo e Betta a Volterra"
          priority
          className="h-full w-full object-cover brightness-[0.65] contrast-[1.08] scale-105 transition-transform duration-1000"
        />
        {/* Editorial Scrim Overlay */}
        <div className="twu-hero-scrim pointer-events-none absolute inset-0 z-[5]" />
      </div>

      {/* Magazine Issue Top Bar */}
      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 pt-24 text-xs font-semibold uppercase tracking-[0.24em] text-white/70 md:px-12 md:pt-28">
        <span>Issue 04 · Estate 2026</span>
        <span className="hidden sm:inline-block">Atlante dei Posti Particolari</span>
        <span className="text-[var(--color-accent,#c85a32)] font-bold">Rodrigo &amp; Betta</span>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-[75svh] max-w-7xl flex-col justify-center px-6 py-12 md:px-12">
        <div className="max-w-3xl">
          {/* Authentic Passport Stamp Seal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent,#c85a32)] bg-[var(--color-accent,#c85a32)]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-sand,#faf7f2)] backdrop-blur-md"
          >
            <CheckCircle2 size={14} className="text-[var(--color-accent,#c85a32)]" />
            100% Provati di Persona · Dati Verificati
          </motion.div>

          {/* Large Serif Title */}
          <h1 className="font-serif text-4xl font-normal leading-[1.05] text-[var(--color-sand,#faf7f2)] sm:text-6xl lg:text-7xl">
            Non i soliti posti. <br />
            <span className="italic text-[var(--color-accent,#c85a32)]">Quelli con un'anima.</span>
          </h1>

          {/* Subtitle / Deck */}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Siamo Rodrigo e Betta. Proviamo hotel di carattere, trattorie segrete e borghi fuori
            rotta. Vi diciamo quanto costa, per chi è e se merita davvero il viaggio.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button variant="cta" size="lg" to="/esplora" magnetic trackingId="wow_hero_esplora">
              Esplora i posti provati
              <ArrowUpRight size={18} className="ml-1" />
            </Button>
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md transition-all hover:bg-white hover:text-[var(--color-ink)]"
            >
              <Play size={14} className="fill-current" />
              Guarda il reel di copertina
            </button>
          </div>

          {/* Proof Badges Strip */}
          <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/15 pt-6 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[var(--color-accent)]" />
              <span>Volterra, Toscana</span>
            </div>
            <div className="h-3 w-px bg-white/20" />
            <div>Prezzi &amp; Tempi reali</div>
            <div className="h-3 w-px bg-white/20" />
            <div>0 Sponsorizzazioni nascoste</div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <div className="relative max-h-[85vh] w-full max-w-md overflow-hidden rounded-2xl bg-black shadow-2xl border border-white/20">
            <button
              type="button"
              onClick={() => setVideoOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black"
              aria-label="Chiudi video"
            >
              <X size={20} />
            </button>
            <video
              src="/video esempio/taverna.mp4"
              poster="/images/reels/reel-3-cover.webp"
              autoPlay
              loop
              controls
              className="w-full h-full object-cover"
            >
              <track kind="captions" />
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
