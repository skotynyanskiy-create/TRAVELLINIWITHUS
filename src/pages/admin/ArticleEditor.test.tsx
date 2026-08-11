import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ArticleEditor from './ArticleEditor';
import { AuthProvider } from '../../context/AuthContext';
import { verifyWithSearch } from '../../services/aiVerificationService';

/**
 * Copre otto bug confermati in revisione:
 * 1. Un caricamento fallito (documento inesistente o errore di rete) non deve
 *    mai mostrare il form vuoto con `id` valorizzato: premere Salva
 *    azzererebbe l'articolo reale su Firestore.
 * 2. "Verifica Fatti/Luoghi" sostituisce tutto il contenuto: deve restare
 *    un modo per tornare alla versione precedente, e l'esito non passa più
 *    da un `alert()` che si chiude senza leggerlo.
 * 3. Uno slug duplicato in creazione non deve sovrascrivere l'articolo esistente.
 * 4. Un salvataggio fallito deve comparire in pagina, non fallire in silenzio.
 * 5. Un salvataggio che non risponde deve smettere di dire "sto salvando".
 * 6. Chiudere la scheda o navigare via con modifiche pendenti deve avvisare.
 * 7. Una bozza locale più recente dell'ultimo salvataggio deve poter tornare.
 * 8. La barra di stato deve riflettere bozza/salvataggio/errori, e gli errori
 *    di sintassi devono bloccare solo la pubblicazione, mai il salvataggio.
 */

vi.mock('../../lib/firebaseDb', () => ({ db: {} }));

// Senza VITE_FIREBASE_API_KEY (assente in questo ambiente di test) il vero
// AuthProvider lascia `user` a null per sempre: handleSave uscirebbe subito
// (`if (!user) return`) prima di poter esercitare i bug #3-#8 qui sotto.
vi.mock('../../context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({ user: { uid: 'test-admin-uid' } }),
}));

const mockGetDoc = vi.fn();
const mockSetDoc = vi.fn();
vi.mock('firebase/firestore', () => ({
  doc: vi.fn((_db: unknown, ...segments: string[]) => segments.join('/')),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP'),
}));

vi.mock('../../services/aiVerificationService', () => ({
  verifyWithSearch: vi.fn(),
  verifyWithMaps: vi.fn(),
}));

// `handleFirestoreError` importa `../lib/firebaseAuth` in modo dinamico per la
// diagnostica dell'errore di rete: senza questo mock il modulo reale chiama
// `getAuth(app)` con la chiave fallback (non valida in test) e produce un
// unhandled rejection scollegato dal comportamento che questo file verifica.
vi.mock('../../lib/firebaseAuth', () => ({ auth: { currentUser: null } }));

function renderEditor(path = '/admin/articoli/nuovo') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Routes>
          <Route path="/admin/articoli/nuovo" element={<ArticleEditor />} />
          <Route path="/admin/articoli/:id" element={<ArticleEditor />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('ArticleEditor — un caricamento fallito non mostra mai il form vuoto salvabile', () => {
  beforeEach(() => {
    mockGetDoc.mockReset();
    mockSetDoc.mockReset();
  });

  it('documento inesistente: mostra "Articolo non trovato", non il form', async () => {
    mockGetDoc.mockResolvedValue({ exists: () => false });

    renderEditor('/admin/articoli/id-inesistente');

    expect(await screen.findByText('Articolo non trovato')).toBeInTheDocument();
    expect(screen.queryByLabelText('Titolo')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /torna all.elenco/i })).toBeInTheDocument();
    // Nessun pulsante "Riprova": un id sbagliato nell'indirizzo non si risolve ritentando.
    expect(screen.queryByRole('button', { name: /riprova/i })).not.toBeInTheDocument();
  });

  it('errore di rete: mostra un messaggio distinto con "Riprova", non il form', async () => {
    mockGetDoc.mockRejectedValue(new Error('Firestore unavailable: network error'));

    renderEditor('/admin/articoli/id-qualsiasi');

    expect(await screen.findByText("Impossibile caricare l'articolo")).toBeInTheDocument();
    expect(screen.queryByLabelText('Titolo')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /riprova/i })).toBeInTheDocument();
  });

  it('"Riprova" richiama il caricamento e, se questa volta va a buon fine, mostra il form coi dati veri', async () => {
    mockGetDoc.mockRejectedValueOnce(new Error('network error'));
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ title: 'Articolo vero', slug: 'articolo-vero', content: 'Contenuto vero' }),
    });

    renderEditor('/admin/articoli/id-qualsiasi');

    fireEvent.click(await screen.findByRole('button', { name: /riprova/i }));

    expect(await screen.findByLabelText('Titolo')).toHaveValue('Articolo vero');
  });
});

