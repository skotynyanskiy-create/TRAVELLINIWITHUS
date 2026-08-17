import { expect, test } from '@playwright/test';

/**
 * Passata meccanica su tutte le rotte pubbliche: overflow orizzontale, misura
 * dei controlli, ordine dei titoli, errori console.
 *
 * Nasce da un fallimento di metodo. Le stesse cose erano state chieste a un
 * agente su 19 rotte per 4 larghezze: si e' esaurito a meta' e ha restituito
 * una riga di avanzamento invece dei risultati. E i sei controlli sotto soglia
 * corretti finora erano stati trovati **a mano, uno alla volta**, guardando una
 * pagina per volta — ne restavano altri che nessuno aveva visto.
 *
 * Una passata come questa non va chiesta a un giudizio: va misurata una volta e
 * lasciata come cancello.
 *
 * **La soglia e' WCAG 2.5.8 AA, 24x24 CSS px.** I 44px del drawer mobile sono
 * una convenzione interna piu' severa, non un requisito: qui vengono contati e
 * mostrati, ma non fanno fallire niente — altrimenti il cancello direbbe
 * «rotto» su una scelta deliberata.
 */

const ROTTE = [
  '/',
  '/esplora',
  '/destinazione',
  '/mappa',
  '/chi-siamo',
  '/collaborazioni',
  '/media-kit',
  '/contatti',
  '/risorse',
  '/club',
  '/itinerari',
  '/shop',
  '/family',
  '/posto/campania-burton-juice',
  '/posto/verona-vigna-benini',
  '/posto/shanghai-disneyland',
  '/privacy',
  '/cookie',
  '/termini',
  '/disclaimer',
];

const LARGHEZZE = [
  { w: 320, h: 800 },
  { w: 375, h: 812 },
  { w: 768, h: 1024 },
  { w: 1280, h: 800 },
];

const SOGLIA_AA = 24;

