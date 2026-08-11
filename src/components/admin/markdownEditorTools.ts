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
  },
  {
    key: 'verdetto',
    label: 'Verdetto',
    description: 'Il blocco scuro sì/no. Uno solo per articolo.',
    blockSpacing: true,
    template:
      `:::verdetto{quando="${PLACEHOLDER_OPEN}es. da settembre a ottobre${PLACEHOLDER_CLOSE}"}\n` +
      `- sì · \n- sì · \n- no · \n- no · \n:::`,
  },
  {
    key: 'reel',
    label: 'Reel',
    description: 'Il reel collegato a un posto. Parte solo se lo tocchi.',
    blockSpacing: true,
    template: `:::reel{posto="${PLACEHOLDER_OPEN}slug-del-posto${PLACEHOLDER_CLOSE}"}\n:::`,
  },
  {
    key: 'dati',
    label: 'Dati',
    description: 'Tabella di costi (con quando) o informazioni pratiche.',
    blockSpacing: true,
    template:
      `:::dati{tipo="costi" titolo="${PLACEHOLDER_OPEN}Quanto ci è costato${PLACEHOLDER_CLOSE}" quando="es. settembre 2025" perQuante="es. 2 persone, 2 notti"}\n` +
      `- Etichetta · Valore\n- Totale · Valore\n:::`,
  },
  {
    key: 'mappa',
    label: 'Mappa',
    description: 'Mappa dei posti citati, con elenco testuale sotto.',
    blockSpacing: true,
    template: `:::mappa{posti="${PLACEHOLDER_OPEN}slug-posto-1, slug-posto-2${PLACEHOLDER_CLOSE}" zoom="7"}\n:::`,
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
 * Inserisce un template nel testo a partire dalla selezione corrente,
 * sostituendo l'eventuale testo selezionato. Se il template ha un segmento
 * `«...»`, i marcatori vengono rimossi e il testo tra di essi resta
 * selezionato nel risultato: scrivere subito sovrascrive il segnaposto senza
 * dover cercare dove cliccare.
 */
export function buildSnippetInsertion(
  value: string,
  cursorStart: number,
  cursorEnd: number,
  snippet: DirectiveSnippet
): SnippetInsertion {
  const before = value.slice(0, cursorStart);
  const after = value.slice(cursorEnd);

  let prefix = '';
  let suffix = '';
  if (snippet.blockSpacing) {
    if (before.length > 0 && !before.endsWith('\n\n')) {
      prefix = before.endsWith('\n') ? '\n' : '\n\n';
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
  const nextValue = before + insertion + after;
  const base = cursorStart + prefix.length;

  return {
    nextValue,
    selectionStart: base + relativeSelStart,
    selectionEnd: base + relativeSelEnd,
  };
}

const KNOWN_DIRECTIVE_NAMES = new Set(directiveRegistry.map((directive) => directive.name));
const KNOWN_DIRECTIVE_LIST = directiveRegistry.map((directive) => directive.name).join(', ');

/**
 * Controlla due errori silenziosi: un `:::` di apertura mai chiuso (la
 * sezione dopo sparisce senza avviso) e una direttiva con un nome che non
 * esiste nel registro (resta testo a schermo, sembra un bug del sito).
 * Nessuna dipendenza da remark: e' un controllo a righe, volutamente piu'
 * permissivo del parser vero, cosi' l'avviso arriva prima della preview.
 */
export function lintEditorialMarkdown(markdown: string): string[] {
  const issues: string[] = [];
  const lines = markdown.split('\n');
  const openStack: Array<{ name: string; line: number }> = [];

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line.startsWith(':::')) return;

    /* `remark-directive` non ammette spazi dopo i due punti ne' prima delle
       graffe: `::: posto` e `:::posto {id="x"}` non sono direttive, sono
       paragrafi di testo. Senza questo controllo il linter li dava per validi
       — proprio la forma che deve intercettare — e il blocco spariva dalla
       pagina in silenzio. */
    const rawRemainder = line.slice(3);
    if (rawRemainder !== '' && /^\s/.test(rawRemainder)) {
      issues.push(
        `Riga ${idx + 1}: "${line}" ha uno spazio dopo i ":::". Scrivi il nome attaccato, altrimenti non è un blocco e resta testo.`
      );
      return;
    }
    if (/^[a-zA-Z][\w-]*\s+\{/.test(rawRemainder)) {
      issues.push(
        `Riga ${idx + 1}: "${line}" ha uno spazio prima della graffa. Attacca gli attributi al nome, altrimenti non è un blocco.`
      );
      return;
    }

    const remainder = line.slice(3).trim();
    if (remainder === '') {
      if (openStack.length === 0) {
        issues.push(`Riga ${idx + 1}: c'è un ":::" di chiusura ma nessun blocco era aperto prima.`);
      } else {
        openStack.pop();
      }
      return;
    }

    const nameMatch = remainder.match(/^([a-zA-Z][\w-]*)/);
    const name = nameMatch?.[1];
    if (!name) {
      issues.push(`Riga ${idx + 1}: "${line}" non è scritto come un blocco valido.`);
      return;
    }
    if (!KNOWN_DIRECTIVE_NAMES.has(name)) {
      issues.push(
        `Riga ${idx + 1}: il blocco ":::${name}" non esiste. Blocchi validi: ${KNOWN_DIRECTIVE_LIST}.`
      );
    }
    openStack.push({ name, line: idx + 1 });
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
