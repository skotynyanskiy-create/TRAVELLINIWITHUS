import { useState, type ReactNode } from 'react';
import { Download, HardDriveDownload, Trash2 } from 'lucide-react';
import { clearLeadFallback, readLeadFallback } from '../../lib/leadFallback';

interface LeadBase extends Record<string, unknown> {
  email: string;
  date: string;
}

/**
 * I quattro form che salvano in locale quando l'API non risponde. Prima questo
 * pannello ne leggeva due: i lead media kit e la waitlist Club finivano in
 * localStorage e non li guardava nessuno. Tenerli in una tabella evita che il
 * quinto form nasca gia' invisibile.
 */
interface TipoLead {
  chiave: string;
  etichetta: string;
  vuoto: string;
  /** Etichetta a destra dell'email: cambia significato per tipo. */
  badge: (lead: LeadBase) => string;
  /** Righe sotto l'email, se il tipo ne ha. */
  corpo?: (lead: LeadBase) => ReactNode;
}

const TIPI_LEAD: TipoLead[] = [
  {
    chiave: 'twu_contact_leads',
    etichetta: 'Contatti',
    vuoto: 'Nessun contatto salvato.',
    badge: (l) => String(l.topic || '—'),
    corpo: (l) => (
      <>
        <p className="mt-1 text-xs text-zinc-500">{String(l.name ?? '')}</p>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-600">
          {String(l.message ?? '')}
        </p>
      </>
    ),
  },
  {
    chiave: 'twu_newsletter_leads',
    etichetta: 'Newsletter',
    vuoto: 'Nessuna iscrizione salvata.',
    badge: (l) => String(l.source || 'web'),
  },
  {
    chiave: 'twu_media_kit_leads',
    etichetta: 'Media kit',
    vuoto: 'Nessuna richiesta media kit salvata.',
    badge: (l) => String(l.budget || 'budget n.d.'),
    corpo: (l) => (
      <>
        <p className="mt-1 text-xs text-zinc-500">{String(l.company ?? '')}</p>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-600">
          {String(l.message ?? l.brief ?? '')}
        </p>
      </>
    ),
  },
  {
    chiave: 'twu_club_waitlist',
    etichetta: 'Waitlist Club',
    vuoto: 'Nessuna iscrizione alla waitlist salvata.',
    badge: (l) => String(l.plan || l.source || 'club'),
  },
];

type Registro = Record<string, LeadBase[]>;

function readLeads(): Registro {
  return Object.fromEntries(
    TIPI_LEAD.map((tipo) => [tipo.chiave, readLeadFallback<LeadBase>(tipo.chiave)])
  );
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Array.from(
    rows.reduce<Set<string>>((acc, row) => {
      Object.keys(row).forEach((key) => acc.add(key));
      return acc;
    }, new Set<string>())
  );
  const escape = (value: unknown) => {
    if (value === null || value === undefined) return '';
    const str = String(value).replace(/"/g, '""');
    return /[",\n]/.test(str) ? `"${str}"` : str;
  };
  const head = headers.join(',');
  const body = rows.map((row) => headers.map((h) => escape(row[h])).join(',')).join('\n');
  return `${head}\n${body}`;
}

function downloadCsv(filename: string, csv: string) {
  if (!csv) return;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function LocalLeadsPanel() {
  const [leads, setLeads] = useState<Registro>(() => readLeads());

  const refresh = () => setLeads(readLeads());

  const esporta = (tipo: TipoLead) => {
    const oggi = new Date().toISOString().slice(0, 10);
    downloadCsv(`${tipo.chiave.replace(/_/g, '-')}-${oggi}.csv`, toCsv(leads[tipo.chiave] ?? []));
  };

  const svuota = (tipo: TipoLead) => {
    if (
      !window.confirm(
        `Confermi di voler cancellare i lead "${tipo.etichetta}" salvati su questo browser?`
      )
    )
      return;
    clearLeadFallback(tipo.chiave);
    refresh();
  };

  const total = TIPI_LEAD.reduce((somma, tipo) => somma + (leads[tipo.chiave]?.length ?? 0), 0);

  return (
    <div className="mt-12 rounded-[var(--radius-lg)] border border-zinc-100 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 font-serif text-xl">
            <HardDriveDownload size={20} className="text-[var(--color-accent)]" />
            Lead salvati su questo browser
          </h3>
          <p className="mt-2 max-w-xl text-sm text-zinc-500">
            Quando il backend non è configurato (Brevo / Resend) o l'API è irraggiungibile, i form
            salvano i lead in localStorage. Qui li vedi e puoi esportarli in CSV.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-600 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)]"
        >
          Ricarica
        </button>
      </div>

      {total === 0 ? (
        <p className="rounded-[var(--radius-md)] bg-zinc-50 px-6 py-8 text-center text-sm text-zinc-500">
          Nessun lead salvato in locale su questo browser.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {TIPI_LEAD.map((tipo) => {
            const voci = leads[tipo.chiave] ?? [];
            return (
              <div key={tipo.chiave}>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-700">
                    {tipo.etichetta} ({voci.length})
                  </h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => esporta(tipo)}
                      disabled={voci.length === 0}
                      className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-40"
                    >
                      <Download size={12} /> CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => svuota(tipo)}
                      disabled={voci.length === 0}
                      aria-label={`Cancella i lead ${tipo.etichetta}`}
                      className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600 transition-colors hover:border-[var(--color-error)] hover:text-[var(--color-error-text)] disabled:opacity-40"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
                  {voci.length === 0 && (
                    <li className="rounded-xl bg-zinc-50 px-4 py-3 text-xs text-zinc-400">
                      {tipo.vuoto}
                    </li>
                  )}
                  {voci.map((lead, idx) => (
                    <li
                      key={`${tipo.chiave}-${idx}-${lead.email}-${lead.date}`}
                      className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-zinc-800">{lead.email}</p>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)]">
                          {tipo.badge(lead)}
                        </span>
                      </div>
                      {tipo.corpo?.(lead)}
                      <p className="mt-2 text-[10px] uppercase tracking-widest text-zinc-400">
                        {new Date(lead.date).toLocaleString('it-IT')}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
