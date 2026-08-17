import { useState, useMemo, useRef, useEffect, useCallback, useSyncExternalStore } from 'react';
import { useSearchParams } from 'react-router-dom';
import MapGL, {
  Marker,
  NavigationControl,
  FullscreenControl,
  type MapRef,
  type MarkerInstance,
} from 'react-map-gl/maplibre';
import {
  X,
  ArrowRight,
  Layers,
  RotateCcw,
  Search,
  Navigation,
  Hotel,
  UtensilsCrossed,
  Trees,
  Volume2,
  VolumeX,
  Shuffle,
  PanelLeftClose,
  PanelLeft,
  Gem,
  Sparkles,
  ChevronDown,
  MapPin,
  Filter,
  Loader2,
} from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { getGeocodedContentItems } from '@/src/config/contentLibrary';
import { getMapTypeForInterest, rankByInterest } from '@/src/config/audienceInterests';
import { usePersonalizedInterest } from '@/src/hooks/usePersonalizedInterest';
import { PARTNERSHIP_LABEL } from '@/src/types/content';
import type { ContentItem } from '@/src/types/content';
import { getUserLocation, sortPlacesByDistance, type UserLocation } from '@/src/utils/geo';
import { etichettaPrezzo } from '@/src/utils/format';
import { installOpenFreeMapStyleFallback } from '@/src/lib/openFreeMap';
import OptimizedImage from '../OptimizedImage';
import PlaceBusinessActions from '../PlaceBusinessActions';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLES = {
  dark: { label: 'Cinema Dark', url: 'https://tiles.openfreemap.org/styles/dark' },
  liberty: { label: 'Atlas Cream', url: 'https://tiles.openfreemap.org/styles/liberty' },
  bright: { label: 'Satellite Hybrid', url: 'https://tiles.openfreemap.org/styles/bright' },
};

/* Costante di modulo, non un oggetto letterale in JSX: `<MapGL>` chiama
   `setProps(props)` a ogni render (nessun array di dipendenze nel suo layout
   effect). `initialViewState` non e' fra le chiavi che il wrapper legge come
   "camera controllata" (solo `viewState`/`longitude`/`latitude`/`zoom` in
   cima ai props lo sono, e qui non ci sono), ma tenerlo qui elimina in radice
   ogni dubbio sull'identita' dell'oggetto passato ad ogni render. */
const INITIAL_VIEW_STATE = { longitude: 12.5, latitude: 42.0, zoom: 5.2, pitch: 35 };
const MAP_CANVAS_STYLE = { width: '100%', height: '100%' };

const FLY_PRESETS = [
  { id: 'toscana', label: 'Toscana', center: [11.86, 43.46], zoom: 9 },
  { id: 'puglia', label: 'Puglia', center: [17.24, 40.78], zoom: 9 },
  { id: 'verona', label: 'Verona', center: [10.99, 45.44], zoom: 11 },
  { id: 'milano', label: 'Milano', center: [9.19, 45.46], zoom: 11 },
  { id: 'dolomiti', label: 'Dolomiti', center: [11.66, 46.7], zoom: 9 },
  { id: 'praga', label: 'Praga', center: [14.43, 50.08], zoom: 11 },
  { id: 'madrid', label: 'Madrid', center: [-3.7, 40.42], zoom: 11 },
  { id: 'lofoten', label: 'Norvegia', center: [14.56, 68.23], zoom: 8 },
];

const TYPE_FILTERS = [
  { id: 'all', label: 'Tutti i tipi', icon: Sparkles },
  { id: 'hotel', label: 'Hotel & Alloggi', icon: Hotel },
  { id: 'food', label: 'Food & Ristoranti', icon: UtensilsCrossed },
  { id: 'insolito', label: 'Insolito', icon: Gem },
  { id: 'relax', label: 'Relax & Spa', icon: Trees },
];

/** Titolo italiano del canvas/regione mappa: senza questo maplibre-gl usa il
 *  default inglese "Map" — un audit lo aveva rilevato su un sito italiano. */
const MAP_LOCALE = { 'Map.Title': 'Mappa dei posti particolari' };

/** Nome accessibile di un marcatore: titolo + luogo, cosi' 104 pin non
 *  condividono tutti il default di maplibre-gl "Map marker". Va applicato
 *  imperativamente su `marker.getElement()` perche' quell'elemento e' creato
 *  da maplibre-gl stesso, fuori dall'albero React che rendiamo dentro di lui. */
function markerAccessibleName(item: ContentItem): string {
  const luogo = item.place.city || item.place.region || item.place.country;
  return luogo ? `${item.title}, ${luogo}` : item.title;
}

/** Coordinate valide di un item: fuori da qui nessuna funzione di
 *  geometria deve piu' preoccuparsi dell'opzionalita' del campo. */
type GeoPoint = { lat: number; lng: number };
function hasCoordinates(
  item: ContentItem
): item is ContentItem & { place: { coordinates: GeoPoint } } {
  return Boolean(item.place.coordinates);
}

/** I tre livelli della Direzione B (`docs/50_Scratch/DESIGN_mappa-densita.md`
 *  §3). La soglia a 8,5 e' dove i preset regionali della UI gia' lavorano
 *  (Toscana/Puglia/Dolomiti a z9); quella a 12 e' la soglia misurata sulla
 *  coppia di pin piu' stretta di Milano (§1.2): sotto, due nomi non si
 *  staccano mai nemmeno in verticale. */
type MapTier = 'territorio' | 'area' | 'posto';
const TERRITORY_MAX_ZOOM = 8.5;
const AREA_MAX_ZOOM = 12;

function tierForZoom(zoom: number): MapTier {
  if (zoom < TERRITORY_MAX_ZOOM) return 'territorio';
  if (zoom < AREA_MAX_ZOOM) return 'area';
  return 'posto';
}

/** Mai piu' di 60 marcatori DOM montati insieme (§7). A 109 posti geocodati
 *  di oggi non si tocca mai: e' un tetto dichiarato per il corpus che deve
 *  ancora arrivare, non un effetto collaterale. */
const MAX_MOUNTED_MARKERS = 60;

interface MapClusterGroup {
  key: string;
  label: string;
  members: ContentItem[];
  centroid: GeoPoint;
}

/** Chiave normalizzata di un gruppo (minuscole, senza spazi ne' trattini) +
 *  la grafia grezza dell'item, usata solo per contare le varianti. Il corpus
 *  arriva da geocodifica inversa Nominatim su 26 paesi, dove le varianti di
 *  grafia della stessa regione sono la norma, non l'eccezione — «Emilia
 *  Romagna» e «Emilia-Romagna» devono diventare un disco solo, non due.
 *  Nessuna citta'/regione risolta -> chiave propria, cosi' l'item resta un
 *  pin da solo invece di sparire in un gruppo fantasma (Regola A, "un gruppo
 *  da 1 non e' un gruppo"). */
function clusterKeyAndRawLabel(
  item: ContentItem,
  tier: 'territorio' | 'area'
): { key: string; rawLabel: string } {
  const rawLabel =
    tier === 'area'
      ? item.place.city
      : item.place.country.toLowerCase() === 'italia'
        ? item.place.region
        : item.place.country;
  if (!rawLabel) return { key: `pin:${item.id}`, rawLabel: item.title };
  return { key: `${tier}:${rawLabel.toLowerCase().replace(/[\s-]+/g, '')}`, rawLabel };
}

