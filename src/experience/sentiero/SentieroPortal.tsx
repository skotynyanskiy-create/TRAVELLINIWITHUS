import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import MagneticWrapper from '../../components/MagneticWrapper';

/** Chime acustico breve su gesto utente (autoplay-safe). */
function playChime() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    [220, 330, 440, 554.37].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 3.4);
    });
  } catch {
    /* audio bloccato: il portale funziona comunque */
  }
}

export default function SentieroPortal({ onEnter }: { onEnter: () => void }) {
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    playChime();
    window.setTimeout(onEnter, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1, scale: exiting ? 1.06 : 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0b0805] px-6 text-center text-white select-none"
    >
      <div className="absolute inset-0 twu-dot-grid opacity-20 pointer-events-none" />

      <div className="relative flex max-w-xl flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 0.55, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50"
        >
          Le Tracce
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35 }}
          className="mb-7 font-serif text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl"
        >
          Travellini<span className="font-semibold text-[var(--color-accent)]">with</span>us
          <span className="sr-only"> — le tracce dei posti che proviamo davvero</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 0.82, y: 0 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="mb-11 max-w-md px-4 font-serif text-base leading-relaxed text-white/75 sm:text-lg"
        >
          Un reel fa venire voglia. Una traccia ti aiuta a partire. Segui le note di viaggio di
          Rodrigo & Betta e scopri come trasformiamo il racconto social in utilità reale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.75 }}
          className="cursor-pointer"
        >
          <MagneticWrapper strength={15}>
            <button
              type="button"
              onClick={handleEnter}
              disabled={exiting}
              data-cursor="Entra"
              className="flex items-center gap-3 rounded-full bg-white px-10 py-5 font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-ink)] transition-colors duration-300 hover:bg-[var(--color-accent)] hover:text-white"
            >
              Segui le tracce <ArrowDown size={14} />
            </button>
          </MagneticWrapper>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.32 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 font-serif text-xs italic text-white/50"
      >
        Rodrigo & Betta
      </motion.div>
    </motion.div>
  );
}
