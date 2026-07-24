import { describe, it, expect } from 'vitest';
import { CONTENT_ITEMS } from '../config/contentLibrary';

/**
 * Guardia di non-regressione. Esplora decideva se dichiararsi anteprima
 * guardando `CONTENT_ITEMS.length === 0`, cioe' se i contenuti ESISTONO — non
 * se sono VERI. Con 40 item tutti isPlaceholder la pagina risultava pubblica e
 * indicizzabile mentre mostrava solo segnaposto.
 *
 * Il test fotografa l'invariante che regge quella logica: finche' esiste anche
 * un solo item non-placeholder la pagina e' legittimamente pubblica, altrimenti
 * deve dichiararsi. Aggiornamento 2026-07-24: da qui in poi 29/62 item sono
 * reali (posti importati dai reel del brand), quindi il secondo test e'
 * girato di lato — la pagina non si dichiara piu' anteprima. La condizione in
 * Esplora.tsx (`usingPreview`, righe 328-332) resta la stessa: e' l'invariante
 * a essere cambiato di stato, non allentato.
 */
describe('Esplora: anteprima decisa sui contenuti veri, non su quelli esistenti', () => {
  it('il seed non e vuoto, quindi la vecchia condizione .length === 0 era gia falsa', () => {
    expect(CONTENT_ITEMS.length).toBeGreaterThan(0);
  });

  it('oggi esistono contenuti verificati, quindi la pagina NON deve dichiararsi anteprima', () => {
    const hasRealContentItems = CONTENT_ITEMS.some((item) => !item.isPlaceholder);
    expect(hasRealContentItems).toBe(true);
  });
});
