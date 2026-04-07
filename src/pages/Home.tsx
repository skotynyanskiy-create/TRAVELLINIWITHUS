import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
import Newsletter from '../components/Newsletter';
import { SITE_URL } from '../config/site';

import HeroSection from '../components/home/HeroSection';
import StatsStrip from '../components/home/StatsStrip';
import LatestArticles from '../components/home/LatestArticles';
import DestinationsGrid from '../components/home/DestinationsGrid';
import AboutPreview from '../components/home/AboutPreview';
import CommunitySection from '../components/home/CommunitySection';
import ShopPreview from '../components/home/ShopPreview';

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Travelliniwithus',
        url: `${SITE_URL}/`,
        description:
          'Posti particolari, esperienze memorabili e consigli utili per chi vuole scoprire, salvare e vivere meglio ogni viaggio.',
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-sand selection:bg-[var(--color-accent)] selection:text-white">
      <SEO
        title="Posti particolari, destinazioni ed esperienze da vivere"
        description="Scopri destinazioni, esperienze e consigli di viaggio con un archivio unico filtrabile per luoghi e tipologie. Travelliniwithus racconta idee da salvare e vivere davvero."
        canonical={`${SITE_URL}/`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 rounded-full bg-ink p-4 text-white shadow-[var(--shadow-premium)] transition-all hover:bg-[var(--color-accent-warm)] hover:-translate-y-1 ring-1 ring-[var(--color-gold)]/30"
            aria-label="Torna all'inizio"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 1. Hero — impatto visivo immediato */}
      <HeroSection />

      {/* 2. Stats Strip — barra flottante overlap */}
      <div className="relative z-20 -mt-8 mx-auto max-w-5xl px-6">
        <StatsStrip />
      </div>

      <div className="h-8 md:h-12" />

      {/* 3. Articoli — contenuto prima, dimostra il valore */}
      <LatestArticles />

      {/* 4. Destinazioni/Esperienze — navigazione utile */}
      <DestinationsGrid />

      {/* 5. Chi Siamo — conoscere il brand */}
      <AboutPreview />

      {/* 6. Community/Social — dopo aver dimostrato valore */}
      <CommunitySection />

      {/* 7. Shop — dopo credibilita */}
      <ShopPreview />

      {/* 8. Newsletter */}
      <Newsletter variant="sand" />
    </div>
  );
}
