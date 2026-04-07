import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../services/firebaseService';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';
import ProductCard from '../ProductCard';
import ProductSkeleton from '../ProductSkeleton';

export default function ShopPreview() {
  const { addToCart, setIsCartOpen } = useCart();

  const { data: shopProducts, isLoading: loadingProducts } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const fetched = await fetchProducts();
      return fetched.slice(0, 3);
    },
  });

  return (
    <section className="bg-ink py-16 md:py-20 text-white bg-topo">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="mb-12 md:flex md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 block font-script text-xl text-[var(--color-accent-warm)]">
              Le nostre guide
            </span>
            <h2 className="text-3xl font-serif leading-tight md:text-4xl">
              Guide pratiche per viaggiare meglio.
            </h2>
            <p className="mt-4 text-base font-normal text-white/85">
              Strumenti digitali per organizzare i tuoi viaggi, ottimizzare il budget e partire
              davvero preparato.
            </p>
          </div>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent-warm)] transition-transform hover:translate-x-1"
          >
            Vedi tutto lo Shop
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loadingProducts ? (
            [1, 2, 3].map((i) => <ProductSkeleton key={i} />)
          ) : shopProducts && shopProducts.length > 0 ? (
            shopProducts.map((product: Product, idx: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              >
                <ProductCard
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  category={product.category}
                  onAddToCart={() => {
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      imageUrl: product.imageUrl,
                      isDigital: product.isDigital,
                    });
                    setIsCartOpen(true);
                  }}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20">
                <ShoppingBag size={32} className="text-[var(--color-gold)]" />
              </div>
              <p className="text-xl font-serif text-white/70">Presto disponibile</p>
              <Link
                to="/shop"
                className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)] transition-colors hover:text-[var(--color-accent-warm)]"
              >
                Vai allo Shop <ArrowRight size={14} className="inline ml-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
