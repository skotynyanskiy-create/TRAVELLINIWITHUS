import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, X } from 'lucide-react';
import { siteContentDefaults } from '../config/siteContent';
import { DEMO_ARTICLE_MARKERS } from '../config/demoContent';
import { useSiteContent } from '../hooks/useSiteContent';

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

const WORLD_SHAPES = [
  'M105 145C92 123 105 95 137 82C171 68 205 72 232 91C254 106 252 128 232 143C203 165 133 175 105 145Z',
  'M216 177C240 163 277 164 296 188C318 214 310 255 286 284C267 307 247 336 219 325C190 314 194 273 204 238C211 215 196 190 216 177Z',
  'M316 118C351 96 402 87 444 101C485 115 490 147 459 169C425 193 353 195 317 174C291 158 291 134 316 118Z',
  'M412 194C446 183 493 194 514 222C538 254 524 296 491 314C456 333 410 319 392 286C374 253 381 204 412 194Z',
  'M542 178C578 151 640 151 686 178C731 204 727 248 684 273C643 297 584 287 548 258C514 231 510 202 542 178Z',
  'M611 306C638 291 678 296 701 320C724 344 718 379 691 394C662 411 621 399 602 373C584 348 584 322 611 306Z',
];

function projectPoint([longitude, latitude]: [number, number]) {
  const x = ((longitude + 180) / 360) * 760;
  const clampedLat = Math.max(-85, Math.min(85, latitude));
  const latRad = (clampedLat * Math.PI) / 180;
  const mercator = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = 360 / 2 - (760 * mercator) / (2 * Math.PI);

  return {
    x: Math.max(24, Math.min(736, x)),
    y: Math.max(36, Math.min(324, y)),
  };
}

export default function InteractiveMap({
  markers,
  center: _center = [0, 30],
  zoom: _zoom = 1,
  className = 'w-full h-[500px] md:h-[600px]',
}: InteractiveMapProps) {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);
  const resolvedMarkers = markers ?? (demoSettings.showDestinationDemo ? DEMO_ARTICLE_MARKERS : []);

  const closeCards = () => {
    setActiveMarker(null);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-black/5 bg-[var(--color-sand)] shadow-inner">
      <div className="pointer-events-none absolute left-6 top-6 z-10">
        <h3 className="text-2xl font-serif text-black/80">Esplora la mappa</h3>
        <p className="text-sm font-normal text-black/65">
          Clicca sui pin per orientarti tra guide, itinerari e destinazioni.
        </p>
      </div>

      <svg
        viewBox="0 0 760 360"
        role="img"
        aria-label="Mappa editoriale delle destinazioni Travelliniwithus"
        className={`${className} outline-none`}
      >
        <defs>
          <linearGradient id="map-water" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-sand)" />
            <stop offset="100%" stopColor="var(--color-surface)" />
          </linearGradient>
        </defs>
        <rect width="760" height="360" fill="url(#map-water)" />
        {WORLD_SHAPES.map((shape) => (
          <path
            key={shape}
            d={shape}
            fill="var(--color-surface)"
            stroke="var(--color-accent)"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
        ))}
        {resolvedMarkers.map((marker) => {
          const isActive = activeMarker?.id === marker.id;
          const { x, y } = projectPoint(marker.coordinates);

          return (
            <motion.g
              key={marker.id}
              role="button"
              tabIndex={0}
              aria-label={`Apri ${marker.name}`}
              className="cursor-pointer outline-none"
              onClick={() => setActiveMarker(marker)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setActiveMarker(marker);
                }
              }}
              initial={{ scale: 1 }}
              animate={{ scale: isActive ? 1.18 : 1 }}
              whileHover={{ scale: 1.12 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
            >
              {isActive && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r="10"
                  fill="var(--color-accent)"
                  initial={{ scale: 0.8, opacity: 0.32 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r="13"
                fill="var(--color-surface)"
                stroke="var(--color-accent)"
                strokeWidth="2"
              />
              <circle cx={x} cy={y} r="6" fill="var(--color-accent)" />
            </motion.g>
          );
        })}
      </svg>

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
      </AnimatePresence>
    </div>
  );
}
