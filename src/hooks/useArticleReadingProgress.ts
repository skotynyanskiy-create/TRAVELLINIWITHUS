import { useEffect, useMemo, useState } from 'react';
import type { TocItem } from '../components/article';

interface ArticleReadingProgress {
  activeId: string | null;
  progress: number;
}

export function useArticleReadingProgress(items: TocItem[]): ArticleReadingProgress {
  const sectionIds = useMemo(
    () => items.filter((item) => item.show).map((item) => item.id),
    [items]
  );
  const [state, setState] = useState<ArticleReadingProgress>({
    activeId: sectionIds[0] ?? null,
    progress: 0,
  });

  // Senza sezioni si azzera durante il render, non in effect: evita il
  // pattern setState-in-effect (react-hooks/set-state-in-effect).
  if (sectionIds.length === 0 && (state.activeId !== null || state.progress !== 0)) {
    setState({ activeId: null, progress: 0 });
  }

  useEffect(() => {
    if (typeof window === 'undefined' || sectionIds.length === 0) {
      return;
    }

    let frame = 0;

    const compute = () => {
      frame = 0;

      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null);

      if (sections.length === 0) {
        setState({ activeId: null, progress: 0 });
        return;
      }

      const scrollY = window.scrollY;
      const viewportAnchor = scrollY + Math.min(220, window.innerHeight * 0.3);
      const firstTop = sections[0].getBoundingClientRect().top + scrollY;
      const last = sections[sections.length - 1];
      const lastBottom = last.getBoundingClientRect().bottom + scrollY;
      const total = Math.max(1, lastBottom - firstTop - window.innerHeight * 0.35);

      let activeId = sections[0].id;
      for (const section of sections) {
        const top = section.getBoundingClientRect().top + scrollY;
        if (top <= viewportAnchor) activeId = section.id;
      }

      const progress = Math.min(1, Math.max(0, (viewportAnchor - firstTop) / total));
      setState((current) =>
        current.activeId === activeId && Math.abs(current.progress - progress) < 0.005
          ? current
          : { activeId, progress }
      );
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(compute);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [sectionIds]);

  return state;
}
