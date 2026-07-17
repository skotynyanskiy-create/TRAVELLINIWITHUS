import type { LucideIcon } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { catColor } from '@/src/config/categoryColors';
import type { ContentType } from '@/src/config/contentTaxonomy';

export interface CategoryPillProps {
  label: string;
  fullLabel: string;
  type: ContentType;
  to: string;
  icon: LucideIcon;
  index: number;
}

export default function CategoryPill({
  label,
  fullLabel,
  type,
  to,
  icon: Icon,
  index,
}: CategoryPillProps) {
  const cc = catColor(type);

  return (
    <Link
      to={to}
      style={{ ['--cc' as string]: cc, borderTopColor: cc }}
      className="group relative flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] border-t-[3px] bg-[var(--color-surface)] p-5 no-underline transition-all duration-300 ease-out hover:-translate-y-[3px] hover:bg-[color-mix(in_srgb,var(--cc)_7%,var(--color-surface))] hover:shadow-[var(--shadow-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span aria-hidden className="dispatch-index-number absolute right-4 top-4">
        {String(index + 1).padStart(2, '0')}
      </span>
      <Icon size={32} strokeWidth={1.5} style={{ color: cc }} aria-hidden />
      <span className="font-serif text-[1.15rem] leading-tight text-[var(--color-ink)]">
        {label}
      </span>
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
        {fullLabel}
      </span>
    </Link>
  );
}
