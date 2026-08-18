import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, MapPin, BookOpen, Compass, Mail, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import Fuse from 'fuse.js';
import Skeleton from './Skeleton';
import { fetchArticles } from '../services/firebaseService';
import { siteContentDefaults } from '../config/siteContent';
import { DEMO_ARTICLE_PREVIEW, DEMO_ARTICLE_PATH } from '../config/demoContent';
import { INTERNAL_PREVIEW_SLUGS, PREVIEW_ARTICLES } from '../config/previewContent';
import { useSiteContent } from '../hooks/useSiteContent';
import { trackEvent } from '../services/analytics';
import { TYPES, ZONES, slugifyType } from '../config/contentTaxonomy';
import { CONTENT_ITEMS } from '../config/contentLibrary';
import { buildExploreUrl } from '../utils/discoveryQuery';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useOverlayLayer } from '../hooks/useOverlayLayer';

const RECENT_SEARCHES_KEY = 'twu_recent_searches';
/* Solo termini che l'indice trova davvero: «Andalusia» suggeriva una meta
   che il sito non copre. */
const POPULAR_TAGS = ['Sushi', 'Verona', 'Dolomiti', 'Weekend', 'Boutique hotel', 'Spa'];
const MAX_RECENT = 5;

interface SearchResult {
  id: string;
  title: string;
  category: string;
  link: string;
  icon: LucideIcon;
  keywords?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATIC_PAGE_RESULTS: SearchResult[] = [
  {
    id: 'page-esplora',
    title: 'Esplora',
    category: 'Pagina',
    link: '/esplora',
    icon: Compass,
    keywords: 'finder ricerca destinazioni esperienze mappa guide archivio',
  },
  {
    id: 'page-mappa',
    title: 'Mappa',
    category: 'Pagina',
    link: '/mappa',
    icon: MapPin,
    keywords: 'mappa visuale geo destinazioni continente',
  },
  {
    id: 'page-itinerari',
    title: 'Itinerari',
    category: 'Pagina',
    link: '/itinerari',
    icon: BookOpen,
    keywords: 'itinerari giorno per giorno tappe roadtrip',
  },
  {
    id: 'page-risorse',
    title: 'Risorse',
    category: 'Pagina',
    link: '/risorse',
    icon: BookOpen,
    keywords: 'assicurazione esim hotel attivita strumenti viaggio',
  },
  {
    id: 'page-collaborazioni',
    title: 'Collaborazioni',
    category: 'Pagina',
    link: '/collaborazioni',
    icon: Compass,
    keywords: 'partner brand destinazioni hotel B2B',
  },
  {
    id: 'page-chi-siamo',
    title: 'Chi siamo',
    category: 'Pagina',
    link: '/chi-siamo',
    icon: Compass,
    keywords: 'rodrigo betta storia metodo coppia',
  },
  {
    id: 'page-media-kit',
    title: 'Media Kit',
    category: 'Pagina',
    link: '/media-kit',
    icon: BookOpen,
    keywords: 'media kit numeri partner',
  },
  {
    id: 'page-contatti',
    title: 'Contatti',
    category: 'Pagina',
    link: '/contatti',
    icon: Mail,
    keywords: 'contatti email whatsapp instagram',
  },
];

/* I 79 posti reali sono il cuore del sito e la ricerca non li conosceva:
   «sushi» dava zero risultati con tre sushi nel registro. Costante di build,
   niente async — entrano nell'indice sempre, anche a Firestore vuoto. */
const POSTO_RESULTS: SearchResult[] = CONTENT_ITEMS.filter(
  (item) => !item.isPlaceholder && item.cover
).map((item) => ({
  id: `posto-${item.id}`,
  title: item.title,
  category: item.types[0] ?? 'Posto provato',
  link: `/posto/${item.id}`,
  icon: MapPin,
  keywords: [item.place.city, item.place.region, item.place.country, item.hook, ...item.types]
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' '),
}));

