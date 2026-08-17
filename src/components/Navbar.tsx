import { lazy, Suspense, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  type LucideIcon,
  ArrowRight,
  Baby,
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
  SlidersHorizontal,
  Sparkles,
  Tag,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from '@/src/components/TransitionLink';
import { CONTACTS } from '../config/site';
import { getAudienceHomePath } from '../config/audienceInterests';
import { AUDIENCE_EDITIONS } from '../config/audienceEditions';
import { siteContentDefaults } from '../config/siteContent';
import { useAudience } from '../context/AudienceContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useSiteContent } from '../hooks/useSiteContent';
import { getLocale, setLocale } from '../i18n';
import { trackAnalyticsEvent } from '../services/analytics';
import AudienceEditionChip from './AudienceEditionChip';
import EditionBand from './EditionBand';
import SurfaceBadge from './SurfaceBadge';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useOverlayLayer } from '../hooks/useOverlayLayer';

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
  href: string;
  /** Solo per il drawer mobile: il registro desktop non porta icone (DESIGN §3). */
  icon?: LucideIcon;
  /** Lista di link primari editoriali per il pannello 2 colonne. Al massimo una voce per edizione (DESIGN §5). */
  primaryLinks?: NavSubLink[];
  feature?: NavFeature;
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuCloseButtonRef = useRef<HTMLButtonElement>(null);
  const isMobileMenuTopLayer = useOverlayLayer(isMobileMenuOpen);

  useFocusTrap(isMobileMenuOpen, mobileMenuRef, mobileMenuCloseButtonRef, isMobileMenuTopLayer);

  // Rileva OS per mostrare shortcut corretto (⌘K su Mac, Ctrl+K su Windows/Linux)
  const isMac = useMemo(
    () => typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform),
    []
  );

  const location = useLocation();
  const { favorites } = useFavorites();
  const { user, signIn, signOut } = useAuth();
  const { data: navigationContent } = useSiteContent('navigation');
  const navigation = navigationContent ?? siteContentDefaults.navigation;

  const resetNavigationUi = useEffectEvent(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileSection(null);
  });

  const [locale, setLocaleState] = useState(getLocale());

  const toggleLocale = () => {
    const next = locale === 'it' ? 'en' : 'it';
    setLocale(next);
    setLocaleState(next);
  };

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

  useEffect(() => {
    if (!isMobileMenuOpen || !isMobileMenuTopLayer) return;

    const handleMobileMenuEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsMobileMenuOpen(false);
      setOpenMobileSection(null);
    };

    window.addEventListener('keydown', handleMobileMenuEscape);
    return () => window.removeEventListener('keydown', handleMobileMenuEscape);
  }, [isMobileMenuOpen, isMobileMenuTopLayer]);

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

  const navigate = useNavigate();
  const { audience, userAudience, hasChosen, setAudience } = useAudience();

  const isFamilyRoute = location.pathname.startsWith('/family');
  const isBrandRoute =
    location.pathname.startsWith('/collaborazioni') || location.pathname.startsWith('/media-kit');

  // Le tre edizioni: 3-4 voci, un sostantivo ciascuna, `whitespace-nowrap` su
  // tutte — mai un pannello oltre a "Mete" (DESIGN §2, §5; COPY §3).
  const viaggiatoriItems = useMemo<NavItem[]>(
    () => [
      {
        name: navigation.destinationsLabel,
        href: '/destinazione',
        icon: MapPin,
        primaryLinks: destinazioniLinks,
        feature: destinazioniFeature,
      },
      { name: navigation.storiesLabel, href: '/esplora', icon: Sparkles },
      { name: navigation.mapLabel, href: '/mappa', icon: MapPin },
      { name: navigation.aboutLabel, href: '/chi-siamo', icon: UserIcon },
    ],
    [navigation, destinazioniLinks, destinazioniFeature]
  );

  const familyItems = useMemo<NavItem[]>(
    () => [
      { name: navigation.familyHomeLabel, href: '/family', icon: Baby },
      { name: navigation.familyAdviceLabel, href: '/family/consigli', icon: Sparkles },
      { name: navigation.familyShopLabel, href: '/family/shop', icon: Tag },
      { name: navigation.aboutLabel, href: '/chi-siamo', icon: UserIcon },
    ],
    [navigation]
  );

  const brandItems = useMemo<NavItem[]>(
    () => [
      { name: navigation.collaborationsLabel, href: '/collaborazioni', icon: Building2 },
      { name: navigation.aboutLabel, href: '/chi-siamo', icon: UserIcon },
      { name: navigation.contactsLabel, href: '/contatti', icon: Send },
    ],
    [navigation]
  );

  const navItems =
    audience === 'family' ? familyItems : audience === 'brand' ? brandItems : viaggiatoriItems;

  // Slot D — azione. Family non ha CTA finché `getFamilyDeals()` non trova
  // almeno una voce con campo `deal` in `family-content-seed.json` (0
  // occorrenze oggi, verificato): la barra non promette sconti che il sito
  // non ha. Riaccensione: quando quella condizione cambia, ripristinare qui
  // un Link a `/family/shop` con testo "I codici attivi" (COPY §4, §11).
  const desktopCta =
    audience === 'brand' ? (
      <Link
        to="/media-kit"
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink-deep)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[var(--color-accent-hover)]"
      >
        Il media kit
        <ArrowRight size={13} />
      </Link>
    ) : audience === 'family' ? null : (
      <Link
        to="/guida-in-regalo"
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-accent-hover,#b34d28)]"
      >
        La guida in regalo
        <ArrowRight size={13} />
      </Link>
    );

  const isItemActive = (item: NavItem, path: string = location.pathname) => {
    if (item.href === '/destinazione') {
      return path.startsWith('/destinazione');
    }
    // La voce editoriale copre tutto ciò che si legge, non solo l'archivio:
    // articolo, guida e itinerario stanno sotto di lei.
    if (item.href === '/esplora') {
      return (
        path === '/esplora' ||
        path.startsWith('/articolo') ||
        path.startsWith('/guide') ||
        path.startsWith('/itinerari')
      );
    }

    if (path === item.href.split('?')[0]) {
      return true;
    }

    if (item.primaryLinks) {
      return item.primaryLinks.some((link) => path === link.href.split('?')[0]);
    }

    return false;
  };

  // Cambiare edizione da una rotta che esiste anche in quella di destinazione
  // (`/chi-siamo` è nei tre menu) non deve teletrasportare: naviga solo se la
  // rotta corrente non c'è nel menu dell'edizione scelta.
  const routeExistsInEdition = (items: NavItem[], path: string) =>
    items.some((item) => isItemActive(item, path));

  // Il gate del primo accesso è spento (2026-08-17): la prima scelta si fa
  // nella testata estesa, che passa qui `surface: 'testa-estesa'` così
  // l'evento resta distinguibile dal cambio ordinario in fascia/drawer.
  const handleModeSwitch = (
    next: 'viaggiatori' | 'family' | 'brand',
    surface: 'fascia' | 'drawer' | 'testa-estesa'
  ) => {
    trackAnalyticsEvent('audience_switch', {
      from: audience,
      to: next,
      surface,
      path: location.pathname,
    });
    setAudience(next);

    const alreadyThere =
      next === 'brand'
        ? isBrandRoute
        : next === 'family'
          ? isFamilyRoute
          : !isBrandRoute && !isFamilyRoute;
    if (alreadyThere) return;

    const targetItems =
      next === 'brand' ? brandItems : next === 'family' ? familyItems : viaggiatoriItems;
    if (routeExistsInEdition(targetItems, location.pathname)) return;

    if (next === 'brand') navigate('/collaborazioni');
    else if (next === 'family') navigate('/family');
    else navigate('/');
  };

  return (
    <>
      <Suspense fallback={null}>
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </Suspense>

      {/* La pillola galleggiante — un oggetto contenuto, non più una barra a
          filo dei bordi. Margine dallo schermo (px-3 pt-3 / md:px-6 md:pt-4),
          angoli e bordo dai token, ombra ristretta: niente blur, niente
          doppia ombra, niente animazione d'ingresso — quel vocabolario resta
          fuori (CLAUDE.md, niente glassmorphism sulle pagine pubbliche).
          Altezza totale: 68px mobile (pt-3 12 + h-14 56) / 72px desktop
          (pt-4 16 + h-14 56) — invariante di edizione, la decide solo lo
          slot marchio (DESIGN §1, §2 invariante 1). Il commutatore sotto
          conosce questo numero (EditionBand.tsx: pt-[76px] / md:pt-20). */}
      <header className="fixed top-0 right-0 left-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
        <div className="mx-auto flex h-14 max-w-[1360px] items-center justify-between gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-sand)] px-4 text-[var(--color-ink)] shadow-[var(--shadow-sm)] md:px-6">
          {/* SLOT A — MARCHIO. Solo il lockup + il pallino accent: nient'altro si attacca mai. */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/"
              className="group whitespace-nowrap font-serif text-xl font-medium tracking-tight text-[var(--color-ink)] md:text-2xl"
            >
              Travellini
              {/* Testo su chiaro: --color-accent è il riempimento (3,13:1), non
                  il testo. Il marchio passa AA solo con --color-accent-text. */}
              <span className="font-bold text-[var(--color-accent-text)] transition-colors group-hover:text-[var(--color-accent-hover)]">
                with
              </span>
              us
            </Link>
            <AudienceEditionChip />
          </div>

          {/* SLOT B — VOCI (desktop, ≥lg). 3-4 voci, un sostantivo ciascuna, mai a capo. */}
          <AnimatePresence mode="wait">
            <motion.div
              key={audience}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="hidden min-w-0 flex-1 items-center justify-center gap-x-7 lg:flex xl:gap-x-9"
            >
              {navItems.map((item) => {
                const active = isItemActive(item);
                const hasPanel = Boolean(item.primaryLinks && item.feature);
                return (
                  <div key={item.name} className="group relative shrink-0">
                    <Link
                      to={item.href}
                      aria-current={active ? 'page' : undefined}
                      aria-haspopup={hasPanel ? 'menu' : undefined}
                      className={`relative flex items-center gap-1 whitespace-nowrap border-b pb-[6px] font-serif text-sm transition-colors ${
                        active
                          ? 'border-[var(--color-accent)] text-[var(--color-ink)]'
                          : 'border-transparent text-[var(--color-ink)] hover:text-[var(--color-accent-text)]'
                      }`}
                    >
                      <span>{item.name}</span>
                      <SurfaceBadge path={item.href.split('?')[0]} />
                      {hasPanel && (
                        <ChevronDown
                          size={11}
                          className="opacity-60 transition-transform duration-300 group-hover:rotate-180"
                        />
                      )}
                    </Link>

                    {hasPanel && item.feature && (
                      <div className="invisible absolute top-full left-1/2 z-50 -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                        <div
                          role="menu"
                          className="relative w-[40rem] overflow-hidden rounded-3xl border border-[var(--color-ink)]/10 bg-[var(--color-surface)]/98 shadow-2xl backdrop-blur-2xl"
                        >
                          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                            <div className="flex flex-col p-6">
                              <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
                                {item.name}
                              </span>
                              <ul className="flex flex-1 flex-col gap-1">
                                {item.primaryLinks?.map((link) => {
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
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* SLOT C+D — RICERCA + AZIONE (desktop, ≥lg). Sans maiuscolo = azione. */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label={navigation.searchLabel}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-ink)]/5 hover:text-[var(--color-accent-text)]"
            >
              <Search size={16} />
            </button>

            {desktopCta}
          </div>

          {/* Controlli mobile (<lg) */}
          <div className="flex items-center gap-1 text-[var(--color-ink)] lg:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center p-2 transition-colors hover:text-[var(--color-accent)]"
              aria-label={navigation.searchLabel}
            >
              <Search size={20} />
            </button>
            <button
              className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center p-2 transition-colors hover:text-[var(--color-accent)]"
              onClick={handleMobileMenuToggle}
              aria-label="Menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Il commutatore — secondo oggetto contenuto, sotto la pillola. NON è
          `fixed`: appartiene al flusso del documento e scorre via con la
          pagina quando si scrolla (la pillola resta appiccicata da sola).
          Riserva anche lo spazio della pillola fissa qui sopra (il proprio
          `pt-`) — nessun'altra pagina deve più farlo (PageLayout.tsx e le
          pagine "flat" non hanno più bisogno di `pt-28`/`mt-28`: lo spazio è
          già reale, non riservato a mano). */}
      <EditionBand
        audience={audience}
        userAudience={userAudience}
        hasChosen={hasChosen}
        onSwitch={(next) => handleModeSwitch(next, hasChosen ? 'fascia' : 'testa-estesa')}
      />

      <div
        aria-hidden="true"
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 z-[110] bg-black/90 backdrop-blur-md transition-opacity duration-200 lg:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        ref={mobileMenuRef}
        id="mobile-navigation"
        inert={!isMobileMenuOpen}
        aria-hidden={!isMobileMenuOpen}
        role={isMobileMenuOpen ? 'dialog' : undefined}
        aria-modal={isMobileMenuOpen ? true : undefined}
        aria-label={isMobileMenuOpen ? 'Menu di navigazione' : undefined}
        className={`fixed inset-y-0 right-0 z-[120] flex w-full transform-gpu flex-col bg-white shadow-2xl transition-transform duration-300 ease-out md:w-96 lg:hidden ${
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
            ref={mobileMenuCloseButtonRef}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2.5 text-[var(--color-ink)] transition-colors hover:bg-[var(--color-muted-bg)] hover:text-[var(--color-accent)] cursor-pointer"
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
            className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-sand)]/60 px-4 py-3 text-xs text-[var(--color-muted-fg)] transition-all hover:border-[var(--color-accent)] cursor-pointer shadow-2xs"
          >
            <span className="flex items-center gap-2 font-medium">
              <Search size={15} className="text-[var(--color-accent)]" />
              Cerca mete, racconti, guide…
            </span>
            <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-ink)] shadow-2xs">
              {isMac ? '⌘K' : 'Ctrl+K'}
            </kbd>
          </button>
        </div>

        {/* Audience switcher (mobile) — stessa scelta a 3 dello switcher desktop */}
        <div className="px-6 pt-3 pb-1">
          <div
            className="flex items-center rounded-full border border-[var(--color-ink)]/8 bg-[var(--color-ink)]/5 p-0.5"
            role="group"
            aria-label="Scegli l'edizione"
          >
            {AUDIENCE_EDITIONS.map(({ key, title, icon: SwitchIcon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  handleModeSwitch(key, 'drawer');
                  setIsMobileMenuOpen(false);
                }}
                aria-label={`Passa all'edizione ${title}`}
                className={`flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-full px-2 py-2 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  audience === key
                    ? key === 'brand'
                      ? 'bg-[var(--color-ink-deep)] text-white shadow-2xs'
                      : 'bg-white text-[var(--color-ink)] shadow-2xs'
                    : 'text-[var(--color-ink)]/70'
                }`}
              >
                <SwitchIcon
                  size={12}
                  className={
                    audience === key
                      ? key === 'brand'
                        ? 'text-[var(--color-accent-on-dark)]'
                        : 'text-[var(--color-accent)]'
                      : 'opacity-60'
                  }
                />
                <span>{title}</span>
              </button>
            ))}
          </div>
          <Link
            to={`${getAudienceHomePath(audience)}#personalizza-esperienza`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-3 flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]"
          >
            <SlidersHorizontal size={14} aria-hidden /> Cosa cerchi oggi
          </Link>
        </div>

        <div className="flex flex-1 flex-col space-y-6 overflow-y-auto px-6 py-6">
          {navItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div key={item.name}>
                {item.primaryLinks ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex min-h-[44px] items-center gap-3 text-2xl font-serif transition-colors ${
                          isItemActive(item)
                            ? 'text-[var(--color-accent)] font-medium'
                            : 'text-[var(--color-ink)]'
                        }`}
                      >
                        {ItemIcon && (
                          <ItemIcon size={20} className="text-[var(--color-accent)]/80 shrink-0" />
                        )}
                        <span>{item.name}</span>
                        <SurfaceBadge path={item.href.split('?')[0]} />
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
                          {item.primaryLinks.map((subLink) => (
                            <Link
                              key={subLink.name}
                              to={subLink.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex min-h-[44px] flex-col justify-center py-1"
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
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex min-h-[44px] items-center gap-3 text-2xl font-serif transition-colors ${
                      isItemActive(item)
                        ? 'text-[var(--color-accent)] font-medium'
                        : 'text-[var(--color-ink)]'
                    }`}
                  >
                    {ItemIcon && (
                      <ItemIcon size={20} className="text-[var(--color-accent)]/80 shrink-0" />
                    )}
                    <span>{item.name}</span>
                    <SurfaceBadge path={item.href.split('?')[0]} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Cross-sell Collaborazioni nel drawer mobile — solo in edizione
            viaggiatori: in family/brand sarebbe un doppione (family non è il
            pubblico giusto, brand la vede già come voce di menu primaria). */}
        <div className={`mx-6 my-2 ${audience === 'viaggiatori' ? '' : 'hidden'}`}>
          <div className="overflow-hidden rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-ink-deep)] text-white shadow-lg">
            <div className="flex items-center gap-2 px-5 pt-5 pb-3 text-[var(--color-accent-on-dark)]">
              <Building2 size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                {navigation.collaborationsLabel}
              </span>
            </div>
            <nav className="flex flex-col gap-0.5 px-3 pb-2">
              <Link
                to="/collaborazioni"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-serif text-white/90 transition-colors hover:bg-white/10"
              >
                <Building2 size={16} className="text-[var(--color-accent-on-dark)] shrink-0" />
                {navigation.collaborationsLabel}
              </Link>
              <Link
                to="/chi-siamo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-serif text-white/90 transition-colors hover:bg-white/10"
              >
                <UserIcon size={16} className="text-[var(--color-accent-on-dark)] shrink-0" />
                {navigation.aboutLabel}
              </Link>
              <Link
                to="/contatti"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-serif text-white/90 transition-colors hover:bg-white/10"
              >
                <Send size={16} className="text-[var(--color-accent-on-dark)] shrink-0" />
                {navigation.contactsLabel}
              </Link>
            </nav>
            <div className="px-5 pb-5 pt-1">
              <Link
                to="/media-kit"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all hover:brightness-110"
              >
                Il media kit
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--color-ink)]/5 bg-[var(--color-sand)]/50 p-8">
          <div className="flex flex-col gap-6">
            {audience === 'family' ? null : audience === 'brand' ? (
              <Link
                to="/media-kit"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink-deep)] px-6 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[var(--color-accent-hover)]"
              >
                Il media kit
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link
                to="/guida-in-regalo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all hover:brightness-110"
              >
                La guida in regalo
                <ArrowRight size={14} />
              </Link>
            )}
            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/preferiti"
                aria-label={navigation.favoritesLabel}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
              >
                <Heart size={24} />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-[var(--color-ink)]">
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
                className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
              >
                <Instagram size={24} />
              </a>
              <a
                href={CONTACTS.tiktokUrl}
                aria-label="Apri TikTok Travelliniwithus"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
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
                className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
              >
                <MessageCircle size={24} />
              </a>
              <a
                href={CONTACTS.mailto}
                aria-label={`Scrivi a ${CONTACTS.email}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
              >
                <Mail size={24} />
              </a>
            </div>
            <button
              type="button"
              onClick={toggleLocale}
              className="flex min-h-[44px] w-fit items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ink)]"
            >
              <Compass size={20} className="text-[var(--color-accent)]" />
              Lingua
              <span className="rounded-md border border-[var(--color-border)] bg-[var(--color-sand)] px-2 py-0.5 text-[10px] font-bold uppercase">
                {locale.toUpperCase()}
              </span>
            </button>
            <div>
              {user ? (
                <button
                  onClick={signOut}
                  className="flex min-h-[44px] items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-error)]"
                >
                  <LogOut size={20} /> Esci
                </button>
              ) : (
                <button
                  onClick={signIn}
                  className="flex min-h-[44px] items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ink)]"
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
