export interface HomeAudiencePath {
  eyebrow: string;
  title: string;
  description: string;
  to: string;
  cta: string;
}

export interface HomeContent {
  heroEyebrow: string;
  heroTitleMain: string;
  heroTitleAccent: string;
  heroDescription: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  secondaryCtaLabel: string;
  secondaryCtaLink: string;
  quickPillars: string[];
  audiencePaths: HomeAudiencePath[];
  aboutEyebrow: string;
  aboutTitleMain: string;
  aboutTitleAccent: string;
  aboutDescription: string;
  aboutButtonLabel: string;
  aboutButtonLink: string;
  boutiqueIntro: string;
  socialTitle: string;
  socialDescription: string;
  instagramDescription: string;
  instagramCta: string;
  tiktokDescription: string;
  tiktokCta: string;
}

export interface AboutCard {
  title: string;
  text: string;
}

export interface AboutContent {
  eyebrow: string;
  heroTitleMain: string;
  heroTitleAccent: string;
  introParagraphs: string[];
  primaryCtaLabel: string;
  primaryCtaLink: string;
  quoteText: string;
  quoteAuthor: string;
  focusTitle: string;
  focusSubtitle: string;
  focusAreas: AboutCard[];
  principlesTitle: string;
  principlesSubtitle: string;
  principles: AboutCard[];
  audienceTitle: string;
  audienceDescription: string;
  audienceItems: string[];
}

export interface CollaborationService {
  title: string;
  description: string;
}

export interface CollaborationProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface CollaborationPartnerType {
  title: string;
  text: string;
}

export interface CollaborationFormat {
  title: string;
  subtitle: string;
  features: string[];
  highlight?: string;
}

export interface CollaborationsContent {
  heroEyebrow: string;
  heroTitleMain: string;
  heroTitleAccent: string;
  heroDescription: string;
  heroChecklist: string[];
  primaryCtaLabel: string;
  primaryCtaLink: string;
  secondaryCtaLabel: string;
  secondaryCtaLink: string;
  statsTitle: string;
  statsDescription: string;
  servicesTitle: string;
  servicesSubtitle: string;
  services: CollaborationService[];
  processTitle: string;
  processSteps: CollaborationProcessStep[];
  partnerTitle: string;
  partnerDescription: string;
  partnerTypes: CollaborationPartnerType[];
  formatsTitle: string;
  formatsDescription: string;
  collaborationFormats: CollaborationFormat[];
}

export interface ContactContent {
  heroEyebrow: string;
  heroTitleMain: string;
  heroTitleAccent: string;
  heroDescription: string;
  emailCardTitle: string;
  emailCardDescription: string;
  emailCardLinkLabel: string;
  whatsappCardTitle: string;
  whatsappCardDescription: string;
  helperTitle: string;
  helperItems: string[];
  formTitle: string;
}

export interface FooterContent {
  description: string;
  discoverTitle: string;
  resourcesTitle: string;
  projectTitle: string;
  newsletterButtonLabel: string;
}

export interface NavigationContent {
  destinationsLabel: string;
  destinationsAllLabel: string;
  guidesLabel: string;
  experiencesLabel: string;
  resourcesLabel: string;
  shopLabel: string;
  collaborationsLabel: string;
  mediaKitLabel: string;
  aboutLabel: string;
  contactsLabel: string;
  favoritesLabel: string;
  searchLabel: string;
}

export interface DemoContent {
  showEditorialDemo: boolean;
  showDestinationDemo: boolean;
  showShopDemo: boolean;
  showDemoBadges: boolean;
}

export interface SiteContentMap {
  home: HomeContent;
  about: AboutContent;
  collaborations: CollaborationsContent;
  contact: ContactContent;
  footer: FooterContent;
  navigation: NavigationContent;
  demo: DemoContent;
}

export type SiteContentKey = keyof SiteContentMap;

