import { useState, useEffect } from 'react';
import AtlanteCanvas from './AtlanteCanvas';
import AtlanteHud from './AtlanteHud';
import AtlanteFallback from './AtlanteFallback';

export default function AtlanteExperience() {
  const [isMobile, setIsMobile] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const checkViewport = () => {
      const mobile = window.innerWidth < 1024;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsMobile(mobile || reducedMotion);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  if (isMobile) {
    return <AtlanteFallback />;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden select-none">
      <AtlanteCanvas
        activeIndex={activeIndex}
        onScroll={setScrollProgress}
        onActiveIndex={setActiveIndex}
      />
      <AtlanteHud active={activeIndex} scrollProgress={scrollProgress} />
    </div>
  );
}
