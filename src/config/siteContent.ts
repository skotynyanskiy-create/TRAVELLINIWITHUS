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
    heroEyebrow: 'Rodrigo & Betta / Travelliniwithus',
    heroTitleMain: 'Posti particolari',
    heroTitleAccent: 'che valgono davvero',
    heroDescription:
      'Guide pratiche scritte da chi ha vissuto il viaggio. Atmosfera, dettagli utili e consigli che aiutano a capire se un posto merita davvero.',
    primaryCtaLabel: 'Scopri destinazioni',
    primaryCtaLink: '/destinazioni',
    secondaryCtaLabel: 'Ultime storie',
    secondaryCtaLink: '/#storie',
    quickPillars: [
      'Posti particolari selezionati con criterio',
      'Informazioni utili prima di partire',
      'Storytelling visivo e prova reale',
    ],
    audiencePaths: [
      {
        eyebrow: 'Scopri',
        title: 'Posti particolari',
        description:
          'Destinazioni, luoghi e soggiorni che meritano davvero di entrare nei tuoi piani.',
        to: '/destinazioni',
        cta: 'Esplora i luoghi',
      },
      {
        eyebrow: 'Preparati meglio',
        title: 'Guide e strumenti',
        description:
          'Risorse, consigli pratici e strumenti che usiamo per viaggiare con meno rumore e più criterio.',
        to: '/risorse',
        cta: 'Apri le risorse',
      },
      {
        eyebrow: 'Lavora con noi',
        title: 'Collaborazioni selettive',
        description:
          'Una porta chiara per hotel, destinazioni e brand che vogliono un racconto credibile.',
        to: '/collaborazioni',
        cta: 'Scopri il lato B2B',
      },
    ],
    aboutEyebrow: 'Il metodo',
    aboutTitleMain: 'Andiamo, proviamo,',
    aboutTitleAccent: 'solo dopo consigliamo',
    aboutDescription:
      'Travelliniwithus non nasce per mostrare più posti possibile. Nasce per selezionare quelli che meritano davvero, con un racconto abbastanza concreto da aiutarti a decidere.',
    aboutButtonLabel: 'Come lavoriamo davvero',
    aboutButtonLink: '/chi-siamo',
    boutiqueIntro:
      'Poche risorse, scelte per viaggiare meglio: strumenti, app e riferimenti che hanno senso dentro il nostro modo di partire e raccontare.',
    socialTitle: 'Seguici dove il viaggio succede',
    socialDescription:
      'Il sito ordina il progetto. I social mostrano il ritmo quotidiano: scoperte, backstage, luoghi salvabili e il nostro modo di raccontare mentre siamo in viaggio.',
    instagramDescription:
      'Il canale principale per reel, luoghi da salvare, stile del progetto e contatto diretto con la community.',
    instagramCta: 'Apri Instagram',
    tiktokDescription:
      'Il lato più rapido del progetto: scorci, idee e contenuti pensati per essere immediati e memorabili.',
    tiktokCta: 'Apri TikTok',
  },
  about: {
    eyebrow: 'Rodrigo, Betta e il metodo Travelliniwithus',
    heroTitleMain: 'Come scegliamo',
    heroTitleAccent: 'i posti che consigliamo',
    introParagraphs: [
      'Siamo Rodrigo e Betta. Travelliniwithus nasce dal desiderio di consigliare meno posti, ma consigliarli meglio.',
      'Il progetto tiene insieme sguardo personale, immagini, ricerca e dettagli pratici: serve a chi vuole scoprire luoghi con più criterio, non a chi cerca la lista più lunga.',
      'Ogni destinazione, soggiorno o esperienza passa da una domanda semplice: aiuterebbe davvero qualcuno a scegliere meglio?',
    ],
    primaryCtaLabel: 'Scopri come collaborare',
    primaryCtaLink: '/collaborazioni',
    quoteText: 'Non ci interessa mostrare tutto. Ci interessa consigliare bene.',
    quoteAuthor: 'Rodrigo & Betta',
    focusTitle: 'Perché fidarsi',
    focusSubtitle: 'Metodo editoriale',
    focusAreas: [
      {
        title: 'Esperienza diretta',
        text: 'Ogni luogo passa dalla prova reale: atmosfera, zona, logistica e dettagli vengono filtrati dal tempo sul posto, non da una lista trovata online.',
      },
      {
        title: 'Libertà editoriale',
        text: 'Quando collaboriamo, lo facciamo in modo dichiarato e senza rinunciare al nostro modo di raccontare. Altrimenti preferiamo non farlo.',
      },
      {
        title: 'Immagini e dettagli credibili',
        text: 'Le foto devono aiutare a capire il luogo, non solo a renderlo desiderabile. Il racconto resta legato alla realtà del posto.',
      },
    ],
    principlesTitle: 'Quello che difendiamo',
    principlesSubtitle: 'Le nostre regole',
    principles: [
      {
        title: 'Utilità prima del volume',
        text: 'Ogni contenuto deve aiutare chi legge a decidere meglio, non solo a restare più tempo sul sito.',
      },
      {
        title: 'Selezione prima della lista',
        text: 'Non cerchiamo di coprire tutto. Selezioniamo luoghi, esperienze e strumenti che hanno davvero qualcosa da lasciare.',
      },
      {
        title: 'Credibilità prima della scena',
        text: 'Preferiamo un racconto più sobrio ma vero a una pagina bella che promette più di quello che esiste.',
      },
    ],
    audienceTitle: 'Per chi è costruito questo progetto',
    audienceDescription:
      'Il nostro contenuto è per chi apprezza scelta, contesto e un punto di vista riconoscibile.',
    audienceItems: [
      'Viaggiatori che vogliono uscire dalle liste copia-incolla e capire se un luogo merita davvero.',
      'Persone che cercano strumenti, guide e dettagli pratici con un uso concreto.',
      'Partner che capiscono il valore di un racconto con criterio e non di una vetrina generica.',
    ],
  },
  collaborations: {
    heroEyebrow: 'Collaborazioni editoriali',
    heroTitleMain: 'Raccontiamo progetti travel',
    heroTitleAccent: 'con credibilità editoriale',
    heroDescription:
      'Lavoriamo con realtà travel, hospitality e lifestyle quando esiste un allineamento reale tra progetto, pubblico e libertà editoriale. Non cerchiamo volume: cerchiamo fit.',
    heroChecklist: [
      'Hotel, destinazioni, brand travel e progetti con una storia vera da raccontare',
      'Libertà editoriale chiara, senza copioni finti o promesse cosmetiche',
      'Contenuti visivi e testuali costruiti per reggere nel tempo',
      'Media kit, numeri e contatto business ordinati e trasparenti',
    ],
    primaryCtaLabel: 'Richiedi il media kit',
    primaryCtaLink: '/media-kit',
    secondaryCtaLabel: 'Scrivici per una proposta',
    secondaryCtaLink: '/contatti',
    statsTitle: 'Numeri utili, non rumore',
    statsDescription:
      'Community reale, reach pubblica e presenza costruita in anni di contenuti salvabili. Usiamo solo segnali che possiamo sostenere, non metriche decorative.',
    servicesTitle: 'Format con un esito chiaro',
    servicesSubtitle: 'Come può prendere forma una collaborazione',
    services: [
      {
        title: 'Presenza editoriale',
        description:
          'Articoli, guide o inserti editoriali che servono a posizionare bene un luogo, una struttura o un progetto.',
      },
      {
        title: 'Attivazione destinazione',
        description:
          'Racconti più ampi per territori, enti e destinazioni che hanno bisogno di un frame narrativo più completo.',
      },
      {
        title: 'Contenuti visuali e UGC',
        description:
          'Foto, video e materiali pensati per funzionare sui nostri canali o come contenuti utili al brand.',
      },
      {
        title: 'Progetto su misura',
        description:
          'Quando il progetto lo merita, costruiamo un formato ad hoc che tenga insieme contenuto, ritmo e obiettivo.',
      },
    ],
    processTitle: 'Come lavoriamo',
    processSteps: [
      {
        step: '1',
        title: 'Contesto',
        description: 'Ci contatti con un progetto concreto, un obiettivo e un timing indicativo.',
      },
      {
        step: '2',
        title: 'Valutazione',
        description:
          'Capiamo se il progetto è coerente con il nostro pubblico, con il tono del brand e con il tipo di contenuto che sappiamo fare bene.',
      },
      {
        step: '3',
        title: 'Sviluppo',
        description:
          'Definiamo il perimetro e costruiamo il racconto con libertà editoriale, immagini reali e tono coerente.',
      },
      {
        step: '4',
        title: 'Pubblicazione',
        description:
          'Pubblichiamo in modo trasparente e misuriamo quello che conta davvero per il contesto del progetto.',
      },
    ],
    partnerTitle: 'Con chi lavoriamo meglio',
    partnerDescription:
      'Restiamo aperti a progetti diversi, ma lavoriamo meglio quando ci sono identità, contesto e una storia che vale la pena raccontare.',
    partnerTypes: [
      {
        title: 'Hotel e hospitality',
        text: 'Boutique hotel, glamping, agriturismi, relais e soggiorni con una forte atmosfera di luogo.',
      },
      {
        title: 'Destinazioni e territori',
        text: 'DMO, enti turismo, territori e destinazioni che vogliono essere raccontati con profondità e meno brochure.',
      },
      {
        title: 'Brand travel e lifestyle',
        text: 'Prodotti, servizi e strumenti coerenti con il modo in cui viaggiamo, raccontiamo e consigliamo.',
      },
    ],
    formatsTitle: 'Tre modi per partire bene',
    formatsDescription:
      'Partiamo da format chiari per orientare la conversazione, ma i progetti migliori restano calibrati sul contesto reale.',
    collaborationFormats: [
      {
        title: 'Presenza editoriale',
        subtitle: 'Per racconti mirati e ben contestualizzati',
        features: [
          'Articolo, guida o inserimento editoriale sul sito',
          'Menzione o supporto social coerente al formato',
          'Tono pulito e integrato nel progetto',
          'Pensato per partner che vogliono chiarezza e credibilità',
        ],
      },
      {
        title: 'Attivazione destinazione',
        subtitle: 'Per territori, soggiorni o storytelling più ampi',
        features: [
          'Contenuto cross-canale con più profondità',
          'Integrazione tra guida, visual e social',
          'Ideale per hospitality e destinazioni',
          'Pensato per valorizzare il contesto, non solo il lancio',
        ],
        highlight: 'true',
      },
      {
        title: 'Progetto su misura',
        subtitle: 'Per format speciali o esigenze non standard',
        features: [
          'Formato costruito sul progetto',
          'Flessibilità tra contenuto, visual e contesto',
          'Possibile uso UGC o contenuti dedicati',
          'Adatto quando il progetto merita una struttura propria',
        ],
      },
    ],
  },
  contact: {
    heroEyebrow: 'Contatti',
    heroTitleMain: 'Scrivici',
    heroTitleAccent: 'dal canale giusto',
    heroDescription:
      'Per domande, idee e richieste semplici puoi usare il form. Per collaborazioni e brand, parti dal media kit o indica subito progetto, obiettivo e periodo.',
    emailCardTitle: 'Email business',
    emailCardDescription: 'Per proposte commerciali, richieste strutturate e media kit.',
    emailCardLinkLabel: 'Apri il media kit',
    whatsappCardTitle: 'WhatsApp',
    whatsappCardDescription: 'Ideale per richieste rapide o per capire se ha senso fissare una call.',
    helperTitle: 'Per aiutarci a risponderti meglio',
    helperItems: [
      'Se ci scrivi per una collaborazione, indica brand o struttura, obiettivo e periodo indicativo.',
      'Se hai bisogno del media kit, usa la pagina dedicata: rende il contatto più ordinato.',
      'Se la richiesta è informale, Instagram e WhatsApp restano i canali più immediati.',
    ],
    formTitle: 'Inviaci un messaggio',
  },
  footer: {
    description:
      'Posti particolari, esperienze vere e informazioni utili raccontate da Rodrigo e Betta con criterio, immagini e prova reale.',
    discoverTitle: 'Scopri',
    resourcesTitle: 'Risorse',
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
    showEditorialDemo: !(import.meta.env?.PROD ?? true),
    showDestinationDemo: !(import.meta.env?.PROD ?? true),
    showShopDemo: !(import.meta.env?.PROD ?? true),
    showDemoBadges: !(import.meta.env?.PROD ?? true),
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

const textField = (key: string, label: string): SiteContentFieldDefinition => ({
  key,
  label,
  type: 'text',
});

const urlField = (key: string, label: string): SiteContentFieldDefinition => ({
  key,
  label,
  type: 'url',
});

const textareaField = (key: string, label: string, rows = 4): SiteContentFieldDefinition => ({
  key,
  label,
  type: 'textarea',
  rows,
});

const stringListField = (key: string, label: string, itemLabel: string): SiteContentFieldDefinition => ({
  key,
  label,
  type: 'string-list',
  itemLabel,
});

const cardFields: SiteContentObjectField[] = [
  { key: 'title', label: 'Titolo', type: 'text' },
  { key: 'text', label: 'Testo', type: 'textarea', rows: 3 },
];

export const siteContentDefinitions: SiteContentDefinition[] = [
  {
    id: 'home',
    title: 'Home',
    description:
      'Hero, CTA, percorsi di ingresso, introduzione al progetto e sezione social della home.',
    previewPath: '/',
    fields: [
      textField('heroEyebrow', 'Eyebrow hero'),
      textField('heroTitleMain', 'Titolo hero riga principale'),
      textField('heroTitleAccent', 'Titolo hero parte evidenziata'),
      textareaField('heroDescription', 'Descrizione hero'),
      textField('primaryCtaLabel', 'CTA primaria label'),
      urlField('primaryCtaLink', 'CTA primaria link'),
      textField('secondaryCtaLabel', 'CTA secondaria label'),
      urlField('secondaryCtaLink', 'CTA secondaria link'),
      stringListField('quickPillars', 'Pilastri rapidi', 'Pilastro'),
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
      textField('aboutEyebrow', 'Eyebrow blocco chi siamo'),
      textField('aboutTitleMain', 'Titolo blocco chi siamo'),
      textField('aboutTitleAccent', 'Titolo blocco chi siamo accent'),
      textareaField('aboutDescription', 'Descrizione blocco chi siamo'),
      textField('aboutButtonLabel', 'Bottone blocco chi siamo'),
      urlField('aboutButtonLink', 'Link bottone blocco chi siamo'),
      textareaField('boutiqueIntro', 'Introduzione sezione risorse selezionate'),
      textField('socialTitle', 'Titolo sezione social'),
      textareaField('socialDescription', 'Descrizione sezione social'),
      textareaField('instagramDescription', 'Descrizione card Instagram', 3),
      textField('instagramCta', 'CTA card Instagram'),
      textareaField('tiktokDescription', 'Descrizione card TikTok', 3),
      textField('tiktokCta', 'CTA card TikTok'),
    ],
  },
  {
    id: 'about',
    title: 'Chi siamo',
    description: 'Introduzione personale, aree focus, valori e pubblico del progetto.',
    previewPath: '/chi-siamo',
    fields: [
      textField('eyebrow', 'Eyebrow pagina'),
      textField('heroTitleMain', 'Titolo principale'),
      textField('heroTitleAccent', 'Titolo accent'),
      stringListField('introParagraphs', 'Paragrafi introduttivi', 'Paragrafo'),
      textField('primaryCtaLabel', 'CTA principale label'),
      urlField('primaryCtaLink', 'CTA principale link'),
      textareaField('quoteText', 'Citazione', 3),
      textField('quoteAuthor', 'Autore citazione'),
      textField('focusTitle', 'Titolo focus'),
      textField('focusSubtitle', 'Sottotitolo focus'),
      { key: 'focusAreas', label: 'Aree focus', type: 'object-list', itemLabel: 'Area', fields: cardFields },
      textField('principlesTitle', 'Titolo valori'),
      textField('principlesSubtitle', 'Sottotitolo valori'),
      { key: 'principles', label: 'Valori', type: 'object-list', itemLabel: 'Valore', fields: cardFields },
      textField('audienceTitle', 'Titolo pubblico'),
      textareaField('audienceDescription', 'Descrizione pubblico', 3),
      stringListField('audienceItems', 'Punti pubblico', 'Punto'),
    ],
  },
  {
    id: 'collaborations',
    title: 'Collaborazioni',
    description:
      'Messaggio B2B, servizi, processo, partner ideali e CTA della pagina collaborazioni.',
    previewPath: '/collaborazioni',
    fields: [
      textField('heroEyebrow', 'Eyebrow hero'),
      textField('heroTitleMain', 'Titolo hero principale'),
      textField('heroTitleAccent', 'Titolo hero accent'),
      textareaField('heroDescription', 'Descrizione hero'),
      stringListField('heroChecklist', 'Bullet hero', 'Bullet'),
      textField('primaryCtaLabel', 'CTA primaria label'),
      urlField('primaryCtaLink', 'CTA primaria link'),
      textField('secondaryCtaLabel', 'CTA secondaria label'),
      urlField('secondaryCtaLink', 'CTA secondaria link'),
      textField('statsTitle', 'Titolo metriche'),
      textareaField('statsDescription', 'Descrizione metriche'),
      textField('servicesTitle', 'Titolo servizi'),
      textField('servicesSubtitle', 'Sottotitolo servizi'),
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
      textField('processTitle', 'Titolo processo'),
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
      textField('partnerTitle', 'Titolo partner ideali'),
      textareaField('partnerDescription', 'Descrizione partner ideali'),
      { key: 'partnerTypes', label: 'Tipi partner', type: 'object-list', itemLabel: 'Partner', fields: cardFields },
      textField('formatsTitle', 'Titolo formati collaborazione'),
      textareaField('formatsDescription', 'Descrizione formati collaborazione'),
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
      textField('heroEyebrow', 'Eyebrow hero'),
      textField('heroTitleMain', 'Titolo hero principale'),
      textField('heroTitleAccent', 'Titolo hero accent'),
      textareaField('heroDescription', 'Descrizione hero'),
      textField('emailCardTitle', 'Titolo card email'),
      textareaField('emailCardDescription', 'Descrizione card email', 3),
      textField('emailCardLinkLabel', 'Link card email'),
      textField('whatsappCardTitle', 'Titolo card WhatsApp'),
      textareaField('whatsappCardDescription', 'Descrizione card WhatsApp', 3),
      textField('helperTitle', 'Titolo box guida'),
      stringListField('helperItems', 'Punti box guida', 'Punto'),
      textField('formTitle', 'Titolo form'),
    ],
  },
  {
    id: 'footer',
    title: 'Footer',
    description: 'Descrizione, titoli colonne e CTA newsletter del footer.',
    previewPath: '/',
    fields: [
      textareaField('description', 'Descrizione footer'),
      textField('discoverTitle', 'Titolo colonna scopri'),
      textField('resourcesTitle', 'Titolo colonna risorse'),
      textField('projectTitle', 'Titolo colonna progetto'),
      textField('newsletterButtonLabel', 'Label bottone newsletter'),
    ],
  },
  {
    id: 'navigation',
    title: 'Menu di navigazione',
    description: 'Nomi voci principali e sottomenu visibili su desktop e mobile.',
    previewPath: '/',
    fields: [
      textField('destinationsLabel', 'Label destinazioni'),
      textField('destinationsAllLabel', 'Label tutte le destinazioni'),
      textField('guidesLabel', 'Label guide'),
      textField('experiencesLabel', 'Label esperienze'),
      textField('resourcesLabel', 'Label risorse'),
      textField('shopLabel', 'Label shop'),
      textField('collaborationsLabel', 'Label collaborazioni'),
      textField('mediaKitLabel', 'Label media kit'),
      textField('aboutLabel', 'Label chi siamo'),
      textField('contactsLabel', 'Label contatti'),
      textField('favoritesLabel', 'Label preferiti'),
      textField('searchLabel', 'Label cerca'),
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
          'Mantiene online un articolo dimostrativo solo per verificare layout e flusso prima della pubblicazione.',
      },
      {
        key: 'showDestinationDemo',
        label: 'Mostra demo destinazioni',
        type: 'boolean',
        description:
          'Mostra una destinazione dimostrativa quando non esistono ancora contenuti reali pubblicati.',
      },
      {
        key: 'showShopDemo',
        label: 'Mostra demo shop',
        type: 'boolean',
        description:
          'Mostra un prodotto dimostrativo per verificare il layout boutique e la pagina prodotto.',
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
