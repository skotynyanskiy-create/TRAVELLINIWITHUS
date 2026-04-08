import { Instagram, Sparkles, Video } from 'lucide-react';
import type { HomeContent } from '../../config/siteContent';

const icons = [Instagram, Video, Sparkles];

interface CommunitySectionProps {
  content: HomeContent['project'];
}

export default function CommunitySection({ content }: CommunitySectionProps) {
  return (
    <section className="bg-[var(--color-sand)] py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-4 px-6 md:grid-cols-3 md:px-8">
        {content.creatorBenefits.map((item, index) => {
          const Icon = icons[index] ?? Sparkles;
          return (
            <div
              key={item.title}
              className="rounded-[1.8rem] border border-black/5 bg-white px-6 py-6 shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-sand)] text-[var(--color-accent)]">
                <Icon size={18} />
              </div>
              <h3 className="text-xl font-serif text-[var(--color-ink)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/62">{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
