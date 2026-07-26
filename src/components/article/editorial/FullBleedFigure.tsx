interface FullBleedFigureProps {
  src: string;
  alt: string;
  ratio?: string;
  caption?: string;
  credit?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * Break-out figure. Sotto xl: full-bleed (w-screen, cap 1600px).
 * Sopra xl: rientra in colonna (la sidebar 320px convive → no glitch).
 */
export default function FullBleedFigure({
  src,
  alt,
  ratio = '16/9',
  caption,
  credit,
  width,
  height,
}: FullBleedFigureProps) {
  const hasCaption = Boolean(caption || credit);

  return (
    <figure className="my-16 md:my-20 w-screen max-w-[1600px] mx-[calc(50%-50vw)] xl:max-w-full xl:mx-0 xl:w-full">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        style={{ aspectRatio: ratio }}
        className="w-full object-cover xl:rounded-[var(--radius-md)]"
      />
      {hasCaption && (
        <div className="mx-auto max-w-3xl px-5 md:px-8 mt-4">
          <figcaption>
            {caption && (
              <span className="font-serif italic text-[15px] md:text-base leading-[1.5] text-[var(--color-ink-2)]">
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
        </div>
      )}
    </figure>
  );
}
