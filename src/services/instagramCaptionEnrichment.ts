import type { ContentItem, PartnershipKind } from '../types/content';
import type { Budget } from '../config/contentTaxonomy';

/**
 * Enrichment caption Instagram → campi curati del ContentItem.
 *
 * Predisposizione token-free: codifica i pattern reali delle caption
 * @travelliniwithus (documentati in
 * docs/50_Scratch/INSTAGRAM_CONTENT_SEED_2026-06-18.md). Quando l'IG Graph API
 * sarà collegata, ogni `media.caption` passa di qui e produce hook / prezzo /
 * partner / disclosure ADV automaticamente, senza trascrizione manuale.
 *
 * NON inventa: i campi che la caption non contiene restano vuoti e l'item
 * resta `isPlaceholder: true` finché un umano (o l'admin) li completa.
 */

export interface CaptionEnrichment {
  hook: string;
  partnership: { kind: PartnershipKind; partner?: string };
  value?: { price?: string; budget?: Budget };
}

// Prefissi disclosure reali → tipo partnership (AGCOM). Ordine: più specifici prima.
const ADV_PATTERNS: Array<{ re: RegExp; kind: PartnershipKind }> = [
  { re: /in\s+collaborazione|collaborazione|collab\b/i, kind: 'collaboration' },
  { re: /affiliazione|affiliate/i, kind: 'affiliate' },
  { re: /\bgifted\b|regalat[oa]/i, kind: 'gifted' },
  { re: /\binvit(o|ed|edby|ata|ato)\b/i, kind: 'invited' },
  { re: /\badv\b|pubblicit/i, kind: 'adv' },
];

const PRICE_RE = /(\d+(?:[.,]\d+)?)\s*€|€\s*(\d+(?:[.,]\d+)?)/;

/** UPPERCASE → sentence-case, preservando il punto di domanda finale. */
function toSentenceCase(text: string): string {
  const lower = text.toLocaleLowerCase('it-IT').trim();
  return lower.charAt(0).toLocaleUpperCase('it-IT') + lower.slice(1);
}

/** Estrae l'hook: prima frase interrogativa, ripulita da emoji-fence (👇, 🍺...). */
function extractHook(caption: string): string {
  // Le 👇 e i modificatori skin-tone fanno solo da cornice: via.
  const defenced = caption.replace(/\u{1F447}|[\u{1F3FB}-\u{1F3FF}]/gu, ' ');
  const line =
    defenced
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l.includes('?')) ||
    defenced.split(/(?<=[.?!])\s/)[0] ||
    '';
  // Tieni fino al punto di domanda; togli emoji/spazi iniziali e finali.
  const upToQuestion = line.match(/^.*?\?/)?.[0] ?? line;
  const cleaned = upToQuestion
    .replace(/^[^\p{L}\d]+/u, '')
    .replace(/[^\p{L}\d?!.)]+$/u, '')
    .trim();
  if (!cleaned) return '';
  // Solo gli hook gridati in MAIUSCOLO vengono normalizzati a sentence-case.
  const isShouty = cleaned === cleaned.toLocaleUpperCase('it-IT') && /\p{Lu}/u.test(cleaned);
  return isShouty ? toSentenceCase(cleaned) : cleaned;
}

function detectPartnership(caption: string): { kind: PartnershipKind; partner?: string } {
  const kind = ADV_PATTERNS.find(({ re }) => re.test(caption))?.kind ?? 'organic';
  const partner = caption.match(/@[a-z0-9._]+/i)?.[0];
  return partner ? { kind, partner } : { kind };
}

function detectValue(caption: string): { price?: string; budget?: Budget } | undefined {
  const match = caption.match(PRICE_RE);
  if (!match) return undefined;
  const raw = match[1] ?? match[2];
  const amount = Number(raw.replace(',', '.'));
  const budget: Budget = amount < 15 ? 'Basso' : amount <= 60 ? 'Medio' : 'Alto';
  return { price: `${raw}€`, budget };
}

/** Arricchisce i campi curati a partire dalla caption grezza. */
export function enrichFromCaption(caption: string): CaptionEnrichment {
  const value = detectValue(caption);
  return {
    hook: extractHook(caption),
    partnership: detectPartnership(caption),
    ...(value ? { value } : {}),
  };
}

/** Fonde l'enrichment caption su un ContentItem raw (da `mapInstagramMedia*`). */
export function applyCaptionEnrichment(item: ContentItem): ContentItem {
  if (!item.caption) return item;
  const e = enrichFromCaption(item.caption);
  return {
    ...item,
    hook: item.hook || e.hook,
    partnership: item.partnership.kind === 'organic' ? e.partnership : item.partnership,
    value: item.value ?? e.value,
  };
}
