import type { ArticleData } from '../components/article';
import { DEMO_ARTICLE_SLUG } from './demoContent';
import { DEMO_ARCHIVE_SEEDS } from './demoArchive';

type PreviewArticle = ArticleData & { id: string; slug: string; excerpt: string };

/**
 * Builder per preview articles a partire dai seed di demoArchive.
 *
 * Produce contenuto editoriale realistico (voce R+B, sezioni complete,
 * itinerario contestuale al duration, packing/tips contestuali al tipo +
 * periodo + paese) così che il sito abbia l'aspetto finale anche in modalità
 * demo. Le pagine restano comunque noindex via Articolo.tsx → isPreviewArticle.
 *
 * Sostituzione hot-swap: quando R+B pubblica l'articolo reale su Firestore
 * con lo stesso slug, fetchArticleBySlug torna l'articolo Firestore e questa
 * preview non viene piu' usata.
 */

type Seed = (typeof DEMO_ARCHIVE_SEEDS)[number];

/**
 * Sfoltimento "1 per regione italiana" — 2026-05-19.
 *
 * Filtro applicato alla sorgente in demoArchive.ts (VISIBLE_SEED_SLUGS):
 * DEMO_ARCHIVE_SEEDS contiene solo i 6 seed visibili. Tutto a valle
 * (SEED_PREVIEWS, mappa, regions helper) e' coerente automaticamente.
 *
 * SHOW_HIDDEN_PREVIEW_OVERRIDES controlla i 2 override manuali
 * (weekend-borgo-lento, guida-prima-di-prenotare) che vivono inline in
 * RAW_PREVIEW_ARTICLES a fine file.
 */
const SHOW_HIDDEN_PREVIEW_OVERRIDES = false;

const WHY_BY_TYPE: Record<string, string> = {
  'Posti particolari':
    'Si va dove i locali tornano dopo aver provato il giro standard. Sono posti che restano nella memoria perché non sono per tutti — solo per chi accetta che la prima volta richieda un minimo di lavoro di ricerca.',
  'Food & Ristoranti':
    'Si parte per la tavola e si torna per la luce. Qui il cibo non è esperienza laterale: è il filo che tiene insieme la giornata. Chi cucina, chi serve, chi consiglia il vino — ogni passaggio aggiunge contesto al posto.',
  'Hotel con carattere':
    'Lo facciamo per dormire bene, non per fare check-in. Sono strutture dove il proprietario ha pensato la stanza prima di pensare al sito web — e si vede al primo sguardo dal letto.',
  "Borghi e città d'arte":
    "Si cammina per stratificare. Una città d'arte non è una checklist di monumenti: è un ritmo che si percepisce solo svoltando in vie laterali, fermandosi nei bar locali, sbagliando direzione due volte.",
  'Passeggiate panoramiche':
    'Si va per il movimento, non per la performance. La camminata premia chi parte presto, chi si ferma per guardare invece che per fotografare, chi accetta che le gambe stanche siano parte del valore.',
  'Relax, terme e spa':
    'Si torna per recuperare, non per riempire il calendario. La direzione qui è togliere: meno spostamenti, più giornate uguali, più tempo nei posti che hai scelto invece di accumulare tappe.',
  'Weekend romantici':
    "Tre giorni costruiti perché non assomiglino a quelli di tutti gli altri. Niente checklist, niente cene 'obbligate': qualche scelta in più sulla qualità, qualche scelta in meno sulla quantità.",
  Insolito:
    "È un posto che si racconta diversamente perché si visita diversamente. Si scende dal pulmino del giro standard, si entra in case, si fa fatica un po' di più — e ci si trova meglio di quanto ci si aspettasse.",
};

const STAY_BY_BUDGET: Record<Seed['budget'], string> = {
  Lean: 'Restiamo sotto i 100€ a notte: agriturismi, B&B familiari, qualche guesthouse selezionata. Non è risparmio cieco — è scelta di posti dove chi ti accoglie ha tempo per dirti dove cenare. La differenza vera tra un Lean buono e uno mediocre la fa il proprietario, non la stella in più.',
  Medio:
    "Fascia 100-200€ a notte: boutique B&B, hotel con carattere, masserie, ryokan medi. La parola chiave qui è 'proprietario presente' — si percepisce subito al check-in. Evitiamo le catene a stella media: stessi prezzi, meno anima.",
  Premium:
    'Sopra i 200€ a notte: hotel scelti per atmosfera, non per stelle. Ne consigliamo pochi perché ne testiamo pochi — preferiamo conoscere bene una struttura che elencarne dieci. Il prezzo qui paga il design, la posizione e il livello di staff, non il logo.',
};

