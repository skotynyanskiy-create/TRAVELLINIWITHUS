import { canLoad } from './consent';
import {
  getAudienceInterest,
  getAudienceInterests,
  interestForContentType,
  type InterestId,
} from '../config/audienceInterests';
import type { Audience } from '../context/AudienceContext';
import type { ContentType } from '../config/contentTaxonomy';

const STORAGE_KEY = 'twu_personalization_signals';
const EVENT_NAME = 'twu:personalization-changed';
const MAX_SCORE = 12;

type Signals = Partial<Record<InterestId, number>>;

function readSignals(): Signals {
  if (typeof window === 'undefined' || !canLoad('personalization')) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Signals;
    return Object.fromEntries(
      Object.entries(parsed).filter(([interest, score]) =>
        Boolean(getAudienceInterest(interest as InterestId)) &&
        typeof score === 'number' &&
        Number.isFinite(score) &&
        score > 0
      )
    ) as Signals;
  } catch {
    return {};
  }
}

function notify() {
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function recordInterestSignal(interest: InterestId, weight = 1): void {
  if (typeof window === 'undefined' || !canLoad('personalization')) return;
  try {
    const current = readSignals();
    current[interest] = Math.min(MAX_SCORE, (current[interest] ?? 0) + weight);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    notify();
  } catch {
    // La personalizzazione resta disponibile tramite la scelta esplicita.
  }
}

export function recordInterestForContentType(type: ContentType): void {
  const interest = interestForContentType(type);
  if (interest) recordInterestSignal(interest);
}

export function getInferredInterest(audience: Audience): InterestId | null {
  const signals = readSignals();
  const ranked = getAudienceInterests(audience)
    .map((interest) => ({ interest, score: signals[interest.id] ?? 0 }))
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.score ? ranked[0].interest.id : null;
}

export function clearPersonalizationSignals(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    notify();
  } catch {
    // Storage non disponibile: non c'è alcun dato locale da rimuovere.
  }
}

export function onPersonalizationChange(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
