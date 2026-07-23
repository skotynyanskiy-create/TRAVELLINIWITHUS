import { useState, useRef, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Play, Sparkles, X, Volume2, ArrowRight } from 'lucide-react';
import OptimizedImage from '@/src/components/OptimizedImage';

export interface HolographicTicketProps {
  id: string;
  title: string;
  location: string;
  type: string;
  score: string;
  price: string;
  cover: string;
  videoSrc: string;
  caption: string;
}

export default function HolographicTicketCard({
  title,
  location,
  type,
  score,
  price,
  cover,
  videoSrc,
  caption,
}: HolographicTicketProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [modalOpen, setModalOpen] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <>
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setModalOpen(true);
          }
        }}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        onClick={() => setModalOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-white/20 bg-[var(--color-ink,#1a2b3c)]/90 p-6 text-white shadow-2xl backdrop-blur-xl transition-all hover:border-[var(--color-accent,#c85a32)]/50 hover:shadow-[0_20px_50px_rgba(200,90,50,0.25)]"
      >
        {/* Dynamic Holographic Foil Sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(212, 175, 55, 0.35) 0%, rgba(200, 90, 50, 0.25) 45%, transparent 70%)`,
          }}
        />

        {/* Card Header & Passport Seal */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent,#c85a32)]">
            <Sparkles size={12} />
            <span>Passaporto Travellini</span>
          </div>
          <span className="rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--color-sand)]">
            {score}
          </span>
        </div>

        {/* Cover Media Preview */}
        <div className="relative my-5 aspect-[4/5] w-full overflow-hidden rounded-xl bg-black/30">
          <OptimizedImage
            src={cover}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
            <MapPin size={10} className="text-[var(--color-accent)]" />
            {location}
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[var(--color-ink)] shadow-2xl transition-transform group-hover:scale-110">
              <Play size={22} className="ml-1 fill-current" />
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent,#c85a32)]">
              {type}
            </span>
            <h3 className="font-serif text-lg font-normal leading-snug">{title}</h3>
          </div>
        </div>

        {/* Card Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-4 text-xs">
          <span className="font-semibold text-white/80">{price}</span>
          <span className="inline-flex items-center gap-1 font-bold text-[var(--color-accent)] group-hover:translate-x-1 transition-transform">
            Apri Reel <ArrowRight size={14} />
          </span>
        </div>
      </div>

      {/* 9:16 Video Lightbox */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4 backdrop-blur-lg"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-sm overflow-hidden rounded-3xl bg-black shadow-2xl border border-white/20"
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black hover:bg-white"
              >
                <X size={18} />
              </button>

              <video
                src={videoSrc}
                poster={cover}
                autoPlay
                loop
                controls
                className="h-[75vh] w-full object-cover"
              >
                <track kind="captions" />
              </video>

              <div className="bg-gradient-to-t from-black via-black/90 to-transparent p-5 text-white">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-accent,#c85a32)] mb-1">
                  <Volume2 size={14} />
                  {location} · Reel Verificato
                </div>
                <p className="text-xs leading-relaxed text-white/90">{caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
