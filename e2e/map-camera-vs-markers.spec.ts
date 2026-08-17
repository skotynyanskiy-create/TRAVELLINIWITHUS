import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';

/**
 * Diagnostica: la camera si muove? i marcatori la seguono?
 *
 * Nasce da uno stallo reale (2026-08-16). Verificando `/mappa` dopo il tetto di
 * densita', due misure oneste dicevano cose opposte: leggendo `map.getZoom()`
 * la camera zoomava correttamente, leggendo la posizione a schermo dei
 * marcatori questi non si muovevano di un pixel. Nessuno dei due sbagliava —
 * misuravano meta' del sistema a testa, e il difetto poteva stare proprio in
 * mezzo.
 *
 * Questo file misura **le due meta' nello stesso istante**, e senza strumentare
 * la pagina:
 *
 * - **camera** = impronta dei pixel del canvas WebGL. Se la vista cambia,
 *   cambiano i pixel. Non serve l'istanza della mappa, quindi la diagnosi non
 *   dipende da un aggancio di debug che qualcuno deve ricordarsi di lasciare.
 * - **marcatori** = posizione a schermo, seguendo un'**identita' stabile**
 *   (`aria-label`) e non «il primo marcatore»: il culling cambia l'insieme, e
 *   confrontare il primo di due insiemi diversi produce falsi negativi. E'
 *   l'errore che ha fatto perdere il primo giro di diagnosi.
 *
 * Legge le combinazioni cosi':
 *
 * | canvas | marcatori | lettura                                          |
 * | ------ | --------- | ------------------------------------------------ |
 * | cambia | seguono   | tutto a posto                                    |
 * | cambia | fermi     | i marcatori si sono staccati dalla camera        |
 * | fermo  | fermi     | l'input non arriva alla mappa, o e' bloccata     |
 * | fermo  | seguono   | impossibile: rileggere il metodo, non il codice  |
 *
 * Il controllo a riposo (§1) esiste perche' `projection="globe"` puo'
 * ridisegnare da solo: senza quella riga, «i pixel cambiano» non proverebbe
 * niente.
 */

const ZOOM_STEPS = 6;
const SETTLE_MS = 1100;

type Campione = {
  passo: string;
  improntaCanvas: string;
  marcatori: number;
  sonda: { x: number; y: number } | null;
};

function impronta(buffer: Buffer): string {
  return createHash('sha1').update(buffer).digest('hex').slice(0, 12);
}

