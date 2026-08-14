import { CheckCircle2 } from 'lucide-react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkUnwrapImages from 'remark-unwrap-images';
import type { Root } from 'mdast';
import DropCap from './editorial/DropCap';
import InlineFigure from './editorial/InlineFigure';
import {
  directiveComponents,
  parseImageTitle,
  remarkEditorialDirectives,
  type DirectiveNode,
} from './directives';

/**
 * Motore di rendering markdown dell'articolo, isolato in chunk lazy (vedi
 * `ArticleBody` in `src/pages/Articolo.tsx`): porta con se' react-markdown,
 * remark-directive, remark-unwrap-images e l'intero registro delle undici
 * direttive editoriali. Un solo `import()` invece di undici, e fuori dal
 * chunk `Articolo-*.js` misurato da `article-route` in `check-size.mjs`.
 */

/**
 * Marca il primo paragrafo top-level del documento con
 * `data-first-paragraph="true"`. Esegue dopo remarkEditorialDirectives,
 * quindi i paragrafi dentro directive (pullquote/source) hanno gia' hName
 * = "directive-p" e vengono saltati: il DropCap si applica solo al primo
 * paragrafo body vero (e mai a quelli dentro le directive).
 */
function markFirstBodyParagraph() {
  return (tree: Root) => {
    const children = (tree as Root & { children?: Array<DirectiveNode> }).children || [];
    for (const child of children) {
      if (child.type === 'paragraph') {
        const data = child.data || (child.data = {});
        const props = (data.hProperties || (data.hProperties = {})) as Record<string, unknown>;
        props['data-first-paragraph'] = 'true';
        return;
      }
    }
  };
}

const QUOTE_OPEN_CHARS = new Set(['"', '«', "'", '‘', '“']);

function extractText(node: unknown): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: unknown } }).props;
    return extractText(props?.children);
  }
  return '';
}

/**
 * Splitta i children React del primo paragrafo per estrarre la prima lettera
 * "stampabile" (saltando virgolette di apertura) e il resto.
 */
function splitFirstLetter(children: unknown): { firstChar: string; rest: unknown } | null {
  const flat = Array.isArray(children) ? [...children] : [children];

  for (let i = 0; i < flat.length; i++) {
    const item = flat[i];
    if (typeof item !== 'string') continue;

    let idx = 0;
    while (idx < item.length && QUOTE_OPEN_CHARS.has(item[idx])) idx++;
    if (idx >= item.length) continue; /* solo virgolette: cerca nel pezzo dopo */

    const firstChar = item[idx];
    const prefix = item.slice(0, idx);
    const tail = item.slice(idx + 1);
    const restArr: unknown[] = [];
    if (prefix) restArr.push(prefix);
    if (tail) restArr.push(tail);
    restArr.push(...flat.slice(i + 1));
    return { firstChar, rest: restArr };
  }

  return null;
}

export default function ArticleMarkdownBody({ content }: { content: string }) {
  const components = {
    h2: ({ children }) => (
      <h2 className="mt-10 md:mt-14 scroll-mt-32 text-3xl md:text-4xl font-serif leading-tight text-[var(--color-ink)]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 md:mt-10 text-2xl font-serif leading-tight text-[var(--color-ink)]">
        {children}
      </h3>
    ),
    p: ({
      children,
      'data-first-paragraph': isFirstParagraph,
    }: {
      children?: React.ReactNode;
      'data-first-paragraph'?: string;
    }) => {
      if (isFirstParagraph === 'true') {
        const text = extractText(children).trim();
        if (text.length >= 280) {
          const split = splitFirstLetter(children);
          if (split) {
            return <DropCap firstChar={split.firstChar} rest={split.rest as React.ReactNode} />;
          }
        }
      }
      return (
        <p className="mt-5 text-[17px] md:text-lg leading-[1.65] md:leading-[1.7] text-[var(--color-ink-2)]">
          {children}
        </p>
      );
    },
    ul: ({ children }) => (
      <ul className="mt-6 space-y-3 pl-0 text-base leading-relaxed text-[var(--color-ink-2)]">
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li className="flex gap-2.5 md:gap-3">
        <CheckCircle2 className="mt-1 shrink-0 text-[var(--color-accent)]" size={16} />
        <span>{children}</span>
      </li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-[var(--color-ink)]">{children}</strong>
    ),
    img: ({ src, alt, title }: { src?: string; alt?: string; title?: string }) => {
      const { caption, credit } = parseImageTitle(title);
      return <InlineFigure src={src || ''} alt={alt || ''} caption={caption} credit={credit} />;
    },
    ...directiveComponents,
  } as unknown as Components;

  /* La dichiarazione affiliati non la scrive l'autore: compare da sola appena
     l'articolo contiene un `:affiliato`. Lasciarla a mano significa che prima o
     poi manca, e manca proprio sull'articolo che rende di piu'. */
  const hasAffiliateLinks = content.includes(':affiliato[');

  return (
    <>
      {hasAffiliateLinks && (
        <p className="mb-8 border-l-2 border-[var(--color-border)] pl-4 text-sm italic leading-relaxed text-[var(--color-muted-fg)]">
          Alcuni link qui sotto sono affiliati: se prenoti, a noi arriva una piccola commissione. Il
          prezzo per te non cambia, e non cambia cosa scriviamo.
        </p>
      )}
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkDirective,
          remarkEditorialDirectives,
          markFirstBodyParagraph,
          remarkUnwrapImages,
        ]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </>
  );
}
