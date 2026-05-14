import { motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
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

      <article className="mx-4 my-8 overflow-hidden rounded-[2.5rem] border border-black/5 bg-white pb-24 shadow-xl shadow-black/5 md:mx-8 lg:mx-12">
        <div className="relative aspect-[5/3] w-full overflow-hidden md:aspect-[16/7]">
          <OptimizedImage
            src={itinerary.image}
            alt={itinerary.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white md:p-12">
            <span className="rounded-full bg-white/15 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] backdrop-blur-md">
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
              message="Questo itinerario e una preview controllata: mostra struttura, ritmo e livello finale. Sara aggiornato con dati e foto reali prima della pubblicazione."
            />
          )}

          <div className="mt-10 rounded-[2rem] border border-[var(--color-accent)]/15 bg-[var(--color-accent-soft)] p-8 md:p-10">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              In breve
            </p>
            <p className="text-xl font-serif leading-relaxed text-[var(--color-ink)] md:text-2xl">
              {itinerary.excerpt}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] border border-black/5 bg-black/5 md:grid-cols-4">
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
                Perche salvarlo
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {itinerary.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-3 rounded-2xl bg-[var(--color-sand)] p-5"
                  >
                    <CheckCircle2 className="mt-1 shrink-0 text-[var(--color-accent)]" size={18} />
                    <p className="text-sm leading-relaxed text-black/68">{highlight}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-16">
            <h2 className="mb-8 text-3xl font-serif md:text-4xl">Itinerario giorno per giorno</h2>
            <div className="space-y-5">
              {itinerary.stages.map((stage) => (
                <motion.div
                  key={stage.day}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="grid gap-5 rounded-[2rem] border border-black/5 bg-[var(--color-sand)] p-6 md:grid-cols-[80px_1fr] md:p-8"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-ink)] font-serif text-2xl text-white">
                    {stage.day}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl">{stage.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-black/70">
                      {stage.description}
                    </p>
                    {stage.sleep && (
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                        Dove dormire: {stage.sleep}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {itinerary.costs && itinerary.costs.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-8 text-3xl font-serif md:text-4xl">Quanto costa indicativamente</h2>
              <div className="overflow-hidden rounded-2xl border border-black/5">
                <table className="w-full text-left">
                  <tbody>
                    {itinerary.costs.map((cost) => (
                      <tr key={cost.label} className="border-b border-black/5 last:border-b-0">
                        <td className="bg-white p-5 text-sm text-black/70">{cost.label}</td>
                        <td className="bg-[var(--color-sand)] p-5 text-right font-serif text-base text-[var(--color-ink)]">
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
                <div className="rounded-[2rem] bg-[var(--color-sand)] p-7">
                  <h3 className="mb-5 flex items-center gap-2 font-serif text-2xl">
                    <CheckCircle2 className="text-[var(--color-accent)]" size={20} />
                    Pensato per
                  </h3>
                  <ul className="space-y-3">
                    {itinerary.bestFor.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-black/68">
                        <CheckCircle2
                          className="mt-1 shrink-0 text-[var(--color-accent)]"
                          size={16}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {itinerary.notFor && (
                <div className="rounded-[2rem] bg-[var(--color-ink)] p-7 text-white">
                  <h3 className="mb-5 flex items-center gap-2 font-serif text-2xl">
                    <XCircle className="text-[var(--color-accent)]" size={20} />
                    Non e per
                  </h3>
                  <ul className="space-y-3">
                    {itinerary.notFor.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/70">
                        <XCircle className="mt-1 shrink-0 text-[var(--color-accent)]" size={16} />
                        {item}
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
                    className="group flex items-center justify-between gap-5 rounded-2xl border border-black/5 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)]"
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                        Approfondisci
                      </p>
                      <p className="mt-2 font-serif text-xl group-hover:text-[var(--color-accent-text)]">
                        Vai all articolo collegato
                      </p>
                    </div>
                    <ArrowRight size={18} className="text-black/40" />
                  </Link>
                )}
                {itinerary.relatedGuideSlug && (
                  <Link
                    to={`/guide/${itinerary.relatedGuideSlug}`}
                    className="group flex items-center justify-between gap-5 rounded-2xl border border-black/5 bg-[var(--color-accent-soft)] p-6 transition-all hover:-translate-y-0.5"
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                        Approfondisci ancora
                      </p>
                      <p className="mt-2 font-serif text-xl group-hover:text-[var(--color-accent-text)]">
                        Acquista la guida completa
                      </p>
                    </div>
                    <ArrowRight size={18} className="text-black/40" />
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
    <div className="bg-white p-6">
      <div className="mb-4 flex items-center gap-2 text-[var(--color-accent-text)]">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/40">
          {label}
        </span>
      </div>
      <p className="font-serif text-lg leading-tight text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
