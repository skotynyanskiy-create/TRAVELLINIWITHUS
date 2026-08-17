import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--color-sand)]">
      {/* La testata a filo con fascia (2026-08-17) e' alta 101px a riposo
          (mobile) / 97px (desktop), contro i 74-85px della pillola che
          sostituisce: pt-28 (112px) riserva lo spazio a ogni larghezza senza
          gradini per breakpoint (DESIGN_navbar-premium §4). */}
      <div className="pt-28 pb-32">{children}</div>
    </div>
  );
}
