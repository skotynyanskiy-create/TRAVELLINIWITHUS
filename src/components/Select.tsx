import { forwardRef, type SelectHTMLAttributes } from 'react';

type SelectVariant = 'boxed' | 'underline';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  variant?: SelectVariant;
}

const variantClasses: Record<SelectVariant, { base: string; ok: string; err: string }> = {
  boxed: {
    base: 'w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-4 py-3 text-sm transition-colors focus:outline-none',
    ok: 'border-[var(--color-border)] focus:border-[var(--color-accent)]',
    err: 'border-[var(--color-error)] focus:border-[var(--color-error)]',
  },
  underline: {
    base: 'w-full appearance-none rounded-none border-b bg-transparent py-3 text-[var(--color-ink)] transition-colors focus:outline-none',
    ok: 'border-black/10 focus:border-[var(--color-accent)]',
    err: 'border-[var(--color-error)] focus:border-[var(--color-error)]',
  },
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { error = false, variant = 'boxed', className = '', children, ...rest },
  ref
) {
  const v = variantClasses[variant];
  return (
    <select
      ref={ref}
      aria-invalid={error || undefined}
      className={`${v.base} ${error ? v.err : v.ok} ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
});

export default Select;
