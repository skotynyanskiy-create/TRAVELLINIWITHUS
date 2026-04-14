import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle,
  Clapperboard,
  Download,
  Globe,
  Loader2,
  Mail,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { BRAND_STATS, CONTACTS } from '../config/site';

const MEDIA_KIT_PREVIEW = [
  {
    step: '01',
    title: 'Profilo del progetto',
    description: 'Chi sono Rodrigo e Betta, come nasce Travelliniwithus e quale tono rende il progetto riconoscibile.',
    icon: BriefcaseBusiness,
  },
  {
    step: '02',
    title: 'Audience e segnali utili',
    description: 'Numeri, reach, contesto editoriale e lettura corretta del pubblico, senza cosmetica da brochure.',
    icon: BarChart3,
  },
  {
    step: '03',
    title: 'Format e contesto operativo',
    description: 'Come lavoriamo, che tipo di attivazioni hanno senso e quali collaborazioni non prendiamo in considerazione.',
    icon: Clapperboard,
  },
];

const QUALIFYING_POINTS = [
  'Hotel, hospitality e soggiorni con una forte identita.',
  'Destinazioni, territori e progetti travel con una storia da raccontare bene.',
  'Brand lifestyle e utility coerenti con il nostro modo di viaggiare e consigliare.',
];

const NEXT_STEPS = [
  {
    title: '1. Richiesta qualificata',
    text: 'Ci lasci brand, contesto e focus del progetto. Non ci interessa il giro largo: ci interessa capire subito il fit.',
  },
  {
    title: '2. Valutazione editoriale',
    text: 'Capiamo se il progetto e coerente con il pubblico, con il tono del brand e con il tipo di contenuto che sappiamo fare bene.',
  },
  {
    title: '3. Invio materiali e dialogo',
    text: 'Se c e allineamento, ricevi il media kit e apriamo il confronto operativo con basi piu serie e pulite.',
  },
];

const projectFocusOptions = [
  'Hotel / hospitality',
  'Destinazione / ente turismo',
  'Brand travel / lifestyle',
  'Experience / locale / evento',
  'UGC / contenuti per canali brand',
  'Altro',
];

