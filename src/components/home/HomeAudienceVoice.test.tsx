import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Audience } from '@/src/context/AudienceContext';
import HomeAudienceVoice from './HomeAudienceVoice';

let currentAudience: Audience = 'viaggiatori';

vi.mock('@/src/context/AudienceContext', () => ({
  useAudience: () => ({ audience: currentAudience }),
}));

vi.mock('@/src/hooks/usePersonalizedInterest', () => ({
  usePersonalizedInterest: () => ({ interest: null, source: null }),
}));

vi.mock('@/src/components/TransitionLink', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('@/src/components/OptimizedImage', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('./SorprendimiOverlay', () => ({
  default: () => null,
}));

afterEach(() => {
  cleanup();
  currentAudience = 'viaggiatori';
});

describe('HomeAudienceVoice — il gesto «posto a caso» non compete con la CTA commerciale', () => {
  it('mostra "Portami in un posto a caso" per i viaggiatori', () => {
    currentAudience = 'viaggiatori';
    render(<HomeAudienceVoice />);
    expect(screen.getByText('Portami in un posto a caso')).toBeInTheDocument();
  });

  it('mostra "Portami in un posto a caso" per le famiglie', () => {
    currentAudience = 'family';
    render(<HomeAudienceVoice />);
    expect(screen.getByText('Portami in un posto a caso')).toBeInTheDocument();
  });

  it('nasconde "Portami in un posto a caso" per il brand: resta solo la CTA commerciale', () => {
    currentAudience = 'brand';
    render(<HomeAudienceVoice />);
    expect(screen.queryByText('Portami in un posto a caso')).not.toBeInTheDocument();
    expect(screen.getByText('Richiedi il media kit')).toBeInTheDocument();
  });
});
