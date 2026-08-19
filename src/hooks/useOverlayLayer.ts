import { useEffect, useId, useState } from 'react';

const activeLayerIds: string[] = [];
const listeners = new Set<() => void>();
let previousBodyOverflow: string | null = null;

function getTopLayerId() {
  return activeLayerIds[activeLayerIds.length - 1] ?? null;
}

function notifyLayerChange() {
  listeners.forEach((listener) => listener());
}

function lockScroll() {
  if (typeof document === 'undefined' || activeLayerIds.length !== 1) return;
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
}

function releaseScroll() {
  if (typeof document === 'undefined' || activeLayerIds.length !== 0) return;
  document.body.style.overflow = previousBodyOverflow ?? '';
  previousBodyOverflow = null;
}

/** True when an app overlay currently owns the document interaction layer. */
export function hasActiveOverlayLayer() {
  if (activeLayerIds.length > 0) return true;
  if (typeof document === 'undefined') return false;

  // Some older dialogs (for example consent) do not need scroll locking, but
  // must still prevent exit intent from opening a competing modal above them.
  return document.querySelector('[role="dialog"], [aria-modal="true"]') !== null;
}

/**
 * Registers an overlay in a small shared stack. Only the top layer should
 * receive keyboard interaction; the stack also reference-counts body scroll
 * locking so that closing one overlay cannot unlock another still on screen.
 */
export function useOverlayLayer(active: boolean) {
  const id = useId();
  const [topLayerId, setTopLayerId] = useState(getTopLayerId);

  useEffect(() => {
    const onLayerChange = () => setTopLayerId(getTopLayerId());
    listeners.add(onLayerChange);
    onLayerChange();
    return () => {
      listeners.delete(onLayerChange);
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    activeLayerIds.push(id);
    lockScroll();
    notifyLayerChange();

    return () => {
      const index = activeLayerIds.lastIndexOf(id);
      if (index !== -1) activeLayerIds.splice(index, 1);
      releaseScroll();
      notifyLayerChange();
    };
  }, [active, id]);

  return active && topLayerId === id;
}
