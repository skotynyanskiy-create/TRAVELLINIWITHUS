import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import VieniConNoi from './VieniConNoi';

function renderPage() {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <VieniConNoi />
      </BrowserRouter>
    </HelmetProvider>
  );
}

async function fillAndSubmit(email = 'prova@esempio.it') {
  fireEvent.change(screen.getByLabelText('La tua email'), { target: { value: email } });
  fireEvent.click(screen.getByRole('button', { name: /ricevi la/i }));

  await waitFor(() => {
    expect(screen.getByText(/iscrizione non confermata/i)).toBeInTheDocument();
  });
}

describe('VieniConNoi — quando /api/newsletter-subscribe non risponde', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('rete irraggiungibile nel test')));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('non mostra il messaggio di successo "Iscrizione registrata"', async () => {
    renderPage();
    await fillAndSubmit();

    expect(screen.queryByText(/^iscrizione registrata$/i)).not.toBeInTheDocument();
  });

  it("offre un canale email cliccabile con l'indirizzo già compilato", async () => {
    renderPage();
    await fillAndSubmit('prova@esempio.it');

    const mailLink = screen.getByRole('link', { name: /scrivi via email/i });
    const href = mailLink.getAttribute('href') ?? '';
    expect(href.startsWith('mailto:')).toBe(true);
    expect(href).toContain('prova%40esempio.it');
  });

  it("concede comunque l'accesso alla guida quando il lead resta salvato in locale", async () => {
    renderPage();
    await fillAndSubmit('prova@esempio.it');

    expect(sessionStorage.getItem('twu_lead_magnet_unlocked')).toBe('1');
    expect(screen.getByRole('link', { name: /apri e scarica/i })).toBeInTheDocument();
  });
});
