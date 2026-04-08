import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  CheckCircle,
  Loader2,
  BriefcaseBusiness,
  BarChart3,
  Clapperboard,
  Mail,
  Globe,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import Breadcrumbs from '../components/Breadcrumbs';
import { CONTACTS, SITE_URL } from '../config/site';
import { siteContentDefaults } from '../config/siteContent';
import { useSiteContent } from '../hooks/useSiteContent';

const includes = [
  {
    title: 'Profilo del progetto',
    description:
      'Posizionamento, tono, pubblico di riferimento e modo in cui Travelliniwithus lavora e comunica.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Metriche e audience',
    description:
      'Dati aggiornati e panoramica utile per valutare compatibilita, potenziale e taglio della collaborazione.',
    icon: BarChart3,
  },
  {
    title: 'Formati e deliverable',
    description:
      'Panoramica dei contenuti che possiamo creare: reel, stories, foto, UGC, articoli o attivazioni su misura.',
    icon: Clapperboard,
  },
  {
    title: 'Asset e riferimenti',
    description:
      'Informazioni operative, linee guida e dettagli utili per aprire un confronto in modo piu serio.',
    icon: Download,
  },
];

const idealPartners = [
  'Strutture ricettive, hotel, agriturismi e hospitality con una forte identita di luogo.',
  'Destinazioni, enti turismo, territori ed esperienze che meritano un racconto piu curato e meno brochure.',
  'Brand lifestyle o utility coerenti con il modo reale in cui viviamo e consigliamo il viaggio.',
];

const nextSteps = [
  {
    title: '1. Richiesta',
    text: 'Ci lasci i dati essenziali e ci fai capire chi sei o che tipo di progetto vuoi proporre.',
  },
  {
    title: '2. Valutazione',
    text: "Valutiamo se c'e allineamento reale tra il vostro progetto, il nostro pubblico e il tipo di contenuto che ha senso costruire.",
  },
  {
    title: '3. Contatto',
    text: "Se c'e match, condividiamo il materiale giusto e apriamo un confronto operativo piu concreto.",
  },
];

const projectFocusOptions = [
  'Hotel / hospitality',
  'Destinazione / ente turismo',
  'Brand lifestyle / utility',
  'Evento / experience',
  'UGC / contenuti per canali brand',
  'Altro',
];

