import { motion } from 'motion/react';
import { Link } from '@/src/components/TransitionLink';
import { ArrowRight, Filter, Map, MapPinned, Route } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';

const MAP_POINTS = [
  { label: 'Salento lento', detail: 'calette, masserie, paesi bianchi' },
  { label: 'Alpi intime', detail: 'laghi piccoli e rifugi panoramici' },
  { label: 'Weekend Europa', detail: 'città compatte e hotel speciali' },
];

const MAP_FEATURES = [
  { icon: MapPinned, label: 'Luoghi', detail: 'schede salvabili' },
  { icon: Filter, label: 'Filtri', detail: 'zona, mood, budget' },
  { icon: Route, label: 'Percorsi', detail: 'idee già ordinate' },
];

const FEATURED_ROUTES = [
  '3 giorni tra Ostuni e calette',
  "Weekend lento in Val d'Orcia",
  'Road trip breve sulle Dolomiti',
];

export default function MonetizationTeaser() {
  return (
    <section className="bg-[var(--color-sand)] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-ink-deep)] text-white shadow-[var(--shadow-xl)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-14">
            <span className="inline-flex items-center gap-2 text-eyebrow !text-[var(--color-accent-on-dark)]">
              <Map size={13} /> Mappa editoriale
            </span>
            <h2 className="mt-3 max-w-xl font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl">
              Trova i posti sulla mappa, poi scegli con più criterio.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/68 md:text-lg">
              La mappa raccoglie luoghi, guide e idee viaggio in un unico punto: zone, filtri e
              percorsi pensati per passare dall’ispirazione alla scelta.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {MAP_FEATURES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/6 p-4"
                  >
                    <Icon size={18} className="text-[var(--color-accent)]" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-white/74">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-white/70">{item.detail}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 space-y-3 border-l border-white/12 pl-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
                Percorsi in evidenza
              </p>
              {FEATURED_ROUTES.map((route) => (
                <p key={route} className="text-sm leading-relaxed text-white/70">
                  {route}
                </p>
              ))}
            </div>

            <Link
              to="/mappa"
              className="group mt-9 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-[var(--color-ink)]"
            >
              Apri la mappa editoriale
              <ArrowRight
                size={14}
                className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1"
              />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="relative min-h-[420px] overflow-hidden lg:min-h-[620px]"
          >
            <OptimizedImage
              src="/images/destinations/toscana.webp"
              alt="Paesaggio toscano tra colline e borghi"
              className="h-full w-full object-cover"
              responsiveWidths={[320, 480, 768]}
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            <div className="twu-map-scrim absolute inset-0" />

            <div className="absolute bottom-8 left-8 right-8 hidden gap-3 md:grid md:grid-cols-3">
              {MAP_POINTS.map((point) => (
                <div
                  key={point.label}
                  className="rounded-xl border border-white/12 bg-black/35 p-4 backdrop-blur-md"
                >
                  <p className="font-serif text-xl leading-none text-white">{point.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/62">{point.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
