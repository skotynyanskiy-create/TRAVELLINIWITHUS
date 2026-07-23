import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SurfaceBadge from './SurfaceBadge';

describe('SurfaceBadge', () => {
  it('non mostra niente per una superficie live (nessuno spazio incluso)', () => {
    const { container } = render(<SurfaceBadge path="/mappa" />);
    expect(container.textContent).toBe('');
  });

  it('dice "presto" per una superficie soon, separato da uno spazio testuale', () => {
    const { container } = render(<SurfaceBadge path="/shop" />);
    expect(container.textContent).toBe(' presto');
  });

  it('dice "anteprima" per una superficie preview, separata da uno spazio testuale', () => {
    const { container } = render(<SurfaceBadge path="/itinerari" />);
    expect(container.textContent).toBe(' anteprima');
  });

  it("non si concatena all'etichetta quando renderizzato subito dopo un testo, come nei siti di chiamata reali", () => {
    const { container } = render(
      <>
        Shop
        <SurfaceBadge path="/shop" />
      </>
    );
    expect(container.textContent).toBe('Shop presto');
    expect(container.textContent).not.toBe('Shoppresto');
  });
});
