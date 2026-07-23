import { Timestamp } from 'firebase/firestore';

export const articleSeed = {
  title: 'I Caraibi in Italia: la versione veneta',
  slug: 'caraibi-italia-jesolo',
  excerpt:
    'Litorale di Jesolo e dintorni: spiagge bianche, acqua turchese e vibe caraibica senza volare. Come viverlo da coppia in modo autentico.',
  content: `
In Veneto, tra Jesolo e le zone limitrofe, ci sono tratti di litorale che ricordano i Caraibi per il colore dell'acqua e la sabbia chiara.

Non è esotico, ma per una fuga breve o un weekend è un'ottima alternativa low-cost e senza jet lag.

## Dove e come

Litorale da Jesolo verso est. Spiagge libere e stabilimenti. Acqua bassa e pulita in certi punti.

## Cosa fare

- Bagno e relax.
- Escursioni in laguna.
- Cibo di mare locale.

## Onestà

Meno "wow" dei Caraibi veri, ma accessibile, sicuro, con buon cibo. Ideale per chi vuole mare italiano senza folla di Rimini o Puglia in agosto.

Dettagli pratici e consigli su quando andare in arrivo.
`.trim(),
  category: 'destinazioni',
  destination: 'Jesolo e litorale Veneto',
  partnership: { kind: 'none' },
  tags: ['italia', 'mare', 'veneto', 'spiaggia'],
  author: { name: 'Rodrigo & Betta', bio: 'Viaggiatori e creatori di @travelliniwithus' },
  coverImage: '/images/reels/reel-placeholder.webp',
  published: false,
  featured: false,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};
