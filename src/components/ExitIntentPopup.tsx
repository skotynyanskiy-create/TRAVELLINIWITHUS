import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Gift, ArrowRight } from 'lucide-react';
import Newsletter from './Newsletter';

const SESSION_KEY = 'twu_exit_popup_shown';
const DELAY_BEFORE_ELIGIBLE_MS = 8000; // non mostrare prima di 8 secondi sulla pagina

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Non mostrare se già visto in questa sessione
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let eligible = false;
    const eligibilityTimer = setTimeout(() => {
      eligible = true;
    }, DELAY_BEFORE_ELIGIBLE_MS);

    // Trigger desktop: mouse esce dalla finestra verso l'alto (intento di chiudere tab)
    const handleMouseLeave = (e: MouseEvent) => {
      if (!eligible) return;
      if (e.clientY <= 0) {
        setVisible(true);
        sessionStorage.setItem(SESSION_KEY, '1');
      }
    };

    // Trigger mobile: scroll veloce verso l'alto (intento di uscire)
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    const handleScroll = () => {
      if (!eligible) return;
      const now = Date.now();
      const delta = lastScrollY - window.scrollY;
      const timeDelta = now - lastScrollTime;
      // Scroll up veloce (> 80px in < 300ms) e siamo in alto nella pagina
      if (delta > 80 && timeDelta < 300 && window.scrollY < 200) {
        setVisible(true);
        sessionStorage.setItem(SESSION_KEY, '1');
      }
      lastScrollY = window.scrollY;
      lastScrollTime = now;
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(eligibilityTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const close = () => setVisible(false);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay */}
          <motion.div
            key="exit-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          {/* Card */}
          <motion.div
            key="exit-card"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Iscriviti alla newsletter Travelliniwithus"
            className="fixed inset-x-4 top-1/2 z-[201] mx-auto max-w-lg -translate-y-1/2 overflow-hidden rounded-[2.5rem] bg-white shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
          >
            {/* Close button */}
            <button
              onClick={close}
              aria-label="Chiudi"
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/50 transition-all hover:bg-black/10 hover:text-black"
            >
              <X size={16} />
            </button>

            {/* Top banner */}
            <div className="bg-[var(--color-ink)] px-8 pb-6 pt-8 text-white">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)]/20">
                  <Gift size={20} className="text-[var(--color-accent)]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)]">
                  Prima di andare…
                </span>
              </div>
              <h2 className="text-2xl font-serif leading-snug md:text-3xl">
                Vuoi ricevere i nostri{' '}
                <span className="italic text-[var(--color-accent)]">prossimi contenuti utili</span>?
              </h2>
              <p className="mt-3 text-sm font-normal leading-relaxed text-white/85">
                Posti veri, budget travel, food experience e aggiornamenti sul progetto direttamente in inbox.
              </p>
            </div>

            {/* Form area */}
            <div className="px-8 pb-8 pt-6">
              <Newsletter
                variant="white"
                source="exit_intent_popup"
                compact
                onSuccess={close}
              />
              <button
                onClick={close}
                className="mt-4 w-full text-center text-xs text-black/30 transition-colors hover:text-black/60"
              >
                No grazie, continuo a esplorare
                <ArrowRight size={12} className="ml-1 inline-block" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
