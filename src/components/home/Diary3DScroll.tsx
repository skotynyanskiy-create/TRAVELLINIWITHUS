import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Compass, ArrowRight } from 'lucide-react';
import TiltCard from '../TiltCard';

// Registriamo ScrollTrigger per GSAP
gsap.registerPlugin(ScrollTrigger);

interface TappaViaggio {
  id: string;
  number: string;
  title: string;
  region: string;
  coordinates: string;
  description: string;
  stat: string;
  statLabel: string;
  link: string;
  image: string;
  imageMobile: string;
}

const TAPPE: TappaViaggio[] = [
  {
    id: 'puglia',
    number: '01',
    title: 'Puglia Segreta',
    region: "Salento & Valle d'Itria",
    coordinates: '40.1653° N, 18.2915° E',
    description:
      'Sulle tracce di borghi bianchi addormentati, uliveti secolari e calette di roccia selvaggia scoperte lontano dal caos estivo.',
    stat: '14',
    statLabel: 'calette mappate',
    link: '/esplora?zone=Italia&type=posti-particolari',
    image: '/images/destinations/puglia.webp',
    imageMobile: '/images/destinations/puglia-480.avif',
  },
  {
    id: 'dolomiti',
    number: '02',
    title: "Le Dolomiti d'Alba",
    region: 'Cortina & Val di Funes',
    coordinates: '46.5100° N, 12.1380° E',
    description:
      "Il momento esatto in cui le pareti di dolomia si tingono di rosa all'alba, prima che il sentiero si popoli e il silenzio si rompa.",
    stat: '6',
    statLabel: 'rifugi isolati testati',
    link: '/esplora?zone=Italia&type=hotel-con-carattere',
    image: '/images/destinations/dolomiti.webp',
    imageMobile: '/images/destinations/dolomiti-480.avif',
  },
  {
    id: 'islanda',
    number: '03',
    title: 'Natura Ancestrale',
    region: 'Islanda & Ring Road',
    coordinates: '64.9631° N, 19.0208° W',
    description:
      '3200 km tra deserti di sabbia nera, cascate fragorose e sorgenti calde nascoste nelle pieghe di una terra viva e ribelle.',
    stat: '3200',
    statLabel: 'km di avventura',
    link: '/esplora?zone=Europa',
    image: '/images/destinations/islanda.webp',
    imageMobile: '/images/destinations/islanda-480.avif',
  },
  {
    id: 'giappone',
    number: '04',
    title: 'Lanterne & Templi',
    region: 'Kyoto & Vicoli di Tokyo',
    coordinates: '36.2048° N, 138.2529° E',
    description:
      "I giardini di muschio all'alba, i treni proiettile veloci e i piccoli templi di quartiere illuminati da lanterne di carta rossa nella notte.",
    stat: '22',
    statLabel: 'tappe insolite incluse',
    link: '/esplora?zone=Asia',
    image: '/images/destinations/giappone.webp',
    imageMobile: '/images/destinations/giappone-480.avif',
  },
  {
    id: 'autori',
    number: '05',
    title: 'Chi Siamo',
    region: 'Rodrigo & Betta',
    coordinates: '260K+ Community',
    description:
      'Siamo viaggiatori accaniti e narratori visivi. Raccontiamo posti particolari con foto autentiche e consigli utili provati sul campo in prima persona.',
    stat: '100%',
    statLabel: 'consigli sinceri',
    link: '/chi-siamo',
    image: '/images/brand/couple-travel.webp',
    imageMobile: '/images/brand/couple-travel-480.avif',
  },
];

interface Diary3DScrollProps {
  onScrollEnd: () => void;
}

