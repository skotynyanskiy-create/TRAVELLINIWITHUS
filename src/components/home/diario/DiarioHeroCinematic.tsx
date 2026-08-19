import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Compass, ShieldCheck, Sparkles, Star } from 'lucide-react';
import Button from '@/src/components/Button';
import MagneticWrapper from '@/src/components/MagneticWrapper';
import OptimizedImage from '@/src/components/OptimizedImage';
import { BRAND_CREDENTIALS, BRAND_STATS } from '@/src/config/site';

export default function DiarioHeroCinematic() {
  return (
    <section className="relative w-full border-b border-[var(--color-border)] bg-[var(--color-sand)] py-20 text-[var(--color-ink)] md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Top Minimalist Tag */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-ink-2)] shadow-xs"
        >
          <Sparkles size={13} className="text-[var(--color-accent-text)]" />
          <span>Rodrigo &amp; Betta · Travelliniwithus</span>
        </motion.div>

        {/* H1 Main Display Typography (Apple / Monocle style) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-4xl"
        >
          <h1 className="font-serif text-5xl font-normal leading-[1.04] tracking-tight text-[var(--color-ink)] sm:text-7xl lg:text-8xl">
            Posti che sembrano inventati.{' '}
            <span className="block font-serif italic text-[var(--color-accent-text)]">
              Ma ci siamo stati davvero.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-muted-fg)] sm:text-xl font-light">
            Proviamo di persona hotel di charme, trattorie segrete e borghi fuori rotta. Vi diciamo
            quanto costa, come ci si arriva e cosa sapere prima di partire.
          </p>

          {/* Minimalist Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticWrapper>
              <Button
                variant="cta"
                size="lg"
                to="/esplora"
                trackingId="diario_clean_hero_esplora"
                className="bg-[var(--color-ink)] text-white font-bold uppercase tracking-widest hover:bg-neutral-800 border-none shadow-lg px-8 py-4 text-xs"
              >
                <Compass size={18} className="mr-2" />
                Esplora l’Atlante
              </Button>
            </MagneticWrapper>

            <MagneticWrapper>
              <Button
                variant="outline"
                size="lg"
                to="/guida-in-regalo"
                trackingId="diario_clean_hero_biohub"
                className="border-[var(--color-border)] bg-white text-[var(--color-ink)] hover:border-[var(--color-ink)] px-8 py-4 text-xs font-bold uppercase tracking-widest"
              >
                Guida in regalo
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </MagneticWrapper>
          </div>
        </motion.div>

        {/* Big High-Resolution Featured Image (Clean Editorial Frame) */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white p-3 shadow-2xl"
        >
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-[var(--color-ink)] min-h-[320px]">
            <OptimizedImage
              src="/images/home-journal/hero-impossible.png"
              alt="Rodrigo e Betta sul campo"
              priority
              responsiveWidths={[320, 480, 768]}
              baseWidth={1080}
              sizes="(max-width: 1023px) 100vw, 90vw"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Floating Top Label */}
            <div className="absolute left-6 top-6 flex items-center gap-2">
              <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-ink)] backdrop-blur-md shadow-sm">
                Somma Vesuviana · Italia
              </span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-between gap-4 md:flex-row md:items-end text-white">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent-on-dark)]">
                  Ristorante a Tema Burton
                </span>
                <h3 className="mt-1 font-serif text-2xl font-normal leading-snug md:text-3xl">
                  The Burton Juice
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 backdrop-blur-md">
                  <Star
                    size={12}
                    className="fill-[var(--color-accent-on-dark)] text-[var(--color-accent-on-dark)]"
                  />{' '}
                  10/10 Esperienza
                </span>
                <span className="font-semibold text-[var(--color-accent-on-dark)]">
                  Verificato sul campo
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Official Credentials Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--color-border)] pt-8 text-xs font-medium text-neutral-500">
          <div className="flex items-center gap-2 text-[var(--color-ink)] font-semibold">
            <ShieldCheck size={16} className="text-[var(--color-accent-text)]" />
            <span>Posti verificati sul campo</span>
          </div>
          <span className="hidden md:inline text-neutral-300">·</span>
          <span className="inline-flex items-center gap-1.5 font-bold text-[var(--color-ink)]">
            <CheckCircle size={14} className="text-blue-600" />{' '}
            {BRAND_CREDENTIALS.metaVerifiedLabel}
          </span>
          <span className="hidden md:inline text-neutral-300">·</span>
          <span>{BRAND_CREDENTIALS.agcomLabel}</span>
          <span className="hidden md:inline text-neutral-300">·</span>
          <span className="font-bold text-[var(--color-accent-text)]">
            {BRAND_STATS.totalFollowers} Community
          </span>
        </div>
      </div>
    </section>
  );
}
