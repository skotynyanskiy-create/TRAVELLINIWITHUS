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
import { slugifyExperienceType } from '../config/contentTaxonomy';
import { fetchResources } from '../services/firebaseService';
import {
  AFFILIATE_PARTNERS,
  prepareAffiliateLink,
  trackAffiliateClick,
  type AffiliatePartner,
} from '../lib/affiliate';
import { useShopGate } from '../hooks/useShopGate';

interface ResourceItem {
  name: string;
  partner: AffiliatePartner;
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
        partner: 'getyourguide',
        description:
          'Utile per ingressi, tour e attività quando vuoi capire disponibilita e orari prima di partire.',
        link: 'https://getyourguide.com/-cs552',
        tags: ['Esperienze', 'Prenotazioni'],
        badge: 'Affiliato',
        fit: 'Per chi preferisce bloccare attività chiave prima del viaggio.',
        avoid: 'Da evitare se vuoi massima spontaneità o se il meteo e molto incerto.',
      },
      {
        name: 'Heymondo',
        partner: 'heymondo',
        description:
          'Una soluzione assicurativa che valutiamo quando il viaggio ha costi, distanze o imprevisti potenziali più alti.',
        link: 'https://heymondo.it/?utm_medium=Afiliado&utm_source=TRAVELLINIWITHUS&utm_campaign=PRINCIPAL&cod_descuento=TRAVELLINIWITHUS&ag_campaign=TRAVELLINI&agencia=JG4Tepc5b47oLeK3xGDmbAX9I25ExoDeoc8cbPFt',
        tags: ['Assicurazione', 'Sconto'],
        badge: '-10%',
        fit: 'Per viaggi extra UE, itinerari lunghi o prenotazioni non banali.',
        avoid:
          'Non sostituisce la lettura delle condizioni: controlla sempre massimali e coperture.',
      },
      {
        name: 'Skyscanner',
        partner: 'skyscanner',
        description:
          'Buono per confrontare tratte e capire il range prezzo prima di scegliere davvero una destinazione.',
        link: 'https://skyscanner.it',
        tags: ['Voli', 'Ricerca'],
        fit: 'Per esplorare opzioni quando date o aeroporti sono flessibili.',
      },
      {
        name: 'Booking.com',
        partner: 'booking',
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
        partner: 'airalo',
        description: `Una eSIM è utile quando vuoi arrivare con connessione già pronta, soprattutto fuori dall'Unione Europea.`,
        link: 'https://airalo.com',
        tags: ['eSIM', 'Internet'],
        badge: 'Codice',
        fit: 'Per viaggi in cui non vuoi perdere tempo a cercare SIM locali.',
        avoid: 'Verifica sempre copertura e compatibilita del telefono.',
      },
      {
        name: 'Revolut',
        partner: 'revolut',
        description:
          'Comoda per pagamenti, cambio valuta e controllo delle spese quando ti muovi tra paesi diversi.',
        link: 'https://revolut.com',
        tags: ['Pagamenti', 'Valuta'],
        fit: 'Per tenere separate e leggibili le spese di viaggio.',
      },
      {
        name: 'Splitwise',
        partner: 'splitwise',
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
        partner: 'amazon',
        description:
          'Una soluzione pratica per tenere ordinati cavi, batterie e piccoli accessori senza perdere tempo nello zaino.',
        link: 'https://amazon.it',
        tags: ['Organizzazione', 'Gear'],
        fit: 'Per chi porta camera, power bank, microfoni o più caricatori.',
      },
      {
        name: 'Sony A7IV',
        partner: 'amazon',
        description:
          'Camera full-frame per contenuti foto/video di livello alto quando il viaggio ha anche un obiettivo creator.',
        link: 'https://amzn.to/49Q6d10',
        tags: ['Camera', 'Creator'],
        fit: 'Per produzione visual seria, non per chi cerca solo ricordi rapidi.',
      },
      {
        name: 'DJI Mini 3 Pro',
        partner: 'amazon',
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

const HEYMONDO_AFFILIATE_URL =
  'https://heymondo.it/?utm_medium=Afiliado&utm_source=TRAVELLINIWITHUS&utm_campaign=PRINCIPAL&cod_descuento=TRAVELLINIWITHUS&ag_campaign=TRAVELLINI&agencia=JG4Tepc5b47oLeK3xGDmbAX9I25ExoDeoc8cbPFt';

const AIRALO_PROMO_CODE = 'TRAVELLINI3';

const resourcePrinciples = [
  {
    icon: <Shield className="text-[var(--color-accent)]" size={20} />,
    title: 'Selezione dichiarata',
    text: 'Ogni link deve avere un motivo pratico. Se e affiliato, lo diciamo.',
  },
  {
    icon: <Compass className="text-[var(--color-accent)]" size={20} />,
    title: 'Metodo prima del codice',
    text: 'Il punto non è lo sconto: è capire quando uno strumento ha davvero senso.',
  },
  {
    icon: <BadgePercent className="text-[var(--color-accent)]" size={20} />,
    title: 'Monetizzazione sobria',
    text: 'Le affiliazioni sostengono il progetto senza trasformare il sito in una pagina coupon.',
  },
];

const EXPLORE_PATHS = [
  {
    title: 'Per luogo',
    description: 'Vai prima nelle destinazioni se stai decidendo dove andare.',
    to: '/destinazioni',
    cta: 'Apri destinazioni',
  },
  {
    title: 'Per esperienza',
    description: 'Weekend romantici, posti particolari, hotel con carattere e idee piu mirate.',
    to: `/esperienze?type=${slugifyExperienceType('Posti particolari')}`,
    cta: 'Apri esperienze',
  },
  {
    title: 'Guide pratiche',
    description:
      'Se ti servono contesto, budget, logistica o food guide, entra prima nel layer guide.',
    to: '/guide',
    cta: 'Apri guide pratiche',
  },
];

export default function Risorse() {
  const [copied, setCopied] = useState(false);
  const { isShopDiscoverable } = useShopGate();

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
          firestoreByCategory?.[category.id]?.map<ResourceItem>((resource) => ({
            name: resource.name,
            partner:
              resource.partner && resource.partner in AFFILIATE_PARTNERS
                ? (resource.partner as AffiliatePartner)
                : 'generic',
            description: resource.description,
            link: resource.link,
            tags: resource.tags ?? [],
            badge: resource.badge,
            fit: 'Risorsa inserita dal CMS: verifica descrizione, natura del link e coerenza prima del deploy.',
          })) ?? category.items,
      })),
    [firestoreByCategory]
  );

  const heymondoCta = useMemo(
    () =>
      prepareAffiliateLink('heymondo', HEYMONDO_AFFILIATE_URL, {
        campaign: 'risorse_benefit',
        placement: 'risorse_benefit_banner',
        label: 'Heymondo -10%',
      }),
    []
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(AIRALO_PROMO_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackAffiliateClick({
      partner: 'airalo',
      url: `promo_code:${AIRALO_PROMO_CODE}`,
      campaign: 'risorse_benefit',
      placement: 'risorse_benefit_banner_copy',
      label: 'Copia Airalo',
    });
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
            'Una selezione editoriale di strumenti, servizi e attrezzatura per viaggiare con più criterio.',
          url: `${SITE_URL}/risorse`,
        }}
      />

      <Section className="pt-8" spacing="tight">
        <Breadcrumbs items={[{ label: 'Risorse' }]} />

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              Pianifica meglio
            </span>
            <h1 className="text-display-1">
              Strumenti e risorse <span className="italic text-black/55">per viaggiare bene</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/68">
              Questa non è una pagina di link a caso. È una selezione editoriale di strumenti che
              usiamo, valutiamo o riteniamo coerenti con il nostro modo di viaggiare: utili,
              dichiarati e mai coupon-first.
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
              Regola Travellini
            </p>
            <p className="mt-4 text-2xl font-serif leading-relaxed text-[var(--color-ink)]">
              Se una risorsa non aiuta a decidere, organizzare o viaggiare meglio, non merita
              spazio.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-black/55">
              Alcuni link possono essere affiliati: per te non cambia il costo, per noi possono
              sostenere il progetto.
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {resourcePrinciples.map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-sand)]">
                {item.icon}
              </div>
              <h2 className="font-serif text-xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-black/60">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {EXPLORE_PATHS.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="group rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/25"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                Parti da qui
              </p>
              <h2 className="mt-4 text-2xl font-serif">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-black/62">{item.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-text)]">
                {item.cta} <ArrowRight size={12} />
              </span>
            </Link>
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
                {category.items.map((item) => {
                  const { href: affiliateHref, onClick: handleAffiliateClick } =
                    prepareAffiliateLink(item.partner, item.link, {
                      campaign: `risorse_${category.id}`,
                      placement: 'risorse_grid',
                      label: item.name,
                    });
                  return (
                    <motion.a
                      key={item.name}
                      href={affiliateHref}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      onClick={handleAffiliateClick}
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
                    </motion.a>
                  );
                })}
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
              <h2 className="text-3xl font-serif md:text-5xl">
                Codici e benefit, senza spingere a comprare.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/68">
                Li teniamo qui per chi li cerca. Non sostituiscono una scelta consapevole: prima
                valuta se lo strumento e davvero utile per il tuo viaggio.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[420px]">
              <Button
                href={heymondoCta.href}
                onClick={heymondoCta.onClick}
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

        {isShopDiscoverable && (
          <div className="mt-10 rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                  Boutique editoriale
                </p>
                <h2 className="mt-3 text-2xl font-serif">
                  Quando una risorsa diventa un prodotto, la trovi nello shop.
                </h2>
              </div>
              <Button to="/shop" variant="outline">
                Apri lo shop
              </Button>
            </div>
          </div>
        )}

        <div className="mt-20">
          <Newsletter variant="editorial" source="resources_newsletter" />
        </div>

        <div className="mt-16">
          <FinalCtaSection intent="discovery" />
        </div>

        <div className="mt-12 rounded-[2rem] border border-black/5 bg-white p-7 text-sm leading-relaxed text-black/55">
          Per dettagli completi sulla natura dei link affiliati, consulta la{' '}
          <Link
            to="/disclaimer"
            className="font-semibold text-[var(--color-accent-text)] underline underline-offset-2"
          >
            pagina disclaimer
          </Link>
          .
        </div>
      </Section>
    </PageLayout>
  );
}
