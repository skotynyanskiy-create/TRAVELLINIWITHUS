import { forwardRef, type TextareaHTMLAttributes } from 'react';

type TextareaVariant = 'boxed' | 'underline';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  variant?: TextareaVariant;
}

const variantClasses: Record<TextareaVariant, { base: string; ok: string; err: string }> = {
  boxed: {
    base: 'w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-4 py-3 text-sm transition-colors focus:outline-none resize-none',
    ok: 'border-[var(--color-border)] focus:border-[var(--color-accent)]',
    err: 'border-[var(--color-error)] focus:border-[var(--color-error)]',
  },
  underline: {
    base: 'w-full resize-none border-b bg-transparent py-3 transition-colors focus:outline-none rounded-none',
    ok: 'border-black/10 focus:border-[var(--color-accent)]',
    err: 'border-[var(--color-error)] focus:border-[var(--color-error)]',
  },
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error = false, variant = 'boxed', className = '', ...rest },
  ref
) {
  const v = variantClasses[variant];
  return (
    <textarea
      ref={ref}
      aria-invalid={error || undefined}
      className={`${v.base} ${error ? v.err : v.ok} ${className}`}
      {...rest}
    />
  );
});

export default Textarea;