const DISCOVERY_RESULTS: SearchResult[] = [
  ...ZONES.map((zone) => ({
    id: `explore-zone-${zone}`,
    title: zone,
    category: 'Luogo',
    link: buildExploreUrl({ zone }),
    icon: MapPin,
    keywords: `destinazioni ${zone} mappa viaggio zona`,
  })),
  ...TYPES.map((type) => ({
    id: `explore-type-${slugifyType(type)}`,
    title: type,
    category: 'Esperienza',
    link: buildExploreUrl({ type }),
    icon: Compass,
    keywords: `${type} ${slugifyType(type).replace(/-/g, ' ')}`,
  })),
  {
    id: 'explore-weekend',
    title: 'Weekend e viaggi brevi',
    category: 'Percorso',
    link: buildExploreUrl({ duration: 'Weekend' }),
    icon: Clock,
    keywords: 'weekend breve 2 giorni 3 giorni coppia',
  },
  {
    id: 'explore-hotel',
    title: 'Hotel con carattere',
    category: 'Percorso',
    link: buildExploreUrl({ type: 'Hotel con carattere' }),
    icon: MapPin,
    keywords: 'hotel dormire boutique soggiorno',
  },
  {
    id: 'explore-food',
    title: 'Food e ristoranti',
    category: 'Percorso',
    link: buildExploreUrl({ type: 'Food & Ristoranti' }),
    icon: BookOpen,
    keywords: 'food cibo ristoranti trattorie mercati',
  },
  {
    id: 'explore-guide',
    title: 'Guide pratiche',
    category: 'Percorso',
    link: buildExploreUrl({ format: 'Guida' }),
    icon: BookOpen,
    keywords: 'guide pratiche tips consigli pianificazione',
  },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [allData, setAllData] = useState<SearchResult[]>([]);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error' | 'retrying'>(
    'idle'
  );
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);
  const loadedDemoModeRef = useRef<boolean | null>(null);
  const navigate = useNavigate();
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const loading = loadState === 'loading' || loadState === 'retrying';
  const loadError = loadState === 'error';
  const isTopLayer = useOverlayLayer(isOpen);

  useFocusTrap(isOpen, modalRef, inputRef, isTopLayer);

  const fuse = useMemo(
    () =>
      new Fuse(allData, {
        keys: [
          { name: 'title', weight: 0.7 },
          { name: 'category', weight: 0.3 },
          { name: 'keywords', weight: 0.6 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [allData]
  );

  const loadSearchData = useCallback(
    async (isRetry = false) => {
      const requestId = ++requestIdRef.current;
      setLoadState(isRetry ? 'retrying' : 'loading');
      try {
        const articles = await fetchArticles();

        const fetchedData: SearchResult[] = [
          ...STATIC_PAGE_RESULTS,
          ...DISCOVERY_RESULTS,
          ...POSTO_RESULTS,
        ];
        const seenSlugs = new Set<string>();

        articles.forEach((data) => {
          const slug = data.slug || data.id;
          seenSlugs.add(slug);
          fetchedData.push({
            id: data.id,
            title: data.title,
            category: data.category || 'Articolo',
            link: `/articolo/${slug}`,
            icon:
              data.category === 'Destinazioni'
                ? MapPin
                : data.category === 'Esperienze'
                  ? Compass
                  : BookOpen,
          });
        });

        // Include preview articles (demo seeds + manual previews) cosi' la
        // ricerca trova "puglia", "sicilia", "dolomiti" ecc. anche quando
        // Firestore e' vuoto o non contiene ancora quegli articoli. Articolo.tsx
        // gia' risolve gli stessi slug via PREVIEW_ARTICLES — search resta allineato.
        if (demoSettings.showEditorialDemo) {
          Object.values(PREVIEW_ARTICLES).forEach((preview) => {
            if (seenSlugs.has(preview.slug)) return;
            // La guida ai blocchi editoriali e' documentazione per chi scrive:
            // resta raggiungibile per URL, ma fra i risultati di ricerca del
            // sito non ci va.
            if (INTERNAL_PREVIEW_SLUGS.has(preview.slug)) return;
            const keywords = [
              preview.location,
              preview.continent,
              preview.category,
              preview.excerpt,
            ]
              .filter((value): value is string => typeof value === 'string' && value.length > 0)
              .join(' ');
            fetchedData.push({
              id: `preview-${preview.slug}`,
              title: preview.title,
              category: preview.category || 'Articolo',
              link: `/articolo/${preview.slug}`,
              icon:
                preview.category === 'Destinazioni'
                  ? MapPin
                  : preview.category === 'Esperienze'
                    ? Compass
                    : BookOpen,
              keywords,
            });
          });
        }

        if (articles.length === 0 && demoSettings.showEditorialDemo) {
          const demoSlug = DEMO_ARTICLE_PREVIEW.slug;
          const alreadyIndexed = fetchedData.some(
            (entry) => entry.link === DEMO_ARTICLE_PATH || entry.id === `preview-${demoSlug}`
          );
          if (!alreadyIndexed) {
            fetchedData.push({
              id: DEMO_ARTICLE_PREVIEW.id,
              title: DEMO_ARTICLE_PREVIEW.title,
              category: DEMO_ARTICLE_PREVIEW.category,
              link: DEMO_ARTICLE_PATH,
              icon: BookOpen,
            });
          }
        }

        if (requestId === requestIdRef.current) {
          setAllData(fetchedData);
          loadedDemoModeRef.current = demoSettings.showEditorialDemo;
          setLoadState('ready');
        }
      } catch (error) {
        console.error('Error fetching search data:', error);
        if (requestId === requestIdRef.current) {
          setAllData([...STATIC_PAGE_RESULTS, ...DISCOVERY_RESULTS]);
          loadedDemoModeRef.current = demoSettings.showEditorialDemo;
          setLoadState('error');
        }
      }
    },
    [demoSettings.showEditorialDemo]
  );

  useEffect(() => {
    const demoModeChanged = loadedDemoModeRef.current !== demoSettings.showEditorialDemo;
    const needsLoad = loadState === 'idle' || demoModeChanged;
    if (!isOpen || loading || !needsLoad) return;

    const loadTimer = window.setTimeout(() => {
      void loadSearchData();
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, [demoSettings.showEditorialDemo, isOpen, loadSearchData, loadState, loading]);

  useEffect(() => {
    if (isOpen) {
      trackEvent('search_open', { source_page: window.location.pathname });
    }
  }, [isOpen]);

  const closeSearch = useCallback(() => {
    requestIdRef.current += 1;
    setQuery('');
    setLoadState('idle');
    onClose();
  }, [onClose]);

  // Handle Cmd+K / Ctrl+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // We can't easily open it from here without lifting state up,
          // but we assume the parent handles the shortcut too, or we just rely on the button.
        }
      }
      if (e.key === 'Escape' && isOpen && isTopLayer) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeSearch, isOpen, isTopLayer]);

  const filteredResults = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed === '') return [];
    return fuse
      .search(trimmed)
      .slice(0, 12)
      .map((result) => result.item);
  }, [fuse, query]);

  /* Selezione da tastiera: il modale si apre con ⌘K ma si completava solo col
     mouse. L'indice segue l'ordine VISIVO (gruppi editoriali), non il rank
     Fuse — le frecce devono muoversi come l'occhio legge. */
  const [activeIndex, setActiveIndex] = useState(0);
  /* Reset a render-time (pattern «adjust state during render» dei docs
     React): a ogni query nuova la selezione riparte dal primo risultato. */
  const [prevQuery, setPrevQuery] = useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  // Raggruppa risultati per categoria con ordine editoriale: prima i luoghi
  // e le esperienze (decisioni di viaggio), poi articoli/guide, poi pagine
  // di servizio. Mantiene il rank Fuse all'interno di ogni gruppo.
  const groupedResults = useMemo(() => {
    if (filteredResults.length === 0) return [];

    const GROUP_ORDER: Array<{ label: string; matches: (cat: string) => boolean }> = [
      { label: 'Luoghi', matches: (cat) => cat === 'Luogo' || cat === 'Destinazioni' },
      { label: 'Esperienze', matches: (cat) => cat === 'Esperienza' || cat === 'Esperienze' },
      { label: 'Percorsi consigliati', matches: (cat) => cat === 'Percorso' || cat === 'Finder' },
      {
        label: 'Articoli e guide',
        matches: (cat) =>
          cat === 'Articolo' ||
          cat === 'Guide' ||
          cat === 'Itinerari completi' ||
          cat === 'Weekend & Day trips' ||
          cat === 'Food & Ristoranti' ||
          cat === 'Hotel con carattere' ||
          cat === 'Posti particolari',
      },
      { label: 'Pagine', matches: (cat) => cat === 'Pagina' },
    ];

    const assigned = new Set<string>();
    const groups = GROUP_ORDER.map(({ label, matches }) => {
      const items = filteredResults.filter((item) => {
        if (assigned.has(item.id)) return false;
        if (matches(item.category)) {
          assigned.add(item.id);
          return true;
        }
        return false;
      });
      return { label, items };
    }).filter((group) => group.items.length > 0);

    const remaining = filteredResults.filter((item) => !assigned.has(item.id));
    if (remaining.length > 0) {
      groups.push({ label: 'Altri risultati', items: remaining });
    }

    return groups;
  }, [filteredResults]);

  /* L'elenco piatto nell'ordine in cui i gruppi vengono mostrati: è la
     mappa su cui camminano ArrowUp/ArrowDown. */
  const flatResults = useMemo(() => groupedResults.flatMap((g) => g.items), [groupedResults]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) return;
    const timer = setTimeout(() => {
      trackEvent('search_query_submit', {
        query: trimmed.toLowerCase(),
        results_count: filteredResults.length,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [query, filteredResults.length]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3 || loading || filteredResults.length > 0) return;
    const timer = setTimeout(() => {
      trackEvent('search_no_results', {
        query: trimmed.toLowerCase(),
        source_page: window.location.pathname,
      });
    }, 700);
    return () => clearTimeout(timer);
  }, [filteredResults.length, loading, query]);

  const persistRecent = (term: string) => {
    if (!term.trim() || typeof window === 'undefined') return;
    const next = [term.trim(), ...recentSearches.filter((r) => r !== term.trim())].slice(
      0,
      MAX_RECENT
    );
    setRecentSearches(next);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
    } catch {
      // localStorage full o blocked
    }
  };

  const handleSelect = (link: string, item: SearchResult, position: number) => {
    persistRecent(query);
    trackEvent('search_result_click', {
      query: query.trim().toLowerCase(),
      result_id: item.id,
      result_category: item.category,
      position,
    });
    navigate(link);
    closeSearch();
  };

  const retrySearchData = () => {
    if (!loading) void loadSearchData(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110]"
          />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Ricerca nel sito"
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-[var(--radius-md)] shadow-2xl z-[120] overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center px-6 py-4 border-b border-black/10">
              <Search className="text-black/60 mr-4" size={24} />
              <input
                ref={inputRef}
                aria-label="Cerca nel sito"
                aria-activedescendant={
                  flatResults[activeIndex] ? `search-opt-${flatResults[activeIndex].id}` : undefined
                }
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (flatResults.length === 0) return;
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setActiveIndex((i) => (i + 1) % flatResults.length);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setActiveIndex((i) => (i - 1 + flatResults.length) % flatResults.length);
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const item = flatResults[activeIndex] ?? flatResults[0];
                    if (item) {
                      handleSelect(
                        item.link,
                        item,
                        filteredResults.findIndex((c) => c.id === item.id)
                      );
                    }
                  }
                }}
                placeholder="Cerca pagine, destinazioni, esperienze e sezioni utili..."
                className="flex-grow text-xl bg-transparent border-none focus:outline-none placeholder:text-black/30 text-black"
              />
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Chiudi ricerca"
                className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/60 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 flex-grow">
              {loadError && (
                <div
                  role="alert"
                  className="mb-4 flex flex-col gap-3 rounded-xl border border-[var(--color-error)]/20 bg-[var(--color-error-soft)] px-4 py-3 text-sm text-[var(--color-ink)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <span>
                    Non riusciamo ad aggiornare l'archivio. Puoi comunque cercare le sezioni del
                    sito.
                  </span>
                  <button
                    type="button"
                    onClick={retrySearchData}
                    disabled={loading}
                    className="shrink-0 font-semibold text-[var(--color-accent-text)] underline underline-offset-2"
                  >
                    Riprova
                  </button>
                </div>
              )}
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center px-4 py-3">
                      <Skeleton className="w-10 h-10 rounded-full mr-4 shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="w-3/4 h-5 mb-2" />
                        <Skeleton className="w-1/4 h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : query.trim() === '' ? (
                <div className="space-y-6 px-2 py-4">
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">
                        <Clock size={11} /> Ricerche recenti
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => setQuery(term)}
                            className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">
                      <TrendingUp size={11} /> Ricerche popolari
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setQuery(tag)}
                          className="rounded-full border border-black/10 bg-[var(--color-sand)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent-text)]"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-black/5 pt-5">
                    <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">
                      <Compass size={11} /> Sezioni
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Posti particolari',
                        'Food & ristoranti',
                        'Hotel con carattere',
                        'Weekend romantici',
                        'Itinerari',
                      ].map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setQuery(label)}
                          className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium text-black/70 transition-colors hover:bg-black/10"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : groupedResults.length > 0 ? (
                <div className="space-y-5">
                  {groupedResults.map((group) => (
                    <section key={group.label} aria-label={`Risultati ${group.label}`}>
                      <h3 className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.22em] text-black/60">
                        {group.label}
                      </h3>
                      <ul className="space-y-1">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const positionInAll = filteredResults.findIndex(
                            (candidate) => candidate.id === item.id
                          );
                          const isActive = flatResults[activeIndex]?.id === item.id;
                          return (
                            <li key={item.id}>
                              <button
                                id={`search-opt-${item.id}`}
                                onClick={() => handleSelect(item.link, item, positionInAll)}
                                onMouseEnter={() => {
                                  const idx = flatResults.findIndex((c) => c.id === item.id);
                                  if (idx >= 0) setActiveIndex(idx);
                                }}
                                ref={(el) => {
                                  if (isActive && el)
                                    el.scrollIntoView({ block: 'nearest', behavior: 'auto' });
                                }}
                                className={`w-full flex items-center text-left px-4 py-3 rounded-xl transition-colors group ${
                                  isActive
                                    ? 'bg-[var(--color-sand)]'
                                    : 'hover:bg-[var(--color-sand)]'
                                }`}
                              >
                                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm transition-all text-black/60 group-hover:text-[var(--color-accent)]">
                                  <Icon size={18} />
                                </div>
                                <div>
                                  <h4 className="font-medium text-black group-hover:text-[var(--color-accent)] transition-colors">
                                    {item.title}
                                  </h4>
                                  <span className="text-xs uppercase tracking-widest text-black/60 font-semibold">
                                    {item.category}
                                  </span>
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-black/60">
                  <p className="text-sm">Nessun risultato per "{query}".</p>
                  <p className="mt-3 text-xs text-black/60">
                    Prova con: sushi, spa, Verona, Toscana, agriturismo.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-[var(--color-sand)] px-6 py-3 text-xs text-black/60 flex justify-between items-center border-t border-black/5">
              <span>Frecce per scorrere, Invio per aprire</span>
              <span className="flex items-center gap-1">
                Premi{' '}
                <kbd className="bg-white px-2 py-1 rounded border border-black/10 shadow-sm font-sans">
                  ESC
                </kbd>{' '}
                per chiudere
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
