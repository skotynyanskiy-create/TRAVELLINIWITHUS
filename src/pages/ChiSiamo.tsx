import { motion } from 'motion/react';
import {
  Camera,
  Compass,
  Instagram,
  Mail,
  MessageCircle,
  NotebookPen,
  ShieldCheck,
} from 'lucide-react';
import Button from '../components/Button';
import JsonLd from '../components/JsonLd';
import Newsletter from '../components/Newsletter';
import OptimizedImage from '../components/OptimizedImage';
import PageLayout from '../components/PageLayout';
import Section from '../components/Section';
import SEO from '../components/SEO';
import { BRAND_STATS, CONTACTS, SITE_URL } from '../config/site';
import { siteContentDefaults } from '../config/siteContent';
import { useSiteContent } from '../hooks/useSiteContent';

const EDITORIAL_GUARDRAILS = [
  'Se un posto funziona solo in foto e non nella vita reale, non ci interessa spingerlo.',
  'Se una collaborazione ci chiede di sembrare entusiasti a prescindere, non è il progetto giusto per noi.',
  'Se un consiglio non aiuta davvero chi legge a decidere meglio, preferiamo non pubblicarlo.',
];

const TIMELINE = [
  {
    year: '2016',
    title: 'Il primo viaggio che cambia il ritmo',
    text: 'Da lì in poi i viaggi smettono di essere solo pause e diventano un modo stabile di guardare i luoghi.',
  },
  {
    year: '2018',
    title: 'Nasce Travelliniwithus',
    text: 'Il progetto parte dai social e da un istinto semplice: consigliare solo quello che vale davvero.',
  },
  {
    year: '2020',
    title: 'Metodo prima del volume',
    text: 'Il progetto prende una direzione più precisa: meno lista, più esperienza diretta, più dettagli utili.',
  },
  {
    year: '2023',
    title: 'Arrivano le prime partnership serie',
    text: 'Hotel, brand e territori iniziano a vedere valore in un racconto più credibile e meno da brochure.',
  },
  {
    year: '2026',
    title: 'Nuova base editoriale',
    text: 'Il sito diventa la casa del progetto: discovery, guide, strumenti e collaborazioni finalmente coerenti.',
  },
];

