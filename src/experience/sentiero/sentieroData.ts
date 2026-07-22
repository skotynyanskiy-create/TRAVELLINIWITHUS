import * as THREE from 'three';

/**
 * "Il Sentiero" — la traccia 3D che la telecamera percorre allo scroll.
 * Punti di controllo che serpeggiano in avanti (verso -Z) con oscillazioni
 * laterali e leggeri dislivelli, così il viaggio non è mai una linea retta.
 */
export const SENTIERO_CURVE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 6),
    new THREE.Vector3(-6, 1.2, -16),
    new THREE.Vector3(5.5, -1, -36),
    new THREE.Vector3(-4.5, 2, -56),
    new THREE.Vector3(6, 0.3, -76),
    new THREE.Vector3(-3.5, 1.6, -96),
    new THREE.Vector3(0, 0.6, -118),
  ],
  false,
  'catmullrom',
  0.5
);

export interface StageTheme {
  /** colore di sfondo della scena */
  bg: string;
  /** colore della nebbia (atmosfera) */
  fog: string;
  /** tinta della luce ambientale */
  light: string;
  /** colore delle particelle */
  sparkle: string;
}

export interface SentieroStage {
  id: string;
  index: number;
  /** posizione lungo la curva, 0..1 (camera + HUD attivo) */
  t: number;
  kicker: string;
  title: string;
  description: string;
  fieldNote: string;
  /** pagina reale che questo mondo apre */
  route: string;
  /** fallback storico, non più letto da nessun consumer */
  routeFallback?: string;
  cta: string;
  media: { type: 'video' | 'image'; src: string };
  theme: StageTheme;
  position: [number, number, number];
}

const RAW_STAGES: Omit<SentieroStage, 'index' | 't' | 'position'>[] = [
  {
    id: 'chi-siamo',
    kicker: '01 / La Scintilla',
    title: 'Ci torneremmo davvero?',
    description:
      'Un reel su Instagram fa nascere una voglia in 15 secondi. Ma per viaggiare davvero serve di più: serve capire se un posto merita il tuo tempo.',
    fieldNote: 'Se non ci torneremmo noi stessi, non entra nella mappa.',
    route: '/chi-siamo',
    cta: 'Scopri chi siamo',
    media: { type: 'image', src: '/images/brand/couple-travel.webp' },
    theme: { bg: '#150d07', fog: '#23160c', light: '#ffdcb0', sparkle: '#e8a866' },
  },
  {
    id: 'destinazioni',
    kicker: '02 / La Prova',
    title: 'Vissuto sul campo',
    description:
      'Nessuna foto stock, nessun itinerario copiato. Viaggiamo di persona, testiamo i letti, assaggiamo i piatti e scopriamo i dettagli che fanno la differenza.',
    fieldNote: 'La presenza reale è la nostra unica garanzia. Niente filtri da cartolina.',
    route: '/chi-siamo#metodo',
    cta: 'Guarda il nostro metodo',
    media: { type: 'video', src: '/video/reel-1.mp4' },
    theme: { bg: '#070a12', fog: '#0c1424', light: '#aec6ff', sparkle: '#7fa6ff' },
  },
  {
    id: 'posti',
    kicker: '03 / La Nota Vera',
    title: 'Il dettaglio utile',
    description:
      "Quanto costa davvero? Qual è l'orario migliore per evitare la folla? Quale errore non devi commettere? Scriviamo note oneste per chi viaggia.",
    fieldNote: 'Il valore di un posto si misura nei dettagli pratici che ti salvano il viaggio.',
    route: '/esplora',
    routeFallback: '/mappa',
    cta: 'Esplora i nostri criteri',
    media: { type: 'video', src: '/video/reel-4.mp4' },
    theme: { bg: '#06110f', fog: '#0a1f1c', light: '#a8f0e0', sparkle: '#5dd6bf' },
  },
  {
    id: 'community',
    kicker: '04 / Mappa Attiva',
    title: 'Dal social alla strada',
    description:
      "Le tessere del nostro diario di viaggio non restano pixel su uno schermo. Si trasformano in pin salvabili su una mappa interattiva pronta all'uso.",
    fieldNote: 'Dal reel alla scelta pratica: un click e la traccia è sul tuo telefono.',
    route: '/mappa',
    cta: 'Apri la Mappa',
    media: { type: 'video', src: '/video/reel-3.mp4' },
    theme: { bg: '#140f05', fog: '#241a08', light: '#ffe6a0', sparkle: '#f2c46b' },
  },
  {
    id: 'collaborazioni',
    kicker: '05 / Le Deviazioni',
    title: 'Fuori dai sentieri battuti',
    description:
      'Boutique hotel insoliti, glamping sotto le stelle, ristoranti a tema e borghi medievali nascosti. Questo è il DNA Travellini.',
    fieldNote: 'I viaggi più belli iniziano con le deviazioni improvvise.',
    route: '/esplora?tag=deviazioni',
    cta: 'Esplora i posti particolari',
    media: { type: 'video', src: '/video/reel-2.mp4' },
    theme: { bg: '#0b0d10', fog: '#141a20', light: '#dfe7ef', sparkle: '#cdd8e6' },
  },
  {
    id: 'finale',
    kicker: '06 / Il Cammino',
    title: 'Le tracce continuano con te',
    description:
      'Il nostro sentiero finisce qui, ma il tuo sta per iniziare. Scegli come portare il mondo di Rodrigo & Betta nel tuo prossimo viaggio.',
    fieldNote:
      'Lascia la tua email e ricevi la lettera delle tracce: dritte vere, prezzi reali, posti provati.',
    route: '/vieni-con-noi',
    cta: 'Inizia ora',
    media: { type: 'image', src: '/images/reels/reel-5-cover.webp' },
    theme: { bg: '#0b0805', fog: '#120d0a', light: '#ffd9b0', sparkle: '#e8a866' },
  },
];

const UP = new THREE.Vector3(0, 1, 0);

export const SENTIERO_STAGES: SentieroStage[] = RAW_STAGES.map((stage, i, arr) => {
  const t = (i + 0.7) / (arr.length + 0.4);
  // Posiziona la card leggermente più avanti rispetto al trigger t della telecamera,
  // così quando la telecamera si ferma a t, la card si trova di fronte ad essa ad una distanza confortevole.
  const tCard = Math.min(t + 0.05, 0.98);
  const base = SENTIERO_CURVE.getPointAt(tCard);
  const tangent = SENTIERO_CURVE.getTangentAt(tCard);
  const side = new THREE.Vector3().copy(tangent).cross(UP).normalize();
  // Ripristina il layout a zig-zag alternato (dir = 1 o -1).
  // La telecamera e l'HUD si allineeranno dinamicamente sul lato opposto per evitare collisioni.
  const dir = i % 2 === 0 ? 1 : -1;
  const pos = base
    .clone()
    .addScaledVector(side, 5.5 * dir)
    .add(new THREE.Vector3(0, 1.2, 0));
  return { ...stage, index: i, t, position: [pos.x, pos.y, pos.z] };
});

/** Tema neutro di partenza (prima della prima tappa). */
export const BASE_THEME: StageTheme = SENTIERO_STAGES[0].theme;

/** Lunghezza di scroll (in "pagine" da 100vh) per ScrollControls. */
export const SENTIERO_PAGES = SENTIERO_STAGES.length + 2;
