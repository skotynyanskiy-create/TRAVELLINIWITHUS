import { ArrowUpRight, Star, Sparkles, MapPin } from 'lucide-react';
import TiltCard from '@/src/components/TiltCard';
import { Link } from '@/src/components/TransitionLink';

interface FeaturedStory {
  id: string;
  title: string;
  location: string;
  category: string;
  price: string;
  score: string;
  image: string;
  link: string;
  excerpt: string;
}

const FEATURED_STORIES: FeaturedStory[] = [
  {
    id: '1',
    title: 'La Taverna dei Draghi sotterranea',
    location: 'Volterra, Toscana',
    category: 'Cena Particolare',
    price: '€ 45 / persona',
    score: '10/10 Atmosfera',
    image: '/images/reels/reel-3-cover.webp',
    link: '/posto/taverna-volterra-toscana',
    excerpt:
      'Cena medievale sotto volte in pietra del 1300 a lume di candela. Unico ed indimenticabile.',
  },
  {
    id: '2',
    title: 'Masseria di Luce tra gli Ulivi',
    location: "Val d'Itria, Puglia",
    category: 'Dimora Storica',
    price: '€ 180 / notte',
    score: '9.8/10 Relax',
    image: '/images/reels/reel-2-cover.webp',
    link: '/esplora?zone=italia',
    excerpt: 'Piscina privata scavata nella roccia e colazione con fichi freschi e pasticciotti.',
  },
  {
    id: '3',
    title: 'Rorbu di Pescatori sui Fiordi',
    location: 'Lofoten, Norvegia',
    category: 'Esperienza Unica',
    price: '€ 210 / notte',
    score: '10/10 Panoramica',
    image: '/images/reels/reel-4-cover.webp',
    link: '/esplora?zone=europa',
    excerpt: "Dormire sospesi sull'acqua gelida guardando l'aurora boreale direttamente dal letto.",
  },
];

export default function WowFeaturedGrid() {
  return (
    <section className="bg-[var(--color-sand,#faf7f2)] py-20 md:py-28 text-[var(--color-ink)]">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-14 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent,#c85a32)]">
              <Sparkles size={14} />
              Selezione della Settimana
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight md:text-5xl">
              I 3 posti che ci hanno rubato il cuore.
            </h2>
          </div>
          <Link
            to="/esplora"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-ink)] hover:text-[var(--color-accent)] md:mt-0"
          >
            Vedi tutti i posti provati
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* 3 Grid Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {FEATURED_STORIES.map((story) => (
            <TiltCard key={story.id} maxTilt={6} className="w-full">
              <Link
                to={story.link}
                className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg,16px)] border border-[var(--color-border)] bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                {/* Image aspect 4/5 */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/10">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute left-3 top-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                      <MapPin size={10} className="text-[var(--color-accent)]" />
                      {story.location}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[var(--color-ink)] shadow-sm">
                      <Star
                        size={10}
                        className="fill-[var(--color-accent)] text-[var(--color-accent)]"
                      />
                      {story.score}
                    </span>
                  </div>

                  {/* Bottom Text inside image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent,#c85a32)]">
                      {story.category}
                    </span>
                    <h3 className="mt-1 font-serif text-xl font-normal leading-snug text-white">
                      {story.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <p className="text-xs leading-relaxed text-[var(--color-muted-fg)]">
                    {story.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-xs">
                    <span className="font-bold text-[var(--color-ink)]">{story.price}</span>
                    <span className="font-bold text-[var(--color-accent)] group-hover:translate-x-1 transition-transform">
                      Scopri &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
