import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import SEO from '../components/SEO';
import { SITE_URL } from '../config/site';

import HeroSection from '../components/home/HeroSection';
import DestinationScroller from '../components/home/DestinationScroller';
import HomeDiscoveryCards from '../components/home/HomeDiscoveryCards';
import CoupleIntro from '../components/home/CoupleIntro';
import LatestArticles from '../components/home/LatestArticles';
import HomePromoCodesBanner from '../components/home/HomePromoCodesBanner';
import NewsletterEnvelope from '../components/home/NewsletterEnvelope';
import HomeToolsTeaser from '../components/home/HomeToolsTeaser';
import InstagramFeed from '../components/home/InstagramFeed';
import HomeCollaborationCta from '../components/home/HomeCollaborationCta';

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-sand selection:bg-[var(--color-accent)] selection:text-white">
      <SEO
        title="Rodrigo & Betta — Consigli di viaggio, itinerari e posti particolari"
        description="Travelliniwithus di Rodrigo e Betta: itinerari in Italia, consigli pratici, codici sconto e guide di viaggio per coppie e famiglie. Parti con noi."
        canonical={`${SITE_URL}/`}
        website
        includeBrandSchema
      />

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 rounded-full bg-ink p-4 text-white shadow-[var(--shadow-premium)] ring-1 ring-[var(--color-accent)]/30 transition-all hover:-translate-y-1 hover:bg-[var(--color-accent)]"
            aria-label="Torna all'inizio"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 1. Hero immersivo */}
      <HeroSection />

      {/* 2. Destination picker — scroller per paese */}
      <DestinationScroller />

      {/* 3. Discovery cards — esperienze */}
      <HomeDiscoveryCards />

      {/* 4. Chi siamo / Il nostro metodo */}
      <CoupleIntro />

      {/* 5. Articoli in evidenza (placeholder) */}
      <div id="storie">
        <LatestArticles />
      </div>

      {/* 6. Codici sconto partner (dal Linktree reale) */}
      <HomePromoCodesBanner />

      {/* 7. Shop teaser (condizionale) */}
      <HomeToolsTeaser />

      {/* 8. Newsletter "busta da viaggio" */}
      <NewsletterEnvelope />

      {/* 9. Instagram feed */}
      <InstagramFeed />

      {/* 10. CTA Collaborazioni */}
      <HomeCollaborationCta />
    </div>
  );
}
