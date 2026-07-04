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

  it('renders navigation links (IA definitiva 2026-07-04)', () => {
    const { getAllByText } = renderNavbar();
    // Due assi ortogonali: DOVE (Destinazioni) × COSA (Racconti), più Esplora,
    // Chi siamo, Shop. Strumenti e Club sono ora nel footer, non in nav primaria.
    expect(getAllByText(/Destinazioni/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Esplora/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Racconti/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Chi siamo/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Shop/i).length).toBeGreaterThan(0);
    // CTA nav reader-first (B2, 2026-07-04): la pill primaria è "Vieni con noi"
    // (/vieni-con-noi); "Collabora" resta come link secondario a /collaborazioni.
    expect(getAllByText(/Vieni con noi/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Collabora/i).length).toBeGreaterThan(0);
  });
});
