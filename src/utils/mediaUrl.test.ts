import { describe, expect, it } from 'vitest';
import { hasSpecificReelLink, joinVideoBase } from './mediaUrl';

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

describe('hasSpecificReelLink', () => {
  it('riconosce un reel specifico', () => {
    expect(hasSpecificReelLink('https://www.instagram.com/reel/DZWo5OTM_Cw/')).toBe(true);
  });

  it('riconosce un post specifico', () => {
    expect(hasSpecificReelLink('https://www.instagram.com/p/DZWo5OTM_Cw/')).toBe(true);
  });

  it('riconosce un reel specifico anche col path esteso /handle/reel/...', () => {
    expect(
      hasSpecificReelLink('https://www.instagram.com/travelliniwithus/reel/DTw_JBJjBBd/')
    ).toBe(true);
  });

  it('rifiuta il solo profilo, senza reel/post — è il caso placeholder che promette un contenuto inesistente', () => {
    expect(hasSpecificReelLink('https://www.instagram.com/travelliniwithus/')).toBe(false);
  });

  it('rifiuta undefined', () => {
    expect(hasSpecificReelLink(undefined)).toBe(false);
  });
});
