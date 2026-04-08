import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND_COPY, CONTACTS } from '../../config/site';

export default function AuthorBio() {
  return (
    <div className="mt-16 border-t border-black/10 pt-12">
      <div className="flex flex-col items-center gap-8 rounded-3xl bg-[var(--color-sand)] p-8 md:flex-row md:items-start md:p-12">
        <div className="flex shrink-0 -space-x-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--color-sand)] bg-accent text-sm font-bold uppercase tracking-widest text-white shadow-sm">
            R
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--color-sand)] bg-ink text-sm font-bold uppercase tracking-widest text-white shadow-sm">
            B
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h4 className="text-xl font-serif">Gaetano Rodrigo & Betta</h4>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
              Travel Couple
            </span>
          </div>
          <p className="mb-5 text-sm font-light leading-relaxed text-black/65">
            {BRAND_COPY.bio} Tutto quello che trovate qui lo abbiamo vissuto davvero.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={CONTACTS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              <Instagram size={14} />
              {CONTACTS.instagramHandle}
            </a>
            <a
              href={CONTACTS.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-zinc-800"
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.53V6.78a4.85 4.85 0 0 1-1.02-.09z" />
              </svg>
              {CONTACTS.tiktokHandle}
            </a>
            <Link
              to="/chi-siamo"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:border-accent hover:text-accent"
            >
              Chi siamo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
