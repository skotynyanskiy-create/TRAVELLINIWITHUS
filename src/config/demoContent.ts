export const DEMO_ARTICLE_SLUG = 'dolomiti-rifugi-design';

export const DEMO_ARTICLE_PREVIEW = {
  id: DEMO_ARTICLE_SLUG,
  slug: DEMO_ARTICLE_SLUG,
  title: 'Dolomiti: Tra Rifugi di Design e Vette Leggendarie',
  category: 'Guide',
  image:
    'https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=2000&auto=format&fit=crop',
  excerpt:
    'Un itinerario tra rifugi di design, panorami iconici e spunti pratici per immaginare il tono editoriale del progetto.',
  readTime: '8 min',
  createdAt: '2026-03-17T08:00:00.000Z',
};

export const DEMO_ARTICLE_PATH = `/articolo/${DEMO_ARTICLE_SLUG}`;

export const DEMO_DESTINATION_CARD = {
  id: `destination-${DEMO_ARTICLE_SLUG}`,
  title: 'Dolomiti da esplorare',
  image: DEMO_ARTICLE_PREVIEW.image,
  link: DEMO_ARTICLE_PATH,
  region: 'Europa',
  category: 'Guide',
};

export const DEMO_ARTICLE_MARKER = {
  id: DEMO_ARTICLE_SLUG,
  name: 'Dolomiti',
  coordinates: [11.8598, 46.4102] as [number, number],
  link: DEMO_ARTICLE_PATH,
  image:
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=400&auto=format&fit=crop',
  category: 'Guide',
  title: 'Dolomiti: Tra Rifugi di Design e Vette Leggendarie',
};

export const DEMO_PRODUCT_SLUG = 'guida-premium-dolomiti';

export const DEMO_PRODUCT = {
  id: DEMO_PRODUCT_SLUG,
  slug: DEMO_PRODUCT_SLUG,
  name: 'Guida Premium Dolomiti',
  price: 24.9,
  isDigital: true,
  imageUrl:
    'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1400&auto=format&fit=crop',
  category: 'Guida premium',
  description:
    'Una guida premium pensata per raccogliere tappe, indirizzi, consigli pratici e idee già selezionate in un formato ordinato e facile da usare.',
  features: [
    'Itinerario già organizzato con tappe e priorità chiare',
    'Consigli pratici, indirizzi utili e note da consultare velocemente',
    'Formato premium pensato per aiutarti prima e durante il viaggio',
  ],
};

export const DEMO_PRODUCT_PATH = `/shop/${DEMO_PRODUCT_SLUG}`;
