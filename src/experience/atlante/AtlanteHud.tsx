import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Volume2, VolumeX, ArrowRight, ArrowDown } from 'lucide-react';
import { ATLANTE_WAYPOINTS } from './atlanteData';
import { trackEvent } from '../../services/analytics';

export default function AtlanteHud({
  active,
  scrollProgress,
}: {
  active: number;
  scrollProgress: number;
}) {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true);
  const [isWiping, setIsWiping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentWaypoint = ATLANTE_WAYPOINTS[active];
  const total = ATLANTE_WAYPOINTS.length;

  // Manage ambient soundscape audio playback
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!isMuted && currentWaypoint?.audioUrl) {
      const audio = new Audio(currentWaypoint.audioUrl);
      audio.loop = true;
      audio.volume = 0.3;
      audio.play().catch((err) => {
        console.warn('Audio autoplay prevented:', err);
      });
      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [active, isMuted, currentWaypoint?.audioUrl]);

  // Handle premium transition out
  const handleTransitionOut = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    e.preventDefault();
    trackEvent('atlante_transition_out', { waypoint_id: currentWaypoint?.id, target_route: to });
    setIsWiping(true);
    setTimeout(() => {
      navigate(to);
    }, 800); // 800ms aligns with CSS transit duration
  };

  return (
    <>
      {/* Terracotta page wipe overlay */}
      <div
        className={`pointer-events-none fixed inset-0 z-[999] bg-[var(--color-accent)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isWiping ? 'translate-y-0' : '-translate-y-full'
        }`}
      />

      <div className="pointer-events-none fixed inset-0 z-[120] text-white flex flex-col justify-between p-8 select-none">
        {/* TOP HUD BAR */}
        <div className="w-full flex items-center justify-between pointer-events-auto">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Compass className="h-5 w-5 animate-spin-slow text-[var(--color-accent)]" />
            <span className="font-serif text-base tracking-tight text-white">
              Travellini<span className="text-[var(--color-accent)]">with</span>us
            </span>
            <span className="ml-1.5 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/40">
              L'Atlante
            </span>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-6">
            {/* Ambient Sound Toggle */}
            {currentWaypoint?.audioUrl && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Attiva audio ambientale' : 'Disattiva audio'}
              >
                {isMuted ? (
                  <>
                    <VolumeX size={14} className="text-white/40" />
                    <span className="hidden sm:inline">Audio Off</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={14} className="text-[var(--color-accent)]" />
                    <span className="hidden sm:inline text-white/80">Audio On</span>
                  </>
                )}
              </button>
            )}

            {/* Quick Exit */}
            <Link
              to="/esplora"
              onClick={(e) => handleTransitionOut(e, '/esplora')}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white"
            >
              Archivio
            </Link>
          </div>
        </div>

        {/* MIDDLE HUD CONTENT - Sfoglio Diario */}
        <div className="flex-grow flex items-center justify-between w-full h-full my-6">
          {/* Cap / Waypoint detail card (alternates side based on step) */}
          <div
            className={`w-full max-w-xl flex ${active % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          >
            <div className="pointer-events-auto w-full max-w-md bg-[#0b0805]/65 backdrop-blur-md border border-white/5 p-6 sm:p-8 rounded-[var(--radius-xl)] shadow-2xl">
              <AnimatePresence mode="wait">
                {currentWaypoint && (
                  <motion.div
                    key={currentWaypoint.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)]">
                      {currentWaypoint.kicker}
                    </span>
                    <h2 className="mt-2 mb-3 font-serif text-2xl sm:text-3xl font-medium leading-tight text-white">
                      {currentWaypoint.title}
                    </h2>
                    <p className="mb-5 text-xs sm:text-sm font-light leading-relaxed text-white/70">
                      {currentWaypoint.description}
                    </p>

                    {/* Field Notes in serif italic with accent left-border */}
                    <div className="mb-6 pl-4 border-l-2 border-[var(--color-accent)]">
                      <p className="font-serif text-xs italic text-white/60 leading-relaxed">
                        &ldquo;{currentWaypoint.fieldNote}&rdquo;
                      </p>
                    </div>

                    {/* Stage transition buttons */}
                    {active === total - 1 ? (
                      <div className="flex flex-col gap-3">
                        <Link
                          to="/mappa"
                          onClick={(e) => handleTransitionOut(e, '/mappa')}
                          className="flex items-center justify-between w-full rounded-full border border-white/20 hover:border-transparent bg-white/5 hover:bg-white text-white hover:text-[#0b0805] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300"
                        >
                          Apri la Mappa <ArrowRight size={14} />
                        </Link>
                      </div>
                    ) : (
                      <Link
                        to={currentWaypoint.route}
                        onClick={(e) => handleTransitionOut(e, currentWaypoint.route)}
                        className="inline-flex items-center gap-2.5 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300"
                      >
                        {currentWaypoint.ctaText} <ArrowRight size={14} />
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* SVG Map Progress Bar (Italy outline showing journey line drawing itself) */}
          <div className="hidden lg:flex flex-col items-center gap-4 pointer-events-auto bg-[#0b0805]/45 backdrop-blur-sm border border-white/5 p-5 rounded-2xl">
            <span className="font-serif text-xs text-white/40 tracking-wider">ROTA</span>

            {/* Elegant simplified Italy route path */}
            <div className="relative w-16 h-36">
              <svg
                viewBox="0 0 100 220"
                className="w-full h-full opacity-60"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {/* Background dotted route representing total path */}
                <path
                  d="M 50 10 C 60 40, 45 70, 40 100 C 35 130, 65 160, 75 190 L 85 210"
                  stroke="rgba(255,255,255,0.15)"
                  strokeDasharray="4 4"
                />

                {/* Dynamically drawing path that fills as scrollProgress increases */}
                <path
                  d="M 50 10 C 60 40, 45 70, 40 100 C 35 130, 65 160, 75 190 L 85 210"
                  stroke="var(--color-accent)"
                  strokeDasharray="260"
                  strokeDashoffset={260 - scrollProgress * 260}
                  className="transition-all duration-300"
                />

                {/* Glowing waypoint dot tracking the current active node */}
                {currentWaypoint && (
                  <circle
                    cx={50 + scrollProgress * 35} // Simple linear approximation for path tracing
                    cy={10 + scrollProgress * 200}
                    r="4"
                    fill="var(--color-accent)"
                    className="animate-pulse"
                  />
                )}
              </svg>
            </div>

            <span className="font-mono text-[10px] text-white/40 tracking-widest">
              {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* BOTTOM HUD FOOTER */}
        <div className="w-full flex items-center justify-between">
          <div className="text-[9px] font-mono tracking-widest text-white/30 uppercase">
            © {new Date().getFullYear()} Rodrigo & Betta
          </div>

          {active === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="flex flex-col items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/40"
            >
              Scorri <ArrowDown size={14} className="text-[var(--color-accent)] animate-bounce" />
            </motion.div>
          )}

          <div className="text-[9px] font-mono tracking-widest text-white/30 uppercase">
            TRAVELLINIWITHUS
          </div>
        </div>
      </div>
    </>
  );
}
