import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Newsletter from './Newsletter';

function renderNewsletter(props: React.ComponentProps<typeof Newsletter> = {}) {
  return render(
    <BrowserRouter>
      <Newsletter source="test_newsletter" {...props} />
    </BrowserRouter>
  );
}

async function fillAndSubmit(email = 'prova@esempio.it') {
  fireEvent.change(screen.getByLabelText('La tua email'), { target: { value: email } });
  fireEvent.click(screen.getByRole('button', { name: /iscriviti alla newsletter/i }));

  await waitFor(() => {
    expect(screen.getByText(/iscrizione non registrata/i)).toBeInTheDocument();
  });
}

describe('Newsletter — quando /api/newsletter-subscribe non risponde', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('rete irraggiungibile nel test')));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('non mostra il messaggio di successo "Iscrizione confermata"', async () => {
    renderNewsletter();
    await fillAndSubmit();

    expect(screen.queryByText(/iscrizione confermata/i)).not.toBeInTheDocument();
  });

  it("offre un canale email cliccabile con l'indirizzo già compilato", async () => {
    renderNewsletter();
    await fillAndSubmit('prova@esempio.it');

    const mailLink = screen.getByRole('link', { name: /scrivi via email/i });
    const href = mailLink.getAttribute('href') ?? '';
    expect(href.startsWith('mailto:')).toBe(true);
    expect(href).toContain('prova%40esempio.it');
  });

  it('quando sblocca la guida, non dichiara "Ci sei" ma resta onesto sull\'iscrizione', async () => {
    renderNewsletter({ source: 'lead_magnet_test' });
    await fillAndSubmit('guida@esempio.it');

    expect(screen.queryByText(/^ci sei\.$/i)).not.toBeInTheDocument();
  });
});
