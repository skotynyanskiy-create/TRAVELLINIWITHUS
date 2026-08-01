import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Audience layer a 3 pubblici (decision 2026-07-24):
 *  - 'viaggiatori'  → esperienza travel (default)
 *  - 'family'       → Travellini Family (/family/*)
 *  - 'brand'        → collaborazioni/B2B (/collaborazioni, /media-kit)
 *
 * Unica fonte di verità per navbar, footer, gate d'ingresso e CTA. Sostituisce
 * lo stato locale 'b2c'|'b2b' che viveva nella Navbar e le derivazioni da
 * pathname duplicate nel Footer.
 */

export type Audience = 'viaggiatori' | 'family' | 'brand';

const STORAGE_KEY = 'travellini_audience';
const LEGACY_KEY = 'travellini_nav_mode';

function isAudience(value: unknown): value is Audience {
  return value === 'viaggiatori' || value === 'family' || value === 'brand';
}

function persist(audience: Audience) {
  try {
    localStorage.setItem(STORAGE_KEY, audience);
  } catch {
    // storage pieno/negato: l'audience resta in memoria per la sessione
  }
}

/** Migrazione one-shot dalla chiave legacy b2c/b2b. Idempotente, mai throw. */
function readStoredAudience(): Audience | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isAudience(saved)) return saved;
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy === 'b2b' || legacy === 'b2c') {
      const migrated: Audience = legacy === 'b2b' ? 'brand' : 'viaggiatori';
      persist(migrated);
      localStorage.removeItem(LEGACY_KEY);
      return migrated;
    }
  } catch {
    // valori corrotti o storage inaccessibile → default
  }
  return null;
}

/** Rotte che appartengono a un'audience: chi ci atterra vede quella modalità. */
export function audienceFromPath(pathname: string): Audience | null {
  if (pathname.startsWith('/family')) return 'family';
  if (pathname.startsWith('/collaborazioni') || pathname.startsWith('/media-kit')) {
    return 'brand';
  }
  return null;
}

interface AudienceContextType {
  /** Audience effettiva: override da rotta ?? scelta utente ?? 'viaggiatori'. */
  audience: Audience;
  /** Scelta persistita dell'utente (null = mai scelto: il gate può mostrarsi). */
  userAudience: Audience | null;
  /** True se esiste una scelta persistita. */
  hasChosen: boolean;
  /** Registra una scelta esplicita (switcher o gate) e la persiste. */
  setAudience: (audience: Audience) => void;
}

const AudienceContext = createContext<AudienceContextType | undefined>(undefined);

export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [userAudience, setUserAudience] = useState<Audience | null>(readStoredAudience);

  const setAudience = (next: Audience) => {
    setUserAudience(next);
    persist(next);
  };

  // Deep-link al primo caricamento (es. bio IG → /family): se l'utente non ha
  // mai scelto, la rotta d'atterraggio diventa la sua audience — il gate non
  // apparirà mai. Le navigazioni interne successive NON sovrascrivono la scelta.
  useEffect(() => {
    if (userAudience !== null) return;
    const fromPath = audienceFromPath(location.pathname);
    if (fromPath) {
      setUserAudience(fromPath);
      persist(fromPath);
    }
    // Solo al mount: le navigazioni successive sono override temporanei.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AudienceContextType>(() => {
    const routeAudience = audienceFromPath(location.pathname);
    return {
      audience: routeAudience ?? userAudience ?? 'viaggiatori',
      userAudience,
      hasChosen: userAudience !== null,
      setAudience,
    };
  }, [location.pathname, userAudience]);

  // Il tema per audience vive nei token CSS: `index.css` ridefinisce i colori
  // sotto :root[data-audience=...]. Qui l'audience risolta (route override
  // incluso) viene scritta sul <html>; uno script inline in index.html fa lo
  // stesso PRIMA del CSS per evitare il flash del tema sbagliato.
  useEffect(() => {
    document.documentElement.dataset.audience = value.audience;
  }, [value.audience]);

  return <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>;
}

export function useAudience() {
  const context = useContext(AudienceContext);
  if (context === undefined) {
    throw new Error('useAudience must be used within an AudienceProvider');
  }
  return context;
}
