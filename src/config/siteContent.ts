import { BRAND_COPY, BRAND_STATS, CONTACTS } from './site';

export interface HomeActionLink {
  label: string;
  link: string;
}

export interface HomeArtDirection {
  shotIntent: string;
  imageAlt: string;
  imageCaption: string;
  overlayTone: string;
}

export interface HomeProofItem {
  value: string;
  label: string;
  context: string;
}

export type HomeStatItem = HomeProofItem;

export interface HomeHeroContent {
  eyebrow: string;
  titleMain: string;
  titleAccent: string;
  description: string;
  proofLine: string;
  quickPillars: string[];
  ctaPrimary: HomeActionLink;
  ctaSecondary: HomeActionLink;
  artDirection: HomeArtDirection;
}

export interface HomeEditorialContent {
  eyebrow: string;
  title: string;
  description: string;
  helperLabel: string;
  reasonToOpen: string;
  ctaLabel: string;
}

export interface HomeArchivePanel {
  eyebrow: string;
  title: string;
  description: string;
  helperLabel: string;
  ctaLabel: string;
  ctaLink: string;
}

export interface HomeProjectContent {
  eyebrow: string;
  titleMain: string;
  titleAccent: string;
  description: string;
  methodLabel: string;
  methodTitle: string;
  methodDescription: string;
  methodPoints: string[];
  creatorLabel: string;
  creatorTitle: string;
  creatorDescription: string;
  creatorBenefits: AboutCard[];
  primaryCta: HomeActionLink;
  secondaryCta: HomeActionLink;
  artDirection: HomeArtDirection;
}

export interface HomeUtilityContent {
  eyebrow: string;
  title: string;
  description: string;
  resourcesLabel: string;
  resourcesTitle: string;
  resourcesDescription: string;
  resourcesNote: string;
  resourcesCta: HomeActionLink;
  newsletterLabel: string;
  newsletterTitle: string;
  newsletterDescription: string;
  newsletterProofLine: string;
  newsletterSource: string;
}

export interface HomeContent {
  hero: HomeHeroContent;
  proofRail: {
    eyebrow: string;
    items: HomeProofItem[];
  };
  editorial: HomeEditorialContent;
  archive: {
    eyebrow: string;
    title: string;
    description: string;
    helperLabel: string;
    destinations: HomeArchivePanel;
    experiences: HomeArchivePanel;
  };
  project: HomeProjectContent;
  utility: HomeUtilityContent;
}

export interface AboutCard {
  title: string;
  text: string;
}

export interface AboutContent {
  eyebrow: string;
  heroTitleMain: string;
  heroTitleAccent: string;
  heroProofLine: string;
  heroImageAlt: string;
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
  timelineTitle: string;
  timelineItems: Array<{ year: string; title: string; text: string }>;
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
  heroProofLine: string;
  heroImageAlt: string;
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
  faqTitle: string;
  faqDescription: string;
  finalCtaTitle: string;
  finalCtaDescription: string;
  finalPrimaryCtaLabel: string;
  finalPrimaryCtaLink: string;
  finalSecondaryCtaLabel: string;
  finalSecondaryCtaLink: string;
}

export interface ContactContent {
  heroEyebrow: string;
  heroTitleMain: string;
  heroTitleAccent: string;
  heroDescription: string;
  directChannelsTitle: string;
  emailCardTitle: string;
  emailCardDescription: string;
  emailCardLinkLabel: string;
  whatsappCardTitle: string;
  whatsappCardDescription: string;
  helperTitle: string;
  helperItems: string[];
  formTitle: string;
  formIntro: string;
  successTitle: string;
  successDescription: string;
}

export interface MediaKitContent {
  heroEyebrow: string;
  heroTitleMain: string;
  heroTitleAccent: string;
  heroDescription: string;
  heroProofLine: string;
  includesTitle: string;
  includesDescription: string;
  formTitle: string;
  formDescription: string;
  fitTitle: string;
  fitDescription: string;
  processTitle: string;
  processSubtitle: string;
  directTitle: string;
  directDescription: string;
}

export interface ResourcesPageContent {
  heroEyebrow: string;
  heroTitleMain: string;
  heroTitleAccent: string;
  heroDescription: string;
  disclosureText: string;
  collageEyebrow: string;
  collageTitle: string;
  collageDescription: string;
  benefitsEyebrow: string;
  benefitsTitle: string;
  benefitsDescription: string;
}

