import { AlertCircle } from 'lucide-react';

interface DemoContentNoticeProps {
  title?: string;
  message?: string;
  className?: string;
}

export default function DemoContentNotice({
  title = 'Preview editoriale controllata',
  message = 'Questo contenuto serve a mostrare la direzione finale del sito. Prima della pubblicazione va sostituito o approvato con testi, foto e dettagli verificati.',
  className = '',
}: DemoContentNoticeProps) {
  return (
    <div
      className={`rounded-3xl border border-[var(--color-accent)]/25 bg-[var(--color-accent-soft)] px-6 py-5 text-[var(--color-ink)] ${className}`}
    >
      <div className="flex items-start gap-4">
        <AlertCircle className="mt-0.5 shrink-0 text-[var(--color-accent-text)]" size={20} />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
            {title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-black/65">{message}</p>
        </div>
      </div>
    </div>
  );
}
