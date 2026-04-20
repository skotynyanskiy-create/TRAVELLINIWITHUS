import { Link } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { ArrowRight, MapPin } from 'lucide-react';

const geoUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

type TeaserMarker = {
  name: string;
  coordinates: [number, number];
};

const HOME_TEASER_MARKERS: TeaserMarker[] = [
  { name: 'Islanda', coordinates: [-19.0208, 64.9631] },
  { name: 'Dolomiti', coordinates: [11.8476, 46.4102] },
  { name: 'Puglia', coordinates: [17.3797, 40.8014] },
  { name: 'Giappone', coordinates: [138.2529, 36.2048] },
  { name: 'Marocco', coordinates: [-7.0926, 31.7917] },
];

export default function HomeMapTeaser() {
  return (
    <section className="bg-[var(--color-sand)] py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
            Dove siamo stati
          </span>
          <h2 className="mt-4 max-w-xl font-serif text-4xl leading-[1.05] text-ink md:text-5xl">
            Un mondo di posti <span className="italic text-black/55">vissuti davvero</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-black/62">
            Ogni destinazione che raccontiamo è un viaggio che abbiamo fatto. Niente guide copiate:
            solo luoghi esplorati, verificati e scelti uno a uno.
          </p>
          <Link
            to="/destinazioni"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
          >
            Esplora le destinazioni <ArrowRight size={14} />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
          <div className="pointer-events-none absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full bg-[var(--color-sand)]/80 px-3 py-1.5 backdrop-blur-sm">
            <MapPin size={12} className="text-[var(--color-accent)]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-black/70">
              {HOME_TEASER_MARKERS.length} destinazioni raccontate
            </span>
          </div>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 110, center: [10, 30] }}
            className="h-[320px] w-full md:h-[420px]"
            aria-label="Mappa delle destinazioni Travelliniwithus"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="var(--color-sand)"
                    stroke="var(--color-ink)"
                    strokeWidth={0.35}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: 'var(--color-sand)' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
            {HOME_TEASER_MARKERS.map((marker) => (
              <Marker key={marker.name} coordinates={marker.coordinates}>
                <circle r={6} fill="var(--color-accent)" stroke="#fff" strokeWidth={2} />
                <circle
                  r={12}
                  fill="var(--color-accent)"
                  fillOpacity={0.18}
                />
              </Marker>
            ))}
          </ComposableMap>
        </div>
      </div>
    </section>
  );
}
