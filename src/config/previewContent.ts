import type { ArticleData } from '../components/article';
import { DEMO_ARTICLE_SLUG } from './demoContent';

export const PREVIEW_ARTICLES: Record<string, ArticleData & { id: string; slug: string; excerpt: string }> = {
  [DEMO_ARTICLE_SLUG]: {
    id: DEMO_ARTICLE_SLUG,
    slug: DEMO_ARTICLE_SLUG,
    title: 'Dolomiti: rifugi di design e sentieri da salvare',
    category: 'Guide',
    image:
      'https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=2000&auto=format&fit=crop',
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

## Perche andarci

Le Dolomiti funzionano quando il viaggio non viene ridotto a una foto panoramica. Il valore sta nel ritmo: una salita fatta con calma, un rifugio scelto bene, un punto dove fermarsi prima che arrivi la folla.

## Cosa sapere prima

La finestra migliore va da giugno a ottobre. Luglio e agosto sono piu pieni, quindi conviene prenotare rifugi e alloggi con anticipo. Settembre e spesso il mese piu equilibrato per luce, temperature e tranquillita.

## Quando andare

Se vuoi camminare senza stress, evita le ore centrali sui sentieri piu famosi. Alba e tardo pomeriggio restituiscono una montagna piu silenziosa e piu adatta anche ai contenuti visual.

## Come arrivare

Per un weekend breve ha senso muoversi in auto e costruire una base unica, invece di cambiare alloggio ogni notte. Questo riduce tempi morti e rende piu facile scegliere percorsi coerenti.

## Consiglio Travellini

Non cercare di vedere tutto. Scegli una valle, due punti forti e un margine per fermarti. Un viaggio piu corto ma leggibile resta molto piu memorabile.
`,
    highlights: [
      'Rifugi con architettura contemporanea e vista aperta',
      'Sentieri panoramici gestibili in un weekend',
      'Periodo e ritmo pensati per evitare l effetto checklist',
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
          'Giornata piena dedicata al percorso piu scenografico, con pausa lunga in rifugio e rientro prima del buio.',
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
      'Scarica mappe offline: in quota la connessione non e sempre affidabile.',
    ],
    packingList: [
      'Scarpe da trekking gia usate',
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
    image:
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Una guida preview per trasformare il classico weekend in borgo in una scelta piu consapevole, utile e meno casuale.',
    description:
      'Criteri pratici per scegliere un borgo che abbia davvero senso: accessibilita, atmosfera, cibo, ritmo e cose da fare senza correre.',
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

## Perche andarci

Il weekend lento funziona quando riduce attriti: arrivo semplice, distanze brevi, una buona tavola e qualche deviazione interessante intorno.

## Cosa valutare

Prima di scegliere guarda tre cose: parcheggio o stazione, orari reali di ristoranti e botteghe, presenza di percorsi brevi nei dintorni. Se tutto vive solo in alta stagione, serve cautela.

## Quando andare

Primavera e autunno sono spesso migliori dell estate. Meno folla, luce piu morbida e prezzi piu sensati.

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
    image:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Una preview di checklist editoriale per capire se una destinazione e coerente con tempo, budget e aspettative.',
    description:
      'Domande semplici ma decisive da farsi prima di prenotare un viaggio, per evitare scelte belle online ma deboli nella pratica.',
    location: 'Metodo di viaggio',
    period: 'Tutto l anno',
    budget: 'Variabile',
    duration: 'Checklist',
    readTime: '5 min',
    date: '2 aprile 2026',
    author: 'Rodrigo & Betta',
    content: `
La scelta migliore non e sempre quella piu spettacolare. E quella che regge il tempo che hai, il budget reale e il tipo di energia che vuoi portare nel viaggio.

## Perche usarla

Prima di prenotare conviene verificare se la destinazione e davvero compatibile con giorni, spostamenti, stagione e aspettative.

## Le domande base

Quanto tempo perdo negli spostamenti? Cosa succede se piove? Ho almeno due motivi forti per scegliere questo posto? Il budget resta sensato anche nei costi nascosti?

## Errori da evitare

Prenotare solo per una foto, sottovalutare distanze, ignorare stagionalita e accumulare troppe tappe in pochi giorni.
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
