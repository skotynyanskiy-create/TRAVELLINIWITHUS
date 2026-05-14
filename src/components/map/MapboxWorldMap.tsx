import { useState, useEffect, useMemo, useRef } from 'react';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  type MapRef,
} from 'react-map-gl/mapbox';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  X,
  Compass,
  BookOpen,
  Map as MapIcon,
  UtensilsCrossed,
  Hotel,
  Sparkles,
  Star,
} from 'lucide-react';
import { fetchArticles } from '../../services/firebaseService';
import type { NormalizedArticle } from '../../utils/articleData';
import { DEMO_ARTICLE_PREVIEW, DEMO_ARTICLES_EXTRA } from '../../config/demoContent';

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
  'Food & Ristoranti': { Icon: UtensilsCrossed, label: 'Food' },
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

type ArticleWithCoords = NormalizedArticle & {
  lat: number;
  lng: number;
  isPartner: boolean;
};

import 'mapbox-gl/dist/mapbox-gl.css';

const RAW_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
/**
 * Valida il token Mapbox prima di passarlo a react-map-gl.
 * Mapbox pubblici sono nel formato `pk.eyJ...` (JWT base64). Qualunque
 * altra stringa (incluso il placeholder `INSERISCI_QUI` di .env.example)
 * causa un 401 silenzioso che renderizza la mappa tutta nera. Il
 * fallback editoriale di sotto subentra solo quando questa funzione
 * ritorna false.
 */
