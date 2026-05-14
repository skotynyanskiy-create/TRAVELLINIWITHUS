import { useState } from 'react';
import { EXPERIMENTS } from '../config/experiments';
import { trackEvent } from '../services/analytics';

const STORAGE_PREFIX = 'twu_exp_';

function pickVariant(experimentName: string): string {
  const experiment = EXPERIMENTS[experimentName];
  if (!experiment) return 'control';
  if (!experiment.enabled) return experiment.defaultVariant;

  const totalWeight = experiment.variants.reduce((sum, v) => sum + (v.weight ?? 1), 0);
  let rand = Math.random() * totalWeight;
  for (const variant of experiment.variants) {
    rand -= variant.weight ?? 1;
    if (rand <= 0) return variant.id;
  }
  return experiment.defaultVariant;
}

/**
 * Returns the assigned variant id for an experiment. Sticky per visitor (localStorage).
 * Emits `experiment_exposure` analytics event once on first assignment.
 *
 * Implementation uses a lazy useState initializer so the first render already
 * has the resolved variant — no flicker, no setState-in-effect violation.
 */
export function useExperiment(name: string): string {
  const [variant] = useState<string>(() => {
    const experiment = EXPERIMENTS[name];
    if (!experiment) return 'control';
    if (typeof window === 'undefined') return experiment.defaultVariant;
    if (!experiment.enabled) return experiment.defaultVariant;

    const storageKey = `${STORAGE_PREFIX}${name}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && experiment.variants.some((v) => v.id === stored)) {
        return stored;
      }

      const assigned = pickVariant(name);
      localStorage.setItem(storageKey, assigned);
      // Defer analytics call so it doesn't run synchronously during render.
      queueMicrotask(() => trackEvent('experiment_exposure', { name, variant: assigned }));
      return assigned;
    } catch {
      return experiment.defaultVariant;
    }
  });

  return variant;
}
