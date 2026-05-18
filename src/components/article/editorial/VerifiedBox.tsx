import type { ReactNode } from 'react';
import { BadgeCheck, CalendarCheck, Phone } from 'lucide-react';

interface VerifiedBoxProps {
  visited?: string;
  pricesChecked?: string;
  contacts?: boolean;
  children?: ReactNode;
}

const MONTHS_IT = [
  'gennaio',
  'febbraio',
  'marzo',
  'aprile',
  'maggio',
  'giugno',
  'luglio',
  'agosto',
  'settembre',
  'ottobre',
  'novembre',
  'dicembre',
];

/**
 * Format "YYYY-MM" o "YYYY-MM-DD" → "settembre 2025".
 * Fallback: raw string + console.warn in dev (handoff A.6).
 */
function formatItalianDate(dateStr: string): string {
  const match = dateStr.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!match) {
    if (import.meta.env?.DEV) {
      console.warn(
        `[VerifiedBox] Formato data non valido: "${dateStr}". Usa YYYY-MM o YYYY-MM-DD.`
      );
    }
    return dateStr;
  }
  const [, yearStr, monthStr] = match;
  const monthIdx = Number(monthStr) - 1;
  const monthName = MONTHS_IT[monthIdx];
  if (!monthName) {
    if (import.meta.env?.DEV) {
      console.warn(`[VerifiedBox] Mese non valido in "${dateStr}".`);
    }
    return dateStr;
  }
  return `${monthName} ${yearStr}`;
}

const VINTAGE_THRESHOLD_MS = 730 * 24 * 60 * 60 * 1000; // 24 mesi

function isVintage(visited?: string): boolean {
  if (!visited) return false;
  const match = visited.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!match) return false;
  const [, yearStr, monthStr, dayStr] = match;
  const visitedDate = new Date(Number(yearStr), Number(monthStr) - 1, dayStr ? Number(dayStr) : 1);
  if (Number.isNaN(visitedDate.getTime())) return false;
  return Date.now() - visitedDate.getTime() > VINTAGE_THRESHOLD_MS;
}

export default function VerifiedBox({
  visited,
  pricesChecked,
  contacts,
  children,
}: VerifiedBoxProps) {
  if (!visited && !pricesChecked && !contacts && !children) return null;

  const vintage = isVintage(visited);
  const badgeLabel = vintage ? 'Verificato · da aggiornare' : 'Verificato';
  const badgeColor = vintage ? 'text-amber-700' : 'text-[var(--color-accent-text)]';

  return (
    <aside
      className="my-8 rounded-r-[var(--radius-md)] border-l-2 border-[var(--color-accent)] bg-[var(--color-sand)] p-4 md:p-5"
      aria-label="Box verifica esperienza diretta"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className={`text-[10px] font-bold uppercase tracking-[0.22em] ${badgeColor}`}>
          {badgeLabel}
        </span>
      </div>
      <div className="grid gap-2 md:grid-cols-2 md:gap-3">
        {visited && (
          <div className="flex items-center gap-2">
            <CalendarCheck
              size={14}
              className="shrink-0 text-[var(--color-accent)]"
              aria-hidden="true"
            />
            <span className="text-xs text-[var(--color-muted-fg)]">Visitato:</span>
            <span className="text-sm font-medium text-[var(--color-ink)]">
              {formatItalianDate(visited)}
            </span>
          </div>
        )}
        {pricesChecked && (
          <div className="flex items-center gap-2">
            <BadgeCheck
              size={14}
              className="shrink-0 text-[var(--color-accent)]"
              aria-hidden="true"
            />
            <span className="text-xs text-[var(--color-muted-fg)]">Prezzi verificati:</span>
            <span className="text-sm font-medium text-[var(--color-ink)]">
              {formatItalianDate(pricesChecked)}
            </span>
          </div>
        )}
        {contacts && (
          <div className="flex items-center gap-2 md:col-span-2">
            <Phone size={14} className="shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
            <span className="text-sm text-[var(--color-ink-2)]">Contatti aggiornati</span>
          </div>
        )}
      </div>
      {children && (
        <div className="mt-3 text-sm leading-relaxed text-[var(--color-ink-2)]">{children}</div>
      )}
    </aside>
  );
}
