import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AudienceProvider } from '../context/AudienceContext';
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
      <AudienceProvider>
        <Navbar />
      </AudienceProvider>
    </BrowserRouter>
  );

describe('Navbar Component', () => {
  it('renders the logo', () => {
    const { getAllByText } = renderNavbar();
    expect(getAllByText(/Travellini/i).length).toBeGreaterThan(0);
  });

  it('renders navigation links (IA corrente)', () => {
    const { getAllByText, getAllByRole } = renderNavbar();
    expect(getAllByText(/Mete/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Guide e racconti/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Mappa/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Chi siamo/i).length).toBeGreaterThan(0);
    // CTA primaria B2C → landing lead
    expect(getAllByText(/La guida in regalo/i).length).toBeGreaterThan(0);
    // Link verso funnel guida
    const guideLinks = getAllByRole('link').filter((el) =>
      (el.getAttribute('href') || '').includes('/guida-in-regalo')
    );
    expect(guideLinks.length).toBeGreaterThan(0);
  });
});
