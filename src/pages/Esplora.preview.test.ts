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
 * deve dichiararsi. Quando arriveranno i contenuti reali il secondo test
 * cambiera' lato — ed e' il momento in cui va riletta la condizione in
 * Esplora.tsx, non quello di allentare l'asserzione.
 */
describe('Esplora: anteprima decisa sui contenuti veri, non su quelli esistenti', () => {
  it('il seed non e vuoto, quindi la vecchia condizione .length === 0 era gia falsa', () => {
    expect(CONTENT_ITEMS.length).toBeGreaterThan(0);
  });

  it('oggi nessun contenuto e verificato, quindi la pagina deve dichiararsi anteprima', () => {
    const hasRealContentItems = CONTENT_ITEMS.some((item) => !item.isPlaceholder);
    expect(hasRealContentItems).toBe(false);
  });
});
