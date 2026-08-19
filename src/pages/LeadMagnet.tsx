import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Download, Instagram, MapPin } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { Link } from '@/src/components/TransitionLink';
import PageLayout from '../components/PageLayout';
import Section from '../components/Section';
import SEO from '../components/SEO';
import Button from '../components/Button';
import { CONTACTS, SITE_URL } from '../config/site';
import { trackEvent } from '../services/analytics';

const PDF_URL = '/lead-magnet-posti-italiani.pdf';

export default function LeadMagnet() {
  const [isUnlocked] = useState(
    () =>
      typeof window !== 'undefined' && sessionStorage.getItem('twu_lead_magnet_unlocked') === '1'
  );

  const handleDownload = () => {
    trackEvent('lead_magnet_download', {
      route: '/lead-magnet',
      source: 'lead_magnet_page',
      cta_id: 'lead_magnet_pdf_download',
      content_id: 'lead_magnet_guida',
    });
  };

  if (!isUnlocked) {
    return <Navigate to="/guida-in-regalo?from=lead-magnet" replace />;
  }

  return (
    <PageLayout>
      <SEO
        title="La tua guida è pronta"
        description="Alla scoperta dell’Italia nascosta: 10 posti provati e consigliati da noi, dal brand nato nel 2018. Posti veri, non liste su Pinterest."
        canonical={`${SITE_URL}/lead-magnet`}
        image={`${SITE_URL}/og/lead-magnet.jpg`}
        noindex
      />

      <Section className="pt-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mx-auto mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <CheckCircle size={32} />
            </div>

            <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Iscrizione confermata
            </span>

            <h1 className="mt-4 text-4xl font-serif leading-tight md:text-5xl">
              La tua guida è pronta.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-black/70">
              <strong>Alla scoperta dell’Italia nascosta</strong>: 10 posti provati e consigliati da
              noi, dal brand nato nel 2018. Posti veri, non liste su Pinterest.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={PDF_URL}
                download
                onClick={handleDownload}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-8 text-sm font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-[var(--color-accent-hover)]"
              >
                <Download size={18} /> Scarica il PDF
              </a>
              <a
                href={CONTACTS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-black/10 px-8 text-sm font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)]"
              >
                <Instagram size={18} /> Seguici su Instagram
              </a>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-black/60">
              Il download è sul sito (questo PDF). Se hai lasciato l’email, ti avvisiamo quando esce
              un nuovo posto — non una sequenza di vendita. Per qualsiasi cosa:{' '}
              <a href={CONTACTS.mailto} className="underline underline-offset-2 hover:text-black">
                {CONTACTS.email}
              </a>
              .
            </p>
          </motion.div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <MapPin size={20} />
            </div>
            <h3 className="mb-2 font-serif text-xl">10 posti curati</h3>
            <p className="text-sm leading-relaxed text-black/70">
              Niente algoritmo, niente classifiche da SEO. Scelti dopo viaggi reali in coppia.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <CheckCircle size={20} />
            </div>
            <h3 className="mb-2 font-serif text-xl">Pratica, non lirica</h3>
            <p className="text-sm leading-relaxed text-black/70">
              Per ogni posto: come arrivare, quando andare, costo, consiglio insider.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <Download size={20} />
            </div>
            <h3 className="mb-2 font-serif text-xl">PDF da salvare</h3>
            <p className="text-sm leading-relaxed text-black/70">
              12 pagine, A4, facile da leggere offline o stampare per il viaggio.
            </p>
          </div>
        </div>
      </Section>

      <Section className="rounded-[var(--radius-xl)] bg-[var(--color-sand)] p-12 md:p-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-serif">E ora?</h2>
          <p className="mb-8 text-lg leading-relaxed text-black/70">
            La guida e un assaggio. Sul sito trovi articoli completi, itinerari per coppie e una
            mappa editoriale per scegliere meglio il prossimo viaggio.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button to="/esplora" variant="primary" size="lg" trackingId="lead_magnet_esplora">
              Esplora le destinazioni
            </Button>
            <Link
              to="/mappa"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--color-accent-text)] underline-offset-4 hover:underline"
            >
              Apri la mappa
            </Link>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
