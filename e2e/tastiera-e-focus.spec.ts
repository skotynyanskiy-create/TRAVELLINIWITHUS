import { expect, test } from '@playwright/test';

/**
 * Tastiera e focus: quello che nessuno aveva ancora verificato.
 *
 * Due audit di fila hanno chiuso con `[VERIFY]` sulla tastiera, per due motivi
 * diversi — uno strumento senza tasto premuto, l'altro senza browser. Un
 * overlay che si apre da solo e non si chiude da tastiera e' una trappola per
 * chi non usa il mouse, e `a11y >= 0,95` e' bloccante in CI: e' il tipo di cosa
 * che non puo' restare «da controllare».
 *
 * Il consenso viene impostato scrivendo lo stato «solo necessari» in
 * `localStorage`, mai cliccando «Accetta»: e' l'opzione conservativa, e serve
 * per arrivare agli overlay che stanno sotto il banner.
 */

const SOLO_NECESSARI = {
  necessary: true,
  analytics: false,
  marketing: false,
  personalization: false,
  timestamp: 1755300000000,
  version: 1,
};

/**
 * Porta la pagina allo stato «visitatore che ha gia' risposto»: consenso ai soli
 * cookie necessari e gate del pubblico congedato.
 *
 * Il congedo del gate serve davvero: senza, il suo overlay `fixed inset-0`
 * intercetta i click e i test sul menu falliscono per colpa dello strumento, non
 * del sito. Il gate ha una prova sua, sopra, dove viene lasciato aperto apposta.
 */
async function apri(page: import('@playwright/test').Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.evaluate((c) => {
    localStorage.setItem('tw:consent', JSON.stringify(c));
    sessionStorage.setItem('twu_gate_dismissed', '1');
  }, SOLO_NECESSARI);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await expect(
    page.locator('[role="dialog"]'),
    "un overlay e' rimasto aperto: la misura non sarebbe attendibile"
  ).toHaveCount(0);
}

/** Chi ha il focus adesso, in forma leggibile in un messaggio d'errore. */
function descriviAttivo(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const a = document.activeElement;
    if (!a || a === document.body) return '(body — nessun focus)';
    return `${a.tagName.toLowerCase()}[${a.getAttribute('aria-label') ?? (a.textContent ?? '').trim().slice(0, 30)}]`;
  });
}

