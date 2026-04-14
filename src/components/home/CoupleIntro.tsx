import { motion } from 'motion/react';
import { ArrowRight, BadgeCheck, Camera, MapPinned } from 'lucide-react';
import { Link } from 'react-router-dom';

const COUPLE_IMG =
  'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=800&auto=format&fit=crop&q=80';

const METHOD_STANDARDS = [
  {
    icon: MapPinned,
    title: 'Provato sul posto',
    text: 'Atmosfera, zona, logistica e tempi filtrati da chi c e stato davvero.',
  },
  {
    icon: Camera,
    title: 'Immagini e dettagli reali',
    text: 'Foto e note utili per capire cosa aspettarti, non per venderti un sogno generico.',
  },
  {
    icon: BadgeCheck,
    title: 'Consigli che aiutano a decidere',
    text: 'Non liste infinite, ma informazioni abbastanza chiare da farti scegliere meglio.',
  },
];

export default function CoupleIntro() {
  return (
    <section className="bg-[var(--color-sand)] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:col-span-5"
          >
            <div className="aspect-[3/2] overflow-hidden rounded-lg lg:aspect-[4/5]">
              <img
                src={COUPLE_IMG}
                alt="Rodrigo e Betta - Travelliniwithus"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute bottom-4 left-4 rounded-lg border border-[var(--color-gold)]/20 bg-white/90 px-4 py-3 backdrop-blur-sm"
            >
              <div className="font-script text-xl text-[var(--color-accent)]">Rodrigo & Betta</div>
              <div className="text-[10px] uppercase tracking-widest text-black/50">
                Il metodo Travelliniwithus
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Il metodo
            </span>
            <h2 className="mt-3 max-w-2xl text-3xl font-serif leading-tight text-ink md:text-5xl">
              Andiamo, proviamo, raccontiamo.
              <span className="text-[var(--color-accent-warm)]"> Solo dopo consigliamo.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-black/65 md:text-lg">
              Travelliniwithus non nasce per mostrare piu posti possibile. Nasce per selezionare quelli
              che meritano davvero, con un racconto abbastanza concreto da aiutarti a decidere.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/65 md:text-lg">
              Rodrigo e Betta tengono insieme sguardo personale, immagini, ricerca e dettagli pratici:
              e questo che rende il progetto utile sia per chi legge sia per i partner giusti.
            </p>

            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {METHOD_STANDARDS.map((standard) => {
                const Icon = standard.icon;

                return (
                  <div key={standard.title} className="rounded-lg border border-black/8 bg-white/70 p-4">
                    <Icon size={18} className="text-[var(--color-accent-warm)]" />
                    <h3 className="mt-3 text-sm font-bold text-ink">{standard.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-black/55">{standard.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 border-t border-black/8 pt-6">
              <p className="max-w-2xl text-xs font-bold uppercase tracking-[0.22em] text-black/45">
                Meno rumore, piu criterio. Meno lista, piu esperienza vera.
              </p>
            </div>

            <Link
              to="/chi-siamo"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ink transition-colors hover:text-[var(--color-accent-warm)]"
            >
              Come lavoriamo davvero <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
