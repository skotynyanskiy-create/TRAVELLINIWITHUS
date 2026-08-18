import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, LogIn, MapPin, Heart, ShoppingBag, LogOut } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { fetchArticles, fetchUserOrders, type Order } from '../services/firebaseService';
import SEO from '../components/SEO';
import PageLayout from '../components/PageLayout';
import OptimizedImage from '../components/OptimizedImage';
import Button from '../components/Button';
import ClubSkeleton from '../components/ClubSkeleton';
import ClubMembershipHero from '../components/club/ClubMembershipHero';
import ClubPreviewLock from '../components/club/ClubPreviewLock';
import ClubFaq from '../components/club/ClubFaq';
import StickyMobileCTA from '../components/StickyMobileCTA';
import { SITE_URL } from '../config/site';
import type { NormalizedArticle } from '../utils/articleData';

export default function Club() {
  const { user, loading, signIn, signOut } = useAuth();
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState<'favorites' | 'purchases'>('favorites');

  const favoritesQuery = useQuery<NormalizedArticle[]>({
    queryKey: ['club', 'favorites', user?.uid, favorites],
    enabled: !!user && activeTab === 'favorites' && favorites.length > 0,
    queryFn: async () => {
      const allArticles = await fetchArticles();
      return allArticles.filter((article) => favorites.includes(article.slug || article.id));
    },
  });

  const ordersQuery = useQuery<Order[]>({
    queryKey: ['club', 'orders', user?.uid, user?.email],
    enabled: !!user && activeTab === 'purchases',
    queryFn: async () => fetchUserOrders({ uid: user?.uid, email: user?.email }),
  });

  const savedArticles = favoritesQuery.data ?? [];
  const orders = ordersQuery.data ?? [];
  const isLoadingData =
    activeTab === 'favorites'
      ? favorites.length > 0 && favoritesQuery.isLoading
      : ordersQuery.isLoading;

  if (loading) {
    return <ClubSkeleton />;
  }

  if (!user) {
    return (
      <PageLayout>
        <SEO
          title="Travellini Club — il club di chi viaggia in Italia con noi"
          description="Una piccola quota per tutte le guide. Itinerari aggiornati, anteprime, archivio. Pensato per chi viaggia spesso e vuole leggere meno rumore."
          canonical={`${SITE_URL}/club`}
          breadcrumbs={[
            { name: 'Home', url: SITE_URL },
            { name: 'Club', url: `${SITE_URL}/club` },
          ]}
        />
        <ClubMembershipHero />
        <ClubPreviewLock />
        <ClubFaq />
        <StickyMobileCTA
          label="Avvisami al lancio"
          href="#club-waitlist"
          trackingId="club_waitlist_sticky_mobile"
          revealAfter={-1}
        />
        <div className="bg-[var(--color-sand)]/50 py-20 px-4 flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg w-full border-y border-black/10 bg-white/70 px-6 py-10 text-center md:px-10 md:py-14"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-[var(--color-accent-soft)] flex items-center justify-center mb-8">
              <MapPin size={24} className="text-[var(--color-accent)]" />
            </div>
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Area personale
            </span>
            <h2 className="text-4xl font-serif text-[var(--color-ink)] mb-3">
              Entra nel tuo spazio.
            </h2>
            <p className="text-base font-normal text-black/70 mb-8 leading-relaxed font-light">
              Un login veloce, e ritrovi qui preferiti, acquisti e le future guide riservate quando
              il Club apre.
            </p>

            <div className="space-y-3 mb-10 text-left">
              {[
                {
                  label: 'Salva gli articoli',
                  text: 'Tieni da parte gli itinerari che vuoi vivere — restano qui, pronti.',
                },
                {
                  label: 'I tuoi acquisti',
                  text: 'Accedi e scarica subito le guide premium che hai comprato.',
                },
                {
                  label: 'Sincronizzato ovunque',
                  text: 'Tutto disponibile su ogni dispositivo, sempre.',
                },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-start gap-4 border-t border-black/10 px-1 py-4"
                >
                  <CheckCircle size={18} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-[var(--color-ink)]">{b.label}</p>
                    <p className="text-xs font-light text-[var(--color-ink)]/50 mt-0.5 leading-relaxed">
                      {b.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={signIn}
              magnetic={true}
              className="w-full bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink)]/85 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogIn size={20} className="mr-3" />
              Accedi con Google
            </Button>
            <p className="mt-6 text-xs text-black/60 font-light">
              Accesso rapido, nessun form noioso da compilare.
            </p>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO
        title="La mia area | Travellini Club"
        description="La tua area riservata Travelliniwithus: preferiti, acquisti e guide salvate."
        noindex
      />

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8 pb-20">
        {/* HEADER DASHBOARD */}
        <div className="bg-[var(--color-ink-deep)] border border-white/5 rounded-3xl p-10 md:p-16 text-white mb-12 shadow-[var(--shadow-premium)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-[var(--color-accent)]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--color-accent)]/30 p-1 transition-transform duration-500 hover:scale-105">
              <img
                src={
                  user.photoURL ||
                  `https://ui-avatars.com/api/?name=${user.displayName}&background=random`
                }
                alt={`Foto profilo di ${user.displayName?.split(' ')[0] || 'utente'}`}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-accent-text)] mb-2">
                Area personale
              </div>
              <h1 className="text-4xl md:text-5xl font-serif">
                Benvenuto, {user.displayName?.split(' ')[0] || 'Viaggiatore'}
              </h1>
              <p className="text-white/60 font-light mt-2">
                Preferiti, acquisti e accessi futuri del Club collegati a {user.email}
              </p>
            </div>
            <button
              onClick={signOut}
              className="mt-4 md:mt-0 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50 hover:text-[var(--color-accent-text)] hover:scale-105 transition-all duration-300"
            >
              <LogOut size={16} /> Esci
            </button>
          </div>
        </div>

        {/* CONTENUTO DASHBOARD */}
        <div className="bg-white/70 backdrop-blur-md border border-black/5 rounded-3xl shadow-[var(--shadow-premium)] overflow-hidden min-h-[500px]">
          <div className="flex items-center justify-center gap-3 py-6 border-b border-black/5 bg-white/30">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                activeTab === 'favorites'
                  ? 'bg-[var(--color-ink)] text-white shadow-sm'
                  : 'text-[var(--color-ink)]/50 hover:text-[var(--color-ink)] hover:bg-white/50'
              }`}
            >
              <Heart size={16} /> Preferiti
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                activeTab === 'purchases'
                  ? 'bg-[var(--color-ink)] text-white shadow-sm'
                  : 'text-[var(--color-ink)]/50 hover:text-[var(--color-ink)] hover:bg-white/50'
              }`}
            >
              <ShoppingBag size={16} /> I miei acquisti
            </button>
          </div>

          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {isLoadingData ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-20 flex justify-center"
                >
                  <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
                </motion.div>
              ) : activeTab === 'favorites' ? (
                <motion.div
                  key="favs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {savedArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {savedArticles.map((article) => (
                        <Link
                          key={article.id}
                          to={`/articolo/${article.slug || article.id}`}
                          className="group block"
                        >
                          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-md mb-4 border border-black/5">
                            <OptimizedImage
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink)] border border-black/5 shadow-xs">
                                {article.category}
                              </span>
                            </div>
                          </div>
                          <h3 className="font-serif text-2xl text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors leading-snug">
                            {article.title}
                          </h3>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-[var(--color-accent-soft)] flex items-center justify-center mb-6 shadow-inner">
                        <Heart size={24} className="text-[var(--color-accent)] animate-pulse" />
                      </div>
                      <h3 className="text-2xl font-serif text-[var(--color-ink)] mb-2">
                        Nessun articolo salvato.
                      </h3>
                      <p className="text-black/65 font-light mb-8 max-w-sm mx-auto leading-relaxed text-sm">
                        Esplora i contenuti e usa l'icona del cuore per salvare gli itinerari e le
                        guide che vuoi tenere da parte.
                      </p>
                      <Button
                        to="/esplora"
                        magnetic={true}
                        variant="outline"
                        className="rounded-full"
                      >
                        Esplora i contenuti
                      </Button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="purchases"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-2xl border border-black/5 bg-white/50 backdrop-blur-xs hover:bg-white/80 transition-all duration-300 shadow-xs"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center shrink-0">
                            <ShoppingBag size={24} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)]">
                                Ordine #{order.id.slice(-6).toUpperCase()}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-xl text-[11px] uppercase tracking-widest font-bold ${order.status === 'completed' ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]' : 'bg-[var(--color-warning-soft)] text-[var(--color-warning-text)]'}`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <p className="font-light text-xs text-black/60">
                              {(() => {
                                const createdAt = order.createdAt as
                                  | { toDate?: () => Date; seconds?: number }
                                  | undefined;
                                const date = createdAt?.toDate
                                  ? createdAt.toDate()
                                  : createdAt?.seconds
                                    ? new Date(createdAt.seconds * 1000)
                                    : null;
                                return date
                                  ? date.toLocaleDateString('it-IT')
                                  : 'Data non disponibile';
                              })()}
                            </p>
                            <p className="font-serif text-xl text-[var(--color-ink)] mt-2">
                              Totale: €{order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-[var(--color-accent-soft)] flex items-center justify-center mb-6 shadow-inner">
                        <ShoppingBag size={24} className="text-[var(--color-accent)]" />
                      </div>
                      <h3 className="text-2xl font-serif text-[var(--color-ink)] mb-2">
                        Nessun acquisto ancora.
                      </h3>
                      <p className="text-black/65 font-light mb-8 max-w-sm mx-auto leading-relaxed text-sm">
                        Lo shop è in pre-apertura: puoi vedere il primo prodotto in lista d'attesa e
                        lasciare l'email per il lancio.
                      </p>
                      <Button to="/shop" variant="cta" magnetic={true} className="rounded-full">
                        Vai allo Shop
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
