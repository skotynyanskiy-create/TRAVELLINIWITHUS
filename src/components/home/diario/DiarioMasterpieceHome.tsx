import DiarioChapterMasonry from './DiarioChapterMasonry';
import DiarioConversionSection from './DiarioConversionSection';
import DiarioHeroCinematic from './DiarioHeroCinematic';
import DiarioMapSection from './DiarioMapSection';
import DiarioReelStream from './DiarioReelStream';
import DiarioWeekendGenerator from './DiarioWeekendGenerator';

export default function DiarioMasterpieceHome() {
  return (
    <div className="w-full bg-[var(--color-sand)] text-[var(--color-ink)]">
      <div>
        {/* Sezione 1: Hero Cinematica & Trust Strip */}
        <section id="diario-hero">
          <DiarioHeroCinematic />
        </section>

        {/* Sezione 2: Bento Grid 4 Capitoli della Meraviglia */}
        <section id="diario-capitoli">
          <DiarioChapterMasonry />
        </section>

        {/* Sezione 3: Mappa Interattiva MapLibre */}
        <section id="diario-mappa">
          <DiarioMapSection />
        </section>

        {/* Sezione 4: Stream Video Reels 9:16 & Player Inline */}
        <section id="diario-reels">
          <DiarioReelStream />
        </section>

        {/* Sezione 5: Generatore Interattivo di Weekend */}
        <section id="diario-weekend-generator">
          <DiarioWeekendGenerator />
        </section>

        {/* Sezione 6: Dual-Funnel Conversione B2C & B2B */}
        <section id="diario-conversion">
          <DiarioConversionSection />
        </section>
      </div>
    </div>
  );
}
