import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Plane,
  Camera,
  ArrowRight,
  Smartphone,
  CheckCircle2,
  Shield,
  ShoppingBag,
  BadgePercent,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import Newsletter from '../components/Newsletter';
import Section from '../components/Section';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import { SITE_URL } from '../config/site';
import { fetchResources } from '../services/firebaseService';
import { trackEvent } from '../services/analytics';

const resourceCategories = [
  {
    id: 'booking',
    title: 'Prenotare meglio',
    icon: <Plane className="text-[var(--color-accent)]" size={30} />,
    description: 'Servizi che usiamo per voli, hotel, escursioni, assicurazione e logistica.',
    items: [
      {
        name: 'GetYourGuide',
        description: 'Per escursioni, ingressi e attività da prenotare prima o durante il viaggio.',
        link: 'https://getyourguide.com/-cs552',
        tags: ['Escursioni', 'Attività'],
        badge: 'Scelto spesso',
      },
      {
        name: 'Heymondo',
        description: 'La nostra opzione abituale per l\'assicurazione viaggio, semplice da gestire e utile quando vuoi partire più tranquillo.',
        link: 'https://heymondo.it/?utm_medium=Afiliado&utm_source=TRAVELLINIWITHUS&utm_campaign=PRINCIPAL&cod_descuento=TRAVELLINIWITHUS&ag_campaign=TRAVELLINI&agencia=JG4Tepc5b47oLeK3xGDmbAX9I25ExoDeoc8cbPFt',
        tags: ['Assicurazione', 'Sconto'],
        badge: '-10%',
      },
      {
        name: 'ParkingMyCar',
        description: 'Utile quando partiamo in auto e vogliamo gestire il parcheggio prima di arrivare in aeroporto o in città.',
        link: 'https://www.parkingmycar.it/site/index?utm_source=google&utm_campaign=21056964161&utm_medium=cpc&utm_content=&utm_term=&gad_source=1&gbraid=0AAAAAC5NH-uBF_Etizh0eG-x4iwu5jcP6&gclid=Cj0KCQjw-5y1BhC-ARIsAAM_oKlUaD5GNX1X2cTdKaoZbArrf2T_FAmrF7Y5rYTZ3_CEJuX6zr',
        tags: ['Parcheggio', 'Mobilita'],
      },
      {
        name: 'Booking.com',
        description: 'Uno dei riferimenti più comodi quando vogliamo confrontare strutture, recensioni e posizioni velocemente.',
        link: 'https://booking.com',
        tags: ['Hotel', 'Alloggi'],
      },
      {
        name: 'Skyscanner',
        description: 'Ottimo per confrontare tratte, capire trend di prezzo e trovare idee volo senza partire da una destinazione fissa.',
        link: 'https://skyscanner.it',
        tags: ['Voli', 'Ricerca'],
      },
    ],
  },
  {
    id: 'digital',
    title: 'Strumenti digitali',
    icon: <Smartphone className="text-[var(--color-accent)]" size={30} />,
    description: 'App e servizi utili per gestire soldi, connessione e organizzazione in viaggio.',
    items: [
      {
        name: 'Revolut',
        description: 'Comoda per pagamenti, cambi valuta e controllo spese quando sei in movimento.',
        link: 'https://revolut.com',
        tags: ['Finanza', 'Carta'],
      },
      {
        name: 'Splitwise',
        description: 'La usiamo quando serve dividere spese di viaggio senza perdere tempo in conti manuali.',
        link: 'https://splitwise.com',
        tags: ['Utility', 'Gratis'],
      },
      {
        name: 'Airalo',
        description: 'Una soluzione pratica per avere internet appena arrivi, soprattutto nei viaggi dove non vuoi cercare SIM locali.',
        link: 'https://airalo.com',
        tags: ['eSIM', 'Internet'],
        badge: 'Credito extra',
      },
    ],
  },
  {
    id: 'gear',
    title: 'Gear e attrezzatura',
    icon: <Camera className="text-[var(--color-accent)]" size={30} />,
    description: 'L\'attrezzatura che usiamo davvero per viaggiare meglio e creare contenuti in modo pratico.',
    items: [
      {
        name: 'Osprey Farpoint 40',
        description: 'Uno zaino molto valido per viaggi solo bagaglio a mano, organizzato bene e comodo da portare.',
        link: 'https://amazon.it',
        tags: ['Zaino', 'Cabin'],
      },
      {
        name: 'Peak Design Tech Pouch',
        description: 'Utile per tenere in ordine cavi, batterie, caricabatterie e piccoli accessori.',
        link: 'https://amazon.it',
        tags: ['Accessori', 'Organizzazione'],
      },
      {
        name: 'Insta360',
        description: 'Una delle soluzioni più pratiche per contenuti immersivi e clip dinamiche da viaggio.',
        link: 'https://www.insta360.com/sal/x5?utm_term=INREECR',
        tags: ['Video', 'Creator'],
        badge: 'Partner',
      },
      {
        name: 'Sony A7IV',
        description: 'La nostra camera principale per foto e video quando vogliamo un risultato di livello più alto.',
        link: 'https://amzn.to/49Q6d10',
        tags: ['Camera', 'Pro'],
      },
      {
        name: 'DJI Mini 3 Pro',
        description: 'Il drone che ci aiuta a raccontare luoghi ed esperienze con un punto di vista diverso, restando leggero in viaggio.',
        link: 'https://amzn.to/3P39XfN',
        tags: ['Drone', 'Travel'],
      },
    ],
  },
];