export default function MediaKit() {
  const { data: content } = useSiteContent('mediaKit');
  const pageContent = content ?? siteContentDefaults.mediaKit;
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [projectFocus, setProjectFocus] = useState('');
  const [brief, setBrief] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const breadcrumbItems = [{ label: 'Media Kit' }];

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim();
    const normalizedCompany = company.trim();
    const normalizedWebsite = website.trim();
    const normalizedBrief = brief.trim();

    if (!normalizedEmail || !normalizedCompany || !projectFocus || !normalizedBrief) {
      setSubmitError(
        'Inserisci azienda, email lavorativa, focus del progetto e un breve brief per inviare la richiesta.'
      );
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setSubmitError('Inserisci un indirizzo email valido.');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/media-kit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          company: normalizedCompany,
          website: normalizedWebsite || undefined,
          topic: projectFocus,
          message: normalizedBrief || undefined,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Invio non riuscito');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Error saving media kit lead:', error);
      setSubmitError(
        `Non siamo riusciti a registrare la richiesta. Puoi scriverci direttamente a ${CONTACTS.email}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <SEO
        title="Media Kit"
        description="Richiedi il media kit Travelliniwithus per valutare collaborazioni, formati, pubblico e possibilita di racconto."
        canonical={`${SITE_URL}/media-kit`}
      />

      <Section className="pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mx-auto mt-8 max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 bg-[var(--color-accent)]"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                {pageContent.heroEyebrow}
              </span>
              <div className="h-[1px] w-12 bg-[var(--color-accent)]"></div>
            </div>
            <h1 className="mb-8 text-5xl font-serif md:text-7xl">
              {pageContent.heroTitleMain} <br />
              <span className="italic text-black/60">{pageContent.heroTitleAccent}</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl font-normal leading-relaxed text-black/70">
              {pageContent.heroDescription}
            </p>
            <div className="mt-8 inline-flex max-w-2xl items-center rounded-[1.4rem] border border-[var(--color-accent)]/15 bg-[var(--color-accent-soft)] px-6 py-4 text-left text-sm leading-relaxed text-[var(--color-accent-text)]">
              {pageContent.heroProofLine}
            </div>
          </motion.div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-10 rounded-[2rem] border border-black/5 bg-[var(--color-sand)] p-8 md:p-10">
              <h2 className="mb-4 text-3xl font-serif">{pageContent.includesTitle}</h2>
              <p className="font-normal leading-relaxed text-black/70">
                {pageContent.includesDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {includes.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    <item.icon size={24} />
                  </div>
                  <h3 className="mb-3 text-2xl font-serif">{item.title}</h3>
                  <p className="font-normal leading-relaxed text-black/70">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {!isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative h-fit overflow-hidden rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-xl md:p-10"
            >
              <div className="absolute left-0 top-0 h-2 w-full bg-[var(--color-accent)]"></div>
              <div className="mb-8">
                <h2 className="mb-2 text-2xl font-serif">{pageContent.formTitle}</h2>
                <p className="text-sm leading-relaxed text-zinc-500">
                  {pageContent.formDescription}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <label htmlFor="company" className="mb-2 block text-sm font-medium text-zinc-700">
                    Nome azienda / agenzia
                  </label>
                  <input
                    type="text"
                    id="company"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[var(--color-accent)]"
                    placeholder="Es. Travel PR Agency"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="mb-2 block text-sm font-medium text-zinc-700">
                    Sito o profilo brand
                  </label>
                  <div className="relative">
                    <Globe
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                      size={18}
                    />
                    <input
                      type="url"
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 py-3 pl-11 pr-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[var(--color-accent)]"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-700">
                    Email lavorativa
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[var(--color-accent)]"
                    placeholder="nome@azienda.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="project-focus"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Focus della richiesta
                  </label>
                  <div className="relative">
                    <Target
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                      size={18}
                    />
                    <select
                      id="project-focus"
                      value={projectFocus}
                      onChange={(e) => setProjectFocus(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[var(--color-accent)]"
                    >
                      <option value="">Seleziona il tipo di progetto</option>
                      {projectFocusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="brief" className="mb-2 block text-sm font-medium text-zinc-700">
                    Due righe di contesto *
                  </label>
                  <textarea
                    id="brief"
                    rows={4}
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[var(--color-accent)]"
                    placeholder="Obiettivo, tempistiche o tipo di attivazione che hai in mente."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-8 py-4 font-medium text-white transition-colors hover:bg-[var(--color-ink)]/85 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Elaborazione...
                    </>
                  ) : (
                    <>
                      <Download size={20} /> Invia richiesta
                    </>
                  )}
                </button>

                {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                <p className="mt-4 text-center text-xs font-medium text-[var(--color-accent)]">
                  Valutiamo ogni richiesta entro 48 ore lavorative, con priorita ai messaggi gia contestualizzati.
                </p>

                <p className="text-center text-xs leading-relaxed text-zinc-400">
                  Inviando questa richiesta accetti di essere ricontattato in merito a possibili
                  collaborazioni e al trattamento dei dati secondo la nostra{' '}
                  <Link to="/privacy" className="underline underline-offset-2 hover:text-zinc-600">
                    privacy policy
                  </Link>
                  .
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-fit rounded-[2rem] border border-[var(--color-accent)]/15 bg-[var(--color-accent-soft)] p-8 text-center shadow-sm md:p-10"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                <CheckCircle size={32} />
              </div>
              <h2 className="mb-4 text-2xl font-serif text-[var(--color-ink)]">
                Richiesta ricevuta
              </h2>
              <p className="font-light leading-relaxed text-[var(--color-accent-text)]">
                Grazie per l&apos;interesse. Ti ricontatteremo via email con il materiale piu rilevante
                per capire se esistono le condizioni giuste per una collaborazione.
              </p>
            </motion.div>
          )}
        </div>
      </Section>

      <Section className="rounded-[3rem] bg-[var(--color-sand)] p-12 md:p-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-serif">{pageContent.fitTitle}</h2>
          <p className="mx-auto max-w-2xl font-normal leading-relaxed text-black/70">
            {pageContent.fitDescription}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {idealPartners.map((item) => (
            <div key={item} className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
              <p className="font-normal leading-relaxed text-black/70">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={pageContent.processTitle} subtitle={pageContent.processSubtitle}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {nextSteps.map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm"
            >
              <h3 className="mb-3 text-2xl font-serif">{item.title}</h3>
              <p className="font-normal leading-relaxed text-black/70">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="rounded-[3rem] bg-[var(--color-ink)] p-12 text-white md:p-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[var(--color-accent)]">
            <Mail size={24} />
          </div>
          <h2 className="mb-4 text-3xl font-serif md:text-4xl">{pageContent.directTitle}</h2>
          <p className="mb-8 font-normal leading-relaxed text-white/80">
            {pageContent.directDescription}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={CONTACTS.mailto}
              className="inline-block rounded-xl bg-[var(--color-ink)] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[var(--color-ink)]/85"
            >
              Scrivi a {CONTACTS.email}
            </a>
            <a
              href={CONTACTS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-white/40 hover:bg-white/10"
            >
              Apri WhatsApp
            </a>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
