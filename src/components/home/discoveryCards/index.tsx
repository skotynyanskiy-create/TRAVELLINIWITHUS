import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TiltCard from '../../TiltCard';
import {
  slugifyExperienceType,
  type DestinationGroup,
  type ExperienceType,
  type GuideCategory,
} from '../../../config/contentTaxonomy';
import { getDestinationVisual } from '../../../config/destinationVisuals';
import {
  getExperienceCardLabel,
  getExperienceDescription,
} from '../../../config/experienceContent';
import { getExperienceVisual } from '../../../config/experienceVisuals';
import { GUIDE_CATEGORY_VISUALS } from '../../../config/guideContent';
import { slugifyGuideCategory } from '../../../config/contentTaxonomy';

const EXPERIENCE_IMAGES: Record<string, string> = {
  'Posti particolari':
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop',
  'Food & Ristoranti':
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=900&auto=format&fit=crop',
  'Hotel con carattere':
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=900&auto=format&fit=crop',
  'Weekend romantici':
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop',
  "Borghi e città d'arte":
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=900&auto=format&fit=crop',
  'Relax, terme e spa':
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=900&auto=format&fit=crop',
};

function getExperienceImage(type: ExperienceType) {
  return EXPERIENCE_IMAGES[type] ?? EXPERIENCE_IMAGES['Posti particolari'];
}

export function DestinationFeature({ group }: { group: DestinationGroup }) {
  const visual = getDestinationVisual(group);

  return (
    <TiltCard className="lg:col-span-7" maxTilt={5}>
      <Link
        data-discovery-reveal
        to={`/destinazioni?group=${encodeURIComponent(group)}`}
        className="group relative block min-h-[360px] overflow-hidden rounded-lg bg-ink text-white md:min-h-[500px]"
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
    </TiltCard>
  );
}

export function DestinationTile({
  group,
  className = '',
}: {
  group: DestinationGroup;
  className?: string;
}) {
  const visual = getDestinationVisual(group);

  return (
    <Link
      data-discovery-reveal
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

export function ExperienceCard({
  type,
  className = '',
  featured = false,
}: {
  type: ExperienceType;
  className?: string;
  featured?: boolean;
}) {
  const visual = getExperienceVisual(type);
  const Icon = visual.icon;
  const image = getExperienceImage(type);

  return (
    <Link
      data-discovery-reveal
      to={`/esperienze?type=${slugifyExperienceType(type)}`}
      className={`group relative h-full min-h-[146px] overflow-hidden rounded-lg bg-ink text-left text-white transition-all duration-300 hover:-translate-y-0.5 md:min-h-[190px] ${className}`}
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
            <Icon size={featured ? 18 : 15} />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/16 bg-white/12 backdrop-blur-md transition-transform group-hover:translate-x-0.5">
            <ArrowRight size={13} />
          </span>
        </span>
        <span>
          <span
            className={`block font-serif leading-none text-white ${
              featured ? 'text-3xl md:text-5xl' : 'text-xl md:text-3xl'
            }`}
          >
            {getExperienceCardLabel(type)}
          </span>
          <span
            className={`mt-2 block text-[10px] leading-relaxed text-white/68 md:text-xs ${
              featured ? 'line-clamp-3 max-w-[26rem]' : 'line-clamp-2 max-w-[17rem]'
            }`}
          >
            {getExperienceDescription(type)}
          </span>
        </span>
      </span>
    </Link>
  );
}

export function GuideTile({
  category,
  description,
}: {
  category: GuideCategory;
  description: string;
}) {
  const visual = GUIDE_CATEGORY_VISUALS[category];
  const Icon = visual?.icon;
  return (
    <Link
      to={`/guide?cat=${slugifyGuideCategory(category)}`}
      className="group flex flex-col gap-2 rounded-[var(--radius-md)] border border-black/6 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderLeftColor: visual?.color, borderLeftWidth: 3 }}
    >
      {Icon && (
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ backgroundColor: visual.colorLight, color: visual.color }}
        >
          <Icon size={16} />
        </div>
      )}
      <p className="text-sm font-serif leading-tight text-[var(--color-ink)]">{category}</p>
      <p className="line-clamp-2 text-[11px] leading-relaxed text-black/55">{description}</p>
    </Link>
  );
}

export function useDiscoveryGsapReveal(scope: React.RefObject<HTMLElement | null>) {
  // Helper hook condiviso: caller fa useGSAP({ scope }) e chiama questo dentro.
  // Lasciato come noop placeholder per ora — i wrapper section gestiscono reveal in proprio.
  return scope;
}
