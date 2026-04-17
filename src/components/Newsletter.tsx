import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Gift, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../services/analytics';
import Button from './Button';

type NewsletterVariant = 'sand' | 'white' | 'editorial' | 'compact' | 'article' | 'business';

interface NewsletterProps {
  variant?: NewsletterVariant;
  source?: string;
  compact?: boolean;
  title?: string;
  eyebrow?: string;
  description?: string;
  bullets?: string[];
  ctaLabel?: string;
  onSuccess?: () => void;
}

const variantCopy: Record<
  NewsletterVariant,
  {
    eyebrow: string;
    title: string;
    description: string;
    bullets: string[];
    ctaLabel: string;
  }
> = {
  sand: {
    eyebrow: 'Newsletter Travellini',
    title: 'Posti particolari, senza rumore.',
    description:
      'Una selezione lenta e utile: idee viaggio, guide pratiche e risorse quando hanno davvero senso.',
    bullets: [
      'Luoghi e itinerari da salvare prima che diventino ovvi.',
      'Consigli pratici scritti per decidere meglio, non per riempire la inbox.',
      'Aggiornamenti sui contenuti nuovi e sulle risorse davvero pronte.',
    ],
    ctaLabel: 'Iscriviti alla newsletter',
  },
  white: {
    eyebrow: 'Archivio utile',
    title: 'Una mail quando c e qualcosa da salvare.',
    description:
      'Niente invii automatici senza valore: solo contenuti Travelliniwithus utili per scegliere, organizzare e partire meglio.',
    bullets: [
      'Guide, mappe e idee weekend curate.',
      'Strumenti che usiamo o che consigliamo con criterio.',
      'Zero spam, disiscrizione sempre disponibile.',
    ],
    ctaLabel: 'Ricevi i prossimi contenuti',
  },
  editorial: {
    eyebrow: 'Continua la scoperta',
    title: 'Tieni da parte i prossimi posti giusti.',
    description:
      'La newsletter e il filo tra articoli, guide e risorse: pochi contenuti, scelti con lo stesso metodo editoriale del sito.',
    bullets: [
      'Posti particolari e informazioni concrete.',
      'Percorsi utili per coppie, weekend e viaggi lenti.',
      'Anteprime delle guide quando sono davvero pronte.',
    ],
    ctaLabel: 'Entra nella lista',
  },
  compact: {
    eyebrow: 'Newsletter',
    title: 'Ricevi i prossimi contenuti utili.',
    description: 'Un aggiornamento sobrio quando pubblichiamo qualcosa che vale la pena salvare.',
    bullets: [],
    ctaLabel: 'Iscriviti',
  },
  article: {
    eyebrow: 'Dopo questa lettura',
    title: 'Ricevi il prossimo posto da salvare.',
    description:
      'Se questo contenuto ti e stato utile, la newsletter e il modo più semplice per non perdere le prossime guide.',
    bullets: [
      'Guide pratiche, non solo ispirazione.',
      'Luoghi selezionati con criterio.',
      'Nessuna sequenza aggressiva di vendita.',
    ],
    ctaLabel: 'Ricevi le prossime guide',
  },
  business: {
    eyebrow: 'Per partner e lettori',
    title: 'Rimani vicino al progetto.',
    description:
      'Aggiornamenti essenziali su nuovi contenuti, risorse e sviluppi editoriali Travelliniwithus.',
    bullets: [
      'Nuovi racconti e guide dal sito.',
      'Risorse utili e progetti in lavorazione.',
      'Una comunicazione curata, mai invasiva.',
    ],
    ctaLabel: 'Rimani aggiornato',
  },
};

function resolveCopy({
  variant,
  title,
  eyebrow,
  description,
  bullets,
  ctaLabel,
}: Pick<NewsletterProps, 'variant' | 'title' | 'eyebrow' | 'description' | 'bullets' | 'ctaLabel'>) {
  const base = variantCopy[variant ?? 'sand'];

  return {
    eyebrow: eyebrow ?? base.eyebrow,
    title: title ?? base.title,
    description: description ?? base.description,
    bullets: bullets ?? base.bullets,
    ctaLabel: ctaLabel ?? base.ctaLabel,
  };
}

