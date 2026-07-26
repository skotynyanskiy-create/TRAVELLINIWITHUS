/**
 * Reel manifest — single source of truth per i reel Instagram/TikTok di
 * Rodrigo & Betta integrati nel sito.
 *
 * Consumato da:
 *  - `HeroSection.tsx` → FEATURED_REEL fallback dinamico (sceglie il reel
 *    con più views se manifest popolato, altrimenti fallback editoriale).
 *  - `InstagramGrid.tsx` → render delle cover come grid masonry.
 *  - `Esplora.tsx` (futuro) → anchor visivo contestuale quando l'utente
 *    filtra `?zone=X` e c'è un reel `zone === X` disponibile.
 *
 * TODO[R+B]: compilare ogni entry con i metadati reali del post pubblicato.
 * Finché `caption`, `instagramUrl` o `cover` restano vuoti, il manifest è
 * marcato come `isPlaceholder: true` e il consumer applica fallback editoriale.
 *
 * I 5 file MP4 sono in `/public/video/` (originali in `C:\...\video\`).
 * Per servirli dal browser vanno copiati/linkati in `/public/video/`.
 */

import type { ContentType, Zone } from './contentTaxonomy';
import { resolveVideoUrl } from '../utils/mediaUrl';

export interface ReelEntry {
  /** ID stabile per analytics e routing (es. "salento-agosto-2025"). */
  id: string;
  /** Path locale relativo a `/public/`. */
  localPath: string;
  /** Cover statica per browser preview / lazy load (webp consigliato). */
  cover: string;
  /** Alt text IT della cover: descrive la scena visibile, non l'hook. */
  alt: string;
  /** Localita' descrittiva (es. "Salento · Spiaggia di Pescoluse"). */
  location: string;
  /** Zona canonical (per filtraggio in /esplora). */
  zone: Zone;
  /** Tipo canonical primario del reel (per filtraggio in /esplora). */
  type: ContentType;
  /** Caption completa del post Instagram/TikTok. */
  caption: string;
  /** Prima frase di hook (primi 60-80 caratteri della caption). */
  hook: string;
  /** Hashtag senza '#'. */
  hashtags: string[];
  /** URL pubblico del post Instagram (https://instagram.com/p/...). */
  instagramUrl?: string;
  /** URL pubblico del post TikTok (https://tiktok.com/@.../video/...). */
  tiktokUrl?: string;
  /** Id del posto corrispondente in content-seed (per il deep link
   *  reel → /posto/:slug dal bio hub). Assente = nessuna scheda ancora. */
  postoId?: string;
  /** Views totali (Instagram + TikTok aggregato), se note. */
  views?: number;
  /** ISO date di pubblicazione. */
  publishedAt: string;
  /** True finché i metadati sono placeholder TODO[R+B]. */
  isPlaceholder: boolean;
}

/**
 * 5 reel LIVE — corrispondono ai 5 file MP4 in `public/video/`.
 *
 * Cover = frame reali estratti dai video con ffmpeg (2026-06-18), salvati in
 * `public/images/reels/reel-N-cover.webp`. Le vecchie cover stock placeholder
 * sono in `backups/ultracode-2026-06-18/old-reel-covers/`.
 *
 * Metadata (location/zone/type/caption/hook) derivati dal contenuto REALE dei
 * video. Mancano ancora `instagramUrl`/`tiktokUrl`/`views` per ciascun post: il
 * consumer usa il fallback al profilo IG finché R+B non li fornisce.
 */
