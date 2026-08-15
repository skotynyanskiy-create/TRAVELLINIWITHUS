import { directiveRegistry } from '../article/directives';

/**
 * Strumenti puri per l'editor markdown di `ArticleEditor` — nessuna
 * dipendenza da React, cosi' sono testabili senza montare un componente.
 *
 * Sostituisce ReactQuill (che salvava HTML) con testo markdown vero, l'unico
 * formato che `ArticleBody` (src/pages/Articolo.tsx) sa renderizzare: non
 * esiste `rehype-raw` nel repo, quindi HTML salvato da un editor WYSIWYG
 * finiva a schermo come testo letterale.
 */

/** Delimitatori del segmento che l'utente deve sovrascrivere subito dopo l'inserimento. */
const PLACEHOLDER_OPEN = '«'; // «
const PLACEHOLDER_CLOSE = '»'; // »

export interface DirectiveSnippet {
  key: string;
  label: string;
  description: string;
  /** true per i blocchi `:::...:::`, che vogliono una riga vuota prima e dopo. */
  blockSpacing: boolean;
  template: string;
  /** Quota editoriale consigliata per articolo. Assente = nessun limite (es. `reel`,
   *  ripetibile una volta per posto citato). Solo informativo: la barra lo mostra,
   *  non impedisce mai di inserire il blocco oltre quota. */
  maxCount?: number;
}

/**
 * I sei blocchi editoriali, sintassi copiata 1:1 da
 * `src/config/previewContent.ts` → `guida-blocchi-editoriali` (la pagina di
 * riferimento). Ogni template è già chiuso con il `:::` finale: e' il punto
 * che conta di piu', perche' un blocco aperto e mai chiuso si mangia in
 * silenzio tutto quello che segue, titolo della sezione dopo compreso.
 */
export const BLOCK_SNIPPETS: DirectiveSnippet[] = [
  {
    key: 'posto',
    label: 'Posto',
    description: 'Scheda di un posto dal registro, con foto e link alla pagina.',
    blockSpacing: true,
    template: `:::posto{id="${PLACEHOLDER_OPEN}slug-del-posto${PLACEHOLDER_CLOSE}"}\n:::`,
    maxCount: 3,
  },
  {
    key: 'reel',
    label: 'Reel',
    description: 'Il reel collegato a un posto. Parte solo se lo tocchi.',
    blockSpacing: true,
    template: `:::reel{posto="${PLACEHOLDER_OPEN}slug-del-posto${PLACEHOLDER_CLOSE}"}\n:::`,
    /* Nessuna quota: un reel per ogni posto citato ha senso quante volte serve. */
  },
  {
    key: 'dati',
    label: 'Dati',
    description: 'Tabella di costi (con quando) o informazioni pratiche.',
    blockSpacing: true,
    template:
      `:::dati{tipo="costi" titolo="${PLACEHOLDER_OPEN}Quanto ci è costato${PLACEHOLDER_CLOSE}" quando="es. settembre 2025" perQuante="es. 2 persone, 2 notti"}\n` +
      `- Etichetta · Valore\n- Totale · Valore\n:::`,
    maxCount: 2,
  },
  {
    key: 'mappa',
    label: 'Mappa',
    description: 'Mappa dei posti citati, con elenco testuale sotto.',
    blockSpacing: true,
    template: `:::mappa{posti="${PLACEHOLDER_OPEN}slug-posto-1, slug-posto-2${PLACEHOLDER_CLOSE}" zoom="7"}\n:::`,
    maxCount: 1,
  },
  {
    key: 'domande',
    label: 'Domande',
    description: 'Da tre a sei domande frequenti, in linguaggio di ricerca reale.',
    blockSpacing: true,
    template:
      `:::domande\n### ${PLACEHOLDER_OPEN}Scrivi qui la prima domanda?${PLACEHOLDER_CLOSE}\n` +
      `Scrivi qui la risposta, con l'informazione più importante nella prima frase.\n\n` +
      `### Scrivi qui la seconda domanda?\nScrivi qui la seconda risposta.\n\n` +
      `### Scrivi qui la terza domanda?\nScrivi qui la terza risposta.\n:::`,
    maxCount: 1,
  },
];

