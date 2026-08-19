/**
 * Contratto dei seed articolo.
 *
 * Serve a una cosa sola: rendere un errore di compilazione ogni drift fra il
 * seed e i tipi del sito. Senza questo, `partnership.kind` accettava valori
 * fuori da `PartnershipKind` (c'erano cinque `'none'`) e il badge di
 * disclosure si sarebbe disegnato con etichetta `undefined` in cima
 * all'articolo — vedi PARTNERSHIP_LABEL in src/types/content.ts.
 *
 * NON è la forma del documento Firestore: quella è più stretta (vedi
 * `isValidArticle()` in firestore.rules) e la mappatura vive in
 * scripts/publish-article-seed.mjs.
 */
import type { Timestamp } from 'firebase/firestore';
import type { PartnershipKind } from '../../types/content';

export interface ArticleSeed {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  /** Luogo in prosa. Diventa `location` sul documento Firestore. */
  destination: string;
  partnership: { kind: PartnershipKind; partner?: string };
  tags: string[];
  author: { name: string; bio: string };
  coverImage: string;
  /** Alt descrittivo della cover/hero. Fuori dal contratto di firestore.rules
   *  (come `partnership`): la scrive solo `scripts/publish-article-seed.mjs`
   *  via Admin SDK. Senza, `ArticleHero` ricade sul fallback "luogo — categoria". */
  imageAlt?: string;
  /** Card OG fotografica dedicata (1200x630), se diversa da `coverImage`.
   *  Stesso fuori-contratto di `imageAlt`. Senza, l'unfurl social usa la
   *  coverImage grezza invece della card composta con testo/wordmark. */
  ogImage?: string;
  published: boolean;
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
