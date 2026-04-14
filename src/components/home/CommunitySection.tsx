import { ArrowRight, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACTS, BRAND_STATS } from '../../config/site';

export default function CommunitySection() {
  return (
    <section className="bg-[var(--color-ink)] py-12">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-gold)]">
              Collaborazioni
            </span>
            <h2 className="mt-2 max-w-2xl text-3xl font-serif text-white md:text-4xl">
              Hai un hotel, una destinazione o un'esperienza da raccontare bene?
            </h2>
          </div>
          <Link
            to="/collaborazioni"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-gold)]/40 px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)] hover:text-white"
          >
            Scopri le collaborazioni
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <span className="font-script text-xl text-[var(--color-gold)]">Seguici</span>
            <p className="mt-1 max-w-sm text-base text-white/75">
              {BRAND_STATS.instagramFollowers} su Instagram · {BRAND_STATS.tiktokFollowers} su
              TikTok. Ogni giorno contenuti veri.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:justify-end">
            <a
              href={CONTACTS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,var(--color-social-instagram-start),var(--color-social-instagram-mid),var(--color-social-instagram-end))] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              <Instagram size={14} /> Instagram
            </a>
            <a
              href={CONTACTS.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1-.09z" />
              </svg>
              TikTok
            </a>
            <Link
              to="/guide"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(196,164,124,0.25)] transition-all hover:-translate-y-0.5 hover:brightness-110"
            >
              Leggi le guide
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
