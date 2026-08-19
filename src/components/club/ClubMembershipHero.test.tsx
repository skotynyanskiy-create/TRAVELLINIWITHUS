import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ClubMembershipHero from './ClubMembershipHero';

async function fillAndSubmit(email = 'prova@esempio.it') {
  fireEvent.change(screen.getByPlaceholderText('la-tua@email.com'), {
    target: { value: email },
  });
  fireEvent.click(screen.getByRole('button', { name: /avvisami al lancio/i }));

  await waitFor(() => {
    expect(screen.getByText(/iscrizione alla waitlist non registrata/i)).toBeInTheDocument();
  });
}

describe('ClubMembershipHero — quando /api/newsletter-subscribe non risponde', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('rete irraggiungibile nel test')));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('non mostra il messaggio di successo "Sei in waitlist"', async () => {
    render(<ClubMembershipHero />);
    await fillAndSubmit();

    expect(screen.queryByText(/sei in waitlist/i)).not.toBeInTheDocument();
  });

  it("offre un canale email cliccabile con l'indirizzo già compilato", async () => {
    render(<ClubMembershipHero />);
    await fillAndSubmit('prova@esempio.it');

    const mailLink = screen.getByRole('link', { name: /scrivi via email/i });
    const href = mailLink.getAttribute('href') ?? '';
    expect(href.startsWith('mailto:')).toBe(true);
    expect(href).toContain('prova%40esempio.it');
  });
});