test.describe('Rotte pubbliche — overflow, controlli, titoli', () => {
  for (const { w, h } of LARGHEZZE) {
    test(`a ${w}px nessuna rotta scorre in orizzontale e nessun controllo sta sotto ${SOGLIA_AA}px`, async ({
      page,
    }) => {
      test.setTimeout(180_000);
      await page.setViewportSize({ width: w, height: h });

      const overflow: string[] = [];
      const sottoSoglia: string[] = [];
      const titoli: string[] = [];
      const consoleRotte: string[] = [];
      let banda24_44 = 0;

      for (const rotta of ROTTE) {
        const errori: string[] = [];
        const onErr = (m: import('@playwright/test').ConsoleMessage) => {
          if (m.type() === 'error') errori.push(m.text().slice(0, 100));
        };
        page.on('console', onErr);

        await page.goto(rotta, { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => {
          localStorage.setItem(
            'tw:consent',
            JSON.stringify({
              necessary: true,
              analytics: false,
              marketing: false,
              personalization: false,
              timestamp: 1755300000000,
              version: 1,
            })
          );
          sessionStorage.setItem('twu_gate_dismissed', '1');
        });
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(900);

        const esito = await page.evaluate((soglia) => {
          const vw = document.documentElement.clientWidth;

          /* Un antenato che scorre di proposito (caroselli, strisce di chip) non
             e' overflow di pagina: la misura giusta e' sul documento. */
          const scorrimentoPagina = document.documentElement.scrollWidth - vw;

          /* `sr-only` non e' `display:none`: e' un ritaglio a 1x1px con
             `clip-path`, quindi un controllo per-solo-lettori-di-schermo passa
             qualunque test di visibilita' ingenuo e viene poi contato come
             «bersaglio da 1x1». Il salto al contenuto e' esattamente questo, e
             finiva in cima all'elenco dei difetti su tutte e venti le rotte.
             WCAG 2.5.8 esclude i controlli non visibili: qui vanno esclusi
             davvero, non solo quelli con `display:none`. */
          const soloPerLettoriDiSchermo = (el: Element) => {
            const s = getComputedStyle(el);
            const c = s.clipPath;
            return (
              (c !== 'none' && /inset\(50%|rect\(/.test(c)) ||
              (Math.round(el.getBoundingClientRect().width) <= 1 &&
                Math.round(el.getBoundingClientRect().height) <= 1)
            );
          };

          const visibile = (el: Element) => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return false;
            const s = getComputedStyle(el);
            if (s.visibility === 'hidden' || s.display === 'none') return false;
            return !soloPerLettoriDiSchermo(el);
          };

          /* Fuori: elementi dentro un contenitore `fixed` traslato via — i
             drawer chiusi, che esistono nel DOM ma non sono raggiungibili. */
          const dentroUnDrawerChiuso = (el: Element) => {
            let n: Element | null = el;
            while (n && n !== document.body) {
              const s = getComputedStyle(n);
              if (s.position === 'fixed' && /translate/.test(s.transform || '')) {
                const r = n.getBoundingClientRect();
                if (r.left >= vw || r.right <= 0) return true;
              }
              n = n.parentElement;
            }
            return false;
          };

          const controlli = [...document.querySelectorAll('a[href], button, input, select')].filter(
            (e) => visibile(e) && !dentroUnDrawerChiuso(e)
          );

          const piccoli: { t: string; w: number; h: number }[] = [];
          let banda = 0;
          for (const c of controlli) {
            const r = c.getBoundingClientRect();
            const lato = Math.min(r.width, r.height);
            /* I link dentro un paragrafo sono esentati da WCAG 2.5.8: la loro
               area la decide il testo che li contiene. */
            const inLineaNelTesto = !!c.closest('p, li') && c.tagName === 'A';
            if (lato < soglia && !inLineaNelTesto) {
              piccoli.push({
                t: (c.textContent || c.getAttribute('aria-label') || '?').trim().slice(0, 32),
                w: Math.round(r.width),
                h: Math.round(r.height),
              });
            } else if (lato < 44) banda++;
          }

          const livelli = [...document.querySelectorAll('h1,h2,h3,h4')].map((e) =>
            Number(e.tagName[1])
          );
          const h1 = livelli.filter((l) => l === 1).length;
          let salto: string | null = null;
          for (let i = 1; i < livelli.length; i++) {
            if (livelli[i] - livelli[i - 1] > 1) {
              salto = `h${livelli[i - 1]} → h${livelli[i]}`;
              break;
            }
          }
          return { scorrimentoPagina, piccoli, banda, h1, salto };
        }, SOGLIA_AA);

        page.off('console', onErr);

        if (esito.scorrimentoPagina > 1) overflow.push(`${rotta}: +${esito.scorrimentoPagina}px`);
        for (const p of esito.piccoli) sottoSoglia.push(`${rotta} · «${p.t}» ${p.w}×${p.h}`);
        banda24_44 += esito.banda;
        if (esito.h1 !== 1) titoli.push(`${rotta}: ${esito.h1} h1`);
        if (esito.salto) titoli.push(`${rotta}: salto ${esito.salto}`);
        if (errori.length) consoleRotte.push(`${rotta}: ${errori[0]}`);
      }

      console.log(`\n──── ${w}px · ${ROTTE.length} rotte ────`);
      console.log(`overflow di pagina : ${overflow.length}`);
      overflow.forEach((o) => console.log(`   ${o}`));
      console.log(`controlli < ${SOGLIA_AA}px : ${sottoSoglia.length}`);
      [...new Set(sottoSoglia)].slice(0, 25).forEach((s) => console.log(`   ${s}`));
      console.log(`controlli fra 24 e 44px (convenzione, non requisito): ${banda24_44}`);
      console.log(`problemi di titolo : ${titoli.length}`);
      titoli.forEach((t) => console.log(`   ${t}`));
      console.log(`rotte con errori console : ${consoleRotte.length}`);
      consoleRotte.forEach((c) => console.log(`   ${c}`));

      expect(overflow, 'rotte che scorrono in orizzontale').toEqual([]);
      expect([...new Set(sottoSoglia)], `controlli sotto ${SOGLIA_AA}×${SOGLIA_AA}`).toEqual([]);
      expect(titoli, 'gerarchia dei titoli').toEqual([]);
      expect(consoleRotte, 'errori console').toEqual([]);
    });
  }
});
