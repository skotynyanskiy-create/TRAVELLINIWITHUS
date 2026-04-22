import { lazy, Suspense, useEffect, useEffectEvent, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
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
import { Link, useLocation } from 'react-router-dom';
import { CONTACTS } from '../config/site';
import {
  DESTINATION_GROUPS,
  EXPERIENCE_TYPES,
  GUIDE_CATEGORIES,
  slugifyExperienceType,
  slugifyGuideCategory,
} from '../config/contentTaxonomy';
import { siteContentDefaults } from '../config/siteContent';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useSiteContent } from '../hooks/useSiteContent';

const SearchModal = lazy(() => import('./SearchModal'));

interface NavSubLink {
  name: string;
  href: string;
}

interface NavSubGroup {
  label: string;
  href: string;
  links: NavSubLink[];
}

interface NavItem {
  name: string;
  href?: string;
  subLinks?: NavSubLink[];
  subGroups?: NavSubGroup[];
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

  const destinationLinks = useMemo(
    () =>
      DESTINATION_GROUPS.map((group) => ({
        name: group,
        href: `/destinazioni?group=${encodeURIComponent(group)}`,
      })),
    []
  );

  const experienceLinks = useMemo(
    () =>
      EXPERIENCE_TYPES.map((type) => ({
        name: type,
        href: `/esperienze?type=${slugifyExperienceType(type)}`,
      })),
    []
  );

  const guideLinks = useMemo(
    () =>
      GUIDE_CATEGORIES.map((cat) => ({
        name: cat,
        href: `/guide?cat=${slugifyGuideCategory(cat)}`,
      })),
    []
  );

  const exploreGroups = useMemo<NavSubGroup[]>(
    () => [
      {
        label: 'Per luogo',
        href: '/destinazioni',
        links: [{ name: 'Tutte le destinazioni', href: '/destinazioni' }, ...destinationLinks],
      },
      {
        label: 'Per esperienza',
        href: '/esperienze',
        links: [{ name: 'Tutte le esperienze', href: '/esperienze' }, ...experienceLinks],
      },
      {
        label: 'Guide',
        href: '/guide',
        links: [{ name: 'Tutte le guide', href: '/guide' }],
      },
    ],
    [destinationLinks, experienceLinks]
  );

  const navItems = useMemo<NavItem[]>(
    () => [
      {
        name: 'Esplora',
        href: '/destinazioni',
        subGroups: exploreGroups,
      },
      { name: navigation.resourcesLabel, href: '/risorse' },
      {
        name: navigation.collaborationsLabel,
        href: '/collaborazioni',
        subLinks: [{ name: navigation.mediaKitLabel, href: '/media-kit' }],
      },
      {
        name: navigation.aboutLabel,
        href: '/chi-siamo',
        subLinks: [{ name: navigation.contactsLabel, href: '/contatti' }],
      },
    ],
    [exploreGroups, navigation]
  );

  const isItemActive = (item: NavItem) => {
    if (item.name === 'Esplora') {
      return (
        location.pathname === '/destinazioni' ||
        location.pathname === '/esperienze' ||
        location.pathname === '/guide'
      );
    }

    if (item.href && item.href !== '#' && location.pathname === item.href) {
      return true;
    }

    if (item.subGroups) {
      return item.subGroups.some((group) => {
        if (location.pathname === group.href) return true;
        return group.links.some((subLink) => location.pathname === subLink.href);
      });
    }

    if (!item.subLinks) return false;

    return item.subLinks.some((subLink) => {
      if (subLink.href.startsWith('/destinazioni?') || subLink.href.startsWith('/esperienze?')) {
        return location.pathname === item.href;
      }
      return location.pathname === subLink.href;
    });
  };