export const siteContentDefaults: SiteContentMap = {
  home: {
    heroEyebrow: 'Travelliniwithus',
    heroTitleMain: 'Posti particolari',
    heroTitleAccent: 'che valgono davvero',
    heroDescription:
      'Guide scritte da chi ha vissuto il viaggio. Niente filtri, niente sconti, niente finto. Solo posti belli e informazioni utili per partire preparato.',
    primaryCtaLabel: 'Scopri i posti',
    primaryCtaLink: '/destinazioni',
    secondaryCtaLabel: 'Collaborazioni B2B',
    secondaryCtaLink: '/collaborazioni',
    quickPillars: [
      '🗺️ Posti particolari che i turisti non trovano',
      '📚 Guide lunghe, dettagliate e pratiche',
      '🍽️ Food experience e ristorazione locale in ogni città',
    ],
    audiencePaths: [
      {
        eyebrow: 'Per i Viaggiatori',
        title: 'Risorse e Guide Autentiche',
        description:
          'Newsletter settimanale, guide pratiche scaricabili e risorse testate che usiamo davvero nei nostri viaggi.',
        to: '/shop',
        cta: 'Vedi le guide',
      },
      {
        eyebrow: 'Per i Brand (B2B)',
        title: 'Media Kit e Collaborazioni',
        description:
          'Collaborazioni con audience qualificata, case study veri, senza fake news o sponsored content generico.',
        to: '/collaborazioni',
        cta: 'Scopri di più',
      },
    ],
    aboutEyebrow: 'Chi siamo',
    aboutTitleMain: 'Dietro',
    aboutTitleAccent: 'Travelliniwithus',
    aboutDescription:
      'Siamo Rodrigo e Betta, compagni di vita e di viaggio. Raccontiamo posti particolari, esperienze da fare almeno una volta e consigli concreti per aiutare chi ci legge a scegliere meglio.',
    aboutButtonLabel: 'La nostra storia',
    aboutButtonLink: '/chi-siamo',
    boutiqueIntro:
      'Qui raccogliamo strumenti, partner e risorse selezionate con criterio per aiutarti a organizzare meglio il viaggio senza riempire il sito di link scollegati.',
    socialTitle: 'Seguici dove condividiamo davvero',
    socialDescription:
      'Il sito è il posto in cui ordinare meglio il progetto. I social sono il posto in cui vedi il ritmo quotidiano, i dietro le quinte, le scoperte più immediate e il nostro modo di raccontare mentre siamo in viaggio.',
    instagramDescription:
      'Il canale principale per reels, scoperte, luoghi da salvare, stile del progetto e contatto diretto con la community.',
    instagramCta: 'Apri Instagram',
    tiktokDescription:
      'Il lato più rapido e spontaneo del progetto: scorci, idee e contenuti pensati per essere immediati e memorabili.',
    tiktokCta: 'Apri TikTok',
  },
  about: {
    eyebrow: 'Chi siamo e come lavoriamo',
    heroTitleMain: 'Posti particolari',
    heroTitleAccent: '+ 10 anni di viaggi',
    introParagraphs: [
      'Siamo Gaetano Rodrigo e Betta, travel couple da 10 anni. Budget travel, food experience, posti veri: questa è la nostra firma.',
      'Con oltre 167K follower su Instagram e 90K su TikTok, la Travellini Community è una comunità reale di viaggiatori che si fida di noi — non di sponsorizzazioni travestite da consigli.',
      'Ogni posto che raccontiamo lo abbiamo visitato di persona, ogni hotel lo abbiamo dormito, ogni piatto lo abbiamo mangiato. Niente copia-incolla, niente guide fatte da algoritmi.',
    ],
    primaryCtaLabel: 'Scopri come collaborare',
    primaryCtaLink: '/collaborazioni',
    quoteText: 'Raccontare la verità sul viaggio: i posti bellissimi e le sfide per arrivarci.',
    quoteAuthor: 'Rodrigo & Betta',
    focusTitle: 'Perché fidarsi',
    focusSubtitle: 'Il metodo',
    focusAreas: [
      {
        title: 'Tempo sul posto',
        text: 'Ogni destinazione significa settimane sul posto, non press trip di due giorni. Capiamo la logistica, le fregature e le perle vere.',
      },
      {
        title: 'Zero filtri commerciali',
        text: 'Paghiamo noi i nostri viaggi o scegliamo collaborazioni (dichiarate) dove abbiamo totale libertà editoriale.',
      },
      {
        title: 'Immagini vere, non scenografie',
        text: 'Ogni foto è scattata durante il viaggio, non in shooting costruiti a posteriori. Quello che vedi è quello che trovi sul posto.',
      },
    ],
    principlesTitle: 'I Nostri Standard',
    principlesSubtitle: 'Come lavoriamo',
    principles: [
      {
        title: 'Cura dei dettagli',
        text: 'Betta è giornalista e researcher. Ogni guida include prezzi, orari e dettagli logistici testati sul campo.',
      },
      {
        title: 'Posti fuori rotta',
        text: 'Evitiamo le liste copiate da Wikipedia e le mete che tutti già conoscono. Promuoviamo destinazioni, trattorie e angoli che si trovano solo chi esplora davvero.',
      },
      {
        title: 'Niente consigli ovvi',
        text: 'Non troverai la lista dei "10 posti da vedere" copiata da Wikipedia. Solo angoli che meritano davvero la tua attenzione.',
      },
    ],
    audienceTitle: 'A chi ci rivolgiamo',
    audienceDescription:
      "Il nostro contenuto non è per tutti. È per chi apprezza l'approfondimento.",
    audienceItems: [
      'Viaggiatori che odiano gli itinerari copia-incolla e vogliono scavare più a fondo.',
      'Chi cerca strumenti pratici — guide, itinerari, consigli budget — che funzionino davvero.',
      'Chi si innamora di una città mangiando bene senza spendere una fortuna.',
    ],
  },
  collaborations: {
    heroEyebrow: 'B2B & Partnership',
    heroTitleMain: 'Solo brand che amano',
    heroTitleAccent: 'i posti belli',
    heroDescription:
      "Lavoriamo solo con realtà che credono nel valore dell'autenticità. Se rappresenti una destinazione, un'esperienza locale o un brand etico e ti fidi della nostra linea editoriale, possiamo creare qualcosa di potente insieme.",
    heroChecklist: [
      'Destinazioni, esperienze locali e brand con valori reali',
      'Libertà editoriale garantita: niente copioni finti',
      'Focus su una qualità altissima di foto e storytelling',
      'Reportistica trasparente e media kit disponibile su richiesta',
    ],
    primaryCtaLabel: 'Richiedi collaborazione',
    primaryCtaLink: '/contatti',
    secondaryCtaLabel: 'Scopri di più',
    secondaryCtaLink: '/chi-siamo',
    statsTitle: "I Dati e l'Audience",
    statsDescription:
      'Oltre 167.000 follower su Instagram e 90.000 su TikTok, con un engagement rate del 6,5% — il triplo della media del settore. Una community di viaggiatori reali, ingaggiata e fidelizzata, costruita in 10 anni di contenuti autentici.',
    servicesTitle: 'Come Lavoriamo',
    servicesSubtitle: 'I nostri format',
    services: [
      {
        title: 'Articoli Approfonditi',
        description:
          'Recensioni su misura, pro e contro inclusi, scritte con il nostro stile da oltre 3.000 parole.',
      },
      {
        title: 'Feature di Destinazione',
        description:
          'Una serie di contenuti cross-canale (guida + gallery + reel) dedicati a una singola destinazione.',
      },
      {
        title: 'Press Trip con Libertà Editoriale',
        description:
          "Visitiamo la destinazione, produciamo il materiale, ma garantiamo l'integrità. Raccontiamo quello che vediamo — anche i lati da migliorare.",
      },
      {
        title: 'Feature in Newsletter',
        description:
          'Inclusione dedicata nella nostra newsletter, letta da una community di viaggiatori attiva e fidelizzata.',
      },
    ],
    processTitle: 'Il Processo',
    processSteps: [
      {
        step: '1',
        title: "L'Idea",
        description: 'Ci contatti con una proposta concreta su partnerships@travelliniwithus.it',
      },
      {
        step: '2',
        title: 'Il Match',
        description:
          'Valutiamo se il tuo brand è in linea con il nostro pubblico. Niente compromessi sui valori.',
      },
      {
        step: '3',
        title: 'La Creazione',
        description:
          'Lavoriamo con totale libertà editoriale, viaggiando, fotografando e scrivendo in prima persona.',
      },
      {
        step: '4',
        title: 'Il Lancio',
        description:
          'Pubblichiamo il pezzo con trasparenza sulla sponsorizzazione, garantendo un posizionamento nativo.',
      },
    ],
    partnerTitle: 'I Partner Giusti per Noi',
    partnerDescription:
      'Selezioniamo pochi partner per fare un lavoro eccellente. Non siamo cartelloni pubblicitari viventi: ogni collaborazione ha un senso narrativo per la nostra community.',
    partnerTypes: [
      {
        title: 'Strutture Ricettive',
        text: "Da agriturismi a city hotel: raccontiamo l'esperienza di soggiorno con onestà — lati positivi e criticità incluse.",
      },
      {
        title: 'Enti e Destinazioni',
        text: 'Collaboriamo con enti e destinazioni che vogliono essere raccontati in profondità, non solo con foto belle e slogan da brochure.',
      },
      {
        title: 'Brand e Prodotti Travel',
        text: 'Nelle guide consigliamo solo strumenti e prodotti che usiamo o abbiamo testato. Zero link di rimando pagati per convenienza.',
      },
    ],
    formatsTitle: 'Scegli il livello di collaborazione',
    formatsDescription:
      'Che sia una singola menzione o un grande progetto di destination marketing, abbiamo pacchetti chiari, con risultati attesi trasparenti.',
    collaborationFormats: [
      {
        title: 'Starter Package',
        subtitle: 'Articolo Singolo',
        features: [
          'Review approfondita sul blog',
          'Menzione IG Stories',
          '1 Link SEO-friendly',
          'No approvazione preventiva',
        ],
      },
      {
        title: 'Destination Focus',
        subtitle: 'Campagna Completa',
        features: [
          'Articolo Guida Completa',
          'Pacchetto Foto HR',
          'Reel IG & TikTok dedicati',
          'Feature Newsletter',
        ],
        highlight: 'true',
      },
      {
        title: 'Bespoke Campaign',
        subtitle: 'Progetti su Misura',
        features: [
          'Takeover Canali',
          'Eventi fisici',
          'Produzione Documentario Corto',
          'Condivisione dei diritti per uso esterno',
        ],
      },
    ],
  },
  contact: {
    heroEyebrow: 'Contatti',
    heroTitleMain: 'Parliamone',
    heroTitleAccent: 'dal canale giusto',
    heroDescription:
      'Per i lettori: Domanda su una guida? Idea per un articolo? Rispondiamo entro 48 ore. Per i brand: Vuoi collaborare? Solo brand allineati ai nostri valori. Scrivi con: nome brand, idea, budget.',
    emailCardTitle: 'Email business',
    emailCardDescription: 'Per proposte commerciali, richieste e media kit',
    emailCardLinkLabel: 'Scopri i servizi',
    whatsappCardTitle: 'WhatsApp',
    whatsappCardDescription: 'Ideale per domande veloci o per fissare una call conoscitiva.',
    helperTitle: 'Per aiutarci a risponderti meglio',
    helperItems: [
      'Se ci scrivi per una collaborazione, indica brand o struttura, obiettivo e periodo indicativo.',
      'Se hai bisogno del media kit, puoi usare anche la pagina dedicata per aprire il contatto in modo più ordinato.',
      'Se la richiesta è rapida o informale, Instagram e WhatsApp sono spesso i canali più immediati.',
    ],
    formTitle: 'Inviaci un messaggio',
  },
  footer: {
    description:
      'Budget travel, food experience e posti che valgono davvero — raccontati da Rodrigo e Betta dopo 10 anni di strade, tavole e mappe.',
    discoverTitle: 'Scopri',
    resourcesTitle: 'Risorse Digitali',
    projectTitle: 'Progetto',
    newsletterButtonLabel: 'Iscriviti alla newsletter',
  },
  navigation: {
    destinationsLabel: 'Destinazioni',
    destinationsAllLabel: 'Tutte le destinazioni',
    guidesLabel: 'Guide',
    experiencesLabel: 'Esperienze',
    resourcesLabel: 'Strumenti',
    shopLabel: 'Shop',
    collaborationsLabel: 'Collaborazioni',
    mediaKitLabel: 'Media kit',
    aboutLabel: 'Chi siamo',
    contactsLabel: 'Contatti',
    favoritesLabel: 'Preferiti',
    searchLabel: 'Cerca',
  },
  demo: {
    showEditorialDemo: true,
    showDestinationDemo: true,
    showShopDemo: true,
    showDemoBadges: true,
  },
};

