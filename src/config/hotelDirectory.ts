import type { HotelEntry } from '../types';

export const HOTEL_DIRECTORY: HotelEntry[] = [
  {
    id: 'forestis-dolomites',
    slug: 'forestis-dolomites',
    name: 'Forestis Dolomites',
    destination: 'Dolomiti',
    destinationSlug: 'dolomiti',
    destinationHref: '/destinazioni/italia',
    country: 'Italia',
    region: 'Alto Adige',
    category: 'Wellness in quota',
    image:
      'https://images.unsplash.com/photo-1578898886225-c7b38bfe1d45?q=80&w=1600&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/it/forestis-dolomites.it.html',
    priceHint: 'EUR 420',
    rating: 9.4,
    badge: 'Nostra scelta',
    summary:
      'Un rifugio contemporaneo in quota, pensato per chi vuole silenzio, spa e una vista che basta da sola a cambiare il ritmo.',
    fit: 'Perfetto per un viaggio lento di coppia, per chi vuole piu atmosfera che attivita continue.',
    idealFor: ['coppie', 'wellness', 'design', 'paesaggio'],
    pros: [
      'Vista fortissima gia dall arrivo',
      'Spa e camere coerenti col prezzo',
      'Esperienza high-end ma non fredda',
    ],
    cons: ['Prezzo alto', 'Meno adatto se vuoi uscire spesso la sera'],
    editorialNote:
      'Lo consigliamo quando il viaggio ruota attorno al luogo e al tempo lento, non quando serve una base pratica per fare tutto.',
    relatedGuideHref: '/itinerari/dolomiti-rifugi-design',
    mapLabel: 'Bressanone / Plose',
    published: true,
  },
  {
    id: 'adler-lodge-ritten',
    slug: 'adler-lodge-ritten',
    name: 'Adler Lodge Ritten',
    destination: 'Dolomiti',
    destinationSlug: 'dolomiti',
    destinationHref: '/destinazioni/italia',
    country: 'Italia',
    region: 'Alto Adige',
    category: 'Lodge contemporaneo',
    image:
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1600&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/it/adler-lodge-ritten.it.html',
    priceHint: 'EUR 310',
    rating: 9.2,
    summary:
      'Una base montana calda e pulita, con un equilibrio convincente tra comfort, panorama e accesso ai sentieri.',
    fit: 'Funziona bene se vuoi stare in montagna con taglio premium ma meno radicale di un resort super iconico.',
    idealFor: ['coppie', 'natura', 'hiking soft'],
    pros: [
      'Buona relazione tra comfort e atmosfera',
      'Base solida per 2-3 notti',
      'Ottimo per staccare',
    ],
    cons: ['Meno memorabile dei top iconici', 'Serve scegliere bene il periodo'],
    editorialNote:
      'Lo vediamo come scelta intelligente quando vuoi design e montagna, ma senza spingerti sul prezzo piu alto del cluster.',
    relatedGuideHref: '/guide',
    mapLabel: 'Renon',
    published: true,
  },
  {
    id: 'icaro-hotel',
    slug: 'icaro-hotel',
    name: 'Icaro Hotel',
    destination: 'Dolomiti',
    destinationSlug: 'dolomiti',
    destinationHref: '/destinazioni/italia',
    country: 'Italia',
    region: 'Alto Adige',
    category: 'Design di montagna',
    image:
      'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?q=80&w=1600&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/it/icaro.it.html',
    priceHint: 'EUR 240',
    rating: 9.0,
    summary:
      'Una struttura di montagna dal taglio piu essenziale, con una forte vocazione paesaggio e un posizionamento piu accessibile.',
    fit: 'Buona scelta se vuoi il lato piu grafico delle Dolomiti senza puntare al lusso piu estremo.',
    idealFor: ['design', 'mountain stay', 'weekend'],
    pros: ['Look curato', 'Prezzo piu leggibile', 'Buona coerenza visuale'],
    cons: ['Meno servizi rispetto ai resort piu alti di gamma', 'Esperienza piu asciutta'],
    editorialNote:
      'Lo teniamo nella shortlist quando il criterio principale e stare bene in un bel posto, non accumulare servizi.',
    relatedGuideHref: '/itinerari/dolomiti-rifugi-design',
    mapLabel: 'Alpe di Siusi',
    published: true,
  },
  {
    id: 'borgo-egnazia',
    slug: 'borgo-egnazia',
    name: 'Borgo Egnazia',
    destination: 'Puglia',
    destinationSlug: 'puglia',
    destinationHref: '/destinazioni/italia',
    country: 'Italia',
    region: 'Puglia',
    category: 'Resort iconico',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/it/borgo-egnazia.it.html',
    priceHint: 'EUR 650',
    rating: 9.5,
    badge: 'Nostra scelta',
    summary:
      'Il classico caso in cui il soggiorno diventa quasi la destinazione: grande impatto, forte identita, hospitality molto costruita.',
    fit: 'Da scegliere se vuoi un soggiorno importante, con budget alto e aspettativa di esperienza completa.',
    idealFor: ['luxury', 'honeymoon', 'hospitality', 'Puglia premium'],
    pros: ['Identita fortissima', 'Servizio di livello', 'Perfetto per momenti speciali'],
    cons: ['Prezzo molto alto', 'Meno adatto se vuoi una Puglia spontanea e mobile'],
    editorialNote:
      'Lo consigliamo quando il viaggio ha un taglio celebrativo. Non e la scelta giusta per chi vuole muoversi in modo piu libero.',
    relatedGuideHref: '/destinazioni/italia',
    mapLabel: 'Savelletri',
    published: true,
  },
  {
    id: 'masseria-trapana',
    slug: 'masseria-trapana',
    name: 'Masseria Trapana',
    destination: 'Puglia',
    destinationSlug: 'puglia',
    destinationHref: '/destinazioni/italia',
    country: 'Italia',
    region: 'Puglia',
    category: 'Masseria intima',
    image:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1600&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/it/masseria-trapana.it.html',
    priceHint: 'EUR 380',
    rating: 9.6,
    summary:
      'Una delle opzioni piu coerenti per chi cerca una Puglia lenta, bianca, quieta e con meno rumore da resort.',
    fit: 'Molto buona per coppie che vogliono design morbido, privacy e un soggiorno piu raccolto.',
    idealFor: ['coppie', 'slow travel', 'masseria', 'quiet luxury'],
    pros: ['Atmosfera forte', 'Scala umana', 'Molto piu intima dei grandi resort'],
    cons: ['Serve auto', 'Meno adatta a chi vuole vita serale'],
    editorialNote:
      'Qui il valore e la calma. Se il viaggio e centrato su mare e movimento continuo, meglio orientarsi altrove.',
    relatedGuideHref: '/guide?cat=dove-dormire',
    mapLabel: 'Puglia centrale',
    published: true,
  },
  {
    id: 'don-ferrante',
    slug: 'don-ferrante',
    name: 'Don Ferrante',
    destination: 'Puglia',
    destinationSlug: 'puglia',
    destinationHref: '/destinazioni/italia',
    country: 'Italia',
    region: 'Puglia',
    category: 'Dimora sul mare',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/it/don-ferrante.it.html',
    priceHint: 'EUR 290',
    rating: 9.3,
    summary:
      'Una scelta molto forte per chi vuole stare dentro il borgo e avere il mare come presenza continua, senza uscire dal contesto.',
    fit: 'Ottimo per city break di coppia e soggiorni brevi in cui la posizione conta quasi piu della metratura.',
    idealFor: ['romantic', 'town stay', 'sea view'],
    pros: ['Posizione fortissima', 'Molto scenografico', 'Perfetto per 2 notti'],
    cons: ['Meno privacy di una masseria', 'Puo essere piu esposto al flusso turistico'],
    editorialNote:
      'Lo scegliamo per il mix tra vista, pietra e accesso immediato al luogo, non per una vacanza di isolamento.',
    relatedGuideHref: '/guide?cat=dove-dormire',
    mapLabel: 'Monopoli',
    published: true,
  },
  {
    id: 'parilio',
    slug: 'parilio',
    name: 'Parilio, a Member of Design Hotels',
    destination: 'Grecia delle isole',
    destinationSlug: 'grecia-delle-isole',
    destinationHref: '/destinazioni/grecia',
    country: 'Grecia',
    region: 'Paros',
    category: 'Minimalismo bianco',
    image:
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=1600&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/gr/parilio-a-member-of-design-hotels.it.html',
    priceHint: 'EUR 550',
    rating: 9.5,
    badge: 'Nostra scelta',
    summary:
      'Una scelta molto centrata sul lato design delle Cicladi: pulita, calda, non urlata e con una forte coerenza di atmosfera.',
    fit: 'Da scegliere se vuoi Grecia premium ma senza il look piu stereotipato da cartolina rumorosa.',
    idealFor: ['design', 'Cyclades', 'honeymoon', 'quiet luxury'],
    pros: ['Design molto coerente', 'Atmosfera calma', 'Forte identita'],
    cons: ['Prezzo alto', 'Serve allineamento col tono del viaggio'],
    editorialNote:
      'Paros qui funziona se vuoi una Grecia piu raffinata e meno ovvia. Il valore e nel tono complessivo, non solo nella camera.',
    relatedGuideHref: '/destinazioni/grecia',
    mapLabel: 'Paros',
    published: true,
  },
  {
    id: 'canaves-oia-suites',
    slug: 'canaves-oia-suites',
    name: 'Canaves Oia Suites',
    destination: 'Grecia delle isole',
    destinationSlug: 'grecia-delle-isole',
    destinationHref: '/destinazioni/grecia',
    country: 'Grecia',
    region: 'Santorini',
    category: 'Vista caldera',
    image:
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1600&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/gr/canaves-oia.it.html',
    priceHint: 'EUR 780',
    rating: 9.4,
    summary:
      'Una scelta iconica, da tenere per viaggi speciali in cui la vista e una parte sostanziale dell esperienza.',
    fit: 'Ha senso per honeymoon, anniversari o soggiorni brevi ad alto budget.',
    idealFor: ['honeymoon', 'Santorini', 'iconic stay'],
    pros: ['Vista fortissima', 'Servizio coerente', 'Altissima desiderabilita'],
    cons: ['Prezzo molto alto', 'Santorini richiede aspettative realistiche sul contesto'],
    editorialNote:
      'Lo consigliamo solo se vuoi davvero il lato iconico di Santorini e lo accetti con lucidita, non per un viaggio leggero di isola in isola.',
    relatedGuideHref: '/destinazioni/grecia',
    mapLabel: 'Oia',
    published: true,
  },
  {
    id: 'sao-lourenco-do-barrocal',
    slug: 'sao-lourenco-do-barrocal',
    name: 'Sao Lourenco do Barrocal',
    destination: 'Portogallo',
    destinationSlug: 'portogallo',
    destinationHref: '/destinazioni/portogallo',
    country: 'Portogallo',
    region: 'Alentejo',
    category: 'Tenuta storica',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/pt/sao-lourenco-do-barrocal.it.html',
    priceHint: 'EUR 380',
    rating: 9.6,
    badge: 'Nostra scelta',
    summary:
      'Una delle strutture piu convincenti per capire l Alentejo con un taglio contemporaneo ma non artificiale.',
    fit: 'Ottima se il viaggio in Portogallo punta su ritmo lento, vino, luce e paesaggio rurale.',
    idealFor: ['slow travel', 'Portugal', 'design', 'wine trips'],
    pros: [
      'Identita molto forte',
      'Coerenza totale tra luogo e ospitalita',
      'Ottimo punto di fuga',
    ],
    cons: ['Richiede tempo', 'Meno adatta a viaggio urbano veloce'],
    editorialNote:
      'Qui il valore non e la checklist di servizi ma il modo in cui il luogo ti fa rallentare senza annoiarti.',
    relatedGuideHref: '/destinazioni/portogallo',
    mapLabel: 'Monsaraz',
    published: true,
  },
];

export function getPublishedHotels() {
  return HOTEL_DIRECTORY.filter((hotel) => hotel.published !== false);
}

export function getHotelBySlug(slug: string) {
  return getPublishedHotels().find((hotel) => hotel.slug === slug) ?? null;
}

export function getHotelsByDestination() {
  return getPublishedHotels().reduce<Record<string, HotelEntry[]>>((groups, hotel) => {
    if (!groups[hotel.destination]) {
      groups[hotel.destination] = [];
    }
    groups[hotel.destination].push(hotel);
    return groups;
  }, {});
}
