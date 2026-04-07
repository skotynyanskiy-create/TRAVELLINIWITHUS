import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Smartphone, Map, CheckCircle, XCircle, Shield, Sparkles } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import Breadcrumbs from '../components/Breadcrumbs';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Button from '../components/Button';
import Section from '../components/Section';
import ProductSkeleton from '../components/ProductSkeleton';
import Newsletter from '../components/Newsletter';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../services/firebaseService';
import { siteContentDefaults } from '../config/siteContent';
import { DEMO_PRODUCT } from '../config/demoContent';
import { useSiteContent } from '../hooks/useSiteContent';
import { BRAND_STATS } from '../config/site';

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
}

const reasons = [
  {
    icon: <Sparkles className="text-accent" size={22} />,
    title: `${BRAND_STATS.yearsOfTravel} anni sul campo`,
    text: 'Non stiamo vendendo file decorativi. Stiamo raccogliendo ciò che ci ha aiutato davvero a viaggiare meglio.',
  },
  {
    icon: <Map className="text-accent" size={22} />,
    title: "Nati dall'esperienza",
    text: 'Guide e planner costruiti dopo aver vissuto quei luoghi in prima persona, non solo dopo averli cercati online.',
  },
  {
    icon: <Shield className="text-accent" size={22} />,
    title: 'Selezione stretta',
    text: 'Preferiamo pochi prodotti chiari e utili, invece di uno shop pieno di materiale generico.',
  },
];

export default function ShopWrapper() {
  return (
    <ErrorBoundary
      fallback={
        <div className="text-center py-20 text-red-500">Impossibile caricare i prodotti</div>
      }
    >
      <Shop />
    </ErrorBoundary>
  );
}

