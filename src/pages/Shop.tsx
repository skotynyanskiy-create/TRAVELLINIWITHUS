import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  CheckCircle,
  FileText,
  Map,
  Shield,
  Sparkles,
  Smartphone,
  XCircle,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Breadcrumbs from '../components/Breadcrumbs';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Button from '../components/Button';
import Section from '../components/Section';
import ProductSkeleton from '../components/ProductSkeleton';
import Newsletter from '../components/Newsletter';
import ProductCard from '../components/ProductCard';
import DemoContentNotice from '../components/DemoContentNotice';
import FinalCtaSection from '../components/FinalCtaSection';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../services/firebaseService';
import { BRAND_STATS, SITE_URL } from '../config/site';
import { siteContentDefaults } from '../config/siteContent';
import { DEMO_PRODUCTS } from '../config/demoContent';
import { useSiteContent } from '../hooks/useSiteContent';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
  isDigital?: boolean;
  features?: string[];
  isBestseller?: boolean;
}

const shopPrinciples = [
  {
    icon: <Map className="text-[var(--color-accent)]" size={22} />,
    title: 'Nati dal viaggio',
    text: 'Guide, planner e toolkit devono nascere da problemi reali incontrati sul campo.',
  },
  {
    icon: <FileText className="text-[var(--color-accent)]" size={22} />,
    title: 'Pratici da usare',
    text: 'Il formato deve aiutarti prima e durante il viaggio, soprattutto da smartphone.',
  },
  {
    icon: <Shield className="text-[var(--color-accent)]" size={22} />,
    title: 'Pochi, non generici',
    text: 'Meglio pochi prodotti chiari che uno shop pieno di file senza identità.',
  },
];

