import { forwardRef, type InputHTMLAttributes } from 'react';

type InputVariant = 'boxed' | 'underline';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  variant?: InputVariant;
}

const variantClasses: Record<InputVariant, { base: string; ok: string; err: string }> = {
  boxed: {
    base: 'w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-4 py-3 text-sm transition-colors focus:outline-none',
    ok: 'border-[var(--color-border)] focus:border-[var(--color-accent)]',
    err: 'border-[var(--color-error)] focus:border-[var(--color-error)]',
  },
  underline: {
    base: 'w-full border-b bg-transparent py-3 transition-colors focus:outline-none rounded-none',
    ok: 'border-black/10 focus:border-[var(--color-accent)]',
    err: 'border-[var(--color-error)] focus:border-[var(--color-error)]',
  },
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error = false, variant = 'boxed', className = '', ...rest },
  ref
) {
  const v = variantClasses[variant];
  return (
    <input
      ref={ref}
      aria-invalid={error || undefined}
      className={`${v.base} ${error ? v.err : v.ok} ${className}`}
      {...rest}
    />
  );
});

export default Input;
