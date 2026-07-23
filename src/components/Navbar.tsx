import { lazy, Suspense, useEffect, useEffectEvent, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  type LucideIcon,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Compass,
  Heart,
  Instagram,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Link } from '@/src/components/TransitionLink';
import { CONTACTS } from '../config/site';
import { siteContentDefaults } from '../config/siteContent';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useSiteContent } from '../hooks/useSiteContent';
import { getLocale, setLocale } from '../i18n';
import SurfaceBadge from './SurfaceBadge';

const SearchModal = lazy(() => import('./SearchModal'));

interface NavSubLink {
  name: string;
  href: string;
  description?: string;
}

interface NavFeature {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
}

interface NavItem {
  name: string;
  href?: string;
  icon?: LucideIcon;
  subLinks?: NavSubLink[];
  /** Quando presente, il dropdown desktop renderizza in 2 colonne (link a sx, foto editoriale a dx). */
  feature?: NavFeature;
  /** Lista di link primari editoriali (max 4-5) per il layout 2-colonne. */
  primaryLinks?: NavSubLink[];
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Rileva OS per mostrare shortcut corretto (⌘K su Mac, Ctrl+K su Windows/Linux)
  const isMac = useMemo(
    () => typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform),
    []
  );

  const location = useLocation();
  const { favorites } = useFavorites();
  const { user, isAdmin, signIn, signOut } = useAuth();
  const { data: navigationContent } = useSiteContent('navigation');
  const navigation = navigationContent ?? siteContentDefaults.navigation;

  const resetNavigationUi = useEffectEvent(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileSection(null);
    setIsUserMenuOpen(false);
  });

  const [locale, setLocaleState] = useState(getLocale());

  const toggleLocale = () => {
    const next = locale === 'it' ? 'en' : 'it';
    setLocale(next);
    setLocaleState(next);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleMobileMenuToggle = () => {
    // Collassa tutti i sottomenu al primo open per evitare 14+ link visibili
    // su mobile 375px (era 'Esplora' default-open).
    setIsMobileMenuOpen((prev) => {
      if (!prev) setOpenMobileSection(null);
      return !prev;
    });
  };

  useEffect(() => {
    resetNavigationUi();
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Due assi ortogonali: DOVE (Mete) × COSA (Guide e racconti).
  const destinazioniLinks = useMemo<NavSubLink[]>(
    () => [
      {
        name: 'Italia',
        href: '/destinazione/italia',
        description: 'Borghi, food e posti insoliti, regione per regione.',
      },
      { name: 'Europa', href: '/destinazione/europa', description: 'Fughe a portata di volo.' },
      {
        name: navigation.destinationsAllLabel,
        href: '/destinazione',
        description: 'Zona per zona, fino alla regione.',
      },
    ],
    [navigation]
  );

  // Feature del menu Destinazioni — targa editoriale (P1.3), niente foto
  // stock/AI: ink-deep + watermark Compass, coerente col resto della card scura.
  const destinazioniFeature = useMemo<NavFeature>(
    () => ({
      eyebrow: 'In evidenza',
      title: 'Toscana insolita',
      description: 'Draghi, vampiri e sushi: i posti particolari che abbiamo provato.',
      href: '/destinazione/italia',
    }),
    []
  );

  // Dropdown "Guide e racconti" — l'asse editoriale (COSA leggere).
  const raccontiLinks = useMemo<NavSubLink[]>(
    () => [
      { name: 'Guide', href: '/esplora?format=guida' },
      { name: navigation.itinerariesLabel, href: '/itinerari' },
      { name: 'Racconti', href: '/esplora?format=storia' },
      { name: 'Tutti i contenuti', href: '/esplora' },
    ],
    [navigation]
  );

  // B2B forzato su /collaborazioni; altrove resta la scelta utente del switcher
  const isCollabRoute = location.pathname.startsWith('/collaborazioni');
  const [userNavMode, setUserNavMode] = useState<'b2c' | 'b2b'>('b2c');
  const navMode = isCollabRoute ? 'b2b' : userNavMode;

  const navItems = useMemo<NavItem[]>(
    () => [
      {
        name: navigation.destinationsLabel,
        href: '/destinazione',
        icon: MapPin,
        primaryLinks: destinazioniLinks,
        feature: destinazioniFeature,
      },
      { name: navigation.storiesLabel, href: '/esplora', icon: Sparkles, subLinks: raccontiLinks },
      { name: navigation.mapLabel, href: '/mappa', icon: MapPin },
      { name: navigation.aboutLabel, href: '/chi-siamo', icon: UserIcon },
    ],
    [destinazioniLinks, destinazioniFeature, raccontiLinks, navigation]
  );

  const isItemActive = (item: NavItem) => {
    const path = location.pathname;

    if (item.href === '/destinazione') {
      return path.startsWith('/destinazione');
    }
    if (item.href === '/esplora') {
      return path === '/esplora';
    }
    if (item.href === '/esplora?format=storia') {
      return (
        path.startsWith('/articolo') ||
        path.startsWith('/guide') ||
        path === '/itinerari' ||
        path.startsWith('/itinerari/')
      );
    }

    if (item.href && item.href !== '#' && path === item.href.split('?')[0]) {
      return true;
    }

    if (item.primaryLinks) {
      return item.primaryLinks.some((link) => path === link.href.split('?')[0]);
    }

    if (!item.subLinks) return false;

    return item.subLinks.some((subLink) => path === subLink.href.split('?')[0]);
  };

  const isSubLinkActive = (item: NavItem, href: string) => {
    const [subLinkPath, subLinkSearch] = href.split('?');

    if (href.startsWith('/esplora?')) {
      return location.pathname === subLinkPath && location.search === `?${subLinkSearch}`;
    }

    return location.pathname === href || location.pathname === subLinkPath || item.href === href;
  };

  return (
    <>
      <Suspense fallback={null}>
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </Suspense>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 right-0 left-0 z-50 pointer-events-none px-3 pt-3 md:px-6 md:pt-4"
      >
        <div
          className={`pointer-events-auto mx-auto flex max-w-[1360px] items-center justify-between gap-3 rounded-full border px-4 py-2 text-[var(--color-ink)] transition-all duration-500 md:px-5 md:py-2.5 ${
            isScrolled
              ? 'border-[var(--color-ink)]/12 bg-[var(--color-sand)]/95 shadow-[0_16px_40px_rgba(10,10,10,0.08)] backdrop-blur-2xl'
              : 'border-[var(--color-ink)]/8 bg-[var(--color-sand)]/85 shadow-[0_6px_28px_rgba(10,10,10,0.04)] backdrop-blur-xl'
          }`}
        >
          {/* BRAND LOGO */}
          <div className="flex shrink-0 items-center pl-1">
            <Link
              to="/"
              className="group whitespace-nowrap font-serif text-lg font-medium tracking-tight text-[var(--color-ink)] transition-all duration-300 md:text-xl xl:text-[1.35rem]"
            >
              Travellini
              <span className="font-bold text-[var(--color-accent)] transition-colors group-hover:text-[var(--color-gold)]">
                with
              </span>
              us
            </Link>
          </div>

          {/* DUAL SEGMENTED SWITCHER (VIAGGIATORI vs COLLABORAZIONI) */}
          <div className="hidden lg:flex shrink-0 items-center rounded-full bg-[var(--color-ink)]/5 p-0.5 border border-[var(--color-ink)]/8">
            <button
              type="button"
              onClick={() => setUserNavMode('b2c')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                navMode === 'b2c'
                  ? 'bg-white text-[var(--color-ink)] shadow-2xs font-semibold'
                  : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink)]'
              }`}
            >
              <Compass
                size={12}
                className={navMode === 'b2c' ? 'text-[var(--color-accent)]' : 'opacity-60'}
              />
              <span>Viaggiatori</span>
            </button>
            <button
              type="button"
              onClick={() => setUserNavMode('b2b')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                navMode === 'b2b'
                  ? 'bg-[var(--color-ink-deep,#1a2b3c)] text-white shadow-2xs font-semibold'
                  : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink)]'
              }`}
            >
              <BriefcaseBusiness
                size={12}
                className={navMode === 'b2b' ? 'text-[var(--color-gold,#d4af37)]' : 'opacity-60'}
              />
              <span>Collaborazioni</span>
            </button>
          </div>

          {/* DYNAMIC NAV MENU */}
          <AnimatePresence mode="wait">
            {navMode === 'b2c' ? (
              <motion.div
                key="b2c-nav"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="hidden flex-1 items-center justify-center space-x-1 px-2 xl:flex"
              >
                {navItems.map((item) => {
                  const active = isItemActive(item);
                  const hasDropdown = Boolean(item.subLinks || item.primaryLinks);
                  return (
                    <div key={item.name} className="group relative shrink-0">
                      <Link
                        to={item.href || '/'}
                        aria-current={active ? 'page' : undefined}
                        aria-haspopup={hasDropdown ? 'menu' : undefined}
                        className={`relative flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-300 ${
                          active
                            ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold'
                            : 'text-[var(--color-ink-2)] hover:bg-[var(--color-ink)]/5 hover:text-[var(--color-accent)]'
                        }`}
                      >
                        <span>{item.name}</span>
                        <SurfaceBadge path={item.href?.split('?')[0] ?? ''} />
                        {hasDropdown && (
                          <ChevronDown
                            size={11}
                            className="opacity-50 transition-transform duration-300 group-hover:rotate-180"
                          />
                        )}
                      </Link>

                      {item.primaryLinks && item.feature && (
                        <div className="invisible absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 z-50">
                          <div
                            role="menu"
                            className="relative overflow-hidden rounded-3xl border border-[var(--color-ink)]/10 bg-[var(--color-surface)]/98 shadow-2xl backdrop-blur-2xl w-[40rem]"
                          >
                            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                              <div className="flex flex-col p-6">
                                <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
                                  {item.name}
                                </span>
                                <ul className="flex flex-1 flex-col gap-1">
                                  {item.primaryLinks.map((link) => {
                                    const [path] = link.href.split('?');
                                    const subActive =
                                      location.pathname === path ||
                                      (path === '/itinerari' &&
                                        location.pathname.startsWith('/itinerari/'));
                                    return (
                                      <li key={link.name}>
                                        <Link
                                          to={link.href}
                                          role="menuitem"
                                          className={`group/link block rounded-xl px-3.5 py-2.5 transition-colors hover:bg-[var(--color-sand)] ${
                                            subActive ? 'bg-[var(--color-sand)]' : ''
                                          }`}
                                        >
                                          <span
                                            className={`block font-serif text-[15.5px] leading-tight transition-colors ${
                                              subActive
                                                ? 'text-[var(--color-accent)] font-medium'
                                                : 'text-[var(--color-ink)] group-hover/link:text-[var(--color-accent)]'
                                            }`}
                                          >
                                            {link.name}
                                          </span>
                                          {link.description && (
                                            <span className="mt-0.5 block text-[11px] leading-snug text-black/55">
                                              {link.description}
                                            </span>
                                          )}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                              <Link
                                to={item.feature.href}
                                role="menuitem"
                                className="group/feat relative flex flex-col justify-end overflow-hidden bg-[var(--color-ink-deep)] p-6 text-white"
                              >
                                <Compass
                                  aria-hidden="true"
                                  strokeWidth={1}
                                  className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 text-[var(--color-border)] transition-transform duration-700 group-hover/feat:scale-105"
                                />
                                <div className="relative z-10">
                                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-on-dark)]">
                                    {item.feature.eyebrow}
                                  </span>
                                  <p className="mt-2 font-serif text-[19px] leading-tight">
                                    {item.feature.title}
                                  </p>
                                  <p className="mt-1.5 text-[12px] leading-snug text-white/82">
                                    {item.feature.description}
                                  </p>
                                  <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-on-dark)]">
                                    Leggi
                                    <ArrowRight
                                      size={12}
                                      className="transition-transform group-hover/feat:translate-x-1"
                                    />
                                  </span>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}

                      {item.subLinks && (
                        <div className="invisible absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 z-50">
                          <div
                            role="menu"
                            className="relative overflow-hidden rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-surface)]/98 shadow-2xl backdrop-blur-2xl py-3 w-64"
                          >
                            {item.subLinks.map((subLink) => (
                              <Link
                                key={subLink.name}
                                to={subLink.href}
                                role="menuitem"
                                className={`block px-5 py-2.5 text-left transition-all duration-200 hover:bg-[var(--color-sand)] ${
                                  isSubLinkActive(item, subLink.href)
                                    ? 'bg-[var(--color-sand)]/60'
                                    : ''
                                }`}
                              >
                                <span
                                  className={`block font-serif text-[15px] leading-tight ${
                                    isSubLinkActive(item, subLink.href)
                                      ? 'text-[var(--color-accent)] font-medium'
                                      : 'text-[var(--color-ink)] hover:text-[var(--color-accent)]'
                                  }`}
                                >
                                  {subLink.name}
                                  <SurfaceBadge path={subLink.href.split('?')[0]} />
                                </span>
                                {subLink.description && (
                                  <span className="mt-0.5 block text-[11px] leading-snug text-black/55">
                                    {subLink.description}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="b2b-nav"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="hidden flex-1 items-center justify-center space-x-2 px-2 xl:flex"
              >
                <Link
                  to="/collaborazioni"
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-all hover:bg-[var(--color-ink)]/5 hover:text-[var(--color-accent)] ${
                    location.pathname === '/collaborazioni'
                      ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                      : 'text-[var(--color-ink)]'
                  }`}
                >
                  <Building2 size={13} className="text-[var(--color-accent)] shrink-0" />
                  <span>Come Lavoriamo</span>
                </Link>
                <Link
                  to="/chi-siamo"
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-all hover:bg-[var(--color-ink)]/5 hover:text-[var(--color-accent)] ${
                    location.pathname === '/chi-siamo'
                      ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                      : 'text-[var(--color-ink)]'
                  }`}
                >
                  <UserIcon size={13} className="text-[var(--color-accent)] shrink-0" />
                  <span>Chi Siamo</span>
                </Link>
                <Link
                  to="/contatti"
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-all hover:bg-[var(--color-ink)]/5 hover:text-[var(--color-accent)] ${
                    location.pathname === '/contatti'
                      ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                      : 'text-[var(--color-ink)]'
                  }`}
                >
                  <Send size={13} className="text-[var(--color-accent)] shrink-0" />
                  <span>Contatti</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RIGHT ACTION CLUSTER */}
          <div className="hidden shrink-0 items-center space-x-1.5 text-[var(--color-ink-2)] lg:flex">
            {navMode === 'b2c' ? (
              <>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white/70 backdrop-blur-xs px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] shadow-2xs group whitespace-nowrap cursor-pointer"
                  aria-label={navigation.searchLabel}
                >
                  <Search
                    size={12}
                    className="transition-transform group-hover:scale-110 text-[var(--color-accent)]"
                  />
                  <span className="hidden xl:inline">{navigation.searchLabel}</span>
                  <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[9px] font-sans font-semibold text-[var(--color-ink-2)]/70 bg-[var(--color-sand)]/80 rounded border border-[var(--color-border)] shadow-2xs">
                    {isMac ? '⌘K' : 'Ctrl+K'}
                  </kbd>
                </button>

                <Link
                  to="/guida-in-regalo"
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-xs transition-all duration-300 hover:bg-[var(--color-accent-hover,#b34d28)] hover:shadow-md hover:scale-[1.02]"
                >
                  La guida in regalo
                  <ArrowRight size={11} />
                </Link>
              </>
            ) : (
              <Link
                to="/media-kit"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink-deep,#1a2b3c)] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-xs transition-all duration-300 hover:bg-[var(--color-accent)] hover:shadow-md hover:scale-[1.02]"
              >
                <Send size={11} className="text-[var(--color-gold,#d4af37)]" />
                Richiedi Media Kit
              </Link>
            )}

            <div className="flex items-center space-x-1 pl-0.5">
              <Link
                to="/preferiti"
                className="relative p-1 text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-accent)]"
                aria-label={navigation.favoritesLabel}
              >
                <Heart size={16} strokeWidth={1.5} />
                {favorites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[9px] font-bold text-white">
                    {favorites.length}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={toggleLocale}
                className="rounded-full border border-[var(--color-border)] bg-white/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] cursor-pointer"
                title="Cambia lingua"
                aria-label="Cambia lingua"
              >
                {locale.toUpperCase()}
              </button>

              <div className="relative">
                {user ? (
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    aria-label="Menu utente"
                    aria-expanded={isUserMenuOpen}
                    className="h-7 w-7 overflow-hidden rounded-full border border-[var(--color-border)] transition-colors hover:border-[var(--color-accent)] cursor-pointer"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[var(--color-muted-bg)] text-[10px] font-bold">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={signIn}
                    aria-label="Accedi all'area personale"
                    className="flex items-center gap-1 p-1 transition-colors hover:text-[var(--color-accent)] cursor-pointer"
                  >
                    <UserIcon size={16} strokeWidth={1.5} />
                  </button>
                )}

                <AnimatePresence>
                  {isUserMenuOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 z-50 mt-3 w-52 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white py-2 text-[var(--color-ink)] shadow-xl"
                    >
                      <div className="mb-2 border-b border-[var(--color-border)] px-4 py-2">
                        <p className="truncate text-[10px] font-semibold text-[var(--color-ink)]">
                          {user.displayName}
                        </p>
                        <p className="truncate text-[11px] text-[var(--color-muted-fg)]">
                          {user.email}
                        </p>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-[10px] uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:bg-[var(--color-muted-bg)]"
                        >
                          <ShieldCheck size={12} /> Admin
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-[10px] uppercase tracking-wider text-[var(--color-error)] transition-colors hover:bg-[var(--color-error-soft)] cursor-pointer"
                      >
                        <LogOut size={12} /> Esci
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[var(--color-ink)] xl:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center p-2 transition-colors hover:text-[var(--color-accent)] cursor-pointer"
              aria-label={navigation.searchLabel}
            >
              <Search size={20} />
            </button>
            <button
              className="flex min-h-[44px] min-w-[44px] items-center justify-center p-2 transition-colors hover:text-[var(--color-accent)] cursor-pointer"
              onClick={handleMobileMenuToggle}
              aria-label="Menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <div
        aria-hidden="true"
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 z-[110] bg-black/90 backdrop-blur-md transition-opacity duration-200 xl:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        id="mobile-navigation"
        inert={!isMobileMenuOpen}
        aria-hidden={!isMobileMenuOpen}
        className={`fixed inset-y-0 right-0 z-[120] flex w-full transform-gpu flex-col bg-white shadow-2xl transition-transform duration-300 ease-out md:w-96 xl:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-serif font-medium tracking-tight text-[var(--color-ink)]"
          >
            Travellini<span className="font-bold text-[var(--color-accent)]">with</span>us
          </Link>
          <button
            className="rounded-full p-2.5 text-[var(--color-ink)] transition-colors hover:bg-[var(--color-muted-bg)] hover:text-[var(--color-accent)] cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Chiudi Menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Quick Search Trigger in Mobile Drawer */}
        <div className="px-6 pt-5 pb-2">
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsSearchOpen(true);
            }}
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-sand)]/60 px-4 py-3 text-xs text-[var(--color-muted-fg)] transition-all hover:border-[var(--color-accent)] cursor-pointer shadow-2xs"
          >
            <span className="flex items-center gap-2 font-medium">
              <Search size={15} className="text-[var(--color-accent)]" />
              Cerca destinazioni, storie, guide...
            </span>
            <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-ink)] shadow-2xs">
              {isMac ? '⌘K' : 'Ctrl+K'}
            </kbd>
          </button>
        </div>

        <div className="flex flex-1 flex-col space-y-6 overflow-y-auto px-6 py-6">
          {navItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div key={item.name}>
                {item.subLinks || item.primaryLinks ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <Link
                        to={item.href || '/'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 text-2xl font-serif transition-colors ${
                          isItemActive(item)
                            ? 'text-[var(--color-accent)] font-medium'
                            : 'text-[var(--color-ink)]'
                        }`}
                      >
                        {ItemIcon && (
                          <ItemIcon size={20} className="text-[var(--color-accent)]/80 shrink-0" />
                        )}
                        <span>{item.name}</span>
                        <SurfaceBadge path={item.href?.split('?')[0] ?? ''} />
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMobileSection((prev) => (prev === item.name ? null : item.name))
                        }
                        aria-expanded={openMobileSection === item.name}
                        aria-label={`Apri sottomenu ${item.name}`}
                        className="-m-2 flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-accent)] cursor-pointer"
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-300 ${
                            openMobileSection === item.name ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                    <AnimatePresence>
                      {openMobileSection === item.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="space-y-3 border-l-2 border-[var(--color-accent)]/20 ml-2 pl-4 py-1"
                        >
                          {item.primaryLinks
                            ? item.primaryLinks.map((subLink) => (
                                <Link
                                  key={subLink.name}
                                  to={subLink.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block py-1"
                                >
                                  <span className="block font-serif text-lg text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]">
                                    {subLink.name}
                                    <SurfaceBadge path={subLink.href.split('?')[0]} />
                                  </span>
                                  {subLink.description && (
                                    <span className="mt-0.5 block text-xs leading-snug text-black/55">
                                      {subLink.description}
                                    </span>
                                  )}
                                </Link>
                              ))
                            : item.subLinks?.map((subLink) => (
                                <Link
                                  key={subLink.name}
                                  to={subLink.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block py-1 text-lg text-[var(--color-ink)]/70 transition-colors hover:text-[var(--color-accent)]"
                                >
                                  {subLink.name}
                                  <SurfaceBadge path={subLink.href.split('?')[0]} />
                                </Link>
                              ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.href || '/'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 text-2xl font-serif transition-colors ${
                      isItemActive(item)
                        ? 'text-[var(--color-accent)] font-medium'
                        : 'text-[var(--color-ink)]'
                    }`}
                  >
                    {ItemIcon && (
                      <ItemIcon size={20} className="text-[var(--color-accent)]/80 shrink-0" />
                    )}
                    <span>{item.name}</span>
                    <SurfaceBadge path={item.href?.split('?')[0] ?? ''} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Sezione Collaborazioni (B2B) nel drawer mobile */}
        <div className="mx-6 my-2">
          <div className="overflow-hidden rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-ink-deep)] text-white shadow-lg">
            <div className="flex items-center gap-2 px-5 pt-5 pb-3 text-[var(--color-gold,#d4af37)]">
              <BriefcaseBusiness size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                Collaborazioni
              </span>
            </div>
            <nav className="flex flex-col gap-0.5 px-3 pb-2">
              <Link
                to="/collaborazioni"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-serif text-white/90 transition-colors hover:bg-white/10"
              >
                <Building2 size={16} className="text-[var(--color-gold,#d4af37)] shrink-0" />
                Come Lavoriamo
              </Link>
              <Link
                to="/chi-siamo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-serif text-white/90 transition-colors hover:bg-white/10"
              >
                <UserIcon size={16} className="text-[var(--color-gold,#d4af37)] shrink-0" />
                Chi Siamo
              </Link>
              <Link
                to="/contatti"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-serif text-white/90 transition-colors hover:bg-white/10"
              >
                <Send size={16} className="text-[var(--color-gold,#d4af37)] shrink-0" />
                Contatti
              </Link>
            </nav>
            <div className="px-5 pb-5 pt-1">
              <Link
                to="/media-kit"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
              >
                Richiedi Media Kit
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--color-ink)]/5 bg-[var(--color-sand)]/50 p-8">
          <div className="flex flex-col gap-6">
            <Link
              to="/guida-in-regalo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
            >
              La guida in regalo
              <ArrowRight size={14} />
            </Link>
            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/preferiti"
                aria-label={navigation.favoritesLabel}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
              >
                <Heart size={24} />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-white">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <a
                href={CONTACTS.instagramUrl}
                aria-label="Apri Instagram Travelliniwithus"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
              >
                <Instagram size={24} />
              </a>
              <a
                href={CONTACTS.tiktokUrl}
                aria-label="Apri TikTok Travelliniwithus"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1-.09z" />
                </svg>
              </a>
              <a
                href={CONTACTS.whatsappUrl}
                aria-label="Scrivici su WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
              >
                <MessageCircle size={24} />
              </a>
              <a
                href={CONTACTS.mailto}
                aria-label={`Scrivi a ${CONTACTS.email}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
              >
                <Mail size={24} />
              </a>
            </div>
            <div>
              {user ? (
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-error)]"
                >
                  <LogOut size={20} /> Esci
                </button>
              ) : (
                <button
                  onClick={signIn}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ink)]"
                >
                  <UserIcon size={20} /> Accedi
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
