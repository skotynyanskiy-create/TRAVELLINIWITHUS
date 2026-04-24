import { useState } from 'react';
import { trackEvent } from '../services/analytics';
import { CONTACTS } from '../config/site';

export type ContactFormKind = 'generic' | 'media-kit';

const ENDPOINTS: Record<ContactFormKind, string> = {
  generic: '/api/contact-lead',
  'media-kit': '/api/media-kit-lead',
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

interface UseContactFormOptions {
  /** Identificativo logico del form (generic = Contatti, media-kit = MediaKit). */
  kind: ContactFormKind;
  /** Se true, salva una copia in localStorage quando l'API non è raggiungibile. */
  fallbackToLocalStorage?: boolean;
}

interface SubmitResult {
  ok: boolean;
  error?: string;
}

export function useContactForm({ kind, fallbackToLocalStorage = false }: UseContactFormOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submit = async (payload: Record<string, unknown>): Promise<SubmitResult> => {
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(ENDPOINTS[kind], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || 'Invio non riuscito');
      }

      trackEvent('contact_form_submit', { kind });
      setIsSubmitted(true);
      return { ok: true };
    } catch {
      if (fallbackToLocalStorage) {
        try {
          const key = `twu_${kind}_leads`;
          const stored = JSON.parse(localStorage.getItem(key) || '[]');
          stored.push({ ...payload, date: new Date().toISOString() });
          localStorage.setItem(key, JSON.stringify(stored));
          trackEvent('contact_form_submit', { kind, fallback: 'localStorage' });
          setIsSubmitted(true);
          return { ok: true };
        } catch {
          // proseguo a mostrare errore sotto
        }
      }

      const msg = `Non siamo riusciti a inviare il messaggio. Puoi scriverci direttamente a ${CONTACTS.email}.`;
      setSubmitError(msg);
      return { ok: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setIsSubmitted(false);
    setSubmitError('');
  };

  return {
    isSubmitting,
    submitError,
    isSubmitted,
    submit,
    setSubmitError,
    reset,
  };
}
