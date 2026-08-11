import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import MediaKit from './MediaKit';

function renderMediaKit() {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <MediaKit />
      </BrowserRouter>
    </HelmetProvider>
  );
}

async function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText(/Nome azienda \/ agenzia/), {
    target: { value: 'Hotel Test' },
  });
  fireEvent.change(screen.getByLabelText(/Email lavorativa/), {
    target: { value: 'test@hotel.it' },
  });
  fireEvent.change(screen.getByLabelText(/Focus della richiesta/), {
    target: { value: 'Hotel / hospitality' },
  });
  fireEvent.change(screen.getByLabelText(/Budget indicativo per il progetto/), {
    target: { value: '< €2.000' },
  });
  fireEvent.change(screen.getByLabelText(/Periodo stimato per la campagna/), {
    target: { value: 'Prossimi 30 giorni' },
  });
  fireEvent.change(screen.getByLabelText(/Contesto breve ma utile/), {
    target: { value: 'Contesto di prova per il test.' },
  });

  const form = document.getElementById('media-kit-form') as HTMLElement;
  fireEvent.click(within(form).getByRole('button', { name: /richiedi il media kit/i }));

  await waitFor(() => {
    expect(
      screen.getByText(/il modulo non è riuscito a inviare la richiesta/i)
    ).toBeInTheDocument();
  });
}

describe('MediaKit — quando /api/media-kit-lead non risponde', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('rete irraggiungibile nel test')));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('non mostra il messaggio di successo "Richiesta ricevuta"', async () => {
    renderMediaKit();
    await fillAndSubmit();

    expect(screen.queryByText(/richiesta ricevuta/i)).not.toBeInTheDocument();
  });

  it('offre un canale email cliccabile con i dati già compilati', async () => {
    renderMediaKit();
    await fillAndSubmit();

    const mailLink = screen.getByRole('link', { name: /scrivi via email/i });
    const href = mailLink.getAttribute('href') ?? '';
    expect(href.startsWith('mailto:')).toBe(true);
    expect(href).toContain('Hotel%20Test');
  });

  it('offre anche un canale WhatsApp cliccabile', async () => {
    renderMediaKit();
    await fillAndSubmit();

    const waLink = screen.getByRole('link', { name: /scrivi su whatsapp/i });
    expect(waLink.getAttribute('href')).toMatch(/^https:\/\/wa\.me\//);
  });
});
