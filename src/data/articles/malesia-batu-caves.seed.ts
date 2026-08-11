import { Timestamp } from 'firebase/firestore';
import type { ArticleSeed } from './types';

export const articleSeed: ArticleSeed = {
  title: 'Batu Caves a Kuala Lumpur: vale la pena?',
  slug: 'malesia-batu-caves',
  excerpt:
    'Le famose grotte con la scalinata arcobaleno e la statua dorata: esperienza gratuita, scimmie e quanto serve davvero sapere prima di andarci.',
  content: `
Le Batu Caves sono una delle attrazioni più iconiche di Kuala Lumpur: una serie di grotte calcaree con templi indù, una scalinata di 272 gradini color arcobaleno e una statua dorata di Murugan alta 42 metri.

Ci siamo andati per verificare se merita il tempo di un viaggiatore che vuole posti particolari e non solo la checklist turistica.

## Come arrivarci

Dall'aeroporto o dal centro di KL si prende la MRT (linea Sungai Buloh-Kajang) fino alla stazione Batu Caves. Costa pochissimo (intorno ai 2-3 RM) e ci si arriva in 30-40 minuti dal centro.

L'ingresso alle grotte principali è gratuito. Ci sono anche caverne laterali con templi più tranquilli.

## Cosa vedere

- La scalinata arcobaleno (foto obbligatoria, ma vai presto o tardi per evitare la folla).
- La statua dorata.
- La caverna principale con il tempio (luce naturale drammatica).
- Attenzione alle scimmie: rubano cibo e oggetti, tieni tutto chiuso.

## Il verdetto pratico

Gratuito, veloce da raggiungere, fotogenico. Ideale per 1-2 ore. Non è un "posto segreto" ma ha un'atmosfera forte e vale per chi ama i contrasti culturali forti.

Prezzi: ingresso grotte 0 RM. Offerte e souvenir dentro.

Meglio di mattina presto o tardo pomeriggio per luce e meno gente.

[SEZIONE DETTAGLI PRATICI E VOTO: in lavorazione con dati reali]
`.trim(),
  category: 'destinazioni',
  destination: 'Batu Caves, Kuala Lumpur, Malesia',
  partnership: { kind: 'organic' },
  tags: ['asia', 'templi', 'gratis', 'kualalumpur'],
  author: { name: 'Rodrigo & Betta', bio: 'Viaggiatori e creatori di @travelliniwithus' },
  coverImage: '/images/reels/reel-4-cover.webp',
  published: false,
  featured: false,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};
