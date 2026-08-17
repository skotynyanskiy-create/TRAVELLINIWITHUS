import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--color-sand)]">
      {/* La testata torna a pillola galleggiante (2026-08-17): il commutatore
          sotto di lei (`EditionBand.tsx`) non è più fisso, quindi riserva da
          solo il proprio spazio nel flusso — incluso quello della pillola,
          nel proprio `pt-`. Qui non serve più nessuna riserva verticale. */}
      <div className="pb-32">{children}</div>
    </div>
  );
}
