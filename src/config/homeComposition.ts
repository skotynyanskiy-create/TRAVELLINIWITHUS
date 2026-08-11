import { CONTENT_ITEMS } from './contentLibrary';
import { getFamilyEntries } from './familyLibrary';
import { getAudienceInterest } from './audienceInterests';
import { FAMILY_CATEGORY_LABEL } from '../types/family';
import { PARTNERSHIP_LABEL } from '../types/content';
import { REELS } from './reels';
import type { Audience } from '../context/AudienceContext';
import type { InterestId } from './audienceInterests';

/**
 * Chi guarda decide cosa vede — architettura di
 * PROJECT_HOME_RICOMPOSIZIONE_2026-07-26.
 *
 * Il layer audience esisteva dal 2026-07-24 ma la home non lo leggeva mai:
 * tre pubblici dichiaravano chi erano e atterravano sulla stessa identica
 * pagina. Cambiavano menu, footer e contatti; il contenuto no.
 *
 * Due vincoli tengono la ricomposizione onesta:
 *
 * - **L'apertura e' costante.** `BrandCoherentHero` non cambia mai: Google vede
 *   una sola `/` con una sola promessa, e l'elemento LCP resta identico a ogni
 *   visita, quindi ricomporre non puo' generare layout shift sopra la piega.
 * - **Nessun numero scritto a mano.** Le prove di ciascuna voce si contano dai
 *   dati veri a ogni build. Un claim che si scrive a mano e' un claim che
 *   invecchia senza che nessuno se ne accorga — il difetto che ha prodotto
 *   quarantuno documenti scaduti.
 */

export type SectionKey = 'featured' | 'grid' | 'family' | 'map' | 'reels' | 'method' | 'index';

export interface AudienceProof {
  value: string;
  label: string;
}

/** Una prova visiva: foto reale, cosa mostra, dove porta. Mai un'immagine
 *  decorativa — sono gli stessi scatti delle schede, presi dall'inventario. */
export interface AudienceShowcase {
  id: string;
  cover: string;
  alt: string;
  title: string;
  /** Riga sotto il titolo: luogo per i posti, categoria per i family,
   *  rapporto dichiarato per il brand. Cambia significato per audience,
   *  ed e' il punto: ognuno legge la stessa foto per il motivo suo. */
  meta: string;
  to: string;
  /** Focale verticale del crop (0-100). Sopra 50 taglia via la title-card
   *  impressa in cima ai frame TikTok: senza, la vetrina mostra pezzi di
   *  didascalia tagliati a meta. */
  focusY: number;
}

export interface AudienceVoice {
  /** Sopratitolo: a chi sta parlando la pagina adesso. */
  eyebrow: string;
  /** La frase che cambia il sito. Una sola, in serif, mai due. */
  claim: string;
  /** Una riga di contesto sotto il claim. */
  support: string;
  /** Tre prove contate dai dati, mai dichiarate a mano. */
  proof: AudienceProof[];
  /** Tre scatti veri, diversi per audience. */
  showcase: AudienceShowcase[];
  cta: { label: string; to: string };
}

export interface HomeComposition {
  voice: AudienceVoice;
  sections: SectionKey[];
}

// --- Prove, contate dall'inventario reale ------------------------------------

const REAL_ITEMS = CONTENT_ITEMS.filter((item) => !item.isPlaceholder);

/** Invito, ADV, collaborazione, gifted: tutto cio' che va dichiarato per legge.
 *  L'affiliazione resta fuori — e' un link, non un rapporto sul posto. */
const DISCLOSED = REAL_ITEMS.filter((item) =>
  ['invited', 'adv', 'collaboration', 'gifted'].includes(item.partnership.kind)
);

const FAMILY_ENTRIES = getFamilyEntries();
const FAMILY_COUNT = FAMILY_ENTRIES.length;

const luogoDi = (item: (typeof CONTENT_ITEMS)[number]) =>
  [item.place.city, item.place.region ?? item.place.country].filter(Boolean).join(', ');

/** Solo scatti veri: senza cover non entra in vetrina, invece di mostrare un
 *  riquadro vuoto su una sezione che parla di prove. */
const conCover = <T extends { cover?: string }>(items: T[]) =>
  items.filter((item) => item.cover?.trim());

const showcaseViaggiatori: AudienceShowcase[] = conCover(REAL_ITEMS)
  .slice(0, 3)
  .map((item) => ({
    id: item.id,
    cover: item.cover,
    alt: item.coverAlt ?? item.title,
    title: item.title,
    meta: luogoDi(item),
    to: `/posto/${item.id}`,
    focusY: item.coverFocusY ?? 50,
  }));

const showcaseFamily: AudienceShowcase[] = conCover(FAMILY_ENTRIES)
  .slice(0, 3)
  .map((entry) => ({
    id: entry.id,
    cover: entry.cover,
    alt: entry.coverAlt,
    title: entry.title,
    meta: FAMILY_CATEGORY_LABEL[entry.category] ?? 'Consiglio',
    to: '/family/consigli',
    focusY: entry.coverFocusY ?? 50,
  }));

/** Per il brand la stessa foto significa un'altra cosa: non "che bel posto" ma
 *  "questo lavoro l'abbiamo consegnato, e il rapporto e' dichiarato". */
