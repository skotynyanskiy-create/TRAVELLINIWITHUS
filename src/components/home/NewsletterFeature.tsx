import { CheckCircle2, Mail, ShieldCheck, TrendingUp } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import Newsletter from '../Newsletter';
import { NEWSLETTER_RECENT_SIGNUPS } from '../../config/site';

const BULLET_POINTS = [
  'Una email al mese, mai di piu.',
  'Solo posti, guide e idee davvero salvabili.',
  'Niente sequenze di vendita, niente noise.',
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

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-sm)] md:p-10">
          <div className="mb-6 flex items-start gap-3 text-sm leading-relaxed text-black/68">
            <ShieldCheck size={18} className="shrink-0 text-[var(--color-accent)]" />
            <span>
              Disiscrizione con un click in ogni email. Non passiamo mai i tuoi dati a terzi.
            </span>
          </div>
          <Newsletter compact variant="sand" source="home_newsletter_feature" />
        </div>
      </div>
    </section>
  );
}
