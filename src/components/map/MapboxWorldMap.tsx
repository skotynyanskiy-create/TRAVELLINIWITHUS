import { useState, useEffect, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl/mapbox';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, X, Compass } from 'lucide-react';
import { fetchArticles } from '../../services/firebaseService';
import type { NormalizedArticle } from '../../utils/articleData';

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  Italia: { lat: 41.8719, lng: 12.5674 },
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
  const [articles, setArticles] = useState<Array<NormalizedArticle & { lat: number; lng: number }>>(
    []
  );
  const [selectedArticle, setSelectedArticle] = useState<
    (NormalizedArticle & { lat: number; lng: number }) | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchArticles();
        const mappedData = data
          .map((article, index) => {
            const countryKey = article.country || article.continent || '';
            const coords = COUNTRY_COORDS[countryKey];
            if (!coords) return null;

            const variance = 0.3;
            const offset = (index % 5) * variance - variance;

            return {
              ...article,
              lat: coords.lat + offset * 0.6,
              lng: coords.lng + offset,
            };
          })
          .filter(
            (article): article is NormalizedArticle & { lat: number; lng: number } =>
              article !== null
          );

        setArticles(mappedData);
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const pins = useMemo(
    () =>
      articles.map((article, index) => (
        <Marker
          key={`marker-${article.id || index}`}
          longitude={article.lng}
          latitude={article.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelectedArticle(article);
          }}
        >
          <div className="h-8 w-8 cursor-pointer animate-bounce text-[var(--color-accent)] drop-shadow-xl transition-transform hover:scale-110 md:h-10 md:w-10">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
            </svg>
          </div>
        </Marker>
      )),
    [articles]
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
            Nel frattempo puoi già esplorare i luoghi uno a uno, divisi per continente e criterio di scelta.
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
        <div className="pointer-events-auto max-w-xs rounded-2xl border border-[var(--color-ink)]/5 bg-[var(--color-surface)]/95 p-6 shadow-xl backdrop-blur-xl">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            <Navigation size={14} /> Mappa Interattiva
          </div>
          <h1 className="mb-1 text-2xl font-serif text-[var(--color-ink)]">Il nostro mondo.</h1>
          <p className="text-xs font-light text-[var(--color-ink)]/50">
            {articles.length} destinazioni esplorate
          </p>
        </div>
      </div>

      <Link
        to="/destinazioni"
        className="absolute bottom-8 right-8 z-10 inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)]/5 bg-[var(--color-surface)]/95 px-5 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] shadow-xl backdrop-blur-xl transition-all hover:border-transparent hover:bg-[var(--color-ink)] hover:text-white"
      >
        <MapPin size={14} /> Destinazioni
      </Link>

      <Map
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
            <div className="relative w-[300px] overflow-hidden rounded-2xl bg-white p-0 shadow-2xl">
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
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
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
