import { useState, useEffect, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl/mapbox';
import { fetchArticles } from '../services/firebaseService';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, X } from 'lucide-react';
import SEO from '../components/SEO';
import type { NormalizedArticle } from '../utils/articleData';

interface MapArticle extends NormalizedArticle {
  lat: number;
  lng: number;
}

import 'mapbox-gl/dist/mapbox-gl.css';

// You will need to set this environment variable in .env or hardcode a fallback mapbox token
// VITE_MAPBOX_TOKEN=pk.eyJ1...
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZVB1YmxpYyIsImEiOiJjbG9jaHZ2bTEwMXY0MmxtYW02a3B5NWJjIn0.EXAMPLE';

// Mappa finta del mondo per fallback di coordinate, dato che le API attuali forse non hanno coordinate salvate.
// Per creare la VERA esperienza dovremo fare un reverse geocoding o chiedere agli admin di inserire coord.
// Qui generiamo coordinate semi-casuali o preimpostate basandoci sul Paese.
const COUNTRY_COORDS: Record<string, { lat: number, lng: number }> = {
  // Europa
  'Italia': { lat: 41.8719, lng: 12.5674 },
  'Francia': { lat: 46.2276, lng: 2.2137 },
  'Spagna': { lat: 40.4637, lng: -3.7492 },
  'Portogallo': { lat: 39.3999, lng: -8.2245 },
  'Grecia': { lat: 39.0742, lng: 21.8243 },
  'Croazia': { lat: 45.1000, lng: 15.2000 },
  'Germania': { lat: 51.1657, lng: 10.4515 },
  'Austria': { lat: 47.5162, lng: 14.5501 },
  'Svizzera': { lat: 46.8182, lng: 8.2275 },
  'Olanda': { lat: 52.1326, lng: 5.2913 },
  'Paesi Bassi': { lat: 52.1326, lng: 5.2913 },
  'Belgio': { lat: 50.5039, lng: 4.4699 },
  'Gran Bretagna': { lat: 55.3781, lng: -3.4360 },
  'Inghilterra': { lat: 52.3555, lng: -1.1743 },
  'Irlanda': { lat: 53.1424, lng: -7.6921 },
  'Scozia': { lat: 56.4907, lng: -4.2026 },
  'Repubblica Ceca': { lat: 49.8175, lng: 15.4730 },
  'Ungheria': { lat: 47.1625, lng: 19.5033 },
  'Polonia': { lat: 51.9194, lng: 19.1451 },
  'Romania': { lat: 45.9432, lng: 24.9668 },
  'Bulgaria': { lat: 42.7339, lng: 25.4858 },
  'Turchia': { lat: 38.9637, lng: 35.2433 },
  'Danimarca': { lat: 56.2639, lng: 9.5018 },
  'Svezia': { lat: 60.1282, lng: 18.6435 },
  'Norvegia': { lat: 60.4720, lng: 8.4689 },
  'Finlandia': { lat: 61.9241, lng: 25.7482 },
  'Islanda': { lat: 64.9631, lng: -19.0208 },
  'Albania': { lat: 41.1533, lng: 20.1683 },
  'Montenegro': { lat: 42.7087, lng: 19.3744 },
  'Slovenia': { lat: 46.1512, lng: 14.9955 },
  'Malta': { lat: 35.9375, lng: 14.3754 },
  // Asia
  'Giappone': { lat: 36.2048, lng: 138.2529 },
  'Tailandia': { lat: 15.8700, lng: 100.9925 },
  'Indonesia': { lat: -0.7893, lng: 113.9213 },
  'Bali': { lat: -8.3405, lng: 115.0920 },
  'Vietnam': { lat: 14.0583, lng: 108.2772 },
  'Cambogia': { lat: 12.5657, lng: 104.9910 },
  'India': { lat: 20.5937, lng: 78.9629 },
  'Sri Lanka': { lat: 7.8731, lng: 80.7718 },
  'Emirati Arabi': { lat: 23.4241, lng: 53.8478 },
  'Dubai': { lat: 25.2048, lng: 55.2708 },
  'Marocco': { lat: 31.7917, lng: -7.0926 },
  // Oceano Indiano
  'Maldive': { lat: 3.2028, lng: 73.2207 },
  'Mauritius': { lat: -20.3484, lng: 57.5522 },
  // Americhe
  'Stati Uniti': { lat: 37.0902, lng: -95.7129 },
  'Messico': { lat: 23.6345, lng: -102.5528 },
  'Brasile': { lat: -14.2350, lng: -51.9253 },
  'Argentina': { lat: -38.4161, lng: -63.6167 },
  'Cuba': { lat: 21.5218, lng: -77.7812 },
  'Colombia': { lat: 4.5709, lng: -74.2973 },
  'Perù': { lat: -9.1900, lng: -75.0152 },
  // Africa
  'Egitto': { lat: 26.8206, lng: 30.8025 },
  'Tanzania': { lat: -6.3690, lng: 34.8888 },
  'Kenya': { lat: -0.0236, lng: 37.9062 },
};