export default function Diary3DScroll({ onScrollEnd }: Diary3DScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTappa, setActiveTappa] = useState(0);

  // Rileva se mobile per attivare lo Sticky Card-Stack nativo
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animazione Desktop: 3D Z-axis Tunnel Scroll con GSAP
  useGSAP(
    () => {
      if (isMobile) return;

      const cards = gsap.utils.toArray<HTMLElement>('.diary-card-wrapper');

      // Timeline agganciata allo scroll verticale con pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSectionRef.current,
          start: 'top top',
          end: '+=400%', // 400% dell'altezza del viewport per dare spazio allo scorrimento delle 5 tappe
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            // Calcola quale tappa è attiva in base al progresso dello scroll
            const progress = self.progress;
            const index = Math.min(Math.floor(progress * TAPPE.length), TAPPE.length - 1);
            setActiveTappa(index);
          },
          onLeave: () => {
            onScrollEnd();
          },
        },
      });

      // Animazione sequenziale delle Polaroid 3D
      // Card 0 è già visibile al centro all'inizio.
      // Man mano che si scorre, Card 0 sfreccia in avanti (Z positivo) e sfuma,
      // mentre Card 1 risale dal fondo (Z negativo) posizionandosi al centro (Z=0).
      cards.forEach((card, index) => {
        if (index === 0) {
          // Card 0 sfreccia in avanti e scompare
          tl.to(
            card,
            {
              z: 900,
              opacity: 0,
              scale: 1.15,
              pointerEvents: 'none',
              ease: 'power1.in',
              duration: 1,
            },
            0
          );
        } else {
          // Le card successive salgono dal fondo (Z da -1800px a 0px)
          // E poi continuano in avanti (Z da 0px a 900px) nello scroll successivo
          tl.fromTo(
            card,
            {
              z: -2000,
              opacity: 0,
              scale: 0.8,
              pointerEvents: 'none',
            },
            {
              z: 0,
              opacity: 1,
              scale: 1,
              pointerEvents: 'auto',
              ease: 'power2.out',
              duration: 1,
            },
            (index - 1) * 1.5 + 0.5
          );

          if (index < cards.length - 1) {
            tl.to(
              card,
              {
                z: 900,
                opacity: 0,
                scale: 1.15,
                pointerEvents: 'none',
                ease: 'power1.in',
                duration: 1,
              },
              index * 1.5 + 0.5
            );
          }
        }
      });
    },
    { scope: containerRef, dependencies: [isMobile] }
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {isMobile ? (
        /* ================= MOBILE LAYOUT: STICKY CARD-STACK ================= */
        <div className="relative bg-[var(--color-sand)] px-4 py-20 flex flex-col gap-32">
          {/* Timeline progress bar e GPS in testa mobile */}
          <div className="sticky top-20 z-40 bg-[var(--color-sand)]/90 backdrop-blur-md py-4 border-b border-[var(--color-border)] flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 animate-spin-slow text-[var(--color-accent)]" />
              <span className="font-serif italic text-sm text-[var(--color-ink)]">
                {TAPPE[activeTappa]?.region}
              </span>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-[var(--color-muted-fg)]">
              {TAPPE[activeTappa]?.coordinates}
            </div>
          </div>

          {TAPPE.map((tappa, index) => (
            <div
              key={tappa.id}
              className="sticky top-28 bg-white rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 shadow-[var(--shadow-md)] flex flex-col gap-6"
              style={{
                top: `${80 + index * 12}px`,
                transformOrigin: 'top center',
                willChange: 'transform',
              }}
            >
              {/* Polaroid Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-muted-bg)]">
                <picture>
                  <source srcSet={tappa.imageMobile} type="image/avif" />
                  <img
                    src={tappa.image}
                    alt={tappa.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </picture>
                <div className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold text-white tracking-widest font-mono">
                  {tappa.number}
                </div>
              </div>

              {/* Dettagli della Tappa */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-accent)] font-bold">
                  {tappa.region}
                </span>
                <h2 className="font-serif text-2xl font-medium text-[var(--color-ink)]">
                  {tappa.title}
                </h2>
                <p className="text-sm leading-relaxed text-[var(--color-ink-2)]">
                  {tappa.description}
                </p>

                {/* Stat Badge */}
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="font-serif text-2xl font-bold text-[var(--color-accent)]">
                    {tappa.stat}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-fg)] font-semibold leading-tight">
                    {tappa.statLabel}
                  </span>
                </div>

                {/* Link */}
                <Link
                  to={tappa.link}
                  className="mt-4 self-start inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
                >
                  Esplora <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= DESKTOP LAYOUT: 3D SPATIAL SCROLL ================= */
        <div
          ref={scrollSectionRef}
          className="scroll-container relative h-screen w-full overflow-hidden bg-[var(--color-sand)]"
        >
          {/* Background grid */}
          <div className="absolute inset-0 twu-dot-grid opacity-10 pointer-events-none" />

          {/* HUD LATERALE: Timeline Progress */}
          <div className="absolute left-12 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-8">
            <div className="text-[10px] font-mono tracking-widest text-[var(--color-muted-fg)] rotate-270 mb-4 select-none">
              TAIL OF MEMORIES
            </div>
            <div className="relative h-48 w-0.5 bg-[var(--color-border)] rounded-full">
              <motion.div
                className="absolute top-0 left-0 w-full bg-[var(--color-accent)] rounded-full"
                animate={{
                  height: `${((activeTappa + 1) / TAPPE.length) * 100}%`,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              />
            </div>
            <div className="font-serif text-lg font-medium text-[var(--color-ink)] select-none">
              {TAPPE[activeTappa]?.number}
            </div>
          </div>

          {/* HUD DESTRA: GPS Coordinate & Compass */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-6 text-right select-none">
            <div className="flex items-center gap-3">
              <span className="font-serif italic text-sm text-[var(--color-ink)]">
                {TAPPE[activeTappa]?.region}
              </span>
              <Compass className="h-5 w-5 animate-spin-slow text-[var(--color-accent)]" />
            </div>
            <div className="font-mono text-xs tracking-widest text-[var(--color-muted-fg)]">
              {TAPPE[activeTappa]?.coordinates}
            </div>
          </div>

          {/* PERSPECTIVE VIEWPORT CONTAINER */}
          <div
            className="relative h-full w-full flex items-center justify-center"
            style={{
              perspective: '1200px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            {/* 3D TRACK WRAPPER */}
            <div
              className="diary-3d-track relative h-full w-full flex items-center justify-center"
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              {TAPPE.map((tappa, index) => {
                // Alternanza di layout per creare dinamismo
                const isEven = index % 2 === 0;
                // Offsets spaziali (X, Y) per creare la traiettoria sinusoidale (sentiero)
                const offsetX = isEven ? '-16vw' : '16vw';
                const offsetY = isEven ? '-4vh' : '4vh';

                return (
                  <div
                    key={tappa.id}
                    className="diary-card-wrapper absolute w-[900px] max-w-[85vw] flex items-center justify-between pointer-events-none"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `translate3d(${index === 4 ? '0' : offsetX}, ${index === 4 ? '0' : offsetY}, ${-index * 2000}px)`,
                      opacity: index === 0 ? 1 : 0,
                      willChange: 'transform, opacity',
                    }}
                  >
                    {/* Polaroid Visual (sx o dx in base all'alternanza) */}
                    <div
                      className={`w-[420px] shrink-0 transform-3d pointer-events-auto ${
                        isEven ? 'order-1' : 'order-2'
                      }`}
                    >
                      <TiltCard maxTilt={8}>
                        <div
                          className="bg-white p-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-xl)] pointer-events-auto select-none"
                          data-cursor="Dettagli"
                        >
                          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-muted-bg)]">
                            <img
                              src={tappa.image}
                              alt={tappa.title}
                              className="h-full w-full object-cover"
                              loading="eager"
                            />
                            <div className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold text-white tracking-widest font-mono">
                              {tappa.number}
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)]/40 pt-4">
                            <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] font-mono">
                              {tappa.coordinates}
                            </span>
                            <span className="font-serif italic text-xs text-[var(--color-accent)]">
                              {tappa.region}
                            </span>
                          </div>
                        </div>
                      </TiltCard>
                    </div>

                    {/* Dettagli Tappa (Testo affiancato) */}
                    <div
                      className={`w-[400px] flex flex-col gap-4 pointer-events-auto ${
                        isEven ? 'order-2 text-left pl-8' : 'order-1 text-left pr-8'
                      }`}
                    >
                      <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold">
                        {tappa.region}
                      </span>
                      <h2 className="font-serif text-4xl font-medium leading-tight text-[var(--color-ink)]">
                        {tappa.title}
                      </h2>
                      <p className="text-body-editorial text-sm leading-relaxed text-[var(--color-ink-2)]">
                        {tappa.description}
                      </p>

                      {/* Stat Strip */}
                      <div className="flex items-center gap-3 py-2">
                        <span className="font-serif text-4xl font-bold text-[var(--color-accent)]">
                          {tappa.stat}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted-fg)] font-semibold leading-tight max-w-[120px]">
                          {tappa.statLabel}
                        </span>
                      </div>

                      {/* CTA Link */}
                      <Link
                        to={tappa.link}
                        className="mt-2 self-start inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors border-b border-[var(--color-ink)]/20 pb-1"
                      >
                        Esplora Destinazione <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
