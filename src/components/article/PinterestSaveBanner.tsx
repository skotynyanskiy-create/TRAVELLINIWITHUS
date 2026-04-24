import PinterestIcon from './PinterestIcon';

interface PinterestSaveBannerProps {
  articleUrl: string;
  articleTitle: string;
  articleDescription: string;
  articleImage: string;
}

export default function PinterestSaveBanner({
  articleUrl,
  articleTitle,
  articleDescription,
  articleImage,
}: PinterestSaveBannerProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : articleUrl;
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(articleImage)}&description=${encodeURIComponent(`${articleTitle} — ${articleDescription}`)}`;

  return (
    <div className="my-12 flex flex-col items-center gap-5 rounded-[2rem] border border-[var(--color-accent)]/15 bg-[var(--color-accent-soft)] p-8 text-center md:flex-row md:gap-8 md:p-10 md:text-left">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
        <PinterestIcon size={24} className="text-[var(--color-social-pinterest)]" />
      </div>

      <div className="flex-1">
        <p className="text-lg font-serif leading-snug text-[var(--color-ink)] md:text-xl">
          Non hai tempo di leggere ora?
        </p>
        <p className="mt-1 text-sm text-black/55">
          Salvalo su Pinterest e ritrovalo quando stai pianificando il prossimo viaggio.
        </p>
      </div>

      <a
        href={pinterestUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--color-social-pinterest)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110 active:scale-[0.98]"
      >
        <PinterestIcon size={16} />
        Salva su Pinterest
      </a>
    </div>
  );
}