describe('ArticleEditor — Verifica AI: annulla disponibile, niente alert()', () => {
  beforeEach(() => {
    vi.mocked(verifyWithSearch).mockReset();
  });

  it('applica il risultato, mostra il messaggio in pagina (non un alert) e permette di tornare indietro', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(verifyWithSearch).mockResolvedValue('CONTENUTO VERIFICATO DAL MODELLO');

    renderEditor();

    const textarea = screen.getByLabelText('Contenuto') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Il contenuto originale scritto a mano.' } });

    fireEvent.click(screen.getByRole('button', { name: /verifica fatti/i }));

    expect(await screen.findByText(/verifica dei fatti completata/i)).toBeInTheDocument();
    expect(textarea).toHaveValue('CONTENUTO VERIFICATO DAL MODELLO');
    expect(alertSpy).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /torna alla versione precedente/i }));

    expect(textarea).toHaveValue('Il contenuto originale scritto a mano.');
    alertSpy.mockRestore();
  });

  it('se la verifica fallisce, il contenuto resta intatto e l’errore compare in pagina', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(verifyWithSearch).mockRejectedValue(new Error('AI verify failed'));

    renderEditor();

    const textarea = screen.getByLabelText('Contenuto') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Testo che deve restare invariato.' } });

    fireEvent.click(screen.getByRole('button', { name: /verifica fatti/i }));

    expect(
      await screen.findByText(/si è verificato un errore durante la verifica/i)
    ).toBeInTheDocument();
    expect(textarea).toHaveValue('Testo che deve restare invariato.');
    expect(alertSpy).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});

afterEach(() => {
  window.localStorage.clear();
  vi.useRealTimers();
});

describe('ArticleEditor — bug #3: uno slug duplicato in creazione non sovrascrive l’articolo esistente', () => {
  beforeEach(() => {
    mockGetDoc.mockReset();
    mockSetDoc.mockReset();
  });

  it('non scrive, avvisa in italiano e offre uno slug alternativo', async () => {
    mockGetDoc.mockResolvedValue({ exists: () => true });

    renderEditor();

    fireEvent.change(screen.getByLabelText('Titolo'), { target: { value: 'Prova' } });
    fireEvent.change(screen.getByLabelText('Slug (URL)'), {
      target: { value: 'articolo-esistente' },
    });

    fireEvent.click(screen.getByRole('button', { name: /salva articolo/i }));

    expect(await screen.findByText(/esiste già un articolo con lo slug/i)).toBeInTheDocument();
    expect(mockSetDoc).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /usa "articolo-esistente-2"/i })).toBeInTheDocument();
  });

  it('in modifica (id già presente) non fa nessun controllo di unicità sullo slug', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ title: 'Articolo vero', slug: 'articolo-vero', content: 'x' }),
    });
    mockSetDoc.mockResolvedValue(undefined);

    renderEditor('/admin/articoli/id-vero');
    await screen.findByLabelText('Titolo');

    fireEvent.click(screen.getByRole('button', { name: /salva articolo/i }));

    await waitFor(() => expect(mockSetDoc).toHaveBeenCalled());
    // un solo getDoc: quello del caricamento iniziale, nessun controllo aggiuntivo sullo slug
    expect(mockGetDoc).toHaveBeenCalledTimes(1);
  });
});

describe('ArticleEditor — bug #4: un salvataggio fallito non è più silenzioso', () => {
  beforeEach(() => {
    mockGetDoc.mockReset();
    mockSetDoc.mockReset();
  });

  it('mostra un messaggio di errore in pagina e il testo resta compilabile', async () => {
    mockGetDoc.mockResolvedValue({ exists: () => false });
    mockSetDoc.mockRejectedValue(new Error('Firestore unavailable: network error'));

    renderEditor();
    fireEvent.change(screen.getByLabelText('Titolo'), { target: { value: 'Prova' } });
    fireEvent.change(screen.getByLabelText('Slug (URL)'), { target: { value: 'nuovo-slug' } });

    fireEvent.click(screen.getByRole('button', { name: /salva articolo/i }));

    expect(await screen.findByText(/salvataggio non riuscito/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salva articolo/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Titolo')).toHaveValue('Prova');
  });
});

describe('ArticleEditor — bug #5: un salvataggio appeso smette di dire "sto salvando"', () => {
  beforeEach(() => {
    mockGetDoc.mockReset();
    mockSetDoc.mockReset();
  });

  it('oltre la soglia avvisa di non chiudere la pagina, invece di restare appeso in silenzio', async () => {
    vi.useFakeTimers();
    mockGetDoc.mockResolvedValue({ exists: () => false });
    mockSetDoc.mockImplementation(() => new Promise(() => {}));

    renderEditor();
    fireEvent.change(screen.getByLabelText('Titolo'), { target: { value: 'Prova' } });
    fireEvent.change(screen.getByLabelText('Slug (URL)'), { target: { value: 'slug-offline' } });

    fireEvent.click(screen.getByRole('button', { name: /salva articolo/i }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0); // lascia risolvere il controllo slug (getDoc)
    });

    expect(screen.getByText(/^salvataggio\.\.\.$/i)).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });

    expect(screen.getByText(/non chiudere questa pagina/i)).toBeInTheDocument();
  });
});

