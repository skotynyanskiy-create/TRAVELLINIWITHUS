import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, FileText, Map, Shield, Smartphone } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/Button';
import Section from '../components/Section';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import DemoContentNotice from '../components/DemoContentNotice';
import { fetchProductBySlug } from '../services/firebaseService';
import { useCart } from '../context/CartContext';
import ProductPageSkeleton from '../components/ProductPageSkeleton';
import { Product } from '../types';
import { SITE_URL } from '../config/site';
import { DEMO_PRODUCTS } from '../config/demoContent';
import { siteContentDefaults } from '../config/siteContent';
import { useSiteContent } from '../hooks/useSiteContent';
import { formatPrice } from '../utils/format';

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

  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;

  const demoFallback = demoSettings.showShopDemo
    ? (DEMO_PRODUCTS.find((item) => item.slug === slug) as Product | undefined)
    : undefined;

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
    enabled: !!slug,
  });

  const product = fetchedProduct || demoFallback || null;
  const isDemoProduct = !fetchedProduct && Boolean(demoFallback);

  const handleAddToCart = () => {
    if (!product || isDemoProduct) return;

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
      <div className="min-h-screen bg-[var(--color-sand)] pt-32">
        <SEO
          title="Prodotto non disponibile"
          description="Questa scheda prodotto non è disponibile in questo momento."
          canonical={`${SITE_URL}/shop/${slug || ''}`}
          noindex
        />
        <Section>
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-sm">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-sand)] pt-32">
      <SEO
        title={product.name}
        description={
          product.description ||
          'Un contenuto premium Travelliniwithus pensato per aiutarti a organizzare meglio il viaggio.'
        }
        canonical={`${SITE_URL}/shop/${product.slug}`}
        image={product.imageUrl}
        noindex={isDemoProduct}
        product={{
          name: product.name,
          description: product.description,
          image: product.imageUrl,
          url: `${SITE_URL}/shop/${product.slug}`,
          price: product.price,
          availability: 'PreOrder',
          category: product.category,
          sku: product.id,
        }}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Shop', url: `${SITE_URL}/shop` },
          { name: product.name, url: `${SITE_URL}/shop/${product.slug}` },
        ]}
      />

      <Section className="pt-0 pb-0">
        <Breadcrumbs items={[{ label: 'Shop', href: '/shop' }, { label: product.name }]} />

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl md:aspect-[3/2] lg:aspect-[4/5]">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-end bg-[var(--color-accent-soft)] p-8">
                  <div className="w-full rounded-[2rem] border border-black/5 bg-white/80 p-6 backdrop-blur-md">
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
                  <span className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg">
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
                title="Prodotto preview"
                message="Questa scheda mostra la struttura futura dello shop. Il prodotto non è acquistabile finché file, prezzo, consegna e checkout non sono verificati."
              />
            )}

            <span className="mb-5 block text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              Boutique editoriale
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

            <div className="mb-12 space-y-4">
              {trustPoints.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h4 className="mb-1 text-xs font-bold uppercase tracking-widest">
                      {item.title}
                    </h4>
                    <p className="text-sm font-light text-black/48">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {isDemoProduct ? (
              <div className="rounded-2xl border border-[var(--color-accent)]/25 bg-white p-6">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                  In uscita prossimamente
                </div>
                <p className="mb-5 text-sm leading-relaxed text-black/65">
                  Quando la guida sarà pronta avviseremo via email chi è già in lista. Nessuno spam,
                  solo la notifica del lancio.
                </p>
                <Link
                  to={`/contatti?prodotto=${product.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
                >
                  Iscrivimi alla lista
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="h-16 w-full rounded-full shadow-2xl"
                onClick={handleAddToCart}
              >
                Aggiungi al carrello
              </Button>
            )}
          </motion.div>
        </div>
      </Section>

      {product.features && product.features.length > 0 && (
        <Section className="mt-28 rounded-[3rem] bg-white shadow-sm">
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
                  className="flex items-start gap-4 rounded-2xl border border-black/5 bg-[var(--color-sand)] p-6"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]" />
                  <p className="text-sm font-light leading-relaxed text-black/70">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section className="pt-12">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-[var(--color-ink)] p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent)]/15">
                <FileText className="text-[var(--color-accent)]" size={24} />
              </div>
              <h2 className="text-3xl font-serif md:text-5xl">Lo shop deve restare editoriale.</h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">
                Ogni prodotto deve essere utile, verificato e consegnabile. Se non è pronto, resta
                in preview.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-7 py-4 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:bg-white"
            >
              Torna allo shop
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