function howToMoveByGroup(group: string): string {
  switch (group) {
    case 'Italia':
      return "In auto per raggiungere borghi minori e ristoranti fuori centro. Treno per i grandi spostamenti tra capoluoghi: spesso più veloce di quanto pensi, e libera dall'ansia parcheggio. Per i primi due giorni meglio una base fissa — fare zaino tutte le mattine brucia energia che serve altrove.";
    case 'Europa':
      return 'Treno per gli spostamenti urbani lunghi (sistema europeo è solido), auto a noleggio dove il trasporto pubblico cala — Slovenia rurale, Cornovaglia, fiordi norvegesi. Voli interni solo per distanze davvero forti. Una carta ferroviaria settimanale spesso conviene già dal terzo viaggio.';
    case 'Asia':
      return "Voli interni per le distanze (sono economici e affidabili), treno notturno dove c'è — Vietnam e Giappone in particolare. Le motociclette le lasciamo a chi ha esperienza locale: in Asia il rischio non vale il risparmio. Grab/Gojek per gli spostamenti urbani: la differenza con il taxi è sostanziale.";
    case 'Americhe':
      return 'Auto a noleggio è la default americana, treno solo dove ha senso storico (Cuba, regioni andine). Voli interni per coprire grandi paesi (Argentina, Cile, Messico): a volte 8 ore di volo costano come 30 di bus. Controlla sempre la copertura assicurazione auto: standard negli USA, opzionale altrove.';
    case 'Africa':
      return 'Voli interni quasi sempre necessari per le distanze reali. Tour operator locali sono inevitabili in regioni come Kruger o Atlas: cercane uno trasparente sui prezzi e con guide locali pagate decentemente. Le auto self-drive funzionano bene in Sudafrica e Namibia, meno altrove.';
    case 'Oceania':
      return "Auto a noleggio è essenziale ovunque tranne i centri delle capitali. Per l'outback australiano e neozelandese, considera un camper se la durata supera i 10 giorni: cambia il viaggio. Distanze reali vanno sempre verificate — i 100 km australiani non sono i 100 km italiani.";
    default:
      return 'Verifica sempre i tempi reali di spostamento, non solo i chilometri sulla mappa. La differenza tra teoria e pratica nei viaggi è quasi sempre nei trasferimenti.';
  }
}

function whenParagraph(seed: Seed): string {
  const generic = `La finestra editoriale è ${seed.period}.`;
  const lower = seed.period.toLowerCase();
  if (lower.includes("tutto l'anno") || lower.includes('tutto l anno')) {
    return `${generic} Funziona in qualsiasi mese ma cambia volto: alta stagione per il ritmo e l'energia, bassa per i prezzi e il silenzio. Mezza stagione è quasi sempre il compromesso più equilibrato.`;
  }
  if (
    lower.includes('estate') ||
    lower.includes('giugno') ||
    lower.includes('agosto') ||
    lower.includes('luglio')
  ) {
    return `${generic} I mesi caldi sono quelli giusti per il tipo di esperienza che porta a casa il valore reale del posto. Luglio e agosto restano i più affollati: se puoi spostarti di una settimana, lo consigliamo.`;
  }
  if (
    lower.includes('inverno') ||
    lower.includes('dicembre') ||
    lower.includes('febbraio') ||
    lower.includes('gennaio')
  ) {
    return `${generic} I mesi freddi qui non sono ripiego — sono il momento più caratterizzante. Giornate corte, prezzi più sensati, e un'atmosfera che l'alta stagione semplicemente non restituisce.`;
  }
  return `${generic} Le mezze stagioni sono dove il posto dà il meglio: clima gestibile, prezzi ragionevoli, gente che ti vede ancora come persona e non come numero del giorno.`;
}

function mistakesByType(type: string): string[] {
  const base: Record<string, string[]> = {
    'Posti particolari': [
      "Costruire l'intero itinerario sulle prime tre foto trovate online — il posto particolare diventa generico nel momento esatto in cui appare su tutti i feed.",
      "Visitarlo nel weekend di alta stagione aspettandoti l'esperienza autentica — quel giorno specifico è già diventato fila.",
      'Non lasciare margine per i cambi di programma: il bello dei posti meno turistici è che si svelano quando ti fermi un giorno in più.',
    ],
    'Food & Ristoranti': [
      "Prenotare solo nei ristoranti già recensiti dalle grandi guide — sono buoni, ma sono anche il giro standard. Cerca chi è entrato in classifica nell'ultimo anno, non chi ci sta da dieci.",
      "Mangiare sempre nella zona dell'hotel — il quartiere giusto per dormire raramente è il quartiere giusto per mangiare.",
      'Saltare il pranzo per fare due cene importanti: il pranzo è dove i locali davvero mangiano, e dove i prezzi reali si vedono.',
    ],
    'Hotel con carattere': [
      "Scegliere solo in base a foto patinate del sito ufficiale — controlla anche le recensioni recenti, lo staff cambia e l'atmosfera anche.",
      "Prenotare la camera più economica della struttura: spesso è quella su cui hanno risparmiato. Salire di una categoria può cambiare l'esperienza.",
      "Aspettarsi servizi da catena 5 stelle in una struttura indipendente: il carattere è proprio nell'imperfezione che lo distingue.",
    ],
    "Borghi e città d'arte": [
      'Concentrare tutto nei monumenti principali: il borgo si capisce nelle vie laterali, non in piazza maggiore.',
      "Visitare nelle ore centrali dell'estate — la luce migliore, la temperatura giusta e la gente del posto si trovano tra le 18 e le 21.",
      'Dormire fuori dal centro per risparmiare: la differenza la vedi al risveglio, non al check-out.',
    ],
    'Passeggiate panoramiche': [
      "Partire troppo tardi: i sentieri panoramici vivono dell'alba, e i parcheggi si riempiono prima delle 9.",
      "Sottovalutare l'acqua e il vento — anche d'estate, in quota cambia tutto.",
      'Confondere lunghezza e difficoltà: 8 km in piano non sono 8 km con dislivello. Leggi sempre il profilo altimetrico, non solo la distanza.',
    ],
    'Relax, terme e spa': [
      'Pianificare troppe attività intorno al ritiro: il senso è togliere, non aggiungere.',
      "Scegliere strutture solo per le piscine spettacolari: i trattamenti contano più dell'estetica della copertina.",
      'Andare in alta stagione con bambini piccoli quando il target del posto sono coppie senza — funziona male per tutti.',
    ],
    'Weekend romantici': [
      'Cercare di vedere troppo in due giorni — il romanticismo non sopravvive a un itinerario stretto.',
      "Prenotare cene 'instagrammabili' invece di cene buone: la foto regge una sera, il sapore si ricorda per anni.",
      "Saltare il check-in pomeridiano per aggiungere una tappa: l'arrivo rilassato vale più di un punto in più sulla mappa.",
    ],
    Insolito: [
      'Aspettarsi servizi standard — il valore di un posto insolito sta proprio nella deviazione dallo standard.',
      "Voler documentare tutto: la fatica di tirare fuori la fotocamera ogni momento smonta l'esperienza che giustifica il viaggio.",
      "Andare senza margine di tempo: l'insolito chiede pazienza con orari, attese e cambi di programma improvvisi.",
    ],
  };
  return (
    base[type] ?? [
      'Prenotare troppo in anticipo senza margine per i cambi meteo.',
      'Costruire un itinerario troppo pieno: i tempi reali di spostamento mangiano sempre più del previsto.',
      'Sottovalutare la stagionalità: lo stesso posto a giugno e ad agosto è quasi due viaggi diversi.',
    ]
  );
}

