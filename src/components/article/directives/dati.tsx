import DatiBlock, { type DatiRow, type DatiTipo } from '../editorial/DatiBlock';
import type { DirectiveConfig, DirectiveNode } from './types';
import { getNodeText } from './utils';

const TIPO_TITOLO: Record<DatiTipo, string> = {
  costi: 'Quanto costa',
  pratiche: 'Info pratiche',
};

const PRATICHE_MAX_RIGHE = 6;

/**
 * Corpo = lista markdown `- Etichetta · Valore`. Ogni riga senza il
 * separatore "·" viene scartata (avvisato in dev): un valore non identificato
 * non renderizza mai come dato inventato.
 */
function parseRighe(children: DirectiveNode['children']): DatiRow[] {
  const list = (children || []).find((child) => child.type === 'list');
  const items = list?.children || [];
  const righe: DatiRow[] = [];

  for (const item of items) {
    const text = getNodeText(item).trim();
    if (!text) continue;

    const sepIndex = text.indexOf('·');
    if (sepIndex === -1) {
      if (import.meta.env?.DEV) {
        console.warn(`[dati] Riga senza separatore "·" ignorata: "${text}".`);
      }
      continue;
    }

    const label = text.slice(0, sepIndex).trim();
    const value = text.slice(sepIndex + 1).trim();
    if (label && value) righe.push({ label, value });
  }

  return righe;
}

function toProps(directive: DirectiveNode): Record<string, unknown> {
  const attrs = directive.attributes || {};
  const props: Record<string, unknown> = {};
  if (attrs.tipo) props['data-tipo'] = attrs.tipo;
  if (attrs.titolo) props['data-titolo'] = attrs.titolo;
  if (attrs.perQuante) props['data-per-quante'] = attrs.perQuante;
  if (attrs.quando) props['data-quando'] = attrs.quando;
  props['data-righe'] = JSON.stringify(parseRighe(directive.children));
  directive.children = []; /* :::dati legge solo la lista markdown, il resto non renderizza. */
  return props;
}

function parseRigheProp(raw?: string): DatiRow[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (riga): riga is DatiRow =>
        typeof riga === 'object' &&
        riga !== null &&
        typeof (riga as DatiRow).label === 'string' &&
        typeof (riga as DatiRow).value === 'string'
    );
  } catch {
    return [];
  }
}

function DatiDirective({
  'data-tipo': tipoAttr,
  'data-titolo': titoloAttr,
  'data-per-quante': perQuante,
  'data-quando': quando,
  'data-righe': righeAttr,
}: {
  'data-tipo'?: string;
  'data-titolo'?: string;
  'data-per-quante'?: string;
  'data-quando'?: string;
  'data-righe'?: string;
}) {
  const tipo: DatiTipo | undefined =
    tipoAttr === 'costi' || tipoAttr === 'pratiche' ? tipoAttr : undefined;

  if (!tipo) {
    if (import.meta.env?.DEV) {
      console.warn(`[dati] tipo="${tipoAttr}" non valido: usa "costi" oppure "pratiche".`);
    }
    return null;
  }

  // Un prezzo senza data invecchia e diventa una bugia: senza `quando` il
  // blocco costi non renderizza, non mostra un totale "orfano" di contesto.
  if (tipo === 'costi' && !quando) {
    if (import.meta.env?.DEV) {
      console.warn(
        '[dati] tipo="costi" richiede l\'attributo quando: un prezzo senza data non renderizza.'
      );
    }
    return null;
  }

  let righe = parseRigheProp(righeAttr);
  let totale: DatiRow | undefined;

  if (tipo === 'costi' && righe.length > 0) {
    const ultima = righe[righe.length - 1];
    if (ultima.label.trim().toLowerCase() === 'totale') {
      righe = righe.slice(0, -1);
      // Un totale senza denominatore (per quante persone/notti) non significa
      // niente: senza `perQuante` la riga sparisce, non solo la nota.
      if (perQuante) {
        totale = ultima;
      } else if (import.meta.env?.DEV) {
        console.warn(
          '[dati] Totale senza perQuante: la riga non renderizza (un totale senza denominatore non significa niente).'
        );
      }
    }
  }

  if (righe.length === 0 && !totale) {
    if (import.meta.env?.DEV) console.warn('[dati] Nessuna riga valida: il blocco non renderizza.');
    return null;
  }

  if (tipo === 'pratiche' && righe.length > PRATICHE_MAX_RIGHE && import.meta.env?.DEV) {
    console.warn(
      `[dati] tipo="pratiche" ha ${righe.length} righe: il budget editoriale ne prevede al massimo ${PRATICHE_MAX_RIGHE}.`
    );
  }

  return (
    <DatiBlock
      tipo={tipo}
      titolo={titoloAttr || TIPO_TITOLO[tipo]}
      quando={quando}
      perQuante={perQuante}
      righe={righe}
      totale={totale}
    />
  );
}

export const datiDirective: DirectiveConfig = {
  name: 'dati',
  hName: 'dati-directive',
  toProps,
  component: DatiDirective,
};
