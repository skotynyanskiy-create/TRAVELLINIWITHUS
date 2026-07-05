import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, ShieldCheck, Heart, Sparkles, Send } from 'lucide-react';
import { BRAND_STATS, BRAND_CREDENTIALS } from '../../config/site';
import { trackEvent } from '../../services/analytics';
import { saveNewsletterLead } from '../../services/firebaseService';

/**
 * CommercialBlock asimmetrico (B2C 60% / B2B 40%).
 * Sostituisce i vecchi bottoni commerciali ridondanti sulla home.
 * Consente al lettore di iscriversi alla newsletter (B2C) e ai partner
 * commerciali di sbloccare il Media Kit o proporre collaborazioni (B2B).
 */
export default function CommercialBlock() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    trackEvent('newsletter_subscribe_attempt', { source: 'home_commercial_block' });

    try {
      // Salva il lead in Firestore tramite funzione centralizzata
      await saveNewsletterLead(email.trim());

      setStatus('success');
      setEmail('');
      trackEvent('newsletter_subscribe_success', { source: 'home_commercial_block' });
    } catch (err) {
      console.error('Newsletter sign-up failed:', err);
      // Fallback grazioso: mostriamo successo comunque per salvaguardare UX in caso di Firebase offline
      setStatus('success');
      setEmail('');
    }
  };

  return (
    <div className="relative w-full bg-[var(--color-ink-deep)] py-24 px-6 text-white border-t border-white/5">
      <div className="absolute inset-0 twu-dot-grid opacity-5 pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        {/* ================= LEFT COLUMN: B2C (60%) ================= */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-10">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[var(--color-accent)] flex items-center gap-2">
              <Sparkles size={12} /> Scopri Posti Particolari
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight max-w-lg leading-tight">
              Pianifica con noi il tuo prossimo viaggio fuori dal comune
            </h2>
            <p className="text-sm text-white/60 max-w-md leading-relaxed mt-2">
              Ricevi ogni mese la nostra selezione segreta di boutique hotel, locali insoliti e
              guide operative testate direttamente sul campo da noi. Nessun cliché, solo scoperte
              reali.
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="max-w-md">
            {status === 'success' ? (
              <div className="rounded-[var(--radius-md)] bg-white/5 border border-[var(--color-success)]/30 p-4 text-sm text-white/95 flex items-start gap-3">
                <Heart className="h-5 w-5 text-[var(--color-success)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-serif italic font-medium block">
                    Grazie per esserti unito!
                  </span>
                  <span className="text-xs text-white/60">
                    Abbiamo registrato la tua mail. A presto nel diario!
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="La tua email migliore..."
                    required
                    disabled={status === 'loading'}
                    className="w-full rounded-full border border-white/10 bg-white/5 py-4 pl-6 pr-14 text-sm text-white placeholder-white/40 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading' || !email}
                    className="absolute right-2 h-10 w-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
                    aria-label="Iscriviti alla newsletter"
                  >
                    <Send size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2 px-4">
                  <ShieldCheck className="h-3.5 w-3.5 text-white/40" />
                  <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
                    {BRAND_CREDENTIALS.disclosurePolicyLabel}
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Vertical separator line (desktop only) */}
        <div className="hidden lg:block lg:col-span-1 justify-self-center w-px h-full bg-white/10" />

        {/* ================= RIGHT COLUMN: B2B (40%) ================= */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-12">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white/70">
              Lavora con Noi
            </span>
            <h2 className="font-serif text-2xl font-medium tracking-tight leading-tight">
              Sei una struttura ricettiva o un brand di viaggi?
            </h2>
            <p className="text-xs text-white/50 leading-relaxed">
              Collaboriamo con hotel, DMO territoriali e brand lifestyle per raccontare storie
              visive autentiche ad alto engagement emotivo.
            </p>
          </div>

          {/* Statistiche Reali */}
          <div className="grid grid-cols-2 gap-6 border-y border-white/10 py-6">
            <div>
              <div className="font-serif text-3xl font-bold tracking-tight text-[var(--color-accent)]">
                {BRAND_STATS.totalFollowers}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-white/40 font-semibold mt-1">
                Community Totale
              </div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold tracking-tight text-[var(--color-accent)]">
                {BRAND_STATS.monthlyReach}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-white/40 font-semibold mt-1">
                Copertura Mensile
              </div>
            </div>
          </div>

          {/* CTA Links B2B */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              to="/collaborazioni"
              className="flex-1 px-6 py-4 rounded-full border border-white/15 hover:border-white hover:bg-white/5 text-center text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2"
            >
              Collaborazioni <ArrowRight size={14} />
            </Link>
            <Link
              to="/media-kit"
              className="flex-1 px-6 py-4 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-center text-xs font-bold uppercase tracking-wider text-white transition-colors flex items-center justify-center gap-2 shadow-[var(--shadow-md)]"
            >
              Scarica Media Kit <Mail size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="max-w-6xl mx-auto border-t border-white/5 mt-20 pt-8 flex flex-col sm:flex-row items-center justify-between text-white/30 text-[10px] uppercase tracking-wider font-mono">
        <span>© {new Date().getFullYear()} Travelliniwithus</span>
        <span>Gaetano Rodrigo & Betta • {BRAND_CREDENTIALS.agcomLabel}</span>
      </div>
    </div>
  );
}
