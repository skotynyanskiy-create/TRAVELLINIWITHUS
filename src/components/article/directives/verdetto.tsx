import { useEffect, useRef } from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import type { DirectiveConfig, DirectiveNode } from './types';
import { getNodeText } from './utils';

/**
 * `:::verdetto{quando="..."}` — il differenziale del brand: non "dove
 * andare", ma "se vale il viaggio". Forma decisa dallo stratega: una lista
 * puntata con prefissi `sì ·` / `no ·`, non i due paragrafi liberi delle
 * primitive precedenti (`pullquote`/`verified`), perche' qui il punto e'
 * elencare condizioni verificabili, non argomentare in prosa.
 */

const YES_PREFIX = /^s[iì]\s*·\s*/iu;
const NO_PREFIX = /^no\s*·\s*/iu;

function splitVerdictLines(directive: DirectiveNode): { si: string[]; no: string[] } {
  const listNode = (directive.children || []).find((child) => child.type === 'list');
  const rawLines = (listNode?.children || [])
    .map((item) => getNodeText(item).trim())
    .filter(Boolean);

  const si: string[] = [];
  const no: string[] = [];
  for (const line of rawLines) {
    if (YES_PREFIX.test(line)) {
      si.push(line.replace(YES_PREFIX, '').trim());
    } else if (NO_PREFIX.test(line)) {
      no.push(line.replace(NO_PREFIX, '').trim());
    } else if (import.meta.env?.DEV) {
      console.warn(`[verdetto] Riga ignorata (manca il prefisso "sì ·" o "no ·"): "${line}"`);
    }
  }
  return { si, no };
}

function toProps(directive: DirectiveNode): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  const attrs = directive.attributes || {};
  if (attrs.quando) props['data-quando'] = attrs.quando;

  const { si, no } = splitVerdictLines(directive);
  if (import.meta.env?.DEV && (si.length < 2 || si.length > 4 || no.length < 2 || no.length > 4)) {
    console.warn(
      `[verdetto] Punti fuori dal range consigliato (2-4 per lato): ${si.length} "sì", ${no.length} "no".`
    );
  }
  props['data-si'] = JSON.stringify(si);
  props['data-no'] = JSON.stringify(no);
  /* children scartati: il blocco renderizza solo via props, come fullbleed */
  directive.children = [];
  return props;
}

function parseList(json?: string): string[] {
  if (!json) return [];
  try {
    const parsed: unknown = JSON.parse(json);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

/**
 * Review editoriale di prima parte, stessa forma di `src/pages/Posto.tsx`
 * (righe 156-169): solo `author` Organization + `reviewBody`, mai un voto —
 * un numero comprimerebbe l'unica cosa che questo blocco vende.
 */
function buildVerdettoReviewJsonLd(si: string[], no: string[]): object | null {
  if (si.length === 0 && no.length === 0) return null;

  const reviewBody = [
    si.length > 0 ? `Vale il viaggio se: ${si.join('; ')}.` : '',
    no.length > 0 ? `Lascia perdere se: ${no.join('; ')}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: { '@type': 'Organization', name: 'Travelliniwithus' },
    reviewBody,
  };
}

function VerdettoDirective({
  'data-quando': quando,
  'data-si': siJson,
  'data-no': noJson,
}: {
  'data-quando'?: string;
  'data-si'?: string;
  'data-no'?: string;
}) {
  const asideRef = useRef<HTMLElement | null>(null);
  const si = parseList(siJson);
  const no = parseList(noJson);
  const reviewJsonLd = buildVerdettoReviewJsonLd(si, no);

  // È l'unico blocco scuro dell'articolo, uno solo per pagina: se il markup
  // ne trova un secondo nello stesso DOM, avvisa (dev-only, mai a runtime prod).
  useEffect(() => {
    if (!import.meta.env?.DEV) return;
    const all = Array.from(document.querySelectorAll('aside[aria-label="Verdetto"]'));
    if (all.length > 1 && all.indexOf(asideRef.current as Element) > 0) {
      console.warn(
        '[verdetto] Trovato più di un blocco verdetto nello stesso articolo: ne va uno solo (peso L1, il solo momento in cui il testo si ferma e giudica).'
      );
    }
  }, []);

  if (si.length === 0 && no.length === 0) return null;

  return (
    <aside
      ref={asideRef}
      aria-label="Verdetto"
      className="my-12 rounded-[var(--radius-lg)] bg-[var(--color-ink-deep)] p-6 text-[var(--color-sand)] md:my-16 md:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        {si.length > 0 && (
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-on-dark)]">
              <ThumbsUp size={14} aria-hidden="true" />
              Vale il viaggio se
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed md:text-base">
              {si.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {no.length > 0 && (
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-on-dark)]">
              <ThumbsDown size={14} aria-hidden="true" />
              Lascia perdere se
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed md:text-base">
              {no.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {quando && (
        <p className="mt-6 border-t border-white/10 pt-4 text-sm">
          <span className="font-semibold">Il momento giusto:</span> {quando}
        </p>
      )}
      {reviewJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
        />
      )}
    </aside>
  );
}

export const verdettoDirective: DirectiveConfig = {
  name: 'verdetto',
  hName: 'verdetto-directive',
  toProps,
  component: VerdettoDirective,
};
