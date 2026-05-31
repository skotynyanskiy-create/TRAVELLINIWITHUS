import { serverTimestamp } from 'firebase/firestore';

export const articleSeed = {
  id: 'europa-park-guida-completa',
  title: 'Europa-Park: La Guida Completa per Viverlo al Meglio',
  slug: 'europa-park-guida-completa',
  excerpt: 'Tutto quello che devi sapere per visitare Europa-Park senza sprecare tempo: attrazioni imperdibili, orari, hotel nel parco e consigli per famiglie e coppie.',
  description: 'Europa-Park è il parco divertimenti più grande della Germania e tra i più visitati d\'Europa. Questa guida ti dice cosa fare, cosa saltare e come organizzare la visita per non perdere nulla di importante.',
  content: `# Europa-Park: La Guida Completa per Viverlo al Meglio

## Perché Europa-Park merita il viaggio

Rust, Germania. A circa 20 minuti da Friburgo e vicino al confine francese, Europa-Park è uno di quei parchi che supera le aspettative. Non solo per le attrazioni, ma per come è costruita l'intera esperienza: ogni area del parco riproduce una nazione europea con scenografie curate, gastronomia locale e spettacoli tematici.

## Le attrazioni da non perdere

### Silver Star
La montagna russa più alta d'Europa (73 m). Fila media: 60-90 minuti. Consiglio: corri qui appena apre il parco.

### Blue Fire
Lancio da 0 a 100 km/h in 2,5 secondi. Meno fila di Silver Star, adrenalina identica.

### Wodan – Timburcoaster
La montagna russa in legno più lunga d'Europa. Ruvida per design, non per difetto.

### Eurosat – CanCan Coaster
Percorso al buio con proiezioni. Ideale se vuoi qualcosa di meno estremo ma coinvolgente.

## Come organizzare la giornata

**Mattina (apertura → 12:00)**
Punta subito alle attrazioni più affollate: Silver Star, Blue Fire, Wodan. Le file raddoppiano dopo le 10:30.

**Pomeriggio (12:00 → 17:00)**
Spettacoli, attrazioni secondarie, pranzo nelle aree tematiche. Evita Silver Star in questa fascia.

**Sera (17:00 → chiusura)**
Le file si svuotano. Ottimo momento per rifare le attrazioni preferite e godersi il parco illuminato.

## Hotel nel parco: vale la pena?

Sì, se vuoi accesso anticipato (30 minuti prima dell'apertura al pubblico). I migliori: Hotel Colosseo (tema romano), Hotel Kronasar (più recente, tema preistorico). Prenota con 2-3 mesi di anticipo nei weekend.

## Informazioni pratiche

- **Biglietto:** circa €57 adulti, €49 bambini (prezzi variabili)
- **Come arrivare:** da Friburgo, treno + navetta o auto (parcheggio €8)
- **Durata consigliata:** 2 giorni per vivere tutto con calma
- **App ufficiale:** mostra tempi di attesa in tempo reale — indispensabile
`,
  category: 'Guide',
  experienceTypes: ['Parchi divertimento'],
  location: 'Rust, Germania',
  country: 'Germania',
  city: 'Rust',
  region: 'Baden-Württemberg',
  tags: ['europa-park', 'parchi divertimento', 'germania', 'famiglia', 'guide'],
  author: {
    name: 'Rodrigo & Betta',
    bio: 'Viaggiatori e creatori di @travelliniwithus',
  },
  coverImage: '/hero-adventure.jpg',
  image: '/hero-adventure.jpg',
  published: false,
  featured: false,
  readTime: '8 min',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};
