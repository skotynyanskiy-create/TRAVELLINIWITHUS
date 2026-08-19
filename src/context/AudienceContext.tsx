import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getAudienceInterest,
  isInterestForAudience,
  type InterestId,
} from '../config/audienceInterests';
import { canLoad, onConsentChange } from '../lib/consent';

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
const INTEREST_STORAGE_KEY = 'travellini_interest_profile';

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

type InterestSelections = Partial<Record<Audience, InterestId>>;

function readStoredInterests(): InterestSelections {
  if (typeof window === 'undefined' || !canLoad('personalization')) return {};
  try {
    const raw = localStorage.getItem(INTEREST_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<Record<Audience, unknown>>;
    const selections: InterestSelections = {};
    for (const audience of ['viaggiatori', 'family', 'brand'] as const) {
      const candidate = parsed[audience];
      if (typeof candidate === 'string' && getAudienceInterest(candidate as InterestId)) {
        if (isInterestForAudience(candidate as InterestId, audience)) {
          selections[audience] = candidate as InterestId;
        }
      }
    }
    return selections;
  } catch {
    return {};
  }
}

function persistInterests(selections: InterestSelections) {
  if (!canLoad('personalization')) return;
  try {
    localStorage.setItem(INTEREST_STORAGE_KEY, JSON.stringify(selections));
  } catch {
    // Storage non disponibile: la scelta resta valida fino al refresh.
  }
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
  /** Interesse esplicito per il pubblico risolto dalla rotta. */
  interest: InterestId | null;
  setInterest: (interest: InterestId) => void;
  clearInterest: () => void;
}

const AudienceContext = createContext<AudienceContextType | undefined>(undefined);

export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  // Deep-link al primo caricamento (es. bio IG → /family): se l'utente non ha
  // mai scelto, la rotta d'atterraggio diventa la sua audience. Risolto qui,
  // nell'inizializzatore lazy — non in un useEffect post-mount — perché la
  // testata ora usa `hasChosen` per decidere la propria altezza (estesa alla
  // prima visita, compatta altrimenti - vedi Navbar.tsx/EditionBand.tsx): un
  // effetto che aggiorna lo stato dopo il primo render avrebbe fatto vedere
  // per un frame la testata estesa anche su un atterraggio diretto su
  // /family, per poi ricollassarla — uno spostamento di layout evitabile.
  const [userAudience, setUserAudience] = useState<Audience | null>(() => {
    const stored = readStoredAudience();
    return stored ?? audienceFromPath(location.pathname);
  });
  const [interests, setInterests] = useState<InterestSelections>(readStoredInterests);

  const setAudience = (next: Audience) => {
    setUserAudience(next);
    persist(next);
  };

  // La scrittura su storage resta un effetto (side effect, non stato): lo
  // stato è già corretto dal primo render qui sopra, questo effetto persiste
  // solo l'audience dedotta dalla rotta, così le visite successive la trovano
  // in localStorage. Le navigazioni interne successive NON sovrascrivono la
  // scelta (gira solo al mount, dipendenze vuote per costruzione).
  useEffect(() => {
    if (userAudience !== null && readStoredAudience() === null) {
      persist(userAudience);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () =>
      onConsentChange((consent) => {
        if (consent.personalization) {
          setInterests((current) => {
            persistInterests(current);
            return current;
          });
          return;
        }

        setInterests({});
      }),
    []
  );

  const routeAudience = audienceFromPath(location.pathname);
  const resolvedAudience = routeAudience ?? userAudience ?? 'viaggiatori';

  const setInterest = (next: InterestId) => {
    if (!isInterestForAudience(next, resolvedAudience)) return;
    setInterests((current) => {
      const nextSelections = { ...current, [resolvedAudience]: next };
      persistInterests(nextSelections);
      return nextSelections;
    });
  };

  const clearInterest = () => {
    setInterests((current) => {
      const remaining = { ...current };
      delete remaining[resolvedAudience];
      persistInterests(remaining);
      return remaining;
    });
  };

  const value: AudienceContextType = {
    audience: resolvedAudience,
    userAudience,
    hasChosen: userAudience !== null,
    setAudience,
    interest: interests[resolvedAudience] ?? null,
    setInterest,
    clearInterest,
  };

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
