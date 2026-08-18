import { describe, it, expect } from 'vitest';
import { extractPlaceReferences } from './articlePlaceReferences';
import { articleSeed as dormireSeed } from '../data/articles/dormire-posti-sembrano-inventati.seed';

describe('extractPlaceReferences', () => {
  it('legge un id dalla direttiva :::posto{id="…"}', () => {
    const refs = extractPlaceReferences(':::posto{id="praga-dog-cafe"}\n:::');
    expect(refs).toEqual([{ id: 'praga-dog-cafe', position: 1 }]);
  });

  it('legge un id da un link in prosa ](/posto/id)', () => {
    const refs = extractPlaceReferences('Guarda la scheda di [Placat](/posto/bossico-placat).');
    expect(refs).toEqual([{ id: 'bossico-placat', position: 1 }]);
  });

  it('numera in ordine di prima apparizione, mescolando direttiva e link', () => {
    const content = `
[Uno](/posto/uno)

:::posto{id="due"}
:::

Testo, poi [Uno di nuovo](/posto/uno), poi [Tre](/posto/tre).
`;
    expect(extractPlaceReferences(content)).toEqual([
      { id: 'uno', position: 1 },
      { id: 'due', position: 2 },
      { id: 'tre', position: 3 },
    ]);
  });

  it('deduplica sulla prima occorrenza', () => {
    const content = '[A](/posto/a) e poi ancora [A](/posto/a).';
    expect(extractPlaceReferences(content)).toEqual([{ id: 'a', position: 1 }]);
  });

  it('nessun riferimento su un contenuto senza /posto/', () => {
    expect(extractPlaceReferences('Solo prosa, nessun link a un posto.')).toEqual([]);
  });

  it('riproduce l ordine delle 10 voci del pillar dormire-posti-sembrano-inventati', () => {
    // Stessa lista dichiarata nella content note (## Body, "Note di consegna",
    // "Ordine di prima apparizione"): garantisce che l'evento
    // article_place_click e l'ItemList restino allineati su questo articolo.
    const refs = extractPlaceReferences(dormireSeed.content);
    expect(refs.map((ref) => ref.id)).toEqual([
      'novara-emotional-grand-motel',
      'casola-spino-fiorito',
      'bossico-placat',
      'poppi-fattorie-di-celli',
      'emilia-granduca-di-campigna',
      'grone-narciso-home-chalet',
      'bracciano-enjoy-house',
      'toscana-suite-spa-civico-4',
      'massa-lubrense-relais-freedom',
      'firenze-villa-tolomei',
    ]);
    expect(refs.map((ref) => ref.position)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
