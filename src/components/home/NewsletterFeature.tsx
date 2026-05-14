import { CheckCircle2, Mail, ShieldCheck, TrendingUp } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import Newsletter from '../Newsletter';
import { NEWSLETTER_RECENT_SIGNUPS } from '../../config/site';

const BULLET_POINTS = [
  'Una email al mese, mai di piu.',
  'Solo posti, guide e idee davvero salvabili.',
  'Niente sequenze di vendita, niente noise.',
];

/**
 * Archivio editoriale newsletter passate — anteprima 3 numeri recenti
 * (placeholder pronto per Brevo API o per dati statici curati R+B).
 * Trasforma il claim "scriviamo solo quando vale" da promessa a evidenza.
 *
 * TODO R+B: sostituire NEWSLETTER_ARCHIVE_PREVIEW con 3-5 numeri reali
 * appena la prima newsletter ufficiale e' pubblicata via Brevo.
 */
interface NewsletterArchiveItem {
  date: string;
  subject: string;
  preview: string;
}

const NEWSLETTER_ARCHIVE_PREVIEW: NewsletterArchiveItem[] = [
  {
    date: 'Maggio 2026',
    subject: 'Posti veri, non liste',
    preview:
      'Perche abbiamo lanciato Travellini Club, 3 spa boutique italiane (no resort), e una guida pratica per Pasqua in Salento.',
  },
  {
    date: 'Aprile 2026',
    subject: 'Tre cose che NESSUNO ti dice del Cilento',
    preview:
      "L'errore comune sui parcheggi, il borgo dove abbiamo dormito due volte, e la trattoria che cambia menu ogni giovedi.",
  },
  {
    date: 'Marzo 2026',
    subject: "Slovenia in 5 giorni — l'itinerario reale",
    preview:
      'Cosa abbiamo prenotato, cosa abbiamo evitato, i 4 spostamenti che valgono 30 minuti di mappa in piu.',
  },
];

export default function NewsletterFeature() {
  return (
    <section id="newsletter" className="bg-[var(--color-surface-2)] py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:px-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
            <Mail size={12} /> Newsletter
          </span>
          <h2 className="mt-4 max-w-xl font-serif text-4xl leading-[1.05] tracking-tight text-[var(--color-ink)] md:text-5xl">
            Una mail.{' '}
            <span className="italic text-black/55">Solo quando c&apos;e qualcosa da salvare.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-black/65 md:text-lg">
            Niente automatismi senza valore: pubblichiamo solo se troviamo un posto, una guida o uno
            strumento che merita davvero un&apos;email.
          </p>

          <ul className="mt-8 space-y-3">
            {BULLET_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-sm leading-relaxed text-black/72"
              >
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                {point}
              </li>
            ))}
          </ul>

          <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[var(--color-accent-text)] shadow-[var(--shadow-xs)]">
            <TrendingUp size={12} />
            <AnimatedCounter
              value={NEWSLETTER_RECENT_SIGNUPS}
              duration={1500}
              className="font-serif text-base"
            />
            <span className="text-black/55">lettori già nella lista</span>
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-sm)] md:p-10">
            <div className="mb-6 flex items-start gap-3 text-sm leading-relaxed text-black/68">
              <ShieldCheck size={18} className="shrink-0 text-[var(--color-accent)]" />
              <span>
                Disiscrizione con un click in ogni email. Non passiamo mai i tuoi dati a terzi.
              </span>
            </div>
            <Newsletter compact variant="sand" source="home_newsletter_feature" />
          </div>

          <NewsletterArchivePreview items={NEWSLETTER_ARCHIVE_PREVIEW} />
        </div>
      </div>
    </section>
  );
}

/**
 * Mini-archivio editoriale post-form: mostra cosa ricevi *davvero*.
 * Pattern Substack/The Browser/Lenny's Newsletter — la trasparenza
 * sull'archivio aumenta CR del form sopra.
 */
function NewsletterArchivePreview({ items }: { items: NewsletterArchiveItem[] }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white/60 p-6 md:p-7">
      <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
        <Mail size={11} /> Ultime newsletter
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.subject}
            className="border-b border-[var(--color-border)] pb-3 last:border-b-0 last:pb-0"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-black/70">
              {item.date}
            </p>
            <p className="mt-1 text-sm font-serif font-medium leading-snug text-[var(--color-ink)]">
              {item.subject}
            </p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-black/55">
              {item.preview}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
