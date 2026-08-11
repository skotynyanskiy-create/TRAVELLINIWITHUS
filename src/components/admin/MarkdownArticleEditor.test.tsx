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
    fireEvent.click(screen.getByRole('button', { name: 'Posto' }));
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toContain(':::posto{id="slug-del-posto"}');
    expect(textarea.value.trim().endsWith(':::')).toBe(true);
  });

  it('il pulsante "Domande" inserisce un blocco con tre coppie domanda/risposta, chiuso', () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByRole('button', { name: 'Domande' }));
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

  it('l’anteprima usa il motore vero: un :::posto reale mostra la scheda del registro', () => {
    render(
      <Wrapper initial={'Testo prima.\n\n:::posto{id="emilia-granduca-di-campigna"}\n:::\n'} />
    );
    expect(screen.getByText('Dal registro')).toBeInTheDocument();
    expect(screen.getByText('Granduca di Campigna')).toBeInTheDocument();
  });

  it('avvisa quando un blocco resta aperto senza ":::" di chiusura', () => {
    render(<Wrapper initial={'## Titolo\n\n:::verdetto{quando="ora"}\n- sì · test\n'} />);
    expect(screen.getByText(/aperto ma non è mai chiuso/i)).toBeInTheDocument();
  });

  it('avvisa quando il nome del blocco non esiste nel registro', () => {
    render(<Wrapper initial={':::postox{id="x"}\n:::\n'} />);
    expect(screen.getByText(/non esiste/i)).toBeInTheDocument();
  });

  it('non mostra avvisi per markdown valido', () => {
    render(<Wrapper initial={'Solo testo normale, nessuna direttiva.'} />);
    expect(screen.queryByText(/Da correggere prima di salvare/i)).not.toBeInTheDocument();
  });
});
