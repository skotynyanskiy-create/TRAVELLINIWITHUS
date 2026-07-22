import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { Volume2, VolumeX } from 'lucide-react';
import MagneticWrapper from '../MagneticWrapper';

interface SplashIntroProps {
  onEnter: () => void;
}

/**
 * Schermata di benvenuto cinematografica (copertina del diario).
 * Rende l'ingresso al sito un rito interattivo unico.
 * Dispone di un audio chime sintetico tramite Web Audio API.
 */
export default function SplashIntro({ onEnter }: SplashIntroProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Forza lo scroll a zero all'avvio per evitare posizionamenti intermedi
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Web Audio API: Sintetizzatore di accordo acustico rilassante (chime)
  const playIntroChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      // Accordo di quinta (A3 = 220Hz, E4 = 330Hz, A4 = 440Hz, C#5 = 554.37Hz)
      const frequencies = [220, 330, 440, 554.37];
      const oscillators = frequencies.map((freq, index) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Timbro cinematico e morbido
        osc.type = index % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Aggiunge un lieve vibrato naturale
        if (index > 0) {
          osc.frequency.setValueAtTime(freq + (Math.random() * 2 - 1), now);
        }

        // Volume Envelope: Attacco immediato e decadimento esponenziale lungo (3s)
        gainNode.gain.setValueAtTime(0.0, now);
        gainNode.gain.linearRampToValueAtTime(0.08, now + 0.15);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        return osc;
      });

      oscillators.forEach((osc) => {
        osc.start(now);
        osc.stop(now + 3.8);
      });
    } catch (e) {
      console.warn('Audio context initialization was blocked or failed:', e);
    }
  };

  const handleEnterClick = () => {
    setIsExiting(true);
    playIntroChime();

    // Rivelazione circolare tramite GSAP
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 1.4,
        ease: 'power4.inOut',
        onComplete: () => {
          onEnter();
        },
      });
    } else {
      onEnter();
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-[var(--color-ink-deep)] px-6 text-white select-none"
      style={{
        clipPath: 'circle(150% at 50% 50%)',
        willChange: 'clip-path',
      }}
    >
      {/* Sfondo stellato o griglia cinetica ultra-subtle */}
      <div className="absolute inset-0 twu-dot-grid opacity-20 pointer-events-none" />

      {/* Controllo volume angolare */}
      <button
        type="button"
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="absolute right-8 top-8 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/15 transition-all duration-300 pointer-events-auto"
        aria-label={soundEnabled ? 'Disattiva suono introduzione' : 'Attiva suono introduzione'}
      >
        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      {/* Area Contenuto Centrale */}
      <div className="relative flex flex-col items-center text-center max-w-xl">
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white/50 mb-6 font-sans"
        >
          Rodrigo &amp; Betta · Guida d'Autore
        </motion.span>

        {/* Titolo Logo */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-8"
        >
          Travellini<span className="text-[var(--color-accent)] font-semibold">with</span>us
        </motion.h1>

        {/* Citazione di Viaggio Evocativa */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          className="font-serif italic text-white/70 text-base sm:text-lg leading-relaxed mb-12 max-w-md px-4"
        >
          &ldquo;Ci sono luoghi che non si trovano sulle mappe. <br className="hidden sm:inline" />
          Si trovano viaggiando.&rdquo;
        </motion.p>

        {/* Bottone Magnetico di Ingresso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
          className="pointer-events-auto cursor-pointer"
        >
          <MagneticWrapper strength={15}>
            <button
              type="button"
              onClick={handleEnterClick}
              disabled={isExiting}
              data-cursor="Entra"
              className="px-10 py-5 rounded-full bg-white text-[var(--color-ink)] font-sans text-xs font-bold uppercase tracking-[0.18em] shadow-[0_12px_32px_rgba(255,255,255,0.06)] hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300 ease-out flex items-center justify-center"
            >
              Entra nel Sito
            </button>
          </MagneticWrapper>
        </motion.div>
      </div>

      {/* Info autori in basso */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 font-serif italic text-xs text-white/50"
      >
        Rodrigo & Betta
      </motion.div>
    </div>
  );
}
