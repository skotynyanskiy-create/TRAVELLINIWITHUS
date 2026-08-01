import { useState, useMemo, useRef, useCallback, useSyncExternalStore } from 'react';
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  type MapRef,
} from 'react-map-gl/maplibre';
import {
  X,
  ArrowRight,
  Layers,
  RotateCcw,
  Search,
  Navigation,
  Star,
  Hotel,
  UtensilsCrossed,
  Trees,
  Volume2,
  VolumeX,
  Shuffle,
  PanelLeftClose,
  PanelLeft,
  Gem,
  Sparkles,
  ChevronDown,
  MapPin,
  Filter,
  Loader2,
} from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { CONTENT_ITEMS } from '@/src/config/contentLibrary';
import { placeLabels } from './labelPlacement';
import type { ContentItem } from '@/src/types/content';
import { getUserLocation, sortPlacesByDistance, type UserLocation } from '@/src/utils/geo';
import PlaceBusinessActions from '../PlaceBusinessActions';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLES = {
  dark: { label: 'Cinema Dark', url: 'https://tiles.openfreemap.org/styles/dark' },
  liberty: { label: 'Atlas Cream', url: 'https://tiles.openfreemap.org/styles/liberty' },
  bright: { label: 'Satellite Hybrid', url: 'https://tiles.openfreemap.org/styles/bright' },
};

const FLY_PRESETS = [
  { id: 'toscana', label: 'Toscana', center: [11.86, 43.46], zoom: 9 },
  { id: 'puglia', label: 'Puglia', center: [17.24, 40.78], zoom: 9 },
  { id: 'verona', label: 'Verona', center: [10.99, 45.44], zoom: 11 },
  { id: 'milano', label: 'Milano', center: [9.19, 45.46], zoom: 11 },
  { id: 'dolomiti', label: 'Dolomiti', center: [11.66, 46.7], zoom: 9 },
  { id: 'praga', label: 'Praga', center: [14.43, 50.08], zoom: 11 },
  { id: 'madrid', label: 'Madrid', center: [-3.7, 40.42], zoom: 11 },
  { id: 'lofoten', label: 'Norvegia', center: [14.56, 68.23], zoom: 8 },
];

const TYPE_FILTERS = [
  { id: 'all', label: 'Tutti i tipi', icon: Sparkles },
  { id: 'hotel', label: 'Hotel & Alloggi', icon: Hotel },
  { id: 'food', label: 'Food & Ristoranti', icon: UtensilsCrossed },
  { id: 'insolito', label: 'Insolito', icon: Gem },
  { id: 'relax', label: 'Relax & Spa', icon: Trees },
];

const BUDGET_FILTERS = [
  { id: 'all', label: 'Qualsiasi budget' },
  { id: 'basso', label: '€ Basso' },
  { id: 'medio', label: '€€ Medio' },
  { id: 'alto', label: '€€€ Alto' },
];

// Soglia oltre la quale elenco, pannello filtri e scheda ci stanno davvero tutti.
// Guarda anche l'altezza, non solo la larghezza: sopra la mappa stanno navbar,
// testata, barra controlli e pannello, e su uno schermo 1024x640 alla scheda
// resterebbero 91px — una fessura. Sotto la soglia elenco e pannello cedono il
// posto alla scheda, come gia' fanno sui telefoni.
const DESKTOP_QUERY = '(min-width: 1024px) and (min-height: 800px)';

const subscribeDesktop = (onChange: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
};

const getDesktopSnapshot = () =>
  typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;

const FALLBACK_COORDINATES: Record<string, { lat: number; lng: number }> = {
  toscana: { lat: 43.46, lng: 11.86 },
  'emilia romagna': { lat: 44.49, lng: 11.34 },
  puglia: { lat: 40.78, lng: 17.24 },
  lombardia: { lat: 45.46, lng: 9.19 },
  veneto: { lat: 45.43, lng: 12.31 },
  trentino: { lat: 46.06, lng: 11.12 },
  lazio: { lat: 41.9, lng: 12.49 },
  sicilia: { lat: 37.5, lng: 15.08 },
  sardegna: { lat: 39.22, lng: 9.12 },
  egitto: { lat: 27.25, lng: 33.81 },
  norvegia: { lat: 68.23, lng: 14.56 },
  'repubblica ceca': { lat: 50.07, lng: 14.43 },
  svizzera: { lat: 46.81, lng: 8.22 },
};

