import { type KeyboardEvent, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Link } from '@/src/components/TransitionLink';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, X, Globe } from 'lucide-react';
import { siteContentDefaults } from '../config/siteContent';
import { DEMO_ARTICLE_MARKER } from '../config/demoContent';
import { useSiteContent } from '../hooks/useSiteContent';
import { trackEvent } from '../services/analytics';

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
  /**
   * Quando false (default true), i poligoni paese non sono clickable/focusable.
   * Usato nel contesto articolo dove c'è un singolo marker focalizzato e i 160
   * country button del world atlas sarebbero solo rumore tab/aria.
   */
  interactiveCountries?: boolean;
}

export default function InteractiveMap({
  markers,
  center = [0, 30],
  zoom = 1,
  className = 'w-full h-[500px] md:h-[600px]',
  interactiveCountries = true,
}: InteractiveMapProps) {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);
  const [activeCountry, setActiveCountry] = useState<{ name: string; id: string } | null>(null);
  const resolvedMarkers =
    markers ?? (demoSettings.showDestinationDemo ? [DEMO_ARTICLE_MARKER] : []);

  const handleCountryClick = (geo: { properties: { name: string }; id?: string }) => {
    setActiveMarker(null);
    setActiveCountry({
      name: geo.properties.name,
      id: geo.id || geo.properties.name,
    });
    trackEvent('map_country_click', {
      source_page: window.location.pathname,
      country: geo.properties.name,
    });
  };

  const handleMarkerClick = (marker: MapMarker) => {
    setActiveCountry(null);
    setActiveMarker(marker);
    trackEvent('map_marker_click', {
      source_page: window.location.pathname,
      marker_id: marker.id,
      marker_name: marker.name,
    });
  };

  const handleActivationKey = (event: KeyboardEvent<SVGElement>, callback: () => void) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    callback();
  };

  const closeCards = () => {
    setActiveMarker(null);
    setActiveCountry(null);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[var(--radius-lg)] border border-black/5 bg-[var(--color-sand)] shadow-inner">
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

                const countryProps = interactiveCountries
                  ? {
                      role: 'button' as const,
                      tabIndex: 0,
                      'aria-label': `Apri destinazioni in ${geo.properties.name}`,
                      onClick: () => handleCountryClick(geo),
                      onKeyDown: (event: KeyboardEvent<SVGElement>) =>
                        handleActivationKey(event, () => handleCountryClick(geo)),
                    }
                  : { 'aria-hidden': true as const };
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    {...countryProps}
                    fill={isCountryActive ? 'var(--color-accent)' : '#e5e0d8'}
                    stroke={isCountryActive ? '#fff' : 'var(--color-accent)'}
                    strokeWidth={isCountryActive ? 1 : 0.5}
                    strokeOpacity={isCountryActive ? 1 : 0.3}
                    style={{
                      default: { outline: 'none', transition: 'all 250ms' },
                      hover: interactiveCountries
                        ? {
                            fill: isCountryActive ? 'var(--color-accent)' : '#dcd5cb',
                            outline: 'none',
                            transition: 'all 250ms',
                            cursor: 'pointer',
                          }
                        : { outline: 'none' },
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
                className="cursor-pointer outline-none"
              >
                <g
                  transform="translate(-12, -24)"
                  role="button"
                  tabIndex={0}
                  aria-label={`Apri ${marker.title || marker.name} sulla mappa`}
                  onClick={() => handleMarkerClick(marker)}
                  onKeyDown={(event) => handleActivationKey(event, () => handleMarkerClick(marker))}
                  className="outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
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
            className="absolute bottom-6 left-6 right-6 z-20 overflow-hidden rounded-[var(--radius-md)] border border-black/5 bg-white shadow-2xl md:left-auto md:right-6 md:w-80"
          >
            <button
              onClick={closeCards}
              aria-label="Chiudi scheda mappa"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-black/40 text-white shadow-md backdrop-blur-md transition-colors hover:bg-black/60 md:h-8 md:w-8"
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
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)] backdrop-blur-sm">
                    {activeMarker.category}
                  </div>
                )}
              </div>
            )}
            <div className="p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black/60">
                <MapPin size={12} className="text-[var(--color-accent)]" />
                {activeMarker.name}
              </div>
              {activeMarker.title && (
                <h4 className="mb-4 text-lg font-serif leading-tight">{activeMarker.title}</h4>
              )}
              {activeMarker.link && (
                <Link
                  to={activeMarker.link}
                  onClick={() =>
                    trackEvent('map_article_click', {
                      source_page: window.location.pathname,
                      marker_id: activeMarker.id,
                      marker_name: activeMarker.name,
                    })
                  }
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[var(--color-accent-text)] transition-colors hover:text-black"
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
            className="absolute bottom-6 left-6 right-6 z-20 overflow-hidden rounded-[var(--radius-md)] border border-black/5 bg-white shadow-2xl md:left-auto md:right-6 md:w-80"
          >
            <button
              onClick={closeCards}
              aria-label="Chiudi scheda mappa"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-black/10 text-black/70 backdrop-blur-sm transition-colors hover:bg-black/20 md:h-8 md:w-8"
            >
              <X size={16} />
            </button>
            <div className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-sand)] text-[var(--color-accent)]">
                <Globe size={24} />
              </div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black/60">
                Destinazione
              </div>
              <h4 className="mb-2 text-2xl font-serif leading-tight">{activeCountry.name}</h4>
              <p className="mb-6 text-sm font-normal leading-relaxed text-black/70">
                Usa il finder per incrociare luogo, esperienza, periodo e budget prima di aprire
                l'archivio completo.
              </p>
              <Link
                to="/esplora"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                Parti da Esplora <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
