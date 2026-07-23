import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Download,
  FileText,
  Loader2,
  Mail,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { trackEvent } from '@/src/services/analytics';
import { appendLeadFallback } from '@/src/lib/leadFallback';

export default function DiarioConversionSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalized = email.trim();

    if (!normalized || !isValidEmail(normalized)) {
      setError('Inserisci una mail valida.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    trackEvent('diario_newsletter_submit_attempt', { source: 'diario_conversion_section' });

    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalized, source: 'diario_conversion_section' }),
      });

      if (!response.ok) throw new Error('Failed');

      trackEvent('newsletter_signup', { route: '/_dev/diario-preview', source: 'diario_home' });
      sessionStorage.setItem('twu_lead_magnet_unlocked', '1');
      setIsSuccess(true);
    } catch {
      const saved = appendLeadFallback('twu_newsletter_leads', {
        email: normalized,
        source: 'diario_conversion_section',
        date: new Date().toISOString(),
      });
      if (saved) {
        trackEvent('newsletter_signup', {
          route: '/_dev/diario-preview',
          fallback: 'localStorage',
        });
        sessionStorage.setItem('twu_lead_magnet_unlocked', '1');
        setIsSuccess(true);
      } else {
        setError('Si è verificato un errore. Riprova tra poco.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-20 text-[var(--color-ink,#1a2b3c)] md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Box 1: B2C Lead Magnet Download */}
          <div className="flex flex-col justify-between rounded-[var(--radius-xl,24px)] border border-[var(--color-border,#e5dcd0)] bg-[var(--color-sand,#faf7f2)] p-8 shadow-md md:p-12">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-accent,#c85a32)]">
                <Sparkles size={14} /> Per la Community
              </span>
              <h3 className="mt-4 font-serif text-3xl font-normal leading-tight md:text-4xl">
                Scarica la mini guida <br />
                <span className="italic text-[var(--color-accent)]">
                  "10 posti italiani da salvare"
                </span>
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted-fg,#546274)] md:text-base">
                Una selezione curata dal brand nato nel 2018: percorsi fuori rotte principali,
                periodo ideale e consigli pratici.
              </p>
            </div>

            <div className="mt-8">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="La tua email lavorativa o personale"
                      required
                      className="w-full rounded-full border border-black/15 bg-white py-3.5 pl-11 pr-5 text-sm text-[var(--color-ink)] placeholder:text-black/40 focus:border-[var(--color-accent)] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[var(--color-accent)] disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        Invio in corso <Loader2 size={15} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        Ricevi il PDF Gratuito <Download size={15} />
                      </>
                    )}
                  </button>
                  {error && <p className="text-xs text-red-600">{error}</p>}
                </form>
              ) : (
                <div className="rounded-2xl border border-[var(--color-accent)]/30 bg-white p-6 text-center">
                  <CheckCircle size={28} className="mx-auto mb-3 text-[var(--color-accent)]" />
                  <h4 className="font-serif text-xl">Guida Sbloccata!</h4>
                  <p className="mt-2 text-xs text-black/65">
                    La guida è pronta per il download diretto.
                  </p>
                  <Link
                    to="/lead-magnet"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] hover:underline"
                  >
                    Vai alla pagina di download <ArrowRight size={13} />
                  </Link>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-black/50">
                <Shield size={13} className="text-[var(--color-accent)]" />
                <span>Zero spam. Ti scriviamo solo quando c’è qualcosa che merita davvero.</span>
              </div>
            </div>
          </div>

          {/* Box 2: B2B Commercial Partnerships / Media Kit */}
          <div className="flex flex-col justify-between rounded-[var(--radius-xl,24px)] border border-white/10 bg-[var(--color-ink-deep,#0b0805)] p-8 text-white shadow-xl md:p-12">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                <Sparkles size={14} /> Per Aziende ed Enti Turismo
              </span>
              <h3 className="mt-4 font-serif text-3xl font-normal leading-tight text-white md:text-4xl">
                Progetti di Marketing Territoriale &amp; Hospitality
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
                Lavoriamo con Hotel di charme, Regioni, Enti del Turismo e Brand travel che vogliono
                un racconto autorevole, credibile e libero dai soliti cliché da brochure.
              </p>
            </div>

            <div className="mt-8 border-t border-white/10 pt-8">
              <div className="mb-6 grid grid-cols-2 gap-4 text-xs font-medium text-white/80">
                <div>
                  <span className="block font-serif text-2xl font-normal text-white">172K+</span>
                  <span className="text-[10px] uppercase tracking-wider text-white/50">
                    Follower IG Verificati
                  </span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-normal text-white">AGCOM</span>
                  <span className="text-[10px] uppercase tracking-wider text-white/50">
                    Elenco Influencer IT
                  </span>
                </div>
              </div>

              <Link
                to="/media-kit"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-xs font-bold uppercase tracking-widest text-white transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]"
              >
                <FileText size={15} /> Richiedi il Media Kit B2B <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
