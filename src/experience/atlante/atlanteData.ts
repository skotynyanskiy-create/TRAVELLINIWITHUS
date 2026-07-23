import * as THREE from 'three';

export interface AtlanteWaypoint {
  id: string;
  index: number;
  t: number; // Curve offset parameter 0..1
  kicker: string;
  title: string;
  description: string;
  fieldNote: string;
  route: string;
  ctaText: string;
  media: {
    type: 'video' | 'image';
    src: string;
  };
  audioUrl?: string;
  theme: {
    bg: string;
    fog: string;
    light: string;
    sparkle: string;
  };
  position: [number, number, number];
}

// CatmullRomCurve3 winding path for the V2 Atlante camera spline
export const ATLANTE_CURVE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 8),
    new THREE.Vector3(-1.8, 0.4, -10),
    new THREE.Vector3(2.5, -0.6, -32),
    new THREE.Vector3(-3.0, 1.0, -58),
    new THREE.Vector3(3.5, 0.1, -84),
    new THREE.Vector3(-2.0, 0.8, -112),
    new THREE.Vector3(1.5, -0.5, -138),
    new THREE.Vector3(-2.8, 0.5, -164),
    new THREE.Vector3(0, 0, -190),
    new THREE.Vector3(0, 0, -212),
  ],
  false,
  'catmullrom',
  0.5
);

