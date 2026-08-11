import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import SEO from './SEO';
import { SITE_URL } from '../config/site';

const ogImageAt = (image?: string) => {
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/articolo/qualsiasi']}>
        <SEO title="T" description="D" image={image} />
      </MemoryRouter>
    </HelmetProvider>
  );
  return {
    og: document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '',
    twitter: document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ?? '',
    type: document.querySelector('meta[property="og:image:type"]')?.getAttribute('content') ?? '',
  };
};

describe('SEO: og:image sempre assoluto', () => {
  it('assolutizza la cover relativa di un articolo Firestore', () => {
    const { og, twitter } = ogImageAt('/images/articles/burton.webp');
    expect(og).toBe(`${SITE_URL}/images/articles/burton.webp`);
    expect(twitter).toBe(og);
  });

  it('normalizza anche un path senza slash iniziale', () => {
    expect(ogImageAt('images/articles/burton.webp').og).toBe(
      `${SITE_URL}/images/articles/burton.webp`
    );
  });

  it('lascia intatto un URL gia assoluto', () => {
    const remote = 'https://cdn.example.test/card.jpg';
    expect(ogImageAt(remote).og).toBe(remote);
  });

  it('mantiene il default assoluto quando la pagina non passa immagine', () => {
    expect(ogImageAt().og).toBe(`${SITE_URL}/og/default.jpg`);
  });

  it('deriva il mime dal path assolutizzato, non da quello ricevuto', () => {
    expect(ogImageAt('/images/articles/burton.jpg').type).toBe('image/jpeg');
  });
});
