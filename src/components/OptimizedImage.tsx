import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  sizes?: string;
  width?: number;
  height?: number;
  /** Enable warm color filter (disabled by default) */
  warm?: boolean;
  /** Prioritize loading for above-the-fold imagery (eager + fetchpriority high) */
  priority?: boolean;
}

const RESPONSIVE_WIDTHS = [400, 800, 1200, 1920, 2560];
const DEFAULT_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

interface UnsplashSources {
  avifSrcSet: string;
  webpSrcSet: string;
  jpegSrcSet: string;
  defaultSrc: string;
  lqipUrl: string;
}

/**
 * Unsplash CDN: genera srcSet separati per AVIF, WebP, JPEG.
 * L'utente del <picture> element sceglie il primo supportato dal browser.
 * Include anche LQIP (40px blur) come placeholder immediato.
 */
function getUnsplashSources(src: string): UnsplashSources {
  const baseUrl = src.replace(/[?&]w=\d+/, '').replace(/[?&]fm=\w+/, '').replace(/[?&]$/, '');
  const sep = baseUrl.includes('?') ? '&' : '?';
  const common = `${sep}auto=format&fit=crop&q=80`;

  const buildSrcSet = (fmt: string) =>
    RESPONSIVE_WIDTHS.map((w) => `${baseUrl}${common}&w=${w}${fmt ? `&fm=${fmt}` : ''} ${w}w`).join(', ');

  return {
    avifSrcSet: buildSrcSet('avif'),
    webpSrcSet: buildSrcSet('webp'),
    jpegSrcSet: buildSrcSet(''),
    defaultSrc: `${baseUrl}${common}&w=1200`,
    lqipUrl: `${baseUrl}${sep}w=40&blur=30&q=40&auto=format`,
  };
}

/** Firebase Storage: sfrutta l'extension image resize (file_200x200.jpg). No format transform. */
function getFirebaseSrcSet(src: string): { srcSet: string; defaultSrc: string } {
  const srcSet = RESPONSIVE_WIDTHS.map((w) => {
    const resized = src.replace(/(\.[a-z]+)(\?|$)/i, `_${w}x${w}$1$2`);
    return `${resized} ${w}w`;
  }).join(', ');
  return { srcSet, defaultSrc: src };
}

export default function OptimizedImage({
  src,
  alt = '',
  className,
  sizes,
  width,
  height,
  warm = false,
  priority = false,
  style,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);

  if (!src) return null;

  const isUnsplash = src.includes('unsplash.com');
  const isFirebase = src.includes('firebasestorage.googleapis.com');

  const warmClass = warm ? 'img-warm' : '';
  const blurClass = `img-blur-up ${loaded ? 'loaded' : ''}`;
  const imgClassName = `${blurClass} ${warmClass} ${className || ''}`.trim();

  const sharedImgProps = {
    alt,
    className: imgClassName,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    decoding: 'async' as const,
    fetchPriority: priority ? ('high' as const) : ('auto' as const),
    referrerPolicy: 'no-referrer' as const,
    width,
    height,
    onLoad: () => setLoaded(true),
    style,
    ...props,
  };

  const effectiveSizes = sizes || DEFAULT_SIZES;

  if (isUnsplash) {
    const { avifSrcSet, webpSrcSet, jpegSrcSet, defaultSrc, lqipUrl } = getUnsplashSources(src);
    // LQIP come background-image mentre l'immagine vera carica.
    // Rimosso una volta loaded per non occupare memoria.
    const lqipStyle: React.CSSProperties | undefined = loaded
      ? style
      : {
          ...style,
          backgroundImage: `url(${lqipUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };

    return (
      <picture>
        <source type="image/avif" srcSet={avifSrcSet} sizes={effectiveSizes} />
        <source type="image/webp" srcSet={webpSrcSet} sizes={effectiveSizes} />
        <img
          alt={alt}
          src={defaultSrc}
          srcSet={jpegSrcSet}
          sizes={effectiveSizes}
          {...sharedImgProps}
          style={lqipStyle}
        />
      </picture>
    );
  }

  if (isFirebase) {
    const { srcSet, defaultSrc } = getFirebaseSrcSet(src);
    return (
      <img
        alt={alt}
        src={defaultSrc}
        srcSet={srcSet}
        sizes={effectiveSizes}
        {...sharedImgProps}
      />
    );
  }

  return <img alt={alt} src={src} {...sharedImgProps} />;
}
