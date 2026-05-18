import { useState } from 'react';
import { Headphones } from 'lucide-react';
import AudioGuidePlayer from './AudioGuidePlayer';
import { isAudioGuidePublished, type AudioGuide } from '../../config/audioGuides';
import { trackEvent } from '../../services/analytics';

interface AudioGuideSectionProps {
  /** La audio guide da renderizzare (dal config AUDIO_GUIDES). */
  guide: AudioGuide;
  /** Forza il render anche se la guida e' in stato 'planning' (per preview admin). */
  forceShow?: boolean;
}

/**
 * AudioGuideSection — sezione "Audio guida" per articolo pillar.
 *
 * Marathon FASE 2.B 2026-05-17.
 *
 * Layout:
 * - Header editoriale (eyebrow + titolo + dek)
 * - Sidebar: lista numerata punti (dispatch-index-number) con cui passare
 *   da un punto all'altro
 * - Main: AudioGuidePlayer del punto attivo
 *
 * Comportamento:
 * - Se la guida non e' publishable (no punti registrati) → ritorna null
 *   (nascosta automaticamente). forceShow=true per preview interna.
 * - Click su un punto cambia stato attivo, scrolls player into view su mobile.
 * - Tracking: audio_guide_view su mount, audio_guide_point_change su switch.
 *
 * Coerente con direzione Editorial Slow: serif, eyebrow 0.18em, motion sobrio.
 */
export default function AudioGuideSection({ guide, forceShow = false }: AudioGuideSectionProps) {
  const [activePointIdx, setActivePointIdx] = useState(0);

  // Se la guida non e' pubblicata e non forziamo show, non renderizzare nulla.
  if (!forceShow && !isAudioGuidePublished(guide)) {
    return null;
  }

  const activePoint = guide.points[activePointIdx];
  if (!activePoint) return null;

  const handlePointSelect = (idx: number) => {
    if (idx === activePointIdx) return;
    setActivePointIdx(idx);
    trackEvent('audio_guide_point_change', {
      guide_slug: guide.slug,
      from_point: guide.points[activePointIdx].id,
      to_point: guide.points[idx].id,
      to_index: idx,
    });
  };

  return (
    <section id="audio-guida" aria-labelledby="audio-guida-heading" className="section-editorial">
      <header className="mb-12 max-w-2xl">
        <span className="text-eyebrow inline-flex items-center gap-2">
          <Headphones size={14} /> Audio guida
        </span>
        <h2
          id="audio-guida-heading"
          className="mt-5 font-serif font-medium leading-[1.1] tracking-tight text-[var(--color-ink)] text-[clamp(1.75rem,3vw+0.5rem,2.75rem)]"
        >
          {guide.title}
        </h2>
        <p className="mt-5 text-body-editorial">{guide.subtitle}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr]">
        {/* Sidebar: lista punti numerata */}
        <nav aria-label="Punti della audio guida" className="lg:sticky lg:top-28 lg:self-start">
          <ol className="space-y-1">
            {guide.points.map((point, idx) => {
              const isActive = idx === activePointIdx;
              const isPlaceholder = point.durationSec === 0;
              return (
                <li key={point.id}>
                  <button
                    type="button"
                    onClick={() => handlePointSelect(idx)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`group flex w-full items-start gap-4 rounded-[var(--radius-md)] border px-5 py-4 text-left transition-all duration-300 ${
                      isActive
                        ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white shadow-[var(--shadow-sm)]'
                        : 'border-black/8 bg-white text-[var(--color-ink)] hover:border-black/20 hover:-translate-y-0.5'
                    }`}
                  >
                    <span
                      className={`dispatch-index-number !min-w-[2rem] ${
                        isActive ? '!text-white/65' : ''
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1">
                      <span className={`text-eyebrow block ${isActive ? '!text-white/65' : ''}`}>
                        {point.eyebrow}
                        {isPlaceholder && (
                          <>
                            {' '}
                            ·{' '}
                            <span className={isActive ? 'text-white/65' : 'text-black/45'}>
                              in arrivo
                            </span>
                          </>
                        )}
                      </span>
                      <span className="mt-2 block font-serif text-lg leading-snug">
                        {point.title}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {guide.podcastFeedUrl && (
            <a
              href={guide.podcastFeedUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('audio_guide_podcast_click', { guide_slug: guide.slug })}
              className="mt-6 inline-flex items-center gap-2 text-eyebrow text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
            >
              <Headphones size={13} /> Iscriviti al podcast
            </a>
          )}
        </nav>

        {/* Main: player del punto attivo */}
        <div>
          <AudioGuidePlayer
            point={activePoint}
            guideSlug={guide.slug}
            index={activePointIdx}
            total={guide.points.length}
            posterImage={guide.heroImage}
          />
        </div>
      </div>
    </section>
  );
}
