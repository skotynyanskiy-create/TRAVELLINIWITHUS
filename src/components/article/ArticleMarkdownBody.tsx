import { useMemo, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
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
import {
  ArticlePlaceTrackingProvider,
  useArticlePlaceTracking,
} from './ArticlePlaceTrackingContext';
import { extractPlaceReferences } from '../../lib/articlePlaceReferences';
import { getContentById } from '../../config/contentLibrary';
import { buildItemReviewedJsonLd } from '../../lib/placeReviewSchema';
import { buildPlaceItemListJsonLd, type PlaceListEntry } from '../../lib/seo';
import { trackAnalyticsEvent } from '../../services/analytics';
import { SITE_URL } from '../../config/site';

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

/**
 * Link generico del corpo articolo: stessa styling degli `:affiliato` (vedi
 * `directives/affiliato.tsx`), cosi' un link in prosa si distingue dal testo
 * normale — senza, un lettore non capisce che `[Placat](/posto/bossico-placat)`
 * e' cliccabile, ed e' esattamente il gesto che la metrica `article_place_click`
 * misura. Traccia due eventi soltanto, sugli href che contano per il contratto:
 * `/posto/:id` (article_place_click) e `/collaborazioni` (article_partner_cta_click).
 * Ogni altro link resta un `<a>` normale, solo tracciato/stilato.
 */
function MarkdownLink({ href, children }: { href?: string; children?: ReactNode }) {
  const { slug, positions } = useArticlePlaceTracking();

  const handleClick = () => {
    if (!href) return;
    const postoMatch = /^\/posto\/([a-z0-9-]+)$/.exec(href);
    if (postoMatch) {
      const id = postoMatch[1];
      const item = getContentById(id);
      trackAnalyticsEvent('article_place_click', {
        slug,
        place_id: id,
        position: positions.get(id),
        partnership_kind: item?.partnership.kind,
      });
      return;
    }
    if (href === '/collaborazioni') {
      trackAnalyticsEvent('article_partner_cta_click', { slug });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="text-[var(--color-accent-text)] underline decoration-[var(--color-accent)]/40 underline-offset-2 transition-colors hover:decoration-[var(--color-accent)]"
    >
      {children}
    </a>
  );
}

/**
 * `ItemList` JSON-LD dai riferimenti `/posto/:id` del corpo (direttiva o link
 * in prosa), non dai soli blocchi `:::posto`: il budget ammette solo 3 card su
 * un articolo come questo con dieci voci, quindi limitarsi ai blocchi
 * dichiarerebbe a Google una lista incompleta. Vive qui (chunk lazy) perche'
 * richiede `getContentById`/`content-seed.json` — importarlo nel chunk eager
 * di `Articolo.tsx` sforerebbe il budget `article-route` (90 KB, vedi
 * `scripts/check-size.mjs`). Renderizza un `<Helmet>` annidato: react-helmet-async
 * aggrega gli script di ogni `<Helmet>` montato nell'albero, non solo quello
 * radice (stesso pattern gia' in uso in `Articolo.tsx`, che ne monta due).
 */
function ArticlePlaceItemListSchema({ content, title }: { content: string; title: string }) {
  const references = useMemo(() => extractPlaceReferences(content), [content]);

  const entries = useMemo<PlaceListEntry[]>(
    () =>
      references
        .map(({ id, position }) => {
          const item = getContentById(id);
          if (!item || item.isPlaceholder) return null;
          return {
            position,
            name: item.place.name,
            url: `${SITE_URL}/posto/${id}`,
            item: buildItemReviewedJsonLd(item),
          };
        })
        .filter((entry): entry is PlaceListEntry => entry !== null),
    [references]
  );

  const schema = buildPlaceItemListJsonLd(title, entries);
  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export default function ArticleMarkdownBody({
  content,
  slug = '',
  title = '',
}: {
  content: string;
  slug?: string;
  title?: string;
}) {
  const references = useMemo(() => extractPlaceReferences(content), [content]);
  const components = {
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="mt-10 md:mt-14 scroll-mt-32 text-3xl md:text-4xl font-serif leading-tight text-[var(--color-ink)]">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
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
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="mt-6 space-y-3 pl-0 text-base leading-relaxed text-[var(--color-ink-2)]">
        {children}
      </ul>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li className="flex gap-2.5 md:gap-3">
        <CheckCircle2 className="mt-1 shrink-0 text-[var(--color-accent)]" size={16} />
        <span>{children}</span>
      </li>
    ),
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-semibold text-[var(--color-ink)]">{children}</strong>
    ),
    img: ({ src, alt, title: imgTitle }: { src?: string; alt?: string; title?: string }) => {
      const { caption, credit } = parseImageTitle(imgTitle);
      return <InlineFigure src={src || ''} alt={alt || ''} caption={caption} credit={credit} />;
    },
    a: MarkdownLink,
    ...directiveComponents,
  } as unknown as Components;

  /* La dichiarazione affiliati non la scrive l'autore: compare da sola appena
     l'articolo contiene un `:affiliato`. Lasciarla a mano significa che prima o
     poi manca, e manca proprio sull'articolo che rende di piu'. */
  const hasAffiliateLinks = content.includes(':affiliato[');

  return (
    <ArticlePlaceTrackingProvider slug={slug} references={references}>
      {title && <ArticlePlaceItemListSchema content={content} title={title} />}
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
    </ArticlePlaceTrackingProvider>
  );
}
