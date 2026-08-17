import type { LucideIcon } from 'lucide-react';
import { ArrowDown, ArrowRight, Baby, FileText, Map } from 'lucide-react';
import type { Audience } from '../context/AudienceContext';

/**
 * L'apertura della home, una per edizione.
 *
 * Fino al 2026-08-17 l'hero era uno solo: chi entrava come Family leggeva la
 * frase dei viaggiatori, e il primo schermo — quello che decide — era l'unico
 * pezzo cieco al pubblico, mentre tutto il resto della home cambiava già.
 *
 * **Cambiano solo titolo, sommario e le due azioni.** Struttura, fotografia,
 * chip, post-it e barra delle prove restano identici: sono la firma del sito, e
 * tenerli fermi e' anche cio' che protegge il vincolo qui sotto.
 *
 * ## Due vincoli, e non sono stilistici
 *
 * 1. **Il titolo occupa tre righe rese, in tutte e tre le edizioni.** Sono due
 *    segmenti — il tondo, un `<br />`, il corsivo nell'accento — ma il tondo ne
 *    riempie due e il corsivo una. Il vincolo vero e' che **il corsivo stia su
 *    una riga sola**: se va a capo, l'apertura passa a quattro righe e diventa
 *    63px piu' alta delle altre, con l'ultima parola orfana su una riga quasi
 *    vuota (`text-balance` non lo salva, perche' non bilancia attraverso il
 *    `<br />`).
 *
 *    Tetto **misurato a 1280px, non stimato**: il corsivo di `viaggiatori` sta
 *    su una riga con 20 caratteri, e con 23 e 26 andava a capo. Da qui il
 *    tetto prudente di **21 caratteri sul corsivo** e ~29 sul tondo. Chi
 *    aggiunge una variante **rimisura**: la stima che stava scritta qui prima
 *    diceva 26 e produceva quattro righe su due edizioni su tre.
 * 2. **`viaggiatori` non si tocca.** `scripts/generate-route-html.js` inietta
 *    solo `<head>`: il corpo lo rende il client, che senza `localStorage` cade
 *    sempre sul default. Quindi **la variante che i crawler vedono e' questa**,
 *    ed e' l'unica allineata alla meta di `/` in `routeMeta.ts`. Il difetto era
 *    che le altre due se la prendevano in prestito: si chiude togliendo il
 *    prestito, non riscrivendo l'originale.
 *
 * Le azioni puntano solo a destinazioni che esistono gia'. La primaria di
 * `viaggiatori` e' un'ancora nella pagina, le altre due sono rotte: per questo
 * la prima porta una freccia in giu' e le altre una a destra.
 */
export interface HeroEdizione {
  /** Prima riga dell'H1, in tondo. Tetto 32 caratteri. */
  titoloTondo: string;
  /** Seconda riga dell'H1, in corsivo sull'accento. Tetto 26 caratteri. */
  titoloCorsivo: string;
  sommario: string;
  primaria: { testo: string; href: string; ancora: boolean; icona: LucideIcon };
  secondaria: { testo: string; href: string; icona: LucideIcon };
}

export const HERO_PER_EDIZIONE: Record<Audience, HeroEdizione> = {
  viaggiatori: {
    titoloTondo: 'Posti che sembrano inventati.',
    titoloCorsivo: 'Ma esistono davvero.',
    sommario:
      'Siamo Rodrigo e Betta. Prima ci andiamo, poi qui trovate il reel girato sul posto, il costo quando lo conosciamo e sempre a che titolo ci siamo andati.',
    primaria: { testo: "Guarda l'indice", href: '#indice-vivo', ancora: true, icona: ArrowDown },
    secondaria: { testo: 'Vai alla mappa', href: '/mappa', icona: Map },
  },
  family: {
    /* Ogni dettaglio del sommario e' nel seed: certificato dopo la 28a
       settimana, cintura sotto il pancione, borsa pronta
       (`src/data/family-content-seed.json`). L'ultima frase dichiara il limite
       invece di aggirarlo — col piccolo non ci siamo ancora andati, e senza
       quella riga l'apertura prometterebbe contenuti che non esistono.
       Nessuna settimana e nessuna data: scadono da sole. */
    titoloTondo: 'Viaggiare incinta si può.',
    titoloCorsivo: 'Con un foglio in più.',
    sommario:
      'Il certificato dopo la 28ª settimana, la cintura sotto il pancione, la borsa pronta. Sono i consigli che stiamo usando adesso: col piccolo non ci siamo ancora andati.',
    primaria: {
      testo: 'Consigli dal pancione',
      href: '/family/consigli',
      ancora: false,
      icona: ArrowRight,
    },
    secondaria: { testo: 'Da dove iniziare', href: '/family', icona: Baby },
  },
  brand: {
    /* Non ripete la disclosure: la dice gia' il claim subito sotto («32 dei 79
       posti…») e la ridice la barra delle prove dentro l'hero. Tre volte lo
       stesso argomento in una schermata lo indebolisce. */
    titoloTondo: 'Un reel girato sul posto.',
    titoloCorsivo: 'E la scheda resta.',
    sommario:
      'Lavoriamo con hotel, strutture e territori. Il reel esce sui social, il posto resta qui con la sua scheda: due cose diverse, e la seconda non scade.',
    primaria: {
      testo: 'Come lavoriamo',
      href: '/collaborazioni',
      ancora: false,
      icona: ArrowRight,
    },
    secondaria: { testo: 'Il media kit', href: '/media-kit', icona: FileText },
  },
};
