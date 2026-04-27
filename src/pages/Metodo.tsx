import { ArrowRight, BookOpen, Camera, Compass, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { SITE_URL } from '../config/site';

const PAGE_URL = `${SITE_URL}/metodo`;

const PRINCIPLES = [
  {
    icon: Filter,
    eyebrow: 'Come selezioniamo',
    title: 'Filtro duro, niente catalogo',
    text: 'Non consigliamo un posto solo perche e di tendenza. Entra sul sito quando ha valore concreto: atmosfera, contesto, utilita reale per chi viaggia con criterio. Per ogni nuovo articolo, decidiamo prima se vale davvero la pena raccontarlo.',
  },
  {
    icon: Camera,
    eyebrow: 'Come proviamo',
    title: 'Viaggio diretto, mai recensione da desk',
    text: 'Dormiamo, mangiamo, camminiamo. Se un hotel non ci convince dopo una notte, non entra. Se un ristorante non regge alla prima visita, non lo raccontiamo come se reggesse. Niente review da brochure: solo cosa abbiamo visto con i nostri occhi.',
  },
  {
    icon: BookOpen,
    eyebrow: 'Come raccontiamo',
    title: 'Lentezza, criterio, dettaglio',
    text: 'Le nostre guide sono pensate per aiutarti a decidere meglio: quando andare, cosa evitare, dove dormire, quali errori puoi saltare. Niente listoni "10 cose imperdibili": preferiamo 3 indirizzi che funzionano davvero a 30 generici.',
  },
  {
    icon: Compass,
    eyebrow: 'Come monetizziamo',
    title: 'Affiliate chiari, niente pubblicita invasiva',
    text: 'Usiamo link affiliati solo quando hanno senso nel viaggio. Nessun banner rumoroso, nessun contenuto spinto solo per convertire. Quando un servizio e affiliato, lo dichiariamo. Quando un soggiorno e ospitato, lo dichiariamo. Quando un articolo e sponsorizzato, lo dichiariamo.',
  },
];

const ANTI_PATTERNS = [
  {
    title: 'Listoni inflazionati',
    text: 'Niente "20 cose da non perdere a Roma" che includono tutto cio che esiste. Preferiamo poco e selezionato.',
  },
  {
    title: 'Foto inventate',
    text: 'Non usiamo immagini stock per illustrare posti che non abbiamo visitato, e quando usiamo Unsplash come fallback lo dichiariamo.',
  },
  {
    title: 'Ranking finti',
    text: 'Niente "i 5 migliori ristoranti di Lisbona": non li abbiamo mangiati tutti, e nessuno li ha. Diciamo solo cosa abbiamo provato.',
  },
  {
    title: 'Sponsorship nascoste',
    text: 'Se un brand paga per essere menzionato, lo dichiariamo nell articolo. Punto. Niente smartness ambigua.',
  },
];

const STAGES = [
  {
    n: '01',
    title: 'Ricognizione',
    text: 'Prima di partire studiamo il contesto: stagione, accessi, cose da vedere/saltare, prezzo medio, prenotazioni necessarie. Se il quadro non regge, cambiamo destinazione.',
  },
  {
    n: '02',
    title: 'Esperienza diretta',
    text: 'Sul posto verifichiamo. Hotel, ristoranti, percorsi: testati. Se qualcosa non va come ci si aspettava, lo segnaliamo con onesta.',
  },
  {
    n: '03',
    title: 'Riflessione',
    text: 'Tra il rientro e la pubblicazione passa tempo. Decantazione: scegliamo cosa raccontare e con quale taglio, eliminando la fretta del "subito online".',
  },
  {
    n: '04',
    title: 'Pubblicazione',
    text: 'L articolo esce con tutte le info verificate, i prezzi indicativi e le date di visita. Le guide vengono aggiornate quando le condizioni cambiano.',
  },
];

export default function MetodoPage() {
  return (
    <PageLayout>
      <SEO
        title="Il nostro metodo editoriale — Travelliniwithus"
        description="Come selezioniamo, proviamo e raccontiamo i posti. I principi editoriali, i pattern che evitiamo, il processo dietro ogni guida."
        canonical={PAGE_URL}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Metodo', url: PAGE_URL },
        ]}
      />

      <section className="bg-sand pb-16 pt-28 md:pb-20 md:pt-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-12">
          <Breadcrumbs items={[{ label: 'Metodo' }]} />

          <div className="mt-8 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Il nostro metodo
            </p>
            <h1 className="mt-4 text-4xl font-serif leading-[1.05] text-ink md:text-6xl">
              Come scegliamo, <span className="italic text-black/55">proviamo, raccontiamo</span>.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-black/70 md:text-lg">
              Travelliniwithus non e un aggregatore di liste. E un progetto editoriale con un metodo
              dichiarato. Qui sotto trovi i principi che applichiamo, i pattern che evitiamo e il
              processo concreto dietro ogni articolo.
            </p>
          </div>
        </div>
      </section>

      <Section spacing="default" maxWidth="wide">
        <div className="grid gap-6 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm md:p-10"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <p.icon size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent-text">
                {p.eyebrow}
              </span>
              <h2 className="mt-3 text-2xl font-serif leading-tight text-ink md:text-3xl">
                {p.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-black/65">{p.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="default" maxWidth="wide" className="bg-sand py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
            Il processo
          </span>
          <h2 className="mt-3 text-3xl font-serif text-ink md:text-4xl">
            4 stadi prima che un articolo finisca online
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((s) => (
            <div key={s.n} className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm">
              <span className="font-serif text-3xl text-accent">{s.n}</span>
              <h3 className="mt-3 text-xl font-serif leading-tight text-ink">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-black/65">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="default" maxWidth="wide">
        <div className="mb-10 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
            Cosa non facciamo
          </span>
          <h2 className="mt-3 text-3xl font-serif text-ink md:text-4xl">
            I pattern che abbiamo scelto di evitare
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {ANTI_PATTERNS.map((ap) => (
            <div key={ap.title} className="rounded-2xl border border-black/5 bg-sand p-6">
              <h3 className="text-lg font-serif leading-tight text-ink">{ap.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/65">{ap.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="default" maxWidth="default">
        <div className="rounded-4xl border border-black/5 bg-ink p-10 text-white md:p-14">
          <h2 className="text-3xl font-serif leading-tight md:text-4xl">
            Trasparenza completa{' '}
            <span className="italic text-white/60">sul lato monetizzazione</span>.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75">
            Vuoi sapere come distinguiamo affiliate, contenuti ospitati e sponsorship? Tutto nella
            nostra pagina trasparenza, dichiarata in modo esplicito.
          </p>
          <Link
            to="/trasparenza"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
          >
            Apri la pagina trasparenza
            <ArrowRight size={14} />
          </Link>
        </div>
      </Section>
    </PageLayout>
  );
}
