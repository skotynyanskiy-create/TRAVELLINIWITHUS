import { Eye, Instagram, MapPin, Users } from 'lucide-react';

/**
 * Strip social proof post-hero. Valori statici allineati a BRAND_STATS
 * (CoupleIntro counters). Niente immagini -> nessuna competizione LCP.
 */

interface TrustItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: string;
  label: string;
}

const TRUST_ITEMS: TrustItem[] = [
  { icon: Instagram, value: '167K+', label: 'Follower Instagram' },
  { icon: Eye, value: '500K+', label: 'Pubblico mensile' },
  { icon: Users, value: '90K+', label: 'Follower TikTok' },
  { icon: MapPin, value: '150+', label: 'Destinazioni esplorate' },
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
                  {item.value}
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
