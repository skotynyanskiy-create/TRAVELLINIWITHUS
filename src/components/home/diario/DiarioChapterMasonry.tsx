import { motion } from 'motion/react';
import { ArrowUpRight, Flame, MapPin, Sparkles, Star } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';

interface ChapterItem {
  id: string;
  chapterNumber: string;
  chapterTag: string;
  title: string;
  location: string;
  price: string;
  score: string;
  image: string;
  link: string;
  description: string;
  badge?: string;
  spanClass: string;
}

const CHAPTER_ITEMS: ChapterItem[] = [
  {
    id: 'toscana-volterra',
    chapterNumber: '01',
    chapterTag: 'SEMBRA IMPOSSIBILE',
    title: 'Cenare nella tana dei draghi a Volterra',
    location: 'Volterra · Toscana',
    price: '€ 45 / persona',
    score: '10/10 Atmosfera',
    image: '/images/reels/reel-3-cover.webp',
    link: '/posto/toscana-aperitivo-volterra',
    description:
      'Una taverna a tema medievale tra vetrate gotiche, draghi e fiorentina eccezionale. Ti senti dentro una leggenda.',
    badge: 'Trending IG',
    spanClass: 'lg:col-span-2 lg:row-span-2',
  },
  {
    id: 'egitto-mar-rosso',
    chapterNumber: '02',
    chapterTag: 'ALTROVE, VICINO',
    title: 'Mar Rosso economico con reef dal pontile',
    location: 'Marsa Alam · Egitto',
    price: '€ 85 / notte',
    score: '9.5/10 Valore',
    image: '/images/reels/reel-1-cover.webp',
    link: '/posto/egitto-marsa-alam-dream-lagoon',
    description:
      'Acqua trasparente, reef a due passi dal pontile e ristoranti curati senza spendere un patrimonio.',
    badge: 'Super Prezzo',
    spanClass: 'lg:col-span-1 lg:row-span-1',
  },
  {
    id: 'malesia-batu-caves',
    chapterNumber: '03',
    chapterTag: 'POSTI PARTICOLARI',
    title: 'Batu Caves e la scalinata arcobaleno',
    location: 'Kuala Lumpur · Malesia',
    price: 'Ingresso Gratuito',
    score: '10/10 Meraviglia',
    image: '/images/reels/reel-4-cover.webp',
    link: '/posto/malesia-batu-caves',
    description:
      'La statua dorata colossale e i templi dentro la roccia. Ingresso libero, posto indescrivibile.',
    badge: 'Top 3 World',
    spanClass: 'lg:col-span-1 lg:row-span-1',
  },
  {
    id: 'toscana-sushi-kibo',
    chapterNumber: '04',
    chapterTag: 'MANGIARE DENTRO UNA STORIA',
    title: 'Sushi scenografico con ruscello in sala',
    location: 'Toscana · Sushi Kibo',
    price: '€ 32 AYCE',
    score: '9.8/10 Scenografia',
    image: '/images/reels/reel-2-cover.webp',
    link: '/esplora?type=Food%20%26%20Ristoranti',
    description:
      'Sala spettacolare sull’acqua, design in legno e all-you-can-eat di qualità altissima.',
    badge: 'Consigliato',
    spanClass: 'lg:col-span-2 lg:row-span-1',
  },
];

export default function DiarioChapterMasonry() {
  return (
    <section className="border-b border-[var(--color-border)] bg-white py-24 text-[var(--color-ink)] md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
              <Sparkles size={14} />
              L'Atlante per Capitoli
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-[var(--color-ink)] md:text-5xl lg:text-6xl">
              I 4 Capitoli della{' '}
              <span className="italic font-serif text-[var(--color-accent-text)]">
                Meraviglia Concreta
              </span>
              .
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-muted-fg)] font-light">
              Non classifiche generiche: luoghi scelti per atmosfera, trasparenza sui costi e
              verdetto onesto sul campo.
            </p>
          </div>

          <Link
            to="/esplora"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] transition-all hover:border-[var(--color-ink)] md:mt-0 shadow-xs"
          >
            Vedi tutto l'Atlante <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Bento Grid Masonry Layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {CHAPTER_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`group flex flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-sand)] shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl ${item.spanClass}`}
            >
              {/* Image Area */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 lg:aspect-auto lg:h-[320px]">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Overlay Top Badges */}
                <div className="absolute left-4 top-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)] backdrop-blur-md shadow-sm">
                    <MapPin size={11} className="text-[var(--color-accent-text)]" />
                    {item.location}
                  </span>
                  {item.badge && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ink)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                      <Flame size={11} className="text-[var(--color-accent-on-dark)]" />{' '}
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center gap-2">
                    <span className="font-serif italic text-lg text-[var(--color-accent-on-dark)]">
                      {item.chapterNumber}
                    </span>
                    <span className="text-white/40">·</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/90">
                      {item.chapterTag}
                    </span>
                  </div>
                  <h3 className="mt-1 font-serif text-2xl font-normal leading-snug text-white">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Details Body */}
              <div className="flex flex-1 flex-col justify-between p-7">
                <p className="text-sm leading-relaxed text-[var(--color-muted-fg)] font-light">
                  {item.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-xs font-semibold">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-white border border-[var(--color-border)] px-3 py-1 text-[var(--color-ink)] shadow-xs">
                      {item.price}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[var(--color-ink-2)]">
                      <Star
                        size={12}
                        className="fill-[var(--color-accent)] text-[var(--color-accent)]"
                      />
                      {item.score}
                    </span>
                  </div>

                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[var(--color-accent-text)] transition-transform group-hover:translate-x-1"
                  >
                    Apri Scheda <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
