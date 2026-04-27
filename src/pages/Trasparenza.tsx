import { ArrowRight, AlertCircle, BadgeCheck, Coins, FileWarning, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { CONTACTS, SITE_URL } from '../config/site';

const PAGE_URL = `${SITE_URL}/trasparenza`;

const DISCLOSURES = [
  {
    icon: BadgeCheck,
    eyebrow: 'Tipo di contenuto',
    title: 'Viaggio personale',
    text: 'L articolo racconta un esperienza diretta che abbiamo pagato di tasca nostra. Non c e nessun rapporto commerciale con strutture o brand citati.',
    color: 'text-accent',
  },
  {
    icon: Coins,
    eyebrow: 'Tipo di contenuto',
    title: 'Affiliate',
    text: 'L articolo include link affiliati: se prenoti tramite questi link, riceviamo una piccola commissione senza costi aggiuntivi per te. Non influenzano la nostra opinione: consigliamo solo cio che useremmo davvero.',
    color: 'text-ink',
  },
  {
    icon: AlertCircle,
    eyebrow: 'Tipo di contenuto',
    title: 'Soggiorno ospitato (gifted)',
    text: 'L hotel o l esperienza ci sono stati offerti gratuitamente per finalita di documentazione. Mantieniamo la liberta editoriale: se non funziona, lo diciamo. Lo dichiariamo sempre nell articolo.',
    color: 'text-accent-text',
  },
  {
    icon: FileWarning,
    eyebrow: 'Tipo di contenuto',
    title: 'Sponsorizzato',
    text: 'L articolo e stato pagato da un brand o ente turistico. Manteniamo i nostri criteri editoriali: niente esagerazioni, niente nascondere problemi. Lo dichiariamo in modo evidente.',
    color: 'text-black/55',
  },
];

const COMMITMENTS = [
  'Distinguiamo sempre, con badge espliciti, il tipo di disclosure di ogni articolo (viaggio personale / affiliate / gifted / sponsored).',
  'Non accettiamo soggiorni o sponsorizzazioni in cambio di recensioni "garantite positive". Se non ci convince, non lo raccontiamo.',
  'I link affiliati seguono lo standard nofollow + sponsored quando appropriato. Mai mascherati come link normali.',
  'Quando un brand ci paga per pubblicare contenuto, lo dichiariamo nel titolo e nell anteprima. Niente sponsorship nascoste.',
  'Le recensioni di hotel, ristoranti e luoghi sono basate su esperienza diretta. Niente review "da remoto" basate solo su materiali stampa.',
  'I prezzi citati sono indicativi e legati alla data di visita. Quando obsoleti, aggiorniamo o segnaliamo.',
];

export default function TrasparenzaPage() {
  return (
    <PageLayout>
      <SEO
        title="Trasparenza editoriale — Travelliniwithus"
        description="Come distinguiamo viaggio personale, affiliate, contenuti ospitati e sponsorship. La nostra disclosure policy completa, in chiaro."
        canonical={PAGE_URL}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Trasparenza', url: PAGE_URL },
        ]}
      />

      <section className="bg-sand pb-16 pt-28 md:pb-20 md:pt-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-12">
          <Breadcrumbs items={[{ label: 'Trasparenza' }]} />

          <div className="mt-8 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Disclosure policy
            </p>
            <h1 className="mt-4 text-4xl font-serif leading-[1.05] text-ink md:text-6xl">
              Trasparenza completa, <span className="italic text-black/55">in chiaro</span>.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-black/70 md:text-lg">
              Non vendiamo l illusione della "neutralita assoluta": il viaggio editoriale ha
              dinamiche economiche reali. Quello che possiamo garantire e' che ogni articolo
              dichiari in modo esplicito a quale tipo appartiene, e che la nostra opinione resti
              indipendente.
            </p>
          </div>
        </div>
      </section>

      <Section spacing="default" maxWidth="wide">
        <div className="mb-10 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
            Le 4 categorie di disclosure
          </span>
          <h2 className="mt-3 text-3xl font-serif text-ink md:text-4xl">
            Cosa significa ogni badge sui nostri articoli
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {DISCLOSURES.map((d) => (
            <div
              key={d.title}
              className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm md:p-10"
            >
              <div
                className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-sand ${d.color}`}
              >
                <d.icon size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent-text">
                {d.eyebrow}
              </span>
              <h3 className="mt-3 text-2xl font-serif leading-tight text-ink">{d.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-black/65">{d.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="default" maxWidth="default" className="bg-sand py-16 md:py-20">
        <div className="mb-8 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
            I nostri impegni espliciti
          </span>
          <h2 className="mt-3 text-3xl font-serif text-ink md:text-4xl">
            Cosa garantiamo a chi ci legge
          </h2>
        </div>
        <ul className="space-y-4">
          {COMMITMENTS.map((c) => (
            <li
              key={c}
              className="flex items-start gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
            >
              <BadgeCheck size={18} className="mt-0.5 shrink-0 text-accent" />
              <span className="text-sm leading-relaxed text-black/70">{c}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section spacing="default" maxWidth="default">
        <div className="rounded-4xl border border-black/5 bg-ink p-10 text-white md:p-14">
          <h2 className="text-3xl font-serif leading-tight md:text-4xl">
            Domande sulla trasparenza? <span className="italic text-white/60">Scrivici.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75">
            Se trovi un articolo che non rispetta questi standard, segnalacelo. Se sei un brand o un
            ente turistico interessato a una collaborazione, leggi prima la pagina collabora per
            capire cosa accettiamo e cosa no.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={CONTACTS.mailto}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
            >
              <Mail size={14} />
              {CONTACTS.email}
            </a>
            <Link
              to="/collaborazioni"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 text-xs font-bold uppercase tracking-widest text-white/90 transition-colors hover:border-white hover:text-white"
            >
              Pagina Collabora
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
