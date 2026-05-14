import { Instagram, MapPin, TrendingUp, Users } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';

/**
 * Strip social proof post-hero. Si attiva on intersection (AnimatedCounter
 * usa IntersectionObserver), niente immagini -> non compete con LCP del hero.
 */

interface TrustItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: number;
  suffix: string;
  label: string;
}

const TRUST_ITEMS: TrustItem[] = [
  { icon: Instagram, value: 167, suffix: 'K+', label: 'Follower Instagram' },
  { icon: TrendingUp, value: 500, suffix: 'K+', label: 'Reach mensile' },
  { icon: Users, value: 90, suffix: 'K+', label: 'Follower TikTok' },
  { icon: MapPin, value: 150, suffix: '+', label: 'Destinazioni esplorate' },
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
                <span className="font-serif text-2xl text-[var(--color-ink)] md:text-3xl">
                  <AnimatedCounter value={item.value} suffix={item.suffix} duration={1400} />
                </span>
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
