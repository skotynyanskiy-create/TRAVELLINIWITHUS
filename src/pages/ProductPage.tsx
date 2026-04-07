import { motion } from 'motion/react';
import { Smartphone, Map, Shield, CheckCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/Button';
import Section from '../components/Section';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import { fetchProductBySlug } from '../services/firebaseService';
import { useCart } from '../context/CartContext';
import ProductPageSkeleton from '../components/ProductPageSkeleton';
import { Product } from '../types';
import { SITE_URL } from '../config/site';
import { siteContentDefaults } from '../config/siteContent';
import { DEMO_PRODUCT } from '../config/demoContent';
import { useSiteContent } from '../hooks/useSiteContent';

const trustPoints = [
  {
    icon: <Smartphone className="text-accent" size={20} />,
    title: 'Consultazione semplice',
    text: 'Pensato per essere letto al volo prima di partire e riaperto facilmente anche durante il viaggio.',
  },
  {
    icon: <Map className="text-accent" size={20} />,
    title: 'Uso reale, non decorativo',
    text: 'Ogni sezione nasce per aiutarti a scegliere, organizzare o muoverti meglio, non per fare scena.',
  },
  {
    icon: <Shield className="text-accent" size={20} />,
    title: 'Curato dal progetto',
    text: 'La struttura segue il modo Travelliniwithus di selezionare, ordinare e raccontare un viaggio.',
  },
];

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, setIsCartOpen } = useCart();
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;

  const {
    data: fetchedProduct,
    isLoading,
    error,
  } = useQuery<Product | null>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const fetchedProduct = await fetchProductBySlug(slug!);
      return fetchedProduct || null;
    },
    enabled: !!slug,
  });

  const product =
    fetchedProduct ||
    (demoSettings.showShopDemo && slug === DEMO_PRODUCT.slug ? (DEMO_PRODUCT as Product) : null);
  const isDemoProduct = !fetchedProduct && product?.slug === DEMO_PRODUCT.slug;

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
      <div className="min-h-screen bg-sand pt-32">
        <SEO
          title="Prodotto non disponibile"
          description="Questa scheda prodotto non è disponibile in questo momento."
          canonical={`${SITE_URL}/shop/${slug || ''}`}
          noindex
        />
        <Section>
          <div className="mx-auto max-w-3xl rounded-4xl border border-black/5 bg-white p-10 text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.24em] font-bold text-accent">
              Prodotto non disponibile
            </p>
            <h1 className="mt-4 text-4xl font-serif">Questa scheda non è disponibile</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed text-black/70">
              Il prodotto che stai cercando non è pubblico oppure non è ancora stato pubblicato.
              Puoi tornare alla sezione shop e continuare a esplorare i contenuti disponibili.
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
    <div className="min-h-screen bg-sand pt-32">
      <SEO
        title={product.name}
        description={
          product.description ||
          'Un contenuto premium Travelliniwithus pensato per aiutarti a organizzare meglio il viaggio.'
        }
        canonical={`${SITE_URL}/shop/${product.slug}`}
        noindex={isDemoProduct}
      />

      <Section className="pt-0 pb-0">
        <Breadcrumbs items={[{ label: 'Shop', href: '/shop' }, { label: product.name }]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mt-8">
          {/* IMAGE GALLERY */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="relative aspect-4/5 md:aspect-3/2 lg:aspect-4/5 rounded-3xl overflow-hidden bg-zinc-100 shadow-2xl group">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_top_right,rgba(196,164,124,0.30),transparent_28%),linear-gradient(180deg,#f5f2ed_0%,#efe8dd_42%,#e4d7c4_100%)] p-8">
                  <div className="w-full rounded-[2rem] border border-black/5 bg-white/70 p-6 backdrop-blur-md">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                      Travelliniwithus
                    </span>
                    <h2 className="mt-3 text-3xl font-serif leading-tight text-ink">
                      Contenuto digitale
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-black/60">
                      Scheda editoriale Travelliniwithus pensata per mantenere chiaro e leggibile il
                      prodotto anche quando non c&apos;è una cover fotografica dedicata.
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute top-8 left-8 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/95 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black shadow-lg backdrop-blur-md">
                  {product.category}
                </span>
                {product.isDigital && (
                  <span className="rounded-full border border-white/20 bg-black/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    Digitale
                  </span>
                )}
              </div>
            </div>

            {/* Sub-gallery: mostra solo se ci sono immagini reali */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {product.gallery.slice(0, 3).map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-2xl overflow-hidden bg-zinc-100 border border-black/5 hover:border-accent/30 transition-colors cursor-pointer"
                  >
                    <img
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* PRODUCT INFO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tighter leading-[1.05] mb-8">
              {product.name}
            </h1>

            <div className="mb-10 flex flex-wrap items-center gap-4">
              <div className="text-4xl font-serif text-accent">EUR {product.price.toFixed(2)}</div>
              <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/55">
                Contenuto curato da Travelliniwithus
              </span>
              {product.isDigital && (
                <span className="rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent-soft)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-text)]">
                  Accesso digitale dopo l&apos;acquisto
                </span>
              )}
            </div>

            <p className="text-xl font-light text-black/70 mb-10 leading-relaxed">
              {product.description ||
                'Il compagno digitale per organizzare, pianificare e rendere più chiaro ogni viaggio.'}
            </p>

            <div className="space-y-4 mb-12">
              {trustPoints.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="mt-1 text-accent">{item.icon}</div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest leading-none mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-black/40 font-light">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {isDemoProduct ? (
                <div className="w-full rounded-2xl border border-accent/20 bg-white px-8 py-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-accent">
                  In uscita prossimamente
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full rounded-full h-16 shadow-2xl"
                  onClick={handleAddToCart}
                >
                  Aggiungi al carrello
                </Button>
              )}
            </div>

            <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-widest text-black/30">
              Pagamento sicuro tramite Stripe
              {product.isDigital ? ' • contenuto disponibile in formato digitale' : ''}
            </p>
          </motion.div>
        </div>
      </Section>

      {product.features && product.features.length > 0 && (
        <Section className="bg-white rounded-[4rem] mt-32 shadow-sm border border-black/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif text-center mb-16">Dettagli Tecnici</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-sand border border-black/5"
                >
                  <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-black/70 text-sm leading-relaxed font-light">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* REVIEWS — mostrate solo quando ci sono dati reali */}

      {/* STICKY CTA BAR */}
      {!isDemoProduct && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-ink/90 backdrop-blur-xl border border-white/10 p-4 z-50 rounded-full flex justify-between items-center px-10 shadow-2xl"
        >
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 leading-none mb-1">
              Stai visualizzando
            </p>
            <h4 className="text-sm font-serif text-white truncate max-w-[200px]">{product.name}</h4>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-serif text-xl text-accent">EUR {product.price.toFixed(2)}</span>
            <Button
              variant="primary"
              size="sm"
              className="rounded-full h-12 px-8 min-w-[140px] shadow-lg"
              onClick={handleAddToCart}
            >
              Acquista ora
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
