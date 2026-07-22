import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import {
  MapPin,
  Compass,
  BookOpen,
  Map as MapIcon,
  UtensilsCrossed,
  Hotel,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { fetchArticles } from '../../services/firebaseService';
import { trackEvent } from '../../services/analytics';
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
    title: 'Europa non ovvia',
    meta: 'Europa · posti particolari',
    description: 'Per cercare luoghi meno scontati tra le tracce raccolte in Europa.',
    continent: 'Europa',
    experience: 'Posti particolari',
  },
  {
    id: 'dove-dormire-bene',
    title: 'Alloggi con carattere',
    meta: 'Tutti i continenti · hotel',
    description: 'Per trovare gli alloggi raccolti sulla mappa e scegliere da dove partire.',
    continent: 'all',
    experience: 'Hotel con carattere',
  },
  {
    id: 'weekend-coppia',
    title: 'Weekend in coppia',
    meta: 'Europa · weekend',
    description: 'Per restringere la mappa ai contenuti dedicati a una partenza in due.',
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

export interface MapContentSummary {
  loading: boolean;
  hasError: boolean;
  mode: 'loading' | 'real' | 'mixed' | 'demo' | 'empty';
  realCount: number;
  previewCount: number;
  filteredCount: number;
}

interface MapboxWorldMapProps {
  onSummaryChange?: (summary: MapContentSummary) => void;
}

type TraceArticle = ArticleWithCoords & {
  isEditorialPreview: boolean;
  hasVerifiedImage: boolean;
};

function placeTraceArticles(
  list: ReadonlyArray<Record<string, unknown>>,
  isEditorialPreview: boolean
): TraceArticle[] {
  return list
    .map((article, index) => {
      const directCoords = article.coordinates;
      const hasVerifiedImage =
        !isEditorialPreview &&
        article.imageVerified === true &&
        typeof article.image === 'string' &&
        article.image.length > 0;

      if (
        Array.isArray(directCoords) &&
        directCoords.length === 2 &&
        typeof directCoords[0] === 'number' &&
        typeof directCoords[1] === 'number'
      ) {
        return {
          ...(article as unknown as NormalizedArticle),
          image: hasVerifiedImage ? String(article.image) : '',
          lat: directCoords[1],
          lng: directCoords[0],
          isPartner: Boolean(article.isPartner),
          isEditorialPreview,
          hasVerifiedImage,
        };
      }

      const countryKey =
        (article.country as string | undefined) || (article.continent as string | undefined) || '';
      const coords = COUNTRY_COORDS[countryKey];
      if (!coords) return null;

      const variance = 0.3;
      const offset = (index % 5) * variance - variance;
      return {
        ...(article as unknown as NormalizedArticle),
        image: hasVerifiedImage ? String(article.image) : '',
        lat: coords.lat + offset * 0.6,
        lng: coords.lng + offset,
        isPartner: Boolean(article.isPartner),
        isEditorialPreview,
        hasVerifiedImage,
      };
    })
    .filter((article): article is TraceArticle => article !== null);
}

function getTraceLocation(article: TraceArticle) {
  return (
    (article as { country?: string }).country ||
    (article as { continent?: string }).continent ||
    'In viaggio'
  );
}

function getTraceLink(article: TraceArticle) {
  if (article.externalUrl) {
    return {
      href: article.externalUrl,
      external: true,
      label: 'Guarda il reel',
    };
  }

  const slug = article.slug || article.id;
  if (!slug) return null;
  return {
    href: `/articolo/${slug}`,
    external: false,
    label: article.isEditorialPreview ? 'Apri l’anteprima' : 'Leggi la guida',
  };
}

export default function MapboxWorldMap({ onSummaryChange }: MapboxWorldMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const continentChipRef = useRef<HTMLButtonElement | null>(null);
  const experienceChipRef = useRef<HTMLButtonElement | null>(null);
  const desktopCardRef = useRef<HTMLElement | null>(null);
  const mobileCardRef = useRef<HTMLElement | null>(null);
  const focusOriginRef = useRef<HTMLElement | null>(null);
  const focusCardOnOpenRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const [searchParams] = useSearchParams();
  const deepLinkAppliedRef = useRef(false);
  const [articles, setArticles] = useState<TraceArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<TraceArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasDataError, setHasDataError] = useState(false);
  const [activeContinent, setActiveContinent] = useState<ContinentFilter>('all');
  const [activeExperience, setActiveExperience] = useState<ExperienceFilter>('all');
  const [viewZoom, setViewZoom] = useState(3.5);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());

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

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setHasDataError(false);

    const contentMarkers = placeTraceArticles(
      CONTENT_MAP_INPUT as unknown as ReadonlyArray<Record<string, unknown>>,
      false
    );
    const demoMarkers = placeTraceArticles(
      [
        DEMO_ARTICLE_PREVIEW,
        ...DEMO_ARTICLES_EXTRA,
        ...DEMO_ARCHIVE_MAP_ARTICLES,
      ] as unknown as ReadonlyArray<Record<string, unknown>>,
      true
    );

    try {
      const data = await fetchArticles();
      const mappedData = placeTraceArticles(
        data as unknown as ReadonlyArray<Record<string, unknown>>,
        false
      );
      setArticles(
        mappedData.length > 0
          ? [...mappedData, ...contentMarkers]
          : [...demoMarkers, ...contentMarkers]
      );
    } catch {
      setHasDataError(true);
      setArticles([]);
      setSelectedArticle(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredArticles = useMemo(
    () =>
      articles.filter((article) => {
        const continent = (article as { continent?: string }).continent;
        const matchContinent = activeContinent === 'all' || continent === activeContinent;
        const matchExperience = activeExperience === 'all' || article.category === activeExperience;
        return matchContinent && matchExperience;
      }),
    [articles, activeContinent, activeExperience]
  );

  const realCount = filteredArticles.filter((article) => !article.isEditorialPreview).length;
  const previewCount = filteredArticles.length - realCount;
  const contentMode: MapContentSummary['mode'] = isLoading
    ? 'loading'
    : filteredArticles.length === 0
      ? 'empty'
      : realCount > 0 && previewCount > 0
        ? 'mixed'
        : previewCount > 0
          ? 'demo'
          : 'real';

  useEffect(() => {
    onSummaryChange?.({
      loading: isLoading,
      hasError: hasDataError,
      mode: contentMode,
      realCount,
      previewCount,
      filteredCount: filteredArticles.length,
    });
  }, [
    contentMode,
    filteredArticles.length,
    hasDataError,
    isLoading,
    onSummaryChange,
    previewCount,
    realCount,
  ]);

  const closeSelection = useCallback(() => {
    setSelectedArticle(null);
    if (focusCardOnOpenRef.current && focusOriginRef.current?.isConnected) {
      window.requestAnimationFrame(() => focusOriginRef.current?.focus());
    }
    focusCardOnOpenRef.current = false;
  }, []);

  const focusArticle = useCallback(
    (article: TraceArticle, origin?: HTMLElement | null, moveFocus = false) => {
      const openedFromMarker = origin?.dataset.traceMarker === 'true';
      const currentZoom = mapRef.current?.getZoom() ?? CLUSTER_MAX_ZOOM;
      focusOriginRef.current = origin ?? null;
      focusCardOnOpenRef.current = moveFocus;
      setSelectedArticle(article);
      mapRef.current?.flyTo({
        center: [article.lng, article.lat],
        // I marker DOM esistono da CLUSTER_MAX_ZOOM in su. Se l'apertura arriva
        // da tastiera, non smontare il controllo che dovrà riprendere il focus.
        zoom: openedFromMarker ? Math.max(currentZoom, CLUSTER_MAX_ZOOM) : 5.2,
        duration: prefersReducedMotion ? 0 : 800,
        curve: prefersReducedMotion ? 1 : 1.42,
        essential: true,
      });
    },
    [prefersReducedMotion]
  );

  useEffect(() => {
    if (!selectedArticle || !focusCardOnOpenRef.current) return;
    window.requestAnimationFrame(() => {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      (isMobile ? mobileCardRef.current : desktopCardRef.current)?.focus();
    });
  }, [selectedArticle]);

  useEffect(() => {
    if (!selectedArticle) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSelection();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [closeSelection, selectedArticle]);

  const resetFilters = () => {
    setActiveContinent('all');
    setActiveExperience('all');
    closeSelection();
  };

  const handleContinentChange = (value: ContinentFilter) => {
    setActiveContinent(value);
    closeSelection();
    if (value !== 'all') {
      trackEvent('map_filter_apply', {
        source_page: '/mappa',
        filter_type: 'continent',
        filter_value: value,
        results_count: articles.filter(
          (article) => (article as { continent?: string }).continent === value
        ).length,
      });
    }
  };

  const handleExperienceChange = (value: ExperienceFilter) => {
    setActiveExperience(value);
    closeSelection();
    if (value !== 'all') {
      trackEvent('map_filter_apply', {
        source_page: '/mappa',
        filter_type: 'experience',
        filter_value: value,
        results_count: articles.filter((article) => article.category === value).length,
      });
    }
  };

  const handleRoutePreset = (preset: (typeof MAP_ROUTE_PRESETS)[number]) => {
    setActiveContinent(preset.continent);
    setActiveExperience(preset.experience);
    closeSelection();
    trackEvent('map_route_preset_click', {
      source_page: '/mappa',
      preset_id: preset.id,
      zone: preset.continent,
      type: preset.experience,
    });
  };

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

  useEffect(() => {
    if (deepLinkAppliedRef.current || articles.length === 0) return;
    const placeId = searchParams.get('place');
    if (!placeId) return;
    const match = articles.find((article) => article.id === placeId);
    if (match) focusArticle(match);
    deepLinkAppliedRef.current = true;
  }, [articles, focusArticle, searchParams]);

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

  const handleClusterClick = useCallback(
    async (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature || feature.properties?.cluster !== true) return;
      const source = mapRef.current?.getSource('destinations') as GeoJSONSource | undefined;
      if (!source) return;
      const zoom = await source.getClusterExpansionZoom(feature.properties.cluster_id as number);
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
    (event: MapLayerMouseEvent) => {
      const id = event.features?.[0]?.properties?.id as string | undefined;
      if (!id) return;
      const article = filteredArticles.find((item, index) => String(item.id || index) === id);
      if (article) focusArticle(article);
    },
    [filteredArticles, focusArticle]
  );

  const pins = useMemo(
    () =>
      filteredArticles.map((article, index) => {
        const visual = CATEGORY_VISUAL[article.category] || {
          Icon: MapPin,
          label: 'Posto',
        };
        const MarkerIcon = visual.Icon;
        const isActive = selectedArticle?.id === article.id;
        return (
          <Marker
            key={`trace-marker-${article.id || index}`}
            longitude={article.lng}
            latitude={article.lat}
            anchor="bottom"
          >
            <button
              type="button"
              data-trace-marker="true"
              className="relative grid h-11 w-11 place-items-center rounded-full"
              aria-label={`${visual.label}: ${article.title}`}
              aria-pressed={isActive}
              onClick={(event) => {
                event.stopPropagation();
                const activatedFromKeyboard = event.detail === 0;
                focusArticle(article, event.currentTarget, activatedFromKeyboard);
              }}
            >
              <span
                aria-hidden="true"
                className={`grid h-9 w-9 place-items-center rounded-full border-2 text-white shadow-lg md:h-11 md:w-11 ${
                  article.isPartner
                    ? 'border-white bg-[var(--color-success)]'
                    : isActive
                      ? 'border-[var(--map-red)] bg-[var(--map-blue)]'
                      : 'border-white bg-[var(--map-red)]'
                }`}
              >
                <MarkerIcon size={16} />
              </span>
            </button>
          </Marker>
        );
      }),
    [filteredArticles, focusArticle, selectedArticle]
  );

  const markImageFailed = (article: TraceArticle) => {
    setFailedImages((current) => new Set(current).add(String(article.id)));
  };

  const renderTraceCard = (article: TraceArticle, mobile: boolean) => {
    const link = getTraceLink(article);
    const visual = CATEGORY_VISUAL[article.category];
    const canShowImage =
      article.hasVerifiedImage && Boolean(article.image) && !failedImages.has(String(article.id));
    return (
      <article
        ref={mobile ? mobileCardRef : desktopCardRef}
        className="map-trace-card"
        tabIndex={-1}
      >
        <button
          type="button"
          className="map-trace-card__close"
          onClick={closeSelection}
          aria-label={`Chiudi la scheda di ${article.title}`}
        >
          <span aria-hidden="true">×</span>
        </button>
        {canShowImage && (
          <div className="map-trace-card__media">
            <img
              src={article.image}
              alt=""
              loading="lazy"
              onError={() => markImageFailed(article)}
            />
          </div>
        )}
        <p className="map-trace-card__meta">
          {getTraceLocation(article)} · {visual?.label || article.category}
          {article.isEditorialPreview && (
            <span className="map-trace-card__preview">Anteprima editoriale</span>
          )}
        </p>
        <h3>{article.title}</h3>
        <p className="map-trace-card__excerpt">{article.excerpt}</p>
        {link &&
          (link.external ? (
            <a className="map-trace-card__cta" href={link.href} target="_blank" rel="noreferrer">
              {link.label} <ArrowRight size={14} aria-hidden="true" />
            </a>
          ) : (
            <Link className="map-trace-card__cta" to={link.href}>
              {link.label} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          ))}
      </article>
    );
  };

  const archivePath = (() => {
    const params = new URLSearchParams();
    if (activeContinent !== 'all') params.set('zone', activeContinent);
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
    const query = params.toString();
    return query ? `/esplora?${query}` : '/esplora';
  })();

  return (
    <section className="map-traces" aria-busy={isLoading}>
      <div className="map-traces__worktable">
        <div className="map-traces__filters" aria-label="Filtra la mappa">
          <p className="map-traces__filters-heading">
            <SlidersHorizontal size={14} aria-hidden="true" /> Filtra la mappa
          </p>
          <div className="map-traces__filter-row">
            <span className="map-traces__filter-label">Continente</span>
            <div className="map-traces__chip-rail" role="group" aria-label="Filtra per continente">
              {CONTINENT_FILTERS.map((filter) => {
                const isActive = activeContinent === filter.id;
                return (
                  <button
                    key={filter.id}
                    ref={isActive ? continentChipRef : null}
                    type="button"
                    className="map-traces__chip"
                    aria-pressed={isActive}
                    disabled={isLoading || hasDataError}
                    onClick={() => handleContinentChange(filter.id)}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="map-traces__filter-row">
            <span className="map-traces__filter-label">Esperienza</span>
            <div className="map-traces__chip-rail" role="group" aria-label="Filtra per esperienza">
              {EXPERIENCE_FILTERS.map((filter) => {
                const isActive = activeExperience === filter.id;
                return (
                  <button
                    key={filter.id}
                    ref={isActive ? experienceChipRef : null}
                    type="button"
                    className="map-traces__chip"
                    aria-pressed={isActive}
                    disabled={isLoading || hasDataError}
                    onClick={() => handleExperienceChange(filter.id)}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {!hasDataError && contentMode === 'demo' && !isLoading && (
          <div className="map-traces__notice" role="note">
            <strong>Anteprime editoriali</strong>
            <p>
              Questi pin mostrano come funziona la mappa. Non indicano luoghi visitati né esperienze
              provate da noi.
            </p>
          </div>
        )}

        {hasDataError && (
          <div
            className="map-traces__map-frame map-traces__map-frame--error map-traces__error"
            role="status"
            aria-live="polite"
          >
            <strong>La mappa non si è caricata</strong>
            <p>Puoi riprovare oppure continuare dall’archivio.</p>
            <div className="map-traces__error-actions">
              <button
                type="button"
                className="map-traces__text-action"
                onClick={() => void loadData()}
              >
                Riprova
              </button>
              <Link className="map-traces__text-action" to={archivePath}>
                Apri l’archivio
              </Link>
            </div>
          </div>
        )}

        {!hasDataError && (
          <div className="map-traces__board">
            <div className="map-traces__map-column">
              <div
                className="map-traces__map-frame"
                role="region"
                aria-label="Mappa interattiva delle destinazioni"
              >
                <div className="map-traces__map-canvas">
                  {isLoading && (
                    <div className="map-traces__loading" role="status" aria-live="polite">
                      <span className="map-traces-spinner" aria-hidden="true" />
                      <p>Tracciamo i nostri passi…</p>
                      <span className="sr-only">La mappa si sta caricando.</span>
                    </div>
                  )}
                  <Map
                    ref={mapRef}
                    style={{ width: '100%', height: '100%' }}
                    initialViewState={{ longitude: 12.5, latitude: 42, zoom: 3.5, pitch: 45 }}
                    mapStyle="https://tiles.openfreemap.org/styles/dark"
                    projection="globe"
                    sky={{
                      'atmosphere-blend': 0.8,
                      'sky-color': '#0a0a0a',
                      'fog-color': '#1a1a1a',
                      'horizon-fog-blend': 1,
                    }}
                    onZoom={(event) => setViewZoom(event.viewState.zoom)}
                    interactiveLayerIds={
                      viewZoom < CLUSTER_MAX_ZOOM ? ['clusters', 'unclustered-point'] : []
                    }
                    onClick={(event) => {
                      const feature = event.features?.[0];
                      if (!feature) {
                        closeSelection();
                      } else if (feature.layer?.id === 'clusters') {
                        void handleClusterClick(event);
                      } else if (feature.layer?.id === 'unclustered-point') {
                        handleUnclusteredPointClick(event);
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
                          'circle-color': '#b84d2e',
                          'circle-radius': ['step', ['get', 'point_count'], 16, 10, 20, 50, 26],
                          'circle-stroke-width': 2,
                          'circle-stroke-color': '#fffaf1',
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
                          'circle-color': '#b84d2e',
                          'circle-radius': 7,
                          'circle-stroke-width': 2,
                          'circle-stroke-color': '#fffaf1',
                        }}
                      />
                    </Source>
                    {viewZoom >= CLUSTER_MAX_ZOOM && pins}
                    {selectedArticle && (
                      <Popup
                        anchor="bottom"
                        longitude={selectedArticle.lng}
                        latitude={selectedArticle.lat}
                        onClose={closeSelection}
                        closeButton={false}
                        closeOnClick={false}
                        className="twu-map-popup"
                        offset={[0, -36]}
                        maxWidth="min(320px, calc(100vw - 32px))"
                      >
                        {renderTraceCard(selectedArticle, false)}
                      </Popup>
                    )}
                  </Map>
                </div>
              </div>
              {selectedArticle && (
                <div className="map-traces__selected--mobile">
                  {renderTraceCard(selectedArticle, true)}
                </div>
              )}
            </div>

            <aside className="map-traces__presets" aria-labelledby="map-presets-title">
              <p className="map-traces__eyebrow">Selezione di Viaggio</p>
              <h2 id="map-presets-title">Percorsi suggeriti</h2>
              <p className="map-traces__presets-intro">
                Scegli una traccia: la mappa applica i filtri e restringe la selezione.
              </p>
              <div className="map-traces__preset-list">
                {MAP_ROUTE_PRESETS.map((preset) => {
                  const isActive =
                    activeContinent === preset.continent && activeExperience === preset.experience;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      className="map-traces__preset"
                      aria-pressed={isActive}
                      disabled={isLoading || hasDataError}
                      onClick={() => handleRoutePreset(preset)}
                    >
                      <strong>
                        {preset.title} <ArrowRight size={15} aria-hidden="true" />
                      </strong>
                      <span>{preset.meta}</span>
                      <small>{preset.description}</small>
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        )}

        {!hasDataError && contentMode === 'empty' && (
          <div className="map-traces__empty" role="status">
            <strong>Nessuna traccia con questi filtri.</strong>
            <p>Prova un altro continente o un altro tipo di esperienza.</p>
            <div className="map-traces__empty-actions">
              <button type="button" className="map-traces__text-action" onClick={resetFilters}>
                Mostra tutte
              </button>
            </div>
          </div>
        )}
      </div>

      {!hasDataError && !isLoading && filteredArticles.length > 0 && (
        <section className="map-traces__results" aria-labelledby="map-results-title">
          <div className="map-traces__results-heading">
            <div>
              <p className="map-traces__eyebrow">Mappa &amp; Destinazioni</p>
              <h2 id="map-results-title">Tracce trovate</h2>
            </div>
            <p>
              {filteredArticles.length} {filteredArticles.length === 1 ? 'risultato' : 'risultati'}
            </p>
          </div>
          <div
            className="map-traces__result-list"
            aria-label={`${filteredArticles.length} ${
              filteredArticles.length === 1 ? 'traccia filtrata' : 'tracce filtrate'
            }`}
          >
            {filteredArticles.map((article) => {
              const visual = CATEGORY_VISUAL[article.category] || { Icon: MapPin };
              const ResultIcon = visual.Icon;
              const isActive = selectedArticle?.id === article.id;
              return (
                <button
                  key={`trace-card-${article.id}`}
                  type="button"
                  className="map-traces__result"
                  aria-pressed={isActive}
                  aria-label={`Mostra ${article.title} sulla mappa`}
                  onClick={(event) => focusArticle(article, event.currentTarget, true)}
                >
                  <span className="map-traces__result-mark" aria-hidden="true">
                    <ResultIcon size={19} />
                  </span>
                  <span className="map-traces__result-copy">
                    <span>
                      {getTraceLocation(article)}
                      {article.isEditorialPreview ? ' · Anteprima' : ''}
                    </span>
                    <strong>{article.title}</strong>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {!hasDataError && (
        <div className="map-traces__final">
          <Link
            to={archivePath}
            className="map-traces__archive-link"
            onClick={() =>
              trackEvent('map_to_explore_click', {
                source_page: '/mappa',
                zone: activeContinent,
                type: activeExperience,
              })
            }
          >
            <MapPin size={16} aria-hidden="true" />
            Apri l’archivio
          </Link>
        </div>
      )}
    </section>
  );
}
