import { Timestamp } from 'firebase/firestore';

export const articleSeed = {
  title: 'The Burton Juice: il ristorante a tema Tim Burton in Italia',
  slug: 'burton-juice-ristorante-tim-burton',
  excerpt: 'PLACEHOLDER — sarà scritto da seo-strategist (max 160 char)',
  content:
    '# The Burton Juice: il ristorante a tema Tim Burton in Italia\n\n[Corpo articolo: sarà scritto da editorial-writer]',
  category: 'esperienze',
  destination: 'Somma Vesuviana (Napoli), Campania',
  tags: [],
  author: { name: 'Rodrigo & Betta', bio: 'Viaggiatori e creatori di @travelliniwithus' },
  coverImage: '/hero-adventure.jpg', // PLACEHOLDER — sarà scelto da asset-curator
  published: false,
  featured: false,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};
