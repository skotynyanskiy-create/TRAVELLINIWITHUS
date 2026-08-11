import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ArticleEditor from './ArticleEditor';
import { AuthProvider } from '../../context/AuthContext';
import { verifyWithSearch } from '../../services/aiVerificationService';

/**
 * Copre due bug confermati in revisione:
 * 1. Un caricamento fallito (documento inesistente o errore di rete) non deve
 *    mai mostrare il form vuoto con `id` valorizzato: premere Salva
 *    azzererebbe l'articolo reale su Firestore.
 * 2. "Verifica Fatti/Luoghi" sostituisce tutto il contenuto: deve restare
 *    un modo per tornare alla versione precedente, e l'esito non passa più
 *    da un `alert()` che si chiude senza leggerlo.
 */

vi.mock('../../lib/firebaseDb', () => ({ db: {} }));

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
