import { motion } from 'motion/react';
import { ShieldCheck, Award, BadgeCheck, Newspaper } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';

/**
 * Credenziali verificabili e trasparenza — bonifica 2026-07-24.
 * La versione precedente mostrava 4 citazioni attribuite a testate nazionali
 * (TGCOM24, Vanity Fair, Repubblica, Radio 105) senza alcuna fonte
 * verificabile, marchiate "Verificato": rimosse per integrità (rischio
 * reputazionale e legale). Se in futuro esistono uscite stampa reali, tornano
 * qui SOLO con URL verificabile per ciascuna.
 */
export default function PressProofSection() {
  const credentials = [
    {
      title: 'Iscritti Registro AGCOM',
      description: 'Elenco ufficiale Creator & Influencer AGCOM (Delibera 17/24/CONS).',
      icon: ShieldCheck,
    },
    {
      title: 'Profilo verificato Meta',
      description: 'Identità verificata sul canale principale @travelliniwithus.',
      icon: BadgeCheck,
    },
    {
      title: 'Trasparenza pubblicitaria',
      description:
        'Ogni contenuto in collaborazione dichiara la sua natura (ADV, invito, gifted, affiliazione) secondo le linee guida AGCOM sulla trasparenza.',
      icon: Award,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[var(--color-ink-deep)] py-20 text-white">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-on-dark)]">
            <Newspaper size={13} />
            Credenziali &amp; Trasparenza
          </span>
          <h2 className="mt-4 font-serif text-3xl font-normal leading-tight md:text-4xl lg:text-5xl">
            Quello che puoi verificare, prima di scriverci
          </h2>
          <p className="mt-4 text-base text-white/75 md:text-lg">
            Niente rassegne stampa di vetrina: solo credenziali pubbliche controllabili e la regola
            che ogni collaborazione viene dichiarata.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {credentials.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent)]/15 text-[var(--color-accent-on-dark)] transition-transform duration-300 group-hover:scale-110">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 font-serif text-lg font-medium text-white">{badge.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70">{badge.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between rounded-3xl border border-[var(--color-accent)]/30 bg-white/5 p-8 text-center md:flex-row md:text-left">
          <div>
            <h4 className="font-serif text-xl font-medium text-white">
              Vuoi il media kit con i formati e il nostro modo di lavorare?
            </h4>
            <p className="mt-1 text-xs text-white/70">
              I numeri li vediamo insieme in call, dai dati nativi delle piattaforme.
            </p>
          </div>
          <Link
            to="/media-kit"
            className="mt-4 md:mt-0 shrink-0 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-[var(--color-accent-hover)] hover:scale-105"
          >
            Richiedi il Media Kit
          </Link>
        </div>
      </div>
    </section>
  );
}
