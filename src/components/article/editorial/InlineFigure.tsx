interface InlineFigureProps {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  width?: number | string;
  height?: number | string;
}

export default function InlineFigure({
  src,
  alt,
  caption,
  credit,
  width,
  height,
}: InlineFigureProps) {
  const hasCaption = Boolean(caption || credit);

  return (
    <figure className="my-10 md:my-12">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="w-full rounded-[var(--radius-md)]"
      />
      {hasCaption && (
        <figcaption className="mt-3 max-w-prose">
          {caption && (
            <span className="font-serif italic text-[14px] md:text-[15px] leading-[1.5] text-[var(--color-ink-2)]">
              {caption}
            </span>
          )}
          {caption && credit && (
            <span className="text-[var(--color-muted-fg)]" aria-hidden="true">
              {' · '}
            </span>
          )}
          {credit && (
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted-fg)]">
              {credit}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
