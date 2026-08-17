import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, useLocation } from 'react-router-dom';
import { AudienceProvider } from '../context/AudienceContext';
import Navbar from './Navbar';

/** Mostra il pathname corrente: MemoryRouter non tocca `window.location`,
 *  quindi è l'unico modo di verificare se un click ha navigato oppure no. */
function SondaPercorso() {
  const location = useLocation();
  return <output data-testid="percorso-corrente">{location.pathname}</output>;
}

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
      getAllByRole('button', { name: "Passa all'edizione Viaggiatori" }).some((button) =>
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

  // Prima della ricomposizione la grafia di "Chi siamo" divergeva per
  // edizione (Title Case scritto a mano in due punti di Navbar.tsx). Ora le
  // tre edizioni leggono lo stesso token `navigation.aboutLabel`.
  it('mostra «Chi siamo» con una sola grafia in tutte le edizioni', () => {
    for (const percorso of ['/', '/family', '/collaborazioni']) {
      const { unmount, getAllByText } = renderNavbarSu(percorso);
      const varianti = getAllByText(/chi siamo/i).map((el) => el.textContent?.trim());
      expect(varianti.length).toBeGreaterThan(0);
      for (const testo of varianti) {
        expect(testo).toBe('Chi siamo');
      }
      unmount();
    }
  });

  // Regressione: il drawer mobile mostrava sempre il menu viaggiatori
  // (Mete/Guide e racconti/Mappa) tranne che in family, quindi in edizione
  // brand comparivano insieme il menu sbagliato e la card Collaborazioni.
  it('in edizione brand il drawer mostra le voci di collaborazione, non quelle di viaggiatori', () => {
    const { getByRole, queryAllByText } = renderNavbarSu('/collaborazioni');
    fireEvent.click(getByRole('button', { name: 'Menu' }));

    expect(queryAllByText(/^Mete$/).length).toBe(0);
    expect(queryAllByText(/^Mappa$/).length).toBe(0);
    expect(queryAllByText(/Collaborazioni/i).length).toBeGreaterThan(0);
  });

  // Difetto 3 del task testata: /chi-siamo è nei tre menu (viaggiatori,
  // family, brand). Cambiare edizione stando lì non deve teletrasportare —
  // solo su una rotta che l'edizione di destinazione non possiede si naviga.
  it('cambiare edizione da /chi-siamo non naviga: la rotta esiste anche in family', () => {
    const { getAllByRole, getByTestId } = render(
      <MemoryRouter initialEntries={['/chi-siamo']}>
        <AudienceProvider>
          <Navbar />
          <SondaPercorso />
        </AudienceProvider>
      </MemoryRouter>
    );

    const family = getAllByRole('button', { name: /family/i })[0];
    fireEvent.click(family);

    expect(getByTestId('percorso-corrente').textContent).toBe('/chi-siamo');
  });

  it('cambiare edizione da / naviga davvero: la rotta non esiste in family', () => {
    const { getAllByRole, getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <AudienceProvider>
          <Navbar />
          <SondaPercorso />
        </AudienceProvider>
      </MemoryRouter>
    );

    const family = getAllByRole('button', { name: /family/i })[0];
    fireEvent.click(family);

    expect(getByTestId('percorso-corrente').textContent).toBe('/family');
  });
});
