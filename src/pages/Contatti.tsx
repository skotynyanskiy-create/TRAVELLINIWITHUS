import { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Instagram, MessageCircle, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import PageLayout from '../components/PageLayout';
import Section from '../components/Section';
import SEO from '../components/SEO';
import { CONTACTS, SOCIAL_COLORS } from '../config/site';
import { siteContentDefaults } from '../config/siteContent';
import { useSiteContent } from '../hooks/useSiteContent';

export default function Contatti() {
  const { data: content } = useSiteContent('contact');
  const pageContent = content ?? siteContentDefaults.contact;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const topicGuidance: Record<string, { hint: string; placeholder: string }> = {
    collab: {
      hint: 'Indica brand o struttura, obiettivo, periodo indicativo e canali coinvolti.',
      placeholder:
        "Raccontaci il brand, l'obiettivo del progetto, le date indicative e il tipo di attivazione che hai in mente...",
    },
    press: {
      hint: 'Specifica destinazione, periodo, format del press trip e aspettative sulla copertura.',
      placeholder:
        'Condividi destinazione, date, format del trip e il tipo di copertura che vorresti valutare...',
    },
    content: {
      hint: 'Spiega se cerchi reel, foto, UGC o un pacchetto più ampio e dove andrà usato.',
      placeholder:
        "Descrivi i contenuti di cui hai bisogno, i canali previsti e l'obiettivo principale...",
    },
    article: {
      hint: 'Dicci a quale guida, destinazione o risorsa ti riferisci così possiamo aiutarti più velocemente.',
      placeholder:
        'Scrivici a quale articolo, guida o risorsa ti riferisci e cosa ti serve sapere...',
    },
    other: {
      hint: 'Se il contatto non rientra in un caso preciso, contestualizzalo il più possibile.',
      placeholder: 'Raccontaci il contesto della richiesta nel modo più chiaro possibile...',
    },
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email è obbligatoria";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Inserisci un indirizzo email valido';
    }

    if (!formData.topic) {
      newErrors.topic = 'Seleziona un motivo di contatto';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Il messaggio è obbligatorio';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          topic: formData.topic,
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Invio non riuscito');
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error saving contact lead:', error);
      setSubmitError(
        `Non siamo riusciti a inviare il messaggio. Puoi scriverci direttamente a ${CONTACTS.email}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const breadcrumbItems = [{ label: 'Contatti' }];

  const activeGuidance = topicGuidance[formData.topic] || {
    hint: 'Seleziona il motivo del contatto e poi raccontaci il progetto nel modo più chiaro possibile.',
    placeholder: 'Raccontaci i dettagli del tuo progetto...',
  };

  return (
    <PageLayout>
      <SEO
        title="Contatti"
        description="Scrivici per collaborazioni, proposte, media kit o richieste legate a Travelliniwithus. Qui trovi il canale giusto per contattarci."
      />

      <Section className="pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mx-auto mt-8 mb-20 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 bg-[var(--color-accent)]"></div>
              <span className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                {pageContent.heroEyebrow}
              </span>
              <div className="h-[1px] w-12 bg-[var(--color-accent)]"></div>
            </div>
            <div className="relative mb-8 inline-block">
              <h1 className="text-display-1">
                {pageContent.heroTitleMain} <br />
                <span className="italic text-black/60">{pageContent.heroTitleAccent}</span>
              </h1>
              <motion.span
                initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                animate={{ opacity: 1, rotate: -5, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                aria-hidden="true"
                className="absolute -right-12 -bottom-6 hidden font-script text-2xl text-[var(--color-accent)] opacity-80 sm:block md:text-3xl"
              >
                scrivici!
              </motion.span>
            </div>
            <p className="mt-8 text-lg font-light leading-relaxed text-black/70">
              {pageContent.heroDescription}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-2">
            <h3 className="mb-6 text-2xl font-serif">I nostri recapiti</h3>

            <div className="group flex items-start gap-4 rounded-[var(--radius-xl)] border border-black/5 bg-[var(--color-sand)] p-6 transition-all duration-500 hover:shadow-[var(--shadow-premium)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-xl)] bg-white text-[var(--color-accent)] shadow-sm transition-transform duration-500 group-hover:scale-110">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="mb-1 font-serif text-xl">{pageContent.emailCardTitle}</h4>
                <p className="mb-2 text-sm font-normal text-black/70">
                  {pageContent.emailCardDescription}
                </p>
                <a
                  href={CONTACTS.mailto}
                  className="block text-sm font-medium transition-colors group-hover:text-[var(--color-accent)]"
                >
                  {CONTACTS.email}
                </a>
                <Link
                  to="/collaborazioni"
                  className="mt-4 block text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] transition-colors hover:text-black"
                >
                  {pageContent.emailCardLinkLabel}
                </Link>
              </div>
            </div>

            <a
              href={CONTACTS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-[var(--radius-xl)] border border-black/5 bg-[var(--color-sand)] p-6 transition-all duration-500 hover:shadow-[var(--shadow-premium)]"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-xl)] bg-white shadow-sm transition-transform duration-500 group-hover:scale-110`}
                style={{ color: SOCIAL_COLORS.whatsapp }}
              >
                <MessageCircle size={20} />
              </div>
              <div>
                <h4 className="mb-1 font-serif text-xl">{pageContent.whatsappCardTitle}</h4>
                <p className="mb-2 text-sm font-normal text-black/70">
                  {pageContent.whatsappCardDescription}
                </p>
                <span className="text-sm font-medium transition-colors group-hover:text-[#25D366]">
                  {CONTACTS.whatsappDisplay}
                </span>
              </div>
            </a>

            <div className="grid grid-cols-2 gap-4">
              <a
                href={CONTACTS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center gap-3 rounded-[var(--radius-xl)] border border-black/5 bg-[var(--color-sand)] p-6 transition-all duration-500 hover:shadow-[var(--shadow-premium)]"
              >
                <Instagram
                  size={28}
                  className="text-black/60 transition-colors duration-500 group-hover:scale-110 group-hover:text-[#E1306C]"
                />
                <span className="text-xs font-bold uppercase tracking-widest">Instagram</span>
              </a>
              <a
                href={CONTACTS.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center gap-3 rounded-[var(--radius-xl)] border border-black/5 bg-[var(--color-sand)] p-6 transition-all duration-500 hover:shadow-[var(--shadow-premium)]"
              >
                <svg
                  className="h-7 w-7 text-black/60 transition-colors duration-500 group-hover:scale-110 group-hover:text-black"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest">TikTok</span>
              </a>
            </div>

            <div className="rounded-[var(--radius-xl)] border border-black/5 bg-white p-6 shadow-sm">
              <h4 className="mb-3 text-xl font-serif">{pageContent.helperTitle}</h4>
              <ul className="space-y-3 text-sm font-normal leading-relaxed text-black/70">
                {pageContent.helperItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-black/5 bg-white p-8 shadow-[var(--shadow-premium)] md:p-12 lg:col-span-3">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="mb-8 text-3xl font-serif">{pageContent.formTitle}</h3>
                  <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-[10px] font-bold uppercase tracking-widest text-black/50"
                        >
                          Nome / Azienda *
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full border-b bg-transparent py-3 transition-colors focus:outline-none ${
                            errors.name
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-black/10 focus:border-[var(--color-accent)]'
                          }`}
                          placeholder="Il tuo nome"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-[10px] font-bold uppercase tracking-widest text-black/50"
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full border-b bg-transparent py-3 transition-colors focus:outline-none ${
                            errors.email
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-black/10 focus:border-[var(--color-accent)]'
                          }`}
                          placeholder="tua@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="topic"
                        className="text-[10px] font-bold uppercase tracking-widest text-black/50"
                      >
                        Motivo del contatto *
                      </label>
                      <select
                        id="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        className={`w-full appearance-none rounded-none border-b bg-transparent py-3 text-black transition-colors focus:outline-none ${
                          errors.topic
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-black/10 focus:border-[var(--color-accent)]'
                        }`}
                      >
                        <option value="" disabled>
                          Seleziona un&apos;opzione
                        </option>
                        <option value="collab">
                          Proposta di collaborazione / sponsorizzazione
                        </option>
                        <option value="press">Press trip / fam trip</option>
                        <option value="content">Richiesta creazione contenuti</option>
                        <option value="article">Domanda su guide, articoli o risorse</option>
                        <option value="other">Altro / informazioni generali</option>
                      </select>
                      {errors.topic && <p className="mt-1 text-xs text-red-500">{errors.topic}</p>}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-[10px] font-bold uppercase tracking-widest text-black/50"
                      >
                        Messaggio *
                      </label>
                      <p className="text-xs font-light leading-relaxed text-black/45">
                        {activeGuidance.hint}
                      </p>
                      <textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full resize-none border-b bg-transparent py-3 transition-colors focus:outline-none ${
                          errors.message
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-black/10 focus:border-[var(--color-accent)]'
                        }`}
                        placeholder={activeGuidance.placeholder}
                      ></textarea>
                      {errors.message && (
                        <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                      )}
                    </div>

                    <div className="pt-6">
                      <p className="mb-8 text-xs font-light leading-relaxed text-black/40">
                        Inviando questo modulo accetti la nostra{' '}
                        <Link
                          to="/privacy"
                          className="underline underline-offset-2 transition-colors hover:text-black"
                        >
                          Privacy Policy
                        </Link>{' '}
                        per il trattamento dei dati personali. Rispondiamo di solito entro 24-48 ore
                        lavorative, quando il contatto è chiaro e completo.
                      </p>
                      {submitError && <p className="mb-6 text-sm text-red-600">{submitError}</p>}
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full px-12 md:w-auto"
                      >
                        {isSubmitting ? (
                          <>
                            Invio in corso
                            <Loader2 size={18} className="animate-spin" />
                          </>
                        ) : (
                          <>
                            Invia richiesta
                            <ArrowRight size={18} />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-sand)] text-[var(--color-accent)] shadow-inner">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="mb-4 text-4xl font-serif">Messaggio inviato</h3>
                  <p className="mx-auto mb-10 max-w-md text-lg font-normal leading-relaxed text-black/70">
                    Grazie per averci contattato. Abbiamo ricevuto il tuo messaggio e ti
                    risponderemo appena possibile, in genere entro 24-48 ore lavorative.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', topic: '', message: '' });
                    }}
                    className="border-b border-[var(--color-accent)] pb-1 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] transition-colors hover:border-black hover:text-black"
                  >
                    Invia un altro messaggio
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
