import { motion } from 'motion/react';
import {
  BadgeCheck,
  Camera,
  Compass,
  Instagram,
  Landmark,
  Mail,
  MessageCircle,
  NotebookPen,
  ShieldCheck,
} from 'lucide-react';
import Button from '../components/Button';
import JsonLd from '../components/JsonLd';
import Newsletter from '../components/Newsletter';
import PageLayout from '../components/PageLayout';
import Section from '../components/Section';
import SEO from '../components/SEO';
import { BRAND_CREDENTIALS, BRAND_STATS, CONTACTS, SITE_URL } from '../config/site';
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
        title="Rodrigo e Betta: chi siamo"
        description="Dalla nascita del brand nel 2018: viaggi in coppia raccontati con criterio. Come scegliamo i posti, perché ne consigliamo pochi, cosa garantiamo a chi ci legge."
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Chi siamo', url: `${SITE_URL}/chi-siamo` },
        ]}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Travelliniwithus',
          url: SITE_URL,
          description:
            'Posti particolari, esperienze vere e consigli pratici da chi li ha vissuti. Travelliniwithus.',
          founders: [
            { '@type': 'Person', name: 'Gaetano Rodrigo' },
            { '@type': 'Person', name: 'Betta' },
          ],
          sameAs: [CONTACTS.instagramUrl, CONTACTS.tiktokUrl, CONTACTS.facebookUrl],
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Gaetano Rodrigo',
          givenName: 'Gaetano',
          jobTitle: 'Travel creator',
          url: `${SITE_URL}/chi-siamo`,
          worksFor: { '@type': 'Organization', name: 'Travelliniwithus', url: SITE_URL },
          sameAs: [CONTACTS.instagramUrl, CONTACTS.tiktokUrl, CONTACTS.facebookUrl],
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Betta',
          jobTitle: 'Travel creator',
          url: `${SITE_URL}/chi-siamo`,
          worksFor: { '@type': 'Organization', name: 'Travelliniwithus', url: SITE_URL },
          sameAs: [CONTACTS.instagramUrl, CONTACTS.tiktokUrl, CONTACTS.facebookUrl],
        }}
      />

      <Section className="pt-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="order-1 flex flex-col justify-center lg:order-1">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-[var(--color-accent)]" />
              <span className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent-text)]">
                {pageContent.eyebrow}
              </span>
            </div>

            <div className="relative mb-8 inline-block">
              <h1 className="text-display-1">
                {pageContent.heroTitleMain}
                <br />{' '}
                <span className="italic text-[var(--color-ink-2)]">
                  {pageContent.heroTitleAccent}
                </span>
              </h1>
            </div>

            <div className="mb-10 space-y-5 text-lg leading-relaxed text-[var(--color-ink-2)]">
              {pageContent.introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mb-8 grid grid-cols-3 gap-4 sm:max-w-xl">
              <div className="border-t border-[var(--color-border)] pt-4 text-center">
                <div className="text-3xl font-serif text-[var(--color-ink)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                  2018
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-2)]">
                  nascita del brand
                </div>
              </div>
              <div className="border-t border-[var(--color-border)] pt-4 text-center">
                <div className="text-3xl font-serif text-[var(--color-ink)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                  {BRAND_STATS.instagramFollowers}
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-2)]">
                  community IG
                </div>
              </div>
              <div className="border-t border-[var(--color-border)] pt-4 text-center">
                <div className="text-3xl font-serif text-[var(--color-ink)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                  {BRAND_STATS.tiktokFollowers}
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-2)]">
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
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border)] bg-white transition-colors duration-300 hover:border-[var(--color-accent)]/35 hover:text-[var(--color-accent)]"
                  aria-label="Instagram Travelliniwithus"
                >
                  <Instagram
                    size={20}
                    className="transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110"
                  />
                </a>
                <a
                  href={CONTACTS.mailto}
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border)] bg-white transition-colors duration-300 hover:border-[var(--color-accent)]/35 hover:text-[var(--color-accent)]"
                  aria-label="Email Travelliniwithus"
                >
                  <Mail
                    size={20}
                    className="transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110"
                  />
                </a>
                <a
                  href={CONTACTS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border)] bg-white transition-colors duration-300 hover:border-[var(--color-accent)]/35 hover:text-[var(--color-accent)]"
                  aria-label="WhatsApp Travelliniwithus"
                >
                  <MessageCircle
                    size={20}
                    className="transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110"
                  />
                </a>
              </div>
              <Button to={pageContent.primaryCtaLink} variant="primary" size="lg" magnetic={true}>
                {pageContent.primaryCtaLabel}
              </Button>
            </div>
          </div>

          <div className="relative order-2 lg:order-2">
            {/* Pagina di taccuino al posto del ritratto: nessuna foto della
                coppia finché non esiste uno scatto reale certificato
                (imagery truth rule 2026-07-22). */}
            <div className="flex aspect-[4/5] flex-col justify-between rounded-[var(--radius-2xl,24px)] border border-[var(--color-border)] bg-white p-8 shadow-lg md:p-10">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                Rodrigo &amp; Betta
              </span>
              <div>
                <p className="font-serif text-5xl leading-[1.04] text-[var(--color-ink,#1a2b3c)] md:text-6xl">
                  Rodrigo
                  <br />
                  &amp; Betta
                </p>
                <p className="mt-4 font-serif italic text-xl text-[var(--color-muted-fg)]">
                  Meno posti, ma consigliati meglio.
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)]">
                  {CONTACTS.instagramHandle}
                </span>
                <span
                  aria-hidden="true"
                  className="rounded-full bg-[var(--color-sand,#faf7f2)] border border-[var(--color-accent,#c85a32)]/30 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-accent-text)]"
                >
                  8 Anni di Viaggi
                </span>
              </div>
            </div>
            <div className="z-10 hidden max-w-xs rounded-[var(--radius-xl)] border border-[var(--color-ink)]/5 bg-[var(--color-surface)] p-8 shadow-[var(--shadow-premium)] md:absolute md:-bottom-8 md:-left-8 md:block">
              <p className="mb-2 text-xl font-serif italic text-[var(--color-accent)]">
                "{pageContent.quoteText}"
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-2)]">
                {pageContent.quoteAuthor}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title={pageContent.focusTitle} subtitle={pageContent.focusSubtitle}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pageContent.focusAreas.map((item, index) => {
            const Icon = focusIcons[index] ?? Compass;
            return (
              <div key={item.title} className="relative border-t border-[var(--color-border)] pt-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <Icon size={24} />
                </div>
                <h3 className="mb-3 text-2xl font-serif text-[var(--color-ink)]">{item.title}</h3>
                <p className="leading-relaxed text-[var(--color-ink-2)] text-sm md:text-base">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title={pageContent.principlesTitle} subtitle={pageContent.principlesSubtitle}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pageContent.principles.map((item, index) => (
            <div key={item.title} className="relative border-l border-[var(--color-border)] pl-8">
              <span className="absolute right-6 top-4 font-serif text-6xl text-[var(--color-accent)]/10 transition-transform duration-500 group-hover:scale-110">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="relative z-10 mb-4 text-2xl font-serif text-[var(--color-ink)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                {item.title}
              </h3>
              <p className="relative z-10 leading-relaxed text-[var(--color-ink-2)]">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-y border-[var(--color-border)] bg-[var(--color-surface-2)]">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] bg-white text-[var(--color-accent)] shadow-xs">
              <ShieldCheck size={24} />
            </div>
            <h2 className="mb-4 text-4xl font-serif">
              Quello che difendiamo ogni volta che pubblichiamo
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[var(--color-ink-2)]">
              Non ci interessa sembrare premium per lessico. Ci interessa essere utili,
              riconoscibili e credibili.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {EDITORIAL_GUARDRAILS.map((item) => (
              <div key={item} className="border-l border-[var(--color-accent)]/30 bg-white p-6">
                <p className="leading-relaxed text-[var(--color-ink-2)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.36em] text-[var(--color-accent-text)]">
              Trasparenza
            </span>
            <h2 className="mt-2 text-4xl font-serif leading-tight md:text-5xl">
              Credenziali pubbliche, non slide di un media kit.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-ink-2)]">
              Tre segnali verificabili — il profilo Instagram &egrave; certificato Meta, siamo
              registrati ufficialmente nell&apos;elenco influencer AGCOM, e ogni contenuto
              sponsorizzato &egrave; sempre etichettato come ADV, INVITED o AFFILIAZIONE.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="border-t border-[var(--color-accent)]/25 bg-white p-7 shadow-xs transition-colors duration-300 hover:border-[var(--color-accent)]/45">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <BadgeCheck size={22} />
              </div>
              <h3 className="mb-2 font-serif text-2xl text-[var(--color-ink)]">Meta verified</h3>
              <p className="text-sm leading-relaxed text-[var(--color-ink-2)]">
                Profilo Instagram con badge ufficiale Meta. L&apos;account
                <span className="font-semibold"> @travelliniwithus </span>
                &egrave; verificato e protetto da impersonificazione.
              </p>
            </div>

            <div className="border-t border-[var(--color-accent)]/25 bg-white p-7 shadow-xs transition-colors duration-300 hover:border-[var(--color-accent)]/45">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <Landmark size={22} />
              </div>
              <h3 className="mb-2 font-serif text-2xl text-[var(--color-ink)]">AGCOM registered</h3>
              <p className="text-sm leading-relaxed text-[var(--color-ink-2)]">
                Iscritti nell&apos;elenco degli influencer dell&apos;Autorit&agrave; per le Garanzie
                nelle Comunicazioni. Significa rispetto delle linee guida italiane su trasparenza
                pubblicitaria, disclosure e dati personali.
              </p>
            </div>

            <div className="border-t border-[var(--color-accent)]/25 bg-white p-7 shadow-xs transition-colors duration-300 hover:border-[var(--color-accent)]/45">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <ShieldCheck size={22} />
              </div>
              <h3 className="mb-2 font-serif text-2xl text-[var(--color-ink)]">
                Disclosure sempre
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-ink-2)]">
                Ogni contenuto pagato, ospitato o affiliato &egrave; etichettato
                <span className="font-semibold"> ADV</span>,
                <span className="font-semibold"> INVITED</span> o
                <span className="font-semibold"> AFFILIAZIONE</span>. Chi legge sa sempre qual
                &egrave; la natura del consiglio.
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
            Stato: {BRAND_CREDENTIALS.metaVerified ? 'verificato' : '—'} ·{' '}
            {BRAND_CREDENTIALS.agcomRegistered ? 'in elenco AGCOM' : '—'}
          </p>
        </div>
      </Section>

      <Section className="bg-[var(--color-ink-deep)] text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-serif md:text-5xl">{pageContent.audienceTitle}</h2>
          <p className="mx-auto mb-12 max-w-2xl leading-relaxed text-white/85">
            {pageContent.audienceDescription}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pageContent.audienceItems.map((item) => (
              <div
                key={item}
                className="border-l border-white/15 bg-white/[0.04] p-8 text-left transition-colors duration-300 hover:border-[var(--color-accent)]/60"
              >
                <p className="leading-relaxed text-white/82">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button to="/esplora" variant="cta" size="lg" magnetic={true}>
              Esplora l&apos;Atlante
            </Button>
            <Button to="/collaborazioni" variant="outline-light" size="lg" magnetic={true}>
              Sei un Brand / Hotel? Scopri i Format B2B →
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Il nostro percorso" subtitle="Milestones">
        <div className="mx-auto max-w-3xl">
          {TIMELINE.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: 'easeOut' }}
              className="group flex gap-6 md:gap-8 pb-12 last:pb-0"
            >
              <div className="flex flex-col items-center shrink-0">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-accent)]/20 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-500 group-hover:border-[var(--color-accent)] group-hover:shadow-[0_10px_25px_rgba(219,104,74,0.15)]">
                  <div className="absolute inset-1.5 rounded-full bg-[var(--color-accent)]/5 transition-colors duration-500 group-hover:brightness-95/10" />
                  <span className="relative z-10 font-serif text-sm font-bold text-[var(--color-ink)] group-hover:text-[var(--color-accent-text)] transition-colors duration-300">
                    {milestone.year}
                  </span>
                </div>
                {index < TIMELINE.length - 1 && (
                  <div className="mt-3 w-0.5 grow bg-gradient-to-b from-[var(--color-accent)]/40 via-[var(--color-accent)]/15 to-transparent" />
                )}
              </div>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex-1 border-l border-[var(--color-border)] bg-white p-6 shadow-xs transition-colors duration-300 hover:border-[var(--color-accent)]/35 md:p-8"
              >
                <h3 className="mb-3 text-2xl font-serif text-[var(--color-ink)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                  {milestone.title}
                </h3>
                <p className="leading-relaxed text-[var(--color-ink-2)]">{milestone.text}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Newsletter variant="sand" />
    </PageLayout>
  );
}
