import { afterEach, describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import SEO from './SEO';

/**
 * In produzione l'hosting è statico (generate-route-html.js): `/posto/<id>`
 * porta già un `<script data-prerender-jsonld>` nell'HTML servito, perché gli
 * scraper senza JS devono vedere la stessa Review degli utenti. Quel nodo non
 * è gestito da react-helmet-async, quindi l'idratazione non lo toglie da
 * sola — senza il filtro in SEO.tsx un browser/crawler che ESEGUE JS
 * vedrebbe la stessa Review due volte.
 */
function addPrerenderedJsonLd(jsonLd: object) {
  const script = document.createElement('script');
  script.setAttribute('data-prerender-jsonld', '');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
  return script;
}

function renderSEO(jsonLd: object) {
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/posto/qualsiasi']}>
        <SEO title="T" description="D" jsonLd={jsonLd} breadcrumbs={[{ name: 'Home', url: '/' }]} />
      </MemoryRouter>
    </HelmetProvider>
  );
}

function jsonLdTypes(): string[] {
  return Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map((el) => {
      try {
        return (JSON.parse(el.textContent || '{}') as { '@type'?: string })['@type'];
      } catch {
        return undefined;
      }
    })
    .filter((t): t is string => Boolean(t));
}

describe('SEO: dedup della Review già prerenderizzata', () => {
  const prerendered: HTMLScriptElement[] = [];

  afterEach(() => {
    for (const node of prerendered.splice(0)) node.remove();
  });

  it('non duplica un Review dello stesso @type già presente come data-prerender-jsonld', () => {
    prerendered.push(
      addPrerenderedJsonLd({ '@context': 'https://schema.org', '@type': 'Review', reviewBody: 'x' })
    );

    renderSEO({ '@context': 'https://schema.org', '@type': 'Review', reviewBody: 'x' });

    const types = jsonLdTypes();
    expect(types.filter((t) => t === 'Review')).toHaveLength(1);
    // Il BreadcrumbList (tipo diverso) resta: il filtro è per @type, non un blackout totale.
    expect(types).toContain('BreadcrumbList');
  });

  it('senza un prerendered dello stesso tipo, emette normalmente il jsonLd del client', () => {
    renderSEO({ '@context': 'https://schema.org', '@type': 'Review', reviewBody: 'x' });

    expect(jsonLdTypes()).toContain('Review');
  });

  it('un prerendered di tipo diverso non sopprime il Review del client', () => {
    prerendered.push(
      addPrerenderedJsonLd({ '@context': 'https://schema.org', '@type': 'Place', name: 'x' })
    );

    renderSEO({ '@context': 'https://schema.org', '@type': 'Review', reviewBody: 'x' });

    expect(jsonLdTypes()).toContain('Review');
  });
});
