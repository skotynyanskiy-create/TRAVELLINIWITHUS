import { useState } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Compass,
  Eye,
  Layers,
  MapPin,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackEvent } from '../../services/analytics';
import Section from '../Section';

interface CaseStudy {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  partnerType: string;
  scope: string;
  badge: string;
  summary: string;
  metrics: {
    label: string;
    value: string;
    icon: typeof Eye;
    note?: string;
  }[];
  deliverables: string[];
  takeaway: string;
  accentBg: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'destinazione-territorio',
    category: 'Destinazione & Territorio',
    title: 'Castelli del Ducato & Val Tidone',
    subtitle: 'Posizionamento itinerario storico-naturalistico e borghi autentici',
    partnerType: 'DMO & Promozione Territoriale',
    scope: 'Itinerario 4 giorni + Reel serie + Articolo Pillar',
    badge: 'Territorio & Borghi',
    summary:
      'Racconto coordinato a tappe per far scoprire un territorio fuori dai soliti circuiti turistico-commerciali, con focus su esperienze lente, prodotti locali e borghi conservati. Collaborazione reale e verificabile con la DMO Castelli del Ducato.',
    metrics: [
      { label: 'Formato', value: 'Itinerario 4 giorni', icon: Compass },
      { label: 'Contenuti', value: 'Reel serie + articolo pillar', icon: Layers },
      {
        label: 'Trasparenza',
        value: 'Disclosure dichiarata',
        icon: CheckCircle2,
        note: 'Su ogni contenuto',
      },
    ],
    deliverables: [
      'Articolo guida con tappe, consigli mappa e disclosure trasparente',
      '2 Reel editoriali ad alta salvabilità e riuso',
      'Stories in-loco di contesto durante l’itinerario',
      'Asset fotografici ad alta risoluzione per la DMO',
    ],
    takeaway:
      'Il pubblico non cerca una lista di monumenti, ma un itinerario già pronto e fattibile da replicare nel weekend. I numeri della collaborazione li condividiamo in call, dai dati nativi delle piattaforme.',
    accentBg: 'from-[var(--color-accent)]/10 via-[var(--color-sand)]/30 to-transparent',
  },
  {
    id: 'hospitality-boutique',
    category: 'Hospitality & Boutique Stay',
    title: 'Boutique stay & dimore con carattere',
    subtitle: 'Soggiorno esperienziale, atmosfera locale e architettura d’autore',
    partnerType: 'Boutique Hotel & Masserie',
    scope: 'Stay 2-3 notti + Tour narrativo + Guida Soggiorno',
    badge: 'Hospitality & Stay',
    summary:
      'Il format per le strutture di pregio: raccontiamo l’esperienza di soggiorno com’è davvero — dalla colazione con produttori locali ai dettagli architettonici. È il formato che usiamo per gli stay che trovi nel nostro atlante.',
    metrics: [
      { label: 'Formato', value: 'Stay esperienziale', icon: Building2 },
      { label: 'Contenuti', value: 'Reel + scheda nel sito', icon: Eye },
      { label: 'Trasparenza', value: 'Invito dichiarato', icon: CheckCircle2 },
    ],
    deliverables: [
      'Video tour emozionale del soggiorno senza toni promozionali finti',
      'Inserimento dedicato nella guida territoriale Salento del sito',
      'Serie stories di contesto (spazi, colazione, dintorni)',
      'Galleria foto curata per la comunicazione della struttura',
    ],
    takeaway:
      'I viaggiatori cercano il sapore vero del luogo prima del servizio: raccontiamo il contesto, non il dépliant.',
    accentBg: 'from-[var(--color-accent)]/10 via-[var(--color-sand)]/20 to-transparent',
  },
  {
    id: 'travel-tech-gear',
    category: 'Travel Tech & Services',
    title: 'Brand Travel Gear & Connettività',
    subtitle: 'Integrazione strumento di viaggio in uso reale on-the-road',
    partnerType: 'Servizi & Prodotti Viaggio',
    scope: 'UGC Content Kit + Test Pro/Contro + Review Sito',
    badge: 'Brand & Services',
    summary:
      'Il format per prodotti e servizi di viaggio: integrazione naturale durante un viaggio reale (eSIM, attrezzatura, app), con test sul campo e pro/limiti dichiarati — come i prodotti che trovi nella nostra pagina Risorse.',
    metrics: [
      { label: 'Formato', value: 'Test on-the-road', icon: TrendingUp },
      { label: 'Contenuti', value: 'Reel + review in Risorse', icon: BarChart3 },
      { label: 'Trasparenza', value: 'Etichetta sponsorizzata', icon: CheckCircle2 },
    ],
    deliverables: [
      'Reel esplicativo dell’utilità pratica prima della partenza',
      'Box review dedicato nella sezione Risorse / Utility del sito',
      'Codice o link dedicato con etichetta sponsorizzata trasparentemente',
      'Materiali video grezzi per l’uso adv del brand partner',
    ],
    takeaway:
      'La massima trasparenza sui limiti e punti di forza del servizio crea un intento d’acquisto più alto e privo di frizioni.',
    accentBg: 'from-[var(--color-accent)]/10 via-[var(--color-sand)]/30 to-transparent',
  },
];

