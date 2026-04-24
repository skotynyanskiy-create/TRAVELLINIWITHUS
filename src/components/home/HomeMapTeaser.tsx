import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';

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

const TEASER_WORLD_SHAPES = [
  'M64 126C54 108 68 86 99 78C129 69 160 74 182 91C200 105 194 125 171 139C143 155 84 153 64 126Z',
  'M148 165C173 150 205 158 219 184C233 209 219 244 199 264C178 285 156 278 149 249C142 221 126 178 148 165Z',
  'M246 112C280 91 333 88 371 105C404 120 402 143 372 159C340 177 282 174 249 158C220 144 219 129 246 112Z',
  'M332 180C365 168 407 179 425 205C446 236 428 269 397 281C364 294 331 275 319 244C307 216 306 190 332 180Z',
  'M445 165C476 141 534 143 570 168C608 195 599 228 561 247C522 267 473 260 444 236C416 212 416 186 445 165Z',
  'M504 271C529 259 565 265 583 288C599 310 588 333 563 344C536 355 504 342 493 319C482 296 482 282 504 271Z',
];

function projectPoint([longitude, latitude]: [number, number]) {
  const x = ((longitude + 180) / 360) * 640;
  const clampedLat = Math.max(-85, Math.min(85, latitude));
  const latRad = (clampedLat * Math.PI) / 180;
  const mercator = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = 320 / 2 - (640 * mercator) / (2 * Math.PI);

  return {
    x: Math.max(18, Math.min(622, x)),
    y: Math.max(32, Math.min(288, y)),
  };
}

export default function HomeMapTeaser() {
  return (
    <section className="bg-[var(--color-sand)] py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
            Dove siamo stati
          </span>
          <h2 className="mt-4 max-w-xl font-serif text-4xl leading-[1.05] text-ink md:text-5xl">
            I posti che <span className="italic text-black/70">stiamo raccontando</span>.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-black/72">
            Dalla Valle d'Itria alla Ring Road islandese: la mappa si allarga solo quando un posto
            ha abbastanza da dire per meritare un racconto completo, non una scheda copiata.
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
          <svg
            viewBox="0 0 640 320"
            role="img"
            aria-label="Mappa delle destinazioni Travelliniwithus"
            className="h-[320px] w-full md:h-[420px]"
          >
            <rect width="640" height="320" fill="var(--color-sand)" />
            {TEASER_WORLD_SHAPES.map((shape) => (
              <path
                key={shape}
                d={shape}
                fill="var(--color-surface)"
                stroke="var(--color-ink)"
                strokeOpacity="0.22"
                strokeWidth="1"
              />
            ))}
            {HOME_TEASER_MARKERS.map((marker) => {
              const { x, y } = projectPoint(marker.coordinates);

              return (
                <g key={marker.name}>
                  <circle cx={x} cy={y} r="12" fill="var(--color-accent)" fillOpacity="0.24" />
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill="var(--color-accent)"
                    stroke="var(--color-surface)"
                    strokeWidth="2"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
