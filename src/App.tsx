/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { isRoutePublic } from './config/rebuildMode';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LITE_MODE } from './config/liteMode';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Esplora = lazy(() => import('./pages/Esplora'));
const Destinazione = lazy(() => import('./pages/Destinazione'));
const ChiSiamo = lazy(() => import('./pages/ChiSiamo'));
const Collaborazioni = lazy(() => import('./pages/Collaborazioni'));
const Contatti = lazy(() => import('./pages/Contatti'));
const MediaKit = lazy(() => import('./pages/MediaKit'));
const Press = lazy(() => import('./pages/Press'));
const Articolo = lazy(() => import('./pages/Articolo'));
const Itinerari = lazy(() => import('./pages/Itinerari'));
const ItinerariCompare = lazy(() => import('./pages/ItinerariCompare'));
const Itinerario = lazy(() => import('./pages/Itinerario'));
const Guida = lazy(() => import('./pages/Guida'));
const Strumenti = lazy(() => import('./pages/Strumenti'));
const Preferiti = lazy(() => import('./pages/Preferiti'));
const Risorse = lazy(() => import('./pages/Risorse'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const Club = lazy(() => import('./pages/Club'));
const Mappa = lazy(() => import('./pages/Mappa'));
const MieiAcquisti = lazy(() => import('./pages/MieiAcquisti'));
const LeadMagnet = lazy(() => import('./pages/LeadMagnet'));
const Posto = lazy(() => import('./pages/Posto'));
const VieniConNoi = lazy(() => import('./pages/VieniConNoi'));
const Futuro = lazy(() => import('./pages/Futuro'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ArticleEditor = lazy(() => import('./pages/admin/ArticleEditor'));
const ProductEditor = lazy(() => import('./pages/admin/ProductEditor'));
const SiteContentEditor = lazy(() => import('./pages/admin/SiteContentEditor'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));

// Legal pages (to be created)
const Privacy = lazy(() => import('./pages/legal/Privacy'));
const Cookie = lazy(() => import('./pages/legal/Cookie'));
const Termini = lazy(() => import('./pages/legal/Termini'));
const Disclaimer = lazy(() => import('./pages/legal/Disclaimer'));

// Branded loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-[var(--color-sand)] flex flex-col items-center justify-center gap-6">
    <div className="text-2xl font-serif font-medium tracking-tight text-[var(--color-ink)] animate-pulse">
      Travellini<span className="font-bold text-[var(--color-accent)]">with</span>us
    </div>
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:0ms]"></div>
      <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:150ms]"></div>
      <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:300ms]"></div>
    </div>
  </div>
);

function RebuildGate() {
  const location = useLocation();
  if (!isRoutePublic(location.pathname)) {
    return <Navigate to="/" replace />;
  }
  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <BrowserRouter>
                <RebuildGate />
                <ScrollToTop />
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Standalone landings (no navbar/footer) — bio link IG/TikTok */}
                    <Route path="/vieni-con-noi" element={<VieniConNoi />} />
                    <Route path="/iscrivi" element={<Navigate to="/vieni-con-noi" replace />} />
                    {/* Atlante Notturno — full-bleed, DNA isolato, additivo */}
                    <Route path="/futuro" element={<Futuro />} />
                    {/* Il Sentiero è ora la home (/). La vecchia rotta di anteprima
                        redirige per dedup SEO e per non rompere link esterni. */}
                    <Route path="/sentiero" element={<Navigate to="/" replace />} />

                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      {!LITE_MODE && <Route path="esplora" element={<Esplora />} />}
                      <Route path="destinazione/:regionSlug" element={<Destinazione />} />
                      {/* Legacy routes consolidate in /esplora (2026-05-15).
                          I param sono compatibili: parseDiscoveryFilters
                          legge group/area/region, experience, cat, search
                          come alias dei canonical zone/type/format/q. */}
                      {!LITE_MODE && (
                        <Route path="destinazioni" element={<Navigate to="/esplora" replace />} />
                      )}
                      {!LITE_MODE && (
                        <Route path="esperienze" element={<Navigate to="/esplora" replace />} />
                      )}
                      {!LITE_MODE && (
                        <Route
                          path="guide"
                          element={<Navigate to="/esplora?format=guida" replace />}
                        />
                      )}
                      <Route path="chi-siamo" element={<ChiSiamo />} />
                      <Route path="collaborazioni" element={<Collaborazioni />} />
                      <Route path="media-kit" element={<MediaKit />} />
                      <Route path="press" element={<Press />} />
                      <Route path="contatti" element={<Contatti />} />
                      <Route path="articolo/:slug" element={<Articolo />} />
                      {!LITE_MODE && <Route path="itinerari" element={<Itinerari />} />}
                      {!LITE_MODE && (
                        <Route path="itinerari/compare" element={<ItinerariCompare />} />
                      )}
                      {!LITE_MODE && <Route path="itinerari/:slug" element={<Itinerario />} />}
                      <Route path="guide/:slug" element={<Guida />} />
                      {!LITE_MODE && (
                        <Route path="quiz" element={<Navigate to="/esplora" replace />} />
                      )}
                      <Route path="strumenti" element={<Strumenti />} />
                      {!LITE_MODE && <Route path="preferiti" element={<Preferiti />} />}
                      <Route path="risorse" element={<Risorse />} />
                      {!LITE_MODE && <Route path="shop" element={<Shop />} />}
                      {!LITE_MODE && <Route path="shop/:slug" element={<ProductPage />} />}
                      {!LITE_MODE && <Route path="club" element={<Club />} />}
                      <Route path="posto/:slug" element={<Posto />} />
                      <Route path="mappa" element={<Mappa />} />
                      <Route path="account/acquisti" element={<MieiAcquisti />} />
                      <Route path="lead-magnet" element={<LeadMagnet />} />

                      {/* Admin Routes */}
                      <Route
                        path="admin"
                        element={
                          <ProtectedRoute>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="admin/site-content/:pageId"
                        element={
                          <ProtectedRoute>
                            <SiteContentEditor />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="admin/editor"
                        element={
                          <ProtectedRoute>
                            <ArticleEditor />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="admin/editor/:id"
                        element={
                          <ProtectedRoute>
                            <ArticleEditor />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="admin/product-editor"
                        element={
                          <ProtectedRoute>
                            <ProductEditor />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="admin/product-editor/:id"
                        element={
                          <ProtectedRoute>
                            <ProductEditor />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="admin/users"
                        element={
                          <ProtectedRoute>
                            <AdminUsers />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="admin/orders"
                        element={
                          <ProtectedRoute>
                            <AdminOrders />
                          </ProtectedRoute>
                        }
                      />

                      {/* Legal Routes */}
                      <Route path="privacy" element={<Privacy />} />
                      <Route path="cookie" element={<Cookie />} />
                      <Route path="termini" element={<Termini />} />
                      <Route path="disclaimer" element={<Disclaimer />} />

                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