const RAW_REELS: ReelEntry[] = [
  {
    id: 'reel-egitto-mar-rosso',
    localPath: '/video/reel-1.mp4',
    cover: '/images/reels/reel-1-cover.webp',
    alt: "Acqua trasparente del Mar Rosso vista da sott'acqua, con reef e fondale sabbioso a Marsa Alam",
    location: 'Egitto · Mar Rosso',
    zone: 'Africa',
    type: 'Relax, terme e spa',
    caption:
      'Un resort economico sul Mar Rosso: acqua trasparente, reef a due passi dal pontile e ristoranti. Quanto costa davvero e se vale.',
    hook: 'Mar Rosso senza spendere una fortuna.',
    hashtags: ['egitto', 'marrosso', 'snorkeling', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
    postoId: 'egitto-marsa-alam-dream-lagoon',
  },
  {
    id: 'reel-toscana-sushi-kibo',
    localPath: '/video/reel-2.mp4',
    cover: '/images/reels/reel-2-cover.webp',
    alt: "Sala di un ristorante di sushi in Toscana con passerella sull'acqua e pareti in legno",
    location: 'Toscana · Sushi Kibo',
    zone: 'Italia',
    type: 'Food & Ristoranti',
    caption:
      "Uno dei sushi più belli della Toscana: sala spettacolare sull'acqua, all-you-can-eat e un prezzo che non ti aspetti.",
    hook: 'Il sushi più bello della Toscana?',
    hashtags: ['sushi', 'toscana', 'ristoranti', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
  },
  {
    id: 'reel-toscana-tavernal',
    localPath: '/video/reel-3.mp4',
    cover: '/images/reels/reel-3-cover.webp',
    alt: 'Vetrata a tema fantasy con drago rosso e torre in una taverna a tema in Toscana',
    location: 'Toscana · Tavernal',
    zone: 'Italia',
    type: 'Insolito',
    caption:
      'Una taverna a tema tra draghi e nani dove ti senti dentro una leggenda. Porzioni abbondanti e una fiorentina come si deve.',
    hook: 'Cenare nella tana dei draghi.',
    hashtags: ['toscana', 'ristorantiatema', 'insolito', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
  },
  {
    id: 'reel-malesia-batu-caves',
    localPath: '/video/reel-4.mp4',
    cover: '/images/reels/reel-4-cover.webp',
    alt: 'La statua dorata e la scalinata arcobaleno delle Batu Caves a Kuala Lumpur',
    location: 'Malesia · Batu Caves',
    zone: 'Asia',
    type: 'Posti particolari',
    caption:
      'Vale la pena visitare le famosissime Batu Caves di Kuala Lumpur? È gratis, il posto è indescrivibile — e occhio alle scimmie.',
    hook: 'Batu Caves: vale la pena?',
    hashtags: ['malesia', 'batucaves', 'kualalumpur', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
    postoId: 'malesia-batu-caves',
  },
  {
    id: 'reel-toscana-volterra-volturi',
    localPath: '/video/reel-5.mp4',
    cover: '/images/reels/reel-5-cover.webp',
    alt: 'Portone medievale a Volterra con persone in abiti gotici sui gradini in pietra',
    location: 'Toscana · Volterra',
    zone: 'Italia',
    type: 'Insolito',
    caption:
      "Un aperitivo dai Volturi a Volterra: drink che sembrano sangue, atmosfera gotica e un po' di scena. Per chi ama l'insolito.",
    hook: 'Aperitivo coi vampiri a Volterra.',
    hashtags: ['volterra', 'toscana', 'insolito', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
    postoId: 'toscana-aperitivo-volterra',
  },
  {
    id: 'reel-novara-emotional-grand-motel',
    localPath: '/video/novara-emotional-grand-motel.mp4',
    cover: '/images/reels/novara-emotional-grand-motel-cover.webp',
    alt: "Camera a tema con letto rotondo dentro una gabbia dorata e pareti rosse dell'Emotional Grand Motel.",
    location: 'Novara · Emotional Grand Motel',
    zone: 'Italia',
    type: 'Hotel con carattere',
    caption:
      'Motel a tema vicino Novara: abbiamo provato la stanza “Celebrity”, con letto dentro una gabbia dorata e vasca particolare. Colazione in camera o a buffet. Il prezzo varia in base alla stanza e alla permanenza. Per chi vuole una notte fuori dagli schemi.',
    hook: 'Dormiresti in una gabbia?',
    hashtags: ['suitetematica', 'postiparticolari', 'visitnovara', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/C_-a3IUoNL4/',
    postoId: 'novara-emotional-grand-motel',
    publishedAt: '2024-09-16',
    isPlaceholder: false,
  },
  {
    id: 'reel-rust-rulantica-waterpark',
    localPath: '/video/rust-rulantica-waterpark.mp4',
    cover: '/images/reels/rust-rulantica-waterpark-cover.webp',
    alt: 'Interni a tema nordico del parco acquatico coperto Rulantica con scivoli e piscine.',
    location: 'Rust · Rulantica',
    zone: 'Europa',
    type: 'Posti particolari',
    caption:
      "Parco acquatico interamente al coperto a Rust, in Germania, accanto a Europa-Park: oltre 17 attrazioni per tutti, tra cui uno degli scivoli più veloci d'Europa, scivoli con gommone e piscina a onde. Ambientazione a tema nordico. Se vieni qui, vale la pena abbinare anche Europa-Park.",
    hook: 'Uno degli acquapark più divertenti al mondo?',
    hashtags: ['rulantica', 'europapark', 'acquapark', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DBRWYD9ogMn/',
    postoId: 'rust-rulantica-waterpark',
    publishedAt: '2024-10-18',
    isPlaceholder: false,
  },
  {
    id: 'reel-sirmione-hotel-lugana-parco',
    localPath: '/video/sirmione-hotel-lugana-parco.mp4',
    cover: '/images/reels/sirmione-hotel-lugana-parco-cover.webp',
    alt: "Parco privato sul Lago di Garda con piscina e pontile dell'Hotel Lugana Parco al Lago.",
    location: 'Sirmione · Hotel Lugana Parco al Lago & Wine Hotel',
    zone: 'Italia',
    type: 'Hotel con carattere',
    caption:
      "Hotel di design a due passi da Sirmione: camere curate nei dettagli, bottiglia di benvenuto della cantina Ca' dei Frati, parco privato sul lago con piscina e pontile, e ristorante del territorio. Su richiesta si organizza una visita privata in cantina. Per una fuga di coppia tra vino e relax.",
    hook: 'Un weekend romantico sul Lago di Garda?',
    hashtags: ['lagodigarda', 'sirmione', 'weekendromantico', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DbKdcluM13G/',
    postoId: 'sirmione-hotel-lugana-parco',
    publishedAt: '2026-07-24',
    isPlaceholder: false,
  },
  {
    id: 'reel-iseo-flyboard-pisogne',
    localPath: '/video/iseo-flyboard-pisogne.mp4',
    cover: '/images/reels/iseo-flyboard-pisogne-cover.webp',
    alt: "Persona che si libra sull'acqua con un flyboard sul Lago d'Iseo.",
    location: 'Pisogne · Flyboard Cam1 · X Beach',
    zone: 'Italia',
    type: 'Insolito',
    caption:
      "Esperienza di flyboard sul Lago d'Iseo, alla X Beach di Pisogne: la sessione dura 40 minuti, di cui circa 20 di volo effettivo, sufficienti per iniziare a fare evoluzioni. Costo 130€. Adrenalina pura, con qualche tuffo assicurato. Per chi cerca un'esperienza fuori dal comune.",
    hook: "Voleresti sull'acqua?",
    hashtags: ['lagodiiseo', 'flyboard', 'esperienze', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DbCvtnksPBy/',
    postoId: 'iseo-flyboard-pisogne',
    publishedAt: '2026-07-21',
    isPlaceholder: false,
  },
  {
    id: 'reel-como-haru-sushi',
    localPath: '/video/como-haru-sushi.mp4',
    cover: '/images/reels/como-haru-sushi-cover.webp',
    alt: 'Sala intima del ristorante Haru Sushi a Como con tavoli riservati.',
    location: 'Como · Haru Sushi',
    zone: 'Italia',
    type: 'Food & Ristoranti',
    caption:
      'Ristorante di sushi a Como, piccolo e intimo, con tavoli riservati per pranzo o cena in tranquillità. Menù all you can eat con pesce di buona qualità e tante proposte. Pranzo a partire da 16€, cena da 28€.',
    hook: 'Un sushi a forma di alveare?',
    hashtags: ['comofood', 'sushi', 'ristoranti', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/Da7SLwRMrjM/',
    postoId: 'como-haru-sushi',
    publishedAt: '2026-07-18',
    isPlaceholder: false,
  },
  {
    id: 'reel-lazise-movieland-caneva',
    localPath: '/video/lazise-movieland-caneva.mp4',
    cover: '/images/reels/lazise-movieland-caneva-cover.webp',
    alt: 'Attrazioni acquatiche e scivoli del Caneva Aquapark a Lazise.',
    location: 'Lazise · Movieland Park & Caneva Aquapark',
    zone: 'Italia',
    type: 'Posti particolari',
    caption:
      "Due parchi in una sola giornata a Lazise, sul Lago di Garda: Movieland per adrenalina, spettacoli e attrazioni a tema cinema, e Caneva Aquapark per scivoli, piscine e relax. Una combinazione pensata per le giornate afose d'estate.",
    hook: "I parchi perfetti per l'estate?",
    hashtags: ['lagodigarda', 'movieland', 'caneva', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DaxK1gHMv71/',
    postoId: 'lazise-movieland-caneva',
    publishedAt: '2026-07-14',
    isPlaceholder: false,
  },
  {
    id: 'reel-montepulciano-altro-cantuccio',
    localPath: '/video/montepulciano-altro-cantuccio.mp4',
    cover: '/images/reels/montepulciano-altro-cantuccio-cover.webp',
    alt: "Portata di un menù degustazione storico servita a L'Altro Cantuccio, Montepulciano.",
    location: "Montepulciano · L'Altro Cantuccio",
    zone: 'Italia',
    type: 'Food & Ristoranti',
    caption:
      "A Montepulciano, un menù degustazione di 8 portate che ripercorre la storia della città dall'antichità a oggi: ogni portata rappresenta un'epoca ed è preparata con ingredienti realmente usati in quel periodo. Esperienza di fine dining a 70€ a persona, con possibilità di abbinamento vini.",
    hook: 'Viaggiare nella storia mangiando?',
    hashtags: ['montepulciano', 'finedining', 'toscana', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DauuMM1Mkez/',
    postoId: 'montepulciano-altro-cantuccio',
    publishedAt: '2026-07-13',
    isPlaceholder: false,
  },
  {
    id: 'reel-ravenna-better-sushi',
    localPath: '/video/ravenna-better-sushi.mp4',
    cover: '/images/reels/ravenna-better-sushi-cover.webp',
    alt: "Ambiente scenografico con cascate e passerelle sull'acqua del ristorante Better Sushi a Ravenna.",
    location: 'Ravenna · Better Sushi',
    zone: 'Italia',
    type: 'Food & Ristoranti',
    caption:
      "Ristorante di sushi a Ravenna con ambienti scenografici tra cascate e passerelle sull'acqua. Menù all you can eat con piatti curati e ingredienti freschi. Pranzo da 14,90€, cena da 28,90€. Più di una cena: un'esperienza per chi ama il genere.",
    hook: 'Il sushi più bello della Romagna?',
    hashtags: ['ravenna', 'sushi', 'emiliaromagna', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DapaSgMMnyd/',
    postoId: 'ravenna-better-sushi',
    publishedAt: '2026-07-11',
    isPlaceholder: false,
  },
  {
    id: 'reel-sarteano-chiostro-cennini',
    localPath: '/video/sarteano-chiostro-cennini.mp4',
    cover: '/images/reels/sarteano-chiostro-cennini-cover.webp',
    alt: 'Tavoli apparecchiati nel chiostro quattrocentesco del ristorante Chiostro Cennini a Sarteano.',
    location: 'Sarteano · Chiostro Cennini',
    zone: 'Italia',
    type: 'Food & Ristoranti',
    caption:
      "Nel borgo di Sarteano, in provincia di Siena, un ristorante ricavato in un chiostro quattrocentesco. Si inizia con un aperitivo in altalena e prodotti di loro produzione, poi una cucina tipica rivisitata con menù stagionale. Ci si può fermare anche per il dopocena, immersi nell'atmosfera del chiostro.",
    hook: 'Ceneresti in un chiostro del XV secolo?',
    hashtags: ['sarteano', 'siena', 'toscana', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DafM3Totc-3/',
    postoId: 'sarteano-chiostro-cennini',
    publishedAt: '2026-07-07',
    isPlaceholder: false,
  },
  {
    id: 'reel-londra-warner-bros-studio-harry-potter',
    localPath: '/video/londra-warner-bros-studio-harry-potter.mp4',
    cover: '/images/reels/londra-warner-bros-studio-harry-potter-cover.webp',
    alt: 'Set originale del tour degli studi Warner Bros. di Harry Potter a Londra.',
    location: 'Londra · Warner Bros. Studio Tour London',
    zone: 'Europa',
    type: 'Posti particolari',
    caption:
      'Il tour degli studi Warner Bros. a Londra, dove è stato girato Harry Potter: set originali, costumi e oggetti di scena della saga. Una tappa per i fan, da rifare con calma. Prenotazione consigliata con anticipo.',
    hook: 'Credi nella magia?',
    hashtags: ['harrypotter', 'londra', 'warnerbros', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DaYSq2sMK6p/',
    postoId: 'londra-warner-bros-studio-harry-potter',
    publishedAt: '2026-07-04',
    isPlaceholder: false,
  },
  {
    id: 'reel-madrid-la-santoria',
    localPath: '/video/madrid-la-santoria.mp4',
    cover: '/images/reels/madrid-la-santoria-cover.webp',
    alt: 'Interni a tema santería del cocktail bar La Santoria a Madrid.',
    location: 'Madrid · La Santoria',
    zone: 'Europa',
    type: 'Insolito',
    caption:
      'Cocktail bar nascosto di Madrid ispirato al mondo della santería: drink a cui vengono attribuite proprietà portafortuna e lettura dei tarocchi. Un posto fuori dal comune, dove siamo tornati dopo la prima volta. Per chi cerca locali particolari.',
    hook: 'Un locale che ti toglie il malocchio?',
    hashtags: ['madrid', 'localimadrid', 'postiparticolari', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DaR3eMUMub1/',
    postoId: 'madrid-la-santoria',
    publishedAt: '2026-07-02',
    isPlaceholder: false,
  },
  {
    id: 'reel-asciano-casa-lavanda-podere-fossaccio',
    localPath: '/video/asciano-casa-lavanda-podere-fossaccio.mp4',
    cover: '/images/reels/asciano-casa-lavanda-podere-fossaccio-cover.webp',
    alt: 'Piscina a sfioro con vista sulle Crete Senesi di Casa Lavanda ad Asciano.',
    location: 'Asciano · Casa Lavanda — Podere Fossaccio',
    zone: 'Italia',
    type: 'Hotel con carattere',
    caption:
      'Appartamento in stile rustico toscano ad Asciano, nelle Crete Senesi: due camere matrimoniali, cucina attrezzata e piscina a sfioro con vista sulle colline. Il posto giusto per rallentare, per un weekend romantico o una fuga con gli amici.',
    hook: 'Dormiresti immerso nelle colline toscane?',
    hashtags: ['cretesenesi', 'toscana', 'podere', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DaPjh9ksq9_/',
    postoId: 'asciano-casa-lavanda-podere-fossaccio',
    publishedAt: '2026-07-01',
    isPlaceholder: false,
  },
  {
    id: 'reel-verona-casabarca',
    localPath: '/video/verona-casabarca.mp4',
    cover: '/images/reels/verona-casabarca-cover.webp',
    alt: 'Piatto ricoperto da una cascata di tartufo al ristorante CasaBarca di Verona.',
    location: 'Verona · CasaBarca',
    zone: 'Italia',
    type: 'Food & Ristoranti',
    caption:
      'A Verona, una location elegante e fuori dal comune: pizze farcite, piatti della tradizione veronese, un menù estivo con abbinamenti creativi e portate ricoperte da una vera cascata di tartufo. Da mettere in lista per un weekend in città.',
    hook: 'Una pioggia di tartufo?',
    hashtags: ['verona', 'tartufo', 'ristoranti', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DaMuAWCso-V/',
    postoId: 'verona-casabarca',
    publishedAt: '2026-06-30',
    isPlaceholder: false,
  },
  {
    id: 'reel-valeggio-parco-cavour',
    localPath: '/video/valeggio-parco-cavour.mp4',
    cover: '/images/reels/valeggio-parco-cavour-cover.webp',
    alt: 'Piscina tropicale con sabbia bianca Palm Beach del Parco Cavour a Valeggio sul Mincio.',
    location: 'Valeggio sul Mincio · Parco Cavour',
    zone: 'Italia',
    type: 'Posti particolari',
    caption:
      "Parco acquatico immerso nel verde a Valeggio sul Mincio: scivoli, giochi d'acqua e la Palm Beach, una piscina tropicale con sabbia bianca. C'è anche un'area wellness, le Terme Romane, tra cascate e idromassaggi. Per una giornata in famiglia.",
    hook: 'Un paradiso tropicale in Italia?',
    hashtags: ['valeggiosulmincio', 'acquapark', 'veneto', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DZ7r9JJMfgV/',
    postoId: 'valeggio-parco-cavour',
    publishedAt: '2026-06-23',
    isPlaceholder: false,
  },
  {
    id: 'reel-cancun-riu-messico',
    localPath: '/video/cancun-riu-messico.mp4',
    cover: '/images/reels/cancun-riu-messico-cover.webp',
    alt: 'Spiaggia caraibica dal mare turchese a Cancún, Messico.',
    location: 'Cancún · Riu Cancún',
    zone: 'Americhe',
    type: 'Relax, terme e spa',
    caption:
      "Due settimane a Cancún ad agosto, contro i luoghi comuni: caldo e sole quasi ogni giorno, mare caraibico e cenote. Il sargasso dipende molto dalle zone — al Riu Cancún ce n'era poco, anche per la pulizia costante. Sulla sicurezza: nelle zone turistiche, con buon senso, ci siamo sempre sentiti tranquilli.",
    hook: 'Agosto in Messico?',
    hashtags: ['cancun', 'messico', 'rivieramaya', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DZy-HunM8Rt/',
    postoId: 'cancun-riu-messico',
    publishedAt: '2026-06-20',
    isPlaceholder: false,
  },
  {
    id: 'reel-toscana-suite-spa-civico-4',
    localPath: '/video/toscana-suite-spa-civico-4.mp4',
    cover: '/images/reels/toscana-suite-spa-civico-4-cover.webp',
    alt: 'Suite privata con vasca idromassaggio e luci soffuse di Suite Spa Civico 4 in Toscana.',
    location: 'Toscana · Suite Spa Civico 4',
    zone: 'Italia',
    type: 'Hotel con carattere',
    caption:
      'Non un hotel tradizionale, ma una suite privata in Toscana pensata esclusivamente per due persone: sauna a infrarossi, vasca idromassaggio, doccia emozionale e cinema in camera con maxi schermo da 100”. Pacchetti romantici disponibili. Si parte da 190€ a notte (210€ nel weekend).',
    hook: 'Una suite privata con SPA solo per due?',
    hashtags: ['alloggiparticolari', 'toscana', 'weekendromantico', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DZwX5URsxZc/',
    postoId: 'toscana-suite-spa-civico-4',
    publishedAt: '2026-06-19',
    isPlaceholder: false,
  },
  {
    id: 'reel-lombardia-agriturismo-graffignana',
    localPath: '/video/lombardia-agriturismo-graffignana.mp4',
    cover: '/images/reels/lombardia-agriturismo-graffignana-cover.webp',
    alt: "Piscina e area verde dell'agriturismo Contea del Vignolo Fiorito a Graffignana.",
    location: 'Graffignana · Contea del Vignolo Fiorito',
    zone: 'Italia',
    type: 'Posti particolari',
    caption:
      'Agriturismo a Graffignana con tanti animali, molti salvati da situazioni difficili. Puoi passare la giornata in piscina (ingresso 40€, con lettino 50€, con pranzo a buffet o apericena) oppure fermarti a pranzo con prodotti genuini e stagionali.',
    hook: 'Un agriturismo con animali?',
    hashtags: [],
    instagramUrl: 'https://www.instagram.com/reel/DZscTqAshTD/',
    postoId: 'lombardia-agriturismo-graffignana',
    publishedAt: '2026-06-17',
    isPlaceholder: false,
  },
  {
    id: 'reel-verona-vigna-benini',
    localPath: '/video/verona-vigna-benini.mp4',
    cover: '/images/reels/verona-vigna-benini-cover.webp',
    alt: 'Tavoli tra i filari della vigna al tramonto, Alessandro Benini Wines a Lavagno.',
    location: 'Lavagno · Alessandro Benini Wines',
    zone: 'Italia',
    type: 'Food & Ristoranti',
    caption:
      'Aperitivo tra i filari a Lavagno, vicino Verona: vino prodotto dalla cantina, musica e tramonto. Con una bottiglia è incluso un tagliere di salumi, formaggi e taralli, a 28€.',
    hook: 'Un aperitivo in vigna?',
    hashtags: [],
    instagramUrl: 'https://www.instagram.com/reel/DZjvWDoslzS/',
    postoId: 'verona-vigna-benini',
    publishedAt: '2026-06-14',
    isPlaceholder: false,
  },
  {
    id: 'reel-chioggia-sand-beach',
    localPath: '/video/chioggia-sand-beach.mp4',
    cover: '/images/reels/chioggia-sand-beach-cover.webp',
    alt: 'Lido fronte mare con lettini del Sand Beach Club a Chioggia.',
    location: 'Chioggia · Sand Beach Club',
    zone: 'Italia',
    type: 'Relax, terme e spa',
    caption:
      'Giornata di mare a Chioggia: passeggiata nel centro storico, ostriche fresche al Do Ombre, e il Sand Beach Club — lido esclusivo fronte mare con pranzi, cene, eventi e gazebo vip.',
    hook: 'Una meta di mare sottovalutata?',
    hashtags: [],
    instagramUrl: 'https://www.instagram.com/reel/DZhFdM_sQY9/',
    postoId: 'chioggia-sand-beach',
    publishedAt: '2026-06-13',
    isPlaceholder: false,
  },
  {
    id: 'reel-jesolo-caribe-bay',
    localPath: '/video/jesolo-caribe-bay.mp4',
    cover: '/images/reels/jesolo-caribe-bay-cover.webp',
    alt: 'Sabbia bianca, palme e lagune del parco acquatico Caribe Bay a Jesolo.',
    location: 'Jesolo · Caribe Bay',
    zone: 'Italia',
    type: 'Insolito',
    caption:
      "Parco acquatico caraibico a Jesolo: 80.000 mq di sabbia bianca, palme e lagune, 25 attrazioni tra gli scivoli più adrenalinici d'Europa e il relax di Shark Bay, più 4 spettacoli giornalieri. Biglietto 39€, meno acquistando online.",
    hook: 'I Caraibi in Italia?',
    hashtags: [],
    instagramUrl: 'https://www.instagram.com/reel/DZaO32kMg8R/',
    postoId: 'jesolo-caribe-bay',
    publishedAt: '2026-06-10',
    isPlaceholder: false,
  },
  {
    id: 'reel-madrid-storyland-disney',
    localPath: '/video/madrid-storyland-disney.mp4',
    cover: '/images/reels/madrid-storyland-disney-cover.webp',
    alt: 'Sala a tema principesse del ristorante Storyland a Madrid.',
    location: 'Madrid · Storyland',
    zone: 'Europa',
    type: 'Insolito',
    caption:
      "Ristorante a tema principesse a Madrid: indossi un vestito ed entri nell'ambientazione ispirata ai cartoni, con piatti scenografici e specialità argentine. A metà cena inizia uno spettacolo con le principesse.",
    hook: 'Una cena nel mondo Disney?',
    hashtags: [],
    instagramUrl: 'https://www.instagram.com/reel/DZWo5OTM_Cw/',
    postoId: 'madrid-storyland-disney',
    publishedAt: '2026-06-09',
    isPlaceholder: false,
  },
  {
    id: 'reel-lombardia-al-mago-medievale',
    localPath: '/video/lombardia-al-mago-medievale.mp4',
    cover: '/images/reels/lombardia-al-mago-medievale-cover.webp',
    alt: 'Spettacolo di falconeria durante la cena al Ristorante Al Mago ad Albairate.',
    location: 'Albairate · Al Mago',
    zone: 'Italia',
    type: 'Insolito',
    caption:
      'Ristorante ad Albairate dove ceni assistendo a spettacoli di falconeria e arti medievali: esibizioni con falchi, gufi e rapaci, con momenti interattivi in cui provi a richiamarli in prima persona.',
    hook: 'Una locanda medievale con falconeria?',
    hashtags: [],
    instagramUrl: 'https://www.instagram.com/reel/DZPFeJBMF9v/',
    postoId: 'lombardia-al-mago-medievale',
    publishedAt: '2026-06-06',
    isPlaceholder: false,
  },
  {
    id: 'reel-capovaticano-tonicello-resort',
    localPath: '/video/capovaticano-tonicello-resort.mp4',
    cover: '/images/reels/capovaticano-tonicello-resort-cover.webp',
    alt: 'Vista sul mare cristallino della Costa degli Dei dal Tonicello Resort a Capo Vaticano.',
    location: 'Capo Vaticano · Tonicello Resort & Spa',
    zone: 'Italia',
    type: 'Hotel con carattere',
    caption:
      "Resort affacciato sulla Costa degli Dei, a Capo Vaticano: acque cristalline, calette e tramonti, con terrazza panoramica del ristorante sul mare. A un'ora di volo, i 'Caraibi d'Italia'.",
    hook: "I Caraibi d'Italia?",
    hashtags: ['costadeglidei', 'capovaticano', 'calabria', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DZRwpH6MDM-/',
    postoId: 'capovaticano-tonicello-resort',
    publishedAt: '2026-06-07',
    isPlaceholder: false,
  },
  {
    id: 'reel-pessina-agriturismo-campagnino',
    localPath: '/video/pessina-agriturismo-campagnino.mp4',
    cover: '/images/reels/pessina-agriturismo-campagnino-cover.webp',
    alt: "Campagna e tavoli all'aperto dell'Agriturismo Il Campagnino a Pessina Cremonese.",
    location: 'Pessina Cremonese · Agriturismo Il Campagnino',
    zone: 'Italia',
    type: 'Hotel con carattere',
    caption:
      'Agriturismo a Pessina Cremonese tra natura e animali: aperitivi freschi ed economici, pranzi con prodotti km0 ed esperienze didattiche — come preparare la pasta fresca e gustarla direttamente a pranzo.',
    hook: 'Un agriturismo dove fai la pasta fresca?',
    hashtags: ['agriturismo', 'lombardia', 'km0', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DY3sfZ3M8dm/',
    postoId: 'pessina-agriturismo-campagnino',
    publishedAt: '2026-05-28',
    isPlaceholder: false,
  },
  {
    id: 'reel-grone-narciso-home-chalet',
    localPath: '/video/grone-narciso-home-chalet.mp4',
    cover: '/images/reels/grone-narciso-home-chalet-cover.webp',
    alt: 'Jacuzzi riscaldata con vista sulla natura dello chalet Narciso Home a Grone.',
    location: 'Grone · Narciso Home',
    zone: 'Italia',
    type: 'Hotel con carattere',
    caption:
      'Chalet immerso nella natura a Grone (BG): jacuzzi riscaldata con vista, sauna interna e doccia emozionale. Incluso un aperitivo con prodotti del territorio e il necessario per cena e colazione. Per un weekend di coppia.',
    hook: 'Lo chalet più romantico della Lombardia?',
    hashtags: ['chalet', 'bergamo', 'weekendromantico', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DYub1jYsfA7/',
    postoId: 'grone-narciso-home-chalet',
    publishedAt: '2026-05-24',
    isPlaceholder: false,
  },
  {
    id: 'reel-garfagnana-luccarfting-kayak',
    localPath: '/video/garfagnana-luccarfting-kayak.mp4',
    cover: '/images/reels/garfagnana-luccarfting-kayak-cover.webp',
    alt: 'Kayak tra i torrenti verdi della Garfagnana con Luccarfting.',
    location: 'Toscana · Luccarfting',
    zone: 'Italia',
    type: 'Insolito',
    caption:
      'Kayak, tuffi e nuotate nei torrenti della Garfagnana: tre ore di adrenalina in compagnia, con istruttori esperti che ti seguono in sicurezza. Una delle attività proposte da Luccarfting.',
    hook: "L'attività estiva perfetta?",
    hashtags: ['garfagnana', 'kayak', 'toscana', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DYrYyrctBoC/',
    postoId: 'garfagnana-luccarfting-kayak',
    publishedAt: '2026-05-23',
    isPlaceholder: false,
  },
  {
    id: 'reel-shanghai-capyland-capibara',
    localPath: '/video/shanghai-capyland-capibara.mp4',
    cover: '/images/reels/shanghai-capyland-capibara-cover.webp',
    alt: 'Visitatori che coccolano un capibara al Capyland di Shanghai.',
    location: 'Shanghai · Capyland',
    zone: 'Asia',
    type: 'Insolito',
    caption:
      'A Shanghai, un locale dove coccolare i capibara: uno dei posti più teneri e insoliti da provare in città, per chi ama gli animali.',
    hook: 'Il locale più tenero al mondo?',
    hashtags: ['capibara', 'shanghai', 'cina', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DYmhHheMI-c/',
    postoId: 'shanghai-capyland-capibara',
    publishedAt: '2026-05-21',
    isPlaceholder: false,
  },
  {
    id: 'reel-verona-little-italy-sushi-pizza',
    localPath: '/video/verona-little-italy-sushi-pizza.mp4',
    cover: '/images/reels/verona-little-italy-sushi-pizza-cover.webp',
    alt: 'Sushi di pizza e spritz XL serviti da Little Italy a Verona.',
    location: 'Verona · Little Italy',
    zone: 'Italia',
    type: 'Food & Ristoranti',
    caption:
      "A Verona, un format unico da Little Italy: promo a 30€ con due spritz XL da mezzo litro e un 'sushi di pizza'. Per una serata diversa in città.",
    hook: 'Sushi di pizza e albero di spritz?',
    hashtags: ['verona', 'sushipizza', 'venetofood', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DYjFh4lsq4m/',
    postoId: 'verona-little-italy-sushi-pizza',
    publishedAt: '2026-05-20',
    isPlaceholder: false,
  },
  {
    id: 'reel-garfagnana-agriturismo-cornali',
    localPath: '/video/garfagnana-agriturismo-cornali.mp4',
    cover: '/images/reels/garfagnana-agriturismo-cornali-cover.webp',
    alt: "Piscina privata e verde dell'Agriturismo Cornali in Garfagnana.",
    location: 'Toscana · Agriturismo Cornali',
    zone: 'Italia',
    type: 'Hotel con carattere',
    caption:
      'In Garfagnana, agriturismo a conduzione familiare immerso nel verde: spa, piscina privata, colazioni fatte in casa e appartamenti spaziosi. Base ideale per borghi, eremi e grotte della zona.',
    hook: 'Una zona sottovalutata della Toscana?',
    hashtags: ['garfagnana', 'agriturismo', 'toscana', 'travelliniwithus'],
    instagramUrl: 'https://www.instagram.com/reel/DYePI7Us3sk/',
    postoId: 'garfagnana-agriturismo-cornali',
    publishedAt: '2026-05-18',
    isPlaceholder: false,
  },
];

/**
 * Reel reali pubblicati. I primi 5 (2026-06-18) hanno i frame estratti dai MP4;
 * gli altri (2026-07-24) sono cover ufficiali IG acquisite via yt-dlp dai reel
 * del profilo. Tutti visibili. Per nasconderne uno: rimuovere il suo id da qui.
 */
const VISIBLE_REEL_IDS = new Set<string>([
  'reel-lombardia-agriturismo-graffignana',
  'reel-verona-vigna-benini',
  'reel-chioggia-sand-beach',
  'reel-jesolo-caribe-bay',
  'reel-madrid-storyland-disney',
  'reel-lombardia-al-mago-medievale',
  'reel-capovaticano-tonicello-resort',
  'reel-pessina-agriturismo-campagnino',
  'reel-grone-narciso-home-chalet',
  'reel-garfagnana-luccarfting-kayak',
  'reel-shanghai-capyland-capibara',
  'reel-verona-little-italy-sushi-pizza',
  'reel-garfagnana-agriturismo-cornali',
  'reel-egitto-mar-rosso',
  'reel-toscana-sushi-kibo',
  'reel-toscana-tavernal',
  'reel-malesia-batu-caves',
  'reel-toscana-volterra-volturi',
  'reel-novara-emotional-grand-motel',
  'reel-rust-rulantica-waterpark',
  'reel-sirmione-hotel-lugana-parco',
  'reel-iseo-flyboard-pisogne',
  'reel-como-haru-sushi',
  'reel-lazise-movieland-caneva',
  'reel-montepulciano-altro-cantuccio',
  'reel-ravenna-better-sushi',
  'reel-sarteano-chiostro-cennini',
  'reel-londra-warner-bros-studio-harry-potter',
  'reel-madrid-la-santoria',
  'reel-asciano-casa-lavanda-podere-fossaccio',
  'reel-verona-casabarca',
  'reel-valeggio-parco-cavour',
  'reel-cancun-riu-messico',
  'reel-toscana-suite-spa-civico-4',
]);

export const REELS: ReelEntry[] = RAW_REELS.filter((reel) => VISIBLE_REEL_IDS.has(reel.id)).map(
  (reel) => ({ ...reel, localPath: resolveVideoUrl(reel.localPath) })
);

/**
 * Helper: ritorna i reel pubblicabili (non placeholder), ordinati per views
 * decrescenti. Usato da HeroSection per scegliere il FEATURED_REEL e da
 * InstagramGrid per popolare la griglia.
 */
export function getPublishedReels(): ReelEntry[] {
  return REELS.filter((reel) => !reel.isPlaceholder).sort(
    (a, b) => (b.views ?? 0) - (a.views ?? 0)
  );
}

/**
 * Helper: ritorna il reel più rilevante per una zona (se esiste).
 * Usato da /esplora come anchor visivo quando l'utente filtra `?zone=X`.
 */
export function getReelForZone(zone: Zone): ReelEntry | null {
  return getPublishedReels().find((reel) => reel.zone === zone) ?? null;
}

/**
 * Helper: ritorna il reel più rilevante per un tipo (se esiste).
 * Usato da /esplora come anchor visivo quando l'utente filtra `?type=X`.
 */
export function getReelForType(type: ContentType): ReelEntry | null {
  return getPublishedReels().find((reel) => reel.type === type) ?? null;
}
