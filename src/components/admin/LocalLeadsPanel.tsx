import { useState } from 'react';
import { Download, HardDriveDownload, Trash2 } from 'lucide-react';
import { clearLeadFallback, readLeadFallback } from '../../lib/leadFallback';

interface ContactLead extends Record<string, unknown> {
  name: string;
  email: string;
  topic: string;
  message: string;
  date: string;
}

interface NewsletterLead extends Record<string, unknown> {
  email: string;
  source: string;
  date: string;
}

interface LeadsBundle {
  contact: ContactLead[];
  newsletter: NewsletterLead[];
}

const CONTACT_KEY = 'twu_contact_leads';
const NEWSLETTER_KEY = 'twu_newsletter_leads';

function readLeads(): LeadsBundle {
  return {
    contact: readLeadFallback<ContactLead>(CONTACT_KEY),
    newsletter: readLeadFallback<NewsletterLead>(NEWSLETTER_KEY),
  };
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
  const [leads, setLeads] = useState<LeadsBundle>(() => readLeads());

  const refresh = () => setLeads(readLeads());

  const exportContact = () => {
    downloadCsv(
      `twu-contact-leads-${new Date().toISOString().slice(0, 10)}.csv`,
      toCsv(leads.contact)
    );
  };

  const exportNewsletter = () => {
    downloadCsv(
      `twu-newsletter-leads-${new Date().toISOString().slice(0, 10)}.csv`,
      toCsv(leads.newsletter)
    );
  };

  const clearContact = () => {
    if (!window.confirm('Confermi di voler cancellare i lead contatti salvati su questo browser?'))
      return;
    clearLeadFallback(CONTACT_KEY);
    refresh();
  };

  const clearNewsletter = () => {
    if (
      !window.confirm('Confermi di voler cancellare i lead newsletter salvati su questo browser?')
    )
      return;
    clearLeadFallback(NEWSLETTER_KEY);
    refresh();
  };

  const total = leads.contact.length + leads.newsletter.length;

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
          className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-600 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
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
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-700">
                Contatti ({leads.contact.length})
              </h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={exportContact}
                  disabled={leads.contact.length === 0}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)] disabled:opacity-40"
                >
                  <Download size={12} /> CSV
                </button>
                <button
                  type="button"
                  onClick={clearContact}
                  disabled={leads.contact.length === 0}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600 transition-colors hover:border-red-400 hover:text-red-500 disabled:opacity-40"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {leads.contact.length === 0 && (
                <li className="rounded-xl bg-zinc-50 px-4 py-3 text-xs text-zinc-400">
                  Nessun contatto salvato.
                </li>
              )}
              {leads.contact.map((lead, idx) => (
                <li
                  key={`contact-${idx}-${lead.email}-${lead.date}`}
                  className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-zinc-800">{lead.email}</p>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                      {lead.topic || '—'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">{lead.name}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-600">
                    {lead.message}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-zinc-400">
                    {new Date(lead.date).toLocaleString('it-IT')}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-700">
                Newsletter ({leads.newsletter.length})
              </h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={exportNewsletter}
                  disabled={leads.newsletter.length === 0}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)] disabled:opacity-40"
                >
                  <Download size={12} /> CSV
                </button>
                <button
                  type="button"
                  onClick={clearNewsletter}
                  disabled={leads.newsletter.length === 0}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600 transition-colors hover:border-red-400 hover:text-red-500 disabled:opacity-40"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {leads.newsletter.length === 0 && (
                <li className="rounded-xl bg-zinc-50 px-4 py-3 text-xs text-zinc-400">
                  Nessuna iscrizione salvata.
                </li>
              )}
              {leads.newsletter.map((lead, idx) => (
                <li
                  key={`news-${idx}-${lead.email}-${lead.date}`}
                  className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-zinc-800">{lead.email}</p>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                      {lead.source || 'web'}
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-zinc-400">
                    {new Date(lead.date).toLocaleString('it-IT')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
