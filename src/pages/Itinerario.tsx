import { motion } from 'motion/react';
import { useParams } from 'react-router-dom';
import { Link } from '@/src/components/TransitionLink';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Wallet,
  XCircle,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import DemoContentNotice from '../components/DemoContentNotice';
import Newsletter from '../components/Newsletter';
import OptimizedImage from '../components/OptimizedImage';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import NotFound from './NotFound';
import { DEMO_ITINERARIES } from '../config/demoItineraries';
import { SITE_URL } from '../config/site';

export default function Itinerario() {
  const { slug } = useParams();
  const itinerary = DEMO_ITINERARIES.find((item) => item.slug === slug);

  if (!itinerary) return <NotFound />;

  return (
    <PageLayout>
      <SEO
        title={itinerary.title}
        description={itinerary.excerpt}
        canonical={`${SITE_URL}/itinerari/${itinerary.slug}`}
        image={itinerary.image}
        type="article"
        noindex={itinerary.isDemo}
      />

      <article className="group/article mx-4 my-8 overflow-hidden rounded-3xl border border-black/5 bg-white pb-24 shadow-[var(--shadow-premium)] md:mx-8 lg:mx-12">
        <div className="relative aspect-[5/3] w-full overflow-hidden md:aspect-[16/7]">
          <OptimizedImage
            src={itinerary.image}
            alt={itinerary.title}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/article:scale-103"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white md:p-12">
            <span className="rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] backdrop-blur-md border border-white/10 shadow-xs">
              {itinerary.style} · {itinerary.duration}
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-serif leading-tight md:text-6xl">
              {itinerary.title}
            </h1>
            <p className="mt-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-white/80">
              <MapPin size={14} /> {itinerary.destination}, {itinerary.continent}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl px-6 md:px-10">
          <Breadcrumbs
            items={[{ label: 'Itinerari', href: '/itinerari' }, { label: itinerary.title }]}
          />

          {itinerary.isDemo && (
            <DemoContentNotice
              className="mt-8"
              title="Anteprima itinerario"
              message="Questo itinerario è in lavorazione: mostra struttura, ritmo e livello editoriale. Verrà aggiornato con dati e foto verificati prima della pubblicazione completa."
            />
          )}

          <div className="mt-10 rounded-2xl border border-[var(--color-accent)]/10 bg-gradient-to-br from-[var(--color-accent-soft)] to-white/40 p-8 backdrop-blur-md md:p-10">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              In breve
            </p>
            <p className="text-xl font-serif leading-relaxed text-[var(--color-ink)] md:text-2xl">
              {itinerary.excerpt}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <FactCell
              icon={<Clock size={18} />}
              label="Durata"
              value={`${itinerary.durationDays} giorni`}
            />
            <FactCell icon={<Calendar size={18} />} label="Periodo" value={itinerary.period} />
            <FactCell icon={<Wallet size={18} />} label="Budget" value={itinerary.budget} />
            <FactCell icon={<ShieldCheck size={18} />} label="Stile" value={itinerary.style} />
          </div>

          {itinerary.highlights.length > 0 && (
            <section className="mt-14">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
                Perché salvarlo
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {itinerary.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="group/highlight flex items-start gap-3 rounded-2xl border border-black/5 bg-white/70 backdrop-blur-md p-5 transition-all duration-500 hover:-translate-y-1 hover:bg-white/95 hover:shadow-[var(--shadow-premium)]"
                  >
                    <CheckCircle2
                      className="mt-1 shrink-0 text-[var(--color-accent)] transition-transform duration-500 group-hover/highlight:rotate-12 group-hover/highlight:scale-110"
                      size={18}
                    />
                    <p className="text-sm leading-relaxed text-black/70">{highlight}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-16">
            <h2 className="mb-10 text-3xl font-serif md:text-4xl text-[var(--color-ink)]">
              Itinerario giorno per giorno
            </h2>
            <div className="relative space-y-8">
              {/* Linea verticale per la timeline */}
              <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent)]/30 to-transparent hidden md:block" />

              {itinerary.stages.map((stage, idx) => (
                <motion.div
                  key={stage.day}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="group/stage relative grid gap-6 md:grid-cols-[70px_1fr] md:gap-8"
                >
                  {/* Cerchio Milestone del giorno */}
                  <div className="flex justify-start md:justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black/5 bg-white font-serif text-2xl text-[var(--color-ink)] shadow-md transition-all duration-500 hover:scale-110 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] z-10 cursor-pointer">
                      {stage.day}
                    </div>
                  </div>

                  {/* Card del giorno */}
                  <div className="rounded-2xl border border-black/5 bg-white/70 p-6 backdrop-blur-md transition-all duration-500 hover:bg-white/95 hover:shadow-[var(--shadow-premium)] md:p-8">
                    <h3 className="font-serif text-2.5xl text-[var(--color-ink)] transition-colors duration-300 group-hover/stage:text-[var(--color-accent)]">
                      {stage.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-black/60">
                      {stage.description}
                    </p>
                    {stage.sleep && (
                      <div className="mt-5 flex items-center gap-2 rounded-xl bg-[var(--color-sand)]/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)] w-fit border border-black/5">
                        <MapPin size={12} className="text-[var(--color-accent)]" />
                        <span>Dove dormire: {stage.sleep}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {itinerary.costs && itinerary.costs.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-8 text-3xl font-serif md:text-4xl">Quanto costa indicativamente</h2>
              <div className="overflow-hidden rounded-2xl border border-black/5 shadow-sm bg-white/70 backdrop-blur-md">
                <table className="w-full text-left">
                  <tbody>
                    {itinerary.costs.map((cost) => (
                      <tr key={cost.label} className="border-b border-black/5 last:border-b-0">
                        <td className="p-5 text-sm text-black/60 font-medium">{cost.label}</td>
                        <td className="p-5 text-right font-serif text-base text-[var(--color-accent-text)] bg-white/20">
                          {cost.range} EUR
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {(itinerary.bestFor || itinerary.notFor) && (
            <section className="mt-16 grid gap-6 md:grid-cols-2">
              {itinerary.bestFor && (
                <div className="rounded-2xl border border-[var(--color-accent)]/10 bg-white/70 backdrop-blur-md p-8 shadow-sm">
                  <h3 className="mb-6 flex items-center gap-2.5 font-serif text-2xl text-[var(--color-ink)]">
                    <CheckCircle2 className="text-[var(--color-accent)]" size={22} />
                    Pensato per
                  </h3>
                  <ul className="space-y-4">
                    {itinerary.bestFor.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed text-black/60"
                      >
                        <CheckCircle2
                          className="mt-1 shrink-0 text-[var(--color-accent)]"
                          size={16}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {itinerary.notFor && (
                <div className="rounded-2xl border border-white/5 bg-[var(--color-ink-deep)] p-8 text-white/90 shadow-[var(--shadow-premium)]">
                  <h3 className="mb-6 flex items-center gap-2.5 font-serif text-2xl text-white">
                    <XCircle className="text-[var(--color-accent)]" size={22} />
                    Non è per
                  </h3>
                  <ul className="space-y-4">
                    {itinerary.notFor.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed text-white/70"
                      >
                        <XCircle className="mt-1 shrink-0 text-[var(--color-accent)]" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {(itinerary.relatedArticleSlug || itinerary.relatedGuideSlug) && (
            <section className="mt-16">
              <h2 className="mb-6 text-3xl font-serif md:text-4xl">Contenuti collegati</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {itinerary.relatedArticleSlug && (
                  <Link
                    to={`/articolo/${itinerary.relatedArticleSlug}`}
                    className="group flex items-center justify-between gap-5 rounded-2xl border border-black/5 bg-white/70 backdrop-blur-md p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-accent)]/20 hover:bg-white/95 hover:shadow-[var(--shadow-premium)]"
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                        Approfondisci
                      </p>
                      <p className="mt-2 font-serif text-xl transition-colors duration-300 group-hover:text-[var(--color-accent-text)]">
                        Vai all&apos;articolo collegato
                      </p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-black/40 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                    />
                  </Link>
                )}
                {itinerary.relatedGuideSlug && (
                  <Link
                    to={`/guide/${itinerary.relatedGuideSlug}`}
                    className="group flex items-center justify-between gap-5 rounded-2xl border border-black/5 bg-white/70 backdrop-blur-md p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-accent)]/20 hover:bg-white/95 hover:shadow-[var(--shadow-premium)]"
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                        Approfondisci ancora
                      </p>
                      <p className="mt-2 font-serif text-xl transition-colors duration-300 group-hover:text-[var(--color-accent-text)]">
                        Acquista la guida completa
                      </p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-black/40 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                    />
                  </Link>
                )}
              </div>
            </section>
          )}

          <div className="mt-16">
            <Newsletter variant="article" source="itinerario_bottom" />
          </div>
        </div>
      </article>
    </PageLayout>
  );
}

function FactCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="group/fact rounded-2xl border border-black/5 bg-white/70 p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:bg-white/95 hover:shadow-[var(--shadow-premium)]">
      <div className="mb-4 flex items-center gap-2 text-[var(--color-accent-text)]">
        <span className="text-[var(--color-accent)] transition-transform duration-500 group-hover/fact:scale-110 group-hover/fact:rotate-12">
          {icon}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
          {label}
        </span>
      </div>
      <p className="font-serif text-lg leading-tight text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
