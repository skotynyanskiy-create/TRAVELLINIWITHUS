import { describe, it, expect, beforeEach } from 'vitest';
import {
  appendLeadFallback,
  buildLeadFallbackMailto,
  buildLeadFallbackWhatsAppText,
  buildLeadFallbackWhatsAppUrl,
  readLeadFallback,
} from './leadFallback';

describe('leadFallback — persistenza locale', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('salva un lead in localStorage e lo rilegge', () => {
    const saved = appendLeadFallback('twu_test_leads', {
      email: 'prova@esempio.it',
      date: new Date().toISOString(),
    });
    expect(saved).toBe(true);
    expect(readLeadFallback('twu_test_leads')).toHaveLength(1);
  });
});

describe('leadFallback — canale diretto precompilato', () => {
  it('costruisce un mailto: con oggetto e corpo codificati, senza perdere i dati inseriti', () => {
    const href = buildLeadFallbackMailto(
      'info@travelliniwithus.it',
      'Richiesta media kit — Hotel Test',
      'Il modulo non è riuscito a inviare la richiesta.',
      [
        { label: 'Azienda', value: 'Hotel Test' },
        { label: 'Email', value: '' }, // campo vuoto: non deve comparire nel corpo
      ]
    );

    expect(href.startsWith('mailto:info@travelliniwithus.it?')).toBe(true);
    expect(href).toContain('subject=Richiesta%20media%20kit');
    expect(href).toContain('Azienda%3A%20Hotel%20Test');
    expect(href).not.toContain('Email%3A');
  });

  it('costruisce un link WhatsApp con testo precompilato', () => {
    const text = buildLeadFallbackWhatsAppText('Il modulo non ha funzionato:', [
      { label: 'Email', value: 'prova@esempio.it' },
    ]);
    const href = buildLeadFallbackWhatsAppUrl('https://wa.me/393421681411', text);

    expect(href.startsWith('https://wa.me/393421681411?text=')).toBe(true);
    expect(href).toContain('Email%3A%20prova%40esempio.it');
  });
});
