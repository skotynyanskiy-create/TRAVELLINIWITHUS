import { lazy, Suspense } from 'react';
import CleanCuratedHero from '../curated/CleanCuratedHero';
import CleanFeaturedPlaces from '../curated/CleanFeaturedPlaces';
import CleanEditorialPromise from '../curated/CleanEditorialPromise';

const HomeMapSection = lazy(() => import('../HomeMapSection'));
const WeekendGeneratorWidget = lazy(() => import('./WeekendGeneratorWidget'));
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
          <CleanCuratedHero />
        </section>

        <section id="featured-places">
          <CleanFeaturedPlaces />
        </section>

        <section id="mappa-interattiva-reale">
          <Suspense fallback={<SectionFallback minHeight="32rem" />}>
            <HomeMapSection />
          </Suspense>
        </section>

        <section id="editorial-promise">
          <CleanEditorialPromise />
        </section>

        <section id="weekend-generator">
          <Suspense fallback={<SectionFallback minHeight="28rem" />}>
            <WeekendGeneratorWidget />
          </Suspense>
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
