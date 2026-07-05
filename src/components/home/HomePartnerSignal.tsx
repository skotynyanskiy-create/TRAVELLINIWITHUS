import { ArrowRight, BriefcaseBusiness, FileText } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { trackEvent } from '../../services/analytics';

export default function HomePartnerSignal() {
  const trackPartnerClick = (ctaId: string) => {
    trackEvent('partner_cta_click', {
      route: '/',
      source: 'home_partner_signal',
      cta_id: ctaId,
      content_id: 'partner_entry',
    });
  };

  return (
    <section className="bg-[var(--color-sand)] py-8">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="rounded-2xl border border-black/5 bg-white/80 p-8 backdrop-blur-md shadow-sm grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)]">
              <BriefcaseBusiness size={12} className="text-[var(--color-accent)]" />
              Per partner e territori
            </div>
            <p className="font-serif text-2xl leading-snug text-[var(--color-ink)] md:text-3xl">
              Per hotel, territori e brand che vogliono un racconto utile, non una marchetta.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/58 md:text-base">
              Audience travel couple-led, taglio editoriale e contenuti pensati per ispirare e
              aiutare a decidere.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link
              to="/collaborazioni"
              onClick={() => trackPartnerClick('home_partner_signal_collaborazioni')}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 px-5 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Guarda le collaborazioni{' '}
              <ArrowRight
                size={14}
                className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/media-kit"
              onClick={() => trackPartnerClick('home_partner_signal_media_kit')}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
            >
              <FileText size={14} /> Richiedi il media kit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
