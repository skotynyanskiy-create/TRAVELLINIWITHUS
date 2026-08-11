import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { hasActiveOverlayLayer, useOverlayLayer } from './useOverlayLayer';

function OverlayProbe({ active, name }: { active: boolean; name: string }) {
  const isTopLayer = useOverlayLayer(active);
  return <output data-testid={name}>{isTopLayer ? 'top' : 'behind'}</output>;
}

function OverlayStack({ first, second }: { first: boolean; second: boolean }) {
  return (
    <>
      <OverlayProbe active={first} name="first" />
      <OverlayProbe active={second} name="second" />
    </>
  );
}

afterEach(() => {
  cleanup();
  document.body.removeAttribute('style');
  document.body.innerHTML = '';
});

describe('useOverlayLayer', () => {
  it('keeps scroll locked until the last active overlay closes', () => {
    document.body.style.overflow = 'clip';
    const { rerender } = render(<OverlayStack first second />);

    expect(screen.getByTestId('first')).toHaveTextContent('behind');
    expect(screen.getByTestId('second')).toHaveTextContent('top');
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<OverlayStack first second={false} />);

    expect(screen.getByTestId('first')).toHaveTextContent('top');
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<OverlayStack first={false} second={false} />);

    expect(document.body.style.overflow).toBe('clip');
  });

  it('treats an existing dialog as a blocker for exit intent', () => {
    document.body.innerHTML = '<div role="dialog"></div>';

    expect(hasActiveOverlayLayer()).toBe(true);
  });
});
