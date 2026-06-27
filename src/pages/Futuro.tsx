/**
 * /futuro — Atlante Notturno
 *
 * Rotta full-bleed, completamente isolata dal DNA esistente.
 * Token Atlante Notturno scoped al wrapper .atlante (non sovrascrivono il @theme globale).
 *
 * Slice 1: Home cinematica — intro costellazione → hero concierge → griglia asimmetrica →
 * teaser atlante → manifesto verdetto → blocco R+B.
 */

import { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { CONTENT_ITEMS } from '../config/contentLibrary';
import { REELS } from '../config/reels';
import type { ContentItem } from '../types/content';
import { AskBar } from '../components/futuro/AskBar';
import { AtlanteCard } from '../components/futuro/AtlanteCard';
import { VerdictBadge } from '../components/futuro/VerdictBadge';

const ConstellationCanvas = lazy(() =>
  import('../components/futuro/ConstellationCanvas').then((m) => ({
    default: m.ConstellationCanvas,
  }))
);

// ─── Concierge stub: euristica di match ─────────────────────────────────────
//
// Parsing del testo libero → segnali zona, tipo, budget.
// Il movimento delle card è la risposta: matched = in luce, altri = attenuati.

const ZONE_KEYWORDS: Record<string, string[]> = {
  Italia: [
    'italia',
    'italian',
    'toscana',
    'roma',
    'napoli',
    'milano',
    'sicilia',
    'venezia',
    'firenze',
    'bologna',
    'alpi',
    'dolomiti',
    'sardegna',
    'puglia',
    'sicily',
    'amalfi',
    'cinque terre',
    'emilia',
    'lazio',
    'campania',
    'lombardia',
    'alto adige',
    'piemonte',
  ],
  Europa: [
    'europa',
    'europe',
    'praga',
    'madrid',
    'parigi',
    'berlino',
    'amsterdam',
    'barcellona',
    'vienna',
    'budapest',
    'dubrovnik',
    'portogallo',
    'spagna',
    'francia',
    'grecia',
  ],
  Asia: [
    'asia',
    'giappone',
    'giap',
    'japan',
    'tokyo',
    'malesia',
    'malaysia',
    'bali',
    'bangkok',
    'cina',
    'china',
    'shanghai',
    'india',
    'singapore',
    'vietnam',
    'tailandia',
  ],
  Africa: ['africa', 'egitto', 'egypt', 'marocco', 'kenya', 'mar rosso'],
};

const TYPE_KEYWORDS: Record<string, string[]> = {
  'Food & Ristoranti': [
    'ristorante',
    'mangiare',
    'cena',
    'pranzo',
    'cibo',
    'sushi',
    'food',
    'cucina',
    'menu',
    'menù',
    'cocktail',
    'aperitivo',
    'drink',
  ],
  Insolito: [
    'insolito',
    'tema',
    'a tema',
    'originale',
    'strano',
    'unico',
    'bizzarro',
    'dragon',
    'drago',
    'vampiri',
    'fantasy',
    'disney',
    'dog café',
    'bar',
    'locale',
  ],
  'Hotel con carattere': ['hotel', 'dormire', 'alloggio', 'notte', 'b&b', 'resort', 'villa'],
  'Relax, terme e spa': ['relax', 'spa', 'terme', 'wellness', 'jacuzzi', 'romantico'],
  'Weekend romantici': ['romantico', 'coppia', 'anniversary', 'anniversario', 'weekend', 'fugga'],
  'Posti particolari': ['posto', 'visita', 'gratis', 'free', 'entrata', 'monumento'],
  'Passeggiate panoramiche': [
    'panorama',
    'vista',
    'montagna',
    'trekking',
    'escursione',
    'bici',
    'looping',
  ],
};

const BUDGET_KEYWORDS: Record<string, string[]> = {
  Basso: [
    'economico',
    'low cost',
    'gratis',
    'free',
    'poco',
    'budget',
    'economici',
    'risparmio',
    '0€',
    '5€',
    '8€',
    '10€',
    '15€',
    '20€',
  ],
  Medio: [
    'medio',
    'ragionevole',
    'qualità',
    '50€',
    '70€',
    '80€',
    '98€',
    '100€',
    '150€',
    '200€',
    '250€',
  ],
  Alto: ['lusso', 'luxury', 'premium', 'esclusivo', 'alto', '300€', '400€', '500€'],
};

function extractPriceLimit(query: string): number | null {
  // Cerca pattern come "sotto 250€", "meno di 100€", "< 200€"
  const match = query.match(/(?:sotto|meno di|max|<)\s*(\d+)\s*€/i);
  if (match) return parseInt(match[1], 10);
  return null;
}

function parsePriceValue(price: string): number | null {
  // Estrae il valore numerico dal price field (es. "da 98€/notte" → 98, "20,90€" → 20)
  const match = price.replace(',', '.').match(/(\d+(?:\.\d+)?)/);
  if (match) return parseFloat(match[1]);
  return null;
}

function matchesQuery(item: ContentItem, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  let score = 0;

  // Match zona
  for (const [zone, keywords] of Object.entries(ZONE_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      if (item.zone === zone) score += 3;
      else score -= 1;
    }
  }

  // Match tipo
  for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      if (item.types.includes(type as ContentItem['types'][number])) score += 2;
    }
  }

  // Match budget
  for (const [budget, keywords] of Object.entries(BUDGET_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      if (item.value?.budget === budget) score += 2;
    }
  }

  // Match limite prezzo esplicito
  const priceLimit = extractPriceLimit(q);
  if (priceLimit !== null && item.value?.price) {
    const itemPrice = parsePriceValue(item.value.price);
    if (itemPrice !== null) {
      score += itemPrice <= priceLimit ? 3 : -2;
    }
  }

  // Match testo libero in title/description/hook/city/country
  const searchIn = [
    item.title,
    item.description,
    item.hook,
    item.place.city ?? '',
    item.place.country,
    item.place.region ?? '',
  ]
    .join(' ')
    .toLowerCase();

  const words = q.split(/\s+/).filter((w) => w.length > 3);
  for (const word of words) {
    if (searchIn.includes(word)) score += 1;
  }

  return score > 0;
}