function Shop() {
  const { addToCart, setIsCartOpen, clearCart } = useCart();
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [sortBy, setSortBy] = useState('newest');

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
      if (fetchedProducts.length > 0) {
        return fetchedProducts as Product[];
      }

      return demoSettings.showShopDemo ? [DEMO_PRODUCT as Product] : [];
    },
  });

  const breadcrumbItems = [{ label: 'Shop' }];

  if (error) {
    throw new Error('Impossibile caricare i prodotti');
  }

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['Tutti', ...Array.from(cats)];
  }, [products]);
  const usingShopDemo = products.length === 1 && products[0]?.slug === DEMO_PRODUCT.slug;

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'Tutti') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

    return result;
  }, [products, selectedCategory, sortBy]);

  const handleAddToCart = (product: Product) => {
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
          title="Contenuti Premium"
          description="Guide premium, itinerari pronti, planner e contenuti pratici Travelliniwithus pensati per aiutarti a viaggiare meglio."
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
                className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center z-[160]"
              >
                {paymentStatus === 'success' ? (
                  <>
                    <div className="w-16 h-16 bg-[var(--color-accent)]/15 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="text-[var(--color-accent)]" size={32} />
                    </div>
                    <h3 className="text-2xl font-serif mb-2 text-zinc-900">Pagamento completato</h3>
                    <p className="text-zinc-600 mb-8">
                      Grazie per il tuo acquisto. Riceverai a breve i dettagli dell'ordine e le
                      istruzioni per accedere ai contenuti acquistati.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <XCircle className="text-red-600" size={32} />
                    </div>
                    <h3 className="text-2xl font-serif mb-2 text-zinc-900">Pagamento annullato</h3>
                    <p className="text-zinc-600 mb-8">
                      Il processo di pagamento è stato interrotto. Nessun addebito è stato
                      effettuato.
                    </p>
                  </>
                )}
                <button
                  onClick={() => setSearchParams({})}
                  className="w-full bg-ink text-white py-3 rounded-xl font-semibold hover:bg-[var(--color-ink)]/85 transition-colors"
                >
                  Chiudi
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Section className="pt-8">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="relative text-center max-w-5xl mx-auto mb-24 mt-8 p-12 md:p-20 bg-zinc-50/50 rounded-3xl border border-accent/10 shadow-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-accent)]/10 rounded-full blur-[100px] -mr-[250px] -mt-[250px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sand rounded-full blur-[100px] -ml-[250px] -mb-[250px] pointer-events-none"></div>

            <div className="relative z-10 flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-[var(--color-accent)]"></div>
              <span className="font-script text-xl text-[var(--color-accent-warm)]">
                Contenuti premium
              </span>
              <div className="w-12 h-[1px] bg-[var(--color-accent)]"></div>
            </div>
            <div className="relative mb-8 inline-block z-10">
              <h1 className="text-5xl font-serif leading-tight md:text-7xl">
                Strumenti per il viaggio <br />
                <span className="italic text-accent">che immagini</span>
              </h1>
              <motion.span
                initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                animate={{ opacity: 1, rotate: -5, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                aria-hidden="true"
                className="absolute -bottom-6 -right-16 font-script text-zinc-900/30 text-2xl md:text-3xl hidden sm:block"
              >
                pensati per partire meglio
              </motion.span>
            </div>
            <p className="text-lg text-zinc-600 font-light leading-relaxed mt-10 max-w-2xl mx-auto relative z-10">
              Queste guide e risorse nascono da {BRAND_STATS.yearsOfTravel} anni di viaggi reali.
              Non sono template generici. Ogni pagina è testata sul campo, ogni consiglio è
              autentico. Quando li usiamo noi, funzionano.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {reasons.map((item) => (
              <div
                key={item.title}
                className="bg-white p-8 rounded-4xl border border-black/5 shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-sand flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h2 className="text-xl font-serif mb-3">{item.title}</h2>
                <p className="text-black/60 font-light leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 bg-white/50 backdrop-blur-md p-6 rounded-4xl border border-black/5">
            <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 shrink-0 ml-2">
                Filtra
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-[var(--color-ink)] text-white border-[var(--color-ink)]'
                      : 'bg-white/50 text-black/40 border border-black/5 hover:border-accent/30 hover:bg-sand'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto shrink-0 pr-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 shrink-0">
                Ordina
              </span>
              <div className="relative flex-1 md:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white border border-black/5 text-[10px] font-bold uppercase tracking-widest text-zinc-700 py-3 px-6 rounded-full focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none cursor-pointer appearance-none pr-10 shadow-sm"
                  style={{
                    backgroundImage:
                      'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2318181b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px top 50%',
                    backgroundSize: '10px auto',
                  }}
                >
                  <option value="newest">In evidenza</option>
                  <option value="price-asc">Prezzo crescente</option>
                  <option value="price-desc">Prezzo decrescente</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">
              {filteredAndSortedProducts.length > 0 ? (
                filteredAndSortedProducts.map((product, idx) => {
                  // Editorial grid logic: some items are larger
                  const isLarge = idx === 0 && selectedCategory === 'Tutti';
                  return (
                    <div
                      key={product.id}
                      className={`${isLarge ? 'md:col-span-2 lg:col-span-8' : 'lg:col-span-4'}`}
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
                        isBestseller={
                          (product as Product & { isBestseller?: boolean }).isBestseller || isLarge
                        }
                        badgeLabel={
                          usingShopDemo && product.slug === DEMO_PRODUCT.slug
                            ? 'In arrivo'
                            : undefined
                        }
                      />
                    </div>
                  );
                })
              ) : products.length > 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-sm uppercase tracking-widest font-bold text-black/30 mb-2">
                    Nessun risultato
                  </p>
                  <p className="text-base font-normal text-black/65">
                    Prova a cambiare categoria o a rimuovere i filtri attivi.
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <div className="mt-12 rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.24em] font-bold text-accent">
                Shop pronto, catalogo ancora da inserire
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-base font-normal leading-relaxed text-black/70">
                Questa sezione è già pronta per ospitare i tuoi contenuti premium reali. Quando
                inserirai guide, itinerari, planner o raccolte curate, appariranno qui con la stessa
                struttura.
              </p>
            </div>
          )}

          <div className="relative mt-40 overflow-hidden rounded-[3.5rem] bg-ink p-12 text-white shadow-2xl md:p-24">
            <div className="absolute inset-0 bg-topo opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,164,124,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)]" />

            <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="max-w-4xl"
              >
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-px h-12 bg-linear-to-b from-accent to-transparent"></div>
                  <span className="font-script text-xl text-[var(--color-accent-warm)]">
                    Filosofia Travelliniwithus
                  </span>
                </div>
                <h2 className="text-5xl md:text-7xl font-serif mb-10 leading-[1.1]">
                  Strumenti nati <br />
                  <span className="italic text-white/50 font-light">dal movimento.</span>
                </h2>
                <p className="text-xl text-white/70 font-light leading-relaxed mb-12 max-w-xl">
                  Non offriamo template statici, ma distillati di esperienza. Ogni guida e ogni
                  planner è nato in viaggio, testato sul campo, pensato per aiutarti a partire
                  davvero preparato.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl bg-[#1C1C1C] border border-white/8">
                    <div className="w-12 h-12 bg-[var(--color-gold)]/10 rounded-2xl flex items-center justify-center mb-6">
                      <Smartphone className="text-[var(--color-gold)]" size={24} />
                    </div>
                    <h4 className="font-serif text-xl mb-3 text-white">Digital First</h4>
                    <p className="text-sm text-white/50 font-light leading-relaxed">
                      Ottimizzati per lo smartphone. Consulta i tuoi itinerari mentre sei in treno,
                      in aereo o cammini per la città.
                    </p>
                  </div>
                  <div className="p-8 rounded-3xl bg-[#1C1C1C] border border-white/8 text-white">
                    <div className="w-12 h-12 bg-[var(--color-gold)]/10 rounded-2xl flex items-center justify-center mb-6">
                      <Sparkles className="text-accent" size={24} />
                    </div>
                    <h4 className="font-serif text-xl mb-3">Qualità Editoriale</h4>
                    <p className="text-sm text-white/50 font-light leading-relaxed">
                      Cura editoriale da magazine di viaggio e praticità da guida tecnica. Niente
                      rumore, solo valore.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
                className="lg:col-span-5 relative mt-12 lg:mt-0"
              >
                <div className="rounded-3xl border border-white/10 bg-[#1C1C1C] p-8 shadow-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold)]/80">
                    Come nascono questi contenuti
                  </span>
                  <div className="mt-8 space-y-5">
                    {[
                      'Partiamo da un problema reale incontrato in viaggio, non da un format da riempire.',
                      'Tagliamo tutto quello che non aiuta a decidere o muoversi meglio.',
                      'Ogni prodotto deve essere leggibile da telefono, utile in fretta e facile da riaprire.',
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/5 p-5"
                      >
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--color-gold)]" />
                        <p className="text-sm font-light leading-relaxed text-white/72">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 rounded-2xl border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/10 p-6">
                    <p className="font-serif text-2xl leading-relaxed text-white">
                      Lo shop deve sembrare una continuazione del progetto editoriale, non un
                      reparto separato.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-32 bg-white rounded-3xl p-12 md:p-20 text-center border border-black/5">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Non trovi quello che cerchi?</h2>
            <p className="text-lg text-black/70 font-light max-w-2xl mx-auto mb-10">
              Scrivici direttamente — rispondiamo a ogni messaggio. Se hai una domanda specifica su
              un itinerario o vuoi capire quale contenuto fa per te, siamo qui.
            </p>
            <Button to="/contatti" variant="outline">
              Scrivici un messaggio
              <ArrowRight size={18} />
            </Button>
          </div>
        </Section>

        <Newsletter variant="white" />
      </>
    </PageLayout>
  );
}
