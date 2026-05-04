import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ConsentBanner from './ConsentBanner';
import AnalyticsScripts from './AnalyticsScripts';
import JsonLd from './JsonLd';
import ScrollProgressBar from './ScrollProgressBar';
import SmoothScrollProvider from './SmoothScrollProvider';
import { initAnalytics, trackPageview } from '../services/analytics';
import { initErrorTracking } from '../lib/errorTracking';
import { CONTACTS, SITE_URL } from '../config/site';

const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Travelliniwithus',
  alternateName: 'Travellini With Us',
  url: SITE_URL,
  logo: `${SITE_URL}/apple-touch-icon.png`,
  email: CONTACTS.email,
  sameAs: [CONTACTS.instagramUrl, CONTACTS.tiktokUrl, CONTACTS.facebookUrl],
  founder: [
    { '@type': 'Person', name: 'Rodrigo' },
    { '@type': 'Person', name: 'Betta' },
  ],
};

const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Travelliniwithus',
  url: `${SITE_URL}/`,
  inLanguage: 'it-IT',
  description:
    'Posti particolari, esperienze memorabili e consigli utili per chi vuole scoprire, salvare e vivere meglio ogni viaggio.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/destinazioni?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    initErrorTracking();
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageview(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-[var(--color-sand)] text-[var(--color-ink)] font-sans selection:bg-[var(--color-accent)] selection:text-white flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded-lg focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-white"
        >
          Vai al contenuto principale
        </a>
        <JsonLd data={ORGANIZATION_JSONLD} />
        <JsonLd data={WEBSITE_JSONLD} />
        <AnalyticsScripts />
        <ScrollProgressBar />
        <Navbar />
        <main id="main-content" className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <ConsentBanner />
      </div>
    </SmoothScrollProvider>
  );
}
