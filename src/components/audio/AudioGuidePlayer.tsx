import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Play, FileText, X } from 'lucide-react';
import { trackEvent } from '../../services/analytics';
import type { AudioGuidePoint } from '../../config/audioGuides';

interface AudioGuidePlayerProps {
  /** Punto audio attualmente selezionato dal player */
  point: AudioGuidePoint;
  /** Slug della guida parent (per analytics + audio path resolution) */
  guideSlug: string;
  /** Numero progressivo del punto (per UI dispatch-index-number style) */
  index: number;
  /** Total punti nella guida — per "N di M" UI */
  total: number;
  /** Foto poster opzionale */
  posterImage?: string;
}

/**
 * AudioGuidePlayer — player audio premium Editorial Slow per il punto attivo
 * di una audio guide narrata da Rodrigo & Betta.
 *
 * Marathon FASE 2.B 2026-05-17.
 *
 * Caratteristiche:
 * - HTML5 audio native (no librerie esterne, max controllo + a11y)
 * - Play/pause + scrubber + duration display
 * - Transcript toggle accessibile (jsx-a11y compliant)
 * - Track events: audio_play, audio_pause, audio_complete, transcript_toggle
 * - Stato "non ancora registrato" se durationSec === 0 (placeholder R+B)
 * - Reduced motion safe
 *
 * UI segue brand Editorial Slow: serif eyebrow, body editoriale 17/28,
 * motion sobrio (no parallax, no GSAP).
 */
export default function AudioGuidePlayer({
  point,
  guideSlug,
  index,
  total,
  posterImage,
}: AudioGuidePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  /** Stato placeholder: audio non ancora registrato da R+B */
  const isPlaceholder = point.durationSec === 0;
  const audioUrl = `/audio/${point.audioPath}`;

  // Reset player quando cambia punto attivo — pattern "adjust state during
  // render" (React 19) per evitare react-hooks/set-state-in-effect.
  const [prevPointId, setPrevPointId] = useState(point.id);
  if (point.id !== prevPointId) {
    setPrevPointId(point.id);
    setIsPlaying(false);
    setCurrentTime(0);
    setShowTranscript(false);
  }

  // Side-effect su DOM audio element (no setState) — useEffect e' appropriato.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [point.id]);

  const handlePlayPause = () => {
    if (isPlaceholder || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      trackEvent('audio_pause', {
        guide_slug: guideSlug,
        point_id: point.id,
        progress: audioRef.current.currentTime,
      });
    } else {
      audioRef.current.play().catch(() => {
        // Audio autoplay rejected / file mancante — log silenzioso, UI stays.
      });
      trackEvent('audio_play', {
        guide_slug: guideSlug,
        point_id: point.id,
        narrator: point.narrator,
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    trackEvent('audio_complete', { guide_slug: guideSlug, point_id: point.id });
  };

  const handleScrub = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = Number(event.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleTranscriptToggle = () => {
    setShowTranscript((prev) => {
      const next = !prev;
      if (next) {
        trackEvent('audio_transcript_open', { guide_slug: guideSlug, point_id: point.id });
      }
      return next;
    });
  };

  const formatTime = (sec: number): string => {
    if (!isFinite(sec) || sec < 0) return '0:00';
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const displayDuration = duration > 0 ? duration : point.durationSec;
  const progress = displayDuration > 0 ? Math.min(100, (currentTime / displayDuration) * 100) : 0;

  return (
    <motion.div
      key={point.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-[var(--radius-xl)] border border-black/8 bg-white shadow-[var(--shadow-md)]"
    >
      {/* Header con poster + meta */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-sand)]">
        {posterImage ? (
          <img
            src={posterImage}
            alt={`Foto di ${point.title}`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1">
              <p className="text-eyebrow !text-white/85">
                {point.eyebrow} · Punto {String(index + 1).padStart(2, '0')} di{' '}
                {String(total).padStart(2, '0')}
              </p>
              <h3 className="mt-3 font-serif font-medium leading-[1.1] tracking-tight text-white text-[clamp(1.5rem,2.5vw+0.5rem,2.25rem)]">
                {point.title}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Controlli player */}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={handlePlayPause}
            disabled={isPlaceholder}
            aria-label={isPlaying ? 'Metti in pausa' : 'Riproduci audio'}
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-all md:h-16 md:w-16 ${
              isPlaceholder
                ? 'cursor-not-allowed bg-black/8 text-black/30'
                : 'bg-[var(--color-ink)] text-white hover:bg-[var(--color-accent)]'
            }`}
          >
            {isPlaying ? (
              <Pause size={22} fill="currentColor" />
            ) : (
              <Play size={22} fill="currentColor" className="ml-1" />
            )}
          </button>

          <div className="flex-1">
            <div className="relative">
              <input
                type="range"
                min={0}
                max={duration || point.durationSec || 0}
                value={currentTime}
                step={0.1}
                onChange={handleScrub}
                disabled={isPlaceholder}
                aria-label="Scorri audio"
                aria-valuetext={`${formatTime(currentTime)} di ${formatTime(displayDuration)}`}
                className="w-full accent-[var(--color-ink)] disabled:opacity-40"
              />
              {/* progress fill visivo sotto il scrubber (Editorial Slow minimal) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 bottom-0 h-px bg-[var(--color-ink)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-eyebrow">
              <span>{formatTime(currentTime)}</span>
              <span className="text-black/55">
                {isPlaceholder ? 'In arrivo' : formatTime(displayDuration)}
              </span>
            </div>
          </div>
        </div>

        {/* Narratore + transcript toggle */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-5">
          <p className="text-eyebrow">
            Voce:{' '}
            <span className="text-[var(--color-ink)]">
              {point.narrator === 'rodrigo' ? 'Rodrigo' : 'Betta'}
            </span>
            {point.recordedAt !== 'pending' && <> · Registrato {point.recordedAt}</>}
          </p>
          <button
            type="button"
            onClick={handleTranscriptToggle}
            aria-expanded={showTranscript}
            className="inline-flex items-center gap-2 text-eyebrow text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
          >
            <FileText size={14} />
            {showTranscript ? 'Chiudi trascrizione' : 'Leggi trascrizione'}
          </button>
        </div>

        {/* Trascrizione (a11y + AI search citation) */}
        <AnimatePresence initial={false}>
          {showTranscript && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 rounded-[var(--radius-md)] bg-[var(--color-sand)] p-6 md:p-7">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <p className="text-eyebrow">Trascrizione</p>
                  <button
                    type="button"
                    onClick={handleTranscriptToggle}
                    aria-label="Chiudi trascrizione"
                    className="text-black/45 transition-colors hover:text-[var(--color-ink)]"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-body-editorial">{point.transcript}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* HTML5 audio element (hidden, controlled via state) */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      >
        <track kind="captions" label="Italiano" srcLang="it" default />
      </audio>
    </motion.div>
  );
}