export interface FooterContent {
  tagline: string;
  description: string;
  discoverTitle: string;
  resourcesTitle: string;
  projectTitle: string;
  newsletterButtonLabel: string;
  brandCtaText: string;
  brandCtaLabel: string;
  brandCtaLink: string;
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

export interface NewsletterContent {
  eyebrow: string;
  title: string;
  leadTitle: string;
  leadDescription: string;
  benefits: string[];
  proofLine: string;
  emailLabel: string;
  submitLabel: string;
  privacyLabel: string;
  successTitle: string;
  successDescription: string;
  successNote: string;
}

export interface SiteContentMap {
  home: HomeContent;
  about: AboutContent;
  collaborations: CollaborationsContent;
  contact: ContactContent;
  mediaKit: MediaKitContent;
  resources: ResourcesPageContent;
  footer: FooterContent;
  navigation: NavigationContent;
  newsletter: NewsletterContent;
  demo: DemoContent;
}

export type SiteContentKey = keyof SiteContentMap;

export const siteContentDefaults: SiteContentMap = {
  home: {
    hero: {
      eyebrow: 'Travelliniwithus',
      titleMain: 'Posti particolari',
      titleAccent: 'storie che aiutano a scegliere',
      description:
        'Raccogliamo luoghi, idee e viaggi con un criterio semplice: devono essere belli da vivere, chiari da capire e davvero utili quando arriva il momento di decidere.',
      proofLine:
        `Rodrigo e Betta selezionano da ${BRAND_STATS.yearsOfTravel} anni posti, food experience e viaggi di coppia con uno sguardo reale, non costruito per riempire il feed.`,
      quickPillars: [
        'Luoghi che meritano spazio nei tuoi piani.',
        'Guide scritte dopo l esperienza, non prima.',
        'Selezione reale tra hotel, tavole e weekend.',
      ],
      ctaPrimary: {
        label: 'Scopri i posti',
        link: '/destinazioni',
      },
      ctaSecondary: {
        label: 'Collaborazioni e media kit',
        link: '/collaborazioni',
      },
      artDirection: {
        shotIntent: 'Poster image',
        imageAlt:
          'Rodrigo e Betta in viaggio davanti a un paesaggio naturale ampio, in un momento reale e non posato.',
        imageCaption:
          'Una foto reale, aperta e leggibile: il progetto deve sembrare vissuto, non costruito.',
        overlayTone: 'dark-editorial',
      },
    },
    proofRail: {
      eyebrow: 'Prova rapida',
      items: [
        {
          value: BRAND_STATS.destinationsExplored,
          label: 'Destinazioni esplorate',
          context: 'Serve a chi vuole partire da un archivio gia attraversato, non appena abbozzato.',
        },
        {
          value: BRAND_STATS.totalFollowers,
          label: 'Community reale',
          context: 'Conta per capire che il progetto viene seguito per taglio e fiducia, non solo per intrattenimento.',
        },
        {
          value: 'Guide post-viaggio',
          label: 'Metodo editoriale',
          context: 'Il punto non e pubblicare tanto, ma mettere ordine dopo aver visto, provato e scelto davvero.',
        },
      ],
    },
    editorial: {
      eyebrow: 'Editorial picks',
      title: 'Tre aperture buone per capire il progetto.',
      description:
        'Una selezione corta e curata: contenuti che aiutano davvero a capire se un luogo, un ritmo o un itinerario meritano il tuo tempo.',
      helperLabel: 'Scelti per utilita, non per riempire la home',
      reasonToOpen: 'Apri questa storia se vuoi capire in fretta se vale spazio nei tuoi prossimi piani.',
      ctaLabel: 'Apri destinazioni',
    },
    archive: {
      eyebrow: 'Scegli come entrare',
      title: 'Lo stesso archivio, letto da due lati diversi.',
      description:
        'Quando hai gia una meta in testa parti dal luogo. Quando stai ancora cercando il mood giusto parti dall esperienza.',
      helperLabel: 'Due ingressi chiari, senza dispersione',
      destinations: {
        eyebrow: 'Per luogo',
        title: 'Parti dalla geografia del viaggio.',
        description:
          'Paesi, continenti e gruppi geografici per stringere subito il campo quando sai gia verso dove guardare.',
        helperLabel: 'Ingresso per meta, area o continente',
        ctaLabel: 'Apri le destinazioni',
        ctaLink: '/destinazioni',
      },
      experiences: {
        eyebrow: 'Per mood',
        title: 'Parti dal tipo di esperienza che cerchi.',
        description:
          'Food, hotel con carattere, posti particolari e weekend: lo stesso archivio, ma letto dal lato piu utile quando la meta non e ancora chiara.',
        helperLabel: 'Ingresso per ritmo, taglio o atmosfera',
        ctaLabel: 'Apri le esperienze',
        ctaLink: '/esperienze',
      },
    },
    project: {
      eyebrow: 'Il progetto in breve',
      titleMain: 'Dietro Travelliniwithus',
      titleAccent: 'c e un criterio preciso',
      description:
        'Il sito non nasce per raccontare tutto. Nasce per selezionare meglio: luoghi provati davvero, tagli editoriali chiari e contenuti che aiutano a decidere con piu gusto e meno rumore.',
      methodLabel: 'Metodo',
      methodTitle: 'Perche fidarsi di quello che trovi qui.',
      methodDescription:
        'Siamo Rodrigo e Betta. Viaggiamo in coppia da anni e trasformiamo l esperienza sul posto in storie, appunti e selezioni che restino utili anche fuori dal momento social.',
      methodPoints: [
        'Esperienza diretta sul posto, non copy riciclato.',
        'Liberta editoriale dichiarata su luoghi e collaborazioni.',
        'Foto, selezione e tono costruiti da noi.',
      ],
      creatorLabel: 'Presenza creator',
      creatorTitle: 'Il sito orienta. I social mostrano il ritmo reale.',
      creatorDescription:
        'Instagram e TikTok servono per vedere come si muove il progetto mentre accade: scoperte fresche, backstage, appunti veloci e luoghi da salvare prima che spariscano nel feed.',
      creatorBenefits: [
        {
          title: 'Instagram per salvare',
          text: 'Reels, hotel, scorci e indirizzi da riaprire quando inizi davvero a pianificare.',
        },
        {
          title: 'TikTok per capire il tono',
          text: 'Un lato piu rapido e spontaneo del progetto, utile per vedere il ritmo prima di approfondire sul sito.',
        },
        {
          title: 'Dietro le quinte veri',
          text: 'Ti aiuta a capire come scegliamo i posti e cosa decidiamo di lasciare fuori.',
        },
      ],
      primaryCta: {
        label: 'Scopri come lavoriamo',
        link: '/chi-siamo',
      },
      secondaryCta: {
        label: 'Apri Instagram',
        link: CONTACTS.instagramUrl,
      },
      artDirection: {
        shotIntent: 'Proof image',
        imageAlt:
          'Rodrigo e Betta durante una pausa di viaggio, in un momento naturale che comunica presenza reale e taglio creator.',
        imageCaption:
          'Qui funzionera una foto piu umana e di backstage: non una seconda hero, ma una prova di presenza reale.',
        overlayTone: 'warm-neutral',
      },
    },
    utility: {
      eyebrow: 'Utility finale',
      title: 'Quando vuoi restare dentro il progetto, fallo nel modo piu utile.',
      description:
        'La chiusura della home deve aiutarti a scegliere il canale giusto per restare orientato: newsletter se vuoi ricevere selezioni, risorse se vuoi strumenti gia pronti.',
      resourcesLabel: 'Risorse firmate',
      resourcesTitle: 'Strumenti, link e appunti da aprire quando il viaggio diventa concreto.',
      resourcesDescription:
        'La pagina Risorse raccoglie tool, servizi e attrezzatura che usiamo davvero o che consigliamo solo quando hanno un senso preciso nel progetto.',
      resourcesNote:
        'Niente catalogo gonfiato: poche risorse, spiegate meglio, con un criterio editoriale chiaro.',
      resourcesCta: {
        label: 'Apri le risorse',
        link: '/risorse',
      },
      newsletterLabel: 'Newsletter editoriale',
      newsletterTitle: 'Un club leggero per ricevere solo cio che merita di tornare.',
      newsletterDescription:
        'Dentro trovi nuove storie, posti da salvare, piccoli update sul progetto e risorse che hanno davvero senso fuori dal feed.',
      newsletterProofLine:
        'Cadenza umana, nessun tono aggressivo e disiscrizione semplice quando vuoi.',
      newsletterSource: 'home_utility',
    },
  },
  about: {
    eyebrow: 'Chi siamo',
    heroTitleMain: 'Rodrigo e Betta',
    heroTitleAccent: 'dietro Travelliniwithus',
    heroProofLine:
      'Travelliniwithus esiste per trasformare esperienze vissute in selezioni, storie e appunti che restino utili anche quando il viaggio non e piu nel feed.',
    heroImageAlt:
      'Rodrigo e Betta in un momento reale di viaggio, immersi in un paesaggio aperto e luminoso.',
    introParagraphs: [
      `Viaggiamo insieme da ${BRAND_STATS.yearsOfTravel} anni e abbiamo costruito Travelliniwithus per raccogliere posti, itinerari e scelte che valgano davvero il tempo di chi legge.`,
      'Ogni posto che raccontiamo lo abbiamo vissuto di persona. Ogni guida nasce dopo il viaggio, quando sappiamo cosa tenere, cosa togliere e cosa merita davvero di restare.',
      'Il nostro criterio e semplice: gusto, utilita e onesta. Se un posto e bello ma poco utile, o utile ma senza personalita, non basta per entrare qui.',
    ],
    primaryCtaLabel: 'Apri contatti',
    primaryCtaLink: '/contatti',
    quoteText: 'Raccontiamo solo quello che, una volta tornati, vorremmo davvero rileggere.',
    quoteAuthor: 'Rodrigo & Betta',
    focusTitle: 'Perche fidarsi',
    focusSubtitle: 'Il metodo',
    focusAreas: [
      {
        title: 'Tempo sul posto',
        text: 'Ogni destinazione significa settimane sul posto, non press trip di due giorni. Capiamo la logistica, le fregature e le perle vere.',
      },
      {
        title: 'Zero filtri commerciali',
        text: 'Paghiamo noi i nostri viaggi o scegliamo collaborazioni dichiarate in cui manteniamo totale liberta editoriale.',
      },
      {
        title: 'Immagini vere, non scenografie',
        text: 'Ogni foto e scattata durante il viaggio, non in shooting costruiti a posteriori. Quello che vedi e quello che trovi sul posto.',
      },
    ],
    principlesTitle: 'I nostri standard',
    principlesSubtitle: 'Come lavoriamo',
    principles: [
      {
        title: 'Cura dei dettagli',
        text: 'Betta e giornalista e researcher. Ogni guida include prezzi, orari e dettagli logistici testati sul campo.',
      },
      {
        title: 'Posti fuori rotta',
        text: 'Evitiamo le liste copiate e le mete che tutti gia conoscono. Cerchiamo destinazioni, trattorie e angoli che trovi solo se esplori davvero.',
      },
      {
        title: 'Niente consigli ovvi',
        text: 'Non troverai la lista dei "10 posti da vedere" copiata da Wikipedia. Solo angoli che meritano davvero la tua attenzione.',
      },
    ],
    audienceTitle: 'A chi ci rivolgiamo',
    audienceDescription:
      'Questo progetto serve soprattutto a chi vuole scegliere meglio, non a chi cerca un altro elenco generico da scorrere in fretta.',
    audienceItems: [
      'Chi vuole scegliere meglio e non ha bisogno di altri itinerari tutti uguali.',
      'Chi cerca consigli pratici, budget realistici e un tono piu editoriale che urlato.',
      'Chi ama mangiare bene, dormire con gusto e partire con aspettative piu giuste.',
    ],
    timelineTitle: 'Il nostro percorso',
    timelineItems: [
      {
        year: '2016',
        title: 'Il primo viaggio davvero nostro',
        text: 'Da un weekend improvvisato nasce il bisogno di tenere traccia dei posti che valeva la pena ricordare.',
      },
      {
        year: '2018',
        title: 'Nasce @travelliniwithus',
        text: 'Apriamo il profilo per condividere luoghi, tavole e appunti con un taglio gia molto riconoscibile.',
      },
      {
        year: '2023',
        title: 'Arrivano le prime collaborazioni in linea',
        text: 'Iniziamo a lavorare solo con progetti coerenti con il tono e la fiducia che stavamo costruendo.',
      },
      {
        year: '2025',
        title: 'Il progetto prende forma sul sito',
        text: 'Portiamo il lavoro editoriale fuori dai social per ordinare meglio contenuti, risorse e collaborazioni.',
      },
    ],
  },
  collaborations: {
    heroEyebrow: 'Collaborazioni selettive',
    heroTitleMain: 'Collaborazioni con',
    heroTitleAccent: 'fit reale',
    heroDescription:
      'Lavoriamo con destinazioni, hospitality e brand che capiscono il valore di un racconto credibile. Prima dei formati conta il fit tra progetto, pubblico e tono.',
    heroProofLine:
      `Il progetto nasce da ${BRAND_STATS.yearsOfTravel} anni di viaggi, un archivio editoriale vivo e una community che riconosce il taglio. Ogni collaborazione entra qui dentro, non accanto.`,
    heroImageAlt:
      'Rodrigo e Betta durante una collaborazione editoriale con una struttura o un brand travel, in un contesto reale.',
    heroChecklist: [
      'Partnership con destinazioni, strutture e brand che hanno un fit narrativo reale',
      'Liberta editoriale chiara fin dall inizio, senza copioni promozionali',
      'Contenuti pensati per restare credibili nel tempo, non solo per un lancio rapido',
      'Media kit e metriche condivisi quando il progetto e davvero in linea',
    ],
    primaryCtaLabel: 'Richiedi collaborazione',
    primaryCtaLink: '/contatti',
    secondaryCtaLabel: 'Richiedi il media kit',
    secondaryCtaLink: '/media-kit',
    statsTitle: 'Segnali utili, non rumore',
    statsDescription:
      'Mostriamo solo i numeri che aiutano a capire il tipo di attenzione che il progetto puo generare. Non sono slogan: sono contesto.',
    servicesTitle: 'Come lavoriamo',
    servicesSubtitle: 'Modi di lavorare',
    services: [
      {
        title: 'Articolo o guida dedicata',
        description:
          'Contenuti editoriali costruiti per restare utili: contesto, punti forti, limiti e tono coerente col progetto.',
      },
      {
        title: 'Pacchetto cross-canale',
        description:
          'Guida, immagini e contenuti social quando il progetto richiede piu profondita e una presenza distribuita.',
      },
      {
        title: 'Press Trip con Liberta Editoriale',
        description:
          'Visitiamo, produciamo e raccontiamo senza perdere integrita editoriale. Se serve, diciamo anche cosa migliorare.',
      },
      {
        title: 'Newsletter o recap selettivo',
        description:
          'Inserimento dedicato quando ha davvero senso per il pubblico e per il momento del progetto.',
      },
    ],
    processTitle: 'Come funziona',
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
          'Valutiamo se il tuo brand e in linea con il nostro pubblico. Niente compromessi sui valori.',
      },
      {
        step: '3',
        title: 'La Creazione',
        description:
          'Lavoriamo con totale liberta editoriale, viaggiando, fotografando e scrivendo in prima persona.',
      },
      {
        step: '4',
        title: 'Il Lancio',
        description:
          'Pubblichiamo il pezzo con trasparenza sulla sponsorizzazione, garantendo un posizionamento nativo.',
      },
    ],
    partnerTitle: 'Con chi il fit e piu naturale',
    partnerDescription:
      'Preferiamo pochi progetti ben allineati. Se dobbiamo forzare il racconto per farlo stare in piedi, probabilmente non e la collaborazione giusta.',
    partnerTypes: [
      {
        title: 'Strutture Ricettive',
        text: "Da agriturismi a city hotel: raccontiamo l'esperienza di soggiorno con onesta, lati positivi e criticita incluse.",
      },
      {
        title: 'Enti e Destinazioni',
        text: 'Collaboriamo con enti e destinazioni che vogliono essere raccontati in profondita, non solo con foto belle e slogan da brochure.',
      },
      {
        title: 'Brand e Prodotti Travel',
        text: 'Nei contenuti consigliamo solo strumenti e prodotti che usiamo o abbiamo testato. Zero link di rimando pagati per convenienza.',
      },
    ],
    formatsTitle: 'Tre modi di lavorare',
    formatsDescription:
      'Questi formati servono a dare una base al confronto. Il progetto finale si costruisce sul contesto, non su un listino rigido.',
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
    faqTitle: 'Domande frequenti',
    faqDescription:
      'Le domande che aiutano a capire tempi, aspettative e confini del nostro modo di lavorare.',
    finalCtaTitle: 'Se il fit c e, il passo dopo e semplice.',
    finalCtaDescription:
      'Scrivici con contesto, obiettivo e periodo indicativo. Se c e fit, apriamo il confronto con il materiale giusto e con aspettative chiare.',
    finalPrimaryCtaLabel: 'Richiedi il media kit',
    finalPrimaryCtaLink: '/media-kit',
    finalSecondaryCtaLabel: 'Contattaci direttamente',
    finalSecondaryCtaLink: '/contatti',
  },
  contact: {
    heroEyebrow: 'Contatti',
    heroTitleMain: 'Parliamone',
    heroTitleAccent: 'dal canale giusto',
    heroDescription:
      'Per lettori, brand e progetti travel: qui trovi il canale giusto per scriverci senza perdere tempo. Più il messaggio è chiaro, più la risposta sarà utile.',
    directChannelsTitle: 'I nostri recapiti',
    emailCardTitle: 'Email business',
    emailCardDescription: 'Il canale migliore per collaborazioni, media kit e richieste che richiedono contesto.',
    emailCardLinkLabel: 'Apri la pagina collaborazioni',
    whatsappCardTitle: 'WhatsApp',
    whatsappCardDescription: 'Meglio per domande veloci o per capire se serve un confronto piu ampio.',
    helperTitle: 'Per aiutarci a risponderti meglio',
    helperItems: [
      'Per una collaborazione: indica brand o struttura, obiettivo, periodo e budget indicativo se gia disponibile.',
      'Per una domanda editoriale: cita guida, articolo, destinazione o risorsa cosi possiamo risponderti in modo concreto.',
      'Per il media kit: la pagina dedicata resta la via migliore se vuoi aprire un contatto piu qualificato.',
    ],
    formTitle: 'Scrivici con contesto chiaro',
    formIntro:
      'Piu il messaggio e chiaro, piu la risposta sara utile. Bastano poche righe ben orientate: chi sei, perche scrivi e cosa ti serve davvero.',
    successTitle: 'Messaggio ricevuto',
    successDescription:
      'Abbiamo registrato il tuo contatto. Ti risponderemo appena possibile, di solito entro 24-48 ore lavorative se il messaggio contiene gia il contesto essenziale.',
  },
  mediaKit: {
    heroEyebrow: 'Media kit',
    heroTitleMain: 'La base giusta per capire',
    heroTitleAccent: 'se ha senso lavorare insieme',
    heroDescription:
      'Questa pagina serve a qualificare il contatto nel modo giusto: capire chi siete, che progetto avete in mente e se ha davvero senso aprire una conversazione piu concreta.',
    heroProofLine:
      'Metriche, audience e materiali vengono condivisi quando il contatto e coerente con il progetto. Prima conta il fit tra idea, tono e tipo di collaborazione.',
    includesTitle: 'Cosa riceverai se il contatto e in linea',
    includesDescription:
      'Se il contatto e coerente con il progetto, condividiamo il materiale utile per valutare seriamente una possibile collaborazione: posizionamento, audience, formati, modalita di lavoro e riferimenti operativi.',
    formTitle: 'Apri un contatto qualificato',
    formDescription:
      'Lascia i dati essenziali del brand o del progetto. In questo modo possiamo capire subito se il contatto e allineato e risponderti con materiali davvero utili.',
    fitTitle: 'Collaboriamo meglio con',
    fitDescription:
      'Preferiamo contatti gia orientati, in cui brand, progetto e utilita per il pubblico possano stare bene insieme senza forzature.',
    processTitle: 'Come funziona',
    processSubtitle: 'Processo',
    directTitle: 'Hai una richiesta piu diretta?',
    directDescription:
      'Se preferisci partire da un contatto diretto invece che dal form, puoi scriverci via email o aprire una prima conversazione su WhatsApp. Il criterio resta lo stesso: allineamento, chiarezza e poi eventuale approfondimento.',
  },
  resources: {
    heroEyebrow: 'Selezione firmata',
    heroTitleMain: 'Risorse che',
    heroTitleAccent: 'usiamo davvero',
    heroDescription:
      'Una pagina utile da riaprire quando il viaggio diventa concreto: servizi, app e attrezzatura che usiamo davvero o che consigliamo solo quando hanno un perche preciso.',
    disclosureText:
      'Alcuni link presenti qui sono affiliati e ci permettono di sostenere il progetto senza costi extra per te.',
    collageEyebrow: 'Risorse selezionate',
    collageTitle: 'Pochi link, scelti meglio',
    collageDescription:
      'Qui non trovi una vetrina. Trovi una raccolta ordinata di strumenti, partner e servizi che hanno davvero un senso dentro il progetto e possono essere utili a chi viaggia.',
    benefitsEyebrow: 'Benefit essenziali',
    benefitsTitle: 'Due vantaggi che usiamo anche noi',
    benefitsDescription:
      'Non vogliamo sommergerti di codici. Qui trovi solo due benefit semplici, chiari e davvero coerenti con il viaggio.',
  },
  footer: {
    tagline: 'Posti particolari, scelte utili, racconto vero.',
    description:
      `Travelliniwithus e il punto in cui Rodrigo e Betta ordinano ${BRAND_STATS.yearsOfTravel} anni di viaggi, tavole, mappe e scelte utili in un archivio leggibile e credibile.`,
    discoverTitle: 'Scopri',
    resourcesTitle: 'Risorse',
    projectTitle: 'Progetto',
    newsletterButtonLabel: 'Iscriviti alla newsletter',
    brandCtaText: 'Sei un brand o una destinazione? Qui capisci subito se il nostro modo di lavorare puo essere giusto per voi.',
    brandCtaLabel: 'Apri collaborazioni',
    brandCtaLink: '/collaborazioni',
  },
  navigation: {
    destinationsLabel: 'Destinazioni',
    destinationsAllLabel: 'Tutte le destinazioni',
    guidesLabel: 'Guide',
    experiencesLabel: 'Esperienze',
    resourcesLabel: 'Risorse',
    shopLabel: 'Shop',
    collaborationsLabel: 'Collaborazioni',
    mediaKitLabel: 'Media kit',
    aboutLabel: 'Chi siamo',
    contactsLabel: 'Contatti',
    favoritesLabel: 'Preferiti',
    searchLabel: 'Cerca',
  },
  newsletter: {
    eyebrow: 'Newsletter Travellini',
    title: 'Un club editoriale leggero, pensato per restare utile.',
    leadTitle: 'Solo contenuti che meritano di tornare nella tua inbox.',
    leadDescription:
      'Una selezione leggera di posti, idee e strumenti che hanno davvero senso dentro il progetto. Nessun calendario aggressivo, nessun rumore gratuito.',
    benefits: [
      'Idee viaggio, weekend e posti da salvare prima che si perdano nel feed.',
      'Guide, nuove risorse e aggiornamenti condivisi quando hanno senso, non per riempire una mail.',
      'Aggiornamenti sul progetto con un tono piu curato e meno dispersivo dei social.',
    ],
    proofLine: 'Zero spam, una cadenza umana e disiscrizione sempre semplice.',
    emailLabel: 'La tua email',
    submitLabel: 'Iscriviti alla newsletter',
    privacyLabel: 'Privacy policy',
    successTitle: 'Iscrizione confermata.',
    successDescription:
      'Da ora riceverai solo aggiornamenti utili, novita del progetto e contenuti che vale la pena aprire.',
    successNote: 'Puoi disiscriverti quando vuoi direttamente da ogni email.',
  },
  demo: {
    showEditorialDemo: false,
    showDestinationDemo: false,
    showShopDemo: false,
    showDemoBadges: false,
  },
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge<T>(defaults: T, overrides: unknown): T {
  if (Array.isArray(defaults)) {
    return (Array.isArray(overrides) ? overrides : defaults) as T;
  }

  if (!isPlainObject(defaults)) {
    return (overrides ?? defaults) as T;
  }

  const source = isPlainObject(overrides) ? overrides : {};
  const result = { ...defaults } as Record<string, unknown>;

  for (const key of Object.keys(defaults as Record<string, unknown>)) {
    result[key] = deepMerge(
      (defaults as Record<string, unknown>)[key],
      source[key]
    );
  }

  for (const [key, value] of Object.entries(source)) {
    if (!(key in result)) {
      result[key] = value;
    }
  }

  return result as T;
}

