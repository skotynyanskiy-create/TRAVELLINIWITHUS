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
import ErrorBoundary from './components/ErrorBoundary';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const Home = lazy(() => import('./pages/Home'));
const Destinazioni = lazy(() => import('./pages/Destinazioni'));
const Esperienze = lazy(() => import('./pages/Esperienze'));
const ChiSiamo = lazy(() => import('./pages/ChiSiamo'));
const Collaborazioni = lazy(() => import('./pages/Collaborazioni'));
const Contatti = lazy(() => import('./pages/Contatti'));
const MediaKit = lazy(() => import('./pages/MediaKit'));
const Articolo = lazy(() => import('./pages/Articolo'));
const ArticleLegacyRedirect = lazy(() => import('./pages/ArticleLegacyRedirect'));
const Preferiti = lazy(() => import('./pages/Preferiti'));
const Risorse = lazy(() => import('./pages/Risorse'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const Guide = lazy(() => import('./pages/Guide'));
const Itinerari = lazy(() => import('./pages/Itinerari'));
const DoveDormire = lazy(() => import('./pages/DoveDormire'));
const HotelDetail = lazy(() => import('./pages/HotelDetail'));
const DestinationHub = lazy(() => import('./pages/DestinationHub'));
const IniziaDaQui = lazy(() => import('./pages/IniziaDaQui'));
const CosaMangiare = lazy(() => import('./pages/CosaMangiare'));
const MieiAcquisti = lazy(() => import('./pages/MieiAcquisti'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ArticleEditor = lazy(() => import('./pages/admin/ArticleEditor'));
const ProductEditor = lazy(() => import('./pages/admin/ProductEditor'));
const SiteContentEditor = lazy(() => import('./pages/admin/SiteContentEditor'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));

const Privacy = lazy(() => import('./pages/legal/Privacy'));
const Cookie = lazy(() => import('./pages/legal/Cookie'));
const Termini = lazy(() => import('./pages/legal/Termini'));
const Disclaimer = lazy(() => import('./pages/legal/Disclaimer'));

const PageLoader = () => (
  <div className="min-h-screen bg-sand flex flex-col items-center justify-center gap-6">
    <div className="text-2xl font-serif font-medium tracking-tight text-ink animate-pulse">
      Travellini<span className="font-bold text-accent">with</span>us
    </div>
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:0ms]"></div>
      <div className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:150ms]"></div>
      <div className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:300ms]"></div>
    </div>
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
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="destinazioni" element={<Destinazioni />} />
                        <Route path="destinazioni/:country" element={<DestinationHub />} />
                        <Route path="destinazioni/:country/:slug" element={<Articolo />} />
                        <Route path="esperienze" element={<Esperienze />} />
                        <Route path="guide" element={<Guide />} />
                        <Route path="guide/:slug" element={<Articolo />} />
                        <Route path="itinerari" element={<Itinerari />} />
                        <Route path="itinerari/:slug" element={<Articolo />} />
                        <Route path="dove-dormire" element={<DoveDormire />} />
                        <Route path="dove-dormire/:slug" element={<HotelDetail />} />
                        <Route
                          path="italia"
                          element={<Navigate to="/destinazioni/italia" replace />}
                        />
                        <Route
                          path="grecia"
                          element={<Navigate to="/destinazioni/grecia" replace />}
                        />
                        <Route
                          path="portogallo"
                          element={<Navigate to="/destinazioni/portogallo" replace />}
                        />
                        <Route path="inizia-da-qui" element={<IniziaDaQui />} />
                        <Route path="cosa-mangiare" element={<CosaMangiare />} />
                        <Route path="chi-siamo" element={<ChiSiamo />} />
                        <Route path="collaborazioni" element={<Collaborazioni />} />
                        <Route path="media-kit" element={<MediaKit />} />
                        <Route path="contatti" element={<Contatti />} />
                        <Route path="articolo/:slug" element={<ArticleLegacyRedirect />} />
                        <Route path="preferiti" element={<Preferiti />} />
                        <Route path="risorse" element={<Risorse />} />
                        <Route path="shop" element={<Shop />} />
                        <Route path="shop/:slug" element={<ProductPage />} />
                        <Route path="account/acquisti" element={<MieiAcquisti />} />

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

                        <Route path="privacy" element={<Privacy />} />
                        <Route path="cookie" element={<Cookie />} />
                        <Route path="termini" element={<Termini />} />
                        <Route path="disclaimer" element={<Disclaimer />} />

                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </ErrorBoundary>
                </Suspense>
              </BrowserRouter>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