function buildClusterGroups(
  items: ContentItem[],
  tier: 'territorio' | 'area'
): { groups: MapClusterGroup[]; singles: ContentItem[] } {
  const buckets = new Map<string, { members: ContentItem[]; labelCounts: Map<string, number> }>();
  items.filter(hasCoordinates).forEach((item) => {
    const { key, rawLabel } = clusterKeyAndRawLabel(item, tier);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.members.push(item);
      bucket.labelCounts.set(rawLabel, (bucket.labelCounts.get(rawLabel) ?? 0) + 1);
    } else {
      buckets.set(key, { members: [item], labelCounts: new Map([[rawLabel, 1]]) });
    }
  });

  const groups: MapClusterGroup[] = [];
  const singles: ContentItem[] = [];
  buckets.forEach(({ members, labelCounts }, key) => {
    if (members.length === 1) {
      singles.push(members[0]);
      return;
    }
    // La grafia piu' frequente vince — non correggiamo solo il dato di oggi,
    // il raggruppamento regge da solo anche il prossimo import.
    let label = '';
    let bestCount = -1;
    labelCounts.forEach((count, candidate) => {
      if (count > bestCount) {
        bestCount = count;
        label = candidate;
      }
    });
    const centroid = members.reduce(
      (acc, member) => ({
        lat: acc.lat + member.place.coordinates!.lat / members.length,
        lng: acc.lng + member.place.coordinates!.lng / members.length,
      }),
      { lat: 0, lng: 0 }
    );
    groups.push({ key, label, members, centroid });
  });
  return { groups, singles };
}

/** Applica il tetto di §7 quando gruppi + pin singoli superano 60: priorita'
 *  a chi rappresenta piu' posti — un disco da 40 vale piu' di un pin isolato
 *  quando lo spazio DOM e' scarso. Sul corpus di oggi (109 geocodati) non
 *  scatta mai: e' li' per quando il corpus cresce, non per oggi. */
function capForClusters(
  groups: MapClusterGroup[],
  singles: ContentItem[]
): { groups: MapClusterGroup[]; singles: ContentItem[] } {
  if (groups.length + singles.length <= MAX_MOUNTED_MARKERS) return { groups, singles };
  const entities: { size: number; group?: MapClusterGroup; single?: ContentItem }[] = [
    ...groups.map((group) => ({ size: group.members.length, group })),
    ...singles.map((single) => ({ size: 1, single })),
  ];
  entities.sort((a, b) => b.size - a.size);
  const kept = entities.slice(0, MAX_MOUNTED_MARKERS);
  return {
    groups: kept.map((entity) => entity.group).filter((g): g is MapClusterGroup => Boolean(g)),
    singles: kept.map((entity) => entity.single).filter((s): s is ContentItem => Boolean(s)),
  };
}

/** Ordina per distanza dal centro dello schermo, non dal centro geografico:
 *  "chi guardi conta di piu'" (§3 Regola B, passo 1) e serve sia al tetto dei
 *  60 marcatori in tier "posto" sia all'ordine di assegnazione dei nomi. */
function sortByScreenDistance(items: ContentItem[], map: MapRef): ContentItem[] {
  const canvas = map.getCanvas();
  const cx = canvas.clientWidth / 2;
  const cy = canvas.clientHeight / 2;
  return [...items].sort((a, b) => {
    const pa = map.project([a.place.coordinates!.lng, a.place.coordinates!.lat]);
    const pb = map.project([b.place.coordinates!.lng, b.place.coordinates!.lat]);
    const da = (pa.x - cx) ** 2 + (pa.y - cy) ** 2;
    const db = (pb.x - cx) ** 2 + (pb.y - cy) ** 2;
    return da - db;
  });
}

/** Offset verticale fra la coordinata esatta e il fondo della pillola: 10px
 *  di punto (`h-2.5`, riga ~pin marker) + 14px di margine (`mb-3.5`). Se
 *  cambia il JSX del marcatore, aggiornare anche questi due numeri — la
 *  collisione della Regola B legge la geometria dichiarata qui, non il CSS. */
const POINT_TO_LABEL_GAP = 24;
const LABEL_HEIGHT = 30;

interface LabelRect {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

function labelRectFor(item: ContentItem, map: MapRef): LabelRect {
  const coords = item.place.coordinates!;
  const point = map.project([coords.lng, coords.lat]);
  // Larghezza della pillola (§1.1 misurato, §3 Regola B): 43px fissi
  // (padding + icona + gap + bordi) + fino a 120px di testo troncato.
  const width = 43 + Math.min(120, 7 * item.title.length);
  const bottom = point.y - POINT_TO_LABEL_GAP;
  return {
    x1: point.x - width / 2,
    x2: point.x + width / 2,
    y1: bottom - LABEL_HEIGHT,
    y2: bottom,
  };
}

function rectsCollide(a: LabelRect, b: LabelRect): boolean {
  return a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;
}

/** Regola B (§3): sopra z12 ogni pin e' un punto; il nome si guadagna per
 *  distanza dal centro e assenza di collisione, dentro un budget per
 *  viewport. `forcedIds` (selezionato + hover) lo ottengono sempre, "fuori
 *  budget", e la collisione non si applica MAI a loro — ma occupano comunque
 *  spazio nell'elenco dei rettangoli gia' piazzati, cosi' un pin normale non
 *  gli si sovrappone visivamente. */
function computeNamedPinIds(
  orderedPins: ContentItem[],
  map: MapRef,
  budget: number,
  forcedIds: Set<string>
): Set<string> {
  const named = new Set<string>();
  const rects: LabelRect[] = [];

  orderedPins.forEach((item) => {
    if (!forcedIds.has(item.id)) return;
    rects.push(labelRectFor(item, map));
    named.add(item.id);
  });

  let used = 0;
  for (const item of orderedPins) {
    if (used >= budget) break;
    if (forcedIds.has(item.id)) continue;
    const rect = labelRectFor(item, map);
    if (rects.some((placed) => rectsCollide(rect, placed))) continue;
    rects.push(rect);
    named.add(item.id);
    used += 1;
  }

  return named;
}

/** Il pin selezionato va disegnato per ultimo (§5): `.maplibregl-marker`
 *  apre un contesto di impilamento, quindi a decidere chi riceve il click
 *  fra due marcatori sovrapposti e' l'ordine nel DOM. */
function withSelectedLast(items: ContentItem[], selectedId?: string): ContentItem[] {
  if (!selectedId) return items;
  const index = items.findIndex((item) => item.id === selectedId);
  if (index === -1 || index === items.length - 1) return items;
  const reordered = items.slice();
  const [selected] = reordered.splice(index, 1);
  reordered.push(selected);
  return reordered;
}

/** Riquadro min/max di un insieme di coordinate, formato `LngLatBoundsLike`
 *  di maplibre-gl (sw poi ne). Usato sia dal bounds iniziale dell'archivio
 *  (D3) sia dal fly-to di un disco che si apre (§5). */
/**
 * Riquadro che copre il **grosso** dell'archivio, non i suoi estremi.
 *
 * `boundsFromCoords` prende min e max, ed e' giusto per volare su un gruppo.
 * Per la vista d'apertura no: l'archivio ha 81 posti in Italia e 28 sparsi in
 * dieci paesi — Norvegia, Malesia, Shanghai, Cancun — quindi «tutto» significa
 * quasi l'intero pianeta, e la mappa si apriva su un mappamondo dove i posti
 * erano un grumo illeggibile. Misurato il 2026-08-17.
 *
 * Qui si scartano le code (10% per lato su ciascun asse) e si inquadra dove
 * l'archivio e' denso. **Non e' «apri sull'Italia»**: e' una regola sulla
 * distribuzione, non sulla geografia, e resta vera se domani il corpus diventa
 * per meta' asiatico. I posti fuori inquadratura non spariscono — sono a una
 * gesto di distanza, e il conteggio in testata li nomina comunque.
 */
function boundsDelNucleo(
  coordsList: GeoPoint[],
  codaScartata = 0.1
): [[number, number], [number, number]] {
  if (coordsList.length < 5) return boundsFromCoords(coordsList);
  const percentile = (valori: number[], p: number) => {
    const ordinati = [...valori].sort((a, b) => a - b);
    return ordinati[Math.min(ordinati.length - 1, Math.floor(ordinati.length * p))];
  };
  const lng = coordsList.map((c) => c.lng);
  const lat = coordsList.map((c) => c.lat);
  return [
    [percentile(lng, codaScartata), percentile(lat, codaScartata)],
    [percentile(lng, 1 - codaScartata), percentile(lat, 1 - codaScartata)],
  ];
}

function boundsFromCoords(coordsList: GeoPoint[]): [[number, number], [number, number]] {
  let west = coordsList[0].lng;
  let east = coordsList[0].lng;
  let south = coordsList[0].lat;
  let north = coordsList[0].lat;
  coordsList.forEach((c) => {
    west = Math.min(west, c.lng);
    east = Math.max(east, c.lng);
    south = Math.min(south, c.lat);
    north = Math.max(north, c.lat);
  });
  return [
    [west, south],
    [east, north],
  ];
}

/** Quanto si separerebbero i membri di un gruppo se si zoomasse al massimo
 *  possibile: estrapola la distanza in pixel alla proiezione attuale invece
 *  di spostare davvero la camera (nessun effetto collaterale). Sotto i due
 *  soglie non serve muoversi: il tap sarebbe un gesto morto (§5, "il caso
 *  terminale"). */
function projectedSizeAtMaxZoom(
  map: MapRef,
  coordsList: GeoPoint[]
): { width: number; height: number } {
  const scale = 2 ** (map.getMaxZoom() - map.getZoom());
  const points = coordsList.map((c) => map.project([c.lng, c.lat]));
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    width: (Math.max(...xs) - Math.min(...xs)) * scale,
    height: (Math.max(...ys) - Math.min(...ys)) * scale,
  };
}

