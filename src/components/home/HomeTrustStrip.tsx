import { BadgeCheck, Landmark, ShieldCheck } from 'lucide-react';
import { BRAND_CREDENTIALS, BRAND_STATS } from '../../config/site';

interface TrustNumber {
  display: string;
  label: string;
}

const TRUST_NUMBERS: TrustNumber[] = [
  { display: BRAND_STATS.monthlyReach, label: 'reach mensile' },
  { display: BRAND_STATS.instagramFollowers, label: 'su Instagram' },
  { display: BRAND_STATS.tiktokFollowers, label: 'su TikTok' },
  { display: BRAND_STATS.destinationsExplored, label: 'destinazioni vissute' },
];

const CREDENTIALS = [
  { icon: BadgeCheck, label: BRAND_CREDENTIALS.metaVerifiedLabel, tone: 'verified' as const },
  { icon: Landmark, label: BRAND_CREDENTIALS.agcomLabel, tone: 'agcom' as const },
  {
    icon: ShieldCheck,
    label: BRAND_CREDENTIALS.disclosurePolicyLabel,
    tone: 'disclosure' as const,
  },
];

export default function HomeTrustStrip() {
  return (
    <section
      aria-label="Numeri e credibilita' del progetto"
      className="border-y border-[var(--color-border)]/60 bg-white/70 py-6 backdrop-blur-md md:py-8"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 md:px-12">
        <h2 className="sr-only">Numeri e credibilita' del progetto Travelliniwithus</h2>

        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
          {TRUST_NUMBERS.map((item, idx) => (
            <span key={item.label} className="inline-flex items-center gap-x-2">
              {idx > 0 && (
                <span aria-hidden className="text-[var(--color-border)]">
                  ·
                </span>
              )}
              <span className="inline-flex items-baseline gap-1.5">
                <span className="font-serif text-lg text-[var(--color-ink)] md:text-xl">
                  {item.display}
                </span>
                <span className="font-sans text-sm text-[var(--color-muted)]">{item.label}</span>
              </span>
            </span>
          ))}
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pt-1">
          {CREDENTIALS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent)]/15 bg-[var(--color-accent-soft)]/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink)]/80"
            >
              <Icon size={12} className="text-[var(--color-accent)]" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
