import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  'summary',
  'audio[controls]',
  'video[controls]',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => {
      const style = window.getComputedStyle(element);
      return (
        !element.closest('[aria-hidden="true"], [inert]') &&
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        element.getClientRects().length > 0
      );
    }
  );
}

export function useFocusTrap<
  Container extends HTMLElement,
  InitialFocus extends HTMLElement = HTMLElement,
>(
  active: boolean,
  containerRef: RefObject<Container | null>,
  initialFocusRef?: RefObject<InitialFocus | null>,
  isTopLayer = true
) {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const isTopLayerRef = useRef(isTopLayer);

  useEffect(() => {
    isTopLayerRef.current = isTopLayer;
  }, [isTopLayer]);

  useEffect(() => {
    if (!active) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    return () => {
      if (!isTopLayerRef.current) return;
      const previouslyFocused = previouslyFocusedRef.current;
      if (!previouslyFocused?.isConnected) return;
      previouslyFocused.focus({ preventScroll: true });
    };
  }, [active]);

  useEffect(() => {
    if (!active || !isTopLayer) return;

    const focusInitialElement = () => {
      const container = containerRef.current;
      if (!container) return;
      (initialFocusRef?.current ?? getFocusableElements(container)[0])?.focus();
    };

    const initialFocusFrame = window.requestAnimationFrame(focusInitialElement);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;
      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === first || !container.contains(activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (activeElement === last || !container.contains(activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(initialFocusFrame);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, containerRef, initialFocusRef, isTopLayer]);
}
