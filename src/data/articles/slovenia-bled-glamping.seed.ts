import { Timestamp } from 'firebase/firestore';

export const articleSeed = {
  title: 'Glamping a Bled: natura e silenzio in Slovenia',
  slug: 'slovenia-bled-glamping',
  excerpt:
    'Garden Village Bled: glamping immerso nel bosco vicino al lago. Quanto costa, come è davvero e se vale per una fuga di coppia.',
  content: `
Bled in Slovenia è famoso per il lago con l'isolotto e il castello, ma il vero lusso quieto è stare in mezzo ai boschi.

Abbiamo verificato il Garden Village: pod e tende di lusso con vasca all'aperto, vista sugli alberi, zero rumore.

## Posizione e arrivo

A 10-15 minuti dal centro di Bled in auto o taxi. Ideale per chi vuole natura senza rinunciare al comfort.

## Struttura e prezzi (dati reali da verificare sul posto)

Pod con vasca, colazione inclusa, accesso al lago privato. Prezzi indicativi intorno ai 200-300€ a notte in alta stagione (da confermare).

## Il voto e i dettagli

Atmosfera altissima, privacy buona, posizione perfetta per escursioni al lago e al castello. Cucina sul posto buona ma non stellata.

Perfetto per coppie che cercano slow e natura senza campeggio duro.

[DETTAGLI PRATICI COMPLETI E RECENSIONE IN LAVORAZIONE]
`.trim(),
  category: 'destinazioni',
  destination: 'Bled, Slovenia',
  partnership: { kind: 'none' },
  tags: ['slovenia', 'glamping', 'natura', 'lago'],
  author: { name: 'Rodrigo & Betta', bio: 'Viaggiatori e creatori di @travelliniwithus' },
  coverImage: '/images/reels/reel-placeholder.webp',
  published: false,
  featured: false,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};
