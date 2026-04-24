import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  brand: string;
  photo?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  title?: string;
  eyebrow?: string;
}

export default function Testimonials({
  testimonials,
  title = 'Cosa dicono i brand che hanno lavorato con noi',
  eyebrow = 'Voci dirette',
}: TestimonialsProps) {
  if (!testimonials.length) return null;

  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-[68rem] px-6 md:px-10">
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

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <motion.figure
              key={`${item.brand}-${idx}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col rounded-3xl border border-black/5 bg-white p-8 shadow-sm"
            >
              <Quote size={28} className="mb-5 text-accent" />
              <blockquote className="flex-1 text-base leading-relaxed text-ink">
                {item.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 border-t border-black/5 pt-6">
                {item.photo ? (
                  <img
                    src={item.photo}
                    alt={item.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft font-serif text-lg text-accent-text">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-ink">{item.name}</div>
                  <div className="text-[11px] uppercase tracking-widest text-black/45">
                    {item.role} — {item.brand}
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
