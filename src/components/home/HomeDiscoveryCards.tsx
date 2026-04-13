import { motion } from 'motion/react';
import { ArrowRight, Compass, MapPin, Search } from 'lucide-react';
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

function DestinationTile({ group }: { group: DestinationGroup }) {
  const visual = getDestinationVisual(group);

  return (
    <Link
      to={`/destinazioni?group=${encodeURIComponent(group)}`}
      className="group relative min-h-[154px] overflow-hidden rounded-lg bg-ink text-white md:min-h-[204px]"
    >
      <img
        src={visual.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/78" />
      <div className="relative flex h-full min-h-[154px] flex-col justify-between p-4 md:min-h-[204px] md:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-lg bg-white/18 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/82 backdrop-blur-md">
            Destinazione
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-white/12 backdrop-blur-md transition-transform group-hover:rotate-45">
            <ArrowRight size={12} />
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-serif leading-none md:text-3xl">{group}</h3>
          <p className="mt-2 line-clamp-2 max-w-[15rem] text-xs leading-relaxed text-white/68">
            {visual.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function ExperienceTile({ type }: { type: ExperienceType }) {
  const visual = getExperienceVisual(type);
  const Icon = visual.icon;

  return (
    <Link
      to={`/esperienze?type=${slugifyExperienceType(type)}`}
      className="group rounded-lg border border-black/8 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-gold)] hover:bg-[var(--color-gold-soft)]/35"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold-soft)] text-[var(--color-accent-warm)] ring-1 ring-black/5">
          <Icon size={18} />
        </span>
        <ArrowRight
          size={14}
          className="mt-1 text-black/24 transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-accent-warm)]"
        />
      </div>
      <h3 className="mt-5 text-lg font-serif leading-tight text-ink">
        {getExperienceCardLabel(type)}
      </h3>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-black/55">
        {getExperienceDescription(type)}
      </p>
    </Link>
  );
}

export default function HomeDiscoveryCards() {
  return (
    <section className="bg-white py-16 md:py-24">
      <motion.div
        className="mx-auto max-w-7xl px-6 md:px-12"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-9 flex flex-col justify-between gap-6 border-b border-black/8 pb-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Esplora subito
            </span>
            <h2 className="mt-2 text-3xl font-serif leading-tight text-ink md:text-5xl">
              Da dove vuoi partire?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/62 md:text-lg">
              Scegli un luogo o uno stile di viaggio. Il resto lo trovi nell'archivio.
            </p>
          </div>
          <Link
            to="/destinazioni?search="
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-black/10 px-4 py-3 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-accent-warm)]"
          >
            <Search size={14} />
            Cerca nell'archivio
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.76fr_1.44fr]">
          <div className="flex min-h-[310px] flex-col justify-between rounded-lg bg-ink p-7 text-white md:min-h-[410px] md:p-9">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                <MapPin size={13} />
                Per luogo
              </div>
              <h3 className="mt-7 text-3xl font-serif leading-tight md:text-5xl">
                Parti dalla geografia del viaggio.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/66 md:text-base">
                Sei aree chiare per iniziare subito dal luogo giusto.
              </p>
            </div>
            <div className="mt-8">
              <Link
                to="/destinazioni"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:bg-[var(--color-gold-soft)]"
              >
                Apri destinazioni <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {DESTINATION_GROUPS.map((group) => (
              <DestinationTile key={group} group={group} />
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.76fr_1.44fr]">
          <div className="rounded-lg border border-black/8 bg-[var(--color-sand)] p-7 md:p-9">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
              <Compass size={13} />
              Per esperienza
            </div>
            <h3 className="mt-7 text-3xl font-serif leading-tight text-ink md:text-5xl">
              Parti dal tipo di esperienza che cerchi.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-black/62 md:text-base">
              Scorciatoie curate per arrivare prima all'idea giusta.
            </p>
            <Link
              to="/esperienze"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent-warm)]"
            >
              Apri esperienze <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {HOME_EXPERIENCE_TYPES.map((type) => (
              <ExperienceTile key={type} type={type} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
