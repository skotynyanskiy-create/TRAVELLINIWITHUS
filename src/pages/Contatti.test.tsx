import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { AudienceProvider } from '../context/AudienceContext';
import Contatti from './Contatti';

vi.mock('../hooks/useSiteContent', async () => {
  const { siteContentDefaults } = await import('../config/siteContent');
  return {
    useSiteContent: (key: keyof typeof siteContentDefaults) => ({
      data: siteContentDefaults[key],
    }),
  };
});

function renderContatti() {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <AudienceProvider>
          <Contatti />
        </AudienceProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

async function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText(/Nome completo/), { target: { value: 'Maria Rossi' } });
  fireEvent.change(screen.getByLabelText(/Email di contatto/), {
    target: { value: 'maria@esempio.it' },
  });
  fireEvent.change(screen.getByLabelText(/Motivo del contatto/), {
    target: { value: 'other' },
  });
  fireEvent.change(screen.getByLabelText(/Messaggio/), {
    target: { value: 'Messaggio di prova per il test automatico.' },
  });

  fireEvent.click(screen.getByRole('button', { name: /invia richiesta/i }));

  await waitFor(() => {
    expect(screen.getByText(/il messaggio non è partito/i)).toBeInTheDocument();
  });
}

describe('Contatti — quando /api/contact-lead non risponde', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('rete irraggiungibile nel test')));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('non mostra il messaggio di successo "Messaggio inviato"', async () => {
    renderContatti();
    await fillAndSubmit();

    expect(screen.queryByText(/^messaggio inviato$/i)).not.toBeInTheDocument();
  });

  it('offre un canale email cliccabile con i dati già compilati', async () => {
    renderContatti();
    await fillAndSubmit();

    const mailLink = screen.getByRole('link', { name: /scrivi via email/i });
    const href = mailLink.getAttribute('href') ?? '';
    expect(href.startsWith('mailto:')).toBe(true);
    expect(href).toContain('Maria%20Rossi');
  });
});