test.describe('Mappa — la camera si muove e i marcatori la seguono', () => {
  test('zoom ripetuto: canvas e marcatori restano d’accordo', async ({ page }) => {
    const erroriConsole: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error') erroriConsole.push(m.text().slice(0, 160));
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/mappa', { waitUntil: 'domcontentloaded' });

    /* La mappa non si monta da sola: c'e' un consenso esplicito. */
    const attiva = page.getByRole('button', { name: /attiva la mappa/i });
    if (await attiva.count()) await attiva.first().click();

    const canvas = page.locator('.maplibregl-canvas');
    await canvas.waitFor({ state: 'visible', timeout: 20000 });
    await page.waitForTimeout(2500);

    /* La sonda e' un marcatore scelto per `aria-label`, non per posizione
       nell'insieme: deve sopravvivere al culling per essere confrontabile. */
    const etichettaSonda = await page.evaluate(() => {
      const m = [...document.querySelectorAll('.maplibregl-marker')]
        .map((el) => el.getAttribute('aria-label') || '')
        .filter(Boolean);
      return m[0] ?? null;
    });
    expect(etichettaSonda, 'nessun marcatore da usare come sonda').not.toBeNull();

    const leggi = async (passo: string): Promise<Campione> => {
      const improntaCanvas = impronta(await canvas.screenshot());
      const stato = await page.evaluate((etichetta) => {
        const tutti = [...document.querySelectorAll('.maplibregl-marker')];
        const sonda = tutti.find((el) => el.getAttribute('aria-label') === etichetta);
        const r = sonda?.getBoundingClientRect();
        return {
          marcatori: tutti.length,
          sonda: r ? { x: Math.round(r.left), y: Math.round(r.top) } : null,
        };
      }, etichettaSonda);
      return { passo, improntaCanvas, ...stato };
    };

    /* §1 — controllo a riposo: senza toccare niente, cambia da solo? */
    const riposoA = await leggi('riposo-a');
    await page.waitForTimeout(SETTLE_MS);
    const riposoB = await leggi('riposo-b');
    const disegnaDaSolo = riposoA.improntaCanvas !== riposoB.improntaCanvas;

    /* §2 — sei zoom, leggendo entrambe le meta' dopo ognuno. */
    const campioni: Campione[] = [riposoB];
    const zoomIn = page.locator('.maplibregl-ctrl-zoom-in');
    for (let i = 1; i <= ZOOM_STEPS; i++) {
      await zoomIn.click();
      await page.waitForTimeout(SETTLE_MS);
      campioni.push(await leggi(`zoom+${i}`));
    }

    const cambiCanvas = campioni.filter(
      (c, i) => i > 0 && c.improntaCanvas !== campioni[i - 1].improntaCanvas
    ).length;
    const spostamentiSonda = campioni.filter((c, i) => {
      if (i === 0 || !c.sonda || !campioni[i - 1].sonda) return false;
      const p = campioni[i - 1].sonda!;
      return Math.abs(c.sonda!.x - p.x) > 4 || Math.abs(c.sonda!.y - p.y) > 4;
    }).length;

    const verdetto =
      cambiCanvas > 0 && spostamentiSonda > 0
        ? 'OK — camera e marcatori si muovono insieme'
        : cambiCanvas > 0
          ? 'DIFETTO — la camera si muove, i marcatori NON la seguono'
          : spostamentiSonda > 0
            ? 'ANOMALIA DI METODO — marcatori mossi con canvas fermo: rileggere questo file'
            : 'DIFETTO — niente si muove: l’input non arriva alla mappa';

    console.log('\n--- mappa: camera vs marcatori ---');
    console.log(`sonda            : ${etichettaSonda}`);
    console.log(`ridisegna a riposo: ${disegnaDaSolo ? 'SI (impronta instabile da sola)' : 'no'}`);
    console.table(campioni);
    console.log(`cambi canvas su ${ZOOM_STEPS}: ${cambiCanvas}`);
    console.log(`spostamenti sonda su ${ZOOM_STEPS}: ${spostamentiSonda}`);
    console.log(`errori console: ${erroriConsole.length}`);
    erroriConsole.forEach((e) => console.log(`  - ${e}`));
    console.log(`VERDETTO: ${verdetto}\n`);

    /* **Si sospende solo l'assertion che dipende dal segnale rumoroso.**
       Se il canvas si ridisegna da solo (`projection="globe"` puo' farlo)
       l'impronta dei pixel non prova piu' che sia stata la camera a muoversi —
       ma la posizione a schermo di un marcatore seguito per `aria-label` resta
       attendibile lo stesso. Saltare l'intero test, come faceva prima, spegneva
       anche la prova buona: su una macchina dove il canvas e' sempre instabile
       il cancello non avrebbe mai verificato niente, restando verde. */
    if (disegnaDaSolo) {
      console.log('canvas instabile a riposo: salto la sola prova sull’impronta');
    } else {
      expect(cambiCanvas, 'la camera non risponde allo zoom').toBeGreaterThan(0);
    }

    expect(spostamentiSonda, 'i marcatori non seguono la camera').toBeGreaterThan(0);
    expect(erroriConsole, 'errori console durante lo zoom').toEqual([]);
  });

  /**
   * Il contratto di densita' dichiarato in `docs/50_Scratch/DESIGN_mappa-densita.md`:
   * un tetto di marcatori montati e un budget di nomi per larghezza. Sono i due
   * numeri che il corpus mettera' alla prova — oggi i posti sono ~109, l'import
   * ne porta centinaia — quindi vanno verificati da una macchina, non a occhio
   * una volta sola.
   */
  const budgetNomi = [
    { larghezza: 1280, altezza: 800, max: 8 },
    { larghezza: 768, altezza: 1024, max: 5 },
    { larghezza: 375, altezza: 812, max: 3 },
  ];

  for (const { larghezza, altezza, max } of budgetNomi) {
    test(`a ${larghezza}px i marcatori montati stanno sotto il tetto e i nomi entro ${max}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: larghezza, height: altezza });
      await page.goto('/mappa', { waitUntil: 'domcontentloaded' });
      const attiva = page.getByRole('button', { name: /attiva la mappa/i });
      if (await attiva.count()) await attiva.first().click();
      await page.locator('.maplibregl-canvas').waitFor({ state: 'visible', timeout: 20000 });
      await page.waitForTimeout(2500);

      const stato = await page.evaluate(() => {
        const tutti = [...document.querySelectorAll('.maplibregl-marker')];
        /* Un disco comincia col conteggio; un pin nominato no. Il punto nudo
           non ha testo affatto ed e' quello che regge la densita'. */
        const testo = tutti.map((el) => el.textContent?.trim() ?? '');
        return {
          montati: tutti.length,
          dischi: testo.filter((t) => /^\d/.test(t)).length,
          pinNominati: testo.filter((t) => t.length > 0 && !/^\d/.test(t)).length,
          puntiNudi: testo.filter((t) => t.length === 0).length,
        };
      });

      console.log(`[${larghezza}px]`, JSON.stringify(stato));
      expect(stato.montati, 'tetto di marcatori montati superato').toBeLessThanOrEqual(60);
      expect(stato.pinNominati, `budget nomi a ${larghezza}px superato`).toBeLessThanOrEqual(max);
    });
  }

  /**
   * Il CLS della mappa **caricata davvero**, che nessun altro cancello vede.
   *
   * `lighthouserc.json` misura `/mappa` col preset desktop e con un profilo
   * pulito a ogni giro: `src/pages/Mappa.tsx` monta `FullScreenMapExperience`
   * solo se il consenso marketing c'e' gia' (`canLoad('marketing')` letto
   * nell'inizializzatore di stato), quindi in CI **maplibre non si carica mai**
   * e il CLS misurato e' quello del segnaposto. Misurato forzando il consenso il
   * 2026-08-17: **0,0976** contro un tetto bloccante di 0,1 — passa per tre
   * millesimi, e nessuno lo stava guardando.
   *
   * Qui il consenso si concede perche' e' esattamente l'esperienza da misurare:
   * quella di chi accetta i cookie e vede la mappa.
   */
  test('il CLS della mappa caricata resta sotto il tetto bloccante', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/mappa', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem(
        'tw:consent',
        JSON.stringify({
          necessary: true,
          analytics: false,
          marketing: true,
          personalization: false,
          timestamp: 1755300000000,
          version: 1,
        })
      );
      sessionStorage.setItem('twu_gate_dismissed', '1');
    });

    await page.addInitScript(() => {
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((lista) => {
        for (const voce of lista.getEntries() as unknown as {
          value: number;
          hadRecentInput: boolean;
        }[]) {
          if (!voce.hadRecentInput) (window as unknown as { __cls: number }).__cls += voce.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('.maplibregl-canvas').waitFor({ state: 'visible', timeout: 25000 });
    await page.waitForTimeout(5000);

    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls ?? 0);
    const marcatori = await page.locator('.maplibregl-marker').count();
    console.log(`[cls mappa] ${cls.toFixed(4)} · marcatori montati: ${marcatori}`);

    /* Se la mappa non si e' caricata la misura non vale niente: senza questo il
       test resterebbe verde proprio nel caso che deve sorvegliare. */
    expect(
      marcatori,
      'la mappa non si e caricata: il CLS misurato non e quello vero'
    ).toBeGreaterThan(0);
    expect(cls, 'CLS della mappa oltre il tetto bloccante di CI').toBeLessThanOrEqual(0.1);
  });

  /**
   * Il deep-link e' l'unico modo in cui un link condiviso arriva a destinazione.
   * Con il raggruppamento il posto puo' nascere dentro un disco, quindi va
   * provato che la scheda si apra lo stesso.
   */
  test('un deep-link ?posto= apre la scheda anche se il posto sta in un gruppo', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/mappa?posto=campania-burton-juice', { waitUntil: 'domcontentloaded' });
    const attiva = page.getByRole('button', { name: /attiva la mappa/i });
    if (await attiva.count()) await attiva.first().click();
    await page.locator('.maplibregl-canvas').waitFor({ state: 'visible', timeout: 20000 });

    /* Si aspetta **la cosa che si verifica**, non un tempo indovinato.
       Con `waitForTimeout(3000)` questa prova passava 5 volte su 5 da sola e
       cadeva dentro la suite completa, dove la contesa di risorse allunga il
       volo della camera oltre i tre secondi: un cancello che sfarfalla e' peggio
       di nessun cancello, perche' insegna a ignorarlo. */
    await expect(
      page.locator('body'),
      'il deep-link non ha aperto il posto richiesto'
    ).toContainText(/burton/i, { timeout: 20000 });
    console.log('[deep-link] scheda del posto aperta');
  });
});
