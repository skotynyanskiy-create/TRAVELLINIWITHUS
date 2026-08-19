import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SearchModal from './SearchModal';

const { fetchArticlesMock, trackEventMock } = vi.hoisted(() => ({
  fetchArticlesMock: vi.fn(),
  trackEventMock: vi.fn(),
}));

vi.mock('../services/firebaseService', () => ({
  fetchArticles: fetchArticlesMock,
}));

vi.mock('../services/analytics', () => ({
  trackEvent: trackEventMock,
}));

vi.mock('../hooks/useSiteContent', async () => {
  const { siteContentDefaults } = await import('../config/siteContent');
  return {
    useSiteContent: () => ({ data: siteContentDefaults.demo }),
  };
});

function SearchHarness() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <BrowserRouter>
      <button type="button" onClick={() => setIsOpen(true)}>
        Apri ricerca
      </button>
      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </BrowserRouter>
  );
}

function renderSearch() {
  return render(<SearchHarness />);
}

describe('SearchModal', () => {
  beforeEach(() => {
    fetchArticlesMock.mockReset();
    trackEventMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps local search available after an error and reloads on reopen', async () => {
    fetchArticlesMock.mockRejectedValueOnce(new Error('Firestore unavailable'));
    renderSearch();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Non riusciamo ad aggiornare/i);
    });
    expect(screen.getByRole('button', { name: 'Sushi' })).toBeInTheDocument();

    fetchArticlesMock.mockResolvedValueOnce([]);
    fireEvent.click(screen.getByRole('button', { name: 'Chiudi ricerca' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Ricerca nel sito' })).not.toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Apri ricerca' }));

    await waitFor(() => {
      expect(fetchArticlesMock).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('starts a new request when the user selects retry', async () => {
    fetchArticlesMock.mockRejectedValueOnce(new Error('Firestore unavailable'));
    fetchArticlesMock.mockResolvedValueOnce([]);
    renderSearch();

    await screen.findByRole('alert');
    fireEvent.click(screen.getByRole('button', { name: 'Riprova' }));

    await waitFor(() => {
      expect(fetchArticlesMock).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
