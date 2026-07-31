import { lazy, Suspense } from 'react';
import BrandCoherentHero from './BrandCoherentHero';
import CleanFeaturedPlaces from '../curated/CleanFeaturedPlaces';
import CleanFeaturedGrid from '../curated/CleanFeaturedGrid';
import CleanEditorialPromise from '../curated/CleanEditorialPromise';
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

export default function CinematicHomepage() {
  return (
    <div className="clean-homepage w-full bg-[var(--color-sand,#faf7f2)] text-[var(--color-ink,#1a2b3c)]">
      <div>
        <section id="hero">
          <MotionReveal direction="up" duration={0.7}>
            <BrandCoherentHero />
          </MotionReveal>
        </section>

        <section id="featured-places">
          <CleanFeaturedPlaces />
        </section>

        <section id="griglia-posti">
          <CleanFeaturedGrid />
        </section>

        <section id="mappa-interattiva-reale">
          <Suspense fallback={<SectionFallback minHeight="32rem" />}>
            <HomeMapSection />
          </Suspense>
        </section>

        <section id="editorial-promise">
          <CleanEditorialPromise />
        </section>

        <section id="reels-stream">
          <Suspense fallback={<SectionFallback minHeight="32rem" />}>
            <HiggsfieldReelCarousel />
          </Suspense>
        </section>

        <section
          id="indice-vivo"
          className="border-t border-[var(--color-border)] bg-white py-16 md:py-24"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <Suspense fallback={<SectionFallback minHeight="20rem" />}>
              <HomeIndiceVivo />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}