/** `:affiliato[...]` è in linea, non un blocco: niente `:::`, niente riga vuota forzata. */
export const INLINE_SNIPPET: DirectiveSnippet = {
  key: 'affiliato',
  label: 'Link affiliato',
  description: 'Link dentro la frase, con la dichiarazione che compare da sola.',
  blockSpacing: false,
  template: `:affiliato[${PLACEHOLDER_OPEN}testo del link${PLACEHOLDER_CLOSE}]{partner="booking" path="/percorso-struttura" campagna="nome-campagna"}`,
};

export interface SnippetInsertion {
  nextValue: string;
  selectionStart: number;
  selectionEnd: number;
}

/**
 * Inserisce un template nel testo a partire dalla selezione corrente. Il
 * testo eventualmente selezionato NON diventa mai il contenuto del blocco:
 * i segnaposto (l'id di un posto, la data di "quando", gli slug di una
 * mappa) non hanno alcuna relazione col paragrafo che l'autore aveva
 * selezionato, quindi sovrascriverlo con quello sarebbe sbagliato tanto
 * quanto perderlo — e il campo e' controllato, l'annulla nativo della
 * textarea non lo riporterebbe indietro. Il blocco viene percio' inserito
 * SUBITO DOPO la selezione, che resta intatta nel testo: cliccare un
 * pulsante non cancella mai un paragrafo gia' scritto.
 *
 * Se il template ha un segmento `«...»`, i marcatori vengono rimossi e il
 * testo tra di essi resta selezionato nel risultato: scrivere subito
 * sovrascrive il segnaposto senza dover cercare dove cliccare.
 */
export function buildSnippetInsertion(
  value: string,
  cursorStart: number,
  cursorEnd: number,
  snippet: DirectiveSnippet
): SnippetInsertion {
  const before = value.slice(0, cursorStart);
  const selected = value.slice(cursorStart, cursorEnd);
  const after = value.slice(cursorEnd);
  const beforeInsertion = before + selected;

  let prefix = '';
  let suffix = '';
  if (snippet.blockSpacing) {
    if (beforeInsertion.length > 0 && !beforeInsertion.endsWith('\n\n')) {
      prefix = beforeInsertion.endsWith('\n') ? '\n' : '\n\n';
    }
    if (after.length > 0 && !after.startsWith('\n\n')) {
      suffix = after.startsWith('\n') ? '\n' : '\n\n';
    }
  }

  const { template } = snippet;
  const openIdx = template.indexOf(PLACEHOLDER_OPEN);
  const closeIdx = template.indexOf(PLACEHOLDER_CLOSE);

  let cleanTemplate = template;
  let relativeSelStart = template.length;
  let relativeSelEnd = template.length;

  if (openIdx !== -1 && closeIdx !== -1 && closeIdx > openIdx) {
    const placeholderText = template.slice(openIdx + 1, closeIdx);
    cleanTemplate = template.slice(0, openIdx) + placeholderText + template.slice(closeIdx + 1);
    relativeSelStart = openIdx;
    relativeSelEnd = openIdx + placeholderText.length;
  }

  const insertion = prefix + cleanTemplate + suffix;
  const nextValue = beforeInsertion + insertion + after;
  const base = beforeInsertion.length + prefix.length;

  return {
    nextValue,
    selectionStart: base + relativeSelStart,
    selectionEnd: base + relativeSelEnd,
  };
}

const KNOWN_DIRECTIVE_NAMES = new Set(directiveRegistry.map((directive) => directive.name));
const KNOWN_DIRECTIVE_LIST = directiveRegistry.map((directive) => directive.name).join(', ');
const BLOCK_LABELS: Record<string, string> = Object.fromEntries(
  BLOCK_SNIPPETS.map((snippet) => [snippet.key, snippet.label])
);

