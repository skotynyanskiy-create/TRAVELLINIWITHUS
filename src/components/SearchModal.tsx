import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, MapPin, BookOpen, Compass, Mail, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import Fuse from 'fuse.js';
import Skeleton from './Skeleton';
import { fetchArticles } from '../services/firebaseService';
import { siteContentDefaults } from '../config/siteContent';
import { DEMO_ARTICLE_PREVIEW, DEMO_ARTICLE_PATH } from '../config/demoContent';
import { useSiteContent } from '../hooks/useSiteContent';
import { trackEvent } from '../services/analytics';

const RECENT_SEARCHES_KEY = 'twu_recent_searches';
const POPULAR_TAGS = ['Sicilia', 'Andalusia', 'Dolomiti', 'Weekend', 'Boutique hotel', 'Food'];
const MAX_RECENT = 5;

interface SearchResult {
  id: string;
  title: string;
  category: string;
  link: string;
  icon: LucideIcon;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATIC_PAGE_RESULTS: SearchResult[] = [
  {
    id: 'page-destinazioni',
    title: 'Destinazioni',
    category: 'Pagina',
    link: '/destinazioni',
    icon: MapPin,
  },
  {
    id: 'page-esperienze',
    title: 'Esperienze',
    category: 'Pagina',
    link: '/esperienze',
    icon: Compass,
  },
  {
    id: 'page-guide',
    title: 'Guide',
    category: 'Pagina',
    link: '/guide',
    icon: BookOpen,
  },
  {
    id: 'page-risorse',
    title: 'Risorse',
    category: 'Pagina',
    link: '/risorse',
    icon: BookOpen,
  },
  {
    id: 'page-collaborazioni',
    title: 'Collaborazioni',
    category: 'Pagina',
    link: '/collaborazioni',
    icon: Compass,
  },
  {
    id: 'page-chi-siamo',
    title: 'Chi siamo',
    category: 'Pagina',
    link: '/chi-siamo',
    icon: Compass,
  },
  {
    id: 'page-media-kit',
    title: 'Media Kit',
    category: 'Pagina',
    link: '/media-kit',
    icon: BookOpen,
  },
  {
    id: 'page-contatti',
    title: 'Contatti',
    category: 'Pagina',
    link: '/contatti',
    icon: Mail,
  },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [allData, setAllData] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;

  const fuse = useMemo(
    () =>
      new Fuse(allData, {
        keys: [
          { name: 'title', weight: 0.7 },
          { name: 'category', weight: 0.3 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [allData]
  );

  useEffect(() => {
    setAllData([]);
  }, [demoSettings.showEditorialDemo]);

  useEffect(() => {
    const fetchSearchData = async () => {
      setLoading(true);
      try {
        const articles = await fetchArticles();

        const fetchedData: SearchResult[] = [...STATIC_PAGE_RESULTS];

        articles.forEach((data) => {
          fetchedData.push({
            id: data.id,
            title: data.title,
            category: data.category || 'Articolo',
            link: `/articolo/${data.slug || data.id}`,
            icon:
              data.category === 'Destinazioni'
                ? MapPin
                : data.category === 'Esperienze'
                  ? Compass
                  : BookOpen,
          });
        });

        if (articles.length === 0 && demoSettings.showEditorialDemo) {
          fetchedData.push({
            id: DEMO_ARTICLE_PREVIEW.id,
            title: DEMO_ARTICLE_PREVIEW.title,
            category: DEMO_ARTICLE_PREVIEW.category,
            link: DEMO_ARTICLE_PATH,
            icon: BookOpen,
          });
        }

        setAllData(fetchedData);
      } catch (error) {
        console.error('Error fetching search data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && allData.length === 0) {
      fetchSearchData();
    }
  }, [isOpen, allData.length, demoSettings.showEditorialDemo]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredResults = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed === '') return [];
    return fuse
      .search(trimmed)
      .slice(0, 8)
      .map((result) => result.item);
  }, [fuse, query]);

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
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110]"
          />
          <motion.div
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
              <Search className="text-black/40 mr-4" size={24} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca pagine, destinazioni, esperienze e sezioni utili..."
                className="flex-grow text-xl bg-transparent border-none focus:outline-none placeholder:text-black/30 text-black"
              />
              <button
                onClick={onClose}
                aria-label="Chiudi ricerca"
                className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/50 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 flex-grow">
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
                      <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
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
                    <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
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
                    <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
                      <Compass size={11} /> Sezioni
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Destinazioni', 'Esperienze', 'Guide', 'Itinerari', 'Risorse'].map(
                        (label) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setQuery(label)}
                            className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium text-black/70 transition-colors hover:bg-black/10"
                          >
                            {label}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : filteredResults.length > 0 ? (
                <ul className="space-y-2">
                  {filteredResults.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => handleSelect(item.link, item, index)}
                          className="w-full flex items-center text-left px-4 py-3 hover:bg-[var(--color-sand)] rounded-xl transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm transition-all text-black/60 group-hover:text-[var(--color-accent)]">
                            <Icon size={18} />
                          </div>
                          <div>
                            <h4 className="font-medium text-black group-hover:text-[var(--color-accent)] transition-colors">
                              {item.title}
                            </h4>
                            <span className="text-xs uppercase tracking-widest text-black/50 font-semibold">
                              {item.category}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center py-12 text-black/40">
                  <p>Nessun risultato trovato per "{query}"</p>
                </div>
              )}
            </div>

            <div className="bg-[var(--color-sand)] px-6 py-3 text-xs text-black/40 flex justify-between items-center border-t border-black/5">
              <span>Usa le frecce per navigare</span>
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
