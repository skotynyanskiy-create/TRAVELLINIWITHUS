import { ArrowRight, CheckCircle, Compass, ShieldCheck, Sparkles, Star } from 'lucide-react';
import Button from '@/src/components/Button';
import OptimizedImage from '@/src/components/OptimizedImage';
import { BRAND_CREDENTIALS, BRAND_STATS } from '@/src/config/site';

export default function CleanCuratedHero() {
  return (
    <section className="relative w-full overflow-hidden border-b border-[var(--color-border,#e5dcd0)] bg-[var(--color-sand,#faf7f2)] py-16 text-[var(--color-ink,#1a2b3c)] md:py-24">
      {/* Texture decorativa sottile in sottofondo */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#c85a32_1px,transparent_1px)] opacity-[0.035] [background-size:24px_24px]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Left Editorial Copy */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent,#c85a32)]/30 bg-[var(--color-accent,#c85a32)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent,#c85a32)] shadow-sm">
              <Sparkles size={14} className="motion-safe:animate-pulse" />
              <span>Rodrigo &amp; Betta · dal 2018</span>
            </div>

            <h1 className="font-serif text-4xl font-normal leading-[1.06] text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
              Posti che sembrano inventati.{' '}
              <span className="block font-serif italic text-[var(--color-accent,#c85a32)]">
                Ma ci siamo stati davvero.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-muted-fg,#546274)] sm:text-lg">
              Siamo Rodrigo e Betta. Proviamo di persona hotel di charme, trattorie segrete e borghi
              fuori rotta in tutto il mondo. Vi diciamo quanto costa, per chi è e se vale la pena
              partire.
            </p>

            {/* CTA Actions — no magnetic wrappers above the fold (INP/TBT) */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                variant="cta"
                size="lg"
                to="/esplora"
                trackingId="clean_hero_esplora"
                className="shadow-md"
              >
                <Compass size={18} className="mr-2" />
                Esplora l’Atlante
              </Button>

              <Button
                variant="outline"
                size="lg"
                to="/guida-in-regalo"
                trackingId="clean_hero_biohub"
              >
                Vieni con noi
                <ArrowRight size={16} className="ml-1.5" />
              </Button>
            </div>

            {/* Trust & Proof Strip — only canonical site.ts stats */}
            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-[var(--color-border,#e5dcd0)] pt-6 text-xs font-semibold text-[var(--color-muted-fg,#546274)]">
              <div className="flex items-center gap-1.5 text-[var(--color-ink)]">
                <ShieldCheck size={16} className="text-[var(--color-accent)]" />
                <span>{BRAND_STATS.destinationsExplored} destinazioni esplorate</span>
              </div>
              <span className="text-black/20">·</span>
              <span className="inline-flex items-center gap-1 font-bold text-[var(--color-ink)]">
                <CheckCircle size={13} className="text-blue-500" />{' '}
                {BRAND_CREDENTIALS.metaVerifiedLabel}
              </span>
              <span className="text-black/20">·</span>
              <span>{BRAND_CREDENTIALS.agcomLabel}</span>
              <span className="text-black/20">·</span>
              <span className="font-bold text-[var(--color-accent)]">
                {BRAND_STATS.totalFollowers} Community
              </span>
            </div>
          </div>

          {/* Right Photography Card — static wrapper (no tilt JS on LCP path) */}
          <div className="relative">
            <div className="overflow-hidden rounded-[var(--radius-xl,24px)] border border-[var(--color-border,#e5dcd0)] bg-white p-3.5 shadow-2xl">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[var(--color-ink-deep,#0b0805)]">
                <OptimizedImage
                  src="/images/home-journal/hero-impossible.webp"
                  alt="Rodrigo e Betta a Somma Vesuviana"
                  priority
                  width={768}
                  height={960}
                  sizes="(max-width: 1024px) 92vw, 42vw"
                  responsiveWidths={[320, 480, 768]}
                  className="h-full w-full object-cover"
                />
                <div className="twu-bottom-scrim absolute inset-0" />

                {/* Top Badge Overlay */}
                <div className="absolute left-4 top-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    <Compass size={11} className="text-[var(--color-accent)]" />
                    Somma Vesuviana · Italia
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-[var(--color-ink)] shadow-md backdrop-blur-md">
                    <Star
                      size={11}
                      className="fill-[var(--color-accent)] text-[var(--color-accent)]"
                    />
                    Scheda sul sito
                  </span>
                </div>

                {/* Bottom Overlay Text */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                    Ristorante a tema Tim Burton
                  </span>
                  <p className="mt-1 font-serif text-2xl font-normal leading-snug text-white">
                    The Burton Juice
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-white/80">
                    Somma Vesuviana: sale, attori e cocktail. Apri la scheda per i dettagli.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    to="/posto/campania-burton-juice"
                    trackingId="clean_hero_burton_card"
                    className="mt-3 border-white/40 bg-white/10 text-white hover:bg-white hover:text-[var(--color-ink)]"
                  >
                    Apri la scheda
                  </Button>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-3.5 flex items-center justify-between px-2 text-xs font-semibold">
                <span className="font-serif italic text-[var(--color-ink)]">
                  Provato di persona da Rodrigo &amp; Betta
                </span>
                <span className="font-bold text-[var(--color-accent)]">Verificato sul campo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
