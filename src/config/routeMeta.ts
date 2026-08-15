/**
 * Meta SEO delle rotte statiche, per la generazione a build time.
 *
 * Serve due consumatori:
 *   - `scripts/generate-og-images.mjs` → una card OG 1200x630 per rotta;
 *   - `scripts/generate-route-html.js` → il <head> del file HTML per rotta.
 *
 * Esiste perche in produzione l'hosting e statico (`firebase.json`: rewrite
 * `**` → `/index.html`) e `server.ts` non viene mai eseguito: senza queste meta
 * iniettate a build time ogni URL servirebbe lo stesso shell, e gli scraper
 * social — che non eseguono JavaScript — vedrebbero una card vuota.
 *
 * `title` e `description` replicano il <SEO> della pagina corrispondente.
 * Sono due copie della stessa stringa e possono divergere: se divergono, gli
 * utenti vedono la versione runtime (React sovrascrive a idratazione) e gli
 * scraper questa. E una degradazione, non una rottura. Il test
 * `routeMeta.test.ts` garantisce l'unica invariante che conta davvero: che ogni
 * rotta statica del sitemap abbia una voce qui.
 *
 * Le pagine-posto NON sono qui: le loro meta si derivano da
 * `src/data/content-seed.json` (solo `isPlaceholder:false`).
 */

export interface RouteMeta {
  /** Path esatto come in `SURFACES` (src/config/surfaces.ts). */
  path: string;
  title: string;
  description: string;
  /** Occhiello della card OG. */
  ogCategory: string;
  /** Riga secondaria dell'occhiello OG. */
  ogLocation?: string;
}

export const STATIC_ROUTE_META: RouteMeta[] = [
  {
    path: '/',
    title: 'Viaggi reali e posti particolari in Italia e nel mondo',
    description:
      'La casa di Rodrigo e Betta: posti particolari provati sul campo, con atmosfera, costi reali e il consiglio onesto se un posto merita il viaggio.',
    ogCategory: 'Travelliniwithus',
    ogLocation: 'Posti particolari provati sul campo',
  },
  {
    path: '/esplora',
    title: 'Esplora viaggi scelti a mano',
    description:
      'Le idee di viaggio che scegliamo davvero noi: posti, weekend in coppia e mete fuori rotta da filtrare per zona, periodo e budget. Archivio Travellini.',
    ogCategory: 'Archivio',
  },
  {
    path: '/destinazione',
    title: 'Tutte le Destinazioni — Italia, Europa e Mondo',
    description:
      'Esplora tutte le 20 regioni italiane, i paesi europei e del mondo raccontati da Rodrigo e Betta con posti particolari provati sul posto.',
    ogCategory: 'Destinazioni',
  },
  {
    path: '/mappa',
    title: 'Mappa Interattiva delle Destinazioni',
    description:
      'Esplora la mappa a tutto schermo di Travelliniwithus: filtra hotel, trattorie, borghi e destinazioni provate di persona da Rodrigo e Betta.',
    ogCategory: 'Mappa',
  },
  {
    path: '/chi-siamo',
    title: 'Rodrigo e Betta: chi siamo',
    description:
      'Dalla nascita del brand nel 2018: viaggi in coppia raccontati con criterio. Come scegliamo i posti, perché ne consigliamo pochi, cosa garantiamo a chi ci legge.',
    ogCategory: 'Chi siamo',
  },
  {
    path: '/collaborazioni',
    title: 'Collaborazioni travel con hotel e brand',
    description:
      'Collaborazioni editoriali con hotel, destinazioni, brand travel e progetti lifestyle che hanno qualcosa da raccontare con credibilità.',
    ogCategory: 'Collaborazioni',
  },
  {
    path: '/media-kit',
    title: 'Media kit Travelliniwithus: audience, format e condizioni',
    description:
      'Richiedi il media kit Travelliniwithus per capire audience, format, tono editoriale e condizioni giuste per una collaborazione coerente.',
    ogCategory: 'Media kit',
  },
  {
    path: '/contatti',
    title: 'Contatti Travelliniwithus',
    description:
      'Scrivici per collaborazioni, press trip, media kit, domande editoriali o richieste legate al progetto Travelliniwithus.',
    ogCategory: 'Contatti',
  },
  {
    path: '/risorse',
    title: 'App e attrezzatura che usiamo in viaggio',
    description:
      "Le app, i servizi e l'attrezzatura che usiamo o valutiamo in viaggio: a cosa serve ognuno, quando non serve e quali link sono in affiliazione.",
    ogCategory: 'Risorse',
  },
  {
    path: '/club',
    title: 'Travellini Club — il club di chi viaggia in Italia con noi',
    description:
      'Una piccola quota per tutte le guide. Itinerari aggiornati, anteprime, archivio. Pensato per chi viaggia spesso e vuole leggere meno rumore.',
    ogCategory: 'Club',
  },
  {
    path: '/family',
    title: 'Travellini Family — gravidanza e viaggi in famiglia',
    description:
      'Il lato family di Rodrigo & Betta: la gravidanza, i viaggi col pancione e — presto — quelli col piccolo. Consigli veri e codici sconto dichiarati.',
    ogCategory: 'Travellini Family',
  },
  {
    path: '/family/consigli',
    // Senza "| Travellini Family": il nome del sito lo aggiunge fullTitle(),
    // e il suffisso manuale produceva "… | Travellini Family | Travelliniwithus".
    title: 'Consigli family — gravidanza e viaggio',
    description:
      'Consigli veri su gravidanza e viaggio in famiglia, provati da Rodrigo & Betta: volare col pancione, organizzarsi, cosa serve davvero.',
    ogCategory: 'Travellini Family',
    ogLocation: 'Consigli provati',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy',
    description:
      'Informativa sulla privacy di Travelliniwithus. Scopri quali dati possiamo raccogliere, come li gestiamo e come contattarci.',
    ogCategory: 'Legale',
  },
  {
    path: '/cookie',
    title: 'Cookie Policy',
    description:
      'Informativa sui cookie di Travelliniwithus. Scopri quali tecnologie possono essere usate sul sito e come gestirle.',
    ogCategory: 'Legale',
  },
  {
    path: '/termini',
    title: 'Termini e Condizioni',
    description: "Termini e condizioni d'uso del sito Travelliniwithus.",
    ogCategory: 'Legale',
  },
  {
    path: '/disclaimer',
    title: 'Disclaimer Affiliazioni',
    description:
      'Informativa sulle affiliazioni di Travelliniwithus e sulla trasparenza dei link consigliati.',
    ogCategory: 'Legale',
  },
];

/** Slug del file OG per una rotta: `/` → `home`, `/family/consigli` → `family-consigli`. */
export function ogSlugForPath(path: string): string {
  const slug = path.replace(/^\/+/, '').replace(/\/+$/, '').replace(/\//g, '-');
  return slug || 'home';
}

export function findRouteMeta(path: string): RouteMeta | undefined {
  const normalized = path === '/' ? '/' : path.replace(/\/+$/, '');
  return STATIC_ROUTE_META.find((entry) => entry.path === normalized);
}
