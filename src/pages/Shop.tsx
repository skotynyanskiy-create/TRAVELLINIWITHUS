import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { ArrowRight, FileText, Map, Shield, Smartphone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import Breadcrumbs from '../components/Breadcrumbs';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Button from '../components/Button';
import Section from '../components/Section';
import ProductSkeleton from '../components/ProductSkeleton';
import ProductCard from '../components/ProductCard';
import DemoContentNotice from '../components/DemoContentNotice';
import FinalCtaSection from '../components/FinalCtaSection';
import { fetchProducts } from '../services/firebaseService';
import { trackEvent } from '../services/analytics';
import { BRAND_STATS, SITE_URL } from '../config/site';
import { DEMO_PRODUCTS } from '../config/demoContent';

const Newsletter = lazy(() => import('../components/Newsletter'));

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

export default function ShopWrapper() {
  return (
    <ErrorBoundary
      fallback={
        <div className="py-20 text-center text-[var(--color-error)]">
          Impossibile caricare i prodotti
        </div>
      }
    >
      <Shop />
    </ErrorBoundary>
  );
}

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    trackEvent('view_shop', { source: 'navigation' });
  }, []);

  const {
    data: products = [],
    error,
    isLoading,
  } = useQuery<Product[]>({
    queryKey: ['products', 'waitlist_mode'],
    queryFn: async () => {
      const fetchedProducts = await fetchProducts();
      if (fetchedProducts.length > 0) {
        return fetchedProducts as Product[];
      }
      return DEMO_PRODUCTS as Product[];
    },
  });

  if (error) {
    throw new Error('Impossibile caricare i prodotti');
  }

  // Forza sempre la modalità waitlist (disableCart = true) per escludere Stripe checkout
  const alwaysDisableCart = true;

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

  return (
    <PageLayout>
      <>
        <SEO
          title="Shop — guide e planner di viaggio"
          description="Lo Shop non è ancora aperto: stiamo scrivendo il primo planner di viaggio. Qui trovi le anteprime e la lista d'attesa per sapere quando esce."
          canonical={`${SITE_URL}/shop`}
          breadcrumbs={[
            { name: 'Home', url: SITE_URL },
            { name: 'Shop', url: `${SITE_URL}/shop` },
          ]}
        />

        <Section className="pt-8" spacing="tight">
          <Breadcrumbs items={[{ label: 'Shop' }]} />

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <span className="mb-3 block text-eyebrow !text-[var(--color-accent-text)]">Shop</span>
              <h1 className="text-display-1">
                Gli strumenti di viaggio{' '}
                <span className="italic text-black/55">stanno prendendo forma</span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/68">
                Prima di aprire la monetizzazione o vendite dirette preferiamo fare una cosa
                semplice: completare la stesura del nostro primo Planner cartaceo/digitale e
                renderlo eccezionale. Raccogliamo qui le manifestazioni di interesse per informarti
                al rilascio.
              </p>
            </div>

            <div className="border-t border-black/10 pt-7">
              <div className="mb-5 flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-[var(--color-accent)]" />
                <p className="text-eyebrow">Lancio in preparazione</p>
              </div>
              <p className="text-2xl font-serif leading-relaxed">
                Nessun carrello o pagamento Stripe attivo finché il Planner e le Guide non saranno
                pronti e testati per te.
              </p>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {shopPrinciples.map((item) => (
              <div key={item.title} className="border-t border-black/10 pt-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-sand)]">
                  {item.icon}
                </div>
                <h2 className="font-serif text-xl text-[var(--color-ink)]">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-black/60">{item.text}</p>
              </div>
            ))}
          </div>

          <DemoContentNotice
            className="mt-12"
            title="Shop in anteprima"
            message="Le schede qui sotto rappresentano i prodotti e planner in lista d'attesa. Iscriviti alla lista d'attesa per ricevere un avviso al lancio e le anteprime."
          />

          <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-black/5 bg-white/60 p-4 shadow-xs backdrop-blur-md transition-all duration-300 hover:bg-white/80 md:flex-row md:items-center md:justify-between md:p-6">
            <div className="flex min-w-0 items-center gap-3 overflow-x-auto pb-1 hide-scrollbar">
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.22em] text-black/60">
                Filtra
              </span>
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="relative whitespace-nowrap rounded-2xl px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] focus:outline-none transition-transform duration-200 active:scale-95 cursor-pointer"
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-2xl bg-[var(--color-ink)] shadow-md" />
                    )}
                    <span
                      className={`relative z-10 transition-colors duration-300 ${
                        isActive ? 'text-white font-bold' : 'text-black/65 hover:text-black/85'
                      }`}
                    >
                      {category}
                    </span>
                  </button>
                );
              })}
            </div>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Ordina i prodotti"
              className="rounded-2xl border border-black/5 bg-white/80 backdrop-blur-md px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/65 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] cursor-pointer hover:border-[var(--color-accent)]/30 transition-all"
            >
              <option value="featured">In evidenza</option>
              <option value="name">Nome</option>
              <option value="price-asc">Prezzo crescente</option>
              <option value="price-desc">Prezzo decrescente</option>
            </select>
          </div>

          <div id="shop-products" className="scroll-mt-28" />

          {isLoading ? (
            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
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
                      onAddToCart={() => {}}
                      disableCart={alwaysDisableCart}
                      isBestseller={false}
                      badgeLabel="Lista d'Attesa"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-12 rounded-[var(--radius-lg)] border border-black/5 bg-white p-10 text-center shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
                Anteprime in preparazione
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-black/65">
                Stiamo ultimando i file e le impaginazioni per i primi planner di viaggio. Iscriviti
                per ricevere un avviso non appena saranno pronti.
              </p>
              <Button to="/contatti" variant="outline" className="mt-8">
                Invia una richiesta
                <ArrowRight size={16} />
              </Button>
            </div>
          )}

          <div className="mt-20 bg-[var(--color-ink-deep)] p-8 text-white md:p-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center relative z-10">
              <div>
                <span className="mb-5 block text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-on-dark)]">
                  L'Approccio al Viaggio
                </span>
                <h2 className="text-4xl font-serif md:text-6xl">
                  Dal viaggio reale al formato utile.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/68 md:text-lg">
                  Dopo {BRAND_STATS.yearsOfTravel} anni di itinerari percorsi insieme, il nostro
                  valore non è ammucchiare informazioni: è selezionare indirizzi, attrazioni e
                  priorità e confezionarli in formati leggeri e operativi.
                </p>
              </div>
              <div className="border-t border-white/12 pt-7">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/15">
                  <Smartphone className="text-[var(--color-accent)]" size={24} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
                  Regola del Diario
                </p>
                <p className="mt-4 text-2xl font-serif leading-relaxed">
                  Se un'attrazione, alloggio o locale non è stato provato e amato da noi in prima
                  persona, non lo consiglieremo mai.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <Suspense
              fallback={
                <div className="min-h-[360px] rounded-[var(--radius-lg)] bg-[var(--color-ink)]" />
              }
            >
              {/* La copy e' esplicita qui invece che nella variante `business`
                  condivisa: il form diceva "Rimani vicino al progetto" mentre la
                  sua source e' shop_waitlist_first_product, e chi arrivava per una
                  lista d'attesa trovava una newsletter generica. */}
              <Newsletter
                variant="business"
                source="shop_waitlist_first_product"
                eyebrow="Lista d'attesa"
                title="La lista d'attesa del primo planner."
                description="Lasci la mail, ti scriviamo quando il planner è pronto e come averlo. Nient'altro."
                bullets={[
                  'Un avviso al rilascio, non prima.',
                  'Anteprime delle pagine mentre le finiamo.',
                  'Nessuna sequenza di vendita.',
                ]}
                ctaLabel="Entra nella lista d'attesa"
              />
            </Suspense>
          </div>

          <div className="mt-16">
            <FinalCtaSection intent="business" />
          </div>
        </Section>
      </>
    </PageLayout>
  );
}
