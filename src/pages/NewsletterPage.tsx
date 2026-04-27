import { ArrowRight, Calendar, Mail, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import Newsletter from '../components/Newsletter';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { SITE_URL } from '../config/site';
import { NEWSLETTER_ARCHIVE } from '../config/newsletterArchive';

const PAGE_URL = `${SITE_URL}/newsletter`;

const VALUE_PROPS = [
  {
    title: 'Una email ogni tanto',
    text: "Non scriviamo per riempire. Quando arriva una newsletter, c'e qualcosa di concreto da salvare: una guida nuova, un itinerario testato, un posto che vale.",
  },
  {
    title: 'Niente template generici',
    text: 'Scriviamo a mano ogni numero, con la stessa voce del sito. Niente "10 destinazioni che ti faranno innamorare". Solo cose che useremmo davvero.',
  },
  {
    title: 'Disiscrizione facile',
    text: 'Un click, niente domande, niente "siamo dispiaciuti". Se non ti serve piu, cancellati e basta.',
  },
];

export default function NewsletterPageView() {
  return (
    <PageLayout>
      <SEO
        title="Newsletter — solo quando c'e qualcosa da salvare"
        description="La newsletter editoriale di Travelliniwithus: guide, itinerari testati, posti particolari. Nessun rumore, nessuna pressione."
        canonical={PAGE_URL}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Newsletter', url: PAGE_URL },
        ]}
      />

      <section className="bg-sand pb-16 pt-28 md:pb-20 md:pt-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-12">
          <Breadcrumbs items={[{ label: 'Newsletter' }]} />

          <div className="mt-8 grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-start md:gap-16">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
                Newsletter Travelliniwithus
              </p>
              <h1 className="mt-4 text-4xl font-serif leading-[1.05] text-ink md:text-6xl">
                Una email ogni tanto.{' '}
                <span className="italic text-black/55">
                  Solo quando c'e davvero qualcosa da salvare.
                </span>
              </h1>
              <p className="mt-6 text-base leading-relaxed text-black/70 md:text-lg">
                Niente rumore, niente pressione, niente newsletter riempita per forza. Quando
                pubblichiamo una guida che vale, un itinerario testato o un posto che ci ha
                sorpreso, ti scriviamo. Altrimenti restiamo in silenzio.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  'Posti particolari verificati di persona',
                  'Itinerari completi con tempi, tappe, costi reali',
                  'Hotel scelti, non sponsorizzati a caso',
                  'Quando serve evitare un periodo o un luogo',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-black/70">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-4xl border border-black/5 bg-white p-8 shadow-sm md:p-10">
              <Newsletter variant="white" source="newsletter_page_hero" />
            </div>
          </div>
        </div>
      </section>

      <Section spacing="default" maxWidth="wide">
        <div className="grid gap-6 md:grid-cols-3">
          {VALUE_PROPS.map((vp) => (
            <div key={vp.title} className="rounded-3xl border border-black/5 bg-sand p-8 shadow-sm">
              <h3 className="text-xl font-serif leading-tight text-ink">{vp.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-black/65">{vp.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="default" maxWidth="wide" className="bg-sand py-16 md:py-20">
        <div className="mb-10 flex items-center gap-3">
          <Calendar size={20} className="text-accent" />
          <h2 className="text-3xl font-serif text-ink md:text-4xl">Numeri precedenti</h2>
        </div>

        {NEWSLETTER_ARCHIVE.length === 0 ? (
          <div className="rounded-4xl border border-black/5 bg-white p-10 text-center md:p-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-text">
              Numero #1 in arrivo
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-black/70">
              Stiamo preparando il primo numero. Iscrivendoti adesso lo riceverai per primo, e da li
              in avanti l archivio cronologico apparira' qui.
            </p>
          </div>
        ) : (
          <ol className="space-y-4">
            {NEWSLETTER_ARCHIVE.map((issue) => (
              <li
                key={issue.number}
                className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm md:p-8"
              >
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em]">
                  <span className="text-accent-text">
                    #{issue.number.toString().padStart(2, '0')}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-black/15" />
                  <span className="text-black/45">{issue.date}</span>
                </div>
                <h3 className="mt-3 text-2xl font-serif leading-tight text-ink">{issue.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/65">
                  {issue.summary}
                </p>
                {issue.topics.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {issue.topics.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-black/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-black/55"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {issue.webViewUrl && (
                  <a
                    href={issue.webViewUrl}
                    className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-accent-text hover:text-accent"
                  >
                    Leggi online <ArrowRight size={12} />
                  </a>
                )}
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section spacing="default" maxWidth="default">
        <div className="rounded-4xl border border-black/5 bg-ink p-10 text-white md:p-14">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                Resta in contatto
              </p>
              <h2 className="mt-3 max-w-xl text-2xl font-serif leading-tight md:text-3xl">
                Iscriviti ora, ricevi il primo numero quando esce.
              </h2>
            </div>
            <div className="w-full max-w-md">
              <Newsletter variant="article" source="newsletter_page_footer" />
            </div>
          </div>
          <div className="mt-10 flex items-center gap-3 text-xs text-white/60">
            <Mail size={14} />
            <span>Privacy first. Niente spam, niente passaggi a terzi.</span>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
