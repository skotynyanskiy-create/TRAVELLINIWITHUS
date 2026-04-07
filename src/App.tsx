/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

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
const Destinazioni = lazy(() => import('./pages/Destinazioni'));
const Esperienze = lazy(() => import('./pages/Esperienze'));
const ChiSiamo = lazy(() => import('./pages/ChiSiamo'));
const Collaborazioni = lazy(() => import('./pages/Collaborazioni'));
const Contatti = lazy(() => import('./pages/Contatti'));
const MediaKit = lazy(() => import('./pages/MediaKit'));
const Articolo = lazy(() => import('./pages/Articolo'));
const Preferiti = lazy(() => import('./pages/Preferiti'));
const Risorse = lazy(() => import('./pages/Risorse'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const Club = lazy(() => import('./pages/Club'));
const Guide = lazy(() => import('./pages/Guide'));
const Mappa = lazy(() => import('./pages/Mappa'));
const MieiAcquisti = lazy(() => import('./pages/MieiAcquisti'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ArticleEditor = lazy(() => import('./pages/admin/ArticleEditor'));
const ProductEditor = lazy(() => import('./pages/admin/ProductEditor'));
const SiteContentEditor = lazy(() => import('./pages/admin/SiteContentEditor'));

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
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="destinazioni" element={<Destinazioni />} />
                      <Route path="esperienze" element={<Esperienze />} />
                      <Route path="guide" element={<Guide />} />
                      <Route path="chi-siamo" element={<ChiSiamo />} />
                      <Route path="collaborazioni" element={<Collaborazioni />} />
                      <Route path="media-kit" element={<MediaKit />} />
                      <Route path="contatti" element={<Contatti />} />
                      <Route path="articolo/:slug" element={<Articolo />} />
                      <Route path="preferiti" element={<Preferiti />} />
                      <Route path="risorse" element={<Risorse />} />
                      <Route path="shop" element={<Shop />} />
                      <Route path="shop/:slug" element={<ProductPage />} />
                      <Route path="club" element={<Club />} />
                      <Route path="mappa" element={<Mappa />} />
                      <Route path="account/acquisti" element={<MieiAcquisti />} />
                      
                      {/* Admin Routes */}
                      <Route path="admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                      <Route path="admin/site-content/:pageId" element={<ProtectedRoute><SiteContentEditor /></ProtectedRoute>} />
                      <Route path="admin/editor" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
                      <Route path="admin/editor/:id" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
                      <Route path="admin/product-editor" element={<ProtectedRoute><ProductEditor /></ProtectedRoute>} />
                      <Route path="admin/product-editor/:id" element={<ProtectedRoute><ProductEditor /></ProtectedRoute>} />
                      
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
