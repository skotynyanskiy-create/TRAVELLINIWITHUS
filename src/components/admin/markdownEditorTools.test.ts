import { describe, expect, it } from 'vitest';
import {
  BLOCK_SNIPPETS,
  INLINE_SNIPPET,
  buildSnippetInsertion,
  countDirectiveUsage,
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

  it('le quote editoriali riflettono le regole decise: posto 3, dati 2, verdetto/mappa/domande 1, reel senza quota', () => {
    const maxCountByKey = Object.fromEntries(BLOCK_SNIPPETS.map((s) => [s.key, s.maxCount]));
    expect(maxCountByKey).toEqual({
      posto: 3,
      verdetto: 1,
      reel: undefined,
      dati: 2,
      mappa: 1,
      domande: 1,
    });
  });
});

describe('countDirectiveUsage', () => {
  it('conta zero blocchi su un testo senza direttive', () => {
    expect(countDirectiveUsage('Solo testo normale.')).toEqual({});
  });

  it('conta ogni apertura di blocco, non le righe di chiusura', () => {
    const md =
      ':::posto{id="a"}\n:::\n\n:::posto{id="b"}\n:::\n\n:::posto{id="c"}\n:::\n\n:::verdetto{quando="ora"}\n:::';
    expect(countDirectiveUsage(md)).toEqual({ posto: 3, verdetto: 1 });
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

describe('lintEditorialMarkdown — segnaposto dei template rimasti intatti', () => {
  it('segnala "Scrivi qui" lasciato nel blocco domande (il bug reale di extractQaItems)', () => {
    const md =
      ':::domande\n### Scrivi qui la seconda domanda?\nScrivi qui la seconda risposta.\n:::';
    const issues = lintEditorialMarkdown(md);
    expect(issues.some((i) => i.includes('Riga 2') && i.includes('Domande'))).toBe(true);
    expect(issues.some((i) => i.includes('Riga 3') && i.includes('Domande'))).toBe(true);
  });

  it('non segnala "Scrivi qui" se la domanda è stata scritta davvero', () => {
    const md = ':::domande\n### Quando conviene andare a Bled?\nDa maggio a settembre.\n:::';
    expect(lintEditorialMarkdown(md)).toEqual([]);
  });

  it('segnala "slug-del-posto" lasciato in :::posto e in :::reel', () => {
    const md = ':::posto{id="slug-del-posto"}\n:::\n\n:::reel{posto="slug-del-posto"}\n:::';
    const issues = lintEditorialMarkdown(md);
    expect(issues.some((i) => i.includes('Posto') && i.includes('slug-del-posto'))).toBe(true);
    expect(issues.some((i) => i.includes('Reel') && i.includes('slug-del-posto'))).toBe(true);
  });

  it('segnala gli slug segnaposto lasciati in :::mappa', () => {
    const md = ':::mappa{posti="slug-posto-1, slug-posto-2" zoom="7"}\n:::';
    const issues = lintEditorialMarkdown(md);
    expect(issues.some((i) => i.includes('Mappa') && i.includes('slug-posto'))).toBe(true);
  });

  it('segnala il valore "es. " lasciato negli attributi di :::verdetto e :::dati', () => {
    const verdetto = ':::verdetto{quando="es. da settembre a ottobre"}\n- sì · buono\n:::';
    const dati =
      ':::dati{tipo="costi" titolo="Quanto" quando="es. settembre 2025" perQuante="es. 2 persone"}\n- Alloggio · 100€\n:::';
    expect(
      lintEditorialMarkdown(verdetto).some((i) => i.includes('Verdetto') && i.includes('es. '))
    ).toBe(true);
    expect(lintEditorialMarkdown(dati).some((i) => i.includes('Dati') && i.includes('es. '))).toBe(
      true
    );
  });

  it('segnala le righe di esempio "Etichetta · Valore" / "Totale · Valore" lasciate in :::dati', () => {
    const md =
      ':::dati{tipo="costi" titolo="Quanto" quando="settembre 2025" perQuante="2 persone"}\n- Etichetta · Valore\n- Totale · Valore\n:::';
    const issues = lintEditorialMarkdown(md);
    expect(issues.filter((i) => i.includes('Dati')).length).toBeGreaterThanOrEqual(2);
  });

  it('segnala una riga "- sì ·" / "- no ·" senza testo dopo il separatore (il bug della review vuota)', () => {
    const md =
      ':::verdetto{quando="ora"}\n- sì · buono\n- sì · \n- no · vero problema\n- no ·\n:::';
    const issues = lintEditorialMarkdown(md);
    expect(issues.filter((i) => i.includes('punto vuoto')).length).toBe(2);
  });

  it('non segnala righe "- sì ·" / "- no ·" con testo reale dopo il separatore', () => {
    const md = ':::verdetto{quando="ora"}\n- sì · buono\n- no · caro\n:::';
    expect(lintEditorialMarkdown(md)).toEqual([]);
  });

  it('segnala i tre segnaposto del link affiliato non sostituiti', () => {
    const md =
      'Prenota qui: :affiliato[testo del link]{partner="booking" path="/percorso-struttura" campagna="nome-campagna"}';
    const issues = lintEditorialMarkdown(md);
    expect(issues.some((i) => i.includes('testo del link'))).toBe(true);
    expect(issues.some((i) => i.includes('/percorso-struttura'))).toBe(true);
    expect(issues.some((i) => i.includes('nome-campagna'))).toBe(true);
  });

  it('non segnala un link affiliato compilato con dati veri', () => {
    const md =
      'Prenota qui: :affiliato[questo B&B]{partner="booking" path="/it/hotel/vero" campagna="guida-bled"}';
    expect(lintEditorialMarkdown(md)).toEqual([]);
  });
});
