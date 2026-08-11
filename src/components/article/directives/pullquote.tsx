import type { ReactNode } from 'react';
import PullQuote from '../editorial/PullQuote';
import type { DirectiveConfig, DirectiveNode } from './types';
import { ATTRIBUTION_PREFIX, getNodeText, markParagraphsBare } from './utils';

function toProps(directive: DirectiveNode): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  const children = directive.children || [];
  const last = children[children.length - 1];
  if (last && last.type === 'paragraph') {
    /* Caso A: ultima riga e' un paragrafo dedicato all'attribuzione
       (autore ha inserito linea vuota prima del trattino). */
    const text = getNodeText(last);
    if (ATTRIBUTION_PREFIX.test(text)) {
      props['data-attribution'] = text.replace(ATTRIBUTION_PREFIX, '').trim();
      children.pop();
    } else if (last.children && last.children.length >= 2) {
      /* Caso B: attribuzione e' nello stesso paragrafo del corpo, separata
         da soft-break / line-break. Trova l'ultimo break e, se il testo
         che lo segue inizia con trattino, estrai. */
      const inner = last.children;
      let breakIdx = -1;
      for (let i = inner.length - 1; i >= 0; i--) {
        const t = inner[i].type;
        if (t === 'break' || t === 'thematicBreak') {
          breakIdx = i;
          break;
        }
      }
      if (breakIdx !== -1 && breakIdx < inner.length - 1) {
        const tailNodes = inner.slice(breakIdx + 1);
        const tailText = tailNodes.map((c) => getNodeText(c)).join('');
        if (ATTRIBUTION_PREFIX.test(tailText)) {
          props['data-attribution'] = tailText.replace(ATTRIBUTION_PREFIX, '').trim();
          last.children = inner.slice(0, breakIdx);
        }
      }
    }
  }
  markParagraphsBare(children);
  return props;
}

function PullQuoteDirective({
  children,
  'data-attribution': attribution,
}: {
  children?: ReactNode;
  'data-attribution'?: string;
}) {
  return <PullQuote attribution={attribution}>{children}</PullQuote>;
}

export const pullquoteDirective: DirectiveConfig = {
  name: 'pullquote',
  hName: 'pullquote-directive',
  toProps,
  component: PullQuoteDirective,
};
