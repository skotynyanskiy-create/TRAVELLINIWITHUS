import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Camera,
  CheckCircle2,
  Compass,
  Heart,
  MapPin,
  UtensilsCrossed,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import JsonLd from '../components/JsonLd';
import Newsletter from '../components/Newsletter';
import OptimizedImage from '../components/OptimizedImage';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import { MEDIA } from '../config/mediaAssets';
import { siteContentDefaults } from '../config/siteContent';
import { SITE_URL, BRAND_STATS } from '../config/site';
import { useSiteContent } from '../hooks/useSiteContent';

const METHOD_STEPS = [
  {
    step: '01',
    eyebrow: 'Come scegliamo',
    title: 'Selezione dichiarata, non catalogo',
    text: 'Non consigliamo un posto solo perche e di tendenza. Entra sul sito quando ha un valore concreto per chi viaggia: atmosfera, contesto e utilita reale.',
    icon: Compass,
  },
  {
    step: '02',
    eyebrow: 'Come proviamo',
    title: 'Viaggio diretto, non recensione da desk',
    text: 'Dormiamo, mangiamo, camminiamo. Se un hotel non ci convince dopo una notte, non entra. Se qualcosa non regge, non viene raccontato come se reggesse.',
    icon: Camera,
  },
  {
    step: '03',
    eyebrow: 'Come raccontiamo',
    title: 'Lentezza, criterio, dettaglio',
    text: 'Le nostre guide sono pensate per aiutarti a decidere meglio: quando andare, cosa evitare, dove dormire e quali errori puoi saltare.',
    icon: BookOpen,
  },
  {
    step: '04',
    eyebrow: 'Come monetizziamo',
    title: 'Affiliate chiari, niente pubblicita invasiva',
    text: 'Usiamo link affiliati solo quando hanno senso nel viaggio. Nessun banner rumoroso, nessun contenuto spinto solo per convertire.',
    icon: Briefcase,
  },
] as const;

const PATHS = [
  {
    icon: MapPin,
    eyebrow: 'Cerchi una destinazione',
    title: 'Apri gli hub paese',
    text: 'Parti da un paese, poi scendi in guide, itinerari e alloggi. E il punto giusto se non hai ancora deciso davvero dove andare.',
    links: [
      { label: 'Italia', href: '/destinazioni/italia' },
      { label: 'Grecia', href: '/destinazioni/grecia' },
      { label: 'Portogallo', href: '/destinazioni/portogallo' },
    ],
  },
  {
    icon: BookOpen,
    eyebrow: 'Hai gia scelto il viaggio',
    title: 'Vai a guide e itinerari',
    text: 'Quando sai gia il luogo o il mood del viaggio, entra nel layer pratico: guide, hotel e itinerari con una semantica piu chiara.',
    links: [
      { label: 'Guide pratiche', href: '/guide' },
      { label: 'Itinerari', href: '/itinerari' },
      { label: 'Dove dormire', href: '/dove-dormire' },
    ],
  },
  {
    icon: Briefcase,
    eyebrow: 'Rappresenti un brand o ente',
    title: 'Vai alle collaborazioni',
    text: 'Hotel, destinazioni e brand lifestyle: qui trovi il lato business del progetto, separato dal percorso lettore.',
    links: [
      { label: 'Collaborazioni', href: '/collaborazioni' },
      { label: 'Media Kit', href: '/media-kit' },
    ],
  },
] as const;

const QUICK_WINS = [
  {
    label: 'Hub paese Italia',
    href: '/destinazioni/italia',
    description: 'Il paese che conosciamo meglio.',
  },
  { label: 'Guide pratiche', href: '/guide', description: 'Il layer operativo del sito.' },
  {
    label: 'Hotel consigliati',
    href: '/dove-dormire',
    description: 'Le strutture che rifaremmo davvero.',
  },
  { label: 'Metodo editoriale', href: '/chi-siamo', description: 'Chi siamo e come lavoriamo.' },
] as const;

