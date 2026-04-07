import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthorBio() {
  return (
    <div className="mt-16 pt-12 border-t border-black/10">
      <div className="bg-[var(--color-sand)] p-8 md:p-12 rounded-3xl flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Avatar coppia */}
        <div className="shrink-0 flex -space-x-4">
          <div className="w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold uppercase tracking-widest border-4 border-[var(--color-sand)] shadow-sm">R</div>
          <div className="w-20 h-20 rounded-full bg-ink text-white flex items-center justify-center text-sm font-bold uppercase tracking-widest border-4 border-[var(--color-sand)] shadow-sm">B</div>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h4 className="text-xl font-serif">Gaetano Rodrigo & Betta</h4>
            <span className="text-[10px] uppercase tracking-widest font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">Travel Couple</span>
          </div>
          <p className="text-black/65 font-light text-sm mb-5 leading-relaxed">
            Siamo una coppia che viaggia insieme da 10 anni. Raccontiamo posti particolari, food experience e itinerari reali — con budget accessibile e senza filtri. Tutto quello che trovate qui lo abbiamo vissuto davvero.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.instagram.com/travelliniwithus/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity"
            >
              <Instagram size={14} />
              @travelliniwithus
            </a>
            <a
              href="https://www.tiktok.com/@travelliniwithus"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-colors"
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.53V6.78a4.85 4.85 0 0 1-1.02-.09z"/></svg>
              @travelliniwithus
            </a>
            <Link to="/chi-siamo" className="inline-flex items-center gap-2 px-5 py-2.5 border border-black/15 text-black text-xs font-bold uppercase tracking-widest rounded-full hover:border-accent hover:text-accent transition-colors">
              Chi siamo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
