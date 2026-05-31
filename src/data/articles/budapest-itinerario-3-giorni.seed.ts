import { serverTimestamp } from 'firebase/firestore';

export const articleSeed = {
  id: 'budapest-itinerario-3-giorni',
  title: 'Budapest in 3 Giorni: Itinerario Completo con Tappe Reali',
  slug: 'budapest-itinerario-3-giorni',
  excerpt: 'Budapest in 3 giorni: un itinerario costruito sul campo con tappe precise, orari reali e consigli pratici per non perdere nulla di importante.',
  description: 'Tre giorni a Budapest costruiti come li abbiamo vissuti davvero: quali quartieri visitare per primo, dove mangiare senza brutte sorprese, come muoversi e cosa vale davvero il tempo che costa.',
  content: `# Budapest in 3 Giorni: Itinerario Completo con Tappe Reali

## Perché Budapest

Budapest è una delle capitali europee che ti sorprende di più. Non solo per i Bagni Széchenyi o il Parlamento, ma per come ogni quartiere ha un'identità precisa: il Palazzo di Buda sul lato ovest del Danubio, il caos vitale di Pest a est, il Distretto delle Rovine nel VII distretto con i suoi locali dentro palazzi abbandonati.

---

## Giorno 1 — Buda: il lato alto e lento

**Mattina**
- Bastione dei Pescatori (arriva entro le 9:00 per evitare le scolaresche)
- Chiesa di Mattia — ingresso a pagamento, vale i 20 min dentro
- Quartiere del Castello — passeggiata libera, niente fretta

**Pranzo**
Resti sul Castello o scendi a piedi verso il Danubio. Evita i ristoranti turistici intorno alla piazza principale: prezzi doppi, qualità media.

**Pomeriggio**
- Mercato Grande (Nagy Vásárcsarnok) — arriva alle 14:00 quando la folla si dirada
- Primo giro nel IV Distretto (Belváros)

**Sera**
Cena nel VII Distretto. Esplora i ruin bar di sera — Szimpla Kert è il più famoso ma anche il più affollato.

---

## Giorno 2 — Pest: monumenti e quartieri vivi

**Mattina**
- Parlamento (prenota online — le visite si esauriscono)
- Piazza degli Eroi e il Parco della Città (Városliget)

**Pranzo**
Quartiere Erzsébetváros (VII Distretto) — molti bistrot locali con prezzi onesti.

**Pomeriggio**
- Bagni Széchenyi (porta il costume — si può entrare anche solo per il bagno esterno)
- Via Andrássy — passeggiata verso il centro

**Sera**
Cena nel II o nel IX Distretto, fuori dal circuito turistico principale.

---

## Giorno 3 — Ritmo lento e quartieri laterali

**Mattina**
- Mercato di Fény utca (quartiere II, molto locale, ottima colazione)
- Isola Margherita se la stagione lo permette

**Pranzo**
Zona Kálvin tér o VIII Distretto — quartiere universitario, prezzi bassi, qualità alta.

**Pomeriggio libero**
- Museo delle Belle Arti o Museo di Storia Naturale
- Ultimo giro nel Distretto delle Rovine di giorno (completamente diverso dalla sera)

---

## Logistica

**Come arrivare:** voli diretti da molte città italiane (Ryanair, Wizz Air). Aeroporto a 30 min dal centro.
**Come muoversi:** metro + tram coprono quasi tutto. Giornaliero illimitato: circa €7.
**Dove dormire:** VII o V Distretto per stare al centro. Ostelli ottimi nella fascia 25-40€/notte.
**Valuta:** fiorino ungherese (HUF). I bancomat danno tassi migliori del cambio in aeroporto.
`,
  category: 'Guide',
  experienceTypes: ['Itinerari', 'Borghi e città d\'arte'],
  location: 'Budapest, Ungheria',
  country: 'Ungheria',
  city: 'Budapest',
  tags: ['budapest', 'itinerario', 'ungheria', 'europa', 'weekend', '3 giorni'],
  author: {
    name: 'Rodrigo & Betta',
    bio: 'Viaggiatori e creatori di @travelliniwithus',
  },
  coverImage: '/hero-adventure.jpg',
  image: '/hero-adventure.jpg',
  published: false,
  featured: false,
  readTime: '9 min',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};