export default function CaseStudiesSection() {
  const [activeTab, setActiveTab] = useState<string>(CASE_STUDIES[0].id);
  const currentStudy = CASE_STUDIES.find((cs) => cs.id === activeTab) ?? CASE_STUDIES[0];

  const handleTabChange = (studyId: string) => {
    setActiveTab(studyId);
    trackEvent('case_study_tab_select', {
      route: '/collaborazioni',
      case_study_id: studyId,
    });
  };

  return (
    <Section className="my-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent-soft)] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text)]">
            <Sparkles size={14} />
            <span>Format di collaborazione</span>
          </div>
          <h2 className="text-4xl font-serif md:text-5xl">Come prende forma un progetto con noi</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-ink-2)]">
            Tre format reali di lavoro con i deliverable tipici di ciascuno. I numeri delle
            collaborazioni li mostriamo in call, dai dati nativi delle piattaforme — mai metriche di
            vetrina.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {CASE_STUDIES.map((study) => {
            const isActive = study.id === activeTab;
            return (
              <button
                key={study.id}
                type="button"
                onClick={() => handleTabChange(study.id)}
                className={`relative flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-ink-deep)] text-white shadow-lg shadow-[var(--color-ink)]/15 scale-[1.02]'
                    : 'bg-white/80 border border-black/8 text-[var(--color-ink-2)] hover:bg-white hover:border-black/15'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCaseStudyTab"
                    className="absolute inset-0 rounded-full bg-[var(--color-ink-deep)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {study.id === 'destinazione-territorio' && <Compass size={16} />}
                  {study.id === 'hospitality-boutique' && <Building2 size={16} />}
                  {study.id === 'travel-tech-gear' && <Layers size={16} />}
                  {study.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Case Study Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStudy.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/90 p-8 shadow-xl backdrop-blur-md md:p-12"
          >
            {/* Ambient Gradient Background Accent */}
            <div
              className={`absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br ${currentStudy.accentBg} blur-3xl pointer-events-none`}
            />

            {/* Header info */}
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-black/8 pb-6">
              <div>
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[var(--color-accent-text)]">
                  {currentStudy.partnerType}
                </span>
                <h3 className="text-3xl font-serif text-[var(--color-ink)] md:text-4xl">
                  {currentStudy.title}
                </h3>
                <p className="mt-1 text-base text-[var(--color-ink-2)]">{currentStudy.subtitle}</p>
              </div>
              <div className="rounded-xl bg-[var(--color-sand)] px-4 py-2 text-xs font-semibold text-[var(--color-ink-2)]">
                <span className="text-[var(--color-muted-fg)]">Scope: </span>
                {currentStudy.scope}
              </div>
            </div>

            {/* Summary & Key Takeaway */}
            <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-muted-fg)]">
                  L’Approccio Narrativo
                </h4>
                <p className="text-base leading-relaxed text-[var(--color-ink-2)]">
                  {currentStudy.summary}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent-soft)]/60 p-5">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-accent-text)]">
                  <MapPin size={14} />
                  <span>Insight di Progetto</span>
                </div>
                <p className="text-sm italic leading-relaxed text-[var(--color-ink-2)]">
                  &ldquo;{currentStudy.takeaway}&rdquo;
                </p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="mb-10">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--color-muted-fg)]">
                Risultati & Impatto Misurabile
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {currentStudy.metrics.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.label}
                      className="group rounded-2xl border border-black/6 bg-[var(--color-sand)]/50 p-5 transition-all duration-300 hover:border-[var(--color-accent)]/30 hover:bg-white hover:shadow-md"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted-fg)]">
                          {m.label}
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--color-accent)] shadow-xs group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-ink)] transition-colors">
                          <Icon size={16} />
                        </div>
                      </div>
                      <div className="text-3xl font-serif text-[var(--color-ink)]">{m.value}</div>
                      {m.note && (
                        <p className="mt-1 text-[11px] text-[var(--color-muted-fg)]">{m.note}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Deliverables Package */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--color-muted-fg)]">
                Deliverables Inclusi nel Format
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentStudy.deliverables.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-black/5 bg-white p-3.5 text-sm text-[var(--color-ink-2)]"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[var(--color-accent)]"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footnote CTA link */}
        <div className="mt-8 flex items-center justify-between rounded-2xl border border-black/8 bg-[var(--color-sand)]/60 px-6 py-4">
          <p className="text-xs text-[var(--color-muted-fg)]">
            Vuoi approfondire il fit per la tua struttura o destinazione?
          </p>
          <a
            href="/media-kit"
            className="inline-flex items-center gap-1.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-accent-text)] hover:underline"
            onClick={() => trackEvent('case_study_mediakit_link', { route: '/collaborazioni' })}
          >
            Sfoglia il Media Kit <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </Section>
  );
}
