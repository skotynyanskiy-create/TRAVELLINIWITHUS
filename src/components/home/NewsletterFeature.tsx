import { CheckCircle2, Mail, ShieldCheck, TrendingUp } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import Newsletter from '../Newsletter';
import { NEWSLETTER_RECENT_SIGNUPS } from '../../config/site';

const BULLET_POINTS = [
  'Una email al mese, mai di più.',
  'Solo posti, guide e idee davvero salvabili.',
  'Niente sequenze di vendita, niente noise.',
];

/** Preview editoriale: mostra il formato della newsletter senza fingere un archivio storico. */
interface NewsletterPromiseItem {
  title: string;
  text: string;
}

const NEWSLETTER_PROMISES: NewsletterPromiseItem[] = [
  {
    title: 'Un posto da salvare',
    text: 'Luogo, periodo migliore, motivo concreto per andarci e quando invece evitarlo.',
  },
  {
    title: 'Una scelta pratica',
    text: 'Dove dormire, cosa prenotare prima o quale errore tagliare dall’itinerario.',
  },
  {
    title: 'Un aggiornamento sincero',
    text: 'Niente calendario forzato: scriviamo solo quando c’è qualcosa che vale la tua attenzione.',
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
            <span className="italic text-black/55">Solo quando c&apos;è qualcosa da salvare.</span>
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

          <NewsletterPromise items={NEWSLETTER_PROMISES} />
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
function NewsletterPromise({ items }: { items: NewsletterPromiseItem[] }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white/60 p-6 md:p-7">
      <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
        <Mail size={11} /> Cosa ricevi
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.title}
            className="border-b border-[var(--color-border)] pb-3 last:border-b-0 last:pb-0"
          >
            <p className="mt-1 text-sm font-serif font-medium leading-snug text-[var(--color-ink)]">
              {item.title}
            </p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-black/55">{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
