import { Timestamp } from 'firebase/firestore';
import type { ArticleSeed } from './types';

export const articleSeed: ArticleSeed = {
  title: 'Sushi Kibo: sushi in Romagna che sorprende',
  slug: 'romagna-sushi-kibo',
  excerpt:
    'Un locale di sushi in Romagna con attenzione ai dettagli, atmosfera e qualità. La nostra recensione onesta dopo averlo provato.',
  content: `
In una regione famosa per piadina e tagliatelle, un posto di sushi che si distingue per cura, ingredienti e presentazione.

Abbiamo verificato Sushi Kibo per capire se merita di essere salvato tra i posti particolari della zona.

## Il locale

Interni curati, servizio attento. Menu che mescola classico e creazioni.

## Cosa abbiamo provato

Dettagli e voti in arrivo (sushi, nigiri, roll, costo medio).

## Per chi

Per chi ama il sushi di qualità in Emilia-Romagna senza andare in grandi città.

[RECENSIONE COMPLETA CON PREZZI E VOTO IN LAVORAZIONE]
`.trim(),
  category: 'esperienze',
  destination: 'Romagna, Italia',
  partnership: { kind: 'organic' },
  tags: ['romagna', 'sushi', 'cibo', 'italia'],
  author: { name: 'Rodrigo & Betta', bio: 'Viaggiatori e creatori di @travelliniwithus' },
  coverImage: '/images/reels/reel-placeholder.webp',
  published: false,
  featured: false,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};
