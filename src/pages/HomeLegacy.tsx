import { lazy, Suspense, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
import { SITE_URL } from '../config/site';

// Componenti Above-Fold Statici per LCP ottimale
import SplashIntro from '../components/home/SplashIntro';
import Diary3DScroll from '../components/home/Diary3DScroll';
import CustomCursor from '../components/home/CustomCursor';

// Componenti Below-Fold Lazy per caricamento progressivo
const InteractiveMapSection = lazy(() => import('../components/home/InteractiveMapSection'));
const LatestArticles = lazy(() => import('../components/home/LatestArticles'));
const InstagramGrid = lazy(() => import('../components/InstagramGrid'));
const CommercialBlock = lazy(() => import('../components/home/CommercialBlock'));

function SectionPlaceholder({ minHeight = '500px', bg = 'transparent' }) {
  return <div className="w-full" style={{ minHeight, backgroundColor: bg }} aria-hidden="true" />;
}

export default function HomeLegacy() {
  const [hasEntered, setHasEntered] = useState(
    () => sessionStorage.getItem('travellini_has_entered') === 'true'
  );

  // Sincronizza la classe sul body (nasconde/anima nav e footer globali) con lo stato
  useEffect(() => {
    document.body.classList.toggle('hide-global-nav-footer', !hasEntered);

    return () => {
      document.body.classList.remove('hide-global-nav-footer');
    };
  }, [hasEntered]);

  const handleEnter = () => {
    setHasEntered(true);
    sessionStorage.setItem('travellini_has_entered', 'true');
    document.body.classList.remove('hide-global-nav-footer');
  };

  return (
    <div className="min-h-screen bg-[var(--color-sand)] text-[var(--color-ink)] selection:bg-[var(--color-accent)] selection:text-white relative">
      <SEO
        title="Viaggi reali e posti particolari"
        description="Rodrigo e Betta raccontano posti particolari, guide pratiche ed itinerari alternativi provati sul campo, in Italia e nel mondo."
        canonical={`${SITE_URL}/`}
      />

      <Helmet>
        {/* Preload delle immagini critiche above-the-fold */}
        <link
          rel="preload"
          as="image"
          href="/images/destinations/puglia.webp"
          media="(min-width: 1024px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/destinations/puglia-480.avif"
          media="(max-width: 1023px)"
          fetchPriority="high"
        />
      </Helmet>

      {/* Stili locali per nascondere e far sfumare la navigazione globale della Layout */}
      <style>{`
        body.hide-global-nav-footer nav,
        body.hide-global-nav-footer footer,
        body.hide-global-nav-footer #ai-assistant-bubble,
        body.hide-global-nav-footer #scroll-progress-bar {
          opacity: 0 !important;
          pointer-events: none !important;
          transform: translateY(-20px) !important;
        }
        nav, footer, #ai-assistant-bubble, #scroll-progress-bar {
          transform: translateY(0);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
      `}</style>

      {/* Cursore interattivo Awwwards-style */}
      <CustomCursor />

      {/* 1. Cinematic Splash Screen */}
      {!hasEntered && <SplashIntro onEnter={handleEnter} />}

      {/* 2. Diario di Viaggio 3D (Z-Scroll) */}
      <Diary3DScroll onScrollEnd={() => {}} />

      {/* 3. Portale Mappa Interattiva (Lazy) */}
      <Suspense fallback={<SectionPlaceholder minHeight="680px" bg="var(--color-ink-deep)" />}>
        <InteractiveMapSection />
      </Suspense>

      {/* 4. Ultime Guide Editoriali */}
      <Suspense fallback={<SectionPlaceholder minHeight="600px" />}>
        <LatestArticles />
      </Suspense>

      {/* 5. Reels Social Proof Grid */}
      <Suspense fallback={<SectionPlaceholder minHeight="400px" />}>
        <InstagramGrid />
      </Suspense>

      {/* 6. Portale Commerciale asimmetrico B2C / B2B */}
      <Suspense fallback={<SectionPlaceholder minHeight="300px" bg="var(--color-ink-deep)" />}>
        <CommercialBlock />
      </Suspense>
    </div>
  );
}