describe('ArticleEditor — bug #6: chiudere la scheda o navigare via non butta più il lavoro', () => {
  it('con modifiche pendenti, "Torna all\'elenco" chiede conferma prima di uscire', async () => {
    renderEditor();

    fireEvent.change(screen.getByLabelText('Titolo'), {
      target: { value: 'Testo scritto ma non salvato' },
    });

    fireEvent.click(screen.getByRole('button', { name: /torna all.elenco/i }));

    expect(await screen.findByText(/uscendo andranno perse/i)).toBeInTheDocument();
    // resta montato finché non si conferma: nessuna navigazione silenziosa
    expect(screen.getByLabelText('Titolo')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /sì, esci senza salvare/i }));

    await waitFor(() => expect(screen.queryByLabelText('Titolo')).not.toBeInTheDocument());
  });

  it('senza modifiche pendenti, naviga via subito senza chiedere conferma', async () => {
    renderEditor();

    fireEvent.click(screen.getByRole('button', { name: /torna all.elenco/i }));

    await waitFor(() => expect(screen.queryByLabelText('Titolo')).not.toBeInTheDocument());
  });

  it('avvisa il browser alla chiusura quando ci sono modifiche non salvate', async () => {
    renderEditor();
    fireEvent.change(screen.getByLabelText('Titolo'), { target: { value: 'Testo non salvato' } });
    await screen.findByDisplayValue('Testo non salvato');

    const event = new Event('beforeunload', { cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});

describe('ArticleEditor — bug #7: una bozza locale più recente può tornare', () => {
  it('offre di riprendere un testo scritto e mai salvato dopo la riapertura', async () => {
    vi.useFakeTimers();

    const { unmount } = renderEditor();
    fireEvent.change(screen.getByLabelText('Titolo'), {
      target: { value: 'Testo scritto e mai salvato' },
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2100); // supera il debounce di ~2s
    });

    unmount(); // simula la chiusura della scheda senza salvare
    vi.useRealTimers();

    renderEditor(); // riapertura dello stesso editor (stessa chiave "nuovo")

    expect(await screen.findByText(/hai del testo non salvato/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /riprendi/i }));

    expect(screen.getByLabelText('Titolo')).toHaveValue('Testo scritto e mai salvato');
  });
});

describe('ArticleEditor — bug #8: la barra di stato blocca la pubblicazione, mai il salvataggio della bozza', () => {
  beforeEach(() => {
    mockGetDoc.mockReset();
    mockSetDoc.mockReset();
  });

  it('mostra bozza/salvataggio/errori di sintassi, e lascia sempre libero il salvataggio come bozza', async () => {
    renderEditor();

    expect(screen.getByText('Bozza')).toBeInTheDocument();
    expect(screen.getByText(/non ancora salvato/i)).toBeInTheDocument();
    expect(screen.getByText(/nessun problema di sintassi/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Contenuto'), {
      target: { value: ':::postox{id="x"}\n:::' },
    });

    expect(await screen.findByText(/1 cosa da correggere/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Titolo'), { target: { value: 'Prova' } });
    fireEvent.change(screen.getByLabelText('Slug (URL)'), { target: { value: 'prova-slug' } });
    fireEvent.click(screen.getByLabelText('Pubblica immediatamente'));

    mockGetDoc.mockResolvedValue({ exists: () => false });

    fireEvent.click(screen.getByRole('button', { name: /salva articolo/i }));

    expect(await screen.findByText(/non puoi pubblicare/i)).toBeInTheDocument();
    expect(mockSetDoc).not.toHaveBeenCalled();

    // disattivando "Pubblica immediatamente" il salvataggio come bozza resta libero
    fireEvent.click(screen.getByLabelText('Pubblica immediatamente'));
    fireEvent.click(screen.getByRole('button', { name: /salva articolo/i }));

    await waitFor(() => expect(mockSetDoc).toHaveBeenCalled());
  });
});
