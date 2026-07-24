import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AudienceGate, { AUDIENCE_GATE_ENABLED, wasGateDismissedThisSession } from './AudienceGate';
import { useAudience } from '../context/AudienceContext';
import ConsentBanner from './ConsentBanner';
import ExitIntentPopup from './ExitIntentPopup';
import AiAssistant from './AiAssistant';
import ScrollProgressBar from './ScrollProgressBar';
import SmoothScrollProvider from './SmoothScrollProvider';
import QuickViewDrawer from './QuickViewDrawer';
import { QuickViewProvider } from '../context/QuickViewContext';
import { initAnalytics, trackPageview } from '../services/analytics';

export default function Layout() {
  const location = useLocation();
  const { hasChosen } = useAudience();

  useEffect(() => {
    // Sentry e' inizializzato in main.tsx via initTelemetry() — qui solo analytics.
    // L'ex initErrorTracking() di lib/errorTracking.ts era un no-op che generava
    // confusione: rimosso per evitare doppio path in caso di Sentry DSN configurato.
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageview(location.pathname + location.search);
  }, [location.pathname, location.search]);

  // Le esperienze editoriali immersive non ospitano overlay flottanti: sulla home
  // spezzano il primo frame, sulla mappa coprono filtri e percorsi suggeriti.
  const isCinematicHome = location.pathname === '/';
  const isGuideLanding = location.pathname === '/guida-in-regalo';
  const suppressFloatingOverlays =
    isCinematicHome || location.pathname === '/mappa' || isGuideLanding;

  return (
    <SmoothScrollProvider>
      <QuickViewProvider>
        <div className="min-h-screen bg-[var(--color-sand)] text-[var(--color-ink)] font-sans selection:bg-[var(--color-accent)] selection:text-white flex flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded-lg focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-white"
          >
            Vai al contenuto principale
          </a>
          <ScrollProgressBar />
          <Navbar />
          <main id="main-content" className="flex-grow">
            <Outlet />
          </main>
          {!isGuideLanding && <Footer />}
          <ConsentBanner />
          {/* Porta d'ingresso a 3 vie: solo home, solo prima visita, deferita */}
          {AUDIENCE_GATE_ENABLED &&
            isCinematicHome &&
            !hasChosen &&
            !wasGateDismissedThisSession() && <AudienceGate />}
          {!suppressFloatingOverlays && <ExitIntentPopup />}
          {!suppressFloatingOverlays && <AiAssistant />}
          <QuickViewDrawer />
        </div>
      </QuickViewProvider>
    </SmoothScrollProvider>
  );
}
