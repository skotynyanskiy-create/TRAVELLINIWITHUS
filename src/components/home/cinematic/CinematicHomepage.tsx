import HomeIndiceVivo from './HomeIndiceVivo';
import CleanCuratedHero from '../curated/CleanCuratedHero';
import CleanFeaturedPlaces from '../curated/CleanFeaturedPlaces';
import CleanEditorialPromise from '../curated/CleanEditorialPromise';
import WeekendGeneratorWidget from './WeekendGeneratorWidget';
import HiggsfieldReelCarousel from './HiggsfieldReelCarousel';

export default function CinematicHomepage() {
  return (
    <div className="clean-homepage w-full bg-[var(--color-sand,#faf7f2)] text-[var(--color-ink,#1a2b3c)]">
      <main>
        {/* 1. Hero Editoriale Curato */}
        <section id="hero">
          <CleanCuratedHero />
        </section>

        {/* 2. Selezione dei 3 Posti in Evidenza */}
        <section id="featured-places">
          <CleanFeaturedPlaces />
        </section>

        {/* 3. Il Metodo e la Promessa di Trasparenza */}
        <section id="editorial-promise">
          <CleanEditorialPromise />
        </section>

        {/* 4. Generatore Interattivo di Weekend */}
        <section id="weekend-generator">
          <WeekendGeneratorWidget />
        </section>

        {/* 5. Stream Video Reels 9:16 */}
        <section id="reels-stream">
          <HiggsfieldReelCarousel />
        </section>

        {/* 6. Indice dei Posti Provati */}
        <section id="indice-vivo" className="py-16 md:py-24 bg-white border-t border-[var(--color-border)]">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <HomeIndiceVivo />
          </div>
        </section>
      </main>
    </div>
  );
}
