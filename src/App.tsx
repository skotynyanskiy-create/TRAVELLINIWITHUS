/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
// La shell editoriale della mappa e piccola e resta eager per rendere subito l'H1;
// il motore MapLibre continua a essere lazy dentro Mappa.tsx.
import Mappa from './pages/Mappa';

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
// Home: "Atlante Vivo" (cutover 2026-07-04). Le vecchie home (Sentiero = pages/Home,
// V2, AtlanteLab) sono disattivate e conservate in repo/git per eventuale recupero.
const AtlanteHome = lazy(() => import('./pages/AtlanteHome'));
const Esplora = lazy(() => import('./pages/Esplora'));
const Destinazione = lazy(() => import('./pages/Destinazione'));
const ChiSiamo = lazy(() => import('./pages/ChiSiamo'));
const Collaborazioni = lazy(() => import('./pages/Collaborazioni'));
const Contatti = lazy(() => import('./pages/Contatti'));
const MediaKit = lazy(() => import('./pages/MediaKit'));
const Articolo = lazy(() => import('./pages/Articolo'));
const Itinerari = lazy(() => import('./pages/Itinerari'));
const ItinerariCompare = lazy(() => import('./pages/ItinerariCompare'));
const Itinerario = lazy(() => import('./pages/Itinerario'));
const Guida = lazy(() => import('./pages/Guida'));
const Preferiti = lazy(() => import('./pages/Preferiti'));
const Risorse = lazy(() => import('./pages/Risorse'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const Club = lazy(() => import('./pages/Club'));
const MieiAcquisti = lazy(() => import('./pages/MieiAcquisti'));
const LeadMagnet = lazy(() => import('./pages/LeadMagnet'));
const Posto = lazy(() => import('./pages/Posto'));
const VieniConNoi = lazy(() => import('./pages/VieniConNoi'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ManifestoPage = lazy(() => import('./experience/controluce/ManifestoPage'));
// Dev-only: variante "Diario" in isolamento su fixture Burton Juice — mai nel build di
// produzione (Route registrata solo se import.meta.env.DEV, vedi sotto).
const DiarioPreview = lazy(() => import('./pages/dev/DiarioPreview'));

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
  <div className="min-h-screen bg-[var(--color-sand,#faf7f2)] flex flex-col items-center justify-center gap-4">
    <div className="text-3xl font-serif font-medium tracking-tight text-[var(--color-ink,#1a2b3c)] animate-pulse">
      Travellini<span className="font-bold text-[var(--color-accent,#c85a32)]">with</span>us
    </div>
    <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--color-muted-fg,#6b7280)]">
      Rodrigo &amp; Betta
    </div>
    <div className="h-0.5 w-16 bg-gradient-to-r from-[var(--color-accent,#c85a32)] to-[var(--color-gold,#d4af37)] rounded-full animate-pulse"></div>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/iscrivi" element={<Navigate to="/guida-in-regalo" replace />} />
                    <Route
                      path="/italia-nascosta"
                      element={<Navigate to="/guida-in-regalo" replace />}
                    />
                    {/* Cutover 2026-07-04: la home è "Atlante Vivo". Le home sperimentali
                        (Sentiero /, V2, AtlanteLab, anteprima /atlante) sono disattivate →
                        redirect sicuro, codice conservato in repo/git per recupero. */}
                    <Route path="/v2" element={<Navigate to="/" replace />} />
                    <Route path="/atlante-lab" element={<Navigate to="/" replace />} />
                    <Route path="/sentiero" element={<Navigate to="/" replace />} />
                    {/* Lab Controluce: manifesto WebGL, noindex, fuori da nav/sitemap */}
                    <Route path="/manifesto" element={<ManifestoPage />} />

                    <Route path="/" element={<Layout />}>
                      <Route index element={<AtlanteHome />} />
                      <Route path="guida-in-regalo" element={<VieniConNoi />} />
                      <Route path="atlante" element={<Navigate to="/" replace />} />
                      <Route path="esplora" element={<Esplora />} />
                      {/* Spina gerarchica: /destinazione (hub tutte le zone),
                          /destinazione/:zoneSlug, /destinazione/:zoneSlug/:subSlug.
                          Il singolo segmento resta back-compat per gli slug regione legacy. */}
                      <Route path="destinazione" element={<Destinazione />} />
                      <Route path="destinazione/:zoneSlug" element={<Destinazione />} />
                      <Route path="destinazione/:zoneSlug/:subSlug" element={<Destinazione />} />
                      {/* Legacy routes consolidate in /esplora (2026-05-15).
                          I param sono compatibili: parseDiscoveryFilters
                          legge group/area/region, experience, cat, search
                          come alias dei canonical zone/type/format/q. */}
                      <Route path="destinazioni" element={<Navigate to="/esplora" replace />} />
                      <Route path="esperienze" element={<Navigate to="/esplora" replace />} />
                      <Route path="blog" element={<Navigate to="/esplora" replace />} />
                      <Route
                        path="guide"
                        element={<Navigate to="/esplora?format=guida" replace />}
                      />
                      <Route path="chi-siamo" element={<ChiSiamo />} />
                      <Route path="collaborazioni" element={<Collaborazioni />} />
                      <Route path="media-kit" element={<MediaKit />} />
                      <Route path="press" element={<Navigate to="/collaborazioni" replace />} />
                      <Route path="contatti" element={<Contatti />} />
                      <Route path="articolo/:slug" element={<Articolo />} />
                      <Route path="itinerari" element={<Itinerari />} />
                      <Route path="itinerari/compare" element={<ItinerariCompare />} />
                      <Route path="itinerari/:slug" element={<Itinerario />} />
                      <Route path="guide/:slug" element={<Guida />} />
                      <Route path="quiz" element={<Navigate to="/esplora" replace />} />
                      <Route path="strumenti" element={<Navigate to="/esplora" replace />} />
                      <Route path="preferiti" element={<Preferiti />} />
                      <Route path="risorse" element={<Risorse />} />
                      <Route path="shop" element={<Shop />} />
                      <Route path="shop/:slug" element={<ProductPage />} />
                      <Route path="club" element={<Club />} />
                      <Route path="posto/:slug" element={<Posto />} />
                      <Route path="mappa" element={<Mappa />} />
                      {import.meta.env.DEV && (
                        <>
                          <Route path="diario-preview" element={<DiarioPreview />} />
                          <Route path="_dev/diario-preview" element={<DiarioPreview />} />
                        </>
                      )}
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
