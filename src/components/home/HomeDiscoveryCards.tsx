import { motion } from 'motion/react';
import { ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DESTINATION_GROUPS,
  slugifyExperienceType,
  type DestinationGroup,
  type ExperienceType,
} from '../../config/contentTaxonomy';
import { getDestinationVisual } from '../../config/destinationVisuals';
import {
  HOME_EXPERIENCE_TYPES,
  getExperienceCardLabel,
  getExperienceDescription,
} from '../../config/experienceContent';
import { getExperienceVisual } from '../../config/experienceVisuals';

const EXPERIENCE_IMAGES: Record<string, string> = {
  'Posti particolari':
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop',
  'Food & Ristoranti':
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=900&auto=format&fit=crop',
  'Hotel con carattere':
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=900&auto=format&fit=crop',
  'Weekend romantici':
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop',
  "Borghi e cittÃ  d'arte":
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=900&auto=format&fit=crop',
  'Relax, terme e spa':
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=900&auto=format&fit=crop',
};

function getCleanExperienceLabel(type: ExperienceType) {
  if (String(type).includes('Borghi')) return 'Borghi';
  return getExperienceCardLabel(type);
}

function getCleanExperienceDescription(type: ExperienceType) {
  if (String(type).includes('Borghi')) {
    return 'Centri storici, scorci e cultura da vivere senza correre.';
  }

  return getExperienceDescription(type);
}

function getExperienceImage(type: ExperienceType) {
  if (String(type).includes('Borghi')) {
    return 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=900&auto=format&fit=crop';
  }

  return EXPERIENCE_IMAGES[type] ?? EXPERIENCE_IMAGES['Posti particolari'];
}

function DestinationFeature({ group }: { group: DestinationGroup }) {
  const visual = getDestinationVisual(group);

  return (
    <Link
      to={`/destinazioni?group=${encodeURIComponent(group)}`}
      className="group relative min-h-[360px] overflow-hidden rounded-lg bg-ink text-white md:min-h-[500px] lg:col-span-7"
    >
      <img
        src={visual.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.2)_40%,rgba(0,0,0,0.76)_100%)]" />
      <div className="relative flex h-full min-h-[360px] flex-col justify-between p-6 md:min-h-[500px] md:p-9">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/78">
            In evidenza
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/22 bg-white/12 backdrop-blur-md transition-transform duration-300 group-hover:translate-x-0.5">
            <ArrowRight size={15} />
          </span>
        </div>

        <div className="max-w-lg">
          <h3 className="text-6xl font-serif leading-none md:text-8xl">{group}</h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/78 md:text-base">
            {visual.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function DestinationTile({ group, className = '' }: { group: DestinationGroup; className?: string }) {
  const visual = getDestinationVisual(group);

  return (
    <Link
      to={`/destinazioni?group=${encodeURIComponent(group)}`}
      className={`group relative min-h-[154px] overflow-hidden rounded-lg bg-ink text-white md:min-h-[242px] ${className}`}
    >
      <img
        src={visual.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/24 to-black/76" />
      <div className="relative flex h-full min-h-[154px] flex-col justify-between p-4 md:min-h-[242px] md:p-5">
        <span className="flex h-8 w-8 items-center justify-center self-end rounded-lg border border-white/18 bg-white/12 backdrop-blur-md transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowRight size={13} />
        </span>

        <div>
          <h3 className="text-xl font-serif leading-none md:text-3xl">{group}</h3>
          <p className="mt-2 line-clamp-2 max-w-[15rem] text-[11px] leading-relaxed text-white/68 md:text-xs">
            {visual.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function ExperienceCard({ type }: { type: ExperienceType }) {
  const visual = getExperienceVisual(type);
  const Icon = visual.icon;
  const image = getExperienceImage(type);

  return (
    <Link
      to={`/esperienze?type=${slugifyExperienceType(type)}`}
      className="group relative min-h-[146px] overflow-hidden rounded-lg bg-ink text-left text-white transition-all duration-300 hover:-translate-y-0.5 md:min-h-[190px]"
    >
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/22 to-black/78" />

      <span className="relative flex h-full min-h-[146px] flex-col justify-between p-4 md:min-h-[190px] md:p-5">
        <span className="flex items-start justify-between gap-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/16 bg-white/14 text-white backdrop-blur-md">
            <Icon size={15} />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/16 bg-white/12 backdrop-blur-md transition-transform group-hover:translate-x-0.5">
            <ArrowRight size={13} />
          </span>
        </span>

        <span>
          <span className="block text-xl font-serif leading-none text-white md:text-3xl">
            {getCleanExperienceLabel(type)}
          </span>
          <span className="mt-2 line-clamp-2 block max-w-[17rem] text-[10px] leading-relaxed text-white/68 md:text-xs">
            {getCleanExperienceDescription(type)}
          </span>
        </span>
      </span>
    </Link>
  );
}

export default function HomeDiscoveryCards() {
  const [featuredDestination, ...secondaryDestinations] = DESTINATION_GROUPS;

  return (
    <section className="bg-white py-16 md:py-24">
      <motion.div
        className="mx-auto max-w-[82rem] px-6 md:px-10 xl:px-12"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Archivio guidato
            </span>
            <h2 className="mt-3 text-4xl font-serif leading-tight text-ink md:text-6xl">
              Trova il prossimo posto da salvare.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/62 md:text-lg">
              Parti da una zona, da uno stile di viaggio o da un'idea precisa. Il resto lo trovi
              nell'archivio.
            </p>
          </div>

          <Link
            to="/destinazioni?search="
            className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-lg border border-black/10 px-5 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-accent-warm)]"
          >
            <Search size={14} />
            Cerca nell'archivio
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <DestinationFeature group={featuredDestination} />

          <div className="grid grid-cols-2 gap-4 lg:col-span-5 lg:grid-cols-6">
            {secondaryDestinations.map((group, index) => (
              <DestinationTile
                key={group}
                group={group}
                className={index < 2 ? 'lg:col-span-3' : 'lg:col-span-2 lg:min-h-[238px]'}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
                Esplora per esperienza
              </span>
              <h3 className="mt-1 text-2xl font-serif leading-tight text-ink md:text-3xl">
                Scegli il ritmo del viaggio.
              </h3>
            </div>
            <Link
              to="/esperienze"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:text-[var(--color-accent-warm)]"
            >
              Apri tutte le esperienze <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            {HOME_EXPERIENCE_TYPES.map((type) => (
              <ExperienceCard key={type} type={type} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
