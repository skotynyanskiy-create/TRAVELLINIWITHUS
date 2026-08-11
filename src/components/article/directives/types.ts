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
 * Config di una direttiva editoriale. Un file per direttiva esporta un
 * `DirectiveConfig`; il registro in `index.ts` lo elenca e ne deriva sia il
 * plugin remark generico sia la mappa `components` di react-markdown.
 */
export interface DirectiveConfig {
  /** Nome della direttiva nella sintassi `::: nome ... :::`. */
  name: string;
  /** Tag HAST custom emesso dal plugin remark, mappato in `components`. */
  hName: string;
  /** Legge attributes/children del nodo directive e produce le `data-*` hProperties. Può mutare `directive.children` (es. per scartarli). */
  toProps: (directive: DirectiveNode) => Record<string, unknown>;
  /** Componente React che renderizza il tag `hName`, riceve le hProperties come props. */
  component: ComponentType<Record<string, unknown>>;
}
