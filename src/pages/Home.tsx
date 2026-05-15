import { lazy, Suspense, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowUp } from 'lucide-react';
import SEO from '../components/SEO';
import { useSmoothScroll } from '../components/SmoothScrollProvider';
import { SITE_URL } from '../config/site';

// Above-fold: imported static (critical path).
import HeroSection from '../components/home/HeroSection';
import HomeTrustStrip from '../components/home/HomeTrustStrip';
import HomePartnerSignal from '../components/home/HomePartnerSignal';
import DiscoveryDestinations from '../components/home/DiscoveryDestinations';
import CoupleIntro from '../components/home/CoupleIntro';

// Below-fold: lazy. L'initial bundle home si alleggerisce di ~8-12 KB gz,
// le sezioni vengono caricate quando l'utente si avvicina (Suspense fallback
// di altezza riservata previene CLS).
const DiscoveryExperiences = lazy(() => import('../components/home/DiscoveryExperiences'));
const LatestArticles = lazy(() => import('../components/home/LatestArticles'));
const HomeQuizBudgetTeaser = lazy(() => import('../components/home/HomeQuizBudgetTeaser'));
const DiscoveryGuides = lazy(() => import('../components/home/DiscoveryGuides'));
const InstagramGrid = lazy(() => import('../components/InstagramGrid'));
const NewsletterFeature = lazy(() => import('../components/home/NewsletterFeature'));
const MonetizationTeaser = lazy(() => import('../components/home/MonetizationTeaser'));
const HomeCollaborationCta = lazy(() => import('../components/home/HomeCollaborationCta'));

function SectionPlaceholder({ minHeight = '520px' }: { minHeight?: string }) {
  return <div aria-hidden="true" style={{ minHeight }} />;
}

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
        title="Posti particolari in Italia e nel mondo per chi viaggia in coppia"
        description="Guide a posti particolari, hotel con carattere, borghi e weekend romantici — scritte da chi li ha vissuti. Archivio filtrabile per luogo e stile. Travelliniwithus."
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

      {/* 3. Partner entry — visibile sopra la prima meta pagina */}
      <HomePartnerSignal />

      {/* 3. Discovery destinations */}
      <DiscoveryDestinations />

      {/* 4. Creator showcase (Couple intro) — umanizza brand + metodo */}
      <CoupleIntro />

      {/* 5. Discovery experiences */}
      <Suspense fallback={<SectionPlaceholder minHeight="640px" />}>
        <DiscoveryExperiences />
      </Suspense>

      {/* 6. Latest articles (grid, no carousel). id="storie" appartiene
          alla <section> interna di LatestArticles, qui niente wrapper. */}
      <Suspense fallback={<SectionPlaceholder minHeight="720px" />}>
        <LatestArticles />
      </Suspense>

      {/* 7. Quiz + Budget interactive (mid-page, post-content) */}
      <Suspense fallback={<SectionPlaceholder minHeight="480px" />}>
        <HomeQuizBudgetTeaser />
      </Suspense>

      {/* 8. Discovery guides */}
      <Suspense fallback={<SectionPlaceholder minHeight="560px" />}>
        <DiscoveryGuides />
      </Suspense>

      {/* 9. Instagram feed */}
      <Suspense fallback={<SectionPlaceholder minHeight="640px" />}>
        <InstagramGrid />
      </Suspense>

      {/* 10. Newsletter feature */}
      <Suspense fallback={<SectionPlaceholder minHeight="420px" />}>
        <NewsletterFeature />
      </Suspense>

      {/* 11. Monetization teaser (solo card live) */}
      <Suspense fallback={<SectionPlaceholder minHeight="520px" />}>
        <MonetizationTeaser />
      </Suspense>

      {/* 12. Collaboration B2B (partner logos + dark CTA) */}
      <Suspense fallback={<SectionPlaceholder minHeight="520px" />}>
        <HomeCollaborationCta />
      </Suspense>
    </div>
  );
}
