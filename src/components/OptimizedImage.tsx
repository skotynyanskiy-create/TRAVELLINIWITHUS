import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  sizes?: string;
  width?: number;
  height?: number;
  /** Disable the warm color filter (enabled by default) */
  warm?: boolean;
  /** Prioritize loading for above-the-fold imagery */
  priority?: boolean;
}

interface ResponsiveSources {
  srcSet: string;
  defaultSrc: string;
  avifSrcSet?: string;
}

/**
 * Generates responsive srcSet for supported CDN image sources.
 * Supports: Unsplash, Firebase Storage (via image resize extension).
 * Falls through for other sources.
 */
function getResponsiveSrcSet(src: string): ResponsiveSources | null {
  const widths = [400, 800, 1200, 1920, 2560];

  if (src.includes('unsplash.com')) {
    const baseUrl = src.replace(/[?&]w=\d+/, '').replace(/[?&]$/, '');
    const separator = baseUrl.includes('?') ? '&' : '?';

    const srcSet = widths
      .map((w) => `${baseUrl}${separator}w=${w}&auto=format&fit=crop&q=80 ${w}w`)
      .join(', ');

    const avifSrcSet = widths
      .map((w) => `${baseUrl}${separator}w=${w}&fm=avif&fit=crop&q=70 ${w}w`)
      .join(', ');

    const defaultSrc = `${baseUrl}${separator}w=1200&auto=format&fit=crop&q=80`;
    return { srcSet, defaultSrc, avifSrcSet };
  }

  if (src.includes('firebasestorage.googleapis.com')) {
    const srcSet = widths
      .map((w) => {
        const resizedUrl = src.replace(/(\.[a-z]+)(\?)/i, `_${w}x${w}$1$2`);
        return `${resizedUrl} ${w}w`;
      })
      .join(', ');

    return { srcSet, defaultSrc: src };
  }

  return null;
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
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);

  if (!src) return null;

  const responsive = getResponsiveSrcSet(src);
  const warmClass = warm ? 'img-warm' : '';
  const blurClass = `img-blur-up ${loaded ? 'loaded' : ''}`;
  const imgClassName = `${blurClass} ${warmClass} ${className || ''}`.trim();

  const sharedProps = {
    alt,
    className: imgClassName,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    decoding: 'async' as const,
    fetchPriority: priority ? ('high' as const) : ('auto' as const),
    referrerPolicy: 'no-referrer' as const,
    width,
    height,
    onLoad: () => setLoaded(true),
    ...props,
  };

  if (responsive) {
    const resolvedSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

    if (responsive.avifSrcSet) {
      return (
        <picture>
          <source type="image/avif" srcSet={responsive.avifSrcSet} sizes={resolvedSizes} />
          <img
            alt={alt}
            src={responsive.defaultSrc}
            srcSet={responsive.srcSet}
            sizes={resolvedSizes}
            {...sharedProps}
          />
        </picture>
      );
    }

    return (
      <img
        alt={alt}
        src={responsive.defaultSrc}
        srcSet={responsive.srcSet}
        sizes={resolvedSizes}
        {...sharedProps}
      />
    );
  }

  const localMatch = /^\/(?:images\/[^?#]+)\.(png|jpe?g)(\?[^#]*)?(#.*)?$/i.exec(src);
  if (localMatch) {
    const avifSrc = src.replace(/\.(png|jpe?g)(?=$|[?#])/i, '.avif');
    const webpSrc = src.replace(/\.(png|jpe?g)(?=$|[?#])/i, '.webp');
    return (
      <picture>
        <source type="image/avif" srcSet={avifSrc} />
        <source type="image/webp" srcSet={webpSrc} />
        <img alt={alt} src={src} {...sharedProps} />
      </picture>
    );
  }

  return <img alt={alt} src={src} {...sharedProps} />;
}
