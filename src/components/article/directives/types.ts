import type { ComponentType } from 'react';

/**
 * Nodo mdast/hast minimale usato dal plugin remark delle direttive editoriali
 * (`::: nome {attr} ... :::`). Copre solo i campi letti da `toProps`/`utils`.
 */
export type DirectiveNode = {
  type: string;
  name?: string;
  attributes?: Record<string, string | null | undefined>;
  children?: Array<{
    type: string;
    value?: string;
    url?: string;
    alt?: string;
    title?: string | null;
    children?: DirectiveNode['children'];
  }>;
  data?: { hName?: string; hProperties?: Record<string, unknown> };
};

/**
 * Contesto dell'intero documento, calcolato una volta da `index.ts` prima di
 * visitare le direttive e passato a ognuna. Oggi porta un solo dato:
 * `singlePostoId`, l'id del posto recensito quando l'articolo ne contiene
 * esattamente uno (`:::posto{id="..."}` usato una sola volta) — serve a
 * `:::verdetto` per agganciare il proprio JSON-LD `Review` all'`itemReviewed`
 * corretto senza indovinare su articoli con più posti (es. "cosa vedere nei
 * dintorni").
 */
export interface DirectiveContext {
  singlePostoId?: string;
}

/**
 * Config di una direttiva editoriale. Un file per direttiva esporta un
 * `DirectiveConfig`; il registro in `index.ts` lo elenca e ne deriva sia il
 * plugin remark generico sia la mappa `components` di react-markdown.
 */
export interface DirectiveConfig {
  /** Nome della direttiva nella sintassi `:::nome ... :::`. Senza spazio dopo i due punti: `remark-directive` non parsa `::: nome`. */
  name: string;
  /** Tag HAST custom emesso dal plugin remark, mappato in `components`. */
  hName: string;
  /**
   * Forma del nodo. `container` (default) è il blocco `:::nome ... :::`;
   * `text` è la direttiva dentro la frase, `:nome[etichetta]{attr}`, che
   * `remark-directive` emette come `textDirective`. I figli di una `text` sono
   * contenuto in linea — non vanno mai scartati né passati da
   * `markParagraphsBare`, altrimenti sparisce l'etichetta del link.
   */
  nodeType?: 'container' | 'text';
  /**
   * Legge attributes/children del nodo directive e produce le `data-*`
   * hProperties. Può mutare `directive.children` (es. per scartarli).
   * `index` è l'occorrenza 0-based di questa direttiva nel documento: serve a
   * chi deve distinguere una ripetizione dall'altra (l'UTM di `:affiliato`).
   * `context` è calcolato una volta per documento (vedi `DirectiveContext`).
   */
  toProps: (
    directive: DirectiveNode,
    index?: number,
    context?: DirectiveContext
  ) => Record<string, unknown>;
  /** Componente React che renderizza il tag `hName`, riceve le hProperties come props. */
  component: ComponentType<Record<string, unknown>>;
}
