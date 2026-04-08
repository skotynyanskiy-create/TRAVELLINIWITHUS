import { ArrowRight, Instagram } from 'lucide-react';
import { BRAND_STATS, CONTACTS } from '../../config/site';

export default function SocialFollowCTA() {
  return (
    <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <a
        href={CONTACTS.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] p-8 text-white transition-transform duration-300 hover:scale-[1.02]"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
          <Instagram size={28} />
        </div>
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
            {BRAND_STATS.instagramFollowers} persone ci seguono
          </p>
          <p className="text-lg font-serif leading-tight">Seguici su Instagram</p>
          <p className="mt-1 text-sm font-light text-white/80">{CONTACTS.instagramHandle}</p>
        </div>
        <ArrowRight
          size={20}
          className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100"
        />
      </a>

      <a
        href={CONTACTS.tiktokUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-6 overflow-hidden rounded-3xl bg-black p-8 text-white transition-transform duration-300 hover:scale-[1.02]"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1C1C1C]">
          <svg width={28} height={28} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.53V6.78a4.85 4.85 0 0 1-1.02-.09z" />
          </svg>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
            {BRAND_STATS.tiktokFollowers} seguono il progetto
          </p>
          <p className="text-lg font-serif leading-tight">Guardaci su TikTok</p>
          <p className="mt-1 text-sm font-normal text-white/80">{CONTACTS.tiktokHandle}</p>
        </div>
        <ArrowRight
          size={20}
          className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100"
        />
      </a>
    </div>
  );
}