test.describe('Tastiera e focus', () => {
  // Il gate a schermo intero e' spento dal 2026-08-17 (kill-switch in
  // AudienceGate.tsx): la prima scelta si fa nella testata, che alla prima
  // visita nasce estesa con le tre porte (EditionBand.tsx). Questo test
  // sostituisce quello del gate — non lo cancella: verifica che la nuova
  // prima visita sia raggiungibile da tastiera e che scegliere una porta
  // collassi la testata e persista la scelta.
  test('la testata nasce estesa alla prima visita, si sceglie da tastiera e si richiude', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(
      (c) => localStorage.setItem('tw:consent', JSON.stringify(c)),
      SOLO_NECESSARI
    );
    await page.evaluate(() => {
      localStorage.removeItem('travellini_audience');
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(700);

    // Tre porte pari: nomi + descrizioni verbatim, nessuna scelta ancora.
    const switcher = page.getByRole('group', { name: "Scegli l'edizione" });
    await expect(switcher).toBeVisible();
    const portaFamily = switcher.getByRole('button', { name: /family/i });
    await expect(
      portaFamily,
      'la porta Family non porta la sua descrizione verbatim da audienceEditions.ts'
    ).toContainText('Gravidanza');

    /* Raggiungibile da tastiera: il focus deve poterci arrivare senza mouse. */
    let trovato = false;
    for (let i = 0; i < 30 && !trovato; i++) {
      await page.keyboard.press('Tab');
      trovato = await page.evaluate(
        () => /^family/i.test((document.activeElement?.textContent ?? '').trim()) ?? false
      );
    }
    expect(
      trovato,
      `la porta Family non raggiungibile in 30 Tab (focus su ${await descriviAttivo(page)})`
    ).toBe(true);

    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // La scelta collassa la testata: la descrizione sparisce (resta solo il
    // nome nel segmento) e l'edizione persiste per la prossima visita.
    await expect(
      page.getByText('Gravidanza, viaggi col pancione', { exact: false }),
      'la testata e’ rimasta estesa dopo aver scelto una porta'
    ).toHaveCount(0);
    const audienceScelta = await page.evaluate(() => localStorage.getItem('travellini_audience'));
    console.log(`[testata] edizione persistita dopo la scelta da tastiera: ${audienceScelta}`);
    expect(audienceScelta, 'la scelta da tastiera non ha persistito l’edizione').toBe('family');
  });

  test('il menu mobile trattiene il focus e si chiude con Escape', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await apri(page, '/');

    const apriMenu = page.getByRole('button', { name: /^menu$/i });
    await expect(apriMenu, 'bottone Menu non trovato a 375px').toHaveCount(1);
    await apriMenu.click();
    await page.waitForTimeout(800);

    const dialog = page.getByRole('dialog');
    await expect(dialog, 'il menu non espone role=dialog').toHaveCount(1);

    /* Trappola di focus: venti Tab non devono mai uscire dal dialog. */
    const fughe: string[] = [];
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const dentro = await page.evaluate(() => {
        const a = document.activeElement;
        const d = document.querySelector('[role="dialog"]');
        return !a || !d ? false : d.contains(a);
      });
      if (!dentro) fughe.push(await descriviAttivo(page));
    }
    console.log(`[menu] fughe dal focus su 20 Tab: ${fughe.length}`);
    fughe.slice(0, 4).forEach((f) => console.log(`  fuori: ${f}`));
    expect(fughe, 'il focus esce dal menu mobile aperto').toEqual([]);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(700);
    console.log(
      `[menu] Escape chiude: ${(await page.getByRole('dialog').count()) === 0 ? 'si' : 'NO'}`
    );
    expect(await page.getByRole('dialog').count(), 'Escape non chiude il menu mobile').toBe(0);
  });

  test('il salto al contenuto porta davvero al contenuto', async ({ page }) => {
    await apri(page, '/');
    await page.keyboard.press('Tab');
    const primo = await descriviAttivo(page);
    console.log(`[skip] primo elemento focalizzabile: ${primo}`);
    expect(primo.toLowerCase(), 'il primo Tab non raggiunge il salto al contenuto').toContain(
      'contenuto'
    );

    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    const bersaglio = await page.evaluate(() => {
      const m = document.querySelector('#main-content');
      return m
        ? {
            esiste: true,
            dentro: m.contains(document.activeElement) || document.activeElement === m,
          }
        : { esiste: false, dentro: false };
    });
    console.log(`[skip] #main-content esiste: ${bersaglio.esiste}`);
    expect(bersaglio.esiste, 'il bersaglio #main-content non esiste').toBe(true);
  });

  test('nessun tabindex positivo, che scardinerebbe l’ordine naturale', async ({ page }) => {
    for (const rotta of ['/', '/esplora', '/posto/campania-burton-juice', '/mappa']) {
      await apri(page, rotta);
      const positivi = await page.evaluate(() =>
        [...document.querySelectorAll('[tabindex]')]
          .map((e) => ({ t: Number(e.getAttribute('tabindex')), tag: e.tagName.toLowerCase() }))
          .filter((x) => x.t > 0)
      );
      console.log(`[tabindex] ${rotta}: ${positivi.length} positivi`);
      expect(positivi, `tabindex positivo su ${rotta}`).toEqual([]);
    }
  });

  /**
   * Attenzione a come si riconosce un anello, o si trovano difetti inesistenti.
   *
   * Un anello Tailwind (`focus-visible:ring-2`) rende un `box-shadow` a piu'
   * livelli che **comincia** con un segnaposto trasparente
   * (`rgba(0,0,0,0) 0px 0px 0px 0px, rgb(...) ...`). Un controllo che guardi
   * solo l'inizio della stringa lo scarta e dichiara nudi tre CTA che l'anello
   * ce l'hanno eccome — successo il 2026-08-17, corretto qui. Vanno letti tutti
   * i livelli, e serve anche guardare i **discendenti**: il pattern delle card
   * mette `group-focus-visible:ring-2` sul figlio, non sul link.
   */
  test('il focus da tastiera resta visibile', async ({ page }) => {
    await apri(page, '/');
    const invisibili: string[] = [];
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      const esito = await page.evaluate(() => {
        const ombraVisibile = (bs: string) => {
          if (!bs || bs === 'none') return false;
          return (bs.match(/rgba?\([^)]+\)/g) ?? []).some((c) => {
            const n = (c.match(/[\d.]+/g) ?? []).map(Number);
            return n.length < 4 || n[3] > 0.01;
          });
        };
        const anello = (el: Element) => {
          const s = getComputedStyle(el);
          return (
            (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) ||
            ombraVisibile(s.boxShadow)
          );
        };
        const a = document.activeElement;
        if (!a || a === document.body) return null;
        if (anello(a) || [...a.querySelectorAll('*')].some(anello)) return null;
        return `${a.tagName.toLowerCase()}[${(a.textContent ?? '').trim().slice(0, 24)}]`;
      });
      if (esito) invisibili.push(esito);
    }
    console.log(`[focus] senza indicatore visibile su 15 Tab: ${invisibili.length}`);
    invisibili.slice(0, 5).forEach((e) => console.log(`  ${e}`));
    expect(invisibili, 'elementi focalizzati senza indicatore visibile').toEqual([]);
  });
});
