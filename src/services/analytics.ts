export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && (window as unknown as { gtag: (...args: unknown[]) => void }).gtag) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', eventName, eventParams);
    console.log(`Event tracked: ${eventName}`, eventParams);
  } else {
    console.log(`Analytics not initialized. Event: ${eventName}`, eventParams);
  }
};
