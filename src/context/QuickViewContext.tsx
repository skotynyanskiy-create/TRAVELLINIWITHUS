import React, { createContext, useContext, useState } from 'react';
import type { ContentItem } from '../types/content';

interface QuickViewContextType {
  item: ContentItem | null;
  open: (item: ContentItem) => void;
  close: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = useState<ContentItem | null>(null);

  const open = (next: ContentItem) => setItem(next);
  const close = () => setItem(null);

  return (
    <QuickViewContext.Provider value={{ item, open, close }}>{children}</QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (context === undefined) {
    throw new Error('useQuickView must be used within a QuickViewProvider');
  }
  return context;
}