// ─── Items featured per la griglia hero ─────────────────────────────────────
// I primi 9 item del seed (mix zone/tipi); i reel reali hanno cover

const REEL_COVER_MAP = new Map(REELS.map((r) => [r.id, r.cover]));

function enrichWithReelCovers(items: ContentItem[]): ContentItem[] {
  return items.map((item) => {
    if (item.cover) return item;
    const reelCover = REEL_COVER_MAP.get(item.id);
    if (reelCover) return { ...item, cover: reelCover };
    return item;
  });
}

const GRID_ITEMS = enrichWithReelCovers(CONTENT_ITEMS).slice(0, 9);

// ─── Componente principale ───────────────────────────────────────────────────

export default function Futuro() {
  const [introComplete, setIntroComplete] = useState(false);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);

  const handleIntroSettled = useCallback(() => {
    setIntroComplete(true);
  }, []);

  // Debounce: aggiorna activeQuery 300ms dopo l'ultima digitazione
  useEffect(() => {
    const t = setTimeout(() => setActiveQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const matchedItems = GRID_ITEMS.filter((item) => matchesQuery(item, activeQuery));
  const hasActiveQuery = activeQuery.trim().length > 0;

  function handleSubmit(v: string) {
    setActiveQuery(v);
    // Scroll alla griglia
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleClear() {
    setQuery('');
    setActiveQuery('');
  }

  return (
    <>
      <Helmet>
        <title>Atlante Notturno — Dove andiamo davvero? | Travelliniwithus</title>
        <meta
          name="description"
          content="Posti che valgono la pena, per chi, a che prezzo. La guida di Rodrigo & Betta: verdetti onesti, prezzi espliciti, niente retorica."
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      {/*
        Wrapper .atlante — CSS vars Atlante Notturno scoped qui.
        NON sovrascrivono il @theme globale: vivono solo dentro questo elemento.
      */}
      <div
        className="atlante min-h-screen"
        style={
          {
            '--atl-void': '#0B0A09',
            '--atl-surface-1': '#16130F',
            '--atl-surface-2': '#211C16',
            '--atl-border': '#2E2820',
            '--atl-cream': '#F4EEE3',
            '--atl-dim': '#B7AE9F',
            '--atl-faint': '#6E665A',
            '--atl-ember': '#FF5B2E',
            '--atl-ember-hover': '#FF7A52',
            '--atl-gold': '#E8B04B',
            '--atl-yes': '#3FBF7F',
            '--atl-maybe': '#E8B04B',
            '--atl-no': '#E5523E',
            background: '#0B0A09',
            color: '#F4EEE3',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          } as React.CSSProperties
        }
      >
        {/* ── HERO SECTION ──────────────────────────────────────────── */}
        <section
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
          aria-label="Hero Atlante Notturno"
        >
          {/* Sfondo void con glow ember centrale */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 50% 65%, rgba(255, 91, 46, 0.07) 0%, transparent 70%), #0B0A09',
            }}
            aria-hidden="true"
          />

          {/* Costellazione canvas — intro leggera */}
          <Suspense fallback={null}>
            {!introComplete && <ConstellationCanvas onSettled={handleIntroSettled} />}
          </Suspense>

          {/* Contenuto hero — appare dopo intro o subito se reduced-motion */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 32 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center text-center px-5 md:px-8 gap-6 md:gap-8 pt-20 pb-16"
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: introComplete ? 1 : 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-xs font-sans uppercase tracking-[0.22em] font-semibold"
              style={{ color: '#FF5B2E' }}
            >
              Atlante Notturno · Rodrigo & Betta
            </motion.p>

            {/* H1 display */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 20 }}
              transition={{ delay: 0.18, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif font-black leading-[0.92] tracking-tight"
              style={{
                fontSize: 'clamp(3rem, 9vw + 0.5rem, 7rem)',
                color: '#F4EEE3',
                maxWidth: '14ch',
              }}
            >
              Dove andiamo <span style={{ color: '#FF5B2E', fontStyle: 'italic' }}>davvero?</span>
            </motion.h1>

            {/* Sottotitolo */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: introComplete ? 1 : 0 }}
              transition={{ delay: 0.32, duration: 0.7 }}
              className="text-base md:text-lg font-sans leading-relaxed max-w-lg"
              style={{ color: '#B7AE9F' }}
            >
              Posti che valgono la pena, per chi, a che prezzo.
              <br />
              Verdetti onesti. Prezzi espliciti. Niente retorica.
            </motion.p>

            {/* Barra Chiedi */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 16 }}
              transition={{ delay: 0.44, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl"
            >
              <AskBar
                value={query}
                onChange={setQuery}
                onSubmit={handleSubmit}
                onClear={handleClear}
                hasResults={matchedItems.length > 0}
                resultCount={matchedItems.length}
              />
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: introComplete ? 0.4 : 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col items-center gap-2 mt-4"
              aria-hidden="true"
            >
              <span
                className="text-xs font-sans uppercase tracking-widest"
                style={{ color: '#6E665A' }}
              >
                esplora
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                className="w-px h-8"
                style={{ background: 'linear-gradient(to bottom, #6E665A, transparent)' }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* ── GRIGLIA ASIMMETRICA ────────────────────────────────────── */}
        <section
          ref={gridRef}
          className="px-4 md:px-8 lg:px-12 pb-20"
          aria-label="Posti in atlante"
        >
          {/* Sticky AskBar mobile — thumb-zone in basso */}
          <div
            className="md:hidden sticky bottom-4 z-30 pb-safe"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <AskBar
              value={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
              onClear={handleClear}
              hasResults={matchedItems.length > 0}
              resultCount={matchedItems.length}
            />
          </div>

          {/* Header sezione */}
          <div className="flex items-baseline justify-between mb-8 pt-4">
            <h2
              className="font-serif font-black leading-tight"
              style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.5rem)', color: '#F4EEE3' }}
            >
              {hasActiveQuery ? 'Posti trovati' : 'Tutti i posti'}
            </h2>
            <span className="text-sm font-mono" style={{ color: '#6E665A' }}>
              {hasActiveQuery ? matchedItems.length : GRID_ITEMS.length} posti
            </span>
          </div>

          {/* Griglia asimmetrica — 2 col mobile, 3 col desktop, prima card grande */}
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
            style={{
              gridAutoRows: 'minmax(240px, auto)',
            }}
          >
            <AnimatePresence mode="popLayout">
              {GRID_ITEMS.map((item, index) => {
                const isMatched = matchesQuery(item, activeQuery);
                return (
                  <AtlanteCard
                    key={item.id}
                    item={item}
                    variant={index === 0 ? 'hero' : 'standard'}
                    highlighted={isMatched}
                    hasActiveQuery={hasActiveQuery}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Empty state query */}
          <AnimatePresence>
            {hasActiveQuery && matchedItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="mt-8 text-center py-16"
              >
                <p className="font-serif text-xl mb-2" style={{ color: '#B7AE9F' }}>
                  Nessun posto corrisponde.
                </p>
                <p className="text-sm font-sans" style={{ color: '#6E665A' }}>
                  Prova con zona (es. "Italia", "Europa"), tipo (es. "ristorante", "hotel") o budget
                  (es. "sotto 100€").
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── TEASER ATLANTE / MAPPA ─────────────────────────────────── */}
        <section className="px-4 md:px-8 lg:px-12 py-16 md:py-24" aria-label="Teaser mappa atlante">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            style={{
              background: '#16130F',
              border: '1px solid #2E2820',
            }}
          >
            {/* Glow decorativo */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 55% 60% at 80% 50%, rgba(255, 91, 46, 0.06) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col gap-4 max-w-lg">
              <div className="flex items-center gap-2">
                <MapPin size={16} style={{ color: '#FF5B2E' }} aria-hidden="true" />
                <span
                  className="text-xs font-sans uppercase tracking-[0.2em] font-semibold"
                  style={{ color: '#FF5B2E' }}
                >
                  La mappa
                </span>
              </div>
              <h2
                className="font-serif font-black leading-tight"
                style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.25rem)', color: '#F4EEE3' }}
              >
                Tutti i posti su una mappa.
                <br />
                <span style={{ color: '#B7AE9F', fontStyle: 'italic' }}>
                  Filtra per zona, tipo, budget.
                </span>
              </h2>
              <p className="text-sm font-sans leading-relaxed" style={{ color: '#6E665A' }}>
                La versione completa dell'Atlante con mappa interattiva, schede-posto dettagliate e
                filtri avanzati è in arrivo.
              </p>
            </div>

            <div className="relative z-10 flex-shrink-0">
              <Link
                to="/mappa"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-sans font-semibold transition-colors duration-200"
                style={{ background: '#FF5B2E', color: '#0B0A09' }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.background = '#FF7A52')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.background = '#FF5B2E')
                }
              >
                Vai alla mappa
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── MANIFESTO VERDETTO ─────────────────────────────────────── */}
        <section
          className="px-4 md:px-8 lg:px-12 py-16 md:py-24"
          aria-label="Manifesto del verdetto"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto text-center flex flex-col items-center gap-10"
          >
            <div className="flex flex-col items-center gap-4">
              <h2
                className="font-serif font-black leading-[0.95]"
                style={{ fontSize: 'clamp(2rem, 4vw + 0.5rem, 3.5rem)', color: '#F4EEE3' }}
              >
                Il verdetto
                <br />
                <span style={{ color: '#FF5B2E', fontStyle: 'italic' }}>a semaforo.</span>
              </h2>
              <p
                className="text-base font-sans leading-relaxed max-w-md"
                style={{ color: '#B7AE9F' }}
              >
                Ogni posto ha un verdetto secco: vale la pena, dipende da chi sei, oppure salta
                pure. Niente 5 stelle. Niente "esperienza mistica".
              </p>
            </div>

            {/* I 3 badge verdetto spiegati */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {(
                [
                  {
                    kind: 'vale' as const,
                    title: 'Vale',
                    desc: "Qualità/prezzo chiaro, ci torneremmo. Vale l'uscita.",
                  },
                  {
                    kind: 'dipende' as const,
                    title: 'Dipende',
                    desc: 'Ottimo per alcuni, non per tutti. Leggete prima perché.',
                  },
                  {
                    kind: 'salta' as const,
                    title: 'Salta',
                    desc: 'Non ci siamo. Vi diciamo cosa non ha funzionato.',
                  },
                ] satisfies Array<{
                  kind: 'vale' | 'dipende' | 'salta';
                  title: string;
                  desc: string;
                }>
              ).map(({ kind, title, desc }) => (
                <motion.div
                  key={kind}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-start gap-3 rounded-2xl p-5 text-left"
                  style={{ background: '#16130F', border: '1px solid #2E2820' }}
                >
                  <VerdictBadge verdict={kind} />
                  <p className="text-sm font-sans font-semibold" style={{ color: '#F4EEE3' }}>
                    {title}
                  </p>
                  <p className="text-xs font-sans leading-relaxed" style={{ color: '#6E665A' }}>
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── BLOCCO R+B ────────────────────────────────────────────── */}
        <section className="px-4 md:px-8 lg:px-12 py-20 md:py-28" aria-label="Chi siamo">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-14 flex flex-col items-center text-center gap-6"
            style={{
              background: '#16130F',
              border: '1px solid #2E2820',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255, 91, 46, 0.08) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />
            <div className="relative z-10 flex flex-col items-center gap-6 max-w-xl">
              <div className="flex items-center gap-2">
                <Star size={14} style={{ color: '#E8B04B' }} aria-hidden="true" />
                <span
                  className="text-xs font-sans uppercase tracking-[0.22em] font-semibold"
                  style={{ color: '#E8B04B' }}
                >
                  Chi scrive
                </span>
              </div>
              <h2
                className="font-serif font-black leading-tight"
                style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.25rem)', color: '#F4EEE3' }}
              >
                Rodrigo & Betta.
                <br />
                <span style={{ color: '#B7AE9F', fontStyle: 'italic' }}>170K su Instagram.</span>
              </h2>
              <p className="text-sm font-sans leading-relaxed" style={{ color: '#B7AE9F' }}>
                Ogni posto che raccontiamo lo abbiamo visitato. Ogni prezzo è reale. Le
                collaborazioni commerciali sono sempre dichiarate (legge AGCOM) e non cambiano il
                nostro giudizio.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/chi-siamo"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-sans font-semibold transition-colors duration-200"
                  style={{ background: '#FF5B2E', color: '#0B0A09' }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.background = '#FF7A52')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.background = '#FF5B2E')
                  }
                >
                  Chi siamo
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <a
                  href="https://www.instagram.com/travelliniwithus/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-sans font-semibold transition-colors duration-200"
                  style={{
                    background: 'transparent',
                    color: '#B7AE9F',
                    border: '1px solid #2E2820',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#F4EEE3';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#6E665A';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#B7AE9F';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#2E2820';
                  }}
                >
                  @travelliniwithus
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER MINIMAL ATLANTE ─────────────────────────────────── */}
        <footer
          className="px-4 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid #2E2820' }}
        >
          <p className="text-xs font-sans" style={{ color: '#6E665A' }}>
            &copy; 2026 Travelliniwithus · Rodrigo &amp; Betta
          </p>
          <nav className="flex items-center gap-4" aria-label="Footer atlante">
            <Link
              to="/"
              className="text-xs font-sans transition-colors duration-150"
              style={{ color: '#6E665A' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#F4EEE3')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#6E665A')}
            >
              Sito principale
            </Link>
            <Link
              to="/privacy"
              className="text-xs font-sans transition-colors duration-150"
              style={{ color: '#6E665A' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#F4EEE3')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#6E665A')}
            >
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
}