function hasStructuredHomeContent(value: unknown): value is Partial<HomeContent> {
  return isPlainObject(value) && 'hero' in value;
}

export function normalizeHomeContent(value: unknown): HomeContent {
  const defaults = siteContentDefaults.home;

  if (!isPlainObject(value)) {
    return defaults;
  }

  if (hasStructuredHomeContent(value)) {
    return deepMerge(defaults, value);
  }

  const legacy = value as Record<string, unknown>;

  return deepMerge(defaults, {
    hero: {
      eyebrow: legacy.heroEyebrow,
      titleMain: legacy.heroTitleMain,
      titleAccent: legacy.heroTitleAccent,
      description: legacy.heroDescription,
      proofLine: legacy.heroProofLine,
      quickPillars: legacy.quickPillars,
      ctaPrimary: {
        label: legacy.primaryCtaLabel,
        link: legacy.primaryCtaLink,
      },
      ctaSecondary: {
        label: legacy.secondaryCtaLabel,
        link: legacy.secondaryCtaLink,
      },
      artDirection: {
        imageAlt: legacy.heroImageAlt,
      },
    },
    proofRail: {
      eyebrow: legacy.statsEyebrow,
      items: legacy.statsItems,
    },
    editorial: {
      eyebrow: legacy.articlesSubtitle,
      title: legacy.articlesTitle,
      description: legacy.articlesDescription,
    },
    archive: {
      eyebrow: legacy.archiveSubtitle,
      title: legacy.archiveTitle,
      description: legacy.archiveDescription,
    },
    project: {
      eyebrow: legacy.aboutEyebrow,
      titleMain: legacy.aboutTitleMain,
      titleAccent: legacy.aboutTitleAccent,
      description: legacy.aboutDescription,
      methodLabel: legacy.aboutTrustLabel,
      methodPoints: legacy.aboutTrustPoints,
      creatorTitle: legacy.socialTitle,
      creatorDescription: legacy.socialDescription,
      creatorBenefits: legacy.socialBenefits,
      primaryCta: {
        label: legacy.aboutButtonLabel,
        link: legacy.aboutButtonLink,
      },
      secondaryCta: {
        label: legacy.instagramCta,
        link: CONTACTS.instagramUrl,
      },
    },
    utility: {
      resourcesLabel: legacy.shopEyebrow ?? legacy.resourcesEyebrow,
      resourcesTitle: legacy.shopTitle ?? legacy.resourcesTitle,
      resourcesDescription: legacy.shopDescription ?? legacy.resourcesDescription,
      resourcesNote: legacy.shopNote ?? legacy.resourcesNote,
      resourcesCta: {
        label: legacy.shopLinkLabel ?? legacy.resourcesLinkLabel,
        link: '/risorse',
      },
    },
  });
}

