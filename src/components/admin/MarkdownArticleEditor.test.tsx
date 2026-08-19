import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '../../test/test-utils';
import MarkdownArticleEditor from './MarkdownArticleEditor';

/**
 * Copre il punto che conta di più nel task: il pulsante deve rendere
 * impossibile dimenticare il ":::" di chiusura, e l'anteprima deve essere il
 * motore vero (`ArticleBody`), non una riproduzione.
 */

function Wrapper({ initial = '' }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <MarkdownArticleEditor
      id="content"
      value={value}
      onChange={setValue}
      previewMeta={{
        title: 'Articolo di prova',
        description: 'Descrizione di prova',
        image: '',
        category: 'Guide',
        location: 'Italia',
        period: 'Sempre',
        budget: 'Medio',
      }}
    />
  );
}

describe('MarkdownArticleEditor', () => {
  it('il pulsante "Posto" inserisce il blocco già chiuso con :::', () => {
    render(<Wrapper />);
    // name è un regex, non una stringa esatta: dalla quota editoriale il
    // pulsante mostra anche "0/3" accanto all'etichetta.
    fireEvent.click(screen.getByRole('button', { name: /^Posto/ }));
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toContain(':::posto{id="slug-del-posto"}');
    expect(textarea.value.trim().endsWith(':::')).toBe(true);
  });

  it('il pulsante "Domande" inserisce un blocco con tre coppie domanda/risposta, chiuso', () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByRole('button', { name: /^Domande/ }));
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value.match(/^### /gm)?.length).toBe(3);
    expect(textarea.value.trim().endsWith(':::')).toBe(true);
  });

  it('il pulsante "Link affiliato" inserisce la sintassi in linea con partner/path/campagna', () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByRole('button', { name: 'Link affiliato' }));
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toContain(':affiliato[testo del link]{partner="booking"');
  });

  it('l’anteprima usa il motore vero: un :::posto reale mostra la scheda del registro', async () => {
    render(
      <Wrapper initial={'Testo prima.\n\n:::posto{id="emilia-granduca-di-campigna"}\n:::\n'} />
    );
    // L'anteprima monta ArticleBody, che porta il motore markdown dietro un
    // confine lazy/Suspense (vedi Articolo.tsx): il registro arriva dopo il
    // resolve del dynamic import, quindi query async invece di sincrone.
    expect(await screen.findByText('Dal registro')).toBeInTheDocument();
    expect(screen.getByText('Granduca di Campigna')).toBeInTheDocument();
  });

  it('avvisa quando un blocco resta aperto senza ":::" di chiusura', () => {
    render(<Wrapper initial={'## Titolo\n\n:::domande\n- Domanda?\n'} />);
    expect(screen.getByText(/aperto ma non è mai chiuso/i)).toBeInTheDocument();
  });

  it('avvisa quando il nome del blocco non esiste nel registro', () => {
    render(<Wrapper initial={':::postox{id="x"}\n:::\n'} />);
    expect(screen.getByText(/non esiste/i)).toBeInTheDocument();
  });

  it('non mostra avvisi per markdown valido', () => {
    render(<Wrapper initial={'Solo testo normale, nessuna direttiva.'} />);
    expect(screen.queryByText(/Da correggere prima di pubblicare/i)).not.toBeInTheDocument();
  });

  it('avvisa quando un segnaposto del template resta intatto (es. "Scrivi qui")', () => {
    render(
      <Wrapper
        initial={':::domande\n### Scrivi qui la prima domanda?\nScrivi qui la risposta.\n:::\n'}
      />
    );
    expect(screen.getByText(/Da correggere prima di pubblicare/i)).toBeInTheDocument();
    // Sia la domanda che la risposta di esempio contengono "Scrivi qui": due avvisi, non uno.
    expect(
      screen.getAllByText(/è ancora il testo di esempio del blocco "Domande"/i).length
    ).toBeGreaterThanOrEqual(2);
  });

  it('la barra mostra la quota di ogni blocco e la aggiorna mentre si scrive', () => {
    render(<Wrapper />);
    const postoButton = screen.getByRole('button', { name: /Posto/ });
    expect(postoButton).toHaveTextContent('0/3');
    fireEvent.click(postoButton);
    expect(postoButton).toHaveTextContent('1/3');
    // Reel non ha quota editoriale: nessun badge accanto al pulsante.
    const reelButton = screen.getByRole('button', { name: /Reel/ });
    expect(reelButton).not.toHaveTextContent('/');
  });

  it("separa i blocchi dall'inserto in linea con due etichette distinte nella barra", () => {
    render(<Wrapper />);
    expect(screen.getByText('Blocchi')).toBeInTheDocument();
    expect(screen.getByText('In linea')).toBeInTheDocument();
  });

  /* 80rem e non 48rem: misurato in browser il 2026-08-11. A 48rem, dentro il
     contenitore reale, le due colonne scendevano a ~400px e l'anteprima a 40
     caratteri per riga — piu' lontana dai 65-75 della pagina vera di quanto lo
     fosse prima di affiancare. */
  it('scrittura e anteprima si affiancano da 80rem di larghezza reale (container query)', () => {
    const { container } = render(<Wrapper />);
    expect(container.innerHTML).toContain('@container');
    expect(container.innerHTML).toContain('@min-[80rem]:grid-cols-2');
  });

  it("l'anteprima rispetta la stessa misura di riga della pagina pubblica (720px, come Articolo.tsx)", async () => {
    render(
      <Wrapper initial={'Testo prima.\n\n:::posto{id="emilia-granduca-di-campigna"}\n:::\n'} />
    );
    const registro = await screen.findByText('Dal registro');
    expect(registro.closest('.max-w-\\[720px\\]')).not.toBeNull();
  });

  it("chiama onIssuesChange a ogni cambio con l'elenco corrente degli errori", () => {
    const received: string[][] = [];
    function IssuesWrapper() {
      const [value, setValue] = useState(':::postox{id="x"}\n:::\n');
      return (
        <MarkdownArticleEditor
          id="content"
          value={value}
          onChange={setValue}
          onIssuesChange={(issues) => received.push(issues)}
          previewMeta={{
            title: '',
            description: '',
            image: '',
            category: '',
            location: '',
            period: '',
            budget: '',
          }}
        />
      );
    }
    render(<IssuesWrapper />);
    const last = received[received.length - 1];
    expect(last.some((issue) => issue.includes('non esiste'))).toBe(true);
  });
});
