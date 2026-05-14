import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowUp } from 'lucide-react';
import SEO from '../components/SEO';
import { useSmoothScroll } from '../components/SmoothScrollProvider';
import { SITE_URL } from '../config/site';

import HeroSection from '../components/home/HeroSection';
import HomeTrustStrip from '../components/home/HomeTrustStrip';
import DiscoveryDestinations from '../components/home/DiscoveryDestinations';
import CoupleIntro from '../components/home/CoupleIntro';
import DiscoveryExperiences from '../components/home/DiscoveryExperiences';
import LatestArticles from '../components/home/LatestArticles';
import HomeQuizBudgetTeaser from '../components/home/HomeQuizBudgetTeaser';
import DiscoveryGuides from '../components/home/DiscoveryGuides';
import InstagramGrid from '../components/InstagramGrid';
import NewsletterFeature from '../components/home/NewsletterFeature';
import MonetizationTeaser from '../components/home/MonetizationTeaser';
import HomeCollaborationCta from '../components/home/HomeCollaborationCta';

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-sand selection:bg-[var(--color-accent)] selection:text-white">
      <SEO
        title="Posti particolari, destinazioni ed esperienze da vivere"
        description="Scopri destinazioni, esperienze e consigli di viaggio con un archivio unico filtrabile per luoghi e tipologie. Travelliniwithus racconta idee da salvare e vivere davvero."
        canonical={`${SITE_URL}/`}
      />
      <Helmet>
        <link
          rel="preload"
          as="image"
          href="/images/brand/couple-travel.avif"
          type="image/avif"
          media="(min-width: 769px)"
        />
        <link
          rel="preload"
          as="image"
          href="/images/hero-amalfi.avif"
          type="image/avif"
          media="(max-width: 768px)"
        />
      </Helmet>

      <button
        type="button"
        onClick={() => scrollTo(0)}
        aria-label="Torna all'inizio"
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
        className={`fixed bottom-8 right-8 z-50 rounded-full bg-ink p-4 text-white shadow-[var(--shadow-premium)] ring-1 ring-[var(--color-accent)]/30 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-[var(--color-accent)] ${
          showBackToTop
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <ArrowUp size={20} />
      </button>

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Trust strip — social proof immediato */}
      <HomeTrustStrip />

      {/* 3. Discovery destinations */}
      <DiscoveryDestinations />

      {/* 4. Creator showcase (Couple intro) — umanizza brand + metodo */}
      <CoupleIntro />

      {/* 5. Discovery experiences */}
      <DiscoveryExperiences />

      {/* 6. Latest articles (grid, no carousel) */}
      <div id="storie">
        <LatestArticles />
      </div>

      {/* 7. Quiz + Budget interactive (mid-page, post-content) */}
      <HomeQuizBudgetTeaser />

      {/* 8. Discovery guides */}
      <DiscoveryGuides />

      {/* 9. Instagram feed */}
      <InstagramGrid />

      {/* 10. Newsletter feature (mid-page con social proof counter) */}
      <NewsletterFeature />

      {/* 11. Monetization teaser (Shop + Strumenti + Club) */}
      <MonetizationTeaser />

      {/* 12. Collaboration B2B (partner logos + dark CTA) */}
      <HomeCollaborationCta />
    </div>
  );
}
