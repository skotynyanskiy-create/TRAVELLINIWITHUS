import { lazy, Suspense, type ReactNode } from 'react';
import BrandCoherentHero from './BrandCoherentHero';
import CleanFeaturedPlaces from '../curated/CleanFeaturedPlaces';
import CleanFeaturedGrid from '../curated/CleanFeaturedGrid';
import CleanEditorialPromise from '../curated/CleanEditorialPromise';
import HomeFamilyPicks from '../curated/HomeFamilyPicks';
import HomeAudienceVoice from '../HomeAudienceVoice';
import { useAudience } from '@/src/context/AudienceContext';
import { compositionFor, type SectionKey } from '@/src/config/homeComposition';
import { MotionReveal } from '@/src/components/ui/MotionSignature';

const HomeMapSection = lazy(() => import('../HomeMapSection'));
const HiggsfieldReelCarousel = lazy(() => import('./HiggsfieldReelCarousel'));
const HomeIndiceVivo = lazy(() => import('./HomeIndiceVivo'));

function SectionFallback({ minHeight = '24rem' }: { minHeight?: string }) {
  return (
    <div
      className="w-full animate-pulse bg-[var(--color-sand,#faf7f2)]"
      style={{ minHeight }}
      aria-hidden="true"
    />
  );
}

/**
 * La home come renderer di una composizione, non come sequenza fissa
 * (PROJECT_HOME_RICOMPOSIZIONE_2026-07-26, §4).
 *
 * Fuori dalla lista restano hero e voce dell'audience, in quest'ordine e
 * sempre: l'hero deve essere identico a ogni visita — una sola `/` per Google,
 * un solo elemento LCP, zero layout shift sopra la piega. La ricomposizione
 * agisce solo sotto.
 *
 * Rollback: rimettere una sola lista in `homeComposition.ts` riproduce
 * esattamente l'ordine precedente.
 */
const SECTIONS: Record<SectionKey, ReactNode> = {
  featured: <CleanFeaturedPlaces />,
  grid: <CleanFeaturedGrid />,
  family: <HomeFamilyPicks />,
  map: (
    <Suspense fallback={<SectionFallback minHeight="32rem" />}>
      <HomeMapSection />
    </Suspense>
  ),
  reels: (
    <Suspense fallback={<SectionFallback minHeight="32rem" />}>
      <HiggsfieldReelCarousel />
    </Suspense>
  ),
  method: <CleanEditorialPromise />,
  // L'indice porta il proprio contenitore: bordo, fondo bianco e colonna
  // centrata vivevano qui prima della ricomposizione e restano suoi.
  index: (
    <div className="border-t border-[var(--color-border)] bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Suspense fallback={<SectionFallback minHeight="20rem" />}>
          <HomeIndiceVivo />
        </Suspense>
      </div>
    </div>
  ),
};

const SECTION_ID: Record<SectionKey, string> = {
  featured: 'featured-places',
  grid: 'griglia-posti',
  family: 'consigli-family',
  map: 'mappa-interattiva-reale',
  reels: 'reels-stream',
  method: 'editorial-promise',
  index: 'indice-vivo',
};

export default function CinematicHomepage() {
  const { audience } = useAudience();
  const { sections } = compositionFor(audience);

  return (
    <div className="clean-homepage w-full bg-[var(--color-sand,#faf7f2)] text-[var(--color-ink,#1a2b3c)]">
      <div>
        <section id="hero">
          <MotionReveal direction="up" duration={0.7}>
            <BrandCoherentHero />
          </MotionReveal>
        </section>

        <HomeAudienceVoice />

        {sections.map((key) => (
          <section key={key} id={SECTION_ID[key]}>
            {SECTIONS[key]}
          </section>
        ))}
      </div>
    </div>
  );
}
