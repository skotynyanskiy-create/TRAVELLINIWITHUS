import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Newsletter from '../components/Newsletter';
import { SITE_URL } from '../config/site';

import HeroSection from '../components/home/HeroSection';
import HomeDiscoveryCards from '../components/home/HomeDiscoveryCards';
import HomeMapTeaser from '../components/home/HomeMapTeaser';
import CoupleIntro from '../components/home/CoupleIntro';
import LatestArticles from '../components/home/LatestArticles';
import HomeToolsTeaser from '../components/home/HomeToolsTeaser';
import HomeCollaborationCta from '../components/home/HomeCollaborationCta';

const HOME_PATHS = [
  {
    eyebrow: 'Scopri',
    title: 'Posti particolari',
    description: 'Destinazioni, luoghi e soggiorni che meritano davvero di entrare nei tuoi piani.',
    to: '/destinazioni',
    cta: 'Esplora i luoghi',
  },
  {
    eyebrow: 'Preparati meglio',
    title: 'Guide e strumenti',
    description: 'Risorse, consigli pratici e strumenti che usiamo per viaggiare con meno rumore e piu criterio.',
    to: '/risorse',
    cta: 'Apri le risorse',
  },
  {
    eyebrow: 'Lavora con noi',
    title: 'Collaborazioni selettive',
    description: 'Una porta chiara per hotel, destinazioni e brand che vogliono un racconto credibile.',
    to: '/collaborazioni',
    cta: 'Scopri il lato B2B',
  },
];

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
            className="fixed bottom-8 right-8 z-50 rounded-full bg-ink p-4 text-white shadow-[var(--shadow-premium)] ring-1 ring-[var(--color-gold)]/30 transition-all hover:-translate-y-1 hover:bg-[var(--color-accent-warm)]"
            aria-label="Torna all'inizio"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <HeroSection />

      <section className="bg-white py-10 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 md:px-12 lg:grid-cols-3">
          {HOME_PATHS.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="group rounded-3xl border border-black/5 bg-[var(--color-sand)] p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-gold)]"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
                {item.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-serif text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-black/62">{item.description}</p>
              <span className="mt-5 inline-flex text-[10px] font-bold uppercase tracking-widest text-ink transition-colors group-hover:text-[var(--color-accent-warm)]">
                {item.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <HomeDiscoveryCards />
      <HomeMapTeaser />
      <CoupleIntro />
      <LatestArticles />
      <HomeToolsTeaser />

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:px-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Newsletter
            </span>
            <h2 className="mt-3 max-w-xl text-3xl font-serif leading-tight text-ink md:text-5xl">
              Una email ogni tanto. Solo quando c'e davvero qualcosa da salvare.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-black/62">
              Ricevi luoghi, idee weekend, guide e strumenti solo quando hanno senso. Niente
              rumore, niente pressione, niente newsletter riempita per forza.
            </p>
          </div>
          <div className="rounded-lg border border-black/8 bg-[var(--color-sand)] p-5 md:p-7">
            <Newsletter compact variant="sand" source="homepage_compact" />
          </div>
        </div>
      </section>

      <HomeCollaborationCta />
    </div>
  );
}
