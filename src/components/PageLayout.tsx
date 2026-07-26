import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--color-sand)]">
      <div className="pt-32 md:pt-24 pb-32">{children}</div>
    </div>
  );
}
