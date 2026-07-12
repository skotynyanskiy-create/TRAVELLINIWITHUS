import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Map, {
  Marker,
  Popup,
  Source,
  Layer,
  NavigationControl,
  FullscreenControl,
  type MapRef,
  type MapLayerMouseEvent,
} from 'react-map-gl/maplibre';
import type { GeoJSONSource } from 'maplibre-gl';
import { Link } from '@/src/components/TransitionLink';
import { motion } from 'motion/react';
import {
  MapPin,
  Navigation,
  Compass,
  BookOpen,
  Map as MapIcon,
  UtensilsCrossed,
  Hotel,
  Sparkles,
  Star,
  ArrowRight,
  ChevronRight,
  Route,
  SlidersHorizontal,
} from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { fetchArticles } from '../../services/firebaseService';
import { trackEvent } from '../../services/analytics';
import { LITE_MODE } from '../../config/liteMode';
import type { NormalizedArticle } from '../../utils/articleData';
import { DEMO_ARTICLE_PREVIEW, DEMO_ARTICLES_EXTRA } from '../../config/demoContent';
import { DEMO_ARCHIVE_SEEDS } from '../../config/demoArchive';
import { getGeocodedContentItems } from '../../config/contentLibrary';
import maplibreCssUrl from 'maplibre-gl/dist/maplibre-gl.css?url';

/**
 * Adatta i seed di demoArchive al formato che la mappa si aspetta
 * (id, slug, title, category, country, continent, image, excerpt + coordinate
 * via campo `coordinates`). placeOnMap usa il country/continent per ricavare
 * lng/lat, ma noi possiamo passare direttamente le coordinate vere.
 *
 * Dedup: escludo gli slug gia' presenti in DEMO_ARTICLE_PREVIEW (Dolomiti) e
 * in DEMO_ARTICLES_EXTRA (Puglia, Toscana, Costiera, Filippine) per evitare
 * collisioni React key + marker duplicati sulla mappa.
 */
const DEMO_LEGACY_MAP_SLUGS = new Set<string>([
  DEMO_ARTICLE_PREVIEW.slug,
  ...DEMO_ARTICLES_EXTRA.map((a) => a.slug),
]);

const DEMO_ARCHIVE_MAP_ARTICLES = DEMO_ARCHIVE_SEEDS.filter(
  (seed) => !DEMO_LEGACY_MAP_SLUGS.has(seed.slug)
).map((seed) => ({
  id: seed.slug,
  slug: seed.slug,
  title: seed.title,
  category: seed.category,
  country: seed.country,
  continent: seed.continent,
  region: seed.region,
  city: seed.city,
  image: seed.image,
  excerpt: seed.excerpt,
  readTime: seed.readTime,
  createdAt: '2026-05-15T08:00:00.000Z',
  // Coordinate dirette (lng, lat) — placeOnMap dovrebbe usarle se presenti,
  // altrimenti cade su country/continent lookup.
  coordinates: seed.coordinates,
}));

/**
 * I "posti particolari" reali (ContentItem geocodati) come marker della mappa.
 * Riusano lo stesso shape degli articoli ma, avendo `externalUrl`, il popup
 * linka al reel reale invece che a un articolo. Sono la fonte che l'API IG
 * popolerà su scala; oggi sono il seed in `content-seed.json`.
 */
const CONTENT_MAP_INPUT = getGeocodedContentItems().map((item) => ({
  id: item.id,
  slug: item.id,
  title: item.title || item.hook,
  category: item.types[0] ?? 'Posti particolari',
  country: item.place.region ?? item.place.country,
  continent: item.zone === 'Italia' ? 'Europa' : item.zone,
  region: item.place.region,
  city: item.place.city,
  image: item.cover,
  excerpt: item.description,
  coordinates: [item.place.coordinates!.lng, item.place.coordinates!.lat] as [number, number],
  isPartner: false,
  externalUrl: item.permalink,
}));

/**
 * Categoria -> icona + colore badge nel marker.
 * Permette di leggere a colpo d'occhio "qui c'e' una guida vs un hotel
 * vs un posto particolare" senza dover cliccare per scoprirlo.
 */
const CATEGORY_VISUAL: Record<
  string,
  { Icon: React.ComponentType<{ size?: number; className?: string }>; label: string }
> = {
  Guide: { Icon: BookOpen, label: 'Guida' },
  'Itinerari completi': { Icon: MapIcon, label: 'Itinerario' },
  'Posti particolari': { Icon: Sparkles, label: 'Posto particolare' },
  'Weekend & Day trips': { Icon: MapPin, label: 'Weekend' },
  Destinazioni: { Icon: Compass, label: 'Destinazione' },
  'Food & Ristoranti': { Icon: UtensilsCrossed, label: 'Cucina' },
  'Hotel con carattere': { Icon: Hotel, label: 'Hotel' },
};

