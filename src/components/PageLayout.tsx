import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="bg-[var(--color-sand)] min-h-screen">
      <main className="pt-32 md:pt-24 pb-32">
        {children}
      </main>
    </div>
  );
}
