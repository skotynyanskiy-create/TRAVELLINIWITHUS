import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAdmin: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock('../context/FavoritesContext', () => ({
  useFavorites: () => ({
    favorites: [],
  }),
}));

vi.mock('../hooks/useSiteContent', async () => {
  const { siteContentDefaults } = await import('../config/siteContent');
  return {
    useSiteContent: (key: keyof typeof siteContentDefaults) => ({
      data: siteContentDefaults[key],
    }),
  };
});

const renderNavbar = () =>
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

describe('Navbar Component', () => {
  it('renders the logo', () => {
    const { getByText } = renderNavbar();
    expect(getByText(/Travellini/i)).toBeInTheDocument();
  });

  it('renders navigation links (post-Esplora consolidation 2026-05-15)', () => {
    const { getAllByText } = renderNavbar();
    expect(getAllByText(/Esplora/i).length).toBeGreaterThan(0);
    // Default label 'Strumenti' (siteContent.ts:436) per la rotta /strumenti;
    // editabile da admin via SiteContentEditor.
    expect(getAllByText(/Strumenti/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Shop/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Club/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Chi siamo/i).length).toBeGreaterThan(0);
    // Voce nav "Collaborazioni" rimossa il 2026-05-24 (era duplicato della pill):
    // ora l'unico ingresso a /collaborazioni è la pill "Collabora con noi".
    expect(getAllByText(/Collabora con noi/i).length).toBeGreaterThan(0);
  });
});
