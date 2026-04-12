import { motion } from 'motion/react';
import { Star, Smartphone, Map, Shield, CheckCircle } from 'lucide-react';
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
    title: 'Formato chiaro',
    text: 'Pensato per essere consultato facilmente prima della partenza e anche durante il viaggio.',
  },
  {
    icon: <Map className="text-accent" size={20} />,
    title: 'Orientato all\'uso reale',
    text: 'Non un contenuto decorativo, ma un supporto pratico per organizzare meglio il viaggio.',
  },
  {
    icon: <Shield className="text-accent" size={20} />,
    title: 'Curato dal progetto',
    text: 'Nasce dal modo Travelliniwithus di selezionare, organizzare e raccontare i viaggi.',
  },
];

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, setIsCartOpen } = useCart();
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;

  const { data: fetchedProduct, isLoading, error } = useQuery<Product | null>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const fetchedProduct = await fetchProductBySlug(slug!);
      return fetchedProduct || null;
    },
    enabled: !!slug,
  });

  const product =
    fetchedProduct || (demoSettings.showShopDemo && slug === DEMO_PRODUCT.slug ? (DEMO_PRODUCT as Product) : null);
  const isDemoProduct = !fetchedProduct && product?.slug === DEMO_PRODUCT.slug;

  const handleAddToCart = () => {
    if (!product || isDemoProduct) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
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
              Il prodotto che stai cercando non è pubblico oppure non è ancora stato pubblicato. Puoi tornare alla
              sezione shop e continuare a esplorare i contenuti disponibili.
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
        description={product.description || 'Un contenuto premium Travelliniwithus pensato per aiutarti a organizzare meglio il viaggio.'}
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
              <img
                // TODO(@travelliniwithus): PLACEHOLDER — servono foto fallback prodotto shop
                src={product.imageUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-8 left-8">
                <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-black shadow-lg">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Sub-gallery: mostra solo se ci sono immagini reali */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {product.gallery.slice(0, 3).map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-zinc-100 border border-black/5 hover:border-accent/30 transition-colors cursor-pointer">
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
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
            
            <div className="flex items-center gap-6 mb-10">
               <div className="text-4xl font-serif text-accent">EUR {product.price.toFixed(2)}</div>
               <div className="h-8 w-px bg-black/10"></div>
               <div className="flex items-center gap-1">
                 {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-accent text-accent" />)}
                 <span className="text-[10px] font-bold uppercase tracking-widest text-black/30 ml-2">4.9 (24)</span>
               </div>
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
                      <h4 className="text-xs font-bold uppercase tracking-widest leading-none mb-1">{item.title}</h4>
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
                <Button variant="primary" size="lg" className="w-full rounded-full h-16 shadow-2xl" onClick={handleAddToCart}>
                  Aggiungi al carrello
                </Button>
              )}
            </div>
            
            <p className="mt-6 text-[10px] text-center text-black/30 uppercase tracking-widest font-bold">
              Pagamento sicuro tramite Stripe &bull; Download istantaneo
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
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 leading-none mb-1">Stai visualizzando</p>
            <h4 className="text-sm font-serif text-white truncate max-w-[200px]">{product.name}</h4>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-serif text-xl text-accent">EUR {product.price.toFixed(2)}</span>
            <Button variant="primary" size="sm" className="rounded-full h-12 px-8 min-w-[140px] shadow-lg" onClick={handleAddToCart}>
              Acquista ora
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
