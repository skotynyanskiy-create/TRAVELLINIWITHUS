import registry from '../data/asset-provenance.json';

/**
 * Provenienza degli asset immagine — il campo che
 * `DECISION_IMAGERY_TRUTH_RULE_2026-07-22` richiede ("etichetta di provenienza
 * obbligatoria per asset: real-photo / real-frame / craft") e che finora non
 * esisteva da nessuna parte: ne' nel modello dati, ne' in un registro, ne' in
 * un audit. Senza, la regola valeva quanto la memoria di chi apriva il file —
 * ed e' cosi' che l'hero della home ha finito per usare come prova un asset
 * dichiarato "da certificare".
 *
 * Il registro sta in `src/data/asset-provenance.json` perche' lo legge anche
 * `scripts/check-image-provenance.mjs`, che gira in Node senza TypeScript.
 * Regola per prefisso, vince il piu' lungo.
 */

export type Provenance =
  /** Fotografia del brand. Puo' affermare un fatto. */
  | 'real-photo'
  /** Frame da un reel pubblicato dal brand. Puo' affermare un fatto. */
  | 'real-frame'
  /** Mestiere non referenziale: carta, inchiostro, timbri, card generate. */
  | 'craft'
  /** Segnaposto grafico. Non rappresenta nulla di reale. */
  | 'placeholder'
  /** Generato da AI. Vietato come prova di luoghi, persone o esperienze. */
  | 'ai-generated'
  /** Nessun documento ne dichiara l'origine: serve la certificazione dell'owner. */
  | 'da-certificare';

export interface ProvenanceRule {
  prefix: string;
  provenance: Provenance;
  source: string;
}

export const PROVENANCE_RULES: ProvenanceRule[] = [...(registry.rules as ProvenanceRule[])].sort(
  (a, b) => b.prefix.length - a.prefix.length
);

/** Le sole provenienze che possono raffigurare un luogo, una persona o un'esperienza. */
const REFERENTIAL: Provenance[] = ['real-photo', 'real-frame'];

/** La regola che copre un asset, o `null` se il registro non lo conosce. */
export function provenanceRuleFor(src?: string): ProvenanceRule | null {
  if (!src) return null;
  const path = src.split('?')[0];
  return PROVENANCE_RULES.find((rule) => path.startsWith(rule.prefix)) ?? null;
}

export function provenanceOf(src?: string): Provenance | null {
  return provenanceRuleFor(src)?.provenance ?? null;
}

/**
 * Vero solo per gli asset che possono fare da prova di un posto reale.
 * Un asset sconosciuto al registro e' `false`: il dubbio non e' una prova.
 */
export function isCertifiedReal(src?: string): boolean {
  const provenance = provenanceOf(src);
  return provenance !== null && REFERENTIAL.includes(provenance);
}

/** Etichetta IT breve, per la riga di provenienza sotto le immagini di prova. */
export const PROVENANCE_LABEL: Record<Provenance, string> = {
  'real-photo': 'Foto nostra, scattata sul posto',
  'real-frame': 'Frame dal reel che abbiamo girato lì',
  craft: 'Illustrazione editoriale',
  placeholder: 'Immagine segnaposto',
  'ai-generated': 'Immagine generata',
  'da-certificare': 'Provenienza da verificare',
};
