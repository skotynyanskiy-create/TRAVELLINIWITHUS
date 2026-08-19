import { Minus, Plus } from 'lucide-react';
import type { DirectiveConfig, DirectiveNode } from './types';
import { getNodeText } from './utils';
import { buildFaqPageJsonLd, type FaqQaItem } from '../../../lib/seo';
import JsonLd from '../../JsonLd';

/**
 * `:::domande` — sequenza `### Domanda` + paragrafo di risposta, resa come
 * `<details>`/`<summary>` nativi (zero motion: tastiera e screen reader
 * funzionano senza JS). Emette FAQPage una sola volta, solo se ogni risposta
 * ha testo reale — mai una domanda senza risposta.
 */

interface QaItem {
  q: string;
  a: string;
}

function extractQaItems(children: NonNullable<DirectiveNode['children']>): QaItem[] {
  const items: QaItem[] = [];
  let current: QaItem | null = null;

  for (const child of children) {
    if (child.type === 'heading') {
      if (current && current.a.trim()) items.push(current);
      current = { q: getNodeText(child).trim(), a: '' };
      continue;
    }
    if (!current) continue;
    const text = getNodeText(child).trim();
    if (text) current.a = current.a ? `${current.a} ${text}` : text;
  }
  if (current && current.a.trim()) items.push(current);

  return items;
}

/* `index` e' l'occorrenza nel documento, passata dal motore: solo la prima
   emette il JSON-LD. Due blocchi domande nella stessa pagina dichiarerebbero a
   Google due FAQPage — uno schema duplicato vale meno di nessuno schema. Il
   secondo blocco resta visibile e leggibile, semplicemente non parla ai
   crawler. */
function toProps(directive: DirectiveNode, index?: number): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  if ((index ?? 0) > 0) props['data-skip-schema'] = 'true';
  const items = extractQaItems(directive.children || []).filter((item) => item.q);

  if (import.meta.env?.DEV && (items.length < 3 || items.length > 6)) {
    console.warn(`[domande] ${items.length} domande: l'intervallo consigliato è 3-6.`);
  }

  props['data-items'] = JSON.stringify(items);
  /* children scartati: il blocco renderizza solo via props, come fullbleed */
  directive.children = [];
  return props;
}

function parseItems(json?: string): QaItem[] {
  if (!json) return [];
  try {
    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is QaItem => !!item && typeof item.q === 'string' && typeof item.a === 'string'
    );
  } catch {
    return [];
  }
}

function DomandeDirective({
  'data-items': itemsJson,
  'data-skip-schema': skipSchema,
}: {
  'data-items'?: string;
  'data-skip-schema'?: string;
}) {
  const items = parseItems(itemsJson);
  if (items.length === 0) return null;

  const faqJsonLd =
    skipSchema === 'true'
      ? null
      : buildFaqPageJsonLd(items.map((item): FaqQaItem => ({ question: item.q, answer: item.a })));

  return (
    <section
      aria-label="Domande frequenti"
      className="my-12 border-y border-[var(--color-border)] md:my-16"
    >
      <div className="divide-y divide-[var(--color-border)]">
        {items.map((item, idx) => (
          <details key={item.q} className="group py-5" open={idx === 0}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <span className="font-serif text-lg text-[var(--color-ink)] md:text-xl">
                {item.q}
              </span>
              <span className="mt-1 shrink-0 text-[var(--color-ink)]" aria-hidden="true">
                <Plus size={18} className="group-open:hidden" />
                <Minus size={18} className="hidden group-open:block" />
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-2)] md:text-base">
              {item.a}
            </p>
          </details>
        ))}
      </div>
      {/* JsonLd e non JSON.stringify inline: il testo delle FAQ arriva
          dall'editor articoli, e un `</script>` in una risposta chiuderebbe
          il tag. JsonLd escapa `<` prima dell'iniezione. */}
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
    </section>
  );
}

export const domandeDirective: DirectiveConfig = {
  name: 'domande',
  hName: 'domande-directive',
  toProps,
  component: DomandeDirective,
};
