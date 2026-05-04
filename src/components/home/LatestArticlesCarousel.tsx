import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import { formatDateValue, type DateValue } from '../../utils/dateValue';

export interface CarouselArticle {
  id: string;
  title: string;
  category: string;
  image: string;
  slug: string;
  readTime?: string;
  createdAt?: DateValue;
  excerpt?: string;
}

interface LatestArticlesCarouselProps {
  articles: CarouselArticle[];
}

export default function LatestArticlesCarousel({ articles }: LatestArticlesCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    dragFree: false,
    skipSnaps: false,
    containScroll: 'trimSnaps',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    // Sync once after mount via microtask so it stays out of the effect body.
    queueMicrotask(onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollNext();
    }
  };

  return (
    <div
      className="relative"
      role="region"
      aria-label="Carosello articoli editoriali"
      aria-roledescription="carousel"
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4 md:gap-6">
          {articles.map((article, idx) => (
            <article
              key={article.id}
              className="flex-[0_0_85%] md:flex-[0_0_48%] lg:flex-[0_0_32%]"
            >
              <Link
                to={`/articolo/${article.slug || article.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/8 bg-white transition-shadow duration-500 hover:shadow-[0_24px_60px_-20px_rgba(17,17,17,0.25)]"
                style={{ viewTransitionName: `article-${article.slug || article.id}` }}
              >
                <div
                  className={`relative overflow-hidden ${idx === 0 ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}
                >
                  <OptimizedImage
                    src={article.image}
                    alt={article.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-accent-soft)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-ink backdrop-blur-md">
                      {article.category}
                    </span>
                    {article.readTime && (
                      <span className="rounded-lg bg-[var(--color-accent)]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                        <Clock size={10} className="mr-1 inline" />
                        {article.readTime}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-black/40">
                    <Calendar size={12} className="text-[var(--color-accent)]" />
                    {formatDateValue(article.createdAt)}
                  </div>
                  <h3
                    className="font-serif leading-[1.12] text-ink transition-colors group-hover:text-[var(--color-accent)]"
                    style={{
                      fontSize: idx === 0 ? 'clamp(1.5rem, 2vw + 1rem, 2.25rem)' : '1.25rem',
                    }}
                  >
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-black/64">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="mt-auto inline-flex items-center gap-2 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink transition-colors group-hover:text-[var(--color-accent)]">
                    Leggi l'articolo
                    <ArrowRight
                      size={12}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {scrollSnaps.length > 1 && (
        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex gap-1.5">
            {scrollSnaps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollTo(idx)}
                aria-label={`Vai allo slide ${idx + 1}`}
                aria-current={idx === selectedIndex}
                className={`h-1.5 rounded-full transition-all ${
                  idx === selectedIndex
                    ? 'w-8 bg-[var(--color-accent)]'
                    : 'w-4 bg-black/15 hover:bg-black/30'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              onKeyDown={handleButtonKeyDown}
              disabled={!canScrollPrev}
              aria-label="Articolo precedente"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-ink transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-30 disabled:hover:border-black/10 disabled:hover:text-ink"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              onKeyDown={handleButtonKeyDown}
              disabled={!canScrollNext}
              aria-label="Articolo successivo"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-ink transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-30 disabled:hover:border-black/10 disabled:hover:text-ink"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