/** Tre misure discrete, non un'area proporzionale (§4): il cerchio
 *  proporzionale legge come data-viz, ed e' vietata sulle pagine pubbliche. */
function discSizeClasses(count: number): { box: string; text: string } {
  if (count >= 50) return { box: 'h-12 w-12', text: 'text-base' };
  if (count >= 10) return { box: 'h-10 w-10', text: 'text-sm' };
  return { box: 'h-8 w-8', text: 'text-xs' };
}

/** Budget dei nomi per larghezza viewport (§3 D2 = a): 3 sotto i 375px, 5
 *  fino a 1024, 8 sopra. */
function getNameBudget(width: number): 3 | 5 | 8 {
  if (width <= 375) return 3;
  if (width < 1024) return 5;
  return 8;
}

const subscribeViewportWidth = (onChange: () => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('resize', onChange);
  return () => window.removeEventListener('resize', onChange);
};

const getViewportWidthSnapshot = () => (typeof window !== 'undefined' ? window.innerWidth : 1024);

const BUDGET_FILTERS = [
  { id: 'all', label: 'Qualsiasi budget' },
  { id: 'basso', label: '€ Basso' },
  { id: 'medio', label: '€€ Medio' },
  { id: 'alto', label: '€€€ Alto' },
];

// Soglia oltre la quale elenco, pannello filtri e scheda ci stanno davvero tutti.
// Guarda anche l'altezza, non solo la larghezza: sopra la mappa stanno navbar,
// testata, barra controlli e pannello, e su uno schermo 1024x640 alla scheda
// resterebbero 91px — una fessura. Sotto la soglia elenco e pannello cedono il
// posto alla scheda, come gia' fanno sui telefoni.
const DESKTOP_QUERY = '(min-width: 1024px) and (min-height: 800px)';

const subscribeDesktop = (onChange: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
};

const getDesktopSnapshot = () =>
  typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;