export default function IniziaDaQui() {
  const pageUrl = `${SITE_URL}/inizia-da-qui`;
  const { data: planningContent } = useSiteContent('planning');
  const planning = planningContent ?? siteContentDefaults.planning;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Inizia da qui - Travelliniwithus',
    description:
      'Come funziona Travelliniwithus, qual e il nostro metodo editoriale e da dove partire per esplorare, pianificare o collaborare.',
    url: pageUrl,
    inLanguage: 'it-IT',
  };

  return (
    <PageLayout>
      <SEO
        title="Inizia da qui - Il metodo Travelliniwithus"
        description="Come funziona Travelliniwithus, qual e il nostro metodo e come usare il sito per esplorare, pianificare o collaborare."
        canonical={pageUrl}
      />
      <JsonLd data={schema} />

      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 opacity-30">
          <OptimizedImage
            src={MEDIA.hero.primary}
            alt=""
            priority
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/70" />

        <div className="relative mx-auto max-w-272 px-6 py-28 md:px-10 md:py-36 xl:px-12">
          <Breadcrumbs items={[{ label: planning.heroEyebrow }]} className="text-white/70" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/75">
              {planning.heroEyebrow}
            </span>
            <h1 className="mt-5 text-5xl font-serif leading-[1.05] md:text-7xl">
              {planning.heroTitleMain}{' '}
              <span className="italic text-white/70">{planning.heroTitleAccent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
              {planning.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={planning.primaryCtaLink}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:bg-accent-soft"
              >
                {planning.primaryCtaLabel}
                <ArrowRight size={14} />
              </Link>
              <Link
                to={planning.secondaryCtaLink}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-white/40"
              >
                {planning.secondaryCtaLabel}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Heart size={14} className="text-accent" />
                <span>{BRAND_STATS.destinationsExplored} destinazioni esplorate</span>
              </div>
              <span className="text-white/30">·</span>
              <div className="flex items-center gap-2">
                <Camera size={14} className="text-accent" />
                <span>{BRAND_STATS.yearsOfTravel} anni di viaggio insieme</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-sand py-20 md:py-28">
        <div className="mx-auto max-w-272 px-6 md:px-10">
          <div className="mb-14 max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Il metodo in 4 scene
            </span>
            <h2 className="mt-4 text-4xl font-serif leading-tight text-ink md:text-5xl">
              Il modo piu onesto di capirci e spiegarti{' '}
              <span className="italic text-black/55">come lavoriamo.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {METHOD_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="relative rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm md:p-10"
                >
                  <div className="absolute right-6 top-6 font-serif text-5xl text-accent-soft">
                    {step.step}
                  </div>
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent-text">
                    {step.eyebrow}
                  </span>
                  <h3 className="mt-2 text-2xl font-serif leading-tight text-ink md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-black/65">{step.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-304 px-6 md:px-10 xl:px-12">
          <div className="mb-12 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Come usare il sito
            </span>
            <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-serif leading-tight text-ink md:text-5xl">
              Tre percorsi chiari in base a{' '}
              <span className="italic text-black/55">quello che cerchi adesso</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PATHS.map((path, idx) => {
              const Icon = path.icon;
              return (
                <motion.div
                  key={path.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col rounded-[2rem] border border-black/5 bg-sand p-8"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-accent shadow-sm">
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent-text">
                    {path.eyebrow}
                  </span>
                  <h3 className="mt-2 text-2xl font-serif leading-tight text-ink">{path.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-black/62">{path.text}</p>

                  <div className="mt-6 space-y-2">
                    {path.links.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm text-ink transition-colors hover:text-accent-text"
                      >
                        <span>{link.label}</span>
                        <ArrowRight size={14} className="text-black/30" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-sand py-20 md:py-24">
        <div className="mx-auto max-w-272 px-6 md:px-10">
          <div className="mb-10 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Vuoi partire subito?
            </span>
            <h2 className="mt-4 text-3xl font-serif leading-tight text-ink md:text-4xl">
              Ecco 4 punti di partenza che consigliamo sempre per primi
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {QUICK_WINS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="group flex items-start gap-4 rounded-2xl border border-black/5 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <CheckCircle2
                  size={22}
                  className="mt-1 shrink-0 text-accent transition-colors group-hover:text-accent-text"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-serif leading-tight text-ink group-hover:text-accent-text">
                    {item.label}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-black/60">{item.description}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="mt-1 text-black/30 transition-colors group-hover:text-accent"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-white md:py-24">
        <div className="mx-auto grid max-w-272 gap-10 px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-16 md:px-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
              Un ultimo passo
            </span>
            <h2 className="mt-4 max-w-xl text-4xl font-serif leading-[1.05] md:text-5xl">
              Ricevi nuovi hotel, guide e itinerari
              <span className="italic text-white/55"> prima di tutti.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
              Una email calma, solo quando pubblichiamo qualcosa che aiuta davvero a decidere
              meglio.
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-white/60">
              <UtensilsCrossed size={14} className="text-accent" />
              <span>Poi scopri anche</span>
              <Link to="/cosa-mangiare" className="text-white underline-offset-4 hover:underline">
                cosa mangiare davvero
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-10">
            <Newsletter compact variant="business" source="inizia_da_qui" />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