  const isSubLinkActive = (item: NavItem, href: string) => {
    const [subLinkPath, subLinkSearch] = href.split('?');

    if (
      href.startsWith('/destinazioni?') ||
      href.startsWith('/esperienze?') ||
      href.startsWith('/guide?')
    ) {
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
        className={`fixed top-4 left-4 right-4 z-50 w-[calc(100%-2rem)] rounded-full border px-6 py-3 text-[var(--color-ink)] transition-all duration-700 md:top-6 md:left-1/2 md:w-[96%] md:-translate-x-1/2 md:px-8 md:py-4 lg:w-[calc(100%-4rem)] max-w-[1400px] ${
          isScrolled
            ? 'border-[var(--color-ink)]/5 bg-[var(--color-surface)]/80 saturate-[150%] shadow-[0_8px_32px_0_rgba(10,10,10,0.08)] backdrop-blur-[40px]'
            : 'border-white/40 bg-white/50 shadow-sm backdrop-blur-xl'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex shrink-0 items-center">
            <Link
              to="/"
              className="whitespace-nowrap text-lg font-serif font-medium tracking-tight text-[var(--color-ink)] transition-all duration-500 md:text-xl xl:text-2xl"
            >
              Travellini<span className="font-bold text-[var(--color-accent)]">with</span>us
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center space-x-4 px-4 lg:flex xl:space-x-6 2xl:space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="group relative">
                <Link
                  to={item.href || '/'}
                  className={`relative flex items-center gap-1 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 xl:text-[12px] xl:tracking-[0.2em] hover:text-[var(--color-accent)] after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:bg-[var(--color-accent)] after:origin-left after:transition-transform after:duration-300 ${
                    isItemActive(item)
                      ? 'text-[var(--color-accent)] after:scale-x-100'
                      : 'text-zinc-600 after:scale-x-0 hover:after:scale-x-100'
                  }`}
                >
                  {item.name}
                  {(item.subLinks || item.subGroups) && (
                    <ChevronDown size={12} className="opacity-50" />
                  )}
                </Link>

                {(item.subLinks || item.subGroups) && (
                  <div className="invisible absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                    <div
                      className={`relative overflow-hidden rounded-3xl border border-[var(--color-ink)]/5 bg-[var(--color-surface)] py-4 shadow-2xl ${
                        item.subGroups
                          ? item.subGroups.length >= 3
                            ? 'w-[46rem]'
                            : 'w-[34rem]'
                          : 'w-60'
                      }`}
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[var(--color-accent)]" />
                      {item.subGroups ? (
                        <div
                          className={`grid gap-3 px-4 py-2 ${
                            item.subGroups.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'
                          }`}
                        >
                          {item.subGroups.map((group) => (
                            <div key={group.label}>
                              <Link
                                to={group.href}
                                className="mb-2 block rounded-2xl bg-[var(--color-sand)] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                              >
                                {group.label}
                              </Link>
                              <div className="space-y-1">
                                {group.links.map((subLink) => (
                                  <Link
                                    key={subLink.name}
                                    to={subLink.href}
                                    className={`block rounded-xl px-4 py-2 text-[10px] uppercase tracking-[0.16em] transition-all duration-200 hover:bg-[var(--color-sand)] hover:text-[var(--color-accent)] ${
                                      isSubLinkActive(item, subLink.href)
                                        ? 'text-[var(--color-accent)]'
                                        : 'text-[var(--color-ink)]/50'
                                    }`}
                                  >
                                    {subLink.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        item.subLinks?.map((subLink) => (
                          <Link
                            key={subLink.name}
                            to={subLink.href}
                            className={`block px-8 py-3 text-[10px] uppercase tracking-[0.2em] transition-all duration-200 hover:bg-[var(--color-sand)] hover:text-[var(--color-accent)] ${
                              isSubLinkActive(item, subLink.href)
                                ? 'text-[var(--color-accent)]'
                                : 'text-[var(--color-ink)]/50'
                            }`}
                          >
                            {subLink.name}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden shrink-0 items-center space-x-4 text-zinc-600 lg:flex xl:space-x-6">
            <Link
              to="/collaborazioni"
              className="hidden items-center gap-1 rounded-full border border-[var(--color-accent)]/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)] transition-colors hover:bg-[var(--color-accent-soft)] xl:inline-flex"
            >
              Collabora con noi
            </Link>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] transition-all hover:border-zinc-300 xl:px-4 whitespace-nowrap"
              aria-label={navigation.searchLabel}
            >
              <Search size={12} />
              <span className="hidden xl:inline">{navigation.searchLabel}</span>
            </button>

            <Link
              to="/preferiti"
              className="relative transition-colors hover:text-[var(--color-accent)]"
              aria-label={navigation.favoritesLabel}
            >
              <Heart size={18} strokeWidth={1.5} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[9px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>

            <div className="relative">
              {user ? (
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  aria-label="Account"
                  className="h-7 w-7 overflow-hidden rounded-full border border-zinc-200 transition-colors hover:border-[var(--color-accent)]"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-[10px] font-bold">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={signIn}
                  aria-label="Accedi"
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
                    className="absolute right-0 z-50 mt-3 w-52 overflow-hidden rounded-xl border border-zinc-100 bg-white py-2 text-[var(--color-ink)] shadow-xl"
                  >
                    <div className="mb-2 border-b border-zinc-100 px-4 py-2">
                      <p className="truncate text-[10px] font-semibold text-zinc-900">
                        {user.displayName}
                      </p>
                      <p className="truncate text-[9px] text-zinc-500">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-[10px] uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:bg-zinc-50"
                      >
                        <ShieldCheck size={12} /> Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-[10px] uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut size={12} /> Esci
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[var(--color-ink)] lg:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 transition-colors hover:text-[var(--color-accent)]"
              aria-label={navigation.searchLabel}
            >
              <Search size={20} />
            </button>
            <button
              className="p-2 transition-colors hover:text-[var(--color-accent)]"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md lg:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-[120] flex w-full flex-col bg-white shadow-2xl md:w-96 lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-6">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-serif font-medium tracking-tight text-[var(--color-ink)]"
                >
                  Travellini<span className="font-bold text-[var(--color-accent)]">with</span>us
                </Link>
                <button
                  className="rounded-full p-3 text-[var(--color-ink)] transition-colors hover:bg-zinc-100 hover:text-[var(--color-accent)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Chiudi Menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-1 flex-col space-y-6 overflow-y-auto px-8 py-10">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.subLinks || item.subGroups ? (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <Link
                            to={item.href || '/'}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block text-3xl font-serif uppercase tracking-widest transition-colors ${
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
                              setOpenMobileSection((prev) =>
                                prev === item.name ? null : item.name
                              )
                            }
                            aria-expanded={openMobileSection === item.name}
                            aria-label={`Apri sottomenu ${item.name}`}
                            className="pt-2 text-xl opacity-40 transition-opacity hover:opacity-100"
                          >
                            {openMobileSection === item.name ? '-' : '+'}
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
                              {item.subGroups
                                ? item.subGroups.map((group) => (
                                    <div key={group.label} className="space-y-3">
                                      <Link
                                        to={group.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-sm font-bold uppercase tracking-widest text-[var(--color-accent)]"
                                      >
                                        {group.label}
                                      </Link>
                                      <div className="space-y-3 pl-3">
                                        {group.links.map((subLink) => (
                                          <Link
                                            key={subLink.name}
                                            to={subLink.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block text-lg text-[var(--color-ink)]/60 transition-colors hover:text-[var(--color-accent)]"
                                          >
                                            {subLink.name}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
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
                        className={`block text-3xl font-serif uppercase tracking-widest transition-colors ${
                          isItemActive(item)
                            ? 'text-[var(--color-accent)]'
                            : 'text-[var(--color-ink)]'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-[var(--color-ink)]/5 bg-[var(--color-sand)]/50 p-8">
                <div className="flex flex-col gap-6">
                  <Link
                    to="/collaborazioni"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
                  >
                    Collabora con noi
                    <ArrowRight size={14} />
                  </Link>
                  <div className="flex flex-wrap items-center gap-5">
                    <Link
                      to="/preferiti"
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
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      <Instagram size={24} />
                    </a>
                    <a
                      href={CONTACTS.tiktokUrl}
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
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      <MessageCircle size={24} />
                    </a>
                    <a
                      href={CONTACTS.mailto}
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
                        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-600"
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
