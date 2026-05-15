import type { ArticleData } from '../components/article';
import { DEMO_ARTICLE_SLUG } from './demoContent';
import { DEMO_ARCHIVE_SEEDS } from './demoArchive';

type PreviewArticle = ArticleData & { id: string; slug: string; excerpt: string };

/**
 * Builder per preview articles a partire dai seed di demoArchive.
 * Genera body breve coerente con l'header (location, periodo, budget),
 * mantenendo tutte le sezioni che il componente Articolo si aspetta:
 * highlights, tips, packingList, mapMarkers, mapCenter, mapZoom.
 *
 * Sostituzione hot-swap: quando R+B pubblica l'articolo reale su Firestore
 * con lo stesso slug, fetchArticleBySlug torna l'articolo Firestore e questa
 * preview non viene piu' usata.
 */
function buildPreviewFromSeed(seed: (typeof DEMO_ARCHIVE_SEEDS)[number]): PreviewArticle {
  const body = `\nQuesta e' una anteprima editoriale di **${seed.title}** — l'articolo definitivo arriva quando R+B pubblicano il contenuto reale, con foto originali e dettagli verificati sul posto.\n\n## Perche' andarci\n\n${seed.excerpt}\n\n## Cosa sapere prima\n\nPeriodo consigliato: ${seed.period}. Budget orientativo a testa: fascia ${seed.budget}. Durata ottimale: ${seed.duration}.\n\n## Dove ci troviamo\n\n${[seed.country, seed.region, seed.city].filter(Boolean).join(' / ')}. Coordinate area: ${seed.coordinates[1].toFixed(3)}° N, ${seed.coordinates[0].toFixed(3)}° E.\n\n## Cosa aspettarsi dall'articolo definitivo\n\nQuando R+B chiudono il sopralluogo, questa pagina ospitera':\n\n- itinerario giorno-per-giorno con tempi reali\n- indirizzi food selezionati e testati\n- alloggi per fascia di prezzo, con criterio di scelta\n- consigli pratici per evitare gli errori da prima volta\n- mappa interattiva con tappe e deviazioni utili\n\nIntanto, se l'intenzione e' chiara, salva la pagina e iscriviti alla newsletter: ti avvisiamo appena la guida diventa reale.\n`;
  return {
    id: seed.slug,
    slug: seed.slug,
    title: seed.title,
    category: seed.category,
    image: seed.image,
    excerpt: seed.excerpt,
    description: seed.excerpt,
    location: [seed.country, seed.region, seed.city].filter(Boolean).join(', '),
    period: seed.period,
    budget: seed.budget,
    duration: seed.duration,
    readTime: seed.readTime,
    date: '15 maggio 2026',
    author: 'Rodrigo & Betta',
    continent: seed.continent,
    content: body,
    highlights: [
      `${seed.experienceTypes[0]} come filo conduttore`,
      `Periodo consigliato: ${seed.period}`,
      `Durata ottimale: ${seed.duration}`,
    ],
    tips: [
      'Salva la pagina e torna quando R+B avranno aggiornato con foto reali.',
      'Iscriviti alla newsletter per ricevere la guida appena pubblicata.',
      'Se hai già esperienza del posto, scrivici: leggiamo tutte le mail.',
    ],
    packingList: ['Macchina fotografica', 'Mappe offline', 'Tempo per non correre'],
    mapMarkers: [
      {
        id: seed.slug,
        name: seed.city || seed.region || seed.country,
        coordinates: seed.coordinates,
        title: seed.title,
        category: seed.experienceTypes[0],
      },
    ],
    mapCenter: seed.coordinates,
    mapZoom: 6,
    isMarkdown: true,
  };
}

const SEED_PREVIEWS: Record<string, PreviewArticle> = DEMO_ARCHIVE_SEEDS.reduce(
  (acc, seed) => {
    // dolomiti-rifugi-design ha gia' una preview manuale piu' ricca sotto;
    // evita override automatico.
    if (seed.slug === DEMO_ARTICLE_SLUG) return acc;
    acc[seed.slug] = buildPreviewFromSeed(seed);
    return acc;
  },
  {} as Record<string, PreviewArticle>
);

