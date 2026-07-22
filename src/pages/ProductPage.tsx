import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, FileText, Map, Shield, Smartphone } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/Button';
import PageLayout from '../components/PageLayout';
import Section from '../components/Section';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import StickyMobileCTA from '../components/StickyMobileCTA';
import DemoContentNotice from '../components/DemoContentNotice';
import { fetchProductBySlug } from '../services/firebaseService';
import { useCart } from '../context/CartContext';
import ProductPageSkeleton from '../components/ProductPageSkeleton';
import { Product } from '../types';
import { SITE_URL } from '../config/site';
import { DEMO_PRODUCTS } from '../config/demoContent';
import { formatPrice } from '../utils/format';
import { trackEvent } from '../services/analytics';

const trustPoints = [
  {
    icon: <Smartphone className="text-[var(--color-accent)]" size={20} />,
    title: 'Consultazione semplice',
    text: 'Pensato per essere letto prima di partire e riaperto facilmente anche durante il viaggio.',
  },
  {
    icon: <Map className="text-[var(--color-accent)]" size={20} />,
    title: 'Uso reale',
    text: 'Ogni sezione deve aiutare a scegliere, organizzare o muoversi meglio.',
  },
  {
    icon: <Shield className="text-[var(--color-accent)]" size={20} />,
    title: 'Curato dal progetto',
    text: 'La struttura segue il metodo Travelliniwithus: meno rumore, più decisioni utili.',
  },
];

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, setIsCartOpen } = useCart();

  const demoFallback = DEMO_PRODUCTS.find((item) => item.slug === slug) as Product | undefined;

  const {
    data: fetchedProduct,
    isLoading,
    error,
  } = useQuery<Product | null>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const product = await fetchProductBySlug(slug!);
      return product || null;
    },
    enabled: !!slug && !demoFallback,
  });

  const product = fetchedProduct || demoFallback || null;
  const isDemoProduct = !fetchedProduct && Boolean(demoFallback);

  useEffect(() => {
    if (!product) return;
    trackEvent('product_view', {
      route: `/shop/${product.slug}`,
      source: 'product_page',
      content_id: product.id,
      product_slug: product.slug,
      demo: isDemoProduct,
    });
  }, [isDemoProduct, product]);

  const handleAddToCart = () => {
    if (!product || isDemoProduct) return;

    trackEvent('checkout_intent', {
      route: `/shop/${product.slug}`,
      source: 'product_page',
      cta_id: 'product_add_to_cart',
      content_id: product.id,
      product_slug: product.slug,
      value: product.price,
      currency: 'EUR',
    });

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      isDigital: product.isDigital,
    });
    setIsCartOpen(true);
  };

  if (isLoading) return <ProductPageSkeleton />;

  if (error || !product) {
    return (
      <PageLayout>
        <SEO
          title="Prodotto non disponibile"
          description="Questa scheda prodotto non è disponibile in questo momento."
          canonical={`${SITE_URL}/shop/${slug || ''}`}
          noindex
        />
        <Section>
          <div className="mx-auto max-w-3xl rounded-[var(--radius-lg)] border border-black/5 bg-white p-10 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
              Prodotto non disponibile
            </p>
            <h1 className="mt-4 text-4xl font-serif">Questa scheda non è disponibile</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-black/70">
              Il prodotto che stai cercando non è pubblico oppure non è ancora stato pubblicato.
              Puoi tornare allo shop e continuare a esplorare i contenuti disponibili.
            </p>
            <div className="mt-8">
              <Button to="/shop" variant="primary" size="lg">
                Torna allo shop
              </Button>
            </div>
          </div>
        </Section>
      </PageLayout>
    );
  }

  const productUrl = `${SITE_URL}/shop/${product.slug}`;
  const productJsonLd = isDemoProduct
    ? null
    : {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description:
          product.description ||
          'Un contenuto premium Travelliniwithus pensato per aiutarti a organizzare meglio il viaggio.',
        image: product.imageUrl ? [product.imageUrl] : undefined,
        category: product.category,
        sku: product.id,
        brand: { '@type': 'Brand', name: 'Travelliniwithus' },
        offers: {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: 'EUR',
          price: product.price,
          availability: 'https://schema.org/InStock',
        },
      };

  return (
    <PageLayout>
      <SEO
        title={product.name}
        description={
          product.description ||
          'Un contenuto premium Travelliniwithus pensato per aiutarti a organizzare meglio il viaggio.'
        }
        canonical={productUrl}
        image={product.imageUrl}
        noindex={isDemoProduct}
      />
      {productJsonLd && <JsonLd data={productJsonLd} />}

      <Section className="pt-0 pb-0">
        <Breadcrumbs items={[{ label: 'Shop', href: '/shop' }, { label: product.name }]} />

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="group lg:col-span-7"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl md:aspect-[3/2] lg:aspect-[4/5]">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-end bg-[var(--color-accent-soft)] p-8">
                  <div className="w-full rounded-2xl border border-black/5 bg-white/70 p-6 backdrop-blur-md">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                      Travelliniwithus
                    </span>
                    <h2 className="mt-3 text-3xl font-serif leading-tight text-[var(--color-ink)]">
                      Contenuto digitale
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-black/60">
                      Scheda editoriale pensata per mantenere chiaro il prodotto anche prima della
                      cover fotografica definitiva.
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute left-8 top-8 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/95 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black shadow-lg backdrop-blur-md">
                  {product.category}
                </span>
                {product.isDigital && (
                  <span className="rounded-full border border-white/20 bg-black/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    Digitale
                  </span>
                )}
                {isDemoProduct && (
                  <span className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg animate-pulse">
                    In arrivo
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex flex-col justify-center lg:col-span-5"
          >
            {isDemoProduct && (
              <DemoContentNotice
                className="mb-8"
                title="Prodotto in preparazione"
                message="Questa scheda presenta formato, promessa e contenuto previsto. Il prodotto non è acquistabile finché file, prezzo, consegna e checkout non sono verificati."
              />
            )}

            <span className="mb-5 block text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              Shop
            </span>
            <h1 className="mb-8 text-5xl font-serif font-light leading-[1.05] tracking-tighter md:text-7xl">
              {product.name}
            </h1>

            <div className="mb-10 flex flex-wrap items-center gap-4">
              <div className="text-4xl font-serif text-[var(--color-accent-text)]">
                {formatPrice(product.price)}
              </div>
              <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/55">
                Contenuto curato
              </span>
            </div>

            <p className="mb-10 text-xl font-light leading-relaxed text-black/70">
              {product.description ||
                'Il compagno digitale per organizzare, pianificare e rendere più chiaro ogni viaggio.'}
            </p>

            <div className="mb-12 rounded-2xl border border-black/5 bg-white/70 backdrop-blur-md p-6 space-y-5">
              {trustPoints.map((item) => (
                <div key={item.title} className="group/trust flex items-start gap-4">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] transition-transform duration-500 group-hover/trust:scale-110 group-hover/trust:rotate-6">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="mb-1 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors duration-300 group-hover/trust:text-[var(--color-accent)]">
                      {item.title}
                    </h4>
                    <p className="text-sm font-light leading-relaxed text-black/60">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {isDemoProduct ? (
              <div className="rounded-2xl border border-black/5 bg-white/80 backdrop-blur-md p-6 shadow-sm">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                  In uscita prossimamente
                </div>
                <p className="mb-5 text-sm leading-relaxed text-black/65">
                  Quando la guida sarà pronta avviseremo via email chi è già in lista. Nessuno spam,
                  solo la notifica del lancio.
                </p>
                <Button
                  to={`/contatti?prodotto=${product.slug}`}
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                  magnetic={true}
                >
                  Iscrivimi alla lista <ArrowRight size={14} />
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="h-16 w-full rounded-2xl shadow-xl hover:shadow-2xl shadow-[var(--color-accent)]/10 transition-all duration-300"
                onClick={handleAddToCart}
                magnetic={true}
              >
                Aggiungi al carrello
              </Button>
            )}
          </motion.div>
        </div>
      </Section>

      {product.features && product.features.length > 0 && (
        <Section className="mt-28 rounded-3xl bg-[var(--color-sand)]/30 border border-black/5 p-12 shadow-xs">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
                Dentro il contenuto
              </span>
              <h2 className="mt-4 text-4xl font-serif">Cosa troverai</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {product.features.map((feature) => (
                <div
                  key={feature}
                  className="group/feature flex items-start gap-4 rounded-2xl border border-black/5 bg-white/70 backdrop-blur-md p-6 shadow-sm hover:shadow-[var(--shadow-premium)] hover:bg-white/95 hover:-translate-y-1 transition-all duration-300"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)] transition-transform duration-500 group-hover/feature:rotate-12 group-hover/feature:scale-110" />
                  <p className="text-sm font-light leading-relaxed text-black/70">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {isDemoProduct ? (
        <StickyMobileCTA
          label="Iscrivimi alla lista"
          to={`/contatti?prodotto=${product.slug}`}
          trackingId={`shop_${product.slug}_sticky_waitlist`}
        />
      ) : (
        <StickyMobileCTA
          label="Aggiungi al carrello"
          onClick={handleAddToCart}
          trackingId={`shop_${product.slug}_sticky_cart`}
        />
      )}

      <Section className="pt-12">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[var(--color-ink-deep)] p-8 text-white md:p-12 border border-white/5 shadow-[var(--shadow-premium)]">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[var(--color-accent)]/5 blur-3xl pointer-events-none" />
          <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-sm">
                <FileText size={24} />
              </div>
              <h2 className="text-3xl font-serif md:text-5xl leading-tight">
                Lo shop deve restare editoriale.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
                Ogni prodotto deve essere utile, verificato e consegnabile. Se non è pronto, resta
                in lista d'attesa.
              </p>
            </div>
            <Button
              to="/shop"
              variant="primary"
              size="lg"
              className="bg-[var(--color-accent)] hover:brightness-110"
              magnetic={true}
            >
              Torna allo shop <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