const CONTINENT_FILTERS = [
  { id: 'all', label: 'Tutti' },
  { id: 'Europa', label: 'Europa' },
  { id: 'Asia', label: 'Asia' },
  { id: 'Americhe', label: 'Americhe' },
  { id: 'Africa', label: 'Africa' },
  { id: 'Oceania', label: 'Oceania' },
] as const;

type ContinentFilter = (typeof CONTINENT_FILTERS)[number]['id'];

// Filtri esperienza editoriali: 5 picks dei TYPES canonical che coprono la
// maggior parte degli articoli nel CATEGORY_VISUAL. Ridotti per non
// trascinare l'intera taxonomy (ridurrebbe il segnale sulla mappa).
const EXPERIENCE_FILTERS = [
  { id: 'all', label: 'Tutte' },
  { id: 'Posti particolari', label: 'Posti particolari' },
  { id: 'Food & Ristoranti', label: 'Cucina' },
  { id: 'Hotel con carattere', label: 'Hotel' },
  { id: "Borghi e città d'arte", label: 'Borghi' },
  { id: 'Weekend romantici', label: 'Weekend' },
] as const;

type ExperienceFilter = (typeof EXPERIENCE_FILTERS)[number]['id'];

const MAP_ROUTE_PRESETS: Array<{
  id: string;
  title: string;
  meta: string;
  description: string;
  continent: ContinentFilter;
  experience: ExperienceFilter;
}> = [
  {
    id: 'italia-non-ovvia',
    title: 'Italia non ovvia',
    meta: 'borghi · calette · strade lente',
    description: 'Per partire da luoghi italiani con un ritmo più personale.',
    continent: 'Europa',
    experience: 'Posti particolari',
  },
  {
    id: 'dove-dormire-bene',
    title: 'Dove dormire bene',
    meta: 'hotel · masserie · rifugi',
    description: 'Per filtrare posti in cui l’alloggio è parte del viaggio.',
    continent: 'all',
    experience: 'Hotel con carattere',
  },
  {
    id: 'weekend-coppia',
    title: 'Weekend in coppia',
    meta: '2-4 giorni · facile da salvare',
    description: 'Per trasformare la mappa in una lista breve da scegliere.',
    continent: 'Europa',
    experience: 'Weekend romantici',
  },
];

type ArticleWithCoords = NormalizedArticle & {
  lat: number;
  lng: number;
  isPartner: boolean;
  /** Se presente, il popup linka qui (reel IG reale) invece che a /articolo. */
  externalUrl?: string;
};

// MapLibre GL JS non richiede token client-side per basemap liberi o self-hosted.

