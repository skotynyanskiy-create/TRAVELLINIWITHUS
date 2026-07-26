import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AudienceProvider } from '../context/AudienceContext';
import Footer from './Footer';

vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ isAdmin: false }) }));
vi.mock('../hooks/useSiteContent', async () => {
  const { siteContentDefaults } = await import('../config/siteContent');
  return {
    useSiteContent: (key: keyof typeof siteContentDefaults) => ({ data: siteContentDefaults[key] }),
  };
});

const renderFooter = () =>
  render(
    <BrowserRouter>
      <AudienceProvider>
        <Footer />
      </AudienceProvider>
    </BrowserRouter>
  );

describe('nomi nel footer', () => {
  it('chiama lo shop "Shop", non "Shop Premium"', () => {
    renderFooter();
    expect(screen.queryByText('Shop Premium')).toBeNull();
    expect(screen.getByText('Shop')).toBeTruthy();
  });

  it('chiama /risorse "Cosa usiamo"', () => {
    renderFooter();
    expect(screen.getByText('Cosa usiamo')).toBeTruthy();
  });

  it('non linka /disclaimer due volte con due nomi diversi', () => {
    const { container } = renderFooter();
    const disclaimerLinks = container.querySelectorAll('a[href="/disclaimer"]');
    expect(disclaimerLinks.length).toBe(1);
    expect(screen.queryByText('Affiliazioni')).toBeNull();
  });
});