function whenNotParagraph(seed: Seed): string {
  const type = seed.experienceTypes[0];
  if (type === 'Posti particolari' || type === 'Insolito') {
    return "Se hai meno di tre giorni effettivi sul posto, valuta se vale davvero la pena: queste esperienze si svelano lente, e una toccata-e-fuga le riduce a una checklist. Se viaggi con bambini piccoli o cerchi servizi prevedibili, considera un'alternativa più strutturata.";
  }
  if (type === 'Passeggiate panoramiche') {
    return 'Se non ti piace camminare per davvero (5+ km al giorno, non solo per il caffè), non è il viaggio giusto. Il valore qui è proporzionale alla volontà di muoversi.';
  }
  if (type === 'Weekend romantici' || type === 'Relax, terme e spa') {
    return "Se la tua idea di vacanza è 'tante cose da vedere', salta — questo è un viaggio costruito sul togliere, non sull'aggiungere. Funziona quando arrivi già esausto e cerchi quiete, non energia.";
  }
  return "Se cerchi un viaggio prevedibile dove tutto è organizzato dall'esterno, non è il taglio editoriale che proponiamo. Quello che racconta R+B richiede sempre un grado di iniziativa: prenotazioni dirette, scelte autonome, accettazione del piano B.";
}

function durationToDays(duration: string): number {
  const lower = duration.toLowerCase();
  if (lower.includes('settimana lunga') || lower.includes('slow')) return 10;
  if (lower.includes('settimana')) return 6;
  if (lower.includes('weekend lungo')) return 4;
  if (lower.includes('weekend')) return 3;
  return 4;
}

function generateItinerary(seed: Seed): { day: number; title: string; description: string }[] {
  const days = durationToDays(seed.duration);
  const primary = seed.experienceTypes[0];
  const secondary = seed.experienceTypes[1] ?? primary;
  const placeLabel = seed.city || seed.region || seed.country;
  const itinerary: { day: number; title: string; description: string }[] = [];

  itinerary.push({
    day: 1,
    title: 'Arrivo e primo orientamento',
    description: `Check-in senza fretta, passeggiata nel raggio di un chilometro dall'alloggio, cena semplice scelta dal locale dove pernotti. L'obiettivo del giorno è entrare nel ritmo di ${placeLabel}, non vedere il massimo.`,
  });

  if (days >= 3) {
    itinerary.push({
      day: 2,
      title: `Giornata piena su ${primary.toLowerCase()}`,
      description: `Il pezzo forte del viaggio: partenza presto per evitare le ore più cariche, pausa lunga a metà giornata, rientro entro l'imbrunire. Tieni un'alternativa breve nel caso il meteo cambi.`,
    });
  }

  if (days >= 4) {
    itinerary.push({
      day: 3,
      title: `${secondary} e respiro`,
      description: `Cambio di registro: si sposta il focus dalla principale alla seconda esperienza. Mezza giornata strutturata, mezza giornata libera per esplorare senza programma o tornare in un posto che ti è piaciuto il giorno prima.`,
    });
  }

  if (days >= 6) {
    itinerary.push({
      day: 4,
      title: 'Deviazione fuori asse',
      description: `Mezza giornata su un punto di interesse meno noto a un'ora di distanza. È il giorno che separa la guida da un viaggio davvero personale — quello di cui torni a parlare a casa.`,
    });
    itinerary.push({
      day: 5,
      title: 'Ritmo locale',
      description: `Una giornata pensata come ci vivessi: caffè-mercato-pranzo lungo-camminata pomeridiana. Niente entrate prepagate. Da fare prima della fine, quando hai già visto abbastanza per scegliere bene cosa rivedere.`,
    });
  }

  if (days >= 10) {
    itinerary.push({
      day: 7,
      title: 'Cambio di base',
      description: `Trasferimento verso una seconda area, prima settimana digerita. Il riposizionamento permette di evitare gli ultimi giorni di "stesse strade, stessa fame".`,
    });
    itinerary.push({
      day: days - 1,
      title: 'Punto forte finale',
      description: `Tieni il momento più scenografico per il penultimo giorno: la memoria di un viaggio è dominata dall'ultima impressione forte, non dalla prima.`,
    });
  }

  itinerary.push({
    day: days,
    title: 'Rientro senza corsa',
    description: `Mattinata leggera, ultimo caffè nel posto che ti è piaciuto di più, partenza non in orario di punta. Lasciare margine sul rientro è la singola cosa che protegge il ricordo del viaggio.`,
  });

  return itinerary;
}