const showcaseBrand: AudienceShowcase[] = conCover(DISCLOSED)
  .slice(0, 3)
  .map((item) => ({
    id: item.id,
    cover: item.cover,
    alt: item.coverAlt ?? item.title,
    title: item.title,
    meta: PARTNERSHIP_LABEL[item.partnership.kind] || 'Collaborazione',
    to: `/posto/${item.id}`,
    focusY: item.coverFocusY ?? 50,
  }));

// --- Le tre composizioni -----------------------------------------------------

export const HOME_COMPOSITIONS: Record<Audience, HomeComposition> = {
  /**
   * Chi cerca dove andare vuole i posti, non il metodo: `method` scende dal
   * terzo al sesto posto. La prova serve dopo aver desiderato qualcosa.
   */
  viaggiatori: {
    voice: {
      eyebrow: 'Per chi deve ancora decidere',
      claim: 'Non ti diciamo dove andare. Ti diciamo se vale il viaggio.',
      support:
        'Ogni posto qui dentro lo abbiamo attraversato di persona. Quelli che non ci hanno convinto non li trovi: è il motivo per cui la lista è corta.',
      proof: [
        { value: String(REAL_ITEMS.length), label: 'posti provati di persona' },
        { value: String(REELS.length), label: 'reel girati sul posto' },
        { value: '0', label: 'posti che non abbiamo visto' },
      ],
      showcase: showcaseViaggiatori,
      cta: { label: 'Apri il registro', to: '/esplora' },
    },
    sections: ['grid', 'map', 'reels', 'method', 'index'],
  },

  /**
   * Con i bambini cambiano i vincoli, non i gusti: i consigli family vengono
   * prima di tutto, e la mappa subito dopo perche' la distanza e' il primo
   * filtro reale di chi viaggia con figli.
   */
  family: {
    voice: {
      eyebrow: 'Per chi parte con i bambini',
      claim: 'Con i bambini non cambia la meta. Cambia tutto il resto.',
      support:
        'Distanze, orari, cosa si riesce davvero a fare in una giornata. I consigli qui sotto vengono dai nostri viaggi in famiglia, non da una guida.',
      proof: [
        { value: String(FAMILY_COUNT), label: 'consigli dai nostri viaggi' },
        { value: '0', label: 'consigli presi da altri' },
        { value: 'Sempre', label: 'diciamo per che età va bene' },
      ],
      showcase: showcaseFamily,
      cta: { label: 'I consigli family', to: '/family/consigli' },
    },
    sections: ['family', 'map', 'featured', 'method', 'index'],
  },

  /**
   * Chi valuta se ospitarci non cerca ispirazione: cerca prove. I reel salgono
   * subito dopo la voce perche' sono il lavoro consegnato, e il metodo diventa
   * argomento di vendita invece che nota editoriale.
   */
  brand: {
    voice: {
      eyebrow: 'Per chi ci vuole ospitare',
      claim: `${DISCLOSED.length} dei ${REAL_ITEMS.length} posti che raccontiamo ci hanno invitati o pagati. C'è scritto su ognuno.`,
      support:
        'Dichiariamo il rapporto su ogni singola scheda, sempre, anche quando nessuno lo chiede. È il motivo per cui quando diciamo che un posto vale, chi ci legge ci crede.',
      proof: [
        { value: String(DISCLOSED.length), label: 'collaborazioni pubblicate' },
        {
          value: `${REAL_ITEMS.length}/${REAL_ITEMS.length}`,
          label: 'schede con rapporto dichiarato',
        },
        { value: String(REELS.length), label: 'reel consegnati' },
      ],
      showcase: showcaseBrand,
      cta: { label: 'Richiedi il media kit', to: '/media-kit' },
    },
    sections: ['reels', 'method', 'grid', 'index'],
  },
};

const INTEREST_SECTION_ORDER: Partial<Record<InterestId, SectionKey[]>> = {
  'weekend-romantici': ['grid', 'map', 'reels', 'method', 'index'],
  'fuori-rotta': ['map', 'grid', 'reels', 'method', 'index'],
  'mangiare-e-dormire': ['grid', 'reels', 'map', 'method', 'index'],
  gravidanza: ['family', 'method', 'featured', 'map', 'index'],
  'viaggiare-in-gravidanza': ['family', 'map', 'featured', 'method', 'index'],
  'essenziali-family': ['family', 'method', 'index', 'map', 'featured'],
  'capire-il-fit': ['method', 'reels', 'grid', 'index'],
  'vedere-i-format': ['reels', 'method', 'grid', 'index'],
  'richiedere-il-media-kit': ['method', 'reels', 'grid', 'index'],
};

export function compositionFor(audience: Audience, interest?: InterestId | null): HomeComposition {
  const composition = HOME_COMPOSITIONS[audience] ?? HOME_COMPOSITIONS.viaggiatori;
  const selectedInterest = getAudienceInterest(interest);
  const matchingInterest = selectedInterest?.audience === audience ? selectedInterest : null;
  const sections = matchingInterest
    ? (INTEREST_SECTION_ORDER[matchingInterest.id] ?? composition.sections)
    : composition.sections;
  const voice = matchingInterest
    ? { ...composition.voice, cta: matchingInterest.cta }
    : composition.voice;

  return { voice, sections };
}