export default function FullScreenMapExperience() {
  const { interest } = usePersonalizedInterest();
  const mapRef = useRef<MapRef>(null);
  const setMapRef = useCallback((instance: MapRef | null) => {
    mapRef.current = instance;
    if (instance) installOpenFreeMapStyleFallback(instance.getMap());
  }, []);
  const [mapReady, setMapReady] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  /* Un solo posto alla volta puo' essere sotto il puntatore, quindi
     l'anteprima e' una sola. Prima ogni marcatore portava la propria, nascosta
     da `group-hover:block`: misurato il 2026-08-15, 17 nodi DOM per marcatore
     — 1.882 su 2.476 dell'intera pagina, il 76% — di cui ~8 erano l'anteprima
     che nessuno stava guardando, con 160 fra `img` e `picture` montate. */
  const [hoveredItem, setHoveredItem] = useState<ContentItem | null>(null);
  const [mapStyleKey, setMapStyleKey] = useState<'dark' | 'liberty' | 'bright'>('dark');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const initializedInterestRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (initializedInterestRef.current === interest) return;
    initializedInterestRef.current = interest;
    setSelectedType(getMapTypeForInterest(interest));
  }, [interest]);

  // La sfumatura in fondo alla descrizione va mostrata SOLO se sotto il taglio
  // c'e' davvero altro testo: se la descrizione entra tutta, smorzare l'ultima
  // riga non dice «continua», sembra un difetto di resa.
  const descrizioneRef = useRef<HTMLDivElement>(null);
  const [descrizioneScorre, setDescrizioneScorre] = useState(false);

  // Solo posti con coordinate reali: un fallback regionale (rimosso) faceva
  // atterrare una churrería di Madrid in mezzo all'Italia. Meglio un posto
  // assente dalla mappa che uno nel posto sbagliato.
  const allItems = useMemo(
    () => rankByInterest(getGeocodedContentItems(), interest, (item) => item.types),
    [interest]
  );

  const completeCount = useMemo(
    () => allItems.filter((item) => !item.isPlaceholder).length,
    [allItems]
  );

  /* D3: il riquadro che copre tutto l'archivio geocodato, non filtrato. Il
     primo caricamento vola qui UNA sola volta (§0), e il tasto reset torna
     sempre qui — mai a coordinate fisse [12.5, 42.0], che puntavano sul Lazio
     mentre il baricentro reale del corpus e' al Nord (§1.3). */
  const homeBounds = useMemo(() => {
    const coords = allItems.filter(hasCoordinates).map((item) => item.place.coordinates);
    return coords.length > 0 ? boundsDelNucleo(coords) : null;
  }, [allItems]);

  const [userLoc, setUserLoc] = useState<UserLocation | null>(null);
  const [locLoading, setLocLoading] = useState<boolean>(false);

  const handleUserLocation = useCallback(async () => {
    if (userLoc) {
      setUserLoc(null);
      return;
    }
    setLocLoading(true);
    try {
      const loc = await getUserLocation();
      setUserLoc(loc);
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [loc.longitude, loc.latitude],
          zoom: 10.5,
          pitch: 45,
          duration: 2000,
        });
      }
    } catch {
      // Geolocalizzazione fallita o permessi negati
    } finally {
      setLocLoading(false);
    }
  }, [userLoc]);

  // Filtered List
  const filteredItems = useMemo(() => {
    const items = allItems.filter((item) => {
      const matchZone =
        selectedZone === 'all' || item.zone.toLowerCase() === selectedZone.toLowerCase();
      const matchType =
        selectedType === 'all' ||
        item.types.some((t) => t.toLowerCase().includes(selectedType.toLowerCase()));
      const matchBudget =
        selectedBudget === 'all' ||
        (item.value?.budget && item.value.budget.toLowerCase() === selectedBudget.toLowerCase());
      const matchQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.place.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.place.region && item.place.region.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchZone && matchType && matchBudget && matchQuery;
    });

    if (userLoc) {
      return sortPlacesByDistance(items, userLoc);
    }
    return items;
  }, [allItems, selectedZone, selectedType, selectedBudget, searchQuery, userLoc]);

  /* Zoom e riquadro correnti, aggiornati su `moveend` (non su `move`, con
     debounce 150ms — §6): governano sia il tier (§3) sia `visibleItems`.
     `bounds: null` prima del primo caricamento vuol dire "non ancora
     misurato", non "vuoto": `visibleItems` ripiega su `filteredItems` finche'
     non arriva la prima misura vera. */
  const [viewportState, setViewportState] = useState<{
    zoom: number;
    bounds: [number, number, number, number] | null;
  }>({ zoom: 5.2, bounds: null });

  const updateViewport = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const bounds = map.getBounds();
    setViewportState({
      zoom: map.getZoom(),
      bounds: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
    });
  }, []);

  const moveEndTimerRef = useRef<number | null>(null);
  const handleMoveEnd = useCallback(() => {
    if (moveEndTimerRef.current !== null) window.clearTimeout(moveEndTimerRef.current);
    moveEndTimerRef.current = window.setTimeout(updateViewport, 150);
  }, [updateViewport]);

  const handleMapLoad = useCallback(() => {
    setMapReady(true);
    updateViewport();
  }, [updateViewport]);
  useEffect(
    () => () => {
      if (moveEndTimerRef.current !== null) window.clearTimeout(moveEndTimerRef.current);
    },
    []
  );

  /* filteredItems ∩ bounds attuali (§6): base di marcatori, dischi ed elenco
     laterale. `filteredItems` da solo resta la base del contatore e di
     «Sorprendimi» — legarli al viewport li farebbe mentire o sorprendere con
     quello che si ha gia' davanti. */
  const visibleItems = useMemo(() => {
    if (!viewportState.bounds) return filteredItems;
    const [west, south, east, north] = viewportState.bounds;
    const wraps = west > east; // il globo puo' attraversare l'antimeridiano
    return filteredItems.filter((item) => {
      const coords = item.place.coordinates;
      if (!coords) return false;
      const lngOk = wraps
        ? coords.lng >= west || coords.lng <= east
        : coords.lng >= west && coords.lng <= east;
      return lngOk && coords.lat >= south && coords.lat <= north;
    });
  }, [filteredItems, viewportState.bounds]);

  /* Il disco che non separa allo zoom apre l'elenco filtrato sui suoi membri
     (§5, D4 = a): il tap non deve morire in silenzio. Si svuota quando la
     scheda si chiude o cambia un filtro — altrimenti l'elenco resterebbe
     bloccato su un gruppo che l'utente ha gia' lasciato. */
  const [pinnedGroup, setPinnedGroup] = useState<{ label: string; members: ContentItem[] } | null>(
    null
  );
  const listItems = pinnedGroup ? pinnedGroup.members : visibleItems;

  // Web Audio API Synthetic Chime Feedback
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } catch {
      // Audio context silently suppressed if non-interactive
    }
  }, [soundEnabled]);

  // Handle Pin Selection with Fly-To & Chime
  const handlePinClick = useCallback(
    (item: ContentItem) => {
      setSelectedItem(item);
      playChime();
      // Il posto selezionato finisce nell'URL: qualunque scheda aperta diventa
      // condivisibile. `replace` perche' sfogliare la mappa non deve riempire
      // la cronologia — il tasto indietro riporta da dove si e' arrivati.
      setSearchParams({ posto: item.id }, { replace: true });
      if (mapRef.current && item.place.coordinates) {
        mapRef.current.flyTo({
          center: [item.place.coordinates.lng, item.place.coordinates.lat],
          zoom: 12.5,
          pitch: 50,
          duration: 1800,
        });
      }
    },
    [playChime, setSearchParams]
  );

  /**
   * Deep-link `/mappa?posto=<id>`: il globo atterra sul posto invece di
   * comparirci sopra. Serve al «Sorprendimi» della home, e di suo rende
   * condivisibile un singolo posto — utile per mandare a un partner il link
   * diretto alla sua scheda sul globo.
   *
   * Si aspetta il `load` della mappa: `flyTo` prima che il globo esista non
   * fa nulla e il deep-link si perderebbe in silenzio. Gira una volta sola —
   * dopo, la selezione è dell'utente e non va scavalcata a ogni render.
   */
  const postoParam = searchParams.get('posto');
  const deepLinkFatto = useRef(false);

  useEffect(() => {
    if (!mapReady || deepLinkFatto.current || !postoParam) return;
    const item = allItems.find((candidate) => candidate.id === postoParam);
    if (!item) return;
    deepLinkFatto.current = true;
    handlePinClick(item);
  }, [mapReady, postoParam, allItems, handlePinClick]);

  /* D3: l'inquadratura iniziale descrive l'archivio invece di dichiarare una
     geografia. Gira una volta sola al primo caricamento — dopo, e' l'utente
     a decidere dove guardare. Eccezione: un deep-link `?posto=<id>` vince
     sempre, e qui basta che il parametro esista (non serve che risolva a un
     item valido: quello lo decide l'effetto sopra). */
  const initialFitFatto = useRef(false);
  useEffect(() => {
    if (!mapReady || initialFitFatto.current) return;
    initialFitFatto.current = true;
    updateViewport();
    if (postoParam) return;
    if (!homeBounds || !mapRef.current) return;
    mapRef.current.fitBounds(homeBounds, { padding: 80, duration: 0 });
    updateViewport();
  }, [mapReady, postoParam, homeBounds, updateViewport]);

  // `ResizeObserver` e non una misura secca: l'area cambia altezza sia quando
  // si apre un altro posto (descrizioni da 130 a 305 caratteri) sia quando si
  // ridimensiona la finestra, e la sfumatura deve seguire entrambi.
  useEffect(() => {
    const area = descrizioneRef.current;
    if (!area) {
      setDescrizioneScorre(false);
      return;
    }
    const misura = () => setDescrizioneScorre(area.scrollHeight > area.clientHeight + 1);
    misura();
    const osservatore = new ResizeObserver(misura);
    osservatore.observe(area);
    return () => osservatore.disconnect();
  }, [selectedItem]);

  // Preset Fly-To
  const handlePresetFly = useCallback(
    (preset: (typeof FLY_PRESETS)[number]) => {
      playChime();
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [preset.center[0], preset.center[1]],
          zoom: preset.zoom,
          pitch: 45,
          duration: 2000,
        });
      }
    },
    [playChime]
  );

  // Random "Sorprendimi!" 3D Surprise Picker
  const handleSurprisePick = useCallback(() => {
    if (filteredItems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredItems.length);
    const randomItem = filteredItems[randomIndex];
    handlePinClick(randomItem);
  }, [filteredItems, handlePinClick]);

  // Reset Camera View — torna sempre al riquadro dell'archivio (D3), non a
  // coordinate fisse: `fitBounds` sullo stesso `homeBounds` riproduce la
  // stessa inquadratura anche se la finestra e' stata ridimensionata nel
  // frattempo, cosa che una camera congelata non farebbe.
  const resetView = useCallback(() => {
    setSelectedZone('all');
    setSelectedType('all');
    setSelectedBudget('all');
    setSearchQuery('');
    setSelectedItem(null);
    setPinnedGroup(null);
    if (mapRef.current && homeBounds) {
      mapRef.current.fitBounds(homeBounds, { padding: 80, duration: 1500 });
    }
  }, [homeBounds]);

  const getItemIcon = (types: string[]) => {
    const mainType = types[0]?.toLowerCase() || '';
    if (mainType.includes('hotel')) return Hotel;
    if (mainType.includes('food') || mainType.includes('ristoranti')) return UtensilsCrossed;
    if (mainType.includes('insolito')) return Gem;
    if (mainType.includes('relax') || mainType.includes('spa')) return Sparkles;
    return Trees;
  };

  // Active filter count for badge
  const activeFilterCount = [
    selectedZone !== 'all',
    selectedType !== 'all',
    selectedBudget !== 'all',
    searchQuery.trim() !== '',
  ].filter(Boolean).length;

  // Dropdown state for type/budget
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const isDesktop = useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, () => false);

  // Budget dei nomi (§3 D2 = a): 3/5/8 per larghezza viewport.
  const viewportWidth = useSyncExternalStore(
    subscribeViewportWidth,
    getViewportWidthSnapshot,
    () => 1024
  );
  const nameBudget = getNameBudget(viewportWidth);

  // Sotto i 1024px elenco e pannello filtri non ci stanno affiancati alla scheda:
  // cedono il posto. La soglia vive qui e non in una classe `max-lg:hidden`, cosi'
  // etichette e stato dei bottoni raccontano quello che si vede davvero.
  const listVisible = sidebarOpen && (isDesktop || !selectedItem);
  const filtersVisible = showFiltersPanel && (isDesktop || !selectedItem);

  const toggleList = useCallback(() => {
    setPinnedGroup(null);
    if (listVisible) {
      setSidebarOpen(false);
      return;
    }
    setSidebarOpen(true);
    if (!isDesktop) setSelectedItem(null);
  }, [listVisible, isDesktop]);

  const toggleFilters = useCallback(() => {
    if (filtersVisible) {
      setShowFiltersPanel(false);
      return;
    }
    setShowFiltersPanel(true);
    if (!isDesktop) setSelectedItem(null);
  }, [filtersVisible, isDesktop]);

  // Un gruppo agganciato all'elenco (D4) e' una vista transitoria: un
  // cambio di filtro e' un cambio d'intenzione esplicito e la sostituisce,
  // altrimenti l'elenco resterebbe bloccato su un gruppo che non esiste piu'
  // nel nuovo risultato filtrato.
  const primaEsecuzioneFiltri = useRef(true);
  useEffect(() => {
    if (primaEsecuzioneFiltri.current) {
      primaEsecuzioneFiltri.current = false;
      return;
    }
    setPinnedGroup(null);
  }, [selectedZone, selectedType, selectedBudget, searchQuery]);

  // Tap su un disco (§5, D4 = a): se lo zoom massimo non separerebbe i
  // membri, il tap aprirebbe un gesto morto — si apre l'elenco filtrato sul
  // gruppo invece di inseguire uno zoom che non risolve nulla.
  const handleGroupClick = useCallback(
    (group: MapClusterGroup) => {
      const map = mapRef.current;
      if (!map) return;
      const coordsList = group.members.filter(hasCoordinates).map((m) => m.place.coordinates);
      if (coordsList.length === 0) return;
      playChime();
      const { width, height } = projectedSizeAtMaxZoom(map, coordsList);
      if (width < 40 && height < 40) {
        setPinnedGroup({ label: group.label, members: group.members });
        setSidebarOpen(true);
        if (!isDesktop) setSelectedItem(null);
        return;
      }
      map.fitBounds(boundsFromCoords(coordsList), { padding: 80, duration: 1200 });
    },
    [playChime, isDesktop]
  );

  /* Marcatori da montare per il tier corrente (§3, §7). Tutto qui dipende
     da `viewportState`, che si aggiorna solo su `moveend` con debounce: la
     mappa non ricalcola gruppi e nomi a ogni frame di pan. */
  const tier = tierForZoom(viewportState.zoom);

  const clusterEntities = useMemo(() => {
    if (tier === 'posto') return { groups: [] as MapClusterGroup[], singles: [] as ContentItem[] };
    const built = buildClusterGroups(visibleItems, tier);
    return capForClusters(built.groups, built.singles);
  }, [visibleItems, tier]);

  // `visibleItems` cambia riferimento a ogni `moveend` (§6: il riquadro e'
  // sempre un nuovo array), quindi trascina gia' con se' il ricalcolo che
  // altrimenti servirebbe da `viewportState` direttamente.
  const postoPins = useMemo(() => {
    if (tier !== 'posto') return [] as ContentItem[];
    const withCoords = visibleItems.filter(hasCoordinates);
    const map = mapReady ? mapRef.current : null;
    const ordered = map ? sortByScreenDistance(withCoords, map) : withCoords;
    return ordered.slice(0, MAX_MOUNTED_MARKERS);
  }, [visibleItems, tier, mapReady]);

  const namedPinIds = useMemo(() => {
    const forced = new Set<string>();
    if (selectedItem) forced.add(selectedItem.id);
    if (hoveredItem) forced.add(hoveredItem.id);
    const map = mapReady ? mapRef.current : null;
    if (tier !== 'posto' || !map) return forced;
    return computeNamedPinIds(postoPins, map, nameBudget, forced);
  }, [tier, postoPins, mapReady, selectedItem, hoveredItem, nameBudget]);

  const paintedPostoPins = useMemo(
    () => withSelectedLast(postoPins, selectedItem?.id),
    [postoPins, selectedItem]
  );
  const paintedSingles = useMemo(
    () => withSelectedLast(clusterEntities.singles, selectedItem?.id),
    [clusterEntities.singles, selectedItem]
  );
  const paintedPins = tier === 'posto' ? paintedPostoPins : paintedSingles;

  // La navbar e' fixed (z-50) e alta 67-77px a seconda del breakpoint: senza il margine
  // la barra dei filtri (z-40, top-6) finisce sepolta sotto di lei.
  return (
    <div className="mt-28 flex h-[calc(100dvh-112px)] w-full flex-col overflow-hidden bg-[#0a0705]">
      <header className="shrink-0 px-4 pb-3 pt-5 sm:px-8 sm:pb-4 sm:pt-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
          Mappa dei posti particolari
        </span>
        <h1 className="mt-1.5 font-serif text-2xl font-medium leading-tight text-white sm:text-3xl">
          Dove siamo stati davvero
        </h1>
        {/* Il deck dichiara anche lo stato delle schede: promettere 40 posti
            provati e aprirne uno vuoto e' la stessa frattura che il resto del
            lavoro sta chiudendo. Le due cifre separate usano lo stesso
            vocabolario dell'indice in home — «complete» / «in lavorazione» —
            perche' un visitatore che passa da home, indice, mappa ed esplora
            incontrava quattro numeri diversi per lo stesso archivio. */}
        <p className="mt-1.5 hidden text-sm text-white/60 sm:block">
          {allItems.length} posti che abbiamo visitato di persona
          {completeCount < allItems.length
            ? `, ${completeCount} con la scheda completa. Le altre si riempiono una alla volta.`
            : '.'}
        </p>
      </header>

      <div className="relative min-h-0 flex-1">
        {/* 1. Colonna flottante: barra, pannello filtri ed elenco stanno nello stesso
            flusso verticale, cosi' nessuno dei tre puo' coprire gli altri quando la
            barra dei controlli va a capo. */}
        <div className="pointer-events-none absolute inset-x-4 top-6 bottom-16 z-40 flex flex-col gap-3 sm:inset-x-8 sm:bottom-6">
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search & Main Filters Group */}
            <div className="flex flex-wrap items-center gap-2 rounded-full border border-stone-700 bg-stone-900/95 p-2.5 shadow-2xl backdrop-blur-2xl pointer-events-auto">
              {/* Sidebar Toggle Button */}
              <button
                type="button"
                onClick={toggleList}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  listVisible
                    ? 'bg-[var(--color-accent,#c85a32)] text-[var(--color-ink)] shadow-md'
                    : 'bg-stone-800 text-white/90 hover:bg-stone-700'
                }`}
                title={listVisible ? 'Chiudi elenco' : 'Apri elenco posti'}
              >
                {listVisible ? <PanelLeftClose size={15} /> : <PanelLeft size={15} />}
                <span>{listVisible ? 'Chiudi Elenco' : 'Elenco Posti'}</span>
              </button>

              <div className="h-4 w-px bg-white/20" />

              {/* Live Search Input */}
              <div className="relative flex items-center pl-2 pr-1">
                <Search size={15} className="text-[var(--color-accent,#c85a32)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca un posto o regione..."
                  className="w-36 bg-transparent px-2 py-1 text-xs font-semibold text-white placeholder-stone-400 focus:outline-none sm:w-52"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-white/60 hover:text-white"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="h-4 w-px bg-white/20 hidden sm:block" />

              {/* Zone Filter Pills */}
              {[
                { id: 'all', label: 'Tutte' },
                { id: 'italia', label: 'Italia' },
                { id: 'europa', label: 'Europa' },
                { id: 'africa', label: 'Africa' },
                { id: 'asia', label: 'Asia' },
              ].map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZone(zone.id)}
                  className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                    selectedZone === zone.id
                      ? 'bg-[var(--color-accent,#c85a32)] text-[var(--color-ink)] shadow-md'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                  }`}
                >
                  {zone.label}
                </button>
              ))}

              <div className="h-4 w-px bg-white/20" />

              {/* Type & Budget Filter Toggle */}
              <button
                type="button"
                onClick={toggleFilters}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  filtersVisible || selectedType !== 'all' || selectedBudget !== 'all'
                    ? 'bg-[var(--color-accent,#c85a32)] text-[var(--color-ink)] shadow-md'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                }`}
              >
                <Filter size={13} />
                <span>Filtri</span>
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black text-[var(--color-accent-text)]">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown
                  size={12}
                  className={`transition-transform ${filtersVisible ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {/* Action Tools & Surprises Bar */}
            <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
              {/* Quick Fly Presets — scrollable on mobile */}
              <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-stone-700 bg-stone-900/95 p-1.5 shadow-2xl backdrop-blur-2xl max-w-[calc(100vw-120px)] sm:max-w-none scrollbar-none">
                {FLY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetFly(preset)}
                    className="shrink-0 rounded-full bg-stone-800 px-3 py-1 text-xs font-semibold text-stone-200 hover:bg-[var(--color-accent,#c85a32)] hover:text-[var(--color-ink)] transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* User Location / Vicino a me Button */}
              <button
                type="button"
                onClick={handleUserLocation}
                disabled={locLoading}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold shadow-2xl transition-all ${
                  userLoc
                    ? 'border-amber-500 bg-amber-600 text-white'
                    : 'border-stone-700 bg-stone-900/95 text-stone-200 hover:bg-stone-800 hover:text-white'
                }`}
                title={userLoc ? 'Disattiva Vicino a me' : 'Trova posti vicini a te'}
              >
                {locLoading ? (
                  <Loader2 size={14} className="animate-spin text-amber-400" />
                ) : (
                  <Navigation size={14} className={userLoc ? 'fill-current' : ''} />
                )}
                <span>{userLoc ? 'Vicino a me' : 'Vicino a me'}</span>
              </button>

              {/* "Sorprendimi!" Surprise Button */}
              <button
                type="button"
                onClick={handleSurprisePick}
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-[var(--color-accent,#c85a32)] px-4 py-2 text-xs font-bold text-[var(--color-ink)] shadow-2xl transition-all hover:scale-105 hover:bg-white hover:text-stone-900"
              >
                <Shuffle size={14} />
                <span className="hidden sm:inline">Sorprendimi!</span>
              </button>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled((s) => !s)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 bg-stone-900/95 text-white shadow-2xl backdrop-blur-2xl transition-all hover:bg-stone-800"
                title={soundEnabled ? 'Disattiva audio acustico' : 'Attiva audio acustico'}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Map Style Switcher */}
              <button
                type="button"
                onClick={() =>
                  setMapStyleKey((s) =>
                    s === 'dark' ? 'liberty' : s === 'liberty' ? 'bright' : 'dark'
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 bg-stone-900/95 text-white shadow-2xl backdrop-blur-2xl transition-all hover:bg-stone-800"
                title={`Stile: ${MAP_STYLES[mapStyleKey].label}`}
              >
                <Layers size={16} />
              </button>

              {/* Reset Camera Button */}
              <button
                type="button"
                onClick={resetView}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 bg-stone-900/95 text-white shadow-2xl backdrop-blur-2xl transition-all hover:bg-stone-800"
                title="Reset vista"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* 1b. Filters Panel (Type + Budget) */}
          {filtersVisible && (
            <div className="pointer-events-auto flex shrink-0 flex-col gap-3 rounded-2xl border border-stone-700 bg-stone-900/95 p-4 shadow-2xl backdrop-blur-2xl sm:flex-row sm:items-center">
              {/* Type Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 mr-1">
                  Tipo:
                </span>
                {TYPE_FILTERS.map((tf) => {
                  const Icon = tf.icon;
                  return (
                    <button
                      key={tf.id}
                      type="button"
                      onClick={() => setSelectedType(tf.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                        selectedType === tf.id
                          ? 'bg-[var(--color-accent,#c85a32)] text-[var(--color-ink)] shadow-md'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                      }`}
                    >
                      <Icon size={12} />
                      {tf.label}
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:block h-6 w-px bg-white/15" />

              {/* Budget Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 mr-1">
                  Budget:
                </span>
                {BUDGET_FILTERS.map((bf) => (
                  <button
                    key={bf.id}
                    type="button"
                    onClick={() => setSelectedBudget(bf.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                      selectedBudget === bf.id
                        ? 'bg-[var(--color-accent,#c85a32)] text-[var(--color-ink)] shadow-md'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                    }`}
                  >
                    {bf.label}
                  </button>
                ))}
              </div>

              {/* Results count — disambiguato da "In vista" dell'elenco:
                  questo conta i filtri, non il riquadro visibile, e i due
                  numeri possono legittimamente divergere. */}
              <div className="ml-auto flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-accent-text)]">
                  <MapPin size={13} />
                  {filteredItems.length} posti con questi filtri
                </span>
              </div>
            </div>
          )}

          {/* 2. Collapsible Split View Sidebar — flex-1: si ferma al fondo della mappa
            invece di partire da un top fisso che finiva sotto la barra. */}
          {listVisible && (
            <div className="pointer-events-auto w-84 min-h-0 flex-1 overflow-y-auto rounded-[var(--radius-lg,24px)] border border-stone-700 bg-stone-900/95 p-4 text-white shadow-2xl backdrop-blur-2xl max-sm:max-w-[calc(100%-3.5rem)] sm:w-96 sm:max-w-full">
              <div className="mb-4 flex items-center justify-between border-b border-stone-800 pb-3">
                {/* "In vista" e non "Destinazioni Provate": legato al
                    riquadro visibile (§6), il vecchio titolo diventava falso
                    non appena l'elenco smetteva di coincidere coi filtri. */}
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
                  {pinnedGroup
                    ? `${pinnedGroup.label} · ${pinnedGroup.members.length} posti`
                    : `In vista · ${visibleItems.length} posti`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSidebarOpen(false);
                    setPinnedGroup(null);
                  }}
                  className="text-stone-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {pinnedGroup && (
                <button
                  type="button"
                  onClick={() => setPinnedGroup(null)}
                  className="mb-3 text-[11px] font-semibold text-stone-400 hover:text-white"
                >
                  ← Torna alla vista
                </button>
              )}

              {listItems.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <p className="text-sm text-stone-300">
                    Qui non siamo ancora stati. Sposta la mappa o togli un filtro.
                  </p>
                  <button
                    type="button"
                    onClick={resetView}
                    className="rounded-full bg-[var(--color-accent,#c85a32)] px-4 py-2 text-xs font-bold text-[var(--color-ink)] shadow-md transition-all hover:bg-white"
                  >
                    Reset vista
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {listItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handlePinClick(item)}
                      className={`w-full text-left rounded-xl p-3 border transition-all ${
                        selectedItem?.id === item.id
                          ? 'border-[var(--color-accent,#c85a32)] bg-[var(--color-accent,#c85a32)]/25 text-[var(--color-ink)] shadow-lg'
                          : 'border-stone-800 bg-stone-800/60 hover:border-stone-600 text-stone-200 hover:text-white'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-accent-text)]">
                        {item.zone} · {item.place.region || item.place.country}
                      </div>
                      <h4 className="mt-1 font-serif text-sm font-normal text-white">
                        {item.title}
                      </h4>
                      <span className="mt-2 block text-[10px] text-stone-400">
                        {etichettaPrezzo(item)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Map Canvas */}
        <MapGL
          ref={setMapRef}
          style={MAP_CANVAS_STYLE}
          initialViewState={INITIAL_VIEW_STATE}
          mapStyle={MAP_STYLES[mapStyleKey].url}
          projection="globe"
          locale={MAP_LOCALE}
          onLoad={handleMapLoad}
          onMoveEnd={handleMoveEnd}
        >
          <NavigationControl position="bottom-right" />
          <FullscreenControl position="bottom-right" />

          {/* Dischi amministrativi — tier "territorio" (regione/paese, z<8,5)
              o "area" (citta', 8,5≤z<12). Nessuna icona di categoria dentro:
              il gruppo risponde a "quanti", non a "che tipo" (§4). */}
          {clusterEntities.groups.map((group) => (
            <Marker
              key={group.key}
              longitude={group.centroid.lng}
              latitude={group.centroid.lat}
              anchor="center"
              ref={(instance: MarkerInstance | null) => {
                instance
                  ?.getElement()
                  .setAttribute('aria-label', `${group.label}, ${group.members.length} posti`);
              }}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleGroupClick(group);
              }}
            >
              <div className="flex min-h-11 min-w-11 cursor-pointer flex-col items-center justify-center gap-1">
                <div
                  className={`flex items-center justify-center rounded-full border-[1.5px] border-[var(--color-accent,#c85a32)] bg-black/85 font-bold tabular-nums text-white shadow-2xl transition-transform hover:scale-105 ${discSizeClasses(group.members.length).box} ${discSizeClasses(group.members.length).text}`}
                >
                  {group.members.length}
                </div>
                <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-accent-text)]">
                  {group.label}
                </span>
              </div>
            </Marker>
          ))}

          {/* Pin — il punto (§2): sempre 10px sulla coordinata esatta, mai
              nascosto. L'etichetta (la pillola, identica a prima) e' un
              satellite che si guadagna: sempre nei tier territorio/area
              (Regola A, "un gruppo da 1 non e' un gruppo"), per collisione e
              budget nel tier "posto" (Regola B, `namedPinIds`). Il
              selezionato va disegnato per ultimo (`withSelectedLast`):
              `.maplibregl-marker` apre un contesto di impilamento, quindi le
              classi `z-10`/`z-30` interne non escono dal proprio marcatore e
              a decidere chi riceve il click e' l'ordine nel DOM. */}
          {paintedPins.map((item) => {
            if (!item.place.coordinates) return null;
            const isSelected = selectedItem?.id === item.id;
            const showName = tier === 'posto' ? namedPinIds.has(item.id) : true;
            const IconComp = getItemIcon(item.types);

            return (
              <Marker
                key={item.id}
                longitude={item.place.coordinates.lng}
                latitude={item.place.coordinates.lat}
                anchor="bottom"
                ref={(instance: MarkerInstance | null) => {
                  // maplibre-gl assegna "Map marker" solo se l'elemento non ha
                  // gia' un aria-label: questo corre prima, in fase di commit,
                  // e vince sul default.
                  instance?.getElement().setAttribute('aria-label', markerAccessibleName(item));
                }}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handlePinClick(item);
                }}
              >
                <div
                  className="group relative flex cursor-pointer flex-col items-center"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() =>
                    setHoveredItem((current) => (current?.id === item.id ? null : current))
                  }
                >
                  {showName && (
                    <div
                      className={`relative mb-3.5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-2xl transition-all ${
                        isSelected
                          ? 'z-30 scale-110 border-2 border-white bg-[var(--color-accent,#c85a32)] text-[var(--color-ink)]'
                          : 'z-10 border border-white/30 bg-black/85 text-white hover:scale-105 hover:bg-[var(--color-accent-hover)]'
                      }`}
                    >
                      <IconComp
                        size={13}
                        className={isSelected ? 'text-white' : 'text-[var(--color-accent)]'}
                      />
                      <span className="max-w-[120px] truncate">{item.title}</span>
                    </div>
                  )}

                  {/* Il punto: sempre visibile, sempre esattamente sulla
                      coordinata. Non collide mai — 10px che si toccano
                      restano leggibili come un grappolo (§2). */}
                  <div
                    className={`relative rounded-full border-2 border-white transition-transform group-hover:scale-125 ${
                      isSelected
                        ? 'h-3.5 w-3.5 bg-[var(--color-accent,#c85a32)] shadow-lg'
                        : 'h-2.5 w-2.5 bg-[var(--color-accent,#c85a32)] shadow-md'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute -inset-2 animate-pulse rounded-full bg-[var(--color-accent,#c85a32)] opacity-75 blur-sm" />
                    )}
                  </div>
                </div>
              </Marker>
            );
          })}

          {/* L'anteprima, una sola per tutta la mappa.
              Sta in un `Marker` suo cosi' che a posizionarla resti maplibre,
              come prima; `pointer-events: none` perche' non rubi il puntatore
              al pin sotto, che farebbe lampeggiare l'hover. Su touch non
              compare mai — esattamente come il `group-hover` che sostituisce. */}
          {hoveredItem?.place.coordinates && (
            <Marker
              key="hover-preview"
              longitude={hoveredItem.place.coordinates.lng}
              latitude={hoveredItem.place.coordinates.lat}
              anchor="bottom"
              style={{ pointerEvents: 'none' }}
            >
              <div className="pointer-events-none mb-10 w-48 rounded-xl border border-white/20 bg-black/90 p-2.5 shadow-2xl backdrop-blur-md">
                {hoveredItem.cover ? (
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-black/20">
                    {/* `OptimizedImage` e non un tag immagine grezzo: il riquadro
                        e' largo 192px, servono le varianti piccole in avif/webp.
                        Quando l'anteprima viveva dentro OGNI marcatore il browser
                        scaricava la copertina a piena risoluzione per tutti —
                        400-470 KB l'una, 14 MB di pagina, LCP a 5,9s — e il
                        componente aveva risolto quello. Ora ne esiste una sola e
                        solo mentre ci passi sopra: il problema non puo' tornare. */}
                    <OptimizedImage
                      src={hoveredItem.cover}
                      alt={hoveredItem.title}
                      sizes="192px"
                      responsiveWidths={[320]}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-stone-800 to-stone-900">
                    <MapPin size={24} className="text-[var(--color-accent,#c85a32)] opacity-60" />
                  </div>
                )}
                <p className="mt-1.5 truncate text-[10px] font-bold text-white">
                  {hoveredItem.title}
                </p>
                <span className="text-[9px] font-semibold text-[var(--color-accent-text)]">
                  {hoveredItem.place.region || hoveredItem.place.country} · {hoveredItem.zone}
                </span>
                {hoveredItem.value?.price && (
                  <span className="ml-1.5 text-[9px] text-white/60">
                    — {hoveredItem.value.price}
                  </span>
                )}
              </div>
            </Marker>
          )}
        </MapGL>

        {/* 4. Advanced Multi-Tab Glassmorphism Drawer — right-14/right-20 lasciano libera
          la colonna dei controlli MapLibre (zoom, fullscreen, attribuzione OSM) che
          altrimenti la scheda copriva. Il tetto d'altezza e' relativo al contenitore,
          non al viewport: cosi' si adatta da solo all'altezza della testata. Sotto lg
          serve meno spazio perche' elenco e pannello si fanno da parte. */}
        {/* Il cassetto e' tappato in altezza e il contenuto puo' superarlo (su
            375x812 sono 493px in 400). Prima scorreva tutto insieme e il bottone
            finiva sotto il bordo: ora scorre solo la parte centrale, mentre
            titolo, riga di sintesi e bottone restano sempre a vista.

            **z-50, non z-30**: la barra dei controlli e' z-40, quindi stava
            SOPRA il cassetto e su telefono la X di chiusura non era cliccabile
            — al suo posto rispondeva un bottone della mappa (verificato con
            `elementFromPoint`). Sopra un cassetto aperto i filtri possono
            sparire: si chiude e tornano.

            Il tetto e' `min(68svh, contenitore − 4rem)`, non una riserva a
            occhio: i filtri vanno a capo in modo diverso a ogni larghezza, e a
            320px la riserva fissa lasciava al cassetto 175px, col bottone fuori
            schermo. Il `min` serve per le finestre basse, dove 68svh sfonderebbe
            il contenitore.

            Il tetto piu' generoso guarda **larghezza E altezza** (stessa query
            di `DESKTOP_QUERY`): con il solo `lg:` una finestra 1440x620 prendeva
            la misura da desktop e il bottone finiva fuori schermo. */}
        {selectedItem && (
          <div className="absolute bottom-16 left-4 right-14 z-50 mx-auto flex max-h-[min(68svh,calc(100%-4rem))] max-w-lg flex-col overflow-hidden rounded-[var(--radius-lg,24px)] border border-white/20 bg-black/90 p-6 text-white shadow-2xl backdrop-blur-2xl sm:bottom-10 sm:left-auto sm:right-20 sm:w-[460px] [@media(min-width:1024px)_and_(min-height:800px)]:max-h-[calc(100%-11rem)]">
            {/* Drawer Header */}
            <div className="flex shrink-0 items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent,#c85a32)]/20 border border-[var(--color-accent,#c85a32)]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
                  {/* Solo la zona. Prima era `zone · region || types[0]`: senza
                      regione ripeteva il tipo, che ora ha la sua pillola qui
                      sotto — «Americhe · Relax, terme e spa» e poi di nuovo
                      «Relax, terme e spa», su due righe. Cosi' invece la
                      gerarchia e' pulita: zona qui, citta' e regione nella riga
                      di sintesi, tipo nelle pillole. */}
                  {selectedItem.zone}
                </span>
                <h3 className="mt-2 font-serif text-2xl font-normal leading-tight">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* La riga che decide. Prima queste tre cose stavano dietro la
                linguetta «Costi & info»: chi guarda un pin si chiede cos'e',
                dov'e' e quanto costa, e all'apertura ne vedeva una sola.
                Le linguette sono sparite del tutto — spostati qui il prezzo, il
                luogo e la trasparenza, nella seconda restavano due bottoni.
                Il luogo non e' un doppione del chip qui sopra: quello dice zona
                e regione, questo dice il comune. */}
            <p className="mt-3 flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 border-b border-white/15 pb-3 text-[13px]">
              {(selectedItem.value?.price || selectedItem.value?.budget) && (
                <>
                  <span className="font-bold text-white">
                    {selectedItem.value?.price ?? `Budget ${selectedItem.value?.budget}`}
                  </span>
                  <span aria-hidden="true" className="text-white/25">
                    ·
                  </span>
                </>
              )}
              <span className="text-white/70">
                {[selectedItem.place.city, selectedItem.place.region ?? selectedItem.place.country]
                  .filter(Boolean)
                  .join(', ')}
              </span>
              {PARTNERSHIP_LABEL[selectedItem.partnership.kind] && (
                <>
                  <span aria-hidden="true" className="text-white/25">
                    ·
                  </span>
                  <span className="font-bold text-[var(--color-accent-on-dark)]">
                    {PARTNERSHIP_LABEL[selectedItem.partnership.kind]}
                  </span>
                </>
              )}
            </p>

            {/* Che tipo di posto e': dice a colpo d'occhio se e' cena, hotel o
                giornata fuori. Qui prima c'era un riquadro «Verdetto: ...» che
                non compariva mai, perche' il voto e' vuoto su 29 schede su 29.
                Sta fuori dalla parte che scorre — e' metadato corto e sempre
                uguale, e dentro veniva tagliato a meta' dal bordo. A scorrere
                resta solo la descrizione, che e' l'unica cosa lunga. */}
            {selectedItem.types?.length > 0 && (
              <p className="mt-3 flex shrink-0 flex-wrap gap-1.5">
                {selectedItem.types.map((tipo) => (
                  <span
                    key={tipo}
                    className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white/80"
                  >
                    {tipo}
                  </span>
                ))}
              </p>
            )}

            <div ref={descrizioneRef} className="relative mt-3 min-h-0 flex-1 overflow-y-auto">
              <p className="text-[13px] leading-relaxed text-white/85">
                {selectedItem.description}
              </p>
            </div>

            {/* Le azioni stanno fuori dalla parte che scorre: erano l'ultimo
                elemento dentro, e il bordo dello scorrimento le tagliava a
                meta'. Un bottone mozzato non sembra scorrevole, sembra rotto.
                La sfumatura sopra dice che il testo continua sotto il taglio. */}
            <div className="relative shrink-0 pt-3">
              {descrizioneScorre && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-black/90 to-transparent"
                />
              )}
              <PlaceBusinessActions
                item={selectedItem}
                userLocation={userLoc}
                variant="compact"
                suFondoScuro
              />
            </div>

            {/* Drawer Actions */}
            <div className="mt-4 flex shrink-0 items-center justify-between border-t border-white/15 pt-4 text-xs font-semibold">
              <span className="text-white/60">Provato di persona</span>
              <Link
                to={`/posto/${selectedItem.id}`}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent,#c85a32)] px-4 py-2 text-xs font-bold text-[var(--color-ink)] shadow-md transition-all hover:bg-white hover:text-[var(--color-ink)]"
              >
                Apri la scheda completa <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
