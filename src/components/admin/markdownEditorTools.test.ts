import { describe, expect, it } from 'vitest';
import {
  BLOCK_SNIPPETS,
  INLINE_SNIPPET,
  buildSnippetInsertion,
  lintEditorialMarkdown,
} from './markdownEditorTools';

describe('BLOCK_SNIPPETS — sintassi dei sei blocchi editoriali', () => {
  it('ogni template blocco è già chiuso con ":::"', () => {
    for (const snippet of BLOCK_SNIPPETS) {
      expect(snippet.template.trim().endsWith(':::')).toBe(true);
    }
  });

  it('copre esattamente i sei blocchi: posto, verdetto, reel, dati, mappa, domande', () => {
    expect(BLOCK_SNIPPETS.map((s) => s.key).sort()).toEqual(
      ['dati', 'domande', 'mappa', 'posto', 'reel', 'verdetto'].sort()
    );
  });

  it('il blocco :::dati richiede quando per il tipo costi, come impone la direttiva reale', () => {
    const dati = BLOCK_SNIPPETS.find((s) => s.key === 'dati')!;
    expect(dati.template).toContain('tipo="costi"');
    expect(dati.template).toContain('quando=');
    expect(dati.template).toContain('perQuante=');
  });

  it(':affiliato non ha blockSpacing: è testo in linea, non un blocco', () => {
    expect(INLINE_SNIPPET.blockSpacing).toBe(false);
    expect(INLINE_SNIPPET.template.startsWith(':affiliato[')).toBe(true);
  });
});

describe('buildSnippetInsertion', () => {
  it('inserisce il blocco su testo vuoto senza righe vuote superflue', () => {
    const posto = BLOCK_SNIPPETS.find((s) => s.key === 'posto')!;
    const result = buildSnippetInsertion('', 0, 0, posto);
    expect(result.nextValue).toBe(':::posto{id="slug-del-posto"}\n:::');
  });

  it('aggiunge una riga vuota prima e dopo quando il cursore è dentro del testo', () => {
    const posto = BLOCK_SNIPPETS.find((s) => s.key === 'posto')!;
    const text = 'Un paragrafo.';
    const result = buildSnippetInsertion(text, text.length, text.length, posto);
    expect(result.nextValue).toBe('Un paragrafo.\n\n:::posto{id="slug-del-posto"}\n:::');
  });

  it('non raddoppia le righe vuote se ce n’è già una', () => {
    const posto = BLOCK_SNIPPETS.find((s) => s.key === 'posto')!;
    const text = 'Un paragrafo.\n\n';
    const result = buildSnippetInsertion(text, text.length, text.length, posto);
    expect(result.nextValue).toBe('Un paragrafo.\n\n:::posto{id="slug-del-posto"}\n:::');
  });

  it('seleziona il segnaposto tra «»: scrivere subito lo sovrascrive', () => {
    const posto = BLOCK_SNIPPETS.find((s) => s.key === 'posto')!;
    const result = buildSnippetInsertion('', 0, 0, posto);
    const selected = result.nextValue.slice(result.selectionStart, result.selectionEnd);
    expect(selected).toBe('slug-del-posto');
  });

  it('non perde mai il testo selezionato: il blocco si inserisce subito dopo, la selezione resta intatta', () => {
    const posto = BLOCK_SNIPPETS.find((s) => s.key === 'posto')!;
    const text = 'AAAABBBBCCCC';
    const result = buildSnippetInsertion(text, 4, 8, posto);
    expect(result.nextValue).toBe('AAAABBBB\n\n:::posto{id="slug-del-posto"}\n:::\n\nCCCC');
    expect(result.nextValue).toContain('BBBB');
  });

  it('preserva la selezione anche quando comincia a inizio testo', () => {
    const verdetto = BLOCK_SNIPPETS.find((s) => s.key === 'verdetto')!;
    const text = 'Paragrafo selezionato intero.';
    const result = buildSnippetInsertion(text, 0, text.length, verdetto);
    expect(result.nextValue.startsWith(text)).toBe(true);
    expect(result.nextValue).toContain(':::verdetto{');
  });

  it(':affiliato non forza righe vuote intorno', () => {
    const text = 'Prenota su ';
    const result = buildSnippetInsertion(text, text.length, text.length, INLINE_SNIPPET);
    expect(result.nextValue.startsWith('Prenota su :affiliato[')).toBe(true);
  });

  it(':affiliato con selezione attiva mantiene il testo selezionato e lo antepone al link', () => {
    const text = 'Prenota qui subito';
    // seleziona "qui" (indici 8-11)
    const result = buildSnippetInsertion(text, 8, 11, INLINE_SNIPPET);
    expect(result.nextValue).toBe(
      'Prenota qui:affiliato[testo del link]{partner="booking" path="/percorso-struttura" campagna="nome-campagna"} subito'
    );
    const selected = result.nextValue.slice(result.selectionStart, result.selectionEnd);
    expect(selected).toBe('testo del link');
  });
});

describe('lintEditorialMarkdown', () => {
  it('non segnala nulla per markdown senza direttive', () => {
    expect(lintEditorialMarkdown('Solo testo normale.\n\n## Titolo\n\nAltro testo.')).toEqual([]);
  });

  it('non segnala nulla per un blocco valido correttamente chiuso', () => {
    const md = ':::posto{id="emilia-granduca-di-campigna"}\n:::';
    expect(lintEditorialMarkdown(md)).toEqual([]);
  });

  it('segnala un blocco aperto e mai chiuso', () => {
    const md =
      '## Titolo\n\n:::verdetto{quando="ora"}\n- sì · test\n\n## Sezione successiva\nTesto.';
    const issues = lintEditorialMarkdown(md);
    expect(issues.some((i) => i.includes('verdetto') && i.includes('aperto'))).toBe(true);
  });

  it('segnala un nome di direttiva che non esiste nel registro', () => {
    const md = ':::postoz{id="x"}\n:::';
    const issues = lintEditorialMarkdown(md);
    expect(issues.some((i) => i.includes('postoz') && i.includes('non esiste'))).toBe(true);
  });

  it('segnala una direttiva in linea non riconosciuta', () => {
    const md = 'Prenota su :afiliato[qui]{partner="booking"}';
    const issues = lintEditorialMarkdown(md);
    expect(issues.some((i) => i.includes('afiliato'))).toBe(true);
  });

  it('non segnala :affiliato scritto correttamente', () => {
    const md = 'Prenota su :affiliato[qui]{partner="booking" path="/x" campagna="y"}';
    expect(lintEditorialMarkdown(md)).toEqual([]);
  });

  it('segnala un ":::" di chiusura senza apertura precedente', () => {
    const md = 'Testo.\n:::\nAltro testo.';
    const issues = lintEditorialMarkdown(md);
    expect(issues.some((i) => i.includes('chiusura'))).toBe(true);
  });
});
