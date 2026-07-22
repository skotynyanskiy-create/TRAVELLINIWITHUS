import { ArrowRight, Compass, ShieldCheck, Sparkles } from 'lucide-react';
import Button from '@/src/components/Button';
import OptimizedImage from '@/src/components/OptimizedImage';

export default function CleanCuratedHero() {
  return (
    <section className="relative w-full bg-[var(--color-sand,#faf7f2)] py-16 md:py-24 text-[var(--color-ink,#1a2b3c)] overflow-hidden border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          {/* Left Editorial Copy */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent,#c85a32)]/30 bg-[var(--color-accent,#c85a32)]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent,#c85a32)]">
              <Sparkles size={13} />
              Rodrigo &amp; Betta · Travelliniwithus
            </div>

            <h1 className="font-serif text-4xl font-normal leading-[1.06] text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
              Consigliamo solo i posti che <br />
              <span className="italic text-[var(--color-accent,#c85a32)]">meritano davvero il viaggio.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-muted-fg)] sm:text-lg">
              Siamo Rodrigo e Betta. Proviamo di persona hotel di charme, trattorie segrete e borghi fuori rotta.
              Vi diciamo quanto costa, per chi è e se vale davvero la pena partire.
            </p>

            {/* CTA Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button variant="cta" size="lg" to="/esplora" magnetic trackingId="clean_hero_esplora">
                <Compass size={18} className="mr-2" />
                Esplora le destinazioni
              </Button>
              <Button variant="outline" size="lg" to="/chi-siamo" trackingId="clean_hero_chisiamo">
                La nostra storia
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>

            {/* Trust & Proof Strip */}
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-[var(--color-border)] pt-6 text-xs font-semibold text-[var(--color-muted-fg)]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[var(--color-accent)]" />
                <span>230+ Posti provati di persona</span>
              </div>
              <span>·</span>
              <span>100% Recensioni autentiche</span>
              <span>·</span>
              <span>0 Sponsorizzazioni nascoste</span>
            </div>
          </div>

          {/* Right Clean Photography Card */}
          <div className="relative">
            <div className="overflow-hidden rounded-[var(--radius-lg,20px)] border border-[var(--color-border)] bg-white p-3 shadow-lg">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-black/5">
                <OptimizedImage
                  src="/images/home-journal/hero-impossible.png"
                  alt="Rodrigo e Betta a Somma Vesuviana"
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3 flex items-center justify-between px-2 text-xs font-medium text-[var(--color-muted-fg)]">
                <span className="font-serif italic text-[var(--color-ink)]">The Burton Juice · Campania</span>
                <span className="font-semibold text-[var(--color-accent,#c85a32)]">Provato &amp; Verificato</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