type PrimitiveFieldType = 'text' | 'textarea' | 'url' | 'boolean';

export interface SiteContentObjectField {
  key: string;
  label: string;
  type: PrimitiveFieldType;
  placeholder?: string;
  rows?: number;
}

export interface SiteContentFieldDefinition {
  key: string;
  label: string;
  type: PrimitiveFieldType | 'string-list' | 'object-list';
  description?: string;
  placeholder?: string;
  rows?: number;
  itemLabel?: string;
  fields?: SiteContentObjectField[];
}

export interface SiteContentDefinition<K extends SiteContentKey = SiteContentKey> {
  id: K;
  title: string;
  description: string;
  previewPath: string;
  fields: SiteContentFieldDefinition[];
}

export const siteContentDefinitions: SiteContentDefinition[] = [
  {
    id: 'home',
    title: 'Home',
    description:
      'Hero, CTA, percorsi di ingresso, introduzione al progetto e sezione social della home.',
    previewPath: '/',
    fields: [
      { key: 'heroEyebrow', label: 'Eyebrow hero', type: 'text' },
      { key: 'heroTitleMain', label: 'Titolo hero riga principale', type: 'text' },
      { key: 'heroTitleAccent', label: 'Titolo hero parte evidenziata', type: 'text' },
      { key: 'heroDescription', label: 'Descrizione hero', type: 'textarea', rows: 4 },
      { key: 'primaryCtaLabel', label: 'CTA primaria label', type: 'text' },
      { key: 'primaryCtaLink', label: 'CTA primaria link', type: 'url' },
      { key: 'secondaryCtaLabel', label: 'CTA secondaria label', type: 'text' },
      { key: 'secondaryCtaLink', label: 'CTA secondaria link', type: 'url' },
      { key: 'quickPillars', label: 'Pilastri rapidi', type: 'string-list', itemLabel: 'Pilastro' },
      {
        key: 'audiencePaths',
        label: 'Percorsi utente',
        type: 'object-list',
        itemLabel: 'Percorso',
        fields: [
          { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
          { key: 'title', label: 'Titolo', type: 'text' },
          { key: 'description', label: 'Descrizione', type: 'textarea', rows: 3 },
          { key: 'to', label: 'Link', type: 'url' },
          { key: 'cta', label: 'CTA', type: 'text' },
        ],
      },
      { key: 'aboutEyebrow', label: 'Eyebrow blocco chi siamo', type: 'text' },
      { key: 'aboutTitleMain', label: 'Titolo blocco chi siamo', type: 'text' },
      { key: 'aboutTitleAccent', label: 'Titolo blocco chi siamo accent', type: 'text' },
      { key: 'aboutDescription', label: 'Descrizione blocco chi siamo', type: 'textarea', rows: 4 },
      { key: 'aboutButtonLabel', label: 'Bottone blocco chi siamo', type: 'text' },
      { key: 'aboutButtonLink', label: 'Link bottone blocco chi siamo', type: 'url' },
      {
        key: 'boutiqueIntro',
        label: 'Introduzione sezione risorse selezionate',
        type: 'textarea',
        rows: 4,
      },
      { key: 'socialTitle', label: 'Titolo sezione social', type: 'text' },
      { key: 'socialDescription', label: 'Descrizione sezione social', type: 'textarea', rows: 4 },
      {
        key: 'instagramDescription',
        label: 'Descrizione card Instagram',
        type: 'textarea',
        rows: 3,
      },
      { key: 'instagramCta', label: 'CTA card Instagram', type: 'text' },
      { key: 'tiktokDescription', label: 'Descrizione card TikTok', type: 'textarea', rows: 3 },
      { key: 'tiktokCta', label: 'CTA card TikTok', type: 'text' },
    ],
  },
  {
    id: 'about',
    title: 'Chi siamo',
    description: 'Introduzione personale, aree focus, valori e pubblico del progetto.',
    previewPath: '/chi-siamo',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow pagina', type: 'text' },
      { key: 'heroTitleMain', label: 'Titolo principale', type: 'text' },
      { key: 'heroTitleAccent', label: 'Titolo accent', type: 'text' },
      {
        key: 'introParagraphs',
        label: 'Paragrafi introduttivi',
        type: 'string-list',
        itemLabel: 'Paragrafo',
      },
      { key: 'primaryCtaLabel', label: 'CTA principale label', type: 'text' },
      { key: 'primaryCtaLink', label: 'CTA principale link', type: 'url' },
      { key: 'quoteText', label: 'Citazione', type: 'textarea', rows: 3 },
      { key: 'quoteAuthor', label: 'Autore citazione', type: 'text' },
      { key: 'focusTitle', label: 'Titolo focus', type: 'text' },
      { key: 'focusSubtitle', label: 'Sottotitolo focus', type: 'text' },
      {
        key: 'focusAreas',
        label: 'Aree focus',
        type: 'object-list',
        itemLabel: 'Area',
        fields: [
          { key: 'title', label: 'Titolo', type: 'text' },
          { key: 'text', label: 'Testo', type: 'textarea', rows: 3 },
        ],
      },
      { key: 'principlesTitle', label: 'Titolo valori', type: 'text' },
      { key: 'principlesSubtitle', label: 'Sottotitolo valori', type: 'text' },
      {
        key: 'principles',
        label: 'Valori',
        type: 'object-list',
        itemLabel: 'Valore',
        fields: [
          { key: 'title', label: 'Titolo', type: 'text' },
          { key: 'text', label: 'Testo', type: 'textarea', rows: 3 },
        ],
      },
      { key: 'audienceTitle', label: 'Titolo pubblico', type: 'text' },
      { key: 'audienceDescription', label: 'Descrizione pubblico', type: 'textarea', rows: 3 },
      { key: 'audienceItems', label: 'Punti pubblico', type: 'string-list', itemLabel: 'Punto' },
    ],
  },
  {
    id: 'collaborations',
    title: 'Collaborazioni',
    description:
      'Messaggio B2B, servizi, processo, partner ideali e CTA della pagina collaborazioni.',
    previewPath: '/collaborazioni',
    fields: [
      { key: 'heroEyebrow', label: 'Eyebrow hero', type: 'text' },
      { key: 'heroTitleMain', label: 'Titolo hero principale', type: 'text' },
      { key: 'heroTitleAccent', label: 'Titolo hero accent', type: 'text' },
      { key: 'heroDescription', label: 'Descrizione hero', type: 'textarea', rows: 4 },
      { key: 'heroChecklist', label: 'Bullet hero', type: 'string-list', itemLabel: 'Bullet' },
      { key: 'primaryCtaLabel', label: 'CTA primaria label', type: 'text' },
      { key: 'primaryCtaLink', label: 'CTA primaria link', type: 'url' },
      { key: 'secondaryCtaLabel', label: 'CTA secondaria label', type: 'text' },
      { key: 'secondaryCtaLink', label: 'CTA secondaria link', type: 'url' },
      { key: 'statsTitle', label: 'Titolo metriche', type: 'text' },
      { key: 'statsDescription', label: 'Descrizione metriche', type: 'textarea', rows: 4 },
      { key: 'servicesTitle', label: 'Titolo servizi', type: 'text' },
      { key: 'servicesSubtitle', label: 'Sottotitolo servizi', type: 'text' },
      {
        key: 'services',
        label: 'Servizi',
        type: 'object-list',
        itemLabel: 'Servizio',
        fields: [
          { key: 'title', label: 'Titolo', type: 'text' },
          { key: 'description', label: 'Descrizione', type: 'textarea', rows: 3 },
        ],
      },
      { key: 'processTitle', label: 'Titolo processo', type: 'text' },
      {
        key: 'processSteps',
        label: 'Step processo',
        type: 'object-list',
        itemLabel: 'Step',
        fields: [
          { key: 'step', label: 'Numero step', type: 'text' },
          { key: 'title', label: 'Titolo', type: 'text' },
          { key: 'description', label: 'Descrizione', type: 'textarea', rows: 3 },
        ],
      },
      { key: 'partnerTitle', label: 'Titolo partner ideali', type: 'text' },
      { key: 'partnerDescription', label: 'Descrizione partner ideali', type: 'textarea', rows: 4 },
      {
        key: 'partnerTypes',
        label: 'Tipi partner',
        type: 'object-list',
        itemLabel: 'Partner',
        fields: [
          { key: 'title', label: 'Titolo', type: 'text' },
          { key: 'text', label: 'Descrizione', type: 'textarea', rows: 3 },
        ],
      },
      { key: 'formatsTitle', label: 'Titolo formati collaborazione', type: 'text' },
      {
        key: 'formatsDescription',
        label: 'Descrizione formati collaborazione',
        type: 'textarea',
        rows: 4,
      },
      {
        key: 'collaborationFormats',
        label: 'Formati collaborazione',
        type: 'object-list',
        itemLabel: 'Formato',
        fields: [
          { key: 'title', label: 'Titolo', type: 'text' },
          { key: 'subtitle', label: 'Sottotitolo', type: 'text' },
          { key: 'features', label: 'Caratteristiche separate da |', type: 'text' },
          { key: 'highlight', label: 'Formato evidenziato (true/false)', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contatti',
    description: 'Hero, cards contatto, testo guida e titolo form della pagina contatti.',
    previewPath: '/contatti',
    fields: [
      { key: 'heroEyebrow', label: 'Eyebrow hero', type: 'text' },
      { key: 'heroTitleMain', label: 'Titolo hero principale', type: 'text' },
      { key: 'heroTitleAccent', label: 'Titolo hero accent', type: 'text' },
      { key: 'heroDescription', label: 'Descrizione hero', type: 'textarea', rows: 4 },
      { key: 'emailCardTitle', label: 'Titolo card email', type: 'text' },
      { key: 'emailCardDescription', label: 'Descrizione card email', type: 'textarea', rows: 3 },
      { key: 'emailCardLinkLabel', label: 'Link card email', type: 'text' },
      { key: 'whatsappCardTitle', label: 'Titolo card WhatsApp', type: 'text' },
      {
        key: 'whatsappCardDescription',
        label: 'Descrizione card WhatsApp',
        type: 'textarea',
        rows: 3,
      },
      { key: 'helperTitle', label: 'Titolo box guida', type: 'text' },
      { key: 'helperItems', label: 'Punti box guida', type: 'string-list', itemLabel: 'Punto' },
      { key: 'formTitle', label: 'Titolo form', type: 'text' },
    ],
  },
  {
    id: 'footer',
    title: 'Footer',
    description: 'Descrizione, titoli colonne e CTA newsletter del footer.',
    previewPath: '/',
    fields: [
      { key: 'description', label: 'Descrizione footer', type: 'textarea', rows: 4 },
      { key: 'discoverTitle', label: 'Titolo colonna scopri', type: 'text' },
      { key: 'resourcesTitle', label: 'Titolo colonna risorse', type: 'text' },
      { key: 'projectTitle', label: 'Titolo colonna progetto', type: 'text' },
      { key: 'newsletterButtonLabel', label: 'Label bottone newsletter', type: 'text' },
    ],
  },
  {
    id: 'navigation',
    title: 'Menu di navigazione',
    description: 'Nomi voci principali e sottomenu visibili su desktop e mobile.',
    previewPath: '/',
    fields: [
      { key: 'destinationsLabel', label: 'Label destinazioni', type: 'text' },
      { key: 'destinationsAllLabel', label: 'Label tutte le destinazioni', type: 'text' },
      { key: 'guidesLabel', label: 'Label guide', type: 'text' },
      { key: 'experiencesLabel', label: 'Label esperienze', type: 'text' },
      { key: 'resourcesLabel', label: 'Label risorse', type: 'text' },
      { key: 'shopLabel', label: 'Label shop', type: 'text' },
      { key: 'collaborationsLabel', label: 'Label collaborazioni', type: 'text' },
      { key: 'mediaKitLabel', label: 'Label media kit', type: 'text' },
      { key: 'aboutLabel', label: 'Label chi siamo', type: 'text' },
      { key: 'contactsLabel', label: 'Label contatti', type: 'text' },
      { key: 'favoritesLabel', label: 'Label preferiti', type: 'text' },
      { key: 'searchLabel', label: 'Label cerca', type: 'text' },
    ],
  },
  {
    id: 'demo',
    title: 'Contenuti demo',
    description:
      'Controlli rapidi per mostrare o nascondere i demo pubblici prima della pubblicazione definitiva.',
    previewPath: '/',
    fields: [
      {
        key: 'showEditorialDemo',
        label: 'Mostra demo editoriale',
        type: 'boolean',
        description:
          "Mantiene online l'unico articolo o guida demo per vedere il layout finale dei contenuti editoriali.",
      },
      {
        key: 'showDestinationDemo',
        label: 'Mostra demo destinazioni',
        type: 'boolean',
        description:
          'Mantiene un solo contenuto demo nella pagina destinazioni e nella mappa quando non hai ancora contenuti reali.',
      },
      {
        key: 'showShopDemo',
        label: 'Mostra demo shop',
        type: 'boolean',
        description:
          'Mantiene un solo prodotto demo per vedere il layout boutique e pagina prodotto.',
      },
      {
        key: 'showDemoBadges',
        label: 'Mostra badge demo',
        type: 'boolean',
        description:
          'Aggiunge etichette Demo sulle anteprime per rendere chiaro che si tratta di contenuti provvisori.',
      },
    ],
  },
];

export const siteContentDefinitionsById = Object.fromEntries(
  siteContentDefinitions.map((definition) => [definition.id, definition])
) as Record<SiteContentKey, SiteContentDefinition>;
