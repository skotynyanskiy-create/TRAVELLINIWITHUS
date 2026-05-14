import { Eye, Instagram, MapPin, Users } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';

/**
 * Strip social proof post-hero. Conteggio animato su scroll-in via
 * AnimatedCounter (motion useSpring). Niente immagini -> nessuna
 * competizione LCP.
 */

interface TrustItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  /** Valore numerico da animare (es. 167 per "167K+"). */
  numericValue: number;
  /** Suffisso visualizzato dopo il numero animato (es. "K+", "+", "%"). */
  suffix: string;
  label: string;
}

// Gerarchia mobile-first: il dato di pubblico mensile (reach) e il segnale
// piu persuasivo per partner B2B; va nella prima colonna 375px.
//
// Valori parsati a mano da BRAND_STATS per consentire animazione numerica
// (AnimatedCounter accetta number, non string formattata).
const TRUST_ITEMS: TrustItem[] = [
  { icon: Eye, numericValue: 500, suffix: 'K+', label: 'Pubblico mensile' },
  { icon: Instagram, numericValue: 167, suffix: 'K+', label: 'Follower Instagram' },
  { icon: Users, numericValue: 90, suffix: 'K+', label: 'Follower TikTok' },
  { icon: MapPin, numericValue: 150, suffix: '+', label: 'Destinazioni esplorate' },
];

export default function HomeTrustStrip() {
  return (
    <section
      aria-label="Numeri del progetto"
      className="border-y border-[var(--color-border)] bg-white"
    >
      <h2 className="sr-only">Numeri del progetto Travelliniwithus</h2>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-6 py-8 md:grid-cols-4 md:gap-0 md:px-12 md:py-10">
        {TRUST_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center gap-3 md:justify-center ${
                idx > 0 ? 'md:border-l md:border-[var(--color-border)]' : ''
              }`}
            >
              <Icon size={18} className="shrink-0 text-[var(--color-accent)]" />
              <div className="flex flex-col leading-tight">
                <AnimatedCounter
                  value={item.numericValue}
                  suffix={item.suffix}
                  duration={1600 + idx * 120}
                  className="font-serif text-2xl text-[var(--color-ink)] md:text-3xl"
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