/**
 * Quante volte ogni blocco ":::nome" e' aperto nel markdown corrente. Usata
 * dalla barra strumenti per mostrare "usato N/quota" accanto a ogni pulsante
 * — solo informazione, mai un blocco al click: la quota resta editoriale,
 * non tecnica.
 */
export function countDirectiveUsage(markdown: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();
    if (!line.startsWith(':::')) continue;
    const remainder = line.slice(3).trim();
    if (remainder === '') continue; // riga di sola chiusura
    const name = remainder.match(/^([a-zA-Z][\w-]*)/)?.[1];
    if (name) counts[name] = (counts[name] || 0) + 1;
  }
  return counts;
}

/* Le due righe di esempio del corpo di :::dati, mai sovrascritte dal
   segnaposto «»: solo il "titolo" e' auto-selezionato all'inserimento. */
const DATI_PLACEHOLDER_LINE = /^-\s*(?:Etichetta|Totale)\s*·\s*Valore\s*$/iu;

/**
 * Segnala i segnaposto dei nostri stessi template rimasti intatti — stessa
 * classe di bug in due forme: `extractQaItems` (domande.tsx) accetta una
 * risposta se contiene testo, e "Scrivi qui la seconda risposta." *e'*
 * testo, quindi finisce nel FAQPage che legge Google; una riga
 * "- sì · " vuota finisce nella review pubblicata come "Vale il viaggio
 * se: ; ; .". Il controllo e' scoped al blocco che lo contiene (tranne
 * :affiliato, che e' testo in linea e puo' comparire ovunque), cosi' il
 * messaggio puo' nominare il blocco giusto invece di un generico "riga X".
 */
function checkPlaceholderSentinels(
  line: string,
  lineNumber: number,
  blockName: string | undefined,
  issues: string[]
): void {
  if (blockName === 'domande' && line.includes('Scrivi qui')) {
    issues.push(
      `Riga ${lineNumber}: "${line}" è ancora il testo di esempio del blocco "${BLOCK_LABELS.domande}". Sostituiscilo con la domanda o la risposta vera prima di pubblicare.`
    );
  }
  if ((blockName === 'posto' || blockName === 'reel') && line.includes('slug-del-posto')) {
    issues.push(
      `Riga ${lineNumber}: il blocco "${BLOCK_LABELS[blockName]}" ha ancora "slug-del-posto" al posto dello slug vero. Sostituiscilo con l'id del posto nel registro.`
    );
  }
  if (blockName === 'mappa' && /slug-posto-\d/.test(line)) {
    issues.push(
      `Riga ${lineNumber}: il blocco "${BLOCK_LABELS.mappa}" ha ancora gli slug segnaposto ("slug-posto-1", "slug-posto-2"). Sostituiscili con gli slug veri dei posti citati.`
    );
  }
  if (blockName === 'dati' && /="es\. /.test(line)) {
    issues.push(
      `Riga ${lineNumber}: il blocco "${BLOCK_LABELS.dati}" ha ancora un valore segnaposto che inizia con "es. ". Sostituiscilo con il dato vero.`
    );
  }
  if (blockName === 'dati' && DATI_PLACEHOLDER_LINE.test(line)) {
    issues.push(
      `Riga ${lineNumber}: "${line}" è ancora la riga di esempio del blocco "${BLOCK_LABELS.dati}". Sostituiscila con l'etichetta e il valore veri.`
    );
  }
  if (line.includes('testo del link')) {
    issues.push(
      `Riga ${lineNumber}: il "${INLINE_SNIPPET.label}" ha ancora "testo del link" come testo cliccabile. Scrivi il testo vero del link.`
    );
  }
  if (line.includes('/percorso-struttura')) {
    issues.push(
      `Riga ${lineNumber}: il "${INLINE_SNIPPET.label}" ha ancora "/percorso-struttura" come indirizzo. Sostituiscilo con il percorso vero della struttura o del prodotto.`
    );
  }
  if (line.includes('nome-campagna')) {
    issues.push(
      `Riga ${lineNumber}: il "${INLINE_SNIPPET.label}" ha ancora "nome-campagna" come campagna. Dagli un nome vero per riconoscere i click.`
    );
  }
}

