import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import ConsentBanner from './ConsentBanner';
import { initAnalytics, trackPageview } from '../services/analytics';
import { initErrorTracking } from '../lib/errorTracking';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    initErrorTracking();
    initAnalytics();

    // Idle prefetch delle rotte più probabili dopo la landing (Home).
    // Parte dopo first paint; zero impatto su LCP; chunk pronti quando l'utente clicca.
    const prefetchTopRoutes = () => {
      void import('../pages/Destinazioni');
      void import('../pages/Guide');
      void import('../pages/Articolo');
    };
    type RIC = (cb: () => void, opts?: { timeout?: number }) => number;
    const ric = (window as Window & { requestIdleCallback?: RIC }).requestIdleCallback;
    if (typeof ric === 'function') {
      ric(prefetchTopRoutes, { timeout: 3000 });
    } else {
      window.setTimeout(prefetchTopRoutes, 2500);
    }
  }, []);

  useEffect(() => {
    trackPageview(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-[var(--color-sand)] text-[var(--color-ink)] font-sans selection:bg-[var(--color-accent)] selection:text-white flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded-lg focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-white"
      >
        Vai al contenuto principale
      </a>
      <Navbar />
      <main id="main-content" className="flex-grow">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ConsentBanner />
    </div>
  );
}
