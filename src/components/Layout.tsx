import { lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';

const CartDrawer = lazy(() => import('./CartDrawer'));

export default function Layout() {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-[var(--color-sand)] text-[var(--color-ink)] font-sans selection:bg-[var(--color-accent)] selection:text-white flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded-lg focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-white"
      >
        Vai al contenuto principale
      </a>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[var(--color-accent)] origin-left z-[60]"
        style={{ scaleX }}
      />
      <Navbar />
      <Suspense fallback={null}>
        <CartDrawer />
      </Suspense>
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
    </div>
  );
}