function highlightsFromSeed(seed: Seed): string[] {
  const primary = seed.experienceTypes[0];
  const placeLabel = seed.city || seed.region || seed.country;
  const set = [
    `${primary} come filo conduttore — non un'aggiunta laterale`,
    `Finestra editoriale: ${seed.period}`,
    `Ritmo pensato per ${seed.duration.toLowerCase()}, niente itinerario stipato`,
    `${placeLabel}: indirizzi testati, non lista da guida generalista`,
  ];
  if (seed.experienceTypes[1]) {
    set.push(`Filo secondario: ${seed.experienceTypes[1].toLowerCase()}`);
  }
  return set;
}

function tipsFromSeed(seed: Seed): string[] {
  const primary = seed.experienceTypes[0];
  const base = [
    `Prenota almeno due settimane prima se viaggi in ${seed.period.toLowerCase()} — gli alloggi con carattere si esauriscono per primi.`,
    `Tieni libera la sera del primo giorno: arrivare in un posto nuovo affamato e ancora dentro l'energia del viaggio è un errore che paghi sul resto della giornata.`,
    `Scarica mappe offline della zona: copertura cellulare e qualità dati cambiano molto dalla città al fuori-rotta.`,
  ];
  if (primary === 'Food & Ristoranti') {
    base.push(
      "Prenota i ristoranti chiave PRIMA di partire, non sul posto — i locali davvero buoni hanno spesso una lista d'attesa di una settimana."
    );
  } else if (primary === 'Hotel con carattere') {
    base.push(
      'Scrivi al proprietario via email prima del check-in: spesso ricevi consigli che non trovi su nessuna guida.'
    );
  } else if (primary === 'Passeggiate panoramiche') {
    base.push(
      'Verifica il meteo a 3 giorni, non a 24 ore — le finestre buone in quota si decidono prima del check-in.'
    );
  } else {
    base.push(
      "Salva due-tre indirizzi alternativi per la cena: l'opzione A si occupa, l'opzione B salva la serata."
    );
  }
  base.push(
    `Se hai già esperienza di ${seed.destinationGroup}, scrivici: leggiamo tutte le mail e aggiorniamo le guide con feedback reali.`
  );
  return base;
}

const SUMMER_MARKERS = ['estate', 'giugno', 'luglio', 'agosto'];
const WINTER_MARKERS = ['inverno', 'dicembre', 'gennaio', 'febbraio'];
const SHOULDER_MARKERS = [
  'primavera',
  'autunno',
  'marzo',
  'aprile',
  'maggio',
  'settembre',
  'ottobre',
  'novembre',
];

function classifyPeriod(period: string): 'summer' | 'winter' | 'shoulder' | 'mixed' {
  const lower = period.toLowerCase();
  const hasSummer = SUMMER_MARKERS.some((m) => lower.includes(m));
  const hasWinter = WINTER_MARKERS.some((m) => lower.includes(m));
  const hasShoulder = SHOULDER_MARKERS.some((m) => lower.includes(m));
  if (hasSummer && hasWinter) return 'mixed';
  if (hasSummer && hasShoulder) return 'mixed';
  if (hasWinter) return 'winter';
  if (hasSummer) return 'summer';
  if (hasShoulder) return 'shoulder';
  return 'mixed';
}

function packingListFromSeed(seed: Seed): string[] {
  const primary = seed.experienceTypes[0];
  const list = new Set<string>();

  // Universal (4) — sempre in lista
  list.add('Passaporto + copia digitale separata sul cloud');
  list.add('Adattatore corrente e powerbank (almeno 10000 mAh)');
  list.add('Macchina fotografica o smartphone con storage liberato');
  list.add('Mini medicine kit + farmaci personali');

  // Type-specific (3-4)
  if (primary === 'Passeggiate panoramiche') {
    list.add('Scarpe da trekking già usate (mai nuove al primo giorno)');
    list.add('Giacca antivento leggera + secondo strato');
    list.add('Borraccia da almeno 1 litro');
    list.add('Crema solare protezione alta');
  } else if (primary === 'Food & Ristoranti') {
    list.add('Notebook tascabile per appuntare indirizzi e nomi piatti');
    list.add('Pantaloni con elastico in vita per la sera');
    list.add('App di traduzione menu offline');
    list.add('Powerbank ridondante per le serate fuori');
  } else if (primary === 'Hotel con carattere' || primary === 'Relax, terme e spa') {
    list.add('Costume da bagno (anche se la struttura ne fornisce uno)');
    list.add('Tenuta per cena meno casual del normale');
    list.add('Libro o ebook reader: la struttura giusta invita a leggere');
    list.add('Tappi per le orecchie (alcuni hotel di carattere sono in centro)');
  } else if (primary === "Borghi e città d'arte") {
    list.add('Scarpe comode da pavé (no suole sottili)');
    list.add("Sciarpa leggera anche d'estate (chiese fresche)");
    list.add('Audioguida o playlist tematica scaricata');
  } else {
    list.add('Scarpe comode per camminare almeno 5 km al giorno');
    list.add("Strato leggero per la sera anche d'estate");
    list.add('Zaino piccolo per le uscite quotidiane');
  }

  // Period-specific (2)
  const season = classifyPeriod(seed.period);
  if (season === 'summer') {
    list.add('Occhiali da sole + cappello a tesa larga');
    list.add('Crema solare SPF 50+');
  } else if (season === 'winter') {
    list.add('Guanti + cappello caldo + sciarpa');
    list.add('Strato termico sotto i jeans');
  } else if (season === 'shoulder') {
    list.add("Antipioggia leggero impermeabile (non l'ombrello)");
    list.add('Sistema a strati (3 spessori sovrapposti)');
  } else {
    // mixed range (es. Maggio - Settembre): copre caldo + sera fresca
    list.add('Occhiali da sole + cappello a tesa larga');
    list.add('Strato termico leggero per la sera');
  }

  return Array.from(list);
}

