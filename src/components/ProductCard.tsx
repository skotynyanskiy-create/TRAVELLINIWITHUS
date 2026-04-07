import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import Button from './Button';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col h-full bg-white rounded-4xl p-4 border border-black/5 hover:border-accent/20 hover:shadow-2xl transition-all duration-700"
    >
      <div className="relative mb-6 aspect-4/5 overflow-hidden rounded-4xl bg-zinc-100">
        <Link
          to={productPath}
          aria-label={`Apri la scheda di ${name}`}
          className="absolute inset-0 z-10"
        />
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:blur-[2px]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <ShoppingCart size={48} className="opacity-20" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/20" />

        <div className="absolute top-5 left-5 z-20">
          <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold text-black shadow-sm">
            {category}
          </span>
        </div>

        {isBestseller && (
          <div className="absolute top-5 right-5 z-20">
            <span className="rounded-full bg-ink px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-accent shadow-lg border border-accent/30">
              Bestseller
            </span>
          </div>
        )}

        {badgeLabel && !isBestseller && (
          <div className="absolute top-5 right-5 z-20">
            <span className="rounded-full bg-accent px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
              {badgeLabel}
            </span>
          </div>
        )}

        <div className="absolute inset-0 z-30 flex translate-y-4 flex-col items-center justify-center gap-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
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
            className="w-[80%] bg-white/95 backdrop-blur-md text-ink py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-center shadow-lg hover:bg-ink hover:text-white transition-all scale-90 group-hover:scale-100 duration-500"
          >
            Anteprima rapida
          </Link>
        </div>
      </div>

      <div className="flex flex-col flex-grow px-2 pb-2">
        <div className="flex items-start justify-between gap-4 mb-3">
          <Link to={productPath} className="flex-1">
            <h3 className="text-xl font-serif leading-tight group-hover:text-accent transition-colors duration-300">
              {name}
            </h3>
          </Link>
          <span className="text-sm font-bold text-accent whitespace-nowrap bg-sand px-3 py-1 rounded-lg">EUR {price.toFixed(2)}</span>
        </div>

        <Link
          to={productPath}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400 group-hover:text-ink transition-colors mt-auto"
        >
          Dettagli <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
