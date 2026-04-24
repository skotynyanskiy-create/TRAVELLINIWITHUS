import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  brand: string;
  project: string;
  objective: string;
  approach: string;
  metrics: CaseStudyMetric[];
  image?: string;
  href?: string;
}

interface CaseStudiesProps {
  cases: CaseStudy[];
  title?: string;
  eyebrow?: string;
}

export default function CaseStudies({
  cases,
  title = 'Progetti firmati con cura',
  eyebrow = 'Case study',
}: CaseStudiesProps) {
  if (!cases.length) return null;

  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-[72rem] px-6 md:px-10">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
            {eyebrow}
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-serif leading-tight text-ink md:text-5xl">
            {title}
          </h2>
        </motion.div>

        <div className="space-y-12">
          {cases.map((item, idx) => {
            const reverse = idx % 2 === 1;
            return (
              <motion.article
                key={`${item.brand}-${idx}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-8 rounded-[2.5rem] border border-black/5 bg-white p-6 shadow-sm md:grid-cols-[1.1fr_1fr] md:p-10"
              >
                {item.image && (
                  <div
                    className={`overflow-hidden rounded-[2rem] bg-sand ${
                      reverse ? 'md:order-2' : ''
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.project}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className={reverse ? 'md:order-1' : ''}>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent-text">
                    {item.brand}
                  </span>
                  <h3 className="mt-3 text-2xl font-serif leading-tight text-ink md:text-3xl">
                    {item.project}
                  </h3>

                  <dl className="mt-6 space-y-4 text-sm leading-relaxed text-black/68">
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-widest text-black/45">
                        Obiettivo
                      </dt>
                      <dd className="mt-1">{item.objective}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-widest text-black/45">
                        Come lo abbiamo affrontato
                      </dt>
                      <dd className="mt-1">{item.approach}</dd>
                    </div>
                  </dl>

                  {item.metrics.length > 0 && (
                    <div className="mt-6 grid gap-3 border-t border-black/5 pt-6 sm:grid-cols-3">
                      {item.metrics.map((metric) => (
                        <div key={metric.label}>
                          <div className="font-serif text-2xl text-ink">{metric.value}</div>
                          <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-black/45">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.href && (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-text transition-colors hover:text-accent"
                    >
                      Vedi il progetto
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
