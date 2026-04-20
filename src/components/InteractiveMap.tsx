import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, X, Globe } from 'lucide-react';
import { siteContentDefaults } from '../config/siteContent';
import { DEMO_ARTICLE_MARKERS } from '../config/demoContent';
import { useSiteContent } from '../hooks/useSiteContent';

const geoUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

export interface MapMarker {
  id: string | number;
  name: string;
  coordinates: [number, number];
  link?: string;
  image?: string;
  category?: string;
  title?: string;
}

interface InteractiveMapProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function InteractiveMap({
  markers,
  center = [0, 30],
  zoom = 1,
  className = 'w-full h-[500px] md:h-[600px]',
}: InteractiveMapProps) {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);
  const [activeCountry, setActiveCountry] = useState<{ name: string; id: string } | null>(null);
  const resolvedMarkers =
    markers ?? (demoSettings.showDestinationDemo ? DEMO_ARTICLE_MARKERS : []);

  const handleCountryClick = (geo: { properties: { name: string }; id?: string }) => {
    setActiveMarker(null);
    setActiveCountry({
      name: geo.properties.name,
      id: geo.id || geo.properties.name,
    });
  };

  const closeCards = () => {
    setActiveMarker(null);
    setActiveCountry(null);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-black/5 bg-[var(--color-sand)] shadow-inner">
      <div className="pointer-events-none absolute left-6 top-6 z-10">
        <h3 className="text-2xl font-serif text-black/80">Esplora la mappa</h3>
        <p className="text-sm font-normal text-black/65">
          Clicca sui pin o sulle nazioni per orientarti tra i contenuti.
        </p>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 140,
          center,
        }}
        className={`${className} outline-none`}
      >
        <ZoomableGroup zoom={zoom} minZoom={1} maxZoom={8}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isCountryActive = activeCountry?.name === geo.properties.name;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    fill={isCountryActive ? 'var(--color-accent)' : '#e5e0d8'}
                    stroke={isCountryActive ? '#fff' : 'var(--color-accent)'}
                    strokeWidth={isCountryActive ? 1 : 0.5}
                    strokeOpacity={isCountryActive ? 1 : 0.3}
                    style={{
                      default: { outline: 'none', transition: 'all 250ms' },
                      hover: {
                        fill: isCountryActive ? 'var(--color-accent)' : '#dcd5cb',
                        outline: 'none',
                        transition: 'all 250ms',
                        cursor: 'pointer',
                      },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {resolvedMarkers.map((marker) => {
            const isActive = activeMarker?.id === marker.id;

            return (
              <Marker
                key={marker.id}
                coordinates={marker.coordinates}
                onClick={() => {
                  setActiveCountry(null);
                  setActiveMarker(marker);
                }}
                className="cursor-pointer outline-none"
              >
                <g transform="translate(-12, -24)">
                  {isActive && (
                    <motion.ellipse
                      cx="12"
                      cy="24"
                      rx="10"
                      ry="5"
                      fill="rgba(155, 127, 166, 0.4)"
                      initial={{ scale: 0.5, opacity: 1 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                  <motion.g
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ originX: '12px', originY: '24px' }}
                    initial={{ scale: 1, y: 0 }}
                    animate={{
                      scale: isActive ? 1.25 : 1,
                      y: isActive ? -6 : 0,
                    }}
                    whileHover={{ scale: 1.15, y: -3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <circle
                      cx="12"
                      cy="10"
                      r="3"
                      fill={isActive ? '#fff' : 'var(--color-accent)'}
                    />
                    <path
                      d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"
                      fill={isActive ? 'var(--color-accent)' : 'rgba(155, 127, 166, 0.2)'}
                    />
                  </motion.g>
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      <AnimatePresence mode="wait">
        {activeMarker && (
          <motion.div
            key={`marker-${activeMarker.id}`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-6 left-6 right-6 z-20 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl md:left-auto md:right-6 md:w-80"
          >
            <button
              onClick={closeCards}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-colors hover:bg-black/40"
            >
              <X size={16} />
            </button>
            {activeMarker.image && (
              <div className="relative h-40 overflow-hidden">
                <img
                  src={activeMarker.image}
                  alt={activeMarker.name}
                  className="h-full w-full object-cover"
                />
                {activeMarker.category && (
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-sm">
                    {activeMarker.category}
                  </div>
                )}
              </div>
            )}
            <div className="p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black/50">
                <MapPin size={12} className="text-[var(--color-accent)]" />
                {activeMarker.name}
              </div>
              {activeMarker.title && (
                <h4 className="mb-4 text-lg font-serif leading-tight">{activeMarker.title}</h4>
              )}
              {activeMarker.link && (
                <Link
                  to={activeMarker.link}
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)] transition-colors hover:text-black"
                >
                  Leggi articolo <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </motion.div>
        )}

        {activeCountry && !activeMarker && (
          <motion.div
            key={`country-${activeCountry.id}`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-6 left-6 right-6 z-20 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl md:left-auto md:right-6 md:w-80"
          >
            <button
              onClick={closeCards}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-black/50 transition-colors hover:bg-black/10"
            >
              <X size={16} />
            </button>
            <div className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-sand)] text-[var(--color-accent)]">
                <Globe size={24} />
              </div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black/50">
                Destinazione
              </div>
              <h4 className="mb-2 text-2xl font-serif leading-tight">{activeCountry.name}</h4>
              <p className="mb-6 text-sm font-normal leading-relaxed text-black/70">
                Scopri tutte le nostre guide, consigli e itinerari dedicati a questa destinazione.
              </p>
              <Link
                to="/destinazioni"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
              >
                Esplora <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
