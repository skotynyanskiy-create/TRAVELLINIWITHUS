import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    /* Back/forward (POP): non azzerare — lascia lavorare il ripristino nativo
       del browser; azzerare qui buttava via la posizione dell'utente. */
    if (navigationType === 'POP') return;

    // Deep-link ad ancora (es. "/#storie" dalle CTA hero): scrolla all'elemento
    // con id === hash se esiste, altrimenti torna in cima.
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash, navigationType]);

  return null;
}
