import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import SEO from '../components/SEO';
import PageLayout from '../components/PageLayout';
import Section from '../components/Section';

export default function NotFound() {
  return (
    <PageLayout>
      <SEO
        title="Pagina non trovata"
        description="La pagina che stai cercando non esiste o e stata spostata. Torna alle sezioni principali di Travelliniwithus."
        noindex
      />
      <Section className="min-h-[70vh] flex items-center">
        <div className="w-full max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-[var(--color-accent)]" />
            <span className="uppercase tracking-widest text-sm font-semibold text-[var(--color-accent)]">Errore 404</span>
            <div className="w-12 h-[1px] bg-[var(--color-accent)]" />
          </div>

          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-sand)]">
            <Compass className="text-[var(--color-accent)]" size={32} />
          </div>

          <span className="font-script text-3xl text-[var(--color-accent-warm)] mb-4 block">Ops, ci siamo persi!</span>
          <h1 className="text-display-1 mb-6">
            Pagina <span className="italic opacity-60">non trovata</span>
          </h1>
          <p className="max-w-2xl mx-auto mb-10 text-lg font-light leading-relaxed text-black/70">
            Il contenuto che stai cercando non e disponibile a questo indirizzo. Puoi tornare alla home oppure ripartire da destinazioni, esperienze e guide.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
            >
              Torna alla home <ArrowRight size={14} />
            </Link>
            <Link
              to="/destinazioni"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-8 py-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Esplora i contenuti
            </Link>
            <Link
              to="/guide"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-8 py-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Leggi le guide
            </Link>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
