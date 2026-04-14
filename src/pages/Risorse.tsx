import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgePercent,
  Camera,
  CheckCircle2,
  Compass,
  Plane,
  Shield,
  Smartphone,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import Newsletter from '../components/Newsletter';
import Section from '../components/Section';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import FinalCtaSection from '../components/FinalCtaSection';
import { SITE_URL } from '../config/site';
import { fetchResources } from '../services/firebaseService';
import { trackEvent } from '../services/analytics';

interface ResourceItem {
  name: string;
  description: string;
  link: string;
  tags: string[];
  badge?: string;
  fit: string;
  avoid?: string;
}

const resourceCategories: Array<{
  id: 'booking' | 'digital' | 'gear';
  title: string;
  icon: ReactNode;
  description: string;
  items: ResourceItem[];
}> = [
  {
    id: 'booking',
    title: 'Prenotare e muoversi',
    icon: <Plane className="text-[var(--color-accent)]" size={28} />,
    description: 'Servizi utili per voli, hotel, esperienze, assicurazione e logistica.',
    items: [
      {
        name: 'GetYourGuide',
        description:
          'Utile per ingressi, tour e attivita quando vuoi capire disponibilita e orari prima di partire.',
        link: 'https://getyourguide.com/-cs552',
        tags: ['Esperienze', 'Prenotazioni'],
        badge: 'Affiliato',
        fit: 'Per chi preferisce bloccare attivita chiave prima del viaggio.',
        avoid: 'Da evitare se vuoi massima spontaneita o se il meteo e molto incerto.',
      },
      {
        name: 'Heymondo',
        description:
          'Una soluzione assicurativa che valutiamo quando il viaggio ha costi, distanze o imprevisti potenziali piu alti.',
        link: 'https://heymondo.it/?utm_medium=Afiliado&utm_source=TRAVELLINIWITHUS&utm_campaign=PRINCIPAL&cod_descuento=TRAVELLINIWITHUS&ag_campaign=TRAVELLINI&agencia=JG4Tepc5b47oLeK3xGDmbAX9I25ExoDeoc8cbPFt',
        tags: ['Assicurazione', 'Sconto'],
        badge: '-10%',
        fit: 'Per viaggi extra UE, itinerari lunghi o prenotazioni non banali.',
        avoid: 'Non sostituisce la lettura delle condizioni: controlla sempre massimali e coperture.',
      },
      {
        name: 'Skyscanner',
        description:
          'Buono per confrontare tratte e capire il range prezzo prima di scegliere davvero una destinazione.',
        link: 'https://skyscanner.it',
        tags: ['Voli', 'Ricerca'],
        fit: 'Per esplorare opzioni quando date o aeroporti sono flessibili.',
      },
      {
        name: 'Booking.com',
        description:
          'Comodo per confrontare posizione, recensioni e condizioni di cancellazione in modo rapido.',
        link: 'https://booking.com',
        tags: ['Alloggi', 'Confronto'],
        fit: 'Per scremare strutture e zone prima di decidere dove dormire.',
      },
    ],
  },
  {
    id: 'digital',
    title: 'Strumenti digitali',
    icon: <Smartphone className="text-[var(--color-accent)]" size={28} />,
    description: 'App e servizi per connessione, spese e organizzazione in movimento.',
    items: [
      {
        name: 'Airalo',
        description:
          'Una eSIM e utile quando vuoi arrivare con connessione gia pronta, soprattutto fuori dall Unione Europea.',
        link: 'https://airalo.com',
        tags: ['eSIM', 'Internet'],
        badge: 'Codice',
        fit: 'Per viaggi in cui non vuoi perdere tempo a cercare SIM locali.',
        avoid: 'Verifica sempre copertura e compatibilita del telefono.',
      },
      {
        name: 'Revolut',
        description:
          'Comoda per pagamenti, cambio valuta e controllo delle spese quando ti muovi tra paesi diversi.',
        link: 'https://revolut.com',
        tags: ['Pagamenti', 'Valuta'],
        fit: 'Per tenere separate e leggibili le spese di viaggio.',
      },
      {
        name: 'Splitwise',
        description:
          'Semplice per dividere costi tra coppia, amici o gruppo senza ricostruire tutto a fine viaggio.',
        link: 'https://splitwise.com',
        tags: ['Spese', 'Gratis'],
        fit: 'Per viaggi in compagnia con spese condivise.',
      },
    ],
  },
  {
    id: 'gear',
    title: 'Gear e contenuti',
    icon: <Camera className="text-[var(--color-accent)]" size={28} />,
    description: 'Attrezzatura e accessori che hanno senso per viaggiare e raccontare meglio.',
    items: [
      {
        name: 'Peak Design Tech Pouch',
        description:
          'Una soluzione pratica per tenere ordinati cavi, batterie e piccoli accessori senza perdere tempo nello zaino.',
        link: 'https://amazon.it',
        tags: ['Organizzazione', 'Gear'],
        fit: 'Per chi porta camera, power bank, microfoni o piu caricatori.',
      },
      {
        name: 'Sony A7IV',
        description:
          'Camera full-frame per contenuti foto/video di livello alto quando il viaggio ha anche un obiettivo creator.',
        link: 'https://amzn.to/49Q6d10',
        tags: ['Camera', 'Creator'],
        fit: 'Per produzione visual seria, non per chi cerca solo ricordi rapidi.',
      },
      {
        name: 'DJI Mini 3 Pro',
        description:
          'Drone leggero per punti di vista ampi, da usare solo dove regole, condizioni e sicurezza lo permettono.',
        link: 'https://amzn.to/3P39XfN',
        tags: ['Drone', 'Visual'],
        fit: 'Per contenuti paesaggistici e destinazioni con spazi aperti.',
        avoid: 'Da evitare dove normative, vento o affollamento non lo consentono.',
      },
    ],
  },
];

