import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebaseDb';

export const SAMPLE_ARTICLE = {
  id: 'dolomiti-rifugi-design',
  title: 'Dolomiti: Tra Rifugi di Design e Vette Leggendarie',
  category: 'Guide',
  slug: 'dolomiti-rifugi-design',
  image:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1400&auto=format&fit=crop',
  excerpt:
    'Un unico contenuto dimostrativo per mostrare come potranno apparire guide, itinerari e racconti quando inserirai il materiale definitivo.',
  description: 'Guida demo ai rifugi di design e ai percorsi panoramici delle Dolomiti.',
  location: 'Trentino-Alto Adige, Italia',
  period: 'Giugno - Ottobre',
  budget: 'Medio/Alto',
  readTime: '8 min',
  author: 'Rodrigo & Betta',
  published: true,
  createdAt: new Date().toISOString(),
  highlights: [
    'Tramonto sulle Torri del Vajolet',
    'Cena panoramica al Rifugio Oberholz',
    'Alba al Lago di Carezza',
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrivo in Val di Fiemme',
      description: 'Check-in e prima esplorazione dei boschi circostanti.',
    },
    {
      day: 2,
      title: 'Latemar e architettura',
      description: 'Salita al Rifugio Oberholz e pranzo panoramico.',
    },
    {
      day: 3,
      title: 'Il Catinaccio',
      description: 'Trekking panoramico verso il Rifugio Re Alberto I.',
    },
  ],
  tips: [
    "Prenota i rifugi con qualche mese di anticipo per l'alta stagione.",
    'Porta sempre con te una giacca a vento, anche in estate.',
    'Scarica mappe offline prima di salire in quota.',
  ],
  packingList: [
    'Scarponi da trekking',
    'Zaino da 30L',
    'Borraccia termica',
    'Bastoncini telescopici',
  ],
  gallery: [
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
  ],
  content: `
# Dolomiti: L'Estetica della Montagna

Questo contenuto demo serve a mostrare struttura, ritmo editoriale e profondità del layout articolo.

## Rifugi di design e panorami forti

Le Dolomiti sono perfette per raccontare come un contenuto Travelliniwithus può unire atmosfera, indicazioni utili e identita visiva.

## Come usare questo demo

Quando il sito sarà definitivo, questo articolo potra essere disattivato dal pannello admin e sostituito dai tuoi contenuti reali.
  `,
};

export const SAMPLE_ARTICLES = [SAMPLE_ARTICLE];

export async function seedSampleArticle() {
  try {
    await setDoc(doc(db, 'articles', SAMPLE_ARTICLE.id), {
      ...SAMPLE_ARTICLE,
      createdAt: serverTimestamp(),
    });
    if (import.meta.env.DEV) {
      console.log('Articolo demo creato con successo.');
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Errore durante il seeding:', error);
    }
    throw error;
  }
}
