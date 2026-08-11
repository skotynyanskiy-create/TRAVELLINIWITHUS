import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { DirectiveConfig, DirectiveNode } from './types';
import DirectiveParagraph from './DirectiveParagraph';
import { pullquoteDirective } from './pullquote';
import { fullbleedDirective } from './fullbleed';
import { sourceDirective } from './source';
import { verifiedDirective } from './verified';

export type { DirectiveConfig, DirectiveNode } from './types';
export { parseImageTitle } from './utils';

/**
 * Editorial primitives (handoff editorial-primitives-v1 — 2026-05-18).
 *
 * remark-directive supporta sintassi ::: name {attrs} ... :::. Il registro
 * qui sotto elenca le direttive editoriali supportate: ognuna vive nel suo
 * file (`toProps` legge attributes/children del nodo directive e produce le
 * `data-*` hProperties, `component` renderizza il tag HAST custom `hName`).
 *
 * Aggiungere una direttiva: creare `directives/<nome>.tsx` che esporta un
 * `DirectiveConfig`, poi aggiungerlo a questo array.
 */
export const directiveRegistry: DirectiveConfig[] = [
  pullquoteDirective,
  fullbleedDirective,
  sourceDirective,
  verifiedDirective,
];

const directiveByName = new Map(directiveRegistry.map((directive) => [directive.name, directive]));

/**
 * Plugin remark generico: converte i nodi container directive (`pullquote`,
 * `fullbleed`, `source`, `verified`, ...) in tag HAST custom (`pullquote-directive`
 * etc.) leggendo il registro sopra, cosi' react-markdown li mappa sui
 * componenti React via la prop `components`. Nessun `if` per direttiva:
 * un nome non registrato viene ignorato (lasciato come containerDirective).
 */
export function remarkEditorialDirectives() {
  return (tree: Root) => {
    visit(tree, (node) => {
      const directive = node as DirectiveNode;
      if (directive.type !== 'containerDirective') return;
      const config = directiveByName.get(directive.name || '');
      if (!config) return;

      const data = directive.data || (directive.data = {});
      data.hProperties = config.toProps(directive);
      data.hName = config.hName;
    });
  };
}

/**
 * Mappa `components` di react-markdown per le direttive registrate, piu' il
 * paragrafo interno condiviso (`directive-p`). Il consumatore (`ArticleBody`)
 * la fonde con la mappa dei tag markdown standard.
 */
export const directiveComponents: Record<string, DirectiveConfig['component']> = {
  'directive-p': DirectiveParagraph,
  ...Object.fromEntries(
    directiveRegistry.map((directive) => [directive.hName, directive.component])
  ),
};