const resourcePrinciples = [
  {
    icon: <Shield className="text-[var(--color-accent)]" size={20} />,
    title: 'Selezione dichiarata',
    text: 'Ogni link deve avere un motivo pratico. Se e affiliato, lo diciamo.',
  },
  {
    icon: <Compass className="text-[var(--color-accent)]" size={20} />,
    title: 'Metodo prima del codice',
    text: 'Il punto non e lo sconto: e capire quando uno strumento ha davvero senso.',
  },
  {
    icon: <BadgePercent className="text-[var(--color-accent)]" size={20} />,
    title: 'Monetizzazione sobria',
    text: 'Le affiliazioni sostengono il progetto senza trasformare il sito in una pagina coupon.',
  },
];

export default function Risorse() {
  const [copied, setCopied] = useState(false);

  const { data: firestoreResources } = useQuery({
    queryKey: ['resources'],
    queryFn: fetchResources,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const firestoreByCategory = useMemo(() => {
    if (!firestoreResources?.length) return null;
    const grouped: Record<string, typeof firestoreResources> = {};
    for (const resource of firestoreResources) {
      if (!grouped[resource.category]) grouped[resource.category] = [];
      grouped[resource.category].push(resource);
    }
    return grouped;
  }, [firestoreResources]);

  const displayCategories = useMemo(
    () =>
      resourceCategories.map((category) => ({
        ...category,
        items:
          firestoreByCategory?.[category.id]?.map((resource) => ({
            name: resource.name,
            description: resource.description,
            link: resource.link,
            tags: resource.tags ?? [],
            badge: resource.badge,
            fit: 'Risorsa inserita dal CMS: verifica descrizione, natura del link e coerenza prima del deploy.',
          })) ?? category.items,
      })),
    [firestoreByCategory],
  );

  const handleCopy = () => {
    navigator.clipboard.writeText('TRAVELLINI3');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout>
      <SEO
        title="Risorse di viaggio selezionate"
        description="Strumenti, app, servizi e gear che Travelliniwithus usa o valuta con criterio per organizzare, vivere e raccontare meglio i viaggi."
        canonical={`${SITE_URL}/risorse`}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Risorse di viaggio selezionate - Travelliniwithus',
          description:
            'Una selezione editoriale di strumenti, servizi e attrezzatura per viaggiare con piu criterio.',
          url: `${SITE_URL}/risorse`,
        }}
      />

      <Section className="pt-8" spacing="tight">
        <Breadcrumbs items={[{ label: 'Risorse' }]} />

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              Travel toolkit
            </span>
            <h1 className="text-display-1">
              Strumenti scelti <span className="italic text-black/55">con criterio</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/68">
              Questa non e una pagina di link a caso. E una selezione editoriale di strumenti che
              usiamo, valutiamo o riteniamo coerenti con il nostro modo di viaggiare: utili,
              dichiarati e mai coupon-first.
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
              Regola Travellini
            </p>
            <p className="mt-4 text-2xl font-serif leading-relaxed text-[var(--color-ink)]">
              Se una risorsa non aiuta a decidere, organizzare o viaggiare meglio, non merita spazio.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-black/55">
              Alcuni link possono essere affiliati: per te non cambia il costo, per noi possono
              sostenere il progetto.
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {resourcePrinciples.map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-sand)]">
                {item.icon}
              </div>
              <h2 className="font-serif text-xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-black/60">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8">
          {displayCategories.map((category) => (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              className="rounded-[2.5rem] border border-black/5 bg-white p-7 shadow-sm md:p-10"
            >
              <div className="mb-8 flex flex-col gap-5 border-b border-black/5 pb-8 md:flex-row md:items-end md:justify-between">
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-sand)]">
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif">{category.title}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/58">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {category.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.link}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    onClick={() =>
                      trackEvent('affiliate_click', {
                        name: item.name,
                        category: category.id,
                        url: item.link,
                      })
                    }
                    className="group flex min-h-[290px] flex-col rounded-[2rem] border border-black/5 bg-[var(--color-sand)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/35 hover:bg-white hover:shadow-xl"
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-3 flex flex-wrap gap-2">
                          {item.badge && (
                            <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                              {item.badge}
                            </span>
                          )}
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-black/42"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-2xl font-serif leading-tight transition-colors group-hover:text-[var(--color-accent-text)]">
                          {item.name}
                        </h3>
                      </div>
                      <ArrowRight
                        size={18}
                        className="mt-1 shrink-0 text-black/25 transition-all group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                      />
                    </div>

                    <p className="text-sm leading-relaxed text-black/62">{item.description}</p>

                    <div className="mt-auto space-y-3 pt-7">
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                          Per chi ha senso
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-black/62">{item.fit}</p>
                      </div>
                      {item.avoid && (
                        <p className="text-xs leading-relaxed text-black/45">
                          <strong className="text-black/62">Quando evitarlo:</strong> {item.avoid}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        <div className="mt-20 rounded-[2.5rem] bg-[var(--color-ink)] p-8 text-white md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Vantaggi dichiarati
              </span>
              <h2 className="text-3xl font-serif md:text-5xl">Codici e benefit, senza spingere a comprare.</h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/68">
                Li teniamo qui per chi li cerca. Non sostituiscono una scelta consapevole: prima
                valuta se lo strumento e davvero utile per il tuo viaggio.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[420px]">
              <Button
                href="https://heymondo.it/?utm_medium=Afiliado&utm_source=TRAVELLINIWITHUS&utm_campaign=PRINCIPAL&cod_descuento=TRAVELLINIWITHUS&ag_campaign=TRAVELLINI&agencia=JG4Tepc5b47oLeK3xGDmbAX9I25ExoDeoc8cbPFt"
                variant="outline-light"
                rel="nofollow sponsored noopener noreferrer"
                className="w-full"
              >
                Heymondo -10%
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline-light"
                className={`w-full ${copied ? 'bg-[var(--color-accent)] text-[var(--color-ink)]' : ''}`}
              >
                {copied ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={16} /> Codice copiato
                  </span>
                ) : (
                  'Copia Airalo'
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <Newsletter variant="editorial" source="resources_newsletter" />
        </div>

        <div className="mt-16">
          <FinalCtaSection intent="discovery" />
        </div>

        <div className="mt-12 rounded-[2rem] border border-black/5 bg-white p-7 text-sm leading-relaxed text-black/55">
          Per dettagli completi sulla natura dei link affiliati, consulta la{' '}
          <Link to="/disclaimer" className="font-semibold text-[var(--color-accent-text)] underline underline-offset-2">
            pagina disclaimer
          </Link>
          .
        </div>
      </Section>
    </PageLayout>
  );
}
