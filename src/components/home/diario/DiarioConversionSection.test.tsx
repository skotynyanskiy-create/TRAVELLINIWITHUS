import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DiarioConversionSection from './DiarioConversionSection';

function renderSection() {
  return render(
    <BrowserRouter>
      <DiarioConversionSection />
    </BrowserRouter>
  );
}

async function fillAndSubmit(email = 'prova@esempio.it') {
  fireEvent.change(screen.getByPlaceholderText('La tua email lavorativa o personale'), {
    target: { value: email },
  });
  fireEvent.click(screen.getByRole('button', { name: /ricevi il pdf gratuito/i }));

  await waitFor(() => {
    expect(screen.getByText(/iscrizione non registrata/i)).toBeInTheDocument();
  });
}

describe('DiarioConversionSection — quando /api/newsletter-subscribe non risponde', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('rete irraggiungibile nel test')));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('non mostra il messaggio di successo "Guida Sbloccata!"', async () => {
    renderSection();
    await fillAndSubmit();

    expect(screen.queryByText(/guida sbloccata!/i)).not.toBeInTheDocument();
  });

  it("offre un canale email cliccabile con l'indirizzo già compilato", async () => {
    renderSection();
    await fillAndSubmit('prova@esempio.it');

    const mailLink = screen.getByRole('link', { name: /scrivi via email/i });
    const href = mailLink.getAttribute('href') ?? '';
    expect(href.startsWith('mailto:')).toBe(true);
    expect(href).toContain('prova%40esempio.it');
  });
});
