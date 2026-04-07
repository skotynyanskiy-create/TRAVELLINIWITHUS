import { Instagram, ArrowRight } from 'lucide-react';

export default function SocialFollowCTA() {
  return (
    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <a
        href="https://www.instagram.com/travelliniwithus/"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] text-white flex items-center gap-6 hover:scale-[1.02] transition-transform duration-300"
      >
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
          <Instagram size={28} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/70 mb-1">167K+ persone ci seguono</p>
          <p className="text-lg font-serif leading-tight">Seguici su Instagram</p>
          <p className="text-sm font-light text-white/80 mt-1">@travelliniwithus</p>
        </div>
        <ArrowRight size={20} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </a>

      <a
        href="https://www.tiktok.com/@travelliniwithus"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative overflow-hidden rounded-3xl p-8 bg-black text-white flex items-center gap-6 hover:scale-[1.02] transition-transform duration-300"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#1C1C1C] flex items-center justify-center shrink-0">
          <svg width={28} height={28} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.53V6.78a4.85 4.85 0 0 1-1.02-.09z"/></svg>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/50 mb-1">90.000 Travellini su TikTok</p>
          <p className="text-lg font-serif leading-tight">Guardaci su TikTok</p>
          <p className="text-sm font-normal text-white/80 mt-1">@travelliniwithus</p>
        </div>
        <ArrowRight size={20} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </a>
    </div>
  );
}