const MAPBOX_TOKEN =
  RAW_MAPBOX_TOKEN && RAW_MAPBOX_TOKEN.startsWith('pk.') ? RAW_MAPBOX_TOKEN : undefined;

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
  const [articles, setArticles] = useState<ArticleWithCoords[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleWithCoords | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [activeContinent, setActiveContinent] = useState<ContinentFilter>('all');

  const filteredArticles = useMemo(
    () =>
      activeContinent === 'all'
        ? articles
        : articles.filter((a) => (a as { continent?: string }).continent === activeContinent),
    [articles, activeContinent]
  );

  /** Centra la mappa sull'articolo + apre popup. Usato sia dal click marker
   *  che dal click sulla card della mini-lista sottostante. */
  const focusArticle = (article: ArticleWithCoords) => {
    setSelectedArticle(article);
    mapRef.current?.flyTo({
      center: [article.lng, article.lat],
      zoom: 5.2,
      duration: 1200,
      essential: true,
    });
  };

  useEffect(() => {
    // Permissive input type — accettiamo sia NormalizedArticle (Firebase, con
    // Timestamp) sia gli oggetti demo (createdAt come string). I campi
    // davvero usati sono solo id/slug/title/category/image/excerpt + country.
    const placeOnMap = (list: ReadonlyArray<Record<string, unknown>>) =>
      list
        .map((article, index) => {
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

        if (mappedData.length > 0) {
          setArticles(mappedData);
          setUsingDemo(false);
        } else {
          // Firestore vuoto: fallback su anteprime editoriali per non
          // mostrare la mappa nuda. Quando R+B pubblica articoli reali
          // con campo `country`, il fallback viene saltato automaticamente.
          const demo = placeOnMap([
            DEMO_ARTICLE_PREVIEW,
            ...DEMO_ARTICLES_EXTRA,
          ] as unknown as ReadonlyArray<Record<string, unknown>>);
          setArticles(demo);
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
              className={`relative cursor-pointer transition-transform ${
                isActive ? 'scale-125' : 'hover:scale-110'
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
    [filteredArticles, selectedArticle]
  );

  if (!MAPBOX_TOKEN) {
    return (
      <div className="relative flex h-full w-full items-center justify-center bg-[var(--color-ink)] px-6 text-center text-white">
        <div className="max-w-md">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[var(--color-accent)]">
            <Compass size={24} />
          </div>
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            Mappa in preparazione
          </div>
          <h1 className="mb-4 font-serif text-3xl leading-tight md:text-4xl">
            Stiamo caricando le destinazioni sulla mappa.
          </h1>
          <p className="mb-8 text-sm font-light text-white/60">
            Nel frattempo puoi già esplorare i luoghi uno a uno, divisi per continente e criterio di
            scelta.
          </p>
          <Link
            to="/destinazioni"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-transparent hover:bg-white hover:text-[var(--color-ink)]"
          >
            <MapPin size={14} /> Vai alle destinazioni
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-[var(--color-ink)]">
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

      <div className="pointer-events-none absolute left-4 top-8 z-10 md:left-8">
        <div className="pointer-events-auto max-w-xs rounded-[var(--radius-md)] border border-[var(--color-ink)]/5 bg-[var(--color-surface)]/95 p-6 shadow-xl backdrop-blur-xl">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            <Navigation size={14} /> Mappa Interattiva
          </div>
          <h1 className="mb-1 text-2xl font-serif text-[var(--color-ink)]">Il nostro mondo.</h1>
          <p className="text-xs font-light text-[var(--color-ink)]/50">
            {filteredArticles.length}{' '}
            {filteredArticles.length === 1 ? 'destinazione' : 'destinazioni'}
            {usingDemo ? ' (anteprime editoriali)' : ' esplorate'}
            {activeContinent !== 'all' && ` · ${activeContinent}`}
          </p>
        </div>
      </div>

      {/* Filter chips per continente — top center desktop, top scrollable mobile */}
      <div className="pointer-events-none absolute inset-x-0 top-8 z-10 flex justify-center px-4 md:top-8">
        <div className="pointer-events-auto flex max-w-full gap-1.5 overflow-x-auto rounded-full border border-white/12 bg-[var(--color-ink)]/70 p-1.5 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CONTINENT_FILTERS.map((f) => {
            const isActive = activeContinent === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveContinent(f.id)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? 'bg-[var(--color-accent)] text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/8 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <Link
        to="/destinazioni"
        className="absolute bottom-44 right-8 z-10 inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)]/5 bg-[var(--color-surface)]/95 px-5 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] shadow-xl backdrop-blur-xl transition-all hover:border-transparent hover:bg-[var(--color-ink)] hover:text-white md:bottom-36"
      >
        <MapPin size={14} /> Destinazioni
      </Link>

      {/* Mini-lista articoli orizzontale (scroll-snap) — sincronizzata con i marker */}
      {filteredArticles.length > 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 px-4 md:bottom-6">
          <div
            className="pointer-events-auto -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-auto md:max-w-5xl md:gap-4"
            aria-label={`${filteredArticles.length} destinazioni filtrate`}
          >
            {filteredArticles.map((article) => {
              const isActive = selectedArticle?.id === article.id;
              const cat = article.category;
              const visual = (cat && CATEGORY_VISUAL[cat]) || { Icon: MapPin, label: 'Posto' };
              const CatIcon = visual.Icon;

              return (
                <button
                  key={`card-${article.id}`}
                  type="button"
                  onClick={() => focusArticle(article)}
                  aria-pressed={isActive}
                  aria-label={`Mostra ${article.title} sulla mappa`}
                  className={`group flex shrink-0 basis-[78%] snap-start items-center gap-3 rounded-[var(--radius-md)] border bg-[var(--color-surface)]/95 px-3 py-2.5 text-left shadow-xl backdrop-blur-xl transition-all sm:basis-[44%] md:basis-[260px] ${
                    isActive
                      ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30'
                      : 'border-[var(--color-ink)]/5 hover:border-[var(--color-accent)]/40'
                  }`}
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[var(--color-muted-bg)]">
                    {article.image && (
                      <img
                        src={article.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}
                    <span
                      className={`absolute -bottom-0 -right-0 flex h-5 w-5 items-center justify-center rounded-tl-md ${
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
                    <p className="line-clamp-2 text-xs font-serif leading-tight text-[var(--color-ink)] md:text-sm">
                      {article.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 12.5,
          latitude: 42.0,
          zoom: 3.5,
          pitch: 45,
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" />
        <FullscreenControl position="bottom-right" />

        {pins}

        {selectedArticle && (
          <Popup
            anchor="bottom"
            longitude={selectedArticle.lng}
            latitude={selectedArticle.lat}
            onClose={() => setSelectedArticle(null)}
            closeButton={false}
            closeOnClick={false}
            className="z-50"
            offset={[0, -40]}
          >
            <div className="relative w-[300px] overflow-hidden rounded-[var(--radius-md)] bg-white p-0 shadow-2xl">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedArticle(null);
                }}
                className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-[var(--color-ink)]"
              >
                <X size={14} />
              </button>

              <Link
                to={`/articolo/${selectedArticle.slug || selectedArticle.id}`}
                className="group relative block"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-muted-bg)]">
                  {selectedArticle.image && (
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="rounded-full bg-white/95 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink)] shadow-md">
                      {selectedArticle.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="mb-2 line-clamp-2 font-serif text-xl leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                    {selectedArticle.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-xs font-light text-black/50">
                    {selectedArticle.excerpt}
                  </p>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                    Leggi la guida →
                  </div>
                </div>
              </Link>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
