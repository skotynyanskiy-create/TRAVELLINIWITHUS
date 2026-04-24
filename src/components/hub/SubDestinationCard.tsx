import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
import type { SubDestination } from '../../config/destinationHubs';

interface SubDestinationCardProps {
  destination: SubDestination;
}

export default function SubDestinationCard({ destination }: SubDestinationCardProps) {
  return (
    <Link
      to={destination.href}
      className="group block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <OptimizedImage
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {destination.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-text shadow-sm backdrop-blur-sm">
            <Sparkles size={11} />
            In evidenza
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-serif leading-tight text-ink transition-colors group-hover:text-accent-text md:text-2xl">
          {destination.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-black/62">{destination.tagline}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-accent-text transition-colors group-hover:text-accent">
          Esplora
          <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
