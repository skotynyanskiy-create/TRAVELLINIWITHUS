import { motion } from 'motion/react';
import { ArrowRight, Download, FileText, Mail, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { BRAND_STATS, CONTACTS, SITE_URL } from '../config/site';
import { trackEvent } from '../services/analytics';

const PRESS_HIGHLIGHTS = [
  {
    title: 'Storytelling editoriale',
    text: 'Articoli, guide e contenuti visual costruiti sulla ricerca diretta dei luoghi.',
  },
  {
    title: 'Identita riconoscibile',
    text: 'Tono caldo, ricerca della qualita visiva e selettivita nelle collaborazioni.',
  },
  {
    title: 'Community attiva',
    text: 'Pubblico italiano interessato a posti curiosi, esperienze pratiche e viaggio lento.',
  },
];

const ASSET_BUNDLES = [
  {
    title: 'Media kit completo',
    description: 'Profilo del progetto, audience, format collaborazioni, casi tipo.',
    href: '/media-kit.pdf',
    icon: FileText,
    trackingId: 'press_media_kit',
  },
  {
    title: 'Brand snapshot',
    description: 'Visione, posizionamento e pillar editoriali per pubblicazione redazionale.',
    href: '/media-kit.pdf',
    icon: Newspaper,
    trackingId: 'press_brand_snapshot',
  },
];

function handleAssetClick(trackingId: string) {
  trackEvent('press_asset_download', { id: trackingId });
}

export default function Press() {
  const breadcrumbItems = [{ label: 'Press' }];

  return (
    <PageLayout>
      <SEO
        title="Press"
        description="Risorse stampa di Travelliniwithus: media kit, brand snapshot, contatti diretti per redazioni, riviste e media partner."
        canonical={`${SITE_URL}/press`}
      />

      <Section className="pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-8 grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-12 bg-[var(--color-accent)]" />
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
                Press · Media
              </span>
            </div>
            <h1 className="text-5xl font-serif leading-[1.05] tracking-tight md:text-6xl">
              Risorse per redazioni
              <br />
              <span className="italic text-black/55">e media partner.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/70">
              Materiali ordinati per chi scrive su Travelliniwithus o vuole capire il progetto prima
              di un servizio. Scarica i bundle, contattaci se serve un taglio dedicato per la
              testata.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {PRESS_HIGHLIGHTS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-black/5 bg-[var(--color-accent-soft)] p-5"
                >
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-black/70">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm md:p-10"
          >
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              Numeri pubblici
            </p>
            <p className="text-base leading-relaxed text-black/70">
              Segnali di reach e community usati per orientare la conversazione redazionale.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/40">
                  Instagram
                </dt>
                <dd className="mt-1 font-serif text-3xl">{BRAND_STATS.instagramFollowers}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/40">
                  TikTok
                </dt>
                <dd className="mt-1 font-serif text-3xl">{BRAND_STATS.tiktokFollowers}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/40">
                  Reach mensile
                </dt>
                <dd className="mt-1 font-serif text-3xl">{BRAND_STATS.monthlyReach}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/40">
                  Engagement
                </dt>
                <dd className="mt-1 font-serif text-3xl">{BRAND_STATS.engagementRate}</dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </Section>

      <Section className="mt-12">
        <div className="mb-10">
          <h2 className="text-3xl font-serif md:text-4xl">Bundle scaricabili</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-black/65">
            Documenti pronti per redazioni, blog di settore e media partner. Scarica subito, senza
            compilare moduli.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ASSET_BUNDLES.map((asset) => {
            const Icon = asset.icon;
            return (
              <a
                key={asset.trackingId}
                href={asset.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleAssetClick(asset.trackingId)}
                className="group flex items-start gap-5 rounded-3xl border border-black/5 bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <Icon size={22} />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 font-serif text-2xl leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent-text)]">
                    {asset.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-black/60">{asset.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                    <Download size={12} /> Scarica
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </Section>

      <Section className="my-16 rounded-[3rem] bg-[var(--color-ink)] p-12 text-white md:p-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent)]">
              Contatto stampa
            </span>
            <h2 className="text-4xl font-serif leading-tight md:text-5xl">
              Per richieste editoriali, interviste o storie dedicate scrivici direttamente.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
              Rispondiamo entro 48 ore lavorative. Se preferisci una chiamata, indicaci due fasce
              orarie disponibili nel messaggio.
            </p>
          </div>
          <div className="space-y-4">
            <a
              href={CONTACTS.mailto}
              onClick={() => trackEvent('press_email_click', { id: 'press_email' })}
              className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 p-5 transition-colors hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                    Email diretta
                  </p>
                  <p className="font-serif text-lg">{CONTACTS.email}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-white/40" />
            </a>
            <Link
              to="/contatti?topic=press"
              className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 p-5 transition-colors hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                    Modulo strutturato
                  </p>
                  <p className="font-serif text-lg">Vai al form Press</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-white/40" />
            </Link>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