const RAW_WAYPOINTS = [
  {
    id: 'intro',
    kicker: "L'Atlante",
    title: 'Parti con noi.',
    description:
      'Dal 2018 viaggi su tracciati reali, racchiusi in un atlante vivente. Scorri per iniziare il cammino.',
    fieldNote: 'Nota di viaggio: Ogni tappa è stata vissuta e verificata di persona.',
    route: '/mappa',
    ctaText: 'Apri la Mappa',
    media: { type: 'image' as const, src: '/images/brand/couple-travel.webp' },
    theme: {
      bg: '#0b0805',
      fog: '#0b0805',
      light: '#f7f0e5',
      sparkle: '#c2410c',
    },
  },
  {
    id: 'noi',
    kicker: '01 / Chi Siamo',
    title: 'Rodrigo & Betta',
    description:
      'Un reel sui social ispira in un secondo. Una traccia reale ti aiuta a partire per davvero. Questo è il nostro metodo.',
    fieldNote: 'Chi siamo: Coppia nella vita e compagni di deviazioni dal 2018.',
    route: '/chi-siamo',
    ctaText: 'Il nostro metodo',
    media: { type: 'image' as const, src: '/images/brand/about-editorial.webp' },
    theme: {
      bg: '#14110f',
      fog: '#14110f',
      light: '#f7f0e5',
      sparkle: '#d97706',
    },
  },
  {
    id: 'puglia',
    kicker: '02 / Destinazioni',
    title: 'La Puglia vera',
    description:
      "Fuori dai tracciati battuti: trulli dimenticati nella Valle d'Itria, masserie nascoste e calette selvagge del Salento.",
    fieldNote: 'Puglia: Terra di calcare bianco, ulivi centenari e brezza adriatica.',
    route: '/esplora?region=puglia',
    ctaText: 'Esplora la Puglia',
    media: { type: 'video' as const, src: '/video/reel-1.mp4' },
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/123/123-200.wav',
    theme: {
      bg: '#241a12',
      fog: '#241a12',
      light: '#faf8f5',
      sparkle: '#c2410c',
    },
  },
  {
    id: 'dolomiti',
    kicker: '03 / Destinazioni',
    title: 'Dolomiti Slow',
    description:
      'Rifugi di design incastonati nella roccia e malghe silenziose dove fermare il tempo. Tre giorni di puro respiro alpino.',
    fieldNote: 'Alpi: Aria sottile, granito rosa al tramonto e profumo di pino silvestre.',
    route: '/esplora?region=dolomiti',
    ctaText: 'Trova i rifugi',
    media: { type: 'video' as const, src: '/video/reel-4.mp4' },
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-200.wav',
    theme: {
      bg: '#0f141a',
      fog: '#0f141a',
      light: '#e2e8f0',
      sparkle: '#38bdf8',
    },
  },
  {
    id: 'sicilia',
    kicker: '04 / Destinazioni',
    title: 'Sicilia Orientale',
    description:
      "Un viaggio sensoriale da Catania fino alle pendici laviche dell'Etna, passando per barocco, granite e calette vulcaniche.",
    fieldNote: 'Sicilia: Profumo di zagara, pietra lavica scura e sapore salmastro.',
    route: '/esplora?region=sicilia',
    ctaText: 'Vedi il percorso',
    media: { type: 'video' as const, src: '/video/reel-3.mp4' },
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/200/200-200.wav',
    theme: {
      bg: '#2d1b0d',
      fog: '#2d1b0d',
      light: '#fdf2e9',
      sparkle: '#f59e0b',
    },
  },
  {
    id: 'mappa',
    kicker: '05 / Il Prodotto',
    title: 'Mappa Interattiva',
    description:
      'Centinaia di punti geolocalizzati sul posto: dove dormire slow, dove mangiare locale e dove perdersi tra deviazioni autentiche.',
    fieldNote: 'Strumento: Filtra per tipologia ed esporta le tracce GPS sul tuo telefono.',
    route: '/mappa',
    ctaText: 'Apri la Mappa 3D',
    media: { type: 'image' as const, src: '/images/brand/collab-work.webp' }, // fallback
    theme: {
      bg: '#0d0d0c',
      fog: '#0d0d0c',
      light: '#f5f5f4',
      sparkle: '#a8a29e',
    },
  },
  {
    id: 'collaborazioni',
    kicker: '06 / Business',
    title: 'Lavoriamo Insieme',
    description:
      'Uniamo narrazione creativa, dati reali ed estetica premium per dare valore ai territori ed ai partner editoriali.',
    fieldNote: 'B2B: Scopri i nostri reportage, i tassi di engagement reali e il nostro Media Kit.',
    route: '/collaborazioni',
    ctaText: 'Lavora con R+B',
    media: { type: 'video' as const, src: '/video/reel-2.mp4' },
    theme: {
      bg: '#141416',
      fog: '#141416',
      light: '#f4f4f5',
      sparkle: '#a1a1aa',
    },
  },
  {
    id: 'shop',
    kicker: '07 / Monografia',
    title: "Guide d'Autore",
    description:
      "Le nostre mappe offline, itinerari pronti giorno per giorno e guide PDF complete. Entra in lista d'attesa per il lancio.",
    fieldNote: "Shop: In arrivo 1 SKU d'autore autunnale coperta da feedback diretto.",
    route: '/shop',
    ctaText: "Entra in lista d'attesa",
    media: { type: 'image' as const, src: '/images/reels/reel-5-cover.webp' }, // cover image
    theme: {
      bg: '#181210',
      fog: '#181210',
      light: '#fafaf9',
      sparkle: '#d97706',
    },
  },
  {
    id: 'outro',
    kicker: 'Il Tuo Turno',
    title: 'La strada ti aspetta.',
    description:
      'Iscriviti alla newsletter per ricevere le nuove tracce direttamente nella tua casella postale, oppure esplora subito la mappa.',
    fieldNote: 'Community: Unisciti ad oltre 1.200 viaggiatori curiosi.',
    route: '/mappa',
    ctaText: 'Esplora Mappa',
    media: { type: 'image' as const, src: '/images/brand/couple-travel.webp' },
    theme: {
      bg: '#0b0805',
      fog: '#0b0805',
      light: '#f7f0e5',
      sparkle: '#c2410c',
    },
  },
];

const UP = new THREE.Vector3(0, 1, 0);

export const ATLANTE_WAYPOINTS: AtlanteWaypoint[] = RAW_WAYPOINTS.map((stage, i, arr) => {
  const t = i / (arr.length - 1);
  // Posiziona il diorama leggermente spostato lateralmente rispetto alla spline per inquadratura obliqua
  const tCard = Math.min(t + 0.04, 0.98);
  const base = ATLANTE_CURVE.getPointAt(tCard);
  const tangent = ATLANTE_CURVE.getTangentAt(tCard);
  const side = new THREE.Vector3().copy(tangent).cross(UP).normalize();
  const dir = i % 2 === 0 ? 1 : -1;
  const pos = base
    .clone()
    .addScaledVector(side, 4.5 * dir)
    .add(new THREE.Vector3(0, 0.8, 0));

  return {
    ...stage,
    index: i,
    t,
    position: [pos.x, pos.y, pos.z],
  };
});