export default function Mappa() {
  const [articles, setArticles] = useState<MapArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<MapArticle | null>(null);
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
            if (!coords) return null; // skip articles with unknown location
            // small variance per article index (deterministic, no random) to avoid exact overlap
            const variance = 0.3;
            const offset = (index % 5) * variance - variance;
            return {
              ...article,
              lat: coords.lat + offset * 0.6,
              lng: coords.lng + offset,
            };
          })
          .filter((a): a is MapArticle => a !== null);
        setArticles(mappedData);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
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
          <div className="w-8 h-8 md:w-10 md:h-10 cursor-pointer text-[var(--color-accent)] animate-bounce drop-shadow-xl hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/>
            </svg>
          </div>
        </Marker>
      )),
    [articles]
  );

  return (
    <div className="relative w-full h-screen bg-[#111] pt-20">
      <SEO
        title="Esplora la Mappa Globale"
        description="Scopri gli itinerari e le destinazioni di Travelliniwithus attraverso la nostra mappa interattiva 3D."
      />

      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#111]">
          <div className="flex flex-col items-center gap-4 text-white/60">
            <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest">Caricamento mappa...</span>
          </div>
        </div>
      )}

      {/* MAP TITLE OVERLAY */}
      <div className="absolute top-28 left-4 md:left-8 z-10 pointer-events-none">
         <div className="bg-[var(--color-surface)]/95 backdrop-blur-xl border border-[var(--color-ink)]/5 p-6 rounded-2xl shadow-xl max-w-xs pointer-events-auto">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">
              <Navigation size={14} /> Mappa Interattiva
            </div>
            <h1 className="text-2xl font-serif text-[var(--color-ink)] mb-1">Il nostro mondo.</h1>
            <p className="text-[var(--color-ink)]/50 font-light text-xs">{articles.length} destinazioni esplorate</p>
         </div>
      </div>

      {/* Back to destinations */}
      <Link
        to="/destinazioni"
        className="absolute bottom-8 right-8 z-10 inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)]/95 backdrop-blur-xl border border-[var(--color-ink)]/5 px-5 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] shadow-xl transition-all hover:bg-[var(--color-ink)] hover:text-white hover:border-transparent"
      >
        <MapPin size={14} /> Destinazioni
      </Link>

      <Map
        initialViewState={{
          longitude: 12.5,
          latitude: 42.0,
          zoom: 3.5,
          pitch: 45
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
            <div className="w-[300px] p-0 overflow-hidden rounded-2xl bg-white shadow-2xl relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedArticle(null); }}
                className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[var(--color-ink)] transition-colors"
              >
                <X size={14} />
              </button>
              
              <Link to={`/articolo/${selectedArticle.slug || selectedArticle.id}`} className="block group relative">
                <div className="aspect-video w-full overflow-hidden relative bg-zinc-100">
                  {selectedArticle.image && (
                    <img 
                      src={selectedArticle.image} 
                      alt={selectedArticle.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute bottom-3 left-3 flex gap-2">
                     <span className="bg-white/95 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink)] shadow-md">
                        {selectedArticle.category}
                     </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl text-[var(--color-ink)] leading-tight mb-2 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                    {selectedArticle.title}
                  </h3>
                  <p className="text-xs text-black/50 font-light line-clamp-2 mb-4">
                    {selectedArticle.excerpt}
                  </p>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                    Leggi la guida &#8594;
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
