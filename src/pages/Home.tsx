import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import SEO from '../components/SEO';
import Newsletter from '../components/Newsletter';
import { SITE_URL } from '../config/site';

import HeroSection from '../components/home/HeroSection';
import HomeDiscoveryCards from '../components/home/HomeDiscoveryCards';
import CoupleIntro from '../components/home/CoupleIntro';
import HomeMapTeaser from '../components/home/HomeMapTeaser';
import LatestArticles from '../components/home/LatestArticles';
import HomeToolsTeaser from '../components/home/HomeToolsTeaser';
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
        title="Posti particolari, destinazioni ed esperienze da vivere"
        description="Scopri destinazioni, esperienze e consigli di viaggio con un archivio unico filtrabile per luoghi e tipologie. Travelliniwithus racconta idee da salvare e vivere davvero."
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

      <HeroSection />

      <HomeDiscoveryCards />
      <CoupleIntro />
      <HomeMapTeaser />
      <div id="storie">
        <LatestArticles />
      </div>
      <HomeToolsTeaser />

      <section id="newsletter" className="bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Newsletter
            </span>
            <h2 className="mt-4 max-w-xl text-4xl font-serif leading-[1.05] text-ink md:text-5xl">
              Una email ogni tanto. <span className="italic text-black/55">Solo quando c'è davvero qualcosa da salvare.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-black/62">
              Luoghi, idee weekend, guide e strumenti. Niente rumore, niente pressione, niente
              newsletter riempita per forza.
            </p>
          </div>
          <div className="rounded-2xl border border-black/6 bg-[var(--color-sand)] p-8 md:p-10">
            <Newsletter compact variant="sand" source="homepage_compact" />
          </div>
        </div>
      </section>

      <HomeCollaborationCta />
    </div>
  );
}
