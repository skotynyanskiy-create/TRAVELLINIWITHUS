import type { ArticleFactBox } from './types';

interface FactBoxProps {
  factBox: ArticleFactBox;
  className?: string;
}

export default function FactBox({ factBox, className = '' }: FactBoxProps) {
  const title = factBox.title ?? 'In breve';

  return (
    <aside
      className={`rounded-[1.75rem] border border-[var(--color-accent)]/18 bg-white p-6 shadow-sm md:p-8 ${className}`}
      aria-label={title}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
        {title}
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {factBox.items.map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            className="border-t border-black/8 pt-3 first:border-t-0 first:pt-0 sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0 sm:first:border-l-0 sm:first:pl-0"
          >
            <dt className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/55">
              {item.label}
            </dt>
            <dd className="mt-1.5 font-serif text-xl leading-tight text-[var(--color-ink)] md:text-2xl">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