const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  Italia: { lat: 41.8719, lng: 12.5674 },
  // Italian regions: coords piu specifiche per articoli che parlano
  // di un'area particolare, evitano l'accatastamento su Roma quando
  // ci sono piu articoli italiani.
  Dolomiti: { lat: 46.41, lng: 11.86 },
  Puglia: { lat: 40.79, lng: 17.1 },
  Toscana: { lat: 43.32, lng: 11.0 },
  'Costiera Amalfitana': { lat: 40.63, lng: 14.6 },
  Sicilia: { lat: 37.6, lng: 14.0 },
  Sardegna: { lat: 40.12, lng: 9.01 },
  Cilento: { lat: 40.32, lng: 15.3 },
  Veneto: { lat: 45.43, lng: 12.33 },
  // Asia: aggiungere paesi che ricorrono negli articoli demo.
  Filippine: { lat: 12.8797, lng: 121.774 },
  Francia: { lat: 46.2276, lng: 2.2137 },
  Spagna: { lat: 40.4637, lng: -3.7492 },
  Portogallo: { lat: 39.3999, lng: -8.2245 },
  Grecia: { lat: 39.0742, lng: 21.8243 },
  Croazia: { lat: 45.1, lng: 15.2 },
  Germania: { lat: 51.1657, lng: 10.4515 },
  Austria: { lat: 47.5162, lng: 14.5501 },
  Svizzera: { lat: 46.8182, lng: 8.2275 },
  Olanda: { lat: 52.1326, lng: 5.2913 },
  'Paesi Bassi': { lat: 52.1326, lng: 5.2913 },
  Belgio: { lat: 50.5039, lng: 4.4699 },
  'Gran Bretagna': { lat: 55.3781, lng: -3.436 },
  Inghilterra: { lat: 52.3555, lng: -1.1743 },
  Irlanda: { lat: 53.1424, lng: -7.6921 },
  Scozia: { lat: 56.4907, lng: -4.2026 },
  'Repubblica Ceca': { lat: 49.8175, lng: 15.473 },
  Ungheria: { lat: 47.1625, lng: 19.5033 },
  Polonia: { lat: 51.9194, lng: 19.1451 },
  Romania: { lat: 45.9432, lng: 24.9668 },
  Bulgaria: { lat: 42.7339, lng: 25.4858 },
  Turchia: { lat: 38.9637, lng: 35.2433 },
  Danimarca: { lat: 56.2639, lng: 9.5018 },
  Svezia: { lat: 60.1282, lng: 18.6435 },
  Norvegia: { lat: 60.472, lng: 8.4689 },
  Finlandia: { lat: 61.9241, lng: 25.7482 },
  Islanda: { lat: 64.9631, lng: -19.0208 },
  Albania: { lat: 41.1533, lng: 20.1683 },
  Montenegro: { lat: 42.7087, lng: 19.3744 },
  Slovenia: { lat: 46.1512, lng: 14.9955 },
  Malta: { lat: 35.9375, lng: 14.3754 },
  Giappone: { lat: 36.2048, lng: 138.2529 },
  Tailandia: { lat: 15.87, lng: 100.9925 },
  Indonesia: { lat: -0.7893, lng: 113.9213 },
  Bali: { lat: -8.3405, lng: 115.092 },
  Vietnam: { lat: 14.0583, lng: 108.2772 },
  Cambogia: { lat: 12.5657, lng: 104.991 },
  India: { lat: 20.5937, lng: 78.9629 },
  'Sri Lanka': { lat: 7.8731, lng: 80.7718 },
  'Emirati Arabi': { lat: 23.4241, lng: 53.8478 },
  Dubai: { lat: 25.2048, lng: 55.2708 },
  Marocco: { lat: 31.7917, lng: -7.0926 },
  Maldive: { lat: 3.2028, lng: 73.2207 },
  Mauritius: { lat: -20.3484, lng: 57.5522 },
  'Stati Uniti': { lat: 37.0902, lng: -95.7129 },
  Messico: { lat: 23.6345, lng: -102.5528 },
  Brasile: { lat: -14.235, lng: -51.9253 },
  Argentina: { lat: -38.4161, lng: -63.6167 },
  Cuba: { lat: 21.5218, lng: -77.7812 },
  Colombia: { lat: 4.5709, lng: -74.2973 },
  Perù: { lat: -9.19, lng: -75.0152 },
  Egitto: { lat: 26.8206, lng: 30.8025 },
  Tanzania: { lat: -6.369, lng: 34.8888 },
  Kenya: { lat: -0.0236, lng: 37.9062 },
};

