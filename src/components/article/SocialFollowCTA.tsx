import { ArrowRight, Instagram } from 'lucide-react';
import { CONTACTS } from '../../config/site';

function TikTokMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1-.09z" />
    </svg>
  );
}

export default function SocialFollowCTA() {
  return (
    <div className="mt-16 rounded-[2rem] border border-black/5 bg-[var(--color-sand)] p-8 md:p-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.95fr)] lg:items-end">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Continua fuori dall articolo
          </div>
          <h3 className="mt-4 text-3xl font-serif leading-tight text-[var(--color-ink)] md:text-4xl">
            Il sito mette ordine. I social mostrano il ritmo reale del progetto.
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/66">
            Su Instagram trovi posti da salvare e backstage piu curati. Su TikTok vedi il lato piu rapido, immediato e quotidiano delle scoperte.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={CONTACTS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-[1.6rem] border border-black/5 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <Instagram size={18} />
            </div>
            <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-black/42">
              Instagram
            </div>
            <div className="mt-2 text-xl font-serif text-[var(--color-ink)]">
              Salvataggi e luoghi da riaprire.
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-all group-hover:gap-3 group-hover:text-[var(--color-accent-warm)]">
              Apri Instagram
              <ArrowRight size={12} />
            </div>
          </a>

          <a
            href={CONTACTS.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-[1.6rem] border border-black/5 bg-[var(--color-ink)] p-5 text-white transition-all hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white">
              <TikTokMark />
            </div>
            <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              TikTok
            </div>
            <div className="mt-2 text-xl font-serif text-white">
              Il taglio piu veloce delle scoperte.
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/88 transition-all group-hover:gap-3 group-hover:text-white">
              Apri TikTok
              <ArrowRight size={12} />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
