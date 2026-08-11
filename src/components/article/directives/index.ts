import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { DirectiveConfig, DirectiveContext, DirectiveNode } from './types';
import DirectiveParagraph from './DirectiveParagraph';
import { pullquoteDirective } from './pullquote';
import { fullbleedDirective } from './fullbleed';
import { sourceDirective } from './source';
import { verifiedDirective } from './verified';
import { postoDirective } from './posto';
import { reelDirective } from './reel';
import { verdettoDirective } from './verdetto';
import { mappaDirective } from './mappa';
import { datiDirective } from './dati';
import { domandeDirective } from './domande';
import { affiliatoDirective } from './affiliato';

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
  postoDirective,
  reelDirective,
  verdettoDirective,
  mappaDirective,
  datiDirective,
  domandeDirective,
  affiliatoDirective,
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
    /* Pre-visita: conta i `:::posto{id="..."}` del documento. Con esattamente
       uno solo, quel posto e' identificabile senza ambiguita' e puo' fare da
       `itemReviewed` per il JSON-LD di `:::verdetto` piu' sotto nello stesso
       articolo; con zero o piu' di uno (listicle, "dintorni") non si indovina
       quale dei posti il verdetto giudica — vedi verdetto.tsx. */
    const postoIds: string[] = [];
    visit(tree, (node) => {
      const directive = node as DirectiveNode;
      if (
        directive.type === 'containerDirective' &&
        directive.name === 'posto' &&
        directive.attributes?.id
      ) {
        postoIds.push(directive.attributes.id);
      }
    });
    const context: DirectiveContext = {
      singlePostoId: postoIds.length === 1 ? postoIds[0] : undefined,
    };

    /* Occorrenze per nome, azzerate a ogni albero cioe' a ogni articolo. Serve
       a `:affiliato`, che deve distinguere il primo link dal terzo per l'UTM:
       senza, ogni occorrenza collasserebbe su `articolo-inline-1`. */
    const seen = new Map<string, number>();

    visit(tree, (node) => {
      const directive = node as DirectiveNode;
      const config = directiveByName.get(directive.name || '');
      if (!config) return;

      /* Una direttiva vale solo nella forma dichiarata: `:::posto` come blocco,
         `:affiliato[...]` in linea. Una forma sbagliata non renderizza mezzo
         componente — ma non e' nemmeno visibile come errore: senza `hName`,
         `mdast-util-to-hast` avvolge il nodo in un `<div>` anonimo e ne mostra
         i figli senza stile. L'errore va quindi intercettato prima, dal linter
         dell'editor (`markdownEditorTools.ts`), non da qui. */
      const expected = config.nodeType === 'text' ? 'textDirective' : 'containerDirective';
      if (directive.type !== expected) return;

      const index = seen.get(config.name) ?? 0;
      seen.set(config.name, index + 1);

      const data = directive.data || (directive.data = {});
      data.hProperties = config.toProps(directive, index, context);
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
