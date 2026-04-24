import { motion } from 'motion/react';
import { ArrowRight, UtensilsCrossed, Wine, Coffee, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import JsonLd from '../components/JsonLd';
import Newsletter from '../components/Newsletter';
import OptimizedImage from '../components/OptimizedImage';
import { slugifyGuideCategory } from '../config/contentTaxonomy';
import { SITE_URL } from '../config/site';

interface FoodDish {
  name: string;
  region: string;
  description: string;
  tip: string;
  image: string;
}

interface FoodRegion {
  title: string;
  eyebrow: string;
  description: string;
  dishes: FoodDish[];
  exploreLink: string;
  exploreLabel: string;
}

const FOOD_REGIONS: FoodRegion[] = [
  {
    eyebrow: 'Italia del sud',
    title: 'Mediterraneo, verdure e pani che profumano',
    description:
      'La cucina che profuma di pomodoro maturo, pane scuro e olio vero. Qui è dove ti siedi dopo un viaggio lungo e capisci che la cosa più giusta da fare è ordinare tre antipasti e un primo, e basta.',
    exploreLink: '/destinazioni?group=Italia',
    exploreLabel: 'Scopri Sicilia, Puglia e Campania',
    dishes: [
      {
        name: 'Orecchiette alle cime di rapa',
        region: 'Puglia',
        description:
          'Pasta fresca tirata a mano, cime di rapa saltate, acciuga soffritta, aglio e peperoncino. Zero panna, mai.',
        tip: 'Trattoria di paese, lontana dal lungomare dei turisti. Prezzo sotto i 12 euro = buon segno.',
        image:
          'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1400&auto=format&fit=crop',
      },
      {
        name: 'Cannolo siciliano fresco',
        region: 'Sicilia orientale',
        description:
          'Ricotta di pecora riempita al momento, cialda croccante, pistacchio di Bronte. Non quelli esposti in vetrina da ore.',
        tip: 'Cercane la versione "espressa": te lo preparano mentre aspetti.',
        image:
          'https://images.unsplash.com/photo-1571197119282-7c4e2c2d3c6a?q=80&w=1400&auto=format&fit=crop',
      },
      {
        name: 'Pane e pomodoro',
        region: 'Costiera Amalfitana',
        description:
          'Pane casareccio tostato, pomodoro San Marzano maturo, olio del territorio, un pizzico di origano secco. Il piatto che trovi ovunque e non saprai mai spiegare perché qui sa così diverso.',
        tip: 'A metà pomeriggio in un bar del porto, con un bicchiere di falanghina fredda.',
        image:
          'https://images.unsplash.com/photo-1481931715705-36f5f6ee6b5c?q=80&w=1400&auto=format&fit=crop',
      },
    ],
  },
  {
    eyebrow: 'Italia del nord e centro',
    title: 'Burro, pasta ripiena, rifugi e vino rosso',
    description:
      'Un altro ritmo, un altro grasso. Qui la cucina è materia concreta, cotta piano. Pasta ripiena, carne cotta lenta, vino strutturato, formaggi che puzzano bene.',
    exploreLink: '/destinazioni?group=Italia',
    exploreLabel: 'Scopri Dolomiti, Emilia e Toscana',
    dishes: [
      {
        name: 'Culurgiones',
        region: 'Sardegna interna',
        description:
          'Ravioli di patate, menta e pecorino cuciti a mano con la caratteristica chiusura a spiga. Una delle paste regionali italiane più belle da vedere e da mangiare.',
        tip: 'Agriturismo in Ogliastra o nel Nuorese. Mai sulla costa, mai nei ristoranti turistici.',
        image:
          'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1400&auto=format&fit=crop',
      },
      {
        name: 'Speck e canederli al rifugio',
        region: 'Dolomiti',
        description:
          'Speck altoatesino affumicato, canederli di pane con spinaci e ricotta in burro fuso e salvia. A 2000 metri di altezza dopo una camminata, cambia significato.',
        tip: 'Rifugio di proprietà familiare. Guarda se cucinano a legna.',
        image:
          'https://images.unsplash.com/photo-1568625365131-079e026a927d?q=80&w=1400&auto=format&fit=crop',
      },
      {
        name: 'Bistecca alla fiorentina',
        region: 'Toscana',
        description:
          'Chianina o Maremmana, taglio alto almeno 4 dita, rosmarino e olio buono. Al sangue o niente. Per due persone minimo.',
        tip: 'Macelleria con cottura o ristorante di paese. Prezzo al chilo visibile = trasparenza.',
        image:
          'https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=1400&auto=format&fit=crop',
      },
    ],
  },
  {
    eyebrow: 'Mediterraneo mixato',
    title: 'Grecia, Portogallo e Balcani: tavole piccole e condivise',
    description:
      "Fuori dall'Italia la tavola mediterranea cambia forma. Meze, petiscos, mezedes: piccole porzioni da condividere, tempo lungo, bicchieri riempiti spesso. Il pasto è un rituale, non una tappa.",
    exploreLink: '/destinazioni?group=Europa',
    exploreLabel: 'Scopri Grecia, Portogallo e altro',
    dishes: [
      {
        name: 'Gyros al maiale',
        region: 'Grecia intera',
        description:
          'Pita morbida, maiale speziato dal girarrosto, pomodoro, cipolla, tzatziki, patatine dentro. La versione vera, non quella da turisti al pollo.',
        tip: 'Souvlaki di quartiere, non sul lungomare. Una porzione piena sui 3-5 euro.',
        image:
          'https://images.unsplash.com/photo-1544510808-91bcbee1df55?q=80&w=1400&auto=format&fit=crop',
      },
      {
        name: 'Bacalhau à brás',
        region: 'Lisbona',
        description:
          'Baccalà sfilacciato con patate julienne, cipolla, uova strapazzate, olive nere. Uno dei 365 modi in cui i portoghesi cucinano il baccalà.',
        tip: 'Tasca di Alfama o Bairro Alto. Cerca quelle con i clienti portoghesi a pranzo.',
        image:
          'https://images.unsplash.com/photo-1562967916-eb82221dfb22?q=80&w=1400&auto=format&fit=crop',
      },
      {
        name: 'Octopus grigliato',
        region: 'Dodecanneso',
        description:
          'Asciugato al sole, grigliato sulla brace, servito con olio, limone e origano. Cottura morbida, pelle croccante. Vino bianco fresco di isola.',
        tip: 'Taverna con polpi appesi fuori ad asciugare. Segno di autenticità.',
        image:
          'https://images.unsplash.com/photo-1590914661533-71c0f8bbb9ba?q=80&w=1400&auto=format&fit=crop',
      },
    ],
  },
];

const SELECTION_PRINCIPLES = [
  {
    icon: UtensilsCrossed,
    title: 'Menu in una lingua',
    text: 'Se il menu è tradotto in quattro lingue, quasi sempre cucinano per volumi, non per qualità. Cerca i posti con carta in dialetto o in lingua locale.',
  },
  {
    icon: Wine,
    title: 'Vino del territorio',
    text: 'Una buona trattoria ha vino locale sfuso o bottiglie di piccoli produttori della zona. Se propongono solo bottiglie famose internazionali, è un indicatore.',
  },
  {
    icon: Coffee,
    title: 'Colazione vera',
    text: 'I bar di quartiere dove gli anziani prendono il caffè la mattina servono sempre meglio del brunch-hotel. Costano un terzo.',
  },
  {
    icon: Flame,
    title: 'Cottura visibile',
    text: 'Forno a legna, brace a vista, cuoco che esce dalla cucina: sono segnali di trattoria vera. Cucine completamente chiuse = spesso catene.',
  },
];

const FOOD_GUIDE_PATH = `/guide?cat=${slugifyGuideCategory('Food guide')}`;

export default function CosaMangiare() {
  const pageUrl = `${SITE_URL}/cosa-mangiare`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Cosa mangiare — Guida gastronomica Travelliniwithus',
    description:
      'Una sezione verticale del layer guide Travelliniwithus dedicata ai food guide: piatti regionali e mediterranei che abbiamo assaggiato davvero, con contesto e criteri di scelta.',
    url: pageUrl,
    inLanguage: 'it-IT',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: FOOD_REGIONS.flatMap((r, ri) =>
        r.dishes.map((d, di) => ({
          '@type': 'ListItem',
          position: ri * 10 + di + 1,
          item: {
            '@type': 'MenuItem',
            name: d.name,
            description: d.description,
            image: d.image,
          },
        }))
      ),
    },
  };

  return (
    <PageLayout>
      <SEO
        title="Cosa mangiare — Guida gastronomica Travelliniwithus"
        description="Una sezione verticale del layer guide Travelliniwithus dedicata ai food guide: piatti regionali e mediterranei che abbiamo assaggiato davvero, con contesto e criteri di scelta."
        canonical={pageUrl}
      />
      <JsonLd data={schema} />

      <section className="bg-sand py-24 md:py-32">
        <div className="mx-auto max-w-272 px-6 md:px-10">
          <Breadcrumbs items={[{ label: 'Guide', href: '/guide' }, { label: 'Cosa mangiare' }]} />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              <UtensilsCrossed size={12} />
              Guide pratiche / Cosa mangiare
            </span>
            <h1 className="mt-5 text-5xl font-serif leading-[1.05] text-ink md:text-7xl">
              Il cibo è metà{' '}
              <span className="italic text-black/55">del viaggio che ricorderai</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/65 md:text-xl">
              Selezione dei piatti regionali che abbiamo assaggiato davvero, divisi per area
              geografica. Per ciascuno ti diciamo dove cercarlo, come riconoscere la versione
              autentica e quali sono i segnali della trappola turistica.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={FOOD_GUIDE_PATH}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-accent"
              >
                Apri food guide
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/esperienze?type=food-e-ristoranti"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:border-accent hover:text-accent-text"
              >
                Esperienze food
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-272 px-6 md:px-10">
          <div className="mb-10 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Come scegliere un ristorante
            </span>
            <h2 className="mt-4 text-3xl font-serif leading-tight text-ink md:text-4xl">
              Quattro regole che usiamo noi prima di sederci
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {SELECTION_PRINCIPLES.map((principle, idx) => {
              const Icon = principle.icon;
              return (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: idx * 0.07 }}
                  className="rounded-2xl border border-black/5 bg-sand p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-accent shadow-sm">
                    <Icon size={18} />
                  </div>
                  <h3 className="mb-2 text-lg font-serif leading-tight text-ink">
                    {principle.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-black/62">{principle.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {FOOD_REGIONS.map((region, regionIdx) => {
        const isDark = regionIdx === 1;
        return (
          <section
            key={region.title}
            className={`py-20 md:py-28 ${isDark ? 'bg-ink text-white' : 'bg-sand'}`}
          >
            <div className="mx-auto max-w-304 px-6 md:px-10 xl:px-12">
              <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.3em] ${
                      isDark ? 'text-accent' : 'text-accent-text'
                    }`}
                  >
                    {region.eyebrow}
                  </span>
                  <h2
                    className={`mt-4 text-3xl font-serif leading-tight md:text-4xl ${
                      isDark ? 'text-white' : 'text-ink'
                    }`}
                  >
                    {region.title}
                  </h2>
                  <p
                    className={`mt-5 text-base leading-relaxed ${
                      isDark ? 'text-white/70' : 'text-black/62'
                    }`}
                  >
                    {region.description}
                  </p>
                </div>
                <Link
                  to={region.exploreLink}
                  className={`inline-flex items-center gap-2 self-start rounded-full border px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors md:self-auto ${
                    isDark
                      ? 'border-white/30 text-white/90 hover:border-white hover:text-white'
                      : 'border-black/10 bg-white text-ink hover:border-accent hover:text-accent-text'
                  }`}
                >
                  {region.exploreLabel}
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {region.dishes.map((dish, idx) => (
                  <motion.article
                    key={dish.name}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: idx * 0.08 }}
                    className={`flex flex-col overflow-hidden rounded-2xl shadow-sm ${
                      isDark
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-white border border-black/5'
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <OptimizedImage
                        src={dish.image}
                        alt={dish.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest ${
                          isDark ? 'text-accent' : 'text-accent-text'
                        }`}
                      >
                        {dish.region}
                      </span>
                      <h3
                        className={`mt-2 text-xl font-serif leading-tight ${
                          isDark ? 'text-white' : 'text-ink'
                        }`}
                      >
                        {dish.name}
                      </h3>
                      <p
                        className={`mt-3 text-sm leading-relaxed ${
                          isDark ? 'text-white/70' : 'text-black/65'
                        }`}
                      >
                        {dish.description}
                      </p>
                      <div
                        className={`mt-5 rounded-xl p-4 text-xs leading-relaxed ${
                          isDark ? 'bg-white/5 text-white/70' : 'bg-sand text-black/62'
                        }`}
                      >
                        <span
                          className={`mb-1 block text-[10px] font-bold uppercase tracking-widest ${
                            isDark ? 'text-accent' : 'text-accent-text'
                          }`}
                        >
                          Dove cercarlo
                        </span>
                        {dish.tip}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-272 px-6 md:px-10">
          <div className="rounded-[2.5rem] border border-black/5 bg-sand p-10 md:p-14">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
                Esperienze gastronomiche
              </span>
              <h2 className="mt-4 text-3xl font-serif leading-tight text-ink md:text-4xl">
                Vuoi un tour food guidato?
              </h2>
              <p className="mt-5 text-base leading-relaxed text-black/65">
                Per entrare davvero in una cultura gastronomica, nulla batte un food tour con una
                guida locale. Usiamo GetYourGuide (link affiliato) per esperienze che abbiamo scelto
                dopo averle verificate.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={FOOD_GUIDE_PATH}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-accent"
                >
                  Apri food guide
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/esperienze?type=food-e-ristoranti"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:border-accent hover:text-accent-text"
                >
                  Esperienze gastronomiche
                </Link>
                <Link
                  to="/risorse"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:border-accent hover:text-accent-text"
                >
                  Risorse viaggio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand py-20 md:py-24">
        <div className="mx-auto grid max-w-272 gap-10 px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-16 md:px-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Newsletter food
            </span>
            <h2 className="mt-4 max-w-xl text-4xl font-serif leading-[1.05] text-ink md:text-5xl">
              Nuovi piatti e trattorie
              <span className="italic text-black/55"> ogni volta che ne scopriamo una buona.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-black/62">
              Ti scriviamo quando aggiungiamo un nuovo piatto alla guida o un ristorante che merita
              un viaggio.
            </p>
          </div>
          <div className="rounded-2xl border border-black/6 bg-white p-8 md:p-10">
            <Newsletter compact variant="sand" source="cosa_mangiare" />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