export function resolveSiteContent<K extends SiteContentKey>(
  key: K,
  remoteContent: unknown
): SiteContentMap[K] {
  if (key === 'home') {
    return normalizeHomeContent(remoteContent) as SiteContentMap[K];
  }

  return deepMerge(siteContentDefaults[key], remoteContent) as SiteContentMap[K];
}

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
      'Struttura editoriale della homepage: hero, prova rapida, selezione articoli, ingressi archivio, progetto e utility finale.',
    previewPath: '/',
    fields: [
      { key: 'hero.eyebrow', label: 'Hero · Eyebrow', type: 'text' },
      { key: 'hero.titleMain', label: 'Hero · Titolo principale', type: 'text' },
      { key: 'hero.titleAccent', label: 'Hero · Titolo accent', type: 'text' },
      { key: 'hero.description', label: 'Hero · Descrizione', type: 'textarea', rows: 4 },
      { key: 'hero.proofLine', label: 'Hero · Riga di prova', type: 'textarea', rows: 3 },
      { key: 'hero.ctaPrimary.label', label: 'Hero · CTA primaria label', type: 'text' },
      { key: 'hero.ctaPrimary.link', label: 'Hero · CTA primaria link', type: 'url' },
      { key: 'hero.ctaSecondary.label', label: 'Hero · CTA secondaria label', type: 'text' },
      { key: 'hero.ctaSecondary.link', label: 'Hero · CTA secondaria link', type: 'url' },
      {
        key: 'hero.quickPillars',
        label: 'Hero · Pillole rapide',
        type: 'string-list',
        itemLabel: 'Pillola',
      },
      { key: 'hero.artDirection.shotIntent', label: 'Hero · Shot intent', type: 'text' },
      { key: 'hero.artDirection.imageAlt', label: 'Hero · Alt immagine', type: 'text' },
      {
        key: 'hero.artDirection.imageCaption',
        label: 'Hero · Caption immagine',
        type: 'textarea',
        rows: 3,
      },
      { key: 'hero.artDirection.overlayTone', label: 'Hero · Overlay tone', type: 'text' },
      { key: 'proofRail.eyebrow', label: 'Proof rail · Eyebrow', type: 'text' },
      {
        key: 'proofRail.items',
        label: 'Proof rail · Segnali',
        type: 'object-list',
        itemLabel: 'Segnale',
        fields: [
          { key: 'value', label: 'Valore', type: 'text' },
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'context', label: 'Contesto', type: 'textarea', rows: 3 },
        ],
      },
      {
        key: 'editorial.eyebrow',
        label: 'Editorial · Eyebrow',
        type: 'text',
      },
      { key: 'editorial.title', label: 'Editorial · Titolo', type: 'text' },
      {
        key: 'editorial.description',
        label: 'Editorial · Descrizione',
        type: 'textarea',
        rows: 3,
      },
      { key: 'editorial.helperLabel', label: 'Editorial · Helper label', type: 'text' },
      {
        key: 'editorial.reasonToOpen',
        label: 'Editorial · Ragione per aprire',
        type: 'textarea',
        rows: 3,
      },
      { key: 'editorial.ctaLabel', label: 'Editorial · CTA label', type: 'text' },
      { key: 'archive.eyebrow', label: 'Archive · Eyebrow', type: 'text' },
      { key: 'archive.title', label: 'Archive · Titolo', type: 'text' },
      { key: 'archive.description', label: 'Archive · Descrizione', type: 'textarea', rows: 3 },
      { key: 'archive.helperLabel', label: 'Archive · Helper label', type: 'text' },
      { key: 'archive.destinations.eyebrow', label: 'Destinazioni · Eyebrow', type: 'text' },
      { key: 'archive.destinations.title', label: 'Destinazioni · Titolo', type: 'text' },
      {
        key: 'archive.destinations.description',
        label: 'Destinazioni · Descrizione',
        type: 'textarea',
        rows: 3,
      },
      {
        key: 'archive.destinations.helperLabel',
        label: 'Destinazioni · Helper label',
        type: 'text',
      },
      { key: 'archive.destinations.ctaLabel', label: 'Destinazioni · CTA label', type: 'text' },
      { key: 'archive.destinations.ctaLink', label: 'Destinazioni · CTA link', type: 'url' },
      { key: 'archive.experiences.eyebrow', label: 'Esperienze · Eyebrow', type: 'text' },
      { key: 'archive.experiences.title', label: 'Esperienze · Titolo', type: 'text' },
      {
        key: 'archive.experiences.description',
        label: 'Esperienze · Descrizione',
        type: 'textarea',
        rows: 3,
      },
      {
        key: 'archive.experiences.helperLabel',
        label: 'Esperienze · Helper label',
        type: 'text',
      },
      { key: 'archive.experiences.ctaLabel', label: 'Esperienze · CTA label', type: 'text' },
      { key: 'archive.experiences.ctaLink', label: 'Esperienze · CTA link', type: 'url' },
      { key: 'project.eyebrow', label: 'Project · Eyebrow', type: 'text' },
      { key: 'project.titleMain', label: 'Project · Titolo principale', type: 'text' },
      { key: 'project.titleAccent', label: 'Project · Titolo accent', type: 'text' },
      { key: 'project.description', label: 'Project · Descrizione', type: 'textarea', rows: 4 },
      { key: 'project.methodLabel', label: 'Project · Label metodo', type: 'text' },
      { key: 'project.methodTitle', label: 'Project · Titolo metodo', type: 'text' },
      {
        key: 'project.methodDescription',
        label: 'Project · Descrizione metodo',
        type: 'textarea',
        rows: 4,
      },
      {
        key: 'project.methodPoints',
        label: 'Project · Punti metodo',
        type: 'string-list',
        itemLabel: 'Punto metodo',
      },
      { key: 'project.creatorLabel', label: 'Project · Label creator', type: 'text' },
      { key: 'project.creatorTitle', label: 'Project · Titolo creator', type: 'text' },
      {
        key: 'project.creatorDescription',
        label: 'Project · Descrizione creator',
        type: 'textarea',
        rows: 4,
      },
      {
        key: 'project.creatorBenefits',
        label: 'Project · Benefici creator',
        type: 'object-list',
        itemLabel: 'Beneficio',
        fields: [
          { key: 'title', label: 'Titolo', type: 'text' },
          { key: 'text', label: 'Descrizione', type: 'textarea', rows: 3 },
        ],
      },
      {
        key: 'project.primaryCta.label',
        label: 'Project · CTA primaria label',
        type: 'text',
      },
      { key: 'project.primaryCta.link', label: 'Project · CTA primaria link', type: 'url' },
      {
        key: 'project.secondaryCta.label',
        label: 'Project · CTA secondaria label',
        type: 'text',
      },
      {
        key: 'project.secondaryCta.link',
        label: 'Project · CTA secondaria link',
        type: 'url',
      },
      {
        key: 'project.artDirection.shotIntent',
        label: 'Project · Shot intent',
        type: 'text',
      },
      { key: 'project.artDirection.imageAlt', label: 'Project · Alt immagine', type: 'text' },
      {
        key: 'project.artDirection.imageCaption',
        label: 'Project · Caption immagine',
        type: 'textarea',
        rows: 3,
      },
      {
        key: 'project.artDirection.overlayTone',
        label: 'Project · Overlay tone',
        type: 'text',
      },
      { key: 'utility.eyebrow', label: 'Utility · Eyebrow', type: 'text' },
      { key: 'utility.title', label: 'Utility · Titolo', type: 'text' },
      { key: 'utility.description', label: 'Utility · Descrizione', type: 'textarea', rows: 3 },
      { key: 'utility.resourcesLabel', label: 'Utility · Label risorse', type: 'text' },
      { key: 'utility.resourcesTitle', label: 'Utility · Titolo risorse', type: 'text' },
      {
        key: 'utility.resourcesDescription',
        label: 'Utility · Descrizione risorse',
        type: 'textarea',
        rows: 4,
      },
      { key: 'utility.resourcesNote', label: 'Utility · Nota risorse', type: 'textarea', rows: 3 },
      { key: 'utility.resourcesCta.label', label: 'Utility · CTA risorse label', type: 'text' },
      { key: 'utility.resourcesCta.link', label: 'Utility · CTA risorse link', type: 'url' },
      { key: 'utility.newsletterLabel', label: 'Utility · Label newsletter', type: 'text' },
      { key: 'utility.newsletterTitle', label: 'Utility · Titolo newsletter', type: 'text' },
      {
        key: 'utility.newsletterDescription',
        label: 'Utility · Descrizione newsletter',
        type: 'textarea',
        rows: 4,
      },
      {
        key: 'utility.newsletterProofLine',
        label: 'Utility · Proof line newsletter',
        type: 'textarea',
        rows: 3,
      },
      { key: 'utility.newsletterSource', label: 'Utility · Source newsletter', type: 'text' },
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
      { key: 'heroProofLine', label: 'Prova rapida hero', type: 'textarea', rows: 3 },
      { key: 'heroImageAlt', label: 'Alt immagine hero', type: 'text' },
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
      { key: 'timelineTitle', label: 'Titolo timeline', type: 'text' },
      {
        key: 'timelineItems',
        label: 'Timeline',
        type: 'object-list',
        itemLabel: 'Milestone',
        fields: [
          { key: 'year', label: 'Anno', type: 'text' },
          { key: 'title', label: 'Titolo', type: 'text' },
          { key: 'text', label: 'Descrizione', type: 'textarea', rows: 3 },
        ],
      },
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
      { key: 'heroProofLine', label: 'Prova rapida hero', type: 'textarea', rows: 3 },
      { key: 'heroImageAlt', label: 'Alt immagine hero', type: 'text' },
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
      { key: 'faqTitle', label: 'Titolo FAQ', type: 'text' },
      { key: 'faqDescription', label: 'Descrizione FAQ', type: 'textarea', rows: 3 },
      { key: 'finalCtaTitle', label: 'Titolo CTA finale', type: 'text' },
      { key: 'finalCtaDescription', label: 'Descrizione CTA finale', type: 'textarea', rows: 3 },
      { key: 'finalPrimaryCtaLabel', label: 'Label CTA finale primaria', type: 'text' },
      { key: 'finalPrimaryCtaLink', label: 'Link CTA finale primaria', type: 'url' },
      { key: 'finalSecondaryCtaLabel', label: 'Label CTA finale secondaria', type: 'text' },
      { key: 'finalSecondaryCtaLink', label: 'Link CTA finale secondaria', type: 'url' },
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
      { key: 'directChannelsTitle', label: 'Titolo recapiti', type: 'text' },
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
      { key: 'formIntro', label: 'Introduzione form', type: 'textarea', rows: 3 },
      { key: 'successTitle', label: 'Titolo successo form', type: 'text' },
      { key: 'successDescription', label: 'Descrizione successo form', type: 'textarea', rows: 3 },
    ],
  },
  {
    id: 'mediaKit',
    title: 'Media Kit',
    description: 'Hero, messaggi chiave e blocchi introduttivi della pagina media kit.',
    previewPath: '/media-kit',
    fields: [
      { key: 'heroEyebrow', label: 'Eyebrow hero', type: 'text' },
      { key: 'heroTitleMain', label: 'Titolo hero principale', type: 'text' },
      { key: 'heroTitleAccent', label: 'Titolo hero accent', type: 'text' },
      { key: 'heroDescription', label: 'Descrizione hero', type: 'textarea', rows: 4 },
      { key: 'heroProofLine', label: 'Proof line hero', type: 'textarea', rows: 3 },
      { key: 'includesTitle', label: 'Titolo sezione materiale', type: 'text' },
      { key: 'includesDescription', label: 'Descrizione sezione materiale', type: 'textarea', rows: 4 },
      { key: 'formTitle', label: 'Titolo form', type: 'text' },
      { key: 'formDescription', label: 'Descrizione form', type: 'textarea', rows: 3 },
      { key: 'fitTitle', label: 'Titolo partner ideali', type: 'text' },
      { key: 'fitDescription', label: 'Descrizione partner ideali', type: 'textarea', rows: 3 },
      { key: 'processTitle', label: 'Titolo processo', type: 'text' },
      { key: 'processSubtitle', label: 'Sottotitolo processo', type: 'text' },
      { key: 'directTitle', label: 'Titolo contatto diretto', type: 'text' },
      { key: 'directDescription', label: 'Descrizione contatto diretto', type: 'textarea', rows: 4 },
    ],
  },
  {
    id: 'resources',
    title: 'Risorse',
    description: 'Hero, disclosure e blocchi editoriali principali della pagina risorse.',
    previewPath: '/risorse',
    fields: [
      { key: 'heroEyebrow', label: 'Eyebrow hero', type: 'text' },
      { key: 'heroTitleMain', label: 'Titolo hero principale', type: 'text' },
      { key: 'heroTitleAccent', label: 'Titolo hero accent', type: 'text' },
      { key: 'heroDescription', label: 'Descrizione hero', type: 'textarea', rows: 4 },
      { key: 'disclosureText', label: 'Disclosure affiliazioni', type: 'textarea', rows: 4 },
      { key: 'collageEyebrow', label: 'Eyebrow collage', type: 'text' },
      { key: 'collageTitle', label: 'Titolo collage', type: 'text' },
      { key: 'collageDescription', label: 'Descrizione collage', type: 'textarea', rows: 4 },
      { key: 'benefitsEyebrow', label: 'Eyebrow benefit', type: 'text' },
      { key: 'benefitsTitle', label: 'Titolo benefit', type: 'text' },
      { key: 'benefitsDescription', label: 'Descrizione benefit', type: 'textarea', rows: 4 },
    ],
  },
  {
    id: 'footer',
    title: 'Footer',
    description: 'Descrizione, titoli colonne e CTA newsletter del footer.',
    previewPath: '/',
    fields: [
      { key: 'tagline', label: 'Tagline footer', type: 'text' },
      { key: 'description', label: 'Descrizione footer', type: 'textarea', rows: 4 },
      { key: 'discoverTitle', label: 'Titolo colonna scopri', type: 'text' },
      { key: 'resourcesTitle', label: 'Titolo colonna risorse', type: 'text' },
      { key: 'projectTitle', label: 'Titolo colonna progetto', type: 'text' },
      { key: 'newsletterButtonLabel', label: 'Label bottone newsletter', type: 'text' },
      { key: 'brandCtaText', label: 'Testo card brand', type: 'textarea', rows: 3 },
      { key: 'brandCtaLabel', label: 'Label CTA brand', type: 'text' },
      { key: 'brandCtaLink', label: 'Link CTA brand', type: 'url' },
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
    id: 'newsletter',
    title: 'Newsletter',
    description: 'Titoli, benefici, CTA e messaggi di successo del blocco newsletter.',
    previewPath: '/',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow newsletter', type: 'text' },
      { key: 'title', label: 'Titolo newsletter', type: 'text' },
      { key: 'leadTitle', label: 'Titolo box lead', type: 'text' },
      { key: 'leadDescription', label: 'Descrizione box lead', type: 'textarea', rows: 4 },
      { key: 'benefits', label: 'Benefici newsletter', type: 'string-list', itemLabel: 'Beneficio' },
      { key: 'proofLine', label: 'Proof line newsletter', type: 'text' },
      { key: 'emailLabel', label: 'Label campo email', type: 'text' },
      { key: 'submitLabel', label: 'Label bottone iscrizione', type: 'text' },
      { key: 'privacyLabel', label: 'Label privacy link', type: 'text' },
      { key: 'successTitle', label: 'Titolo successo', type: 'text' },
      { key: 'successDescription', label: 'Descrizione successo', type: 'textarea', rows: 3 },
      { key: 'successNote', label: 'Nota successo', type: 'text' },
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
          'Mantiene un solo contenuto demo nella pagina destinazioni quando non hai ancora contenuti reali.',
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
