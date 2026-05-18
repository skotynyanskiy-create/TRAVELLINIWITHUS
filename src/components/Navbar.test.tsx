import { describe, it, expect } from 'vitest';
import { render } from '../test/test-utils';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  it('renders the logo', () => {
    const { getByText } = render(<Navbar />);
    expect(getByText(/Travellini/i)).toBeInTheDocument();
  });

  it('renders navigation links (post-Esplora consolidation 2026-05-15)', () => {
    const { getAllByText } = render(<Navbar />);
    expect(getAllByText(/Esplora/i).length).toBeGreaterThan(0);
    // Default label 'Strumenti' (siteContent.ts:436) per la rotta /risorse;
    // editabile da admin via SiteContentEditor.
    expect(getAllByText(/Strumenti/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Collaborazioni/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Chi siamo/i).length).toBeGreaterThan(0);
  });
});