export default function MapboxWorldMap() {
  const mapRef = useRef<MapRef | null>(null);
  const continentChipRef = useRef<HTMLButtonElement | null>(null);
  const experienceChipRef = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [articles, setArticles] = useState<ArticleWithCoords[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleWithCoords | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [activeContinent, setActiveContinent] = useState<ContinentFilter>('all');
  const [activeExperience, setActiveExperience] = useState<ExperienceFilter>('all');
  const [viewZoom, setViewZoom] = useState(3.5);

  const CLUSTER_MAX_ZOOM = 6;

  useEffect(() => {
    const existingLink = document.querySelector<HTMLLinkElement>('link[data-twu-maplibre-css]');
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = maplibreCssUrl;
    link.dataset.twuMaplibreCss = 'true';
    document.head.appendChild(link);
  }, []);

  const filteredArticles = useMemo(
    () =>
      articles.filter((a) => {
        const continent = (a as { continent?: string }).continent;
        const matchContinent = activeContinent === 'all' || continent === activeContinent;
        const matchExperience = activeExperience === 'all' || a.category === activeExperience;
        return matchContinent && matchExperience;
      }),
    [articles, activeContinent, activeExperience]
  );

  const clusterGeoJSON = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: filteredArticles.map((article, index) => ({
        type: 'Feature' as const,
        properties: { id: String(article.id || index) },
        geometry: {
          type: 'Point' as const,
          coordinates: [article.lng, article.lat],
        },
      })),
    }),
    [filteredArticles]
  );

  const handleContinentChange = (value: ContinentFilter) => {
    setActiveContinent(value);
    if (value !== 'all') {
      trackEvent('map_filter_apply', {
        source_page: '/mappa',
        filter_type: 'continent',
        filter_value: value,
        results_count: articles.filter((a) => (a as { continent?: string }).continent === value)
          .length,
      });
    }
  };

  const handleExperienceChange = (value: ExperienceFilter) => {
    setActiveExperience(value);
    if (value !== 'all') {
      trackEvent('map_filter_apply', {
        source_page: '/mappa',
        filter_type: 'experience',
        filter_value: value,
        results_count: articles.filter((a) => a.category === value).length,
      });
    }
  };

  const handleRoutePreset = (preset: (typeof MAP_ROUTE_PRESETS)[number]) => {
    setActiveContinent(preset.continent);
    setActiveExperience(preset.experience);
    setSelectedArticle(null);
    trackEvent('map_route_preset_click', {
      source_page: '/mappa',
      preset_id: preset.id,
      zone: preset.continent,
      type: preset.experience,
    });
  };

  // Mobile: porta il chip attivo nel viewport della barra scrollabile
  // orizzontale, cosi' l'utente vede sempre il filtro selezionato anche se
  // era fuori schermo. Su desktop la barra non scrolla, quindi e' un no-op.
  useEffect(() => {
    continentChipRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [activeContinent, prefersReducedMotion]);

  useEffect(() => {
    experienceChipRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [activeExperience, prefersReducedMotion]);

  /** Centra la mappa sull'articolo + apre popup. Usato sia dal click marker
   *  che dal click sulla card della mini-lista sottostante. */
  const focusArticle = useCallback(
    (article: ArticleWithCoords) => {
      setSelectedArticle(article);
      mapRef.current?.flyTo({
        center: [article.lng, article.lat],
        zoom: 5.2,
        duration: prefersReducedMotion ? 0 : 1200,
        curve: prefersReducedMotion ? 1 : 1.42,
        essential: true,
      });
    },
    [prefersReducedMotion]
  );

  const handleClusterClick = useCallback(
    async (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature || feature.properties?.cluster !== true) return;

      const clusterId = feature.properties.cluster_id as number;
      const source = mapRef.current?.getSource('destinations') as GeoJSONSource | undefined;
      if (!source) return;

      const zoom = await source.getClusterExpansionZoom(clusterId);
      const [lng, lat] = (feature.geometry as GeoJSON.Point).coordinates;
      mapRef.current?.easeTo({
        center: [lng, lat],
        zoom,
        duration: prefersReducedMotion ? 0 : 800,
        essential: true,
      });
    },
    [prefersReducedMotion]
  );

  const handleUnclusteredPointClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      const id = feature?.properties?.id as string | undefined;
      if (!id) return;
      const article = filteredArticles.find((a, index) => String(a.id || index) === id);
      if (article) focusArticle(article);
    },
    [filteredArticles, focusArticle]
  );

  useEffect(() => {
    // Permissive input type — accettiamo sia NormalizedArticle (Firebase, con
    // Timestamp) sia gli oggetti demo (createdAt come string). I campi
    // davvero usati sono solo id/slug/title/category/image/excerpt + country.
    const placeOnMap = (list: ReadonlyArray<Record<string, unknown>>) =>
      list
        .map((article, index) => {
          // Priorita' 1: coordinate dirette [lng, lat] passate dal seed
          // (demoArchive). Permette di ancorare 30 destinazioni con precisione
          // senza dipendere da COUNTRY_COORDS.
          const directCoords = article.coordinates;
          if (
            Array.isArray(directCoords) &&
            directCoords.length === 2 &&
            typeof directCoords[0] === 'number' &&
            typeof directCoords[1] === 'number'
          ) {
            return {
              ...(article as unknown as NormalizedArticle),
              lat: directCoords[1],
              lng: directCoords[0],
              isPartner: Boolean(article.isPartner),
            };
          }

          // Priorita' 2: lookup country/continent su COUNTRY_COORDS.
          const countryKey =
            (article.country as string | undefined) ||
            (article.continent as string | undefined) ||
            '';
          const coords = COUNTRY_COORDS[countryKey];
          if (!coords) return null;

          const variance = 0.3;
          const offset = (index % 5) * variance - variance;

          return {
            ...(article as unknown as NormalizedArticle),
            lat: coords.lat + offset * 0.6,
            lng: coords.lng + offset,
            isPartner: Boolean(article.isPartner),
          };
        })
        .filter((article): article is ArticleWithCoords => article !== null);

    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchArticles();
        const mappedData = placeOnMap(data as unknown as ReadonlyArray<Record<string, unknown>>);
        const contentMarkers = placeOnMap(
          CONTENT_MAP_INPUT as unknown as ReadonlyArray<Record<string, unknown>>
        );

        if (mappedData.length > 0) {
          setArticles([...mappedData, ...contentMarkers]);
          setUsingDemo(false);
        } else {
          // Firestore vuoto: fallback su anteprime editoriali per non
          // mostrare la mappa nuda. Quando R+B pubblica articoli reali
          // con campo `country`, il fallback viene saltato automaticamente.
          // Include i 30 seed editoriali da demoArchive.ts per riempire
          // la mappa con destinazioni distribuite su tutti i continenti.
          const demo = placeOnMap([
            DEMO_ARTICLE_PREVIEW,
            ...DEMO_ARTICLES_EXTRA,
            ...DEMO_ARCHIVE_MAP_ARTICLES,
          ] as unknown as ReadonlyArray<Record<string, unknown>>);
          setArticles([...demo, ...contentMarkers]);
          setUsingDemo(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const pins = useMemo(
    () =>
      filteredArticles.map((article, index) => {
        const isActive = selectedArticle?.id === article.id;
        const cat = article.category;
        const visual = (cat && CATEGORY_VISUAL[cat]) || { Icon: MapPin, label: 'Posto' };
        const CatIcon = visual.Icon;

        return (
          <Marker
            key={`marker-${article.id || index}`}
            longitude={article.lng}
            latitude={article.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              focusArticle(article);
            }}
          >
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  focusArticle(article);
                }
              }}
              className={`relative flex h-11 w-11 cursor-pointer items-center justify-center ${
                prefersReducedMotion
                  ? ''
                  : `transition-transform ${isActive ? 'scale-125' : 'hover:scale-110'}`
              }`}
              aria-label={`${visual.label}: ${article.title}`}
            >
              <span
                aria-hidden="true"
                className={`twu-pulse-ring absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${
                  article.isPartner ? 'bg-[var(--color-success)]/40' : 'bg-[var(--color-accent)]/35'
                }`}
                style={{ left: '50%', top: '50%' }}
              />
              <span
                className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-xl md:h-11 md:w-11 ${
                  article.isPartner
                    ? 'border-white bg-[var(--color-success)] text-white'
                    : 'border-white bg-[var(--color-accent)] text-white'
                }`}
              >
                <CatIcon size={16} />
              </span>
              {article.isPartner && (
                <span
                  aria-label="Partner"
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[var(--color-success)] shadow-md"
                >
                  <Star size={9} fill="currentColor" />
                </span>
              )}
            </div>
          </Marker>
        );
      }),
    [filteredArticles, selectedArticle, prefersReducedMotion, focusArticle]
  );

  // MapLibre è attiva di default senza controlli sul token.

  return (
    <div className="relative flex h-auto min-h-full w-full flex-col bg-[var(--color-ink)] md:block md:h-full">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--color-ink)]">
          <div className="flex flex-col items-center gap-4 text-white/60">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Caricamento mappa...
            </span>
          </div>
        </div>
      )}

      <div className="pointer-events-none static z-10 px-4 pt-6 md:absolute md:left-8 md:top-8 md:px-0 md:pt-0">
        <div className="pointer-events-auto max-w-none rounded-2xl border border-black/5 bg-white/80 p-5 shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-white/95 hover:border-[var(--color-accent)]/20 md:max-w-xs md:p-6">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            <Navigation size={14} className="animate-pulse" /> Mappa Interattiva
          </div>
          <h1 className="mb-2 text-2xl font-serif text-[var(--color-ink)]">
            Scegli un posto partendo dalla mappa.
          </h1>
          <p className="text-sm font-light leading-relaxed text-[var(--color-ink)]/58">
            Filtra per zona o intenzione, poi apri la scheda giusta senza passare da un elenco
            infinito.
          </p>
          <p
            className="mt-4 text-xs font-light text-[var(--color-ink)]/50"
            role="status"
            aria-live="polite"
          >
            {filteredArticles.length}{' '}
            {filteredArticles.length === 1 ? 'destinazione' : 'destinazioni'}
            {usingDemo ? ' (anteprime editoriali)' : ' esplorate'}
            {activeContinent !== 'all' && ` · ${activeContinent}`}
            {activeExperience !== 'all' &&
              ` · ${EXPERIENCE_FILTERS.find((f) => f.id === activeExperience)?.label ?? ''}`}
          </p>
          {usingDemo && (
            <div className="mt-4 rounded-xl border border-[var(--color-accent)]/15 bg-[var(--color-accent-soft)] px-4 py-3 text-[11px] leading-relaxed text-[var(--color-accent-text)]">
              Stai vedendo anteprime editoriali: i marker mostrano la struttura della mappa mentre
              l’archivio reale cresce con foto, guide e itinerari verificati.
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none static z-10 px-4 pt-3 md:absolute md:right-8 md:top-8 md:w-[22rem] md:px-0 md:pt-0">
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-[var(--color-ink-deep)]/86 p-4 text-white shadow-2xl backdrop-blur-xl md:p-5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            <Route size={14} /> Percorsi suggeriti
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/62">
            Parti da una traccia editoriale: la mappa applica i filtri e ti mostra una selezione più
            corta.
          </p>
          <div className="mt-4 grid gap-2">
            {MAP_ROUTE_PRESETS.map((preset) => {
              const isActive =
                activeContinent === preset.continent && activeExperience === preset.experience;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleRoutePreset(preset)}
                  aria-pressed={isActive}
                  className={`group rounded-xl border p-3 text-left transition-all duration-300 ${
                    isActive
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                      : 'border-white/10 bg-white/6 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.16em]">
                      {preset.title}
                    </span>
                    <ArrowRight
                      size={13}
                      className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                  <span
                    className={`mt-2 block text-xs leading-relaxed ${
                      isActive ? 'text-white/78' : 'text-white/50'
                    }`}
                  >
                    {preset.meta}
                  </span>
                  <span
                    className={`mt-1 block text-xs leading-relaxed ${
                      isActive ? 'text-white/80' : 'text-white/58'
                    }`}
                  >
                    {preset.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter chips — Sotto md: barra sticky in-flow, ogni riga scrollabile
          orizzontalmente con fade-edge + chevron come affordance (la barra
          spesso eccede la larghezza viewport). Da md in su: overlay assoluto
          centrato sopra la mappa, identico a prima.
          pointer-events-none sul wrapper lascia passare gli eventi alla mappa
          fuori dai chips (rilevante solo desktop). */}
      <div className="pointer-events-none static z-10 flex flex-col items-stretch gap-2 bg-[var(--color-ink)]/70 px-4 py-3 backdrop-blur-md md:sticky md:top-8 md:items-center md:bg-transparent md:py-0 md:backdrop-blur-none">
        <div className="pointer-events-auto flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45 md:hidden">
          <SlidersHorizontal size={13} className="text-[var(--color-accent)]" /> Filtra la mappa
        </div>
        <div className="relative w-full md:w-auto">
          <div
            role="tablist"
            aria-label="Filtra destinazioni per continente"
            className="pointer-events-auto flex min-h-11 max-w-full items-center gap-1.5 overflow-x-auto rounded-full border border-white/10 bg-[var(--color-ink-deep)]/80 p-1.5 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shadow-lg"
          >
            {CONTINENT_FILTERS.map((f) => {
              const isActive = activeContinent === f.id;
              return (
                <button
                  key={f.id}
                  ref={isActive ? continentChipRef : null}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleContinentChange(f.id)}
                  className={`flex min-h-11 shrink-0 items-center rounded-full px-4 text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer md:min-h-0 md:py-1.5 ${
                    isActive
                      ? 'bg-[var(--color-accent)] text-white shadow-md md:scale-105'
                      : 'text-white/70 hover:bg-white/10 hover:text-white md:hover:scale-102'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center gap-1 rounded-r-full bg-gradient-to-l from-[var(--color-ink-deep)]/90 to-transparent pl-6 pr-2 transition-opacity duration-200 md:hidden"
          >
            <ChevronRight size={14} className="text-white/60" />
          </div>
        </div>

        <div className="relative w-full md:w-auto">
          <div
            role="tablist"
            aria-label="Filtra destinazioni per esperienza"
            className="pointer-events-auto flex min-h-11 max-w-full items-center gap-1.5 overflow-x-auto rounded-full border border-white/8 bg-[var(--color-ink-deep)]/80 p-1.5 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shadow-lg"
          >
            {EXPERIENCE_FILTERS.map((f) => {
              const isActive = activeExperience === f.id;
              return (
                <button
                  key={f.id}
                  ref={isActive ? experienceChipRef : null}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleExperienceChange(f.id)}
                  className={`flex min-h-11 shrink-0 items-center rounded-full px-3 text-[9px] font-bold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer md:min-h-0 md:py-1.5 ${
                    isActive
                      ? 'bg-white text-[var(--color-ink)] shadow-md md:scale-105'
                      : 'text-white/60 hover:bg-white/10 hover:text-white md:hover:scale-102'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center gap-1 rounded-r-full bg-gradient-to-l from-[var(--color-ink-deep)]/90 to-transparent pl-6 pr-2 transition-opacity duration-200 md:hidden"
          >
            <ChevronRight size={14} className="text-white/60" />
          </div>
        </div>
      </div>

      {/* Mappa — Sotto md: blocco in-flow alto 52vh sotto i filtri. Da md in
          su: riempie il container assoluto, con gli overlay sopra. */}
      <div className="relative h-[52vh] w-full md:absolute md:inset-0 md:h-full">
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: 12.5,
            latitude: 42.0,
            zoom: 3.5,
            pitch: 45,
          }}
          mapStyle="https://tiles.openfreemap.org/styles/dark"
          projection="globe"
          sky={{
            'atmosphere-blend': 0.8,
            'sky-color': '#0a0a0a',
            'fog-color': '#1a1a1a',
            'horizon-fog-blend': 1.0,
          }}
          onZoom={(e) => setViewZoom(e.viewState.zoom)}
          interactiveLayerIds={viewZoom < CLUSTER_MAX_ZOOM ? ['clusters', 'unclustered-point'] : []}
          onClick={(e) => {
            const feature = e.features?.[0];
            if (!feature) return;
            if (feature.layer?.id === 'clusters') {
              void handleClusterClick(e);
            } else if (feature.layer?.id === 'unclustered-point') {
              handleUnclusteredPointClick(e);
            }
          }}
        >
          <NavigationControl position="bottom-right" />
          <FullscreenControl position="bottom-right" />

          <Source
            id="destinations"
            type="geojson"
            data={clusterGeoJSON}
            cluster
            clusterMaxZoom={CLUSTER_MAX_ZOOM}
            clusterRadius={50}
          >
            <Layer
              id="clusters"
              type="circle"
              filter={['has', 'point_count']}
              layout={{ visibility: viewZoom < CLUSTER_MAX_ZOOM ? 'visible' : 'none' }}
              paint={{
                'circle-color': '#c2410c',
                'circle-radius': ['step', ['get', 'point_count'], 16, 10, 20, 50, 26],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
              }}
            />
            <Layer
              id="cluster-count"
              type="symbol"
              filter={['has', 'point_count']}
              layout={{
                visibility: viewZoom < CLUSTER_MAX_ZOOM ? 'visible' : 'none',
                'text-field': '{point_count_abbreviated}',
                'text-size': 12,
                'text-font': ['Noto Sans Bold'],
              }}
              paint={{ 'text-color': '#ffffff' }}
            />
            <Layer
              id="unclustered-point"
              type="circle"
              filter={['!', ['has', 'point_count']]}
              layout={{ visibility: viewZoom < CLUSTER_MAX_ZOOM ? 'visible' : 'none' }}
              paint={{
                'circle-color': '#c2410c',
                'circle-radius': 7,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
              }}
            />
          </Source>

          {viewZoom >= CLUSTER_MAX_ZOOM && pins}

          {selectedArticle && (
            <Popup
              anchor="bottom"
              longitude={selectedArticle.lng}
              latitude={selectedArticle.lat}
              onClose={() => setSelectedArticle(null)}
              // Solo closeOnClick=true: il close button visibile non e'
              // praticamente cliccabile perche' il <Link> wrapper della card
              // popup occupa tutta l'area in stacking sopra di esso (DOM
              // order: close-button prima, Link dopo). UX pattern Google
              // Maps: click ovunque sulla mappa chiude il popup, ESC chiude
              // da tastiera (gestito da Mapbox di default).
              closeButton={false}
              closeOnClick={true}
              className="twu-map-popup"
              offset={[0, -40]}
              maxWidth="min(320px, calc(100vw - 32px))"
            >
              {(() => {
                const cardClass =
                  'group relative block w-[min(300px,calc(100vw-48px))] overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-ink-deep)] shadow-2xl transition-all duration-500 hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:border-white/20';
                const inner = (
                  <>
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-900 rounded-t-2xl">
                      {selectedArticle.image && (
                        <img
                          src={selectedArticle.image}
                          alt={selectedArticle.title}
                          className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-108"
                        />
                      )}
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <span className="rounded-xl bg-[var(--color-accent)] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-md">
                          {CATEGORY_VISUAL[selectedArticle.category]?.label ||
                            selectedArticle.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="mb-2 line-clamp-2 font-serif text-xl leading-tight text-white transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                        {selectedArticle.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-xs font-light text-white/70">
                        {selectedArticle.excerpt}
                      </p>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)] flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
                        {selectedArticle.externalUrl ? 'Guarda il reel' : 'Leggi la guida'}{' '}
                        <ArrowRight
                          size={10}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>
                  </>
                );
                return selectedArticle.externalUrl ? (
                  <a
                    href={selectedArticle.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cardClass}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link
                    to={`/articolo/${selectedArticle.slug || selectedArticle.id}`}
                    className={cardClass}
                  >
                    {inner}
                  </Link>
                );
              })()}
            </Popup>
          )}
        </Map>
      </div>

      {/* Lista destinazioni — Sotto md: lista verticale full-width in-flow
          sotto la mappa (niente piu' carosello orizzontale nascosto). Da md
          in su: overlay assoluto in basso, carosello orizzontale come prima.
          Quando il filtro produce 0 risultati mostriamo un empty-state esplicito
          invece di nascondere il pannello (l'utente capisce perche' la mappa e' vuota). */}
      {filteredArticles.length === 0 && !isLoading ? (
        <div className="pointer-events-none static z-10 flex justify-center px-4 py-6 md:absolute md:inset-x-0 md:bottom-6 md:top-auto md:py-0">
          <div
            role="status"
            className="pointer-events-auto inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/12 bg-[var(--color-ink)]/85 px-5 py-3 text-xs font-medium text-white/80 backdrop-blur-xl"
          >
            <Compass size={14} className="text-[var(--color-accent)]" />
            <span>
              Nessuna destinazione
              {activeContinent !== 'all' && ` in ${activeContinent}`}
              {activeExperience !== 'all' &&
                ` per ${EXPERIENCE_FILTERS.find((f) => f.id === activeExperience)?.label ?? ''}`}
              .
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveContinent('all');
                setActiveExperience('all');
              }}
              className="font-bold uppercase tracking-[0.18em] text-[var(--color-accent)] hover:text-white"
            >
              Mostra tutte
            </button>
          </div>
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="pointer-events-none static z-10 px-4 py-6 md:absolute md:inset-x-0 md:bottom-6 md:top-auto md:py-0">
          <div
            className="pointer-events-auto flex flex-col gap-3 md:-mx-4 md:mx-auto md:max-w-5xl md:flex-row md:snap-x md:snap-mandatory md:gap-4 md:overflow-x-auto md:px-4 md:pb-2 md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden"
            aria-label={`${filteredArticles.length} destinazioni filtrate`}
          >
            {filteredArticles.map((article, index) => {
              const isActive = selectedArticle?.id === article.id;
              const cat = article.category;
              const visual = (cat && CATEGORY_VISUAL[cat]) || { Icon: MapPin, label: 'Posto' };
              const CatIcon = visual.Icon;

              return (
                <motion.button
                  key={`card-${article.id}`}
                  type="button"
                  onClick={() => focusArticle(article)}
                  aria-pressed={isActive}
                  aria-label={`Mostra ${article.title} sulla mappa`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.05 }}
                  className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left shadow-xl backdrop-blur-md transition-all duration-300 md:w-auto md:shrink-0 md:basis-[260px] md:snap-start md:py-2.5 cursor-pointer ${
                    isActive
                      ? 'border-[var(--color-accent)] bg-white/95 ring-2 ring-[var(--color-accent)]/20'
                      : 'border-black/5 bg-white/80 hover:bg-white/95 hover:border-[var(--color-accent)]/20 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[var(--color-muted-bg)]">
                    {article.image && (
                      <img
                        src={article.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-750 group-hover:scale-110"
                      />
                    )}
                    <span
                      className={`absolute -bottom-0 -right-0 flex h-5 w-5 items-center justify-center rounded-tl-xl ${
                        article.isPartner
                          ? 'bg-[var(--color-success)] text-white'
                          : 'bg-[var(--color-accent)] text-white'
                      }`}
                    >
                      <CatIcon size={11} />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
                      {(article as { country?: string }).country ||
                        (article as { continent?: string }).continent ||
                        'In viaggio'}
                      {article.isPartner && ' · Partner'}
                    </p>
                    <p className="line-clamp-2 text-xs font-serif leading-tight text-[var(--color-ink)] md:text-sm transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                      {article.title}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* CTA archivio — off in lite mode (linka /esplora disabilitato) */}
      {!LITE_MODE && (
        <Link
          to={(() => {
            const params = new URLSearchParams();
            if (activeContinent !== 'all') {
              params.set('zone', activeContinent);
            }
            if (activeExperience !== 'all') {
              params.set(
                'type',
                activeExperience
                  .toLowerCase()
                  .replace(/&/g, 'e')
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-+|-+$/g, '')
              );
            }
            const qs = params.toString();
            return qs ? `/esplora?${qs}` : '/esplora';
          })()}
          onClick={() =>
            trackEvent('map_to_explore_click', {
              source_page: '/mappa',
              zone: activeContinent,
              type: activeExperience,
            })
          }
          className="static z-10 mx-4 mb-8 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/85 px-5 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[var(--color-accent)] md:absolute md:bottom-36 md:right-8 md:mx-0 md:mb-0"
        >
          <MapPin size={14} /> Apri archivio
        </Link>
      )}
    </div>
  );
}
