import { Link } from '@/src/components/TransitionLink';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import Button from './Button';
import OptimizedImage from './OptimizedImage';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string;
  category: string;
  onAddToCart: () => void;
  badgeLabel?: string;
  disableCart?: boolean;
  isBestseller?: boolean;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  imageUrl,
  category,
  onAddToCart,
  badgeLabel,
  disableCart = false,
  isBestseller = false,
}: ProductCardProps) {
  const productPath = `/shop/${slug || id}`;
  const responsiveWidths = imageUrl?.startsWith('/images/destinations/')
    ? [320, 480, 768]
    : undefined;

  return (
    <div className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-sm transition-colors duration-500 hover:border-[var(--color-accent)]/25 focus-within:border-[var(--color-accent)]/35">
      <div className="relative mb-6 aspect-4/5 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-muted-bg)]">
        <Link
          to={productPath}
          aria-label={`Apri la scheda di ${name}`}
          className="absolute inset-0 z-10"
        />
        {imageUrl ? (
          <OptimizedImage
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
            responsiveWidths={responsiveWidths}
            sizes="(max-width: 768px) 92vw, (max-width: 1024px) 45vw, 30vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-muted-fg)]">
            <ShoppingCart size={48} className="opacity-20" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-ink/10" />

        <div className="absolute top-5 left-5 z-20">
          <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black shadow-sm">
            {category}
          </span>
        </div>

        {badgeLabel && !isBestseller && (
          <div className="absolute top-5 right-5 z-20">
            <span className="rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
              {badgeLabel}
            </span>
          </div>
        )}

        <div className="absolute inset-0 z-30 flex translate-y-0 flex-col items-center justify-end gap-3 px-4 pb-5 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-100 transition-all duration-500 sm:justify-center sm:px-0 sm:pb-0 sm:bg-none sm:translate-y-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
          {!disableCart && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart();
              }}
              variant="primary"
              size="sm"
              className="w-[80%] bg-accent text-ink rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500"
            >
              Aggiungi
            </Button>
          )}
          <Link
            to={productPath}
            className="w-[80%] rounded-full bg-white py-2.5 text-center text-[10px] font-bold uppercase tracking-widest text-ink shadow-md transition-all duration-500 hover:bg-ink hover:text-white sm:scale-90 sm:group-hover:scale-100 sm:group-focus-within:scale-100"
          >
            Anteprima rapida
          </Link>
        </div>
      </div>

      <div className="flex flex-col flex-grow px-2 pb-2">
        <div className="flex items-start justify-between gap-4 mb-3">
          <Link to={productPath} className="flex-1">
            <h3 className="text-xl font-serif leading-tight group-hover:text-[var(--color-accent)] transition-colors duration-300">
              {name}
            </h3>
          </Link>
          <span className="text-sm font-bold text-[var(--color-accent)] whitespace-nowrap bg-[var(--color-sand)]/60 border border-black/5 px-3 py-1 rounded-xl">
            {formatPrice(price)}
          </span>
        </div>

        <Link
          to={productPath}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--color-muted-fg)] group-hover:text-ink transition-colors mt-auto"
        >
          Dettagli{' '}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
