import { useState } from 'react';
import { Play } from 'lucide-react';
import OptimizedImage from '../../OptimizedImage';
import { REELS, getReelForPosto } from '../../../config/reels';
import type { DirectiveConfig, DirectiveNode } from './types';

/**
 * `:::reel{id="reel-praga-cinnamood"}` oppure `:::reel{posto="praga-dog-cafe"}`
 * — un reel del brand dentro l'articolo. Poster-first, mai autoplay: il video
 * si monta solo al tap (`preload="none"`, nessun `autoPlay`/`loop`).
 *
 * `ReelEntry` (`src/config/reels.ts`) non ha un campo `videoSrc` opzionale:
 * ogni entry ha `localPath` valorizzato, ma verificando `REELS` contro
 * `public/video/*.mp4` risultano 15 reel (tranche 2026-08-11, acquisiti via
 * yt-dlp) con cover reale ma senza il file mp4. Senza un segnale nei dati non
 * si puo' sapere in anticipo quali: il poster mostra il tasto play, e se il
 * video fallisce al caricamento (`onError`) il riquadro ripiega sul permalink
 * Instagram — stesso risultato richiesto, verificato a runtime invece che da
 * un campo statico che nel manifest non esiste.
 */
function toProps(directive: DirectiveNode): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  const attrs = directive.attributes || {};
  if (attrs.id) props['data-id'] = attrs.id;
  if (attrs.posto) props['data-posto'] = attrs.posto;
  directive.children = []; /* :::reel non ha corpo markdown: i dati arrivano dal manifest reel */
  return props;
}

function ReelDirective({
  'data-id': id,
  'data-posto': posto,
}: {
  'data-id'?: string;
  'data-posto'?: string;
}) {
  const reel = id
    ? REELS.find((entry) => entry.id === id)
    : posto
      ? getReelForPosto(posto)
      : undefined;
  const [playing, setPlaying] = useState(false);
  const [nonDisponibile, setNonDisponibile] = useState(false);

  if (!reel) {
    if (import.meta.env?.DEV) {
      console.warn(
        `[:::reel] nessun reel trovato per ${id ? `id="${id}"` : `posto="${posto ?? ''}"`}.`
      );
    }
    return null;
  }

  const stato: 'video' | 'link' | 'assente' | 'poster' = playing
    ? nonDisponibile
      ? reel.instagramUrl
        ? 'link'
        : 'assente'
      : 'video'
    : 'poster';

  return (
    <aside aria-label={`Reel: ${reel.hook}`} className="my-10 md:my-12 -mx-5 md:mx-0">
      <div className="overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-surface)] md:mx-auto md:max-w-[380px] md:rounded-[var(--radius-lg)] md:border">
        <div className="relative mx-auto aspect-[9/16] max-h-[70vh] w-full overflow-hidden bg-black md:max-h-[560px]">
          {stato === 'video' && (
            <video
              src={reel.localPath}
              poster={reel.cover}
              controls
              preload="none"
              playsInline
              onError={() => setNonDisponibile(true)}
              className="h-full w-full object-cover"
            >
              <track kind="captions" />
            </video>
          )}

          {stato === 'link' && (
            <a
              href={reel.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Guarda su Instagram ↗"
              className="group relative block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              <OptimizedImage
                src={reel.cover}
                alt=""
                aria-hidden="true"
                sizes="380px"
                responsiveWidths={[320, 480, 768]}
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/45">
                <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-white">
                  Guarda su Instagram ↗
                </span>
              </span>
            </a>
          )}

          {stato === 'assente' && (
            <div className="flex h-full w-full items-center justify-center bg-[var(--color-ink-deep)] p-6 text-center">
              <span className="text-xs text-white/70">Video non disponibile al momento.</span>
            </div>
          )}

          {stato === 'poster' && (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Guarda il reel: ${reel.hook}`}
              className="group relative block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              <OptimizedImage
                src={reel.cover}
                alt={reel.alt}
                sizes="380px"
                responsiveWidths={[320, 480, 768]}
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/10">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[var(--color-ink)] shadow-xl transition-transform group-hover:scale-110">
                  <Play size={22} className="ml-1 fill-current" aria-hidden="true" />
                </span>
              </span>
            </button>
          )}
        </div>
        <p className="px-4 py-3 font-serif text-[14px] italic leading-[1.5] text-[var(--color-ink-2)] md:text-[15px]">
          {reel.location}
        </p>
      </div>
    </aside>
  );
}

export const reelDirective: DirectiveConfig = {
  name: 'reel',
  hName: 'reel-directive',
  toProps,
  component: ReelDirective,
};