/**
 * Controlla due errori silenziosi: un `:::` di apertura mai chiuso (la
 * sezione dopo sparisce senza avviso) e una direttiva con un nome che non
 * esiste nel registro (resta testo a schermo, sembra un bug del sito). In
 * piu' segnala i segnaposto dei template rimasti intatti (vedi
 * `checkPlaceholderSentinels`). Nessuna dipendenza da remark: e' un controllo
 * a righe, volutamente piu' permissivo del parser vero, cosi' l'avviso arriva
 * prima della preview.
 */
export function lintEditorialMarkdown(markdown: string): string[] {
  const issues: string[] = [];
  const lines = markdown.split('\n');
  const openStack: Array<{ name: string; line: number }> = [];

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    const lineNumber = idx + 1;

    if (!line.startsWith(':::')) {
      checkPlaceholderSentinels(line, lineNumber, openStack[openStack.length - 1]?.name, issues);
      return;
    }

    /* `remark-directive` non ammette spazi dopo i due punti ne' prima delle
       graffe: `::: posto` e `:::posto {id="x"}` non sono direttive, sono
       paragrafi di testo. Senza questo controllo il linter li dava per validi
       — proprio la forma che deve intercettare — e il blocco spariva dalla
       pagina in silenzio. */
    const rawRemainder = line.slice(3);
    if (rawRemainder !== '' && /^\s/.test(rawRemainder)) {
      issues.push(
        `Riga ${lineNumber}: "${line}" ha uno spazio dopo i ":::". Scrivi il nome attaccato, altrimenti non è un blocco e resta testo.`
      );
      return;
    }
    if (/^[a-zA-Z][\w-]*\s+\{/.test(rawRemainder)) {
      issues.push(
        `Riga ${lineNumber}: "${line}" ha uno spazio prima della graffa. Attacca gli attributi al nome, altrimenti non è un blocco.`
      );
      return;
    }

    const remainder = line.slice(3).trim();
    if (remainder === '') {
      if (openStack.length === 0) {
        issues.push(
          `Riga ${lineNumber}: c'è un ":::" di chiusura ma nessun blocco era aperto prima.`
        );
      } else {
        openStack.pop();
      }
      return;
    }

    const nameMatch = remainder.match(/^([a-zA-Z][\w-]*)/);
    const name = nameMatch?.[1];
    if (!name) {
      issues.push(`Riga ${lineNumber}: "${line}" non è scritto come un blocco valido.`);
      return;
    }
    checkPlaceholderSentinels(line, lineNumber, name, issues);
    if (!KNOWN_DIRECTIVE_NAMES.has(name)) {
      issues.push(
        `Riga ${lineNumber}: il blocco ":::${name}" non esiste. Blocchi validi: ${KNOWN_DIRECTIVE_LIST}.`
      );
    }
    openStack.push({ name, line: lineNumber });
  });

  for (const open of openStack) {
    issues.push(
      `Riga ${open.line}: il blocco ":::${open.name}" è aperto ma non è mai chiuso. Aggiungi ":::" da solo su una riga dopo il contenuto, altrimenti tutto quello che segue — titolo della sezione dopo compreso — sparisce dalla pagina.`
    );
  }

  const inlineDirectiveRegex = /:([a-zA-Z][\w-]*)\[/g;
  let match: RegExpExecArray | null;
  while ((match = inlineDirectiveRegex.exec(markdown))) {
    const name = match[1];
    if (!KNOWN_DIRECTIVE_NAMES.has(name)) {
      issues.push(
        `Il testo contiene ":${name}[...]" ma non è una direttiva riconosciuta. Per un link affiliato usa ":affiliato[testo]{partner="..." path="..." campagna="..."}".`
      );
    }
  }

  return issues;
}
