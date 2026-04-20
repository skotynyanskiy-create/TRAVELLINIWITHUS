import { ShieldCheck } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import OptimizedImage from '../OptimizedImage';

const TRUST_STRIP = [
  'Luoghi vissuti o verificati',
  "Dettagli pratici prima dell'ispirazione",
  'Filtri pensati per decidere',
  'Nessun contenuto spacciato per proof',
];

interface DestinationHeroProps {
  activeGroupImage: string;
}

export default function DestinationHero({ activeGroupImage }: DestinationHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-ink)] pb-16 pt-32 text-white md:pb-20 md:pt-40">
      <div className="absolute inset-0">
        <OptimizedImage
          src={activeGroupImage}
          alt=""
          aria-hidden="true"
          priority
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <Breadcrumbs
          items={[{ label: 'Destinazioni' }]}
          className="[&_a]:text-white/70 [&_span]:text-white/45 [&_svg]:text-white/35"
        />
        <div className="mt-10 max-w-4xl">
          <span className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/75 backdrop-blur">
            Archivio discovery
          </span>
          <h1 className="text-5xl font-serif font-medium leading-[0.95] md:text-7xl lg:text-8xl">
            Trova posti particolari
            <span className="block italic text-white/62">da salvare e vivere davvero</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/82 md:text-xl">
            Parti da un luogo, da uno stile di viaggio o da un vincolo pratico. Ogni scheda deve
            aiutarti a capire se quel posto merita davvero spazio nei tuoi piani.
          </p>
        </div>

        <div className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_STRIP.map((item) => (
            <div key={item} className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
              <ShieldCheck size={16} className="mb-3 text-[var(--color-accent)]" />
              <p className="text-xs font-semibold leading-relaxed text-white/75">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
