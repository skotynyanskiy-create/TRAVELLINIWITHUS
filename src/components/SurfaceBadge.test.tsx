import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SurfaceBadge from './SurfaceBadge';

describe('SurfaceBadge', () => {
  it('non mostra niente per una superficie live', () => {
    const { container } = render(<SurfaceBadge path="/mappa" />);
    expect(container.textContent).toBe('');
  });

  it('dice "presto" per una superficie soon', () => {
    const { container } = render(<SurfaceBadge path="/shop" />);
    expect(container.textContent).toBe('presto');
  });

  it('dice "anteprima" per una superficie preview', () => {
    const { container } = render(<SurfaceBadge path="/itinerari" />);
    expect(container.textContent).toBe('anteprima');
  });
});