export default function Newsletter({
  variant = 'sand',
  source = 'newsletter_form',
  compact = false,
  title,
  eyebrow,
  description,
  bullets,
  ctaLabel,
  onSuccess,
}: NewsletterProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const copy = resolveCopy({ variant, title, eyebrow, description, bullets, ctaLabel });
  const isCompact = compact || variant === 'compact';
  const isDark = variant === 'article' || variant === 'business';

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError('Inserisci un indirizzo email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Inserisci un indirizzo email valido.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, source }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      trackEvent('newsletter_signup', { source });
      setIsSubscribed(true);
      if (onSuccess) {
        setTimeout(onSuccess, 1200);
      }
    } catch {
      // Fallback: salva in localStorage quando l'API non è configurata
      try {
        const stored = JSON.parse(localStorage.getItem('twu_newsletter_leads') || '[]');
        stored.push({ email: normalizedEmail, source, date: new Date().toISOString() });
        localStorage.setItem('twu_newsletter_leads', JSON.stringify(stored));
        trackEvent('newsletter_signup', { source, fallback: 'localStorage' });
        setIsSubscribed(true);
        if (onSuccess) {
          setTimeout(onSuccess, 2000);
        }
      } catch {
        setError('Iscrizione non riuscita. Riprova tra poco oppure scrivici direttamente via email.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = (
    <AnimatePresence mode="wait">
      {!isSubscribed ? (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubscribe}
          className={isCompact ? 'space-y-3' : 'space-y-5'}
        >
          <div className={isCompact ? 'flex flex-col gap-2 sm:flex-row' : 'space-y-2'}>
            {!isCompact && (
              <label
                htmlFor={`newsletter-email-${source}`}
                className={`block text-xs font-bold uppercase tracking-[0.22em] ${
                  isDark ? 'text-white/50' : 'text-black/45'
                }`}
              >
                La tua email
              </label>
            )}
            <input
              id={`newsletter-email-${source}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@esempio.com"
              required
              className={`w-full rounded-full border px-5 py-3 text-sm transition-all focus:border-[var(--color-accent)] focus:outline-none ${
                isDark
                  ? 'border-white/15 bg-white/10 text-white placeholder:text-white/35'
                  : 'border-black/10 bg-white text-[var(--color-ink)] placeholder:text-black/30'
              } ${isCompact ? 'sm:flex-1' : 'md:px-6 md:py-4'}`}
            />
            {isCompact ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:opacity-50 ${
                  isDark
                    ? 'bg-[var(--color-accent)] text-[var(--color-ink)]'
                    : 'bg-[var(--color-ink)] text-white'
                }`}
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                {copy.ctaLabel}
              </button>
            ) : (
              <Button type="submit" className="w-full">
                {isSubmitting ? (
                  <>
                    Iscrizione in corso <Loader2 size={16} className="animate-spin" />
                  </>
                ) : (
                  <>
                    {copy.ctaLabel} <Mail size={16} />
                  </>
                )}
              </Button>
            )}
          </div>

          {error && <p className={`text-sm ${isDark ? 'text-red-200' : 'text-red-600'}`}>{error}</p>}

          {!isCompact && (
            <p className={`text-center text-xs leading-relaxed ${isDark ? 'text-white/45' : 'text-black/40'}`}>
              Iscrivendoti accetti il trattamento dei dati secondo la nostra{' '}
              <Link
                to="/privacy"
                className={`underline underline-offset-2 ${isDark ? 'hover:text-white' : 'hover:text-black/70'}`}
              >
                privacy policy
              </Link>
              . Puoi disiscriverti quando vuoi.
            </p>
          )}
        </motion.form>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-5 ${isDark ? 'bg-white/10 text-white' : 'bg-[var(--color-accent-soft)] text-[var(--color-ink)]'}`}
        >
          <div className="flex items-start gap-4">
            <CheckCircle className="mt-0.5 shrink-0 text-[var(--color-accent)]" size={24} />
            <div>
              <p className="font-serif text-xl">Iscrizione confermata.</p>
              <p className={`mt-1 text-sm leading-relaxed ${isDark ? 'text-white/65' : 'text-black/60'}`}>
                Richiesta ricevuta. Se la piattaforma email non e ancora attiva, il lead resta comunque salvato.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (isCompact) {
    return <div className="w-full">{form}</div>;
  }

  return (
    <section
      id="newsletter"
      className={`overflow-hidden rounded-[2.5rem] px-6 py-12 md:px-12 md:py-16 ${
        isDark
          ? 'bg-[var(--color-ink)] text-white'
          : variant === 'white'
            ? 'bg-white text-[var(--color-ink)]'
            : 'bg-[var(--color-sand)] text-[var(--color-ink)]'
      }`}
    >
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <span
            className={`mb-5 block text-[10px] font-bold uppercase tracking-[0.28em] ${
              isDark ? 'text-[var(--color-accent)]' : 'text-[var(--color-accent-text)]'
            }`}
          >
            {copy.eyebrow}
          </span>
          <h2 className="max-w-2xl text-4xl font-serif leading-tight tracking-tight md:text-6xl">
            {copy.title}
          </h2>
          <p className={`mt-6 max-w-2xl text-base leading-relaxed md:text-lg ${isDark ? 'text-white/70' : 'text-black/65'}`}>
            {copy.description}
          </p>

          {copy.bullets.length > 0 && (
            <div className="mt-8 grid gap-3">
              {copy.bullets.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 shrink-0 text-[var(--color-accent)]" size={18} />
                  <span className={`text-sm leading-relaxed ${isDark ? 'text-white/68' : 'text-black/62'}`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`rounded-[2rem] border p-6 md:p-8 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-white/80'}`}>
          <div className="mb-6 flex items-start gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isDark ? 'bg-white/10' : 'bg-[var(--color-accent-soft)]'}`}>
              <Gift className="text-[var(--color-accent)]" size={22} />
            </div>
            <div>
              <p className="font-serif text-xl">Invii curati, non automatici.</p>
              <p className={`mt-1 text-sm leading-relaxed ${isDark ? 'text-white/55' : 'text-black/50'}`}>
                Il punto non e scrivere spesso: e mandare qualcosa che valga davvero un salvataggio.
              </p>
            </div>
          </div>
          {form}
        </div>
      </div>
    </section>
  );
}
