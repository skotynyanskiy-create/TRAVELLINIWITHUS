import type { ReactNode } from 'react';
import {
  buildAffiliateLink,
  AFFILIATE_ANCHOR_ATTRS,
  type AffiliatePartner,
} from '../../../lib/affiliateLink';
import { trackEvent } from '../../../services/analytics';
import type { DirectiveConfig, DirectiveNode } from './types';
import { getNodeText } from './utils';

/**
 * `:affiliato[testo]{partner="booking" path="/hotel/it/le-rene.it.html" campagna="salento-agosto"}`
 *
 * A differenza delle altre direttive registrate qui, questa e' una
 * **textDirective** (`:nome[...]`), non una containerDirective (`::: nome`).
 * Il motore in `index.ts` oggi visita solo `containerDirective`: per attivare
 * questa direttiva serve un secondo visitor (o un ramo nello stesso) che
 * intercetti `node.type === 'textDirective'` e applichi lo stesso schema
 * `data.hName` / `data.hProperties` gia' usato per le altre.
 *
 * Contratto atteso dal motore:
 *  - chiama `affiliatoDirective.toProps(directive, index)` dove `index` e' il
 *    contatore progressivo (0-based, in ordine di documento) delle occorrenze
 *    di `:affiliato` nell'articolo corrente. Senza `index` la direttiva
 *    funziona comunque (fallback a "articolo-inline-1" per tutte), ma perde
 *    la distinzione di posizione nell'utm_content.
 *  - NON tocca `directive.children`: sono contenuto fraseologico (il testo
 *    del link), non paragrafi, quindi vengono renderizzati cosi' come sono
 *    come `children` React del componente sotto.
 */

const KNOWN_PARTNERS: readonly AffiliatePartner[] = [
  'skyscanner',
  'booking',
  'airalo',
  'revolut',
  'heymondo',
  'getyourguide',
];

function isKnownPartner(value: string | null | undefined): value is AffiliatePartner {
  return Boolean(value) && KNOWN_PARTNERS.includes(value as AffiliatePartner);
}

const GENERIC_CTA_PATTERNS = [
  /clicca\s+qui/iu,
  /clicca\s+qua/iu,
  /prenota\s+ora/iu,
  /scopri\s+l['’]offerta/iu,
];

function warnIfGenericLabel(label: string) {
  if (!import.meta.env.DEV) return;
  if (GENERIC_CTA_PATTERNS.some((pattern) => pattern.test(label))) {
    console.warn(
      `[:affiliato] il testo del link non nomina la cosa: "${label}". Evita inviti generici ("clicca qui", "prenota ora", "scopri l'offerta"): usa il nome del posto o del prodotto.`
    );
  }
}

/**
 * Esportata (oltre a essere impacchettata in `affiliatoDirective`) cosi' i
 * test possono chiamarla con il secondo argomento `index` reale: passando
 * per `affiliatoDirective.toProps` TypeScript userebbe la firma a un solo
 * parametro di `DirectiveConfig['toProps']` e rifiuterebbe la chiamata.
 */
export function toProps(directive: DirectiveNode, index?: number): Record<string, unknown> {
  const attrs = directive.attributes || {};
  const label = (directive.children || []).map(getNodeText).join('').trim();
  const partnerAttr = attrs.partner?.trim();
  const path = attrs.path || undefined;
  const campagna = attrs.campagna?.trim();
  const position = typeof index === 'number' ? index + 1 : 1;
  const utmContent = `articolo-inline-${position}`;

  if (import.meta.env.DEV) {
    if (!isKnownPartner(partnerAttr)) {
      console.warn(
        `[:affiliato] partner mancante o non riconosciuto: "${partnerAttr ?? ''}" (link "${label}"). Valori validi: ${KNOWN_PARTNERS.join(', ')}.`
      );
    }
    if (!campagna) {
      console.warn(
        `[:affiliato] campagna mancante per il link "${label}": aggiungi campagna="..." per un'attribuzione UTM utile.`
      );
    }
    warnIfGenericLabel(label);
  }

  const props: Record<string, unknown> = {};
  if (isKnownPartner(partnerAttr)) {
    props['data-href'] = buildAffiliateLink({
      partner: partnerAttr,
      path,
      utmCampaign: campagna || 'articolo',
      utmContent,
    });
    props['data-partner'] = partnerAttr;
    props['data-campaign'] = campagna || 'articolo';
    props['data-utm-content'] = utmContent;
  }
  return props;
}

function AffiliatoDirective({
  children,
  'data-href': href,
  'data-partner': partner,
  'data-campaign': campaign,
  'data-utm-content': utmContent,
}: {
  children?: ReactNode;
  'data-href'?: string;
  'data-partner'?: string;
  'data-campaign'?: string;
  'data-utm-content'?: string;
}) {
  if (!href) return <>{children}</>;

  const handleClick = () => {
    trackEvent('affiliate_click', {
      partner,
      campaign,
      utm_content: utmContent,
      url: href,
      source: 'article_inline',
    });
  };

  return (
    <>
      <a
        href={href}
        {...AFFILIATE_ANCHOR_ATTRS}
        onClick={handleClick}
        className="text-[var(--color-accent-text)] underline decoration-[var(--color-accent)]/40 underline-offset-2 transition-colors hover:decoration-[var(--color-accent)]"
      >
        {children}
      </a>
      <span className="ml-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted-fg-2)]">
        · affiliato
      </span>
    </>
  );
}

export const affiliatoDirective: DirectiveConfig = {
  name: 'affiliato',
  hName: 'affiliato-directive',
  toProps,
  component: AffiliatoDirective,
};
