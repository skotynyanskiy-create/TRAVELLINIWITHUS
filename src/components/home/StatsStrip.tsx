import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Instagram, Music, TrendingUp, MapPin, type LucideIcon } from 'lucide-react';
import { BRAND_STATS } from '../../config/site';

function useAnimatedCounter(target: string, inView: boolean) {
  const [count, setCount] = useState(0);
  const numericTarget = parseInt(target.replace(/[^\d]/g, ''), 10) || 0;

  useEffect(() => {
    if (!inView || numericTarget === 0) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(numericTarget / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, numericTarget]);

  const suffix = target.replace(/[\d.,]/g, '');
  return inView ? `${count.toLocaleString('it-IT')}${suffix}` : '0';
}

function AnimatedStat({ value, label, icon: Icon }: { value: string; label: string; icon: LucideIcon }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const display = useAnimatedCounter(value, inView);

  return (
    <div ref={ref} className="flex items-center justify-center gap-3 px-6 py-6 text-center">
      <Icon size={16} className="text-[var(--color-gold)]/60" />
      <div className="text-2xl font-serif text-[var(--color-gold)] md:text-3xl">{display}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-white/80">{label}</div>
    </div>
  );
}

export default function StatsStrip() {
  return (
    <div className="rounded-2xl bg-[var(--color-ink)]/95 backdrop-blur-xl border border-white/10 border-t-2 border-t-[var(--color-gold)]/30 py-6 px-6 shadow-2xl text-white">
      <div className="flex flex-wrap items-center justify-center divide-x divide-white/10 gap-4">
        <AnimatedStat value={BRAND_STATS.instagramFollowers} label="Instagram" icon={Instagram} />
        <AnimatedStat value={BRAND_STATS.tiktokFollowers} label="TikTok" icon={Music} />
        <AnimatedStat value={BRAND_STATS.engagementRate} label="Engagement" icon={TrendingUp} />
        <AnimatedStat value={BRAND_STATS.destinationsExplored} label="Destinazioni" icon={MapPin} />
      </div>
    </div>
  );
}