export default function FullScreenMapExperience() {
  const mapRef = useRef<MapRef>(null);
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [activeTab, setActiveTab] = useState<'verdetto' | 'costi'>('verdetto');
  const [mapStyleKey, setMapStyleKey] = useState<'dark' | 'liberty' | 'bright'>('dark');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // 100% Full Content Coverage: tutti i 40 item, ognuno con coordinate reali.
  // Se per qualsiasi motivo un item non avesse coordinate, usiamo fallback.
  const allItems = useMemo(() => {
    return CONTENT_ITEMS.map((item) => {
      if (item.place.coordinates) return item;
      const key = (item.place.region || item.place.country || '').toLowerCase();
      const coords = FALLBACK_COORDINATES[key] || { lat: 42.5, lng: 12.5 };
      return {
        ...item,
        place: { ...item.place, coordinates: coords },
      };
    });
  }, []);

  const [userLoc, setUserLoc] = useState<UserLocation | null>(null);
  const [locLoading, setLocLoading] = useState<boolean>(false);

  const handleUserLocation = useCallback(async () => {
    if (userLoc) {
      setUserLoc(null);
      return;
    }
    setLocLoading(true);
    try {
      const loc = await getUserLocation();
      setUserLoc(loc);
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [loc.longitude, loc.latitude],
          zoom: 10.5,
          pitch: 45,
          duration: 2000,
        });
      }
    } catch {
      // Geolocalizzazione fallita o permessi negati
    } finally {
      setLocLoading(false);
    }
  }, [userLoc]);

  // Filtered List
  const filteredItems = useMemo(() => {
    const items = allItems.filter((item) => {
      const matchZone =
        selectedZone === 'all' || item.zone.toLowerCase() === selectedZone.toLowerCase();
      const matchType =
        selectedType === 'all' ||
        item.types.some((t) => t.toLowerCase().includes(selectedType.toLowerCase()));
      const matchBudget =
        selectedBudget === 'all' ||
        (item.value?.budget && item.value.budget.toLowerCase() === selectedBudget.toLowerCase());
      const matchQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.place.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.place.region && item.place.region.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchZone && matchType && matchBudget && matchQuery;
    });

    if (userLoc) {
      return sortPlacesByDistance(items, userLoc);
    }
    return items;
  }, [allItems, selectedZone, selectedType, selectedBudget, searchQuery, userLoc]);

  // Web Audio API Synthetic Chime Feedback
  /** Altezza della pillola e stima della sua larghezza dal numero di caratteri:
   *  serve a sapere quanto spazio occupa un nome prima di disegnarlo. */
  const LABEL_HEIGHT_PX = 30;
  const LABEL_BASE_PX = 34;
  const LABEL_CHAR_PX = 6.4;
  const LABEL_MAX_CHARS = 18;

  // Quali nomi ci stanno dipende da zoom e posizione, non solo dai dati: questo
  // contatore fa ricalcolare a ogni movimento della mappa.
  const [viewTick, setViewTick] = useState(0);
  const bumpView = useCallback(() => setViewTick((n) => n + 1), []);

  const { labelled, dots } = useMemo(() => {
    const map = mapRef.current;
    const withCoords = filteredItems.filter((item) => item.place.coordinates);
    // Prima che la mappa esista non si puo' proiettare: si mostra tutto, il
    // calcolo vero riparte al primo `onLoad`.
    if (!map) return { labelled: withCoords, dots: [] as ContentItem[] };

    return placeLabels(
      withCoords.map((item) => {
        const { x, y } = map.project([item.place.coordinates!.lng, item.place.coordinates!.lat]);
        return {
          item,
          x,
          y,
          // Chi e' selezionato tiene sempre il nome; poi i featured, poi le
          // schede verificate: la mappa da' il nome prima a cio' che e' vero.
          priority:
            (selectedItem?.id === item.id ? 100 : 0) +
            (item.featured ? 10 : 0) +
            (item.isPlaceholder ? 0 : 5),
          width: LABEL_BASE_PX + Math.min(item.title.length, LABEL_MAX_CHARS) * LABEL_CHAR_PX,
        };
      }),
      LABEL_HEIGHT_PX
    );
    // viewTick rappresenta lo stato della mappa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredItems, viewTick, selectedItem]);

  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } catch {
      // Audio context silently suppressed if non-interactive
    }
  }, [soundEnabled]);

  // Handle Pin Selection with Fly-To & Chime
  const handlePinClick = useCallback(
    (item: ContentItem) => {
      setSelectedItem(item);
      setActiveTab('verdetto');
      playChime();
      if (mapRef.current && item.place.coordinates) {
        mapRef.current.flyTo({
          center: [item.place.coordinates.lng, item.place.coordinates.lat],
          zoom: 12.5,
          pitch: 50,
          duration: 1800,
        });
      }
    },
    [playChime]
  );

  // Preset Fly-To
  const handlePresetFly = useCallback(
    (preset: (typeof FLY_PRESETS)[number]) => {
      playChime();
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [preset.center[0], preset.center[1]],
          zoom: preset.zoom,
          pitch: 45,
          duration: 2000,
        });
      }
    },
    [playChime]
  );

  // Random "Sorprendimi!" 3D Surprise Picker
  const handleSurprisePick = useCallback(() => {
    if (filteredItems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredItems.length);
    const randomItem = filteredItems[randomIndex];
    handlePinClick(randomItem);
  }, [filteredItems, handlePinClick]);

  // Reset Camera View
  const resetView = useCallback(() => {
    setSelectedZone('all');
    setSelectedType('all');
    setSelectedBudget('all');
    setSearchQuery('');
    setSelectedItem(null);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [12.5, 42.0],
        zoom: 4.8,
        pitch: 35,
        duration: 1500,
      });
    }
  }, []);

  const getItemIcon = (types: string[]) => {
    const mainType = types[0]?.toLowerCase() || '';
    if (mainType.includes('hotel')) return Hotel;
    if (mainType.includes('food') || mainType.includes('ristoranti')) return UtensilsCrossed;
    if (mainType.includes('insolito')) return Gem;
    if (mainType.includes('relax') || mainType.includes('spa')) return Sparkles;
    return Trees;
  };

  // Active filter count for badge
  const activeFilterCount = [
    selectedZone !== 'all',
    selectedType !== 'all',
    selectedBudget !== 'all',
    searchQuery.trim() !== '',
  ].filter(Boolean).length;

  // Dropdown state for type/budget
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const isDesktop = useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, () => false);

  // Sotto i 1024px elenco e pannello filtri non ci stanno affiancati alla scheda:
  // cedono il posto. La soglia vive qui e non in una classe `max-lg:hidden`, cosi'
  // etichette e stato dei bottoni raccontano quello che si vede davvero.
  const listVisible = sidebarOpen && (isDesktop || !selectedItem);
  const filtersVisible = showFiltersPanel && (isDesktop || !selectedItem);

  const toggleList = useCallback(() => {
    if (listVisible) {
      setSidebarOpen(false);
      return;
    }
    setSidebarOpen(true);
    if (!isDesktop) setSelectedItem(null);
  }, [listVisible, isDesktop]);

  const toggleFilters = useCallback(() => {
    if (filtersVisible) {
      setShowFiltersPanel(false);
      return;
    }
    setShowFiltersPanel(true);
    if (!isDesktop) setSelectedItem(null);
  }, [filtersVisible, isDesktop]);

  // La navbar e' fixed (z-50) e alta 67-77px a seconda del breakpoint: senza il margine
  // la barra dei filtri (z-40, top-6) finisce sepolta sotto di lei.
  return (
    <div className="mt-20 flex h-[calc(100dvh-80px)] w-full flex-col overflow-hidden bg-[#0a0705]">
      <header className="shrink-0 px-4 pb-3 pt-5 sm:px-8 sm:pb-4 sm:pt-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent,#c85a32)]">
          Mappa dei posti particolari
        </span>
        <h1 className="mt-1.5 font-serif text-2xl font-medium leading-tight text-white sm:text-3xl">
          Dove siamo stati davvero
        </h1>
        {/* Il deck dichiara anche lo stato delle schede: promettere 40 posti
            provati e aprirne uno vuoto e' la stessa frattura che il resto del
            lavoro sta chiudendo. */}
        <p className="mt-1.5 hidden text-sm text-white/60 sm:block">
          {allItems.length} posti che abbiamo visitato di persona. Le schede si riempiono una alla
          volta.
        </p>
      </header>

      <div className="relative min-h-0 flex-1">
        {/* 1. Colonna flottante: barra, pannello filtri ed elenco stanno nello stesso
            flusso verticale, cosi' nessuno dei tre puo' coprire gli altri quando la
            barra dei controlli va a capo. */}
        <div className="pointer-events-none absolute inset-x-4 top-6 bottom-16 z-40 flex flex-col gap-3 sm:inset-x-8 sm:bottom-6">
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search & Main Filters Group */}
            <div className="flex flex-wrap items-center gap-2 rounded-full border border-stone-700 bg-stone-900/95 p-2.5 shadow-2xl backdrop-blur-2xl pointer-events-auto">
              {/* Sidebar Toggle Button */}
              <button
                type="button"
                onClick={toggleList}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  listVisible
                    ? 'bg-[var(--color-accent,#c85a32)] text-white shadow-md'
                    : 'bg-stone-800 text-white/90 hover:bg-stone-700'
                }`}
                title={listVisible ? 'Chiudi elenco' : 'Apri elenco posti'}
              >
                {listVisible ? <PanelLeftClose size={15} /> : <PanelLeft size={15} />}
                <span>{listVisible ? 'Chiudi Elenco' : 'Elenco Posti'}</span>
              </button>

              <div className="h-4 w-px bg-white/20" />

              {/* Live Search Input */}
              <div className="relative flex items-center pl-2 pr-1">
                <Search size={15} className="text-[var(--color-accent,#c85a32)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca un posto o regione..."
                  className="w-36 bg-transparent px-2 py-1 text-xs font-semibold text-white placeholder-stone-400 focus:outline-none sm:w-52"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-white/60 hover:text-white"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="h-4 w-px bg-white/20 hidden sm:block" />

              {/* Zone Filter Pills */}
              {[
                { id: 'all', label: 'Tutte' },
                { id: 'italia', label: 'Italia' },
                { id: 'europa', label: 'Europa' },
                { id: 'africa', label: 'Africa' },
                { id: 'asia', label: 'Asia' },
              ].map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZone(zone.id)}
                  className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                    selectedZone === zone.id
                      ? 'bg-[var(--color-accent,#c85a32)] text-white shadow-md'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                  }`}
                >
                  {zone.label}
                </button>
              ))}

              <div className="h-4 w-px bg-white/20" />

              {/* Type & Budget Filter Toggle */}
              <button
                type="button"
                onClick={toggleFilters}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  filtersVisible || selectedType !== 'all' || selectedBudget !== 'all'
                    ? 'bg-[var(--color-accent,#c85a32)] text-white shadow-md'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                }`}
              >
                <Filter size={13} />
                <span>Filtri</span>
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black text-[var(--color-accent,#c85a32)]">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown
                  size={12}
                  className={`transition-transform ${filtersVisible ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {/* Action Tools & Surprises Bar */}
            <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
              {/* Quick Fly Presets — scrollable on mobile */}
              <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-stone-700 bg-stone-900/95 p-1.5 shadow-2xl backdrop-blur-2xl max-w-[calc(100vw-120px)] sm:max-w-none scrollbar-none">
                {FLY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetFly(preset)}
                    className="shrink-0 rounded-full bg-stone-800 px-3 py-1 text-xs font-semibold text-stone-200 hover:bg-[var(--color-accent,#c85a32)] hover:text-white transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* User Location / Vicino a me Button */}
              <button
                type="button"
                onClick={handleUserLocation}
                disabled={locLoading}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold shadow-2xl transition-all ${
                  userLoc
                    ? 'border-amber-500 bg-amber-600 text-white'
                    : 'border-stone-700 bg-stone-900/95 text-stone-200 hover:bg-stone-800 hover:text-white'
                }`}
                title={userLoc ? 'Disattiva Vicino a me' : 'Trova posti vicini a te'}
              >
                {locLoading ? (
                  <Loader2 size={14} className="animate-spin text-amber-400" />
                ) : (
                  <Navigation size={14} className={userLoc ? 'fill-current' : ''} />
                )}
                <span>{userLoc ? 'Vicino a me' : 'Vicino a me'}</span>
              </button>

              {/* "Sorprendimi!" Surprise Button */}
              <button
                type="button"
                onClick={handleSurprisePick}
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-[var(--color-accent,#c85a32)] px-4 py-2 text-xs font-bold text-white shadow-2xl transition-all hover:scale-105 hover:bg-white hover:text-stone-900"
              >
                <Shuffle size={14} />
                <span className="hidden sm:inline">Sorprendimi!</span>
              </button>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled((s) => !s)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 bg-stone-900/95 text-white shadow-2xl backdrop-blur-2xl transition-all hover:bg-stone-800"
                title={soundEnabled ? 'Disattiva audio acustico' : 'Attiva audio acustico'}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Map Style Switcher */}
              <button
                type="button"
                onClick={() =>
                  setMapStyleKey((s) =>
                    s === 'dark' ? 'liberty' : s === 'liberty' ? 'bright' : 'dark'
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 bg-stone-900/95 text-white shadow-2xl backdrop-blur-2xl transition-all hover:bg-stone-800"
                title={`Stile: ${MAP_STYLES[mapStyleKey].label}`}
              >
                <Layers size={16} />
              </button>

              {/* Reset Camera Button */}
              <button
                type="button"
                onClick={resetView}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 bg-stone-900/95 text-white shadow-2xl backdrop-blur-2xl transition-all hover:bg-stone-800"
                title="Reset vista"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* 1b. Filters Panel (Type + Budget) */}
          {filtersVisible && (
            <div className="pointer-events-auto flex shrink-0 flex-col gap-3 rounded-2xl border border-stone-700 bg-stone-900/95 p-4 shadow-2xl backdrop-blur-2xl sm:flex-row sm:items-center">
              {/* Type Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 mr-1">
                  Tipo:
                </span>
                {TYPE_FILTERS.map((tf) => {
                  const Icon = tf.icon;
                  return (
                    <button
                      key={tf.id}
                      type="button"
                      onClick={() => setSelectedType(tf.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                        selectedType === tf.id
                          ? 'bg-[var(--color-accent,#c85a32)] text-white shadow-md'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                      }`}
                    >
                      <Icon size={12} />
                      {tf.label}
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:block h-6 w-px bg-white/15" />

              {/* Budget Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 mr-1">
                  Budget:
                </span>
                {BUDGET_FILTERS.map((bf) => (
                  <button
                    key={bf.id}
                    type="button"
                    onClick={() => setSelectedBudget(bf.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                      selectedBudget === bf.id
                        ? 'bg-[var(--color-accent,#c85a32)] text-white shadow-md'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                    }`}
                  >
                    {bf.label}
                  </button>
                ))}
              </div>

              {/* Results count */}
              <div className="ml-auto flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-accent,#c85a32)]">
                  <MapPin size={13} />
                  {filteredItems.length} posti
                </span>
              </div>
            </div>
          )}

          {/* 2. Collapsible Split View Sidebar — flex-1: si ferma al fondo della mappa
            invece di partire da un top fisso che finiva sotto la barra. */}
          {listVisible && (
            <div className="pointer-events-auto w-84 min-h-0 flex-1 overflow-y-auto rounded-[var(--radius-lg,24px)] border border-stone-700 bg-stone-900/95 p-4 text-white shadow-2xl backdrop-blur-2xl max-sm:max-w-[calc(100%-3.5rem)] sm:w-96 sm:max-w-full">
              <div className="mb-4 flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent,#c85a32)]">
                  Destinazioni Provate ({filteredItems.length})
                </span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="text-stone-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2.5">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePinClick(item)}
                    className={`w-full text-left rounded-xl p-3 border transition-all ${
                      selectedItem?.id === item.id
                        ? 'border-[var(--color-accent,#c85a32)] bg-[var(--color-accent,#c85a32)]/25 text-white shadow-lg'
                        : 'border-stone-800 bg-stone-800/60 hover:border-stone-600 text-stone-200 hover:text-white'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-accent,#c85a32)]">
                      {item.zone} · {item.place.region || item.place.country}
                    </div>
                    <h4 className="mt-1 font-serif text-sm font-normal text-white">{item.title}</h4>
                    <span className="mt-2 block text-[10px] text-stone-400">
                      {item.value?.price || 'Verificato sul posto'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Map Canvas */}
        <Map
          ref={mapRef}
          style={{ width: '100%', height: '100%' }}
          initialViewState={{ longitude: 12.5, latitude: 42.0, zoom: 5.2, pitch: 35 }}
          mapStyle={MAP_STYLES[mapStyleKey].url}
          projection="globe"
          onLoad={bumpView}
          onMove={bumpView}
        >
          <NavigationControl position="bottom-right" />
          <FullscreenControl position="bottom-right" />

          {/* Punti senza nome: sono i posti la cui etichetta non entrerebbe
              senza coprire quella accanto. Nessuno sparisce — restano visibili
              e cliccabili, e zoomando riprendono il proprio nome. */}
          {dots.map((item) => {
            if (!item.place.coordinates) return null;
            const isSelected = selectedItem?.id === item.id;

            return (
              <Marker
                key={`dot-${item.id}`}
                longitude={item.place.coordinates.lng}
                latitude={item.place.coordinates.lat}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handlePinClick(item);
                }}
              >
                <button
                  type="button"
                  title={item.title}
                  aria-label={item.title}
                  className={`block cursor-pointer rounded-full border-2 shadow-lg transition-transform hover:scale-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isSelected
                      ? 'h-4 w-4 border-white bg-[var(--color-accent)]'
                      : 'h-2.5 w-2.5 border-white/80 bg-[var(--color-accent)]/90 hover:bg-[var(--color-accent)]'
                  }`}
                />
              </Marker>
            );
          })}

          {/* Nomi: solo dove c'e' spazio per leggerli. */}
          {labelled.map((item) => {
            if (!item.place.coordinates) return null;
            const isSelected = selectedItem?.id === item.id;
            const IconComp = getItemIcon(item.types);

            return (
              <Marker
                key={item.id}
                longitude={item.place.coordinates.lng}
                latitude={item.place.coordinates.lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handlePinClick(item);
                }}
              >
                <div className="group relative cursor-pointer">
                  {/* Glowing Pulse Ring */}
                  <div
                    className={`absolute -inset-2 rounded-full opacity-75 blur-sm transition-all ${
                      isSelected
                        ? 'bg-[var(--color-accent,#c85a32)] animate-pulse'
                        : 'bg-white/0 group-hover:bg-[var(--color-accent,#c85a32)]/50'
                    }`}
                  />

                  {/* Marker Pill */}
                  <div
                    className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-2xl transition-all ${
                      isSelected
                        ? 'scale-110 border-2 border-white bg-[var(--color-accent,#c85a32)] text-white z-30'
                        : 'border border-white/30 bg-black/85 text-white hover:scale-105 hover:bg-[var(--color-accent)] z-10'
                    }`}
                  >
                    <IconComp
                      size={13}
                      className={isSelected ? 'text-white' : 'text-[var(--color-accent)]'}
                    />
                    <span className="max-w-[120px] truncate">{item.title}</span>
                  </div>

                  {/* Hover Preview Tooltip */}
                  <div className="absolute left-1/2 bottom-full mb-2 hidden -translate-x-1/2 rounded-xl border border-white/20 bg-black/90 p-2.5 shadow-2xl backdrop-blur-md group-hover:block z-40 w-48">
                    {item.cover ? (
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-black/20">
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                        <MapPin
                          size={24}
                          className="text-[var(--color-accent,#c85a32)] opacity-60"
                        />
                      </div>
                    )}
                    <p className="mt-1.5 text-[10px] font-bold text-white truncate">{item.title}</p>
                    <span className="text-[9px] text-[var(--color-accent,#c85a32)] font-semibold">
                      {item.place.region || item.place.country} · {item.zone}
                    </span>
                    {item.value?.price && (
                      <span className="ml-1.5 text-[9px] text-white/60">— {item.value.price}</span>
                    )}
                  </div>
                </div>
              </Marker>
            );
          })}
        </Map>

        {/* 4. Advanced Multi-Tab Glassmorphism Drawer — right-14/right-20 lasciano libera
          la colonna dei controlli MapLibre (zoom, fullscreen, attribuzione OSM) che
          altrimenti la scheda copriva. Il tetto d'altezza e' relativo al contenitore,
          non al viewport: cosi' si adatta da solo all'altezza della testata. Sotto lg
          serve meno spazio perche' elenco e pannello si fanno da parte. */}
        {selectedItem && (
          <div className="absolute bottom-16 left-4 right-14 z-30 mx-auto max-h-[calc(100%-15rem)] lg:max-h-[calc(100%-21rem)] max-w-lg overflow-y-auto rounded-[var(--radius-lg,24px)] border border-white/20 bg-black/90 p-6 text-white shadow-2xl backdrop-blur-2xl sm:bottom-10 sm:left-auto sm:right-20 sm:w-[420px]">
            {/* Drawer Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent,#c85a32)]/20 border border-[var(--color-accent,#c85a32)]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent,#c85a32)]">
                  {selectedItem.zone} · {selectedItem.place.region || selectedItem.types[0]}
                </span>
                <h3 className="mt-2 font-serif text-2xl font-normal leading-tight">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div className="mt-4 flex gap-2 border-b border-white/15 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('verdetto')}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] transition-all ${
                  activeTab === 'verdetto'
                    ? 'bg-white text-[var(--color-ink,#1a2b3c)]'
                    : 'bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                01. Verdetto
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('costi')}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] transition-all ${
                  activeTab === 'costi'
                    ? 'bg-white text-[var(--color-ink,#1a2b3c)]'
                    : 'bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                02. Costi &amp; Info
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'verdetto' ? (
              <div className="mt-4 space-y-3">
                <p className="text-xs leading-relaxed text-white/80">{selectedItem.description}</p>
                {selectedItem.review?.verdict && (
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-accent,#c85a32)]">
                    <Star size={13} className="fill-current" />
                    <span>Verdetto: {selectedItem.review.verdict}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-3 text-xs text-white/80">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Costo stimato:</span>
                  <span className="font-bold text-white">
                    {selectedItem.value?.price || 'Verificato'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Posizione:</span>
                  <span className="font-bold text-white">{selectedItem.place.country}</span>
                </div>
                <div className="pt-2">
                  <PlaceBusinessActions
                    item={selectedItem}
                    userLocation={userLoc}
                    variant="compact"
                  />
                </div>
              </div>
            )}

            {/* Drawer Actions */}
            <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-xs font-semibold">
              <span className="text-white/60">Provato di persona</span>
              <Link
                to={`/posto/${selectedItem.id}`}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent,#c85a32)] px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-white hover:text-[var(--color-ink)]"
              >
                Apri la scheda completa <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
