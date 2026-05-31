import { serverTimestamp } from 'firebase/firestore';

export const articleSeed = {
  id: 'escape-room-italia',
  title: 'Le Escape Room che Vale la Pena Fare in Italia (e Non Solo)',
  slug: 'escape-room-italia',
  excerpt: 'La nostra selezione di escape room testate sul campo: le migliori per atmosfera, difficoltà e originalità, in Italia e in Europa.',
  description: 'Abbiamo provato decine di escape room. Queste sono quelle che ci hanno davvero colpito: per il design, la difficoltà calibrata e l\'atmosfera che ti fa dimenticare di essere in un locale commerciale.',
  content: `# Le Escape Room che Vale la Pena Fare in Italia (e Non Solo)

## Cosa cerchiamo in un'escape room

Non tutte le escape room si equivalgono. Dopo averne fatte decine tra Italia, Spagna e Germania, abbiamo capito cosa separa quelle memorabili dalle ordinarie: la cura del set design, la coerenza narrativa e gli enigmi che non diventano mai frustranti senza motivo.

## La nostra selezione

### 🔐 [Nome struttura] — [Città]

**Difficoltà:** ★★★★☆
**Tema:** [es. horror storico / thriller psicologico]
**Cosa ci ha colpito:**

Inserire recensione dettagliata qui.

### 🔐 [Nome struttura] — [Città]

**Difficoltà:** ★★★☆☆
**Tema:**
**Cosa ci ha colpito:**

### 🔐 [Nome struttura] — [Città]

**Difficoltà:** ★★★★★
**Tema:**
**Cosa ci ha colpito:**

## Consigli pratici

- **Prenota in anticipo** — le slot del weekend si esauriscono in pochi giorni
- **Vai in gruppo di 4** — il numero ideale per quasi tutte le stanze
- **Non vergognarti a chiedere un aiuto** — meglio che bloccarsi per 20 minuti
- **Leggi i trigger warning** — alcune stanze contengono elementi di claustrofobia o horror

## Come valutiamo

Usiamo 5 criteri: atmosfera, difficoltà, originalità degli enigmi, rapporto qualità/prezzo, game master.
`,
  category: 'Esperienze',
  experienceTypes: ['Escape Room', 'Esperienze insolite'],
  location: 'Italia',
  country: 'Italia',
  tags: ['escape room', 'esperienze', 'divertimento', 'weekend'],
  author: {
    name: 'Rodrigo & Betta',
    bio: 'Viaggiatori e creatori di @travelliniwithus',
  },
  coverImage: '/hero-adventure.jpg',
  image: '/hero-adventure.jpg',
  published: false,
  featured: false,
  readTime: '6 min',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};
