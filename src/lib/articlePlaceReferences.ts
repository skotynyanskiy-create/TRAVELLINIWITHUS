/**
 * Ogni riferimento a `/posto/:id` nel corpo (markdown) di un articolo, in
 * ordine di prima apparizione, deduplicato — sia la direttiva `:::posto{id="…"}`
 * sia il link in prosa `](/posto/id)`.
 *
 * Serve a due consumatori che devono restare allineati sullo stesso `position`
 * (1-based, ordine di prima apparizione): l'evento `article_place_click`
 * (`ArticlePlaceTrackingContext`) e lo schema `ItemList` (costruito nel chunk
 * lazy di `ArticleMarkdownBody`, vedi `ARTICLE_dormire-posti-sembrano-inventati.md`,
 * sezione SEO -> Schema.org).
 *
 * Deliberatamente puro: nessuna dipendenza da `config/contentLibrary` (quindi
 * da `content-seed.json`, ~150 KB), cosi' resta sicuro da importare anche dal
 * chunk eager di `Articolo.tsx` senza toccare il budget `article-route` in
 * `scripts/check-size.mjs`. Non filtra i placeholder: un id placeholder non
 * renderizza comunque un blocco `:::posto` cliccabile, e un link in prosa verso
 * un placeholder è un caso limite che i chiamanti con accesso al registro
 * possono filtrare da soli (vedi `ArticleMarkdownBody.tsx`).
 */
export interface PlaceReference {
  id: string;
  position: number;
}

const POSTO_DIRECTIVE_ID = /:::posto\{id="([a-z0-9-]+)"\}/g;
const POSTO_LINK_ID = /\]\(\/posto\/([a-z0-9-]+)\)/g;

export function extractPlaceReferences(content: string): PlaceReference[] {
  const found: Array<{ id: string; index: number }> = [];

  for (const match of content.matchAll(POSTO_DIRECTIVE_ID)) {
    found.push({ id: match[1], index: match.index ?? 0 });
  }
  for (const match of content.matchAll(POSTO_LINK_ID)) {
    found.push({ id: match[1], index: match.index ?? 0 });
  }
  found.sort((a, b) => a.index - b.index);

  const seen = new Set<string>();
  const refs: PlaceReference[] = [];
  for (const { id } of found) {
    if (seen.has(id)) continue;
    seen.add(id);
    refs.push({ id, position: refs.length + 1 });
  }

  return refs;
}
