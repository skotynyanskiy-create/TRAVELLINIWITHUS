import { motion } from 'motion/react';
import { ArrowRight, Compass, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EXPERIENCE_VISUALS } from '../config/experienceVisuals';

interface CrossLinkWidgetProps {
  variant: 'to-esperienze' | 'to-destinazioni';
}

const experienceIcons = Object.values(EXPERIENCE_VISUALS).slice(0, 6);

export default function CrossLinkWidget({ variant }: CrossLinkWidgetProps) {
  const isToEsperienze = variant === 'to-esperienze';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-[2.5rem] bg-[var(--color-accent-soft)] p-10 md:p-14"
    >
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="mb-2 block font-script text-xl text-[var(--color-accent)]">
            Stessi contenuti, altra prospettiva
          </span>
          <h3 className="mb-4 text-3xl font-serif leading-tight text-[var(--color-ink)] md:text-4xl">
            {isToEsperienze
              ? 'Cerca per tipo di esperienza'
              : 'Cerca per destinazione'}
          </h3>
          <p className="mb-8 text-base font-normal leading-relaxed text-black/70">
            {isToEsperienze
              ? 'Lo stesso archivio visto dal lato delle esperienze: food, posti particolari, weekend romantici e molto altro.'
              : 'Lo stesso archivio organizzato per luogo: Italia, Europa e oltre. Filtra per regione, città o continente.'}
          </p>
          <Link
            to={isToEsperienze ? '/esperienze' : '/destinazioni'}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[var(--color-ink)]/85 hover:-translate-y-0.5"
          >
            {isToEsperienze ? 'Esplora per esperienza' : 'Esplora per destinazione'}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="relative hidden h-48 lg:block">
          {isToEsperienze ? (
            experienceIcons.map((visual, idx) => {
              const Icon = visual.icon;
              const positions = [
                'top-0 left-8',
                'top-4 left-40',
                'top-2 right-12',
                'bottom-4 left-16',
                'bottom-0 left-52',
                'bottom-6 right-8',
              ];
              const rotations = [-8, 5, -3, 6, -5, 4];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={`absolute ${positions[idx]}`}
                  style={{ transform: `rotate(${rotations[idx]}deg)` }}
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
                    style={{ backgroundColor: visual.colorLight, color: visual.color }}
                  >
                    <Icon size={28} />
                  </div>
                </motion.div>
              );
            })
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg text-[var(--color-accent)]">
                  <Compass size={48} strokeWidth={1.2} />
                </div>
              </motion.div>
              {[
                { top: '0', left: '20%', delay: 0.1 },
                { top: '10%', right: '15%', delay: 0.2 },
                { bottom: '0', left: '30%', delay: 0.15 },
                { bottom: '10%', right: '25%', delay: 0.25 },
              ].map((pos, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: pos.delay }}
                  className="absolute"
                  style={pos}
                >
                  <MapPin size={20} className="text-[var(--color-accent)] opacity-40" />
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
