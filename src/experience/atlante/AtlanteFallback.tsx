import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, ArrowDown, ArrowUp, Volume2, VolumeX } from 'lucide-react';
import { ATLANTE_WAYPOINTS, type AtlanteWaypoint } from './atlanteData';
import { trackEvent } from '../../services/analytics';

function poster(media: AtlanteWaypoint['media']): string {
  if (media.type === 'image') return media.src;
  return media.src.replace('/video/', '/images/reels/').replace('.mp4', '-cover.webp');
}

function LazyVideo({
  src,
  posterSrc,
  className,
}: {
  src: string;
  posterSrc: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          el.play?.().catch(() => {});
        } else {
          el.pause?.();
          setMuted(true);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (load) ref.current?.play?.().catch(() => {});
  }, [load]);

  return (
    <>
      <video
        ref={ref}
        src={load ? src : undefined}
        poster={posterSrc}
        muted={muted}
        loop
        playsInline
        preload="none"
        className={className}
      >
        <track kind="captions" />
      </video>
      <button
        type="button"
        onClick={() => {
          setMuted((m) => !m);
          ref.current?.play?.().catch(() => {});
        }}
        aria-label={muted ? 'Attiva audio' : 'Disattiva audio'}
        className="absolute right-4 top-24 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white cursor-pointer"
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
    </>
  );
}

export default function AtlanteFallback() {
  const navigate = useNavigate();
  const [isWiping, setIsWiping] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = ATLANTE_WAYPOINTS.length;

  const scrollToStage = (index: number) => {
    const el = document.getElementById(`stage-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const children = container.children;
      const mid = window.innerHeight / 2;
      let active = 0;

      for (let i = 0; i < children.length; i++) {
        const rect = children[i].getBoundingClientRect();
        if (rect.top <= mid && rect.bottom >= mid) {
          active = i;
          break;
        }
      }
      setActiveIndex(active);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTransitionOut = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    e.preventDefault();
    trackEvent('atlante_mobile_transition_out', { target_route: to });
    setIsWiping(true);
    setTimeout(() => {
      navigate(to);
    }, 800);
  };

  return (
    <>
      {/* Terracotta wipe transition */}
      <div
        className={`pointer-events-none fixed inset-0 z-[999] bg-[var(--color-accent)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isWiping ? 'translate-y-0' : '-translate-y-full'
        }`}
      />

      <div className="relative h-screen w-full overflow-hidden bg-[#0b0805] text-white">
        {/* Fixed Header */}
        <div className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between px-6 py-5 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[var(--color-accent)] animate-spin-slow" />
            <span className="font-serif text-sm tracking-tight">
              Travellini<span className="text-[var(--color-accent)]">with</span>us
            </span>
          </div>

          <Link
            to="/esplora"
            onClick={(e) => handleTransitionOut(e, '/esplora')}
            className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/55"
          >
            Esci
          </Link>
        </div>

        {/* Snap-scroll container */}
        <div
          ref={containerRef}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
        >
          {ATLANTE_WAYPOINTS.map((stage, idx) => {
            const isVideo = stage.media.type === 'video';
            const posterSrc = poster(stage.media);

            return (
              <section
                key={stage.id}
                id={`stage-${idx}`}
                className="relative h-full w-full snap-start snap-always flex flex-col justify-end p-6"
                style={{ backgroundColor: stage.theme.bg }}
              >
                {/* Media backdrop */}
                <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
                  {isVideo ? (
                    <LazyVideo
                      src={stage.media.src}
                      posterSrc={posterSrc}
                      className="h-full w-full object-cover opacity-35"
                    />
                  ) : (
                    <img
                      src={posterSrc}
                      alt={stage.title}
                      className="h-full w-full object-cover opacity-35"
                      loading="lazy"
                    />
                  )}
                  {/* Bottom Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Content card */}
                <div className="relative z-10 w-full mb-16 max-w-md mx-auto">
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)]">
                    {stage.kicker}
                  </span>

                  <h2 className="mt-2 mb-3 font-serif text-3xl font-medium leading-[1.1]">
                    {stage.title}
                  </h2>

                  <p className="mb-4 text-xs font-light leading-relaxed text-white/80">
                    {stage.description}
                  </p>

                  <div className="mb-6 pl-3 border-l border-[var(--color-accent)]">
                    <p className="font-serif text-xs italic text-white/60 leading-relaxed">
                      &ldquo;{stage.fieldNote}&rdquo;
                    </p>
                  </div>

                  <Link
                    to={stage.route}
                    onClick={(e) => handleTransitionOut(e, stage.route)}
                    className="inline-flex w-full items-center justify-between rounded-full bg-[var(--color-accent)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                  >
                    {stage.ctaText} <ArrowRight size={14} />
                  </Link>
                </div>
              </section>
            );
          })}
        </div>

        {/* Floating Indicator Dots */}
        <div className="fixed right-4 top-1/2 z-20 -translate-y-1/2 flex flex-col gap-3">
          {ATLANTE_WAYPOINTS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToStage(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'w-5 bg-[var(--color-accent)]' : 'w-2 bg-white/20'
              }`}
              aria-label={`Vai al capitolo ${idx + 1}`}
            />
          ))}
        </div>

        {/* Scroll cues */}
        {activeIndex === 0 && (
          <div className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.25em] text-white/40">
            Scorri <ArrowDown size={12} className="text-[var(--color-accent)] animate-bounce" />
          </div>
        )}

        {activeIndex === total - 1 && (
          <button
            onClick={() => scrollToStage(0)}
            className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.25em] text-white/40 cursor-pointer"
          >
            <ArrowUp size={12} className="text-[var(--color-accent)]" /> Torna su
          </button>
        )}
      </div>
    </>
  );
}
