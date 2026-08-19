import { Mail, MailWarning, MessageCircle } from 'lucide-react';

interface LeadFallbackNoticeProps {
  /** true quando il lead e' comunque salvato in questo browser (vedi appendLeadFallback). */
  savedLocally: boolean;
  /** Riga in grassetto opzionale, per i contesti compatti senza un h2 proprio. */
  title?: string;
  /** Spiegazione onesta di cosa e' successo. Omissibile se il chiamante ha gia' il suo testo. */
  description?: string;
  mailtoHref: string;
  mailtoLabel?: string;
  whatsappHref?: string;
  whatsappLabel?: string;
  onRetry?: () => void;
  retryLabel?: string;
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * Quando il modulo non raggiunge il backend, appendLeadFallback salva il lead
 * solo nel browser di chi scrive: l'owner non lo vede mai. Questo componente
 * sostituisce il falso "successo" con la verita' e una via d'uscita cliccabile
 * (email o WhatsApp gia' precompilati con i dati inseriti).
 */
export default function LeadFallbackNotice({
  savedLocally,
  title,
  description,
  mailtoHref,
  mailtoLabel = 'Scrivi via email',
  whatsappHref,
  whatsappLabel = 'Scrivi su WhatsApp',
  onRetry,
  retryLabel = 'Riprova',
  tone = 'light',
  className = '',
}: LeadFallbackNoticeProps) {
  const isDark = tone === 'dark';

  return (
    <div className={className} role="alert">
      {title && (
        <div
          className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${
            isDark ? 'text-[var(--color-accent-on-dark)]' : 'text-[var(--color-warning-text)]'
          }`}
        >
          <MailWarning size={15} />
          {title}
        </div>
      )}
      {description && (
        <p
          className={`${title ? 'mt-2' : ''} text-sm leading-relaxed ${
            isDark ? 'text-white/75' : 'text-black/70'
          }`}
        >
          {description}
        </p>
      )}
      {!savedLocally && (
        <p className={`mt-2 text-xs leading-relaxed ${isDark ? 'text-white/55' : 'text-black/55'}`}>
          Non siamo riusciti a salvare nemmeno una copia su questo dispositivo: invia il messaggio
          prima di chiudere la pagina, altrimenti i dati vanno persi.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-3">
        <a
          href={mailtoHref}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-xs font-bold tracking-widest uppercase transition-colors ${
            isDark
              ? 'bg-[var(--color-accent)] text-[var(--color-ink)] hover:brightness-95'
              : 'bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink)]/85'
          }`}
        >
          <Mail size={14} /> {mailtoLabel}
        </a>
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-xs font-bold tracking-widest uppercase transition-colors ${
              isDark
                ? 'border-white/25 text-white hover:border-white/45'
                : 'border-black/15 text-[var(--color-ink)] hover:border-[var(--color-accent)]'
            }`}
          >
            <MessageCircle size={14} /> {whatsappLabel}
          </a>
        )}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={`text-xs font-bold tracking-widest uppercase underline underline-offset-4 ${
              isDark ? 'text-white/70 hover:text-white' : 'text-black/60 hover:text-black'
            }`}
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
