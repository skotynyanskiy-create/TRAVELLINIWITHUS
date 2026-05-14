import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  className = '',
  children,
}: FormFieldProps) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const hintId = hint && !error ? `${htmlFor}-hint` : undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted-fg-2)]"
      >
        {label}
        {required && <span className="ml-1 text-[var(--color-error)]">*</span>}
      </label>
      {hint && !error && (
        <p id={hintId} className="text-xs font-light leading-relaxed text-[var(--color-muted-fg)]">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-[var(--color-error)]">
          {error}
        </p>
      )}
    </div>
  );
}
