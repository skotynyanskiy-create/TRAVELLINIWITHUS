import { lazy, Suspense, useEffect, useEffectEvent, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  Compass,
  Heart,
  Instagram,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
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
import { LITE_MODE } from '../config/liteMode';

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

  // IA definitiva (2026-07-04): due assi ortogonali — DOVE (Destinazioni) ×
  // COSA (Racconti). Mega-menu "Destinazioni" = browse geografico + anchor foto.
  const destinazioniLinks = useMemo<NavSubLink[]>(
    () => [
      {
        name: 'Italia',
        href: '/destinazione/italia',
        description: 'Borghi, food e posti insoliti, regione per regione.',
      },
      { name: 'Europa', href: '/destinazione/europa', description: 'Fughe a portata di volo.' },
      {
        name: 'Tutte le destinazioni',
        href: '/destinazione',
        description: 'Zona per zona, fino alla regione.',
      },
    ],
    []
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

  // Dropdown "Racconti" — l'asse editoriale (COSA leggere).
  const raccontiLinks = useMemo<NavSubLink[]>(() => {
    const all: NavSubLink[] = [
      { name: 'Articoli', href: '/esplora?format=storia' },
      { name: 'Guide', href: '/esplora?format=guida' },
      { name: 'Itinerari', href: '/itinerari' },
    ];
    if (!LITE_MODE) return all;
    return all.filter((l) => !l.href.startsWith('/esplora') && !l.href.startsWith('/itinerari'));
  }, []);

  const navItems = useMemo<NavItem[]>(() => {
    const all: NavItem[] = [
      {
        name: 'Destinazioni',
        href: '/destinazione',
        primaryLinks: LITE_MODE ? undefined : destinazioniLinks,
        feature: LITE_MODE ? undefined : destinazioniFeature,
      },
      { name: 'Esplora', href: '/esplora' },
      { name: 'Mappa', href: '/mappa' },
      { name: 'Racconti', href: '/esplora?format=storia', subLinks: raccontiLinks },
      {
        name: navigation.aboutLabel,
        href: '/chi-siamo',
        subLinks: [{ name: navigation.contactsLabel, href: '/contatti' }],
      },
      { name: 'Shop', href: '/shop' },
    ];
    if (!LITE_MODE) return all;
    const disabledHrefs = ['/esplora', '/shop', '/club', '/preferiti', '/itinerari'];
    // In LITE, rimuovi le voci il cui target primario è disabilitato e le voci
    // (es. Racconti) rimaste senza sotto-link utilizzabili.
    return all
      .filter((item) => !(item.name === 'Racconti' && (item.subLinks?.length ?? 0) === 0))
      .filter((item) => !item.href || !disabledHrefs.includes(item.href.split('?')[0]));
  }, [destinazioniLinks, destinazioniFeature, raccontiLinks, navigation]);

  const isItemActive = (item: NavItem) => {
    const path = location.pathname;

    if (item.name === 'Destinazioni') {
      return path.startsWith('/destinazione');
    }
    if (item.name === 'Esplora') {
      return path === '/esplora';
    }
    if (item.name === 'Racconti') {
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
        className={`fixed top-0 right-0 left-0 z-50 w-full border-b px-6 py-3 text-[var(--color-ink)] transition-all duration-500 md:px-10 md:py-4 ${
          isScrolled
            ? 'border-[var(--color-ink)]/12 bg-[var(--color-sand)]/95 shadow-[0_1px_0_rgba(10,10,10,0.04)] backdrop-blur-md'
            : 'border-[var(--color-ink)]/8 bg-[var(--color-sand)]/80 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <div className="flex shrink-0 items-center">
            <Link
              to="/"
              className="whitespace-nowrap font-serif text-xl font-medium tracking-tight text-[var(--color-ink)] transition-all duration-500 md:text-2xl xl:text-[1.7rem]"
            >
              Travellini<span className="font-bold text-[var(--color-accent)]">with</span>us
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center space-x-4 px-4 xl:flex xl:space-x-6 2xl:space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="group relative">
                <Link
                  to={item.href || '/'}
                  aria-current={isItemActive(item) ? 'page' : undefined}
                  aria-haspopup={item.subLinks || item.primaryLinks ? 'menu' : undefined}
                  className={`relative flex items-center gap-1 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 xl:text-[12px] xl:tracking-[0.2em] hover:text-[var(--color-accent)] after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:bg-[var(--color-accent)] after:origin-left after:transition-transform after:duration-300 ${
                    isItemActive(item)
                      ? 'text-[var(--color-accent)] after:scale-x-100'
                      : 'text-[var(--color-ink-2)] after:scale-x-0 hover:after:scale-x-100'
                  }`}
                >
                  {item.name}
                  {(item.subLinks || item.primaryLinks) && (
                    <ChevronDown size={12} className="opacity-50" />
                  )}
                </Link>

                {item.primaryLinks && item.feature && (
                  // Mega menu editoriale 2 colonne (Esplora). Layout calmo,
                  // foto-led, niente liste enciclopediche.
                  <div className="invisible absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div
                      role="menu"
                      className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-ink)]/5 bg-[var(--color-surface)] shadow-2xl w-[44rem]"
                    >
                      <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                        <div className="flex flex-col p-7">
                          <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
                            {item.name}
                          </span>
                          <ul className="flex flex-1 flex-col gap-1">
                            {item.primaryLinks.map((link) => {
                              const [path] = link.href.split('?');
                              const active =
                                location.pathname === path ||
                                (path === '/itinerari' &&
                                  location.pathname.startsWith('/itinerari/'));
                              return (
                                <li key={link.name}>
                                  <Link
                                    to={link.href}
                                    role="menuitem"
                                    className={`group/link block rounded-[var(--radius-md)] px-4 py-3 transition-colors hover:bg-[var(--color-sand)] ${
                                      active ? 'bg-[var(--color-sand)]' : ''
                                    }`}
                                  >
                                    <span
                                      className={`block font-serif text-[17px] leading-tight transition-colors ${
                                        active
                                          ? 'text-[var(--color-accent)]'
                                          : 'text-[var(--color-ink)] group-hover/link:text-[var(--color-accent)]'
                                      }`}
                                    >
                                      {link.name}
                                    </span>
                                    {link.description && (
                                      <span className="mt-1 block text-[12px] leading-snug text-black/55">
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
                          className="group/feat relative flex flex-col justify-end overflow-hidden bg-[var(--color-ink-deep)] p-7 text-white"
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
                            <p className="mt-3 font-serif text-[22px] leading-tight">
                              {item.feature.title}
                            </p>
                            <p className="mt-2 text-[13px] leading-snug text-white/82">
                              {item.feature.description}
                            </p>
                            <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-on-dark)]">
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
                  // Dropdown semplice per gli altri voci (Collaborazioni, Chi siamo).
                  <div className="invisible absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div
                      role="menu"
                      className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-ink)]/5 bg-[var(--color-surface)] py-4 shadow-2xl w-60"
                    >
                      {item.subLinks.map((subLink) => (
                        <Link
                          key={subLink.name}
                          to={subLink.href}
                          role="menuitem"
                          className={`block px-8 py-3 text-[10px] uppercase tracking-[0.2em] transition-all duration-200 hover:bg-[var(--color-sand)] hover:text-[var(--color-accent)] ${
                            isSubLinkActive(item, subLink.href)
                              ? 'text-[var(--color-accent)]'
                              : 'text-[var(--color-muted-fg-2)]'
                          }`}
                        >
                          {subLink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden shrink-0 items-center space-x-4 text-[var(--color-ink-2)] xl:flex xl:space-x-6">
            {/* CTA primaria reader-first (il pubblico è ~99% lettori). "Collabora"
                resta come link secondario discreto — B2B ha già Footer + card Esplora. */}
            <Link
              to="/collaborazioni"
              className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-accent)]"
            >
              Collabora
            </Link>
            <Link
              to="/vieni-con-noi"
              className="inline-flex items-center gap-1 rounded-full border border-[var(--color-accent)]/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)] transition-colors hover:bg-[var(--color-accent-soft)]"
            >
              Vieni con noi
            </Link>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-muted-bg)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:border-[var(--color-muted-bg-2)] xl:px-4 whitespace-nowrap"
              aria-label={navigation.searchLabel}
            >
              <Search size={12} />
              <span className="hidden xl:inline">{navigation.searchLabel}</span>
            </button>

            {!LITE_MODE && (
              <Link
                to="/preferiti"
                className="relative transition-colors hover:text-[var(--color-accent)]"
                aria-label={navigation.favoritesLabel}
              >
                <Heart size={18} strokeWidth={1.5} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-white">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}

            <div className="relative">
              {user ? (
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  aria-label="Menu utente"
                  aria-expanded={isUserMenuOpen}
                  className="h-7 w-7 overflow-hidden rounded-full border border-[var(--color-border)] transition-colors hover:border-[var(--color-accent)]"
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
                  className="flex items-center gap-1 transition-colors hover:text-[var(--color-accent)]"
                >
                  <UserIcon size={18} strokeWidth={1.5} />
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
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-[10px] uppercase tracking-wider text-[var(--color-error)] transition-colors hover:bg-[var(--color-error-soft)]"
                    >
                      <LogOut size={12} /> Esci
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[var(--color-ink)] xl:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 transition-colors hover:text-[var(--color-accent)]"
              aria-label={navigation.searchLabel}
            >
              <Search size={20} />
            </button>
            <button
              className="p-2 transition-colors hover:text-[var(--color-accent)]"
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
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-6">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-serif font-medium tracking-tight text-[var(--color-ink)]"
          >
            Travellini<span className="font-bold text-[var(--color-accent)]">with</span>us
          </Link>
          <button
            className="rounded-full p-3 text-[var(--color-ink)] transition-colors hover:bg-[var(--color-muted-bg)] hover:text-[var(--color-accent)]"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Chiudi Menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 flex-col space-y-6 overflow-y-auto px-8 py-10">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.subLinks || item.primaryLinks ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      to={item.href || '/'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block text-3xl font-serif transition-colors ${
                        isItemActive(item)
                          ? 'text-[var(--color-accent)]'
                          : 'text-[var(--color-ink)]'
                      }`}
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMobileSection((prev) => (prev === item.name ? null : item.name))
                      }
                      aria-expanded={openMobileSection === item.name}
                      aria-label={`Apri sottomenu ${item.name}`}
                      className="-m-2 flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${
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
                        className="space-y-4 border-l border-[var(--color-accent)]/20 pl-4"
                      >
                        {item.primaryLinks
                          ? item.primaryLinks.map((subLink) => (
                              <Link
                                key={subLink.name}
                                to={subLink.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block"
                              >
                                <span className="block font-serif text-xl text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]">
                                  {subLink.name}
                                </span>
                                {subLink.description && (
                                  <span className="mt-1 block text-sm text-black/55">
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
                                className="block text-xl text-[var(--color-ink)]/60 transition-colors hover:text-[var(--color-accent)]"
                              >
                                {subLink.name}
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
                  className={`block text-3xl font-serif transition-colors ${
                    isItemActive(item) ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink)]'
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--color-ink)]/5 bg-[var(--color-sand)]/50 p-8">
          <div className="flex flex-col gap-6">
            <Link
              to="/vieni-con-noi"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
            >
              Vieni con noi
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/collaborazioni"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-accent)]"
            >
              Collabora con noi
            </Link>
            <div className="flex flex-wrap items-center gap-5">
              {!LITE_MODE && (
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
              )}
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