export const PREVIEW_ARTICLES: Record<string, PreviewArticle> = {
  ...SEED_PREVIEWS,
  [DEMO_ARTICLE_SLUG]: {
    id: DEMO_ARTICLE_SLUG,
    slug: DEMO_ARTICLE_SLUG,
    title: 'Dolomiti: rifugi di design e sentieri da salvare',
    category: 'Guide',
    image: '/images/destinations/dolomiti.webp',
    excerpt:
      'Una preview editoriale per mostrare come potranno vivere insieme atmosfera, informazioni pratiche e selezione Travelliniwithus.',
    description:
      'Una guida preview tra rifugi contemporanei, panorami forti e scelte pratiche per immaginare un weekend sulle Dolomiti senza trasformarlo in una lista generica.',
    location: 'Trentino-Alto Adige, Italia',
    period: 'Giugno - ottobre',
    budget: 'Medio',
    duration: '3 giorni',
    readTime: '8 min',
    date: '17 marzo 2026',
    author: 'Rodrigo & Betta',
    continent: 'Europa',
    content: `
Questa preview mostra la direzione editoriale del sito: non un diario generico, ma una guida costruita per capire se un posto merita davvero il viaggio.

## Perché andarci

Le Dolomiti funzionano quando il viaggio non viene ridotto a una foto panoramica. Il valore sta nel ritmo: una salita fatta con calma, un rifugio scelto bene, un punto dove fermarsi prima che arrivi la folla.

## Cosa sapere prima

La finestra migliore va da giugno a ottobre. Luglio e agosto sono più pieni, quindi conviene prenotare rifugi e alloggi con anticipo. Settembre è spesso il mese più equilibrato per luce, temperature e tranquillità.

## Quando andare

Se vuoi camminare senza stress, evita le ore centrali sui sentieri più famosi. Alba e tardo pomeriggio restituiscono una montagna più silenziosa e più adatta anche ai contenuti visual.

## Come arrivare

Per un weekend breve ha senso muoversi in auto e costruire una base unica, invece di cambiare alloggio ogni notte. Questo riduce tempi morti e rende più facile scegliere percorsi coerenti.

## Consiglio Travellini

Non cercare di vedere tutto. Scegli una valle, due punti forti e un margine per fermarti. Un viaggio più corto ma leggibile resta molto più memorabile.
`,
    highlights: [
      'Rifugi con architettura contemporanea e vista aperta',
      'Sentieri panoramici gestibili in un weekend',
      "Periodo e ritmo pensati per evitare l'effetto checklist",
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivo e prima luce',
        description:
          'Base in valle, passeggiata breve e cena semplice per entrare nel ritmo senza bruciare subito energie.',
      },
      {
        day: 2,
        title: 'Rifugio e sentiero principale',
        description:
          'Giornata piena dedicata al percorso più scenografico, con pausa lunga in rifugio e rientro prima del buio.',
      },
      {
        day: 3,
        title: 'Lago o belvedere finale',
        description:
          'Ultima tappa leggera prima del rientro, scelta in base a meteo, luce e traffico.',
      },
    ],
    tips: [
      'Prenota in anticipo se viaggi nei weekend tra luglio e settembre.',
      'Tieni una alternativa breve per i cambi meteo improvvisi.',
      'Scarica mappe offline: in quota la connessione non è sempre affidabile.',
    ],
    packingList: [
      'Scarpe da trekking già usate',
      'Giacca antivento leggera',
      'Borraccia o thermos',
      'Power bank e mappe offline',
    ],
    mapMarkers: [
      {
        id: 'dolomiti-preview',
        name: 'Area Dolomiti preview',
        title: 'Dolomiti',
        category: 'Guida preview',
        coordinates: [11.8598, 46.4102],
      },
    ],
    mapCenter: [11.8598, 46.4102],
    mapZoom: 7,
    isMarkdown: true,
  },
  'weekend-borgo-lento': {
    id: 'weekend-borgo-lento',
    slug: 'weekend-borgo-lento',
    title: 'Weekend lento in un borgo: come sceglierlo bene',
    category: 'Guide',
    image: '/images/destinations/puglia.webp',
    excerpt:
      'Una guida preview per trasformare il classico weekend in borgo in una scelta più consapevole, utile e meno casuale.',
    description:
      'Criteri pratici per scegliere un borgo che abbia davvero senso: accessibilità, atmosfera, cibo, ritmo e cose da fare senza correre.',
    location: 'Italia',
    period: 'Primavera e autunno',
    budget: 'Accessibile',
    duration: '2 giorni',
    readTime: '6 min',
    date: '10 aprile 2026',
    author: 'Rodrigo & Betta',
    continent: 'Europa',
    content: `
Un borgo non basta fotografarlo. Per diventare un buon weekend deve avere ritmo, accoglienza e almeno un motivo vero per restare oltre la passeggiata principale.

## Perché andarci

Il weekend lento funziona quando riduce attriti: arrivo semplice, distanze brevi, una buona tavola e qualche deviazione interessante intorno.

## Cosa valutare

Prima di scegliere guarda tre cose: parcheggio o stazione, orari reali di ristoranti e botteghe, presenza di percorsi brevi nei dintorni. Se tutto vive solo in alta stagione, serve cautela.

## Quando andare

Primavera e autunno sono spesso migliori dell'estate. Meno folla, luce più morbida e prezzi più sensati.

## Consiglio Travellini

Scegli un posto dove puoi fare meno, ma farlo meglio: una trattoria, un belvedere, un indirizzo artigiano, una camminata breve.
`,
    highlights: [
      'Criteri concreti per non scegliere solo da una foto',
      'Ritmo adatto a coppie e weekend brevi',
      'Focus su food, camminate leggere e atmosfera',
    ],
    tips: [
      'Controlla sempre gli orari aggiornati dei locali.',
      'Evita borghi bellissimi ma troppo isolati se hai solo una notte.',
      'Cerca un secondo punto vicino per evitare un viaggio troppo monotematico.',
    ],
    packingList: ['Scarpe comode', 'Giacca leggera', 'Prenotazioni salvate offline'],
    isMarkdown: true,
  },
  'guida-prima-di-prenotare': {
    id: 'guida-prima-di-prenotare',
    slug: 'guida-prima-di-prenotare',
    title: 'Prima di prenotare: la checklist Travellini',
    category: 'Guide',
    image: '/images/brand/about-editorial.webp',
    excerpt:
      'Una preview di checklist editoriale per capire se una destinazione è coerente con tempo, budget e aspettative.',
    description:
      'Domande semplici ma decisive da farsi prima di prenotare un viaggio, per evitare scelte belle online ma deboli nella pratica.',
    location: 'Metodo di viaggio',
    period: "Tutto l'anno",
    budget: 'Variabile',
    duration: 'Checklist',
    readTime: '5 min',
    date: '2 aprile 2026',
    author: 'Rodrigo & Betta',
    content: `
La scelta migliore non è sempre quella più spettacolare. È quella che regge il tempo che hai, il budget reale e il tipo di energia che vuoi portare nel viaggio.

## Perché usarla

Prima di prenotare conviene verificare se la destinazione è davvero compatibile con giorni, spostamenti, stagione e aspettative.

## Le domande base

Quanto tempo perdo negli spostamenti? Cosa succede se piove? Ho almeno due motivi forti per scegliere questo posto? Il budget resta sensato anche nei costi nascosti?

## Errori da evitare

Prenotare solo per una foto, sottovalutare distanze, ignorare stagionalità e accumulare troppe tappe in pochi giorni.
`,
    highlights: [
      'Domande pratiche prima di acquistare voli o hotel',
      'Riduce itinerari troppo pieni',
      'Aiuta a scegliere destinazioni coerenti',
    ],
    tips: [
      'Controlla sempre il tempo reale degli spostamenti, non solo i chilometri.',
      'Prepara un piano B meteo.',
      'Lascia almeno un margine libero nel programma.',
    ],
    packingList: ['Note salvate', 'Budget indicativo', 'Mappa offline'],
    isMarkdown: true,
  },
};

export const PREVIEW_GUIDES = Object.values(PREVIEW_ARTICLES).map((article) => ({
  id: article.id,
  slug: article.slug,
  title: article.title,
  category: article.category,
  image: article.image,
  excerpt: article.excerpt,
  readTime: article.readTime,
  createdAt: article.date,
}));
