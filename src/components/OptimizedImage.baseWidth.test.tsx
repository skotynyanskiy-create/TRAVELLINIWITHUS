import { render } from '../test/test-utils';
import { describe, it, expect } from 'vitest';
import OptimizedImage from './OptimizedImage';

describe('OptimizedImage baseWidth (srcSet locale)', () => {
  it('aggiunge il file base come variante più larga del srcSet', () => {
    const { container } = render(
      <OptimizedImage
        src="/images/home-journal/hero-impossible.png"
        alt="test"
        responsiveWidths={[320, 480, 768]}
        baseWidth={1080}
      />
    );

    const avif = container.querySelector('source[type="image/avif"]');
    expect(avif?.getAttribute('srcset')).toBe(
      '/images/home-journal/hero-impossible-320.avif 320w, ' +
        '/images/home-journal/hero-impossible-480.avif 480w, ' +
        '/images/home-journal/hero-impossible-768.avif 768w, ' +
        '/images/home-journal/hero-impossible.avif 1080w'
    );

    const webp = container.querySelector('source[type="image/webp"]');
    expect(webp?.getAttribute('srcset')).toBe(
      '/images/home-journal/hero-impossible-320.webp 320w, ' +
        '/images/home-journal/hero-impossible-480.webp 480w, ' +
        '/images/home-journal/hero-impossible-768.webp 768w, ' +
        '/images/home-journal/hero-impossible.webp 1080w'
    );
  });

  it('senza baseWidth il srcSet resta quello delle sole varianti', () => {
    const { container } = render(
      <OptimizedImage
        src="/images/reels/reel-1-cover.webp"
        alt="test"
        responsiveWidths={[320, 480]}
      />
    );

    const img = container.querySelector('img');
    expect(img?.getAttribute('srcset')).toBe(
      '/images/reels/reel-1-cover-320.webp 320w, /images/reels/reel-1-cover-480.webp 480w'
    );
  });
});