const resourceHighlights = [
  {
    icon: <Shield className="text-[var(--color-accent)]" size={20} />,
    title: 'Selezione reale',
    text: 'Qui trovi strumenti che usiamo davvero o che riteniamo coerenti e utili per chi viaggia.',
  },
  {
    icon: <BadgePercent className="text-[var(--color-accent)]" size={20} />,
    title: 'Affiliazioni dichiarate',
    text: 'Alcuni link sono affiliati. Se acquisti da quelli, per noi arriva una commissione senza costi extra per te.',
  },
  {
    icon: <ShoppingBag className="text-[var(--color-accent)]" size={20} />,
    title: 'Poche risorse, ben scelte',
    text: 'Preferiamo consigliarti meno cose, ma più chiare, più sensate e più in linea con il progetto.',
  },
];

export default function Risorse() {
  const [copied, setCopied] = useState(false);

  // Carica risorse da Firestore; fallback all'array hardcoded se la collection è vuota o assente
  const { data: firestoreResources } = useQuery({
    queryKey: ['resources'],
    queryFn: fetchResources,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const firestoreByCategory = useMemo(() => {
    if (!firestoreResources?.length) return null;
    const grouped: Record<string, typeof firestoreResources> = {};
    for (const r of firestoreResources) {
      if (!grouped[r.category]) grouped[r.category] = [];
      grouped[r.category].push(r);
    }
    return grouped;
  }, [firestoreResources]);

  // Mappa categorie con items da Firestore se disponibili, altrimenti hardcoded
  const displayCategories = useMemo(
    () =>
      resourceCategories.map((cat) => ({
        ...cat,
        items: firestoreByCategory?.[cat.id]?.map((r) => ({
          name: r.name,
          description: r.description,
          link: r.link,
          tags: r.tags ?? [],
          badge: r.badge,
        })) ?? cat.items,
      })),
    [firestoreByCategory],
  );

  const handleCopy = () => {
    navigator.clipboard.writeText('TRAVELLINI3');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const breadcrumbItems = [{ label: 'Risorse' }];

  return (
    <PageLayout>
      <SEO
        title="Risorse di Viaggio"
        description="Una selezione di strumenti, app, servizi e attrezzatura che Travelliniwithus usa davvero per organizzare, vivere e raccontare meglio i viaggi."
        canonical={`${SITE_URL}/risorse`}
      />

      <Section className="pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="max-w-4xl mx-auto text-center mt-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="w-12 h-[1px] bg-[var(--color-accent)]"></div>
            <span className="uppercase tracking-widest text-sm font-semibold text-[var(--color-accent)]">
              Travel toolkit
            </span>
            <div className="w-12 h-[1px] bg-[var(--color-accent)]"></div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-display-1 mb-8"
          >
            Risorse che <span className="italic text-black/60">usiamo davvero</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-black/70 font-light leading-relaxed"
          >
            Questa non è una pagina piena di link a caso. È la nostra selezione di strumenti utili per organizzare
            meglio un viaggio, risparmiare tempo, creare contenuti e muoversi con meno stress.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-8 max-w-2xl rounded-[var(--radius-xl)] border border-black/5 bg-white px-6 py-5 text-sm leading-relaxed text-black/55 shadow-sm"
          >
            Alcuni link presenti qui sono affiliati e ci permettono di sostenere il progetto senza costi extra per te.
            Trovi i dettagli nella nostra{' '}
            <Link to="/disclaimer" className="font-medium text-[var(--color-accent)] underline underline-offset-2">
              informativa affiliazioni
            </Link>
            .
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {resourceHighlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[var(--radius-xl)] p-8 border border-black/5 shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--color-sand)] flex items-center justify-center mb-5">
                {item.icon}
              </div>
              <h2 className="text-xl font-serif mb-3">{item.title}</h2>
              <p className="text-black/60 font-light leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {displayCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className={`${category.id === 'gear' ? 'xl:col-span-3' : ''} bg-white rounded-[var(--radius-xl)] p-8 border border-black/5 shadow-sm hover:shadow-[var(--shadow-premium)] transition-all duration-500`}
            >
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-black/5">
                <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-[var(--color-sand)] flex items-center justify-center">
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-serif">{category.title}</h2>
                  <p className="text-sm text-black/50 mt-1">{category.description}</p>
                </div>
              </div>

              <div className={`grid grid-cols-1 ${category.id === 'gear' ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                {category.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.link}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    onClick={() => trackEvent('affiliate_click', { name: item.name, category: category.id, url: item.link })}
                    className={`group relative p-6 rounded-[var(--radius-xl)] border border-black/5 hover:border-black/20 hover:bg-[var(--color-sand)] transition-all duration-300 flex flex-col min-h-[240px] border-l-2 ${
                      category.id === 'booking' ? 'border-l-[var(--color-accent)]' : category.id === 'digital' ? 'border-l-[var(--color-accent-warm)]' : 'border-l-[var(--color-ink)]'
                    }`}
                  >
                    {item.badge && (
                      <div className="absolute -top-3 right-4 bg-[var(--color-accent)] text-white text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-md">
                        {item.badge}
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-lg font-serif group-hover:text-[var(--color-accent)] transition-colors">
                        {item.name}
                      </h3>
                      <ArrowRight
                        size={16}
                        className="text-black/20 group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                      />
                    </div>

                    <p className="text-sm text-black/60 font-light leading-relaxed mb-6 flex-grow">{item.description}</p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] uppercase tracking-widest font-bold text-black/40 bg-black/5 px-2 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-32 bg-white rounded-[2.5rem] p-10 md:p-20 border border-black/5 shadow-xl shadow-black/5 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--color-sand)]/50 to-transparent pointer-events-none"></div>

          <div className="lg:w-1/2 relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
                <ShoppingBag className="text-[var(--color-accent)]" size={24} />
              </div>
              <span className="uppercase tracking-widest text-sm font-bold text-[var(--color-accent)]">
                Risorse selezionate
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Pochi link, <br />
              <span className="italic text-black/60">scelti meglio</span>
            </h2>
            <p className="text-lg text-black/70 font-light mb-10 leading-relaxed">
              Questa pagina non vuole sembrare uno shop pieno di prodotti. Vuole essere una raccolta ordinata di
              strumenti, partner e servizi che hanno davvero un senso dentro il progetto e possono essere utili a chi viaggia.
            </p>
            <Button to="/disclaimer" variant="primary" className="px-8 py-4 text-lg">
              Come gestiamo le affiliazioni
              <ArrowRight size={20} />
            </Button>
          </div>

          <div className="lg:w-1/2 grid grid-cols-2 gap-6 relative z-10 w-full">
            <motion.div
              whileHover={{ y: -10 }}
              className="aspect-[3/4] rounded-[var(--radius-xl)] overflow-hidden shadow-2xl border-4 border-white"
            >
              {/* TODO(@travelliniwithus): PLACEHOLDER — servono foto attrezzatura e strumenti di viaggio */}
              <img
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=600&auto=format&fit=crop"
                alt="Strumenti utili per viaggiare meglio"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="aspect-[3/4] rounded-[var(--radius-xl)] overflow-hidden shadow-2xl border-4 border-white mt-12"
            >
              {/* TODO(@travelliniwithus): PLACEHOLDER — servono foto risorse e partner travel */}
              <img
                src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=600&auto=format&fit=crop"
                alt="Partner e risorse travel selezionate"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-32 bg-[var(--color-ink)] text-white rounded-[2.5rem] p-10 md:p-20 relative overflow-hidden shadow-2xl"
        >
          {/* TODO(@travelliniwithus): PLACEHOLDER — servono foto sfondo sezione vantaggi */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink)] via-[var(--color-ink)]/90 to-transparent"></div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <BadgePercent className="text-[var(--color-accent)]" size={24} />
              <span className="uppercase tracking-widest text-xs font-semibold text-[var(--color-accent)]">
                Vantaggi utili
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
              Due vantaggi che usiamo <span className="italic text-white/60">anche noi</span>
            </h2>
            <p className="text-lg text-white/70 font-light leading-relaxed mb-10">
              Non vogliamo sommergerti di codici. Qui trovi solo due benefit semplici, chiari e davvero coerenti con
              il viaggio.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#1C1C1C] p-8 rounded-[var(--radius-xl)] border border-white/8 hover:bg-[#242424] transition-colors group">
                <div className="text-xs uppercase tracking-widest text-white/50 mb-3">Heymondo</div>
                <div className="text-3xl font-serif mb-3 text-white group-hover:text-[var(--color-accent)] transition-colors">
                  -10% assicurazione
                </div>
                <p className="text-sm text-white/70 mb-8">
                  Sconto automatico dal link dedicato. Una delle opzioni che consideriamo più spesso prima di partire.
                </p>
                <Button
                  href="https://heymondo.it/?utm_medium=Afiliado&utm_source=TRAVELLINIWITHUS&utm_campaign=PRINCIPAL&cod_descuento=TRAVELLINIWITHUS&ag_campaign=TRAVELLINI&agencia=JG4Tepc5b47oLeK3xGDmbAX9I25ExoDeoc8cbPFt"
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                  rel="nofollow sponsored noopener noreferrer"
                >
                  Apri Heymondo
                </Button>
              </div>
              <div className="bg-[#1C1C1C] p-8 rounded-[var(--radius-xl)] border border-white/8 hover:bg-[#242424] transition-colors group">
                <div className="text-xs uppercase tracking-widest text-white/50 mb-3">Airalo</div>
                <div className="text-3xl font-serif mb-3 text-white group-hover:text-[var(--color-accent)] transition-colors">
                  Credito extra
                </div>
                <p className="text-sm text-white/70 mb-8">
                  Usa il codice <strong className="text-white">TRAVELLINI3</strong> se vuoi tenertelo da parte per il
                  prossimo viaggio.
                </p>
                <Button
                  onClick={handleCopy}
                  variant="secondary"
                  size="sm"
                  className={`w-full justify-center transition-all ${copied ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] hover:border-[var(--color-accent-hover)]' : ''}`}
                >
                  {copied ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={16} /> Codice copiato
                    </span>
                  ) : (
                    'Copia codice'
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute top-1/2 -right-20 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
            <ShoppingBag size={500} strokeWidth={0.5} />
          </div>
        </motion.div>

        <div className="mt-32">
          <Newsletter variant="white" />
        </div>
      </Section>
    </PageLayout>
  );
}
