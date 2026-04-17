import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Compass, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EXPERIENCE_VISUALS } from '../config/experienceVisuals';

interface CrossLinkWidgetProps {
  variant: 'to-esperienze' | 'to-destinazioni' | 'to-guide';
}

const experienceIcons = Object.values(EXPERIENCE_VISUALS).slice(0, 6);

const guideCategories = [
  { label: 'Itinerari', color: '#6366F1', bg: '#EEF2FF' },
  { label: 'Cosa portare', color: '#059669', bg: '#ECFDF5' },
  { label: 'Budget', color: '#B45309', bg: '#FFFBEB' },
  { label: 'Food guide', color: '#DC2626', bg: '#FEF2F2' },
  { label: 'Dove dormire', color: '#7C3AED', bg: '#F5F3FF' },
  { label: 'Pianificazione', color: '#0891B2', bg: '#ECFEFF' },
];

export default function CrossLinkWidget({ variant }: CrossLinkWidgetProps) {
  const isToEsperienze = variant === 'to-esperienze';
  const isToGuide = variant === 'to-guide';

  const config = isToGuide
    ? {
        scriptAccent: 'trovi tutto qui',
        title: 'Leggi le guide di viaggio',
        description:
          'Itinerari completi, consigli pratici, packing list e food guide – tutto quello che ti serve prima di partire.',
        href: '/guide',
        cta: 'Leggi le guide',
        wrapClass: 'bg-[var(--color-ink)]',
        titleClass: 'text-white',
        scriptClass: 'text-[var(--color-accent)]',
        descClass: 'text-white/65',
        btnClass: 'bg-white text-[var(--color-ink)] hover:bg-[var(--color-accent-soft)]',
      }
    : isToEsperienze
      ? {
          scriptAccent: 'stessa prospettiva, altra porta',
          title: 'Cerca per tipo di esperienza',
          description:
            'Lo stesso archivio visto dal lato delle esperienze: food, posti particolari, weekend romantici e molto altro.',
          href: '/esperienze',
          cta: 'Esplora per esperienza',
          wrapClass: 'bg-[var(--color-accent-soft)]',
          titleClass: 'text-[var(--color-ink)]',
          scriptClass: 'text-[var(--color-accent)]',
          descClass: 'text-black/70',
          btnClass: 'bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink)]/85',
        }
      : {
          scriptAccent: 'stessa prospettiva, altra porta',
          title: 'Cerca per destinazione',
          description:
            'Lo stesso archivio organizzato per luogo: Italia, Europa e oltre. Filtra per regione, città o continente.',
          href: '/destinazioni',
          cta: 'Esplora per destinazione',
          wrapClass: 'bg-[var(--color-accent-soft)]',
          titleClass: 'text-[var(--color-ink)]',
          scriptClass: 'text-[var(--color-accent)]',
          descClass: 'text-black/70',
          btnClass: 'bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink)]/85',
        };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`rounded-[2.5rem] p-10 md:p-14 ${config.wrapClass}`}
    >
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <span className={`mb-2 block font-script text-xl ${config.scriptClass}`}>
            {config.scriptAccent}
          </span>
          <h3 className={`mb-4 text-3xl font-serif leading-tight md:text-4xl ${config.titleClass}`}>
            {config.title}
          </h3>
          <p className={`mb-8 text-base font-normal leading-relaxed ${config.descClass}`}>
            {config.description}
          </p>
          <Link
            to={config.href}
            className={`inline-flex items-center gap-2 rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all hover:-translate-y-0.5 ${config.btnClass}`}
          >
            {config.cta}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Illustrazione decorativa */}
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
          ) : isToGuide ? (
            /* Guide: book icon + scattered category pills */
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                  <BookOpen size={40} strokeWidth={1.2} className="text-white/80" />
                </div>
              </motion.div>
              {guideCategories.map((cat, idx) => {
                const positions = [
                  { top: '2%', left: '5%' },
                  { top: '0%', right: '5%' },
                  { top: '40%', left: '-5%' },
                  { top: '35%', right: '-2%' },
                  { bottom: '0%', left: '12%' },
                  { bottom: '2%', right: '8%' },
                ];
                const pos = positions[idx];
                return (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.09 }}
                    className="absolute"
                    style={pos}
                  >
                    <div
                      className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider shadow-md"
                      style={{ backgroundColor: cat.bg, color: cat.color }}
                    >
                      {cat.label}
                    </div>
                  </motion.div>
                );
              })}
            </>
          ) : (
            /* Destinazioni: compass + map pins */
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
