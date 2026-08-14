import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
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

/** Monta la navbar come se si fosse su una rotta precisa: serve a verificare
 *  quale voce risulta attiva. `BrowserRouter` legge la history vera, quindi
 *  `MemoryRouter` è l'unico modo di fissare il percorso. */
const renderNavbarSu = (percorso: string) =>
  render(
    <MemoryRouter initialEntries={[percorso]}>
      <AudienceProvider>
        <Navbar />
      </AudienceProvider>
    </MemoryRouter>
  );

/** La voce di menu marcata attiva, se ce n'è una. */
const voceAttiva = (container: HTMLElement) =>
  container.querySelector('a[aria-current="page"]')?.textContent?.trim() ?? null;

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

  it('keeps every mobile-drawer entry point at a comfortable touch target', () => {
    const { getAllByRole, getByRole } = renderNavbar();

    fireEvent.click(getByRole('button', { name: 'Menu' }));

    expect(getByRole('button', { name: 'Chiudi Menu' })).toHaveClass('min-h-[44px]');
    expect(
      getAllByRole('button', { name: 'Passa alla modalità Viaggiatori' }).some((button) =>
        button.classList.contains('min-h-[44px]')
      )
    ).toBe(true);
    expect(getByRole('link', { name: 'Apri Instagram Travelliniwithus' })).toHaveClass(
      'min-w-[44px]'
    );
  });

  // Regressione: `isItemActive` usciva con un return anticipato su
  // `path === '/esplora'`, e il ramo che avrebbe dovuto coprire articoli e guide
  // confrontava un href che nessuna voce di menu possiede. Aprendo un articolo
  // non si accendeva niente e non si capiva dove si fosse finiti.
  it.each([
    ['/esplora', 'archivio'],
    ['/articolo/qualsiasi-slug', 'articolo'],
    ['/guide/qualsiasi-slug', 'guida'],
    ['/itinerari', 'elenco itinerari'],
    ['/itinerari/qualsiasi-slug', 'itinerario'],
  ])('accende «Guide e racconti» su %s (%s)', (percorso) => {
    const { container } = renderNavbarSu(percorso);
    expect(voceAttiva(container)).toBe('Guide e racconti');
  });

  it('accende «Mete» sulle destinazioni, non la voce editoriale', () => {
    const { container } = renderNavbarSu('/destinazione/italia/toscana');
    expect(voceAttiva(container)).toBe('Mete');
  });

  it('non accende niente su una rotta che nessuna voce copre', () => {
    const { container } = renderNavbarSu('/contatti');
    expect(voceAttiva(container)).toBeNull();
  });
});
