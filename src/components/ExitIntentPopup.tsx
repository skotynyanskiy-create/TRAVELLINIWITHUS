import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import Newsletter from './Newsletter';
import LeadMagnetCover from './LeadMagnetCover';

const STORAGE_KEY = 'twu_exit_popup_dismissed_at';
const SUBSCRIBED_KEY = 'twu_newsletter_subscribed';
const COOLDOWN_DAYS = 30;
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
const DELAY_BEFORE_ELIGIBLE_MS = 8000; // non mostrare prima di 8 secondi sulla pagina

function readDismissedAt(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const ts = Date.parse(raw);
    return Number.isFinite(ts) ? ts : null;
  } catch {
    return null;
  }
}

function isStillInCooldown(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    if (window.localStorage.getItem(SUBSCRIBED_KEY) === '1') return true;
  } catch {
    // ignore
  }
  const dismissedAt = readDismissedAt();
  if (dismissedAt === null) return false;
  return Date.now() - dismissedAt < COOLDOWN_MS;
}

function markDismissed(reason: 'closed' | 'subscribed') {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    if (reason === 'subscribed') {
      window.localStorage.setItem(SUBSCRIBED_KEY, '1');
    }
  } catch {
    // ignore
  }
}

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStillInCooldown()) return;

    let eligible = false;
    let alreadyTriggered = false;
    const eligibilityTimer = setTimeout(() => {
      eligible = true;
    }, DELAY_BEFORE_ELIGIBLE_MS);

    const trigger = () => {
      if (alreadyTriggered) return;
      alreadyTriggered = true;
      setVisible(true);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (!eligible) return;
      if (e.clientY <= 0) trigger();
    };

    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    const handleScroll = () => {
      if (!eligible) return;
      const now = Date.now();
      const delta = lastScrollY - window.scrollY;
      const timeDelta = now - lastScrollTime;
      if (delta > 80 && timeDelta < 300 && window.scrollY < 200) trigger();
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

  const close = () => {
    setVisible(false);
    markDismissed('closed');
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Scrim esterno: unico blur della card, la card resta opaca (no glassmorphism). */}
          <motion.div
            key="exit-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-ink/72 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          <motion.div
            key="exit-card"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Ricevi la guida Alla scoperta dell’Italia nascosta"
            className="fixed inset-x-4 top-1/2 z-[201] mx-auto flex max-w-lg -translate-y-1/2 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-sand/98 p-6 shadow-[var(--shadow-premium)] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:p-8"
          >
            <button
              onClick={close}
              aria-label="Chiudi"
              className="absolute top-5 right-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink/5 text-ink/40 transition-all duration-300 hover:bg-ink/10 hover:text-ink"
            >
              <X size={16} />
            </button>

            <div className="mb-4 flex items-center gap-3">
              <div className="aspect-[4/5] h-11 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-black/10 shadow-xs">
                <LeadMagnetCover variant="compact" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent-text)] sm:text-xs">
                Prima di uscire
              </span>
            </div>

            <h2 className="font-serif text-2xl leading-snug font-medium text-ink sm:text-3xl">
              Alla scoperta dell’Italia nascosta
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/80">
              10 posti provati e consigliati da noi. La mandiamo solo a chi entra nella lista:
              lascia l’email e la apri subito.
            </p>

            <div className="mt-6">
              <Newsletter
                variant="white"
                source="lead_magnet_exit_popup"
                compact
                ctaLabel="Ricevi la guida"
              />
            </div>

            <button
              onClick={close}
              className="mt-6 text-center text-xs font-semibold tracking-widest text-ink/40 uppercase transition-colors duration-300 hover:text-ink/80"
            >
              No grazie, continuo a leggere
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