export default function MediaKit() {
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
      setSubmitError('Inserisci azienda, email lavorativa, focus del progetto e un contesto breve ma utile.');
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
        `Non siamo riusciti a registrare la richiesta. Puoi scriverci direttamente a ${CONTACTS.email}.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <SEO
        title="Media Kit"
        description="Richiedi il media kit Travelliniwithus per capire audience, format, tono editoriale e condizioni giuste per una collaborazione coerente."
      />

      <Section className="pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mx-auto mt-8 max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-[var(--color-accent)]" />
              <span className="font-script text-xl text-[var(--color-accent-warm)]">Media kit</span>
              <div className="h-px w-12 bg-[var(--color-accent)]" />
            </div>
            <h1 className="mb-8 text-5xl font-serif md:text-7xl">
              Non un PDF qualsiasi.
              <br />
              <span className="italic text-black/60">Una porta di accesso qualificata.</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-black/70">
              Il media kit serve a capire se il progetto ha senso per entrambe le parti. Pubblico,
              posizionamento, format e modo di lavorare: tutto il necessario per parlare con basi piu serie.
            </p>
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent-soft)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] md:gap-6 md:px-8">
              <span>{BRAND_STATS.instagramFollowers} Instagram</span>
              <span className="h-4 w-px bg-[var(--color-accent)]/20" />
              <span>{BRAND_STATS.tiktokFollowers} TikTok</span>
              <span className="h-4 w-px bg-[var(--color-accent)]/20" />
              <span>{BRAND_STATS.monthlyReach} reach</span>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-10 rounded-[2rem] border border-black/5 bg-[var(--color-sand)] p-8 md:p-10">
              <h2 className="mb-4 text-3xl font-serif">Cosa troverai nel media kit</h2>
              <p className="leading-relaxed text-black/70">
                Non una presentazione gonfiata. Una sintesi ordinata di chi siamo, a chi parliamo, che cosa
                sappiamo fare bene e quando una collaborazione conviene davvero.
              </p>
            </div>

            <div className="space-y-4">
              {MEDIA_KIT_PREVIEW.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                      <item.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-black/40">
                        Pagina {item.step}
                      </p>
                      <h3 className="mb-3 text-2xl font-serif">{item.title}</h3>
                      <p className="leading-relaxed text-black/68">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck size={18} className="text-[var(--color-accent)]" />
                <h3 className="text-2xl font-serif">Quando conviene scriverci</h3>
              </div>
              <div className="space-y-4">
                {QUALIFYING_POINTS.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                    <p className="leading-relaxed text-black/68">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative h-fit overflow-hidden rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-xl md:p-10"
            >
              <div className="absolute left-0 top-0 h-2 w-full bg-[var(--color-accent)]" />
              <div className="mb-8">
                <h2 className="mb-2 text-2xl font-serif">Richiedi il media kit</h2>
                <p className="text-sm leading-relaxed text-zinc-500">
                  Ti chiediamo poche informazioni, ma utili. Servono a capire se il progetto e allineato e
                  a risponderti con materiale davvero rilevante.
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
                    placeholder="Es. boutique hotel, agenzia travel, destination office"
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
                  <label htmlFor="project-focus" className="mb-2 block text-sm font-medium text-zinc-700">
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
                    Contesto breve ma utile
                  </label>
                  <textarea
                    id="brief"
                    rows={5}
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[var(--color-accent)]"
                    placeholder="Obiettivo, periodo, tipo di attivazione o perche pensi che ci sia un fit reale."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-8 py-4 font-medium text-white transition-colors hover:bg-[var(--color-ink)]/85 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Invio in corso...
                    </>
                  ) : (
                    <>
                      <Download size={20} /> Richiedi il media kit
                    </>
                  )}
                </button>

                {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                <p className="text-center text-xs font-medium text-[var(--color-accent)]">
                  Se il contatto e coerente, ricevi il link al media kit e un riscontro entro 48 ore lavorative.
                </p>

                <p className="text-center text-xs leading-relaxed text-zinc-400">
                  Inviando la richiesta accetti di essere ricontattato in merito a possibili collaborazioni e
                  al trattamento dei dati secondo la nostra{' '}
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
              className="h-fit rounded-[2rem] border border-[var(--color-accent)]/15 bg-[var(--color-accent-soft)] p-8 shadow-sm md:p-10"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                <CheckCircle size={32} />
              </div>
              <h2 className="mb-4 text-center text-2xl font-serif text-[var(--color-ink)]">
                Richiesta ricevuta
              </h2>
              <p className="text-center leading-relaxed text-[var(--color-accent-text)]">
                Grazie. Se vediamo un allineamento reale, ti inviamo il media kit e ti rispondiamo con i
                prossimi passi piu utili.
              </p>
              <div className="mt-8 space-y-4 rounded-[1.5rem] border border-[var(--color-accent)]/10 bg-white/70 p-6">
                <div className="flex gap-3">
                  <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  <p className="text-sm leading-relaxed text-black/70">
                    Ti scriviamo entro 48 ore lavorative se il progetto e in linea.
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  <p className="text-sm leading-relaxed text-black/70">
                    Il media kit arriva via email insieme al contesto giusto per continuare la conversazione.
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  <p className="text-sm leading-relaxed text-black/70">
                    Se vuoi accelerare, puoi anche scriverci direttamente con un brief piu dettagliato.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/contatti"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-6 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-ink)]/85"
                >
                  Vai ai contatti <ArrowRight size={14} />
                </Link>
                <a
                  href={CONTACTS.mailto}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-black/10 px-6 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  Scrivi a {CONTACTS.email}
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </Section>

      <Section className="rounded-[3rem] bg-[var(--color-sand)] p-12 md:p-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-serif">Come funziona dopo il primo contatto</h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-black/70">
            Questo passaggio serve a filtrare meglio, non a complicare. Preferiamo meno richieste ma piu
            coerenti, con una conversazione pulita fin dall inizio.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {NEXT_STEPS.map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
              <h3 className="mb-3 text-2xl font-serif">{item.title}</h3>
              <p className="leading-relaxed text-black/70">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="rounded-[3rem] bg-[var(--color-ink)] p-12 text-white md:p-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[var(--color-accent)]">
            <Mail size={24} />
          </div>
          <h2 className="mb-4 text-3xl font-serif md:text-4xl">Vuoi partire da un contatto diretto?</h2>
          <p className="mb-8 leading-relaxed text-white/80">
            Se hai gia un brief chiaro o una proposta ben impostata, puoi scriverci direttamente. Il criterio
            resta lo stesso: allineamento, chiarezza e poi approfondimento.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={CONTACTS.mailto}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--color-gold)] px-8 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
            >
              Scrivi a {CONTACTS.email}
            </a>
            <a
              href={CONTACTS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-white/40 hover:bg-white/10"
            >
              Apri WhatsApp
            </a>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