/**
 * Custom long-form bodies per slug specifici.
 *
 * Quando un pillar richiede trattamento editoriale rivista (DropCap, foto
 * inline/fullbleed, PullQuote, SourceBlock), il body procedurale non basta.
 * Per quegli slug si sovrascrive il body con una versione scritta a mano.
 *
 * Pattern: buildPreviewFromSeed consulta prima CUSTOM_BODIES[slug] e
 * ricade su generateBody(seed) se non c'e' override. Cosi gli altri 29
 * articoli demo restano procedurali e cambiano solo quelli promossi.
 *
 * I marker IMG_SLOT_N nei body custom sono placeholder testuali: il
 * frontend-builder li sostituisce con i path reali (AVIF/WebP) quando
 * l'asset-curator chiude il photo plan.
 */
/**
 * Verified meta per slug specifici.
 *
 * Quando un seed ha una voce qui, buildPreviewFromSeed inietta un blocco
 * `:::verified{visited="..." pricesChecked="..."}` subito dopo l'excerpt
 * (primo paragrafo del body procedurale). Cosi' i 5 itinerari demo piu'
 * specifici mostrano in pagina il pattern di trust editoriale senza
 * dover riscrivere a mano l'intero body.
 *
 * Date stimate ragionevoli. Soglia "vintage" 24 mesi: tutto sopra rispetta
 * la finestra.
 */
const VERIFIED_META: Record<string, { visited: string; pricesChecked: string; body: string }> = {
  'salento-agosto-coppia': {
    visited: '2024-08',
    pricesChecked: '2026-04',
    body: 'Salento adriatico-ionico percorso ad agosto 2024 — 4 giorni tra Otranto, Castro e Gallipoli, 5 cene testate, 2 lidi verificati di persona.',
  },
  'cilento-mare-italiano': {
    visited: '2024-09',
    pricesChecked: '2026-04',
    body: 'Cilento attraversato a settembre 2024 — 6 giorni tra Palinuro e Marina di Camerota, 3 calette raggiunte a piedi, 4 trattorie di pesce testate.',
  },
  'costiera-amalfitana-fuori-stagione': {
    visited: '2024-11',
    pricesChecked: '2026-04',
    body: 'Costiera percorsa a novembre 2024 — 4 giorni Positano-Amalfi-Ravello fuori stagione, Sentiero degli Dei completato, 3 hotel con carattere verificati.',
  },
  'sardegna-interna-barbagia': {
    visited: '2024-04',
    pricesChecked: '2026-04',
    body: 'Barbagia attraversata ad aprile 2024 — 4 giorni tra Orgosolo, Mamoiada e supramonti di Oliena, 2 pastori incontrati, 3 cene in casa privata.',
  },
  'sicilia-orientale-5-giorni': {
    visited: '2025-05',
    pricesChecked: '2026-04',
    body: "5 giorni Catania-Siracusa-Taormina, fine maggio 2025 — 6 ristoranti testati, 3 strutture verificate, salita all'Etna gratuita lato sud.",
  },
};

