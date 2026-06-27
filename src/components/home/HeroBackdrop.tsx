import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface HeroBackdropProps {
  imageDesktop: string;
  imageMobile: string;
  /** Optional path under /public — e.g. `/videos/hero.webm`. Falls back to image silently if 404 or if reduced motion. */
  videoSrc?: string;
}

/**
 * Hero backdrop with optional silent video loop and graceful fallback.
 * - If `videoSrc` exists and the file resolves (HEAD ok), shows an autoplaying
 *   muted `<video>` overlaid on the photo poster. The image stays underneath
 *   so the first paint is never blank.
 * - If `videoSrc` is missing or unreachable, only the photo renders.
 * - If the user prefers reduced motion, the video is never loaded.
 */
export default function HeroBackdrop({ imageDesktop, imageMobile, videoSrc }: HeroBackdropProps) {
  const reducedMotion = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (!videoSrc || reducedMotion) return;
    let cancelled = false;
    fetch(videoSrc, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled && res.ok) setVideoReady(true);
      })
      .catch(() => {
        // silent: image fallback already in DOM
      });
    return () => {
      cancelled = true;
    };
  }, [videoSrc, reducedMotion]);

  const toFmt = (src: string, ext: 'avif' | 'webp') =>
    src.replace(/\.(png|jpe?g|webp)(?=$|[?#])/i, `.${ext}`);
  const mobAvif = toFmt(imageMobile, 'avif');
  const mobWebp = toFmt(imageMobile, 'webp');
  const deskAvif = toFmt(imageDesktop, 'avif');
  const deskWebp = toFmt(imageDesktop, 'webp');

  return (
    <div data-hero-image className="absolute inset-0 z-0">
      <picture>
        <source media="(max-width: 768px)" type="image/avif" srcSet={mobAvif} />
        <source media="(max-width: 768px)" type="image/webp" srcSet={mobWebp} />
        <source media="(max-width: 768px)" srcSet={imageMobile} />
        <source type="image/avif" srcSet={deskAvif} />
        <source type="image/webp" srcSet={deskWebp} />
        <img
          src={imageDesktop}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          width={1024}
          height={1024}
          className="h-full w-full object-cover object-center brightness-[0.96]"
          referrerPolicy="no-referrer"
        />
      </picture>
      {videoReady && videoSrc && !reducedMotion && (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          poster={imageDesktop}
          aria-hidden="true"
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover object-center"
          onError={() => setVideoReady(false)}
        />
      )}
    </div>
  );
}
