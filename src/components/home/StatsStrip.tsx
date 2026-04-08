import { MapPin } from 'lucide-react';
import type { HomeProofItem } from '../../config/siteContent';

interface StatsStripProps {
  eyebrow: string;
  items: HomeProofItem[];
}

export default function StatsStrip({ eyebrow, items }: StatsStripProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[var(--color-ink)]/95 px-6 py-6 text-white shadow-2xl backdrop-blur-xl md:px-8 md:py-8">
      <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold)]/80">
        {eyebrow}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] px-5 py-5 text-left"
          >
            <div className="mb-4 flex items-center gap-3 text-[var(--color-gold)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-gold)]/10">
                <MapPin size={16} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/55">
                {item.label}
              </span>
            </div>
            <div className="text-3xl font-serif text-white">{item.value}</div>
            <p className="mt-3 text-sm leading-relaxed text-white/68">{item.context}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