export default function Shop() {
  const { addToCart, setIsCartOpen, clearCart } = useCart();
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [sortBy, setSortBy] = useState('featured');

  const paymentStatus: 'success' | 'canceled' | null = searchParams.get('success')
    ? 'success'
    : searchParams.get('canceled')
      ? 'canceled'
      : null;

  useEffect(() => {
    if (paymentStatus === 'success') {
      clearCart();
    }
  }, [paymentStatus, clearCart]);

  const {
    data: products = [],
    error,
    isLoading,
  } = useQuery<Product[]>({
    queryKey: ['products', demoSettings.showShopDemo],
    queryFn: async () => {
      const fetchedProducts = await fetchProducts();

      if (demoSettings.showShopDemo) {
        const existingSlugs = new Set(fetchedProducts.map((p) => p.slug));
        const demoOnly = (DEMO_PRODUCTS as Product[]).filter(
          (demo) => !existingSlugs.has(demo.slug),
        );
        return [...(fetchedProducts as Product[]), ...demoOnly];
      }

      if (fetchedProducts.length > 0) {
        return fetchedProducts as Product[];
      }

      return DEMO_PRODUCTS as Product[];
    },
  });

  if (error) {
    throw new Error('Impossibile caricare i prodotti');
  }

  const demoSlugs = new Set(DEMO_PRODUCTS.map((item) => item.slug));
  const usingShopDemo =
    products.length > 0 && products.every((product) => demoSlugs.has(product.slug));
  const categories = useMemo(() => {
    const cats = new Set(products.map((product) => product.category).filter(Boolean));
    return ['Tutti', ...Array.from(cats)];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'Tutti') {
      result = result.filter((product) => product.category === selectedCategory);
    }

    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return Number(b.isBestseller) - Number(a.isBestseller);
    });

    return result;
  }, [products, selectedCategory, sortBy]);

  const handleAddToCart = (product: Product) => {
    if (usingShopDemo) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      isDigital: product.isDigital,
    });
    setIsCartOpen(true);
  };

  return (
    <PageLayout>
      <>
        <SEO
          title="Shop editoriale"
          description="Guide premium, planner e toolkit Travelliniwithus pensati per organizzare viaggi con più criterio. Catalogo reale in preparazione."
          canonical={`${SITE_URL}/shop`}
          noindex={usingShopDemo || products.length === 0}
        />

        <AnimatePresence>
          {paymentStatus && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={() => setSearchParams({})}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                role="dialog"
                aria-modal="true"
                aria-label="Stato del pagamento"
                className="relative z-[160] w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
              >
                {paymentStatus === 'success' ? (
                  <>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/15">
                      <CheckCircle className="text-[var(--color-accent)]" size={32} />
                    </div>
                    <h3 className="mb-2 text-2xl font-serif text-zinc-900">Pagamento completato</h3>
                    <p className="mb-8 text-zinc-600">
                      Ordine ricevuto. Riceverai i dettagli e le istruzioni di accesso secondo il
                      flusso configurato.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                      <XCircle className="text-red-600" size={32} />
                    </div>
                    <h3 className="mb-2 text-2xl font-serif text-zinc-900">Pagamento annullato</h3>
                    <p className="mb-8 text-zinc-600">
                      Il processo è stato interrotto. Nessun addebito è stato effettuato.
                    </p>
                  </>
                )}
                <button
                  onClick={() => setSearchParams({})}
                  className="w-full rounded-xl bg-[var(--color-ink)] py-3 font-semibold text-white transition-colors hover:bg-[var(--color-ink)]/85"
                >
                  Chiudi
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Section className="pt-8" spacing="tight">
          <Breadcrumbs items={[{ label: 'Shop' }]} />

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
                  Boutique editoriale
                </span>
                <span className="rounded-full bg-[var(--color-accent)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                  Prossimamente
                </span>
              </div>
              <h1 className="text-display-1">
                Guide e toolkit <span className="italic text-black/55">per partire meglio</span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/68">
                Lo shop deve essere una continuazione del progetto editoriale: pochi prodotti,
                utili, leggibili da telefono e costruiti per ridurre incertezza prima del viaggio.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/55">
                Stiamo rifinendo i primi prodotti. Iscriviti alla newsletter qui sotto per essere
                avvisato appena lo shop apre.
              </p>
            </div>

            <div className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <Sparkles className="text-[var(--color-accent)]" size={22} />
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/42">
                  Standard minimo
                </p>
              </div>
              <p className="text-2xl font-serif leading-relaxed">
                Ogni prodotto deve risolvere una scelta reale: dove andare, come organizzare o cosa
                portare.
              </p>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {shopPrinciples.map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-sand)]">
                  {item.icon}
                </div>
                <h2 className="font-serif text-xl">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-black/60">{item.text}</p>
              </div>
            ))}
          </div>

          {usingShopDemo && (
            <DemoContentNotice
              className="mt-12"
              title="Boutique in apertura"
              message="Questi sono i prodotti in lavorazione: formato, copertine e sommari definiti, file e checkout in finalizzazione. Il carrello resta disabilitato finché ogni prodotto non è consegnabile."
            />
          )}

          <div className="mt-12 flex flex-col gap-4 rounded-[2rem] border border-black/5 bg-white/75 p-4 shadow-sm backdrop-blur-md md:flex-row md:items-center md:justify-between md:p-6">
            <div className="flex min-w-0 items-center gap-3 overflow-x-auto pb-1 hide-scrollbar">
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.22em] text-black/35">
                Filtra
              </span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                    selectedCategory === category
                      ? 'bg-[var(--color-ink)] text-white'
                      : 'bg-white text-black/50 hover:bg-[var(--color-sand)] hover:text-black/75'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-full border border-black/5 bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/55 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            >
              <option value="featured">In evidenza</option>
              <option value="name">Nome</option>
              <option value="price-asc">Prezzo crescente</option>
              <option value="price-desc">Prezzo decrescente</option>
            </select>
          </div>

          {isLoading ? (
            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <ProductSkeleton key={item} />
              ))}
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
              {filteredAndSortedProducts.map((product, index) => {
                const isLarge = index === 0 && selectedCategory === 'Tutti';

                return (
                  <div
                    key={product.id}
                    className={isLarge ? 'md:col-span-2 lg:col-span-8' : 'lg:col-span-4'}
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      price={product.price}
                      imageUrl={product.imageUrl}
                      category={product.category}
                      onAddToCart={() => handleAddToCart(product)}
                      disableCart={usingShopDemo}
                      isBestseller={product.isBestseller || (!usingShopDemo && isLarge)}
                      badgeLabel={usingShopDemo ? 'In arrivo' : undefined}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-12 rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
                Catalogo reale da inserire
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-black/65">
                Lo shop e pronto come struttura, ma non mostra prodotti acquistabili finche guide,
                file, prezzi e flusso Stripe non sono verificati.
              </p>
              <Button to="/contatti" variant="outline" className="mt-8">
                Scrivici per interesse
                <ArrowRight size={16} />
              </Button>
            </div>
          )}

          <div className="mt-20 overflow-hidden rounded-[3rem] bg-[var(--color-ink)] p-8 text-white md:p-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <span className="mb-5 block text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent)]">
                  Come nasceranno i prodotti
                </span>
                <h2 className="text-4xl font-serif md:text-6xl">
                  Dal viaggio reale al formato utile.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/68 md:text-lg">
                  Dopo {BRAND_STATS.yearsOfTravel} anni di viaggi, il valore non è aggiungere file:
                  è distillare decisioni, mappe, priorità e indirizzi in qualcosa che puoi usare in
                  fretta.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent)]/15">
                  <Smartphone className="text-[var(--color-accent)]" size={24} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                  Regola prodotto
                </p>
                <p className="mt-4 text-2xl font-serif leading-relaxed">
                  Se non è utile da consultare mentre stai decidendo o viaggiando, non entra nello
                  shop.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <Newsletter variant="business" source="shop_newsletter" />
          </div>

          <div className="mt-16">
            <FinalCtaSection intent="business" />
          </div>
        </Section>
      </>
    </PageLayout>
  );
}
