import { Timestamp } from 'firebase/firestore';

export const articleSeed = {
  title: 'Il locale del malocchio a Madrid: esperienza rituale',
  slug: 'madrid-malocchio',
  excerpt:
    'Un posto a Madrid dove si "cura" il malocchio tra rituali, atmosfera e cena. Esperienza unica o trappola turistica? La nostra prova sul campo.',
  content: `
A Madrid esiste un locale che mescola cena e performance di "cura del malocchio". Tra luci basse, simboli e un'atmosfera da set cinematografico.

Ci siamo andati per capire se è autentico o solo spettacolo per turisti.

## L'esperienza

Cibo spagnolo di base, ma il vero protagonista è lo show/rituale. Attori, musiche, interazione con il pubblico.

## Prezzi e prenotazione

Da verificare sul posto. Prenotazione consigliata.

## Verità editoriale

Divertente per una serata diversa, ma non profondo. Buono per gruppi o coppie che cercano qualcosa di insolito a Madrid.

Dettagli, prezzi reali e verdetto completo in arrivo.
`.trim(),
  category: 'esperienze',
  destination: 'Madrid, Spagna',
  partnership: { kind: 'none' },
  tags: ['madrid', 'esperienza', 'rituale', 'spagna'],
  author: { name: 'Rodrigo & Betta', bio: 'Viaggiatori e creatori di @travelliniwithus' },
  coverImage: '/images/reels/reel-placeholder.webp',
  published: false,
  featured: false,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};