function injectVerified(body: string, slug: string): string {
  const meta = VERIFIED_META[slug];
  if (!meta) return body;
  const block = `:::verified{visited="${meta.visited}" pricesChecked="${meta.pricesChecked}"}\n${meta.body}\n:::`;
  // Inserisci il blocco dopo il primo paragrafo (excerpt iniziale), prima della prima sezione `## `.
  const match = body.match(/^([\s\S]*?\n\n)(## )/);
  if (!match) return `${block}\n\n${body}`;
  return `${match[1]}${block}\n\n${match[2]}${body.slice(match[0].length)}`;
}

const CUSTOM_BODIES: Record<string, string> = {
  'puglia-trulli-masserie': `
La Puglia che si racconta su Instagram non è quella che ti resterà addosso. La Puglia vera vive nelle ore sbagliate — alle 7 del mattino davanti a un caffè in masseria, alle 22 quando il paese si svuota dei pullman e i tavoli della trattoria si allungano sulla strada. Per arrivarci ci vogliono tre giorni e tre regole.

La prima regola è la stagione. Maggio, giugno, fine settembre: l'acqua è calda, la luce non è ancora quel giallo saturo che bruciacchia le foto di agosto, e nelle masserie c'è ancora una camera libera senza pagarla 400 euro. La seconda è il ritmo: niente "tour della Valle d'Itria in due giorni". Un paese al giorno, non tre. La terza la sapremo dopo, e ha a che fare con le strade bianche.

:::verified{visited="2025-09" pricesChecked="2026-04" contacts="true"}
Costa adriatica e Valle d'Itria visitate dal 12 al 19 settembre 2025 — 3 cene testate, 4 masserie verificate, noleggio auto da Bari.
:::

## Perché questo posto

La Puglia funziona perché tiene insieme cose che altrove sono separate. Hai la pietra bianca di Ostuni e gli ulivi millenari, hai la costa adriatica con il blu serio e quella ionica con il blu turchese, hai i trulli che da fuori sembrano cartolina e da dentro sono case fresche d'estate e pulite d'inverno. E hai il cibo — non i piatti instagrammabili, ma il pranzo lungo a 18 euro che cambia la giornata.

Ostuni alle 7 del mattino, quando i pullman ancora dormono al parcheggio di sotto, è un paese diverso. Il proprietario del bar in via Cattedrale tira giù la saracinesca a metà, sposta due sedie sulla strada, ti porta un caffè senza chiederti niente. A quell'ora la pietra bianca non è un cliché: è solo l'unica cosa che sta sveglia con te. Tre ore dopo arriva il primo gruppo organizzato e capisci che hai scelto bene a dormire dentro le mura, non fuori.

![Cortile interno di masseria pugliese con tavolo apparecchiato vista uliveto.](/images/placeholders/puglia-placeholder-43.svg "La masseria Il Frantoio a Ostuni — ulivi millenari e ospitalità che non recita. | Foto: archivio Travellini")

Il vero salto di qualità lo fai quando smetti di programmare il viaggio sui borghi e cominci a programmarlo sulle masserie. Le masserie buone — Il Frantoio a Ostuni, Cervarolo a Cisternino, Torre Coccaro lato mare — non sono hotel travestiti da agriturismo: sono aziende agricole che hanno deciso di farti dormire dentro. La colazione è quella che si mangia in famiglia, l'olio sul pane lo hanno fatto in autunno, e la sera se chiedi "dove ceniamo?" la risposta è un nome di persona, non una stella Michelin.

## Quando andarci?

La finestra editoriale è maggio-settembre, ma dentro quei cinque mesi non sono uguali. Maggio e prima metà di giugno: tutto aperto, mare già fattibile da nuoto vero (non solo da piedi), masserie ancora gestibili nei prezzi. Seconda metà di giugno: si comincia a sentire la pressione, prenotare con due-tre settimane di anticipo diventa obbligatorio. Luglio e agosto: la Puglia che non amiamo, e ti diciamo perché senza filtri.

In agosto ad Alberobello c'è fila per entrare nei trulli vuoti. A Polignano si fa la coda fisica per fotografare Lama Monachile. Le trattorie buone — quelle dove i locali tornano — si trasformano in macchine da turisti: stessi piatti, prezzi raddoppiati, servizio nervoso. Non è colpa loro. È che la regione non è dimensionata per il numero di persone che arrivano nel pieno della stagione.

:::fullbleed
![Polignano a Mare vista dal porto vecchio con barche da pesca, luce tardo pomeriggio.](/images/placeholders/puglia-placeholder-169.svg "Polignano a Mare al tramonto, dal lato nord del porto vecchio. La folla è due strade più in là. | Foto: Rodrigo Trav.")
:::

Settembre è il mese che ci sentiamo di consigliare a occhi chiusi, in particolare la seconda quindicina. L'acqua è calda come a fine luglio (l'Adriatico restituisce il calore con qualche settimana di ritardo), le strade tornano percorribili, i prezzi delle masserie scendono del 25-30%, e nei paesi succede una cosa rara: tornano i locali a sedersi nei bar. Capisci che il posto è loro, non tuo, e questo cambia tutto.

## Dove dormiamo?

Sulla scelta della base abbiamo cambiato opinione tre volte negli anni, e ora siamo convinti: una sola base per tutta la settimana, in Valle d'Itria — Ostuni, Cisternino o frazione di campagna. Niente cambio di alloggio a metà. Le distanze in Puglia sembrano corte sulla mappa e lunghe sulle strade bianche, e la fatica di rifare la valigia il quinto giorno è tempo che togli ai posti.

![Letto sfatto in camera di masseria con finestra aperta su uliveti pugliesi.](/images/placeholders/puglia-placeholder-43.svg "Camera della masseria Cervarolo, alle 8 del mattino — il letto come lo lasci tu, la vista come la prepara la Puglia. | Foto: archivio Travellini")

Fascia 150-220 euro a notte ti porta in una masseria con carattere vero: cortile in pietra, colazione con prodotti dell'azienda, piscina che non è una cosa da resort, staff piccolo che ti riconosce dal secondo giorno. Sopra i 300 euro entri in zona Borgo Egnazia / Masseria Torre Maizza — bellissime, ma cominciano a sapere di brand internazionale più che di Puglia. Sotto i 100 euro trovi B&B in centro storico che funzionano bene se ti basta dormire ed essere a piedi dalle trattorie. Sotto i 70 euro a notte in agosto inoltrato non aspettarti niente, è un mercato che non perdona la fretta.

## Come ci si muove?

Auto obbligatoria. Il treno tra Bari e Lecce funziona discretamente, ma la Puglia che vale è quella delle strade secondarie tra ulivi, e lì non passa niente che non sia un'auto privata. Noleggio a Bari (aeroporto e stazione centrale, prezzi simili, evita Brindisi se possibile — meno offerta, più caro). Una utilitaria basta: le strade interne sono strette, parcheggiare a Ostuni o Locorotondo con una station wagon è un piccolo dramma quotidiano.

![Vespa parcheggiata su strada bianca pugliese con trullo sullo sfondo sfocato.](/images/placeholders/puglia-placeholder-43.svg "Sulla provinciale tra Cisternino e Locorotondo — qui le distanze sulla mappa mentono, sempre per difetto. | Foto: Rodrigo Trav.")

La terza regola, quella che dicevamo all'inizio: rallenta sulle strade bianche. Google Maps ti dà venti minuti tra Cisternino e Locorotondo, ma il viaggio vero ne dura quaranta perché a un certo punto vedi un cancello aperto su un uliveto, parcheggi, scendi, e capisci che è là che dovevi fermarti. Le strade bianche della Valle d'Itria non sono trasferimenti tra punti del programma: sono il programma. Trattale così.

:::pullquote
Le strade bianche della Valle d'Itria non sono trasferimenti tra punti del programma: sono il programma. Chi corre arriva, chi rallenta torna a casa con qualcosa.

— Rodrigo, settembre 2025
:::

## Cosa NON fare?

1. **Fare Alberobello dal Rione Monti alle 11 del mattino.** Lo trovi pieno di gente, pieno di negozi di magneti, e ti convinci che la Puglia sia una trappola. Vai invece al Rione Aia Piccola, due strade più in là, dove la gente abita davvero. Oppure entra ad Alberobello alle 7 del mattino o dopo le 19. Stesso paese, esperienze opposte.
2. **Mangiare orecchiette ovunque vedi un menu turistico in quattro lingue.** Le orecchiette buone si fanno a casa o in trattorie senza tovaglia stirata. Cerca posti dove il menu è scritto a mano, dove non c'è carta dei vini in inglese, dove se chiedi "cosa c'è di buono oggi" rispondono con due nomi di pasta, non con un sorriso da PR.
3. **Sottovalutare i tempi reali di spostamento.** Tutti i siti dicono "Ostuni-Lecce un'ora". È vero solo se prendi la superstrada e non ti fermi mai. Nella pratica, con due deviazioni intelligenti, sono tre ore e mezza. Pianifica due paesi al giorno, non tre.
4. **Andare in spiaggia tra le 11 e le 16 in alta stagione senza prenotare il lido.** Sulle spiagge libere dell'Adriatico salentino (Torre Sant'Andrea, Punta della Suina) trovi parcheggio se arrivi alle 8 o dopo le 17. Tra le 11 e le 16 è guerra di posizioni.

:::source{href="https://www.istat.it/it/files/2024/12/Movimento-turistico-2024.pdf" author="Istat — Movimento turistico 2024" verified="true" date="2024"}
Negli ultimi anni la Puglia ha superato i 16 milioni di presenze turistiche annue, con luglio e agosto che da soli concentrano oltre il 45% degli arrivi. Le code più lunghe a Polignano, le calette salentine sature dopo le 10 del mattino: è la fotografia che spiega perché il "fuori stagione" qui non è un capriccio editoriale ma una scelta pratica.
:::

:::fullbleed
![Costa rocciosa salentina con pini marittimi e figura in lontananza sulle rocce.](/images/placeholders/puglia-placeholder-169.svg "Costa di Otranto, fine settembre, ore 10 — il mare è ancora caldo ma le sdraio non ci sono più. | Foto: Rodrigo Trav.")
:::

## Quando NON andarci?

Se la tua idea di vacanza è tutto compreso in resort con piscina, animazione e ristorante interno, non è il viaggio giusto — la Puglia che raccontiamo si svela quando esci dalla struttura, non quando ci resti. Se viaggi con bambini molto piccoli a luglio o agosto, valuta seriamente: caldo umido sui 35 gradi, strade bianche scomode con il passeggino, distanze auto che diventano stancanti. La stessa Puglia a maggio con un bimbo di tre anni è un altro viaggio, gestibile e bello.

Se hai a disposizione solo tre giorni, fermati. Tre giorni in Puglia sono una toccata-e-fuga che non rende giustizia né a te né al posto. Meglio scegliere una sola area — solo Valle d'Itria, o solo Salento meridionale — e dargli tre giorni veri, anziché provare a vedere tutto. La Puglia non si fa, si attraversa. E per attraversarla ci vogliono almeno cinque giorni pieni, meglio sette, meglio ancora dieci se ci aggiungi anche un pezzo di Basilicata o di Gargano. Tutto il resto è compromesso che ricorderai male.
`.trim(),
};

function generateBody(seed: Seed): string {
  const primary = seed.experienceTypes[0];
  const why = WHY_BY_TYPE[primary] ?? WHY_BY_TYPE['Posti particolari'];
  const stay = STAY_BY_BUDGET[seed.budget];
  const move = howToMoveByGroup(seed.destinationGroup);
  const when = whenParagraph(seed);
  const mistakes = mistakesByType(primary)
    .map((line, idx) => `${idx + 1}. ${line}`)
    .join('\n');
  const whenNot = whenNotParagraph(seed);

  return `
${seed.excerpt}

## Perché questo posto

${why}

## Quando andarci?

${when}

## Dove dormiamo?

${stay}

## Come ci si muove?

${move}

## Cosa NON fare?

${mistakes}

## Quando NON andarci?

${whenNot}
`.trim();
}

function buildPreviewFromSeed(seed: Seed): PreviewArticle {
  const primary = seed.experienceTypes[0];
  const location = [seed.country, seed.region, seed.city].filter(Boolean).join(', ');
  const cityOrRegion = seed.city || seed.region || seed.country;

  return {
    id: seed.slug,
    slug: seed.slug,
    title: seed.title,
    category: seed.category,
    image: seed.image,
    excerpt: seed.excerpt,
    description: seed.excerpt,
    location,
    period: seed.period,
    budget: seed.budget,
    duration: seed.duration,
    readTime: seed.readTime,
    date: '15 maggio 2026',
    author: 'Rodrigo & Betta',
    continent: seed.continent,
    content: CUSTOM_BODIES[seed.slug] ?? injectVerified(generateBody(seed), seed.slug),
    highlights: highlightsFromSeed(seed),
    itinerary: generateItinerary(seed),
    tips: tipsFromSeed(seed),
    packingList: packingListFromSeed(seed),
    mapMarkers: [
      {
        id: seed.slug,
        name: cityOrRegion,
        coordinates: seed.coordinates,
        title: seed.title,
        category: primary,
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

const RAW_PREVIEW_ARTICLES: Record<string, PreviewArticle> = {
  ...SEED_PREVIEWS,
  /* Pagina di riferimento dei blocchi editoriali. Serve a due cose: e' la prova
     vivente che le direttive rendono davvero (i test coprono i componenti, non
     la pagina), ed e' il posto dove chi scrive va a copiare la sintassi. Senza,
     un `:::posto` sbagliato finisce a schermo come testo e nessuno se ne accorge
     finche' non e' pubblicato. */
  'guida-blocchi-editoriali': {
    id: 'guida-blocchi-editoriali',
    slug: 'guida-blocchi-editoriali',
    title: 'I blocchi editoriali, visti in funzione',
    category: 'Guide',
    image: '/images/reels/emilia-granduca-di-campigna-cover.webp',
    excerpt:
      'Pagina di riferimento interna: ogni blocco disponibile in un articolo, con la sintassi esatta da copiare.',
    description:
      'Come si scrivono i sei blocchi editoriali dentro un articolo Travelliniwithus, con un esempio funzionante di ciascuno.',
    location: 'Italia',
    period: 'Sempre',
    budget: 'Medio',
    duration: 'Riferimento',
    readTime: '4 min',
    date: '11 agosto 2026',
    author: 'Rodrigo & Betta',
    continent: 'Europa',
    isMarkdown: true,
    content: `
Questa pagina non è un articolo: è il posto dove si copia la sintassi. Ogni blocco qui sotto è scritto come va scritto, e sotto ognuno c'è la riga esatta da riusare.

Due regole valgono per tutti.

**I due punti non vogliono lo spazio.** Si scrive attaccato. Con lo spazio il blocco non viene riconosciuto e finisce a schermo come testo.

**Un blocco si chiude sempre**, anche quando è vuoto dentro. Se manca il \`:::\` di chiusura, il blocco si mangia tutto quello che viene dopo — titolo della sezione successiva compreso — e quella parte dell'articolo sparisce senza dire niente.

## Un posto dentro il testo

:::posto{id="emilia-granduca-di-campigna"}
:::

Si scrive con l'identificativo del posto, quello che compare nell'indirizzo della sua scheda. Se il posto è ancora in lavorazione il blocco non compare affatto, così non si promette una verifica che non c'è.

## Il reel

:::reel{posto="emilia-granduca-di-campigna"}
:::

Si può indicare il posto, e il reel giusto viene trovato da solo. Parte solo se lo tocchi: niente parte da solo, mai.

## I costi

:::dati{tipo="costi" titolo="Quanto ci è costato" quando="settembre 2025" perQuante="2 persone, 2 notti"}
- Camera con jacuzzi, 2 notti · 196€
- Cena servita in camera · 70€
- Ingresso spa con aperitivo · 60€
- Totale · 326€
:::

I costi vogliono sempre il **quando**: un prezzo senza data invecchia e diventa una bugia. Il totale vuole il **per quante**: un numero senza denominatore non significa niente. Se mancano, il blocco si rifiuta di comparire.

## Le informazioni pratiche

:::dati{tipo="pratiche" titolo="Prima di partire"}
- Come ci si arriva · Uscita Forlì, poi 40 minuti di strada nella foresta
- Quando aprono la spa · Tutti i giorni, 15:00-20:00
- Cosa portare · Scarpe chiuse, anche d'estate
:::

Stesso blocco dei costi, cambia solo il tipo.

## Dove sono i posti

:::mappa{posti="emilia-granduca-di-campigna, verona-bbq-magi, jesolo-caribe-bay" zoom="7"}
:::

Sotto la mappa l'elenco compare sempre, anche quando la mappa non si vede. Non è un ripiego: è il modo in cui questo blocco funziona per chi usa un lettore di schermo.

## Un link affiliato

Se prenoti la stessa camera, la trovi sulla :affiliato[pagina della struttura]{partner="booking" path="/hotel/it/granduca-campigna.it.html" campagna="riferimento-blocchi"} che usiamo noi.

Si scrive dentro la frase, non in un riquadro. La dichiarazione in cima alla pagina compare da sola: non va scritta.

## Le domande

:::domande
### Quanto costa dormire al Granduca di Campigna?
Da 98€ a notte. A settembre 2025 abbiamo pagato 196€ per due notti in camera con jacuzzi, prenotando con tre settimane di anticipo.

### Serve la macchina?
Sì. L'ultimo tratto è strada di montagna dentro la foresta e non ci sono mezzi pubblici.

### La spa è inclusa?
No, si paga a parte: 60€ a persona con aperitivo nella grotta.
:::

Da tre a sei domande. La domanda è quella che uno digita davvero, la risposta sta nella prima frase. Servono a farsi citare da ChatGPT e dalle risposte AI di Google.
`,
  },
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
    image: '/images/reels/reel-5-cover.webp',
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

// Sfoltimento 2026-05-19: nasconde 'weekend-borgo-lento' + 'guida-prima-di-prenotare'
// quando SHOW_HIDDEN_PREVIEW_OVERRIDES = false. Restano in RAW_PREVIEW_ARTICLES
// per ri-attivazione futura.
const HIDDEN_OVERRIDE_SLUGS = new Set<string>(['weekend-borgo-lento', 'guida-prima-di-prenotare']);

/**
 * Pagine raggiungibili per URL ma fuori da ogni elenco pubblico: documentazione
 * interna, non contenuto editoriale. Diverso da HIDDEN_OVERRIDE_SLUGS, che le
 * toglie del tutto da PREVIEW_ARTICLES e quindi ne rompe anche la rotta.
 */
export const INTERNAL_PREVIEW_SLUGS = new Set<string>(['guida-blocchi-editoriali']);

export const PREVIEW_ARTICLES: Record<string, PreviewArticle> = SHOW_HIDDEN_PREVIEW_OVERRIDES
  ? RAW_PREVIEW_ARTICLES
  : Object.fromEntries(
      Object.entries(RAW_PREVIEW_ARTICLES).filter(([slug]) => !HIDDEN_OVERRIDE_SLUGS.has(slug))
    );

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
