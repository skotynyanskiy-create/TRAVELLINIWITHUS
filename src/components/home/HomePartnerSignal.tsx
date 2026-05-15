import { ArrowRight, BriefcaseBusiness, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    <section className="border-y border-black/8 bg-white">
      <div className="mx-auto grid max-w-7xl gap-5 px-6 py-7 md:grid-cols-[1fr_auto] md:items-center md:px-12">
        <div className="max-w-3xl">
          <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
            <BriefcaseBusiness size={12} /> Per partner e territori
          </div>
          <p className="font-serif text-2xl leading-tight text-[var(--color-ink)] md:text-3xl">
            Collaboriamo solo quando il luogo merita un racconto utile e credibile.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
          <Link
            to="/collaborazioni"
            onClick={() => trackPartnerClick('home_partner_signal_collaborazioni')}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-black/10 px-5 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Collaborazioni <ArrowRight size={14} />
          </Link>
          <Link
            to="/media-kit"
            onClick={() => trackPartnerClick('home_partner_signal_media_kit')}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-ink)] px-5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
          >
            <FileText size={14} /> Media kit
          </Link>
        </div>
      </div>
    </section>
  );
}