export default function ChiSiamo() {
  const { data: content } = useSiteContent('about');
  const pageContent = {
    ...siteContentDefaults.about,
    ...content,
    eyebrow: 'Rodrigo, Betta e il metodo Travelliniwithus',
    heroTitleMain: 'Come scegliamo',
    heroTitleAccent: 'i posti che consigliamo',
    introParagraphs: [
      'Siamo Rodrigo e Betta. Travelliniwithus nasce dal desiderio di consigliare meno posti, ma consigliarli meglio.',
      'Il progetto tiene insieme sguardo personale, immagini, ricerca e dettagli pratici: serve a chi vuole scoprire luoghi con più criterio, non a chi cerca la lista più lunga.',
      'Ogni destinazione, soggiorno o esperienza passa da una domanda semplice: aiuterebbe davvero qualcuno a scegliere meglio? Se la risposta è no, non entra qui.',
    ],
    primaryCtaLabel: 'Scopri come collaborare',
    primaryCtaLink: '/collaborazioni',
    quoteText: 'Non ci interessa mostrare tutto. Ci interessa consigliare bene.',
    quoteAuthor: 'Rodrigo & Betta',
    focusTitle: 'Perché fidarsi',
    focusSubtitle: 'Metodo editoriale',
    focusAreas: [
      {
        title: 'Esperienza diretta',
        text: 'Ogni luogo passa dalla prova reale: atmosfera, zona, logistica e dettagli vengono filtrati dal tempo sul posto, non da una lista trovata online.',
      },
      {
        title: 'Libertà editoriale',
        text: 'Quando collaboriamo, lo facciamo in modo dichiarato e senza rinunciare al nostro modo di raccontare. Altrimenti preferiamo non farlo.',
      },
      {
        title: 'Immagini e dettagli credibili',
        text: 'Le foto devono aiutare a capire il luogo, non solo a renderlo desiderabile. Per questo il racconto resta sempre legato alla realtà del posto.',
      },
    ],
    principlesTitle: 'Quello che difendiamo',
    principlesSubtitle: 'Le nostre regole',
    principles: [
      {
        title: 'Utilità prima del volume',
        text: 'Ogni contenuto deve aiutare chi legge a decidere meglio, non solo a restare più tempo sul sito.',
      },
      {
        title: 'Selezione prima della lista',
        text: 'Non cerchiamo di coprire tutto. Selezioniamo luoghi, esperienze e strumenti che hanno davvero qualcosa da lasciare.',
      },
      {
        title: 'Credibilità prima della scena',
        text: 'Preferiamo un racconto più sobrio ma vero a una pagina bella che promette più di quello che esiste.',
      },
    ],
    audienceTitle: 'Per chi è costruito questo progetto',
    audienceDescription:
      'Il nostro contenuto non è per chi vuole tutto e subito. È per chi apprezza scelta, contesto e un punto di vista riconoscibile.',
    audienceItems: [
      'Viaggiatori che vogliono uscire dalle liste copia-incolla e capire se un luogo merita davvero.',
      'Persone che cercano strumenti, guide e dettagli pratici che abbiano un uso concreto.',
      'Partner che capiscono il valore di un racconto con criterio e non di una vetrina generica.',
    ],
  };
  const focusIcons = [Compass, NotebookPen, Camera];

  return (
    <PageLayout>
      <SEO
        title="Chi Siamo"
        description="Chi sono Rodrigo e Betta, come lavorano e perché Travelliniwithus consiglia solo posti particolari raccontati con criterio."
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Travelliniwithus',
          url: SITE_URL,
          description:
            'Posti particolari, esperienze memorabili e consigli utili per chi vuole scoprire, salvare e vivere meglio ogni viaggio.',
          founders: [
            { '@type': 'Person', name: 'Gaetano Rodrigo' },
            { '@type': 'Person', name: 'Betta' },
          ],
          sameAs: [CONTACTS.instagramUrl, CONTACTS.tiktokUrl, CONTACTS.facebookUrl],
        }}
      />

      <Section className="pt-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="order-1 flex flex-col justify-center lg:order-1">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-[var(--color-accent)]" />
              <span className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                {pageContent.eyebrow}
              </span>
            </div>

            <div className="relative mb-8 inline-block">
              <h1 className="text-display-1">
                {pageContent.heroTitleMain}
                <br />
                <span className="italic text-black/60">{pageContent.heroTitleAccent}</span>
              </h1>
              <motion.span
                initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                animate={{ opacity: 1, rotate: -4, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.7 }}
                aria-hidden="true"
                className="absolute -bottom-4 right-6 hidden font-script text-2xl text-[var(--color-accent)] opacity-80 md:block"
              >
                metodo prima del rumore
              </motion.span>
            </div>

            <div className="mb-10 space-y-5 text-lg leading-relaxed text-black/70">
              {pageContent.introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mb-8 grid grid-cols-3 gap-4 sm:max-w-xl">
              <div className="rounded-2xl border border-black/5 bg-white p-5 text-center shadow-sm">
                <div className="text-3xl font-serif text-[var(--color-ink)]">{BRAND_STATS.yearsOfTravel}</div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-black/42">
                  anni di viaggi
                </div>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-5 text-center shadow-sm">
                <div className="text-3xl font-serif text-[var(--color-ink)]">{BRAND_STATS.instagramFollowers}</div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-black/42">
                  community IG
                </div>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-5 text-center shadow-sm">
                <div className="text-3xl font-serif text-[var(--color-ink)]">{BRAND_STATS.tiktokFollowers}</div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-black/42">
                  community TikTok
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex gap-4">
                <a
                  href={CONTACTS.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
                  aria-label="Instagram Travelliniwithus"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href={CONTACTS.mailto}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
                  aria-label="Email Travelliniwithus"
                >
                  <Mail size={20} />
                </a>
                <a
                  href={CONTACTS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
                  aria-label="WhatsApp Travelliniwithus"
                >
                  <MessageCircle size={20} />
                </a>
              </div>
              <Button to={pageContent.primaryCtaLink} variant="primary" size="lg">
                {pageContent.primaryCtaLabel}
              </Button>
            </div>
          </div>

          <div className="relative order-2 lg:order-2">
            <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius-2xl)] shadow-[var(--shadow-premium)] transition-transform duration-700 lg:rotate-2 lg:hover:rotate-0">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1400&auto=format&fit=crop"
                alt="Rodrigo e Betta in viaggio"
                className="block h-full w-full object-cover"
              />
            </div>
            <div className="z-10 hidden max-w-xs rounded-[var(--radius-xl)] border border-[var(--color-ink)]/5 bg-[var(--color-surface)] p-8 shadow-[var(--shadow-premium)] md:absolute md:-bottom-8 md:-left-8 md:block">
              <p className="mb-2 text-xl font-serif italic text-[var(--color-accent)]">
                "{pageContent.quoteText}"
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-black/40">
                {pageContent.quoteAuthor}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title={pageContent.focusTitle} subtitle={pageContent.focusSubtitle}>
        <div className="space-y-6">
          {pageContent.focusAreas.map((item, index) => {
            const Icon = focusIcons[index] ?? Compass;
            return (
              <div key={item.title} className="card-info flex flex-col gap-6 md:flex-row md:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-xl)] bg-white text-[var(--color-accent)] shadow-sm">
                  <Icon size={28} />
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-serif">{item.title}</h3>
                  <p className="leading-relaxed text-black/70">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title={pageContent.principlesTitle} subtitle={pageContent.principlesSubtitle}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pageContent.principles.map((item, index) => (
            <div
              key={item.title}
              className="group relative rounded-[var(--radius-xl)] border border-black/5 bg-[var(--color-sand)] p-10 transition-all duration-500 hover:shadow-[var(--shadow-premium)]"
            >
              <span className="absolute right-6 top-4 font-serif text-6xl text-[var(--color-accent)]/10">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="relative z-10 mb-4 text-2xl font-serif">{item.title}</h3>
              <p className="relative z-10 leading-relaxed text-black/70">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="rounded-[3rem] bg-[var(--color-sand)] p-12 md:p-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--color-accent)] shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <h2 className="mb-4 text-4xl font-serif">Quello che difendiamo ogni volta che pubblichiamo</h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-black/70">
              Non ci interessa sembrare premium per lessico. Ci interessa essere utili, riconoscibili e credibili.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {EDITORIAL_GUARDRAILS.map((item) => (
              <div key={item} className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
                <p className="leading-relaxed text-black/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="rounded-[3rem] bg-[var(--color-ink)] p-12 text-white md:p-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-serif md:text-5xl">{pageContent.audienceTitle}</h2>
          <p className="mx-auto mb-12 max-w-2xl leading-relaxed text-white/85">
            {pageContent.audienceDescription}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pageContent.audienceItems.map((item) => (
              <div key={item} className="rounded-3xl border border-white/8 bg-[#1C1C1C] p-8 text-left">
                <p className="leading-relaxed text-white/80">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button to="/destinazioni" variant="cta" size="lg">
              Esplora i posti
            </Button>
            <Button to="/collaborazioni" variant="outline-light" size="lg">
              Scopri le collaborazioni
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Il nostro percorso" subtitle="Milestones">
        <div className="mx-auto max-w-3xl">
          {TIMELINE.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex gap-8 pb-12 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white">
                  {milestone.year}
                </div>
                {index < TIMELINE.length - 1 && (
                  <div className="mt-2 h-full w-px bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent)]" />
                )}
              </div>
              <div className="pt-3">
                <h3 className="mb-2 text-2xl font-serif">{milestone.title}</h3>
                <p className="leading-relaxed text-black/70">{milestone.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Newsletter variant="sand" />
    </PageLayout>
  );
}
