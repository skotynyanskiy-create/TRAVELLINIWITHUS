import { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Sphere,
  Graticule,
} from 'react-simple-maps';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Globe, Sparkles, Star, X, ArrowRight } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { getGeocodedContentItems } from '@/src/config/contentLibrary';
import type { ContentItem } from '@/src/types/content';

const geoUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

export default function InteractiveGlobeSection() {
  const [rotation, setRotation] = useState<[number, number, number]>([-15, -30, 0]);
  const [activeItem, setActiveItem] = useState<ContentItem | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  const geocodedItems = getGeocodedContentItems();

  // Smooth auto-rotation effect when idle
  useEffect(() => {
    if (!isRotating || activeItem) return;
    const interval = setInterval(() => {
      setRotation((prev) => [(prev[0] + 0.3) % 360, prev[1], prev[2]]);
    }, 40);
    return () => clearInterval(interval);
  }, [isRotating, activeItem]);

  return (
    <section className="relative border-b border-[var(--color-border,#e5dcd0)] bg-[#0a0f1d] py-20 text-white md:py-28 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,90,50,0.15)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-[var(--color-accent,#c85a32)]">
              <Sparkles size={14} className="animate-pulse" />
              Globo 3D Interattivo
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-white md:text-5xl lg:text-6xl">
              Esplora la Terra in 3D.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-300 md:text-base font-light">
              Gira il globo 3D e scopri dove sono situati i posti particolari e gli alloggi insoliti
              provati sul campo da Rodrigo e Betta.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3 md:mt-0">
            <button
              type="button"
              onClick={() => setIsRotating(!isRotating)}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md hover:bg-white/20 transition-colors"
            >
              <Globe size={14} />
              {isRotating ? 'Pausa Rotazione' : 'Avvia Rotazione'}
            </button>

            <Link
              to="/mappa"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent,#c85a32)] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-amber-600 transition-colors"
            >
              Mappa Full Screen <Compass size={16} />
            </Link>
          </div>
        </div>

        {/* 3D Globe Interactive Container */}
        <div className="relative mx-auto flex items-center justify-center rounded-3xl border border-white/15 bg-[#0e1424] p-4 shadow-2xl min-h-[480px] md:min-h-[580px]">
          {/* Sphere Atmospheric Radial Halo */}
          <div className="pointer-events-none absolute h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-3xl md:h-[460px] md:w-[460px]" />

          <ComposableMap
            projection="geoOrthographic"
            projectionConfig={{
              scale: 230,
              rotate: rotation,
            }}
            className="h-[460px] w-full md:h-[560px] cursor-grab active:cursor-grabbing outline-none"
          >
            {/* Ocean Sphere */}
            <Sphere id="ocean-sphere" fill="#131b2e" stroke="rgba(200,90,50,0.3)" strokeWidth={1} />
            <Graticule stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />

            {/* Geographies (Countries) */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#232f48"
                    stroke="#131b2e"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: '#334466', outline: 'none', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Geocoded 3D Markers */}
            {geocodedItems.map((item) => {
              if (!item.place?.coordinates) return null;
              const { lng, lat } = item.place.coordinates;
              const isActive = activeItem?.id === item.id;

              return (
                <Marker key={item.id} coordinates={[lng, lat]}>
                  <g
                    onClick={() => {
                      setActiveItem(item);
                      setIsRotating(false);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Ripple animation for pins */}
                    <circle
                      r={isActive ? 12 : 8}
                      fill="rgba(200, 90, 50, 0.4)"
                      className="animate-ping"
                    />
                    <circle
                      r={isActive ? 8 : 5}
                      fill={isActive ? '#fbbf24' : '#c85a32'}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />
                  </g>
                </Marker>
              );
            })}
          </ComposableMap>

          {/* Interactive Floating Card Overlay on Click */}
          <AnimatePresence>
            {activeItem && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-6 left-6 right-6 z-20 mx-auto max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-black/85 p-4 text-white backdrop-blur-xl shadow-2xl md:bottom-8 md:left-8"
              >
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X size={16} />
                </button>

                <div className="flex gap-4 items-center">
                  <img
                    src={activeItem.cover}
                    alt={activeItem.title}
                    className="h-20 w-20 rounded-xl object-cover border border-white/15"
                  />
                  <div className="flex-1 pr-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent,#c85a32)]">
                        {activeItem.types[0]}
                      </span>
                      <span className="text-xs text-white/50">·</span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-300">
                        <Star size={10} className="fill-amber-400 text-amber-400" /> Verified
                      </span>
                    </div>
                    <h4 className="mt-1 font-serif text-lg font-normal leading-tight text-white">
                      {activeItem.title}
                    </h4>
                    <p className="mt-1 text-xs text-zinc-400 line-clamp-1">
                      {[activeItem.place?.city, activeItem.place?.region, activeItem.place?.country]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>

                <div className="mt-3 border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300">
                    Zona: {activeItem.zone}
                  </span>
                  <Link
                    to={`/posto/${activeItem.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[var(--color-accent,#c85a32)] hover:underline"
                  >
                    Apri Scheda Completa <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
