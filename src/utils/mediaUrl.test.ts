import { describe, expect, it } from 'vitest';
import { joinVideoBase } from './mediaUrl';

const R2 = 'https://media.travelliniwithus.it';

describe('joinVideoBase', () => {
  it('senza base lascia il percorso invariato (comportamento di oggi)', () => {
    expect(joinVideoBase('', '/video/jesolo-caribe-bay.mp4')).toBe('/video/jesolo-caribe-bay.mp4');
  });

  it('prefissa la base quando configurata', () => {
    expect(joinVideoBase(R2, '/video/jesolo-caribe-bay.mp4')).toBe(
      `${R2}/video/jesolo-caribe-bay.mp4`
    );
  });

  it('non produce doppia barra se il percorso non inizia con /', () => {
    expect(joinVideoBase(R2, 'video/x.mp4')).toBe(`${R2}/video/x.mp4`);
  });

  it('non riscrive un URL già assoluto', () => {
    const external = 'https://cdn.esterno.example/clip.mp4';
    expect(joinVideoBase(R2, external)).toBe(external);
    expect(joinVideoBase(R2, '//cdn.esterno.example/clip.mp4')).toBe(
      '//cdn.esterno.example/clip.mp4'
    );
  });

  it('propaga undefined invece di produrre la stringa "undefined"', () => {
    expect(joinVideoBase(R2, undefined)).toBeUndefined();
  });
});
