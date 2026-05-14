/**
 * Lightweight A/B test framework.
 *
 * Define experiments here, then consume via `useExperiment(name)` hook.
 * Variant assignment is sticky per visitor (localStorage), weighted, and emits
 * `experiment_exposure` to analytics on first assignment.
 *
 * Switch `enabled: false` to neutralize without removing the experiment definition.
 */

export interface ExperimentVariant {
  /** Stable variant id used in code branches and analytics. */
  id: string;
  /** Optional weight for weighted random assignment. Defaults to 1 (equal). */
  weight?: number;
  /** Optional human-friendly label for admin dashboards. */
  label?: string;
}

export interface Experiment {
  name: string;
  description: string;
  variants: ExperimentVariant[];
  /** Toggle to enable/disable assignment. Disabled experiments always return defaultVariant. */
  enabled: boolean;
  /** Variant id returned when experiment is disabled or unknown. */
  defaultVariant: string;
}

export const EXPERIMENTS: Record<string, Experiment> = {
  hero_cta_copy: {
    name: 'hero_cta_copy',
    description: 'Test variant copy del CTA primario hero homepage.',
    variants: [
      { id: 'control', label: 'Scopri destinazioni' },
      { id: 'variant_a', label: 'Trova posti da salvare' },
    ],
    enabled: false,
    defaultVariant: 'control',
  },
  newsletter_incentive: {
    name: 'newsletter_incentive',
    description: 'Test 1-step (email only) vs 2-step (email + nome).',
    variants: [{ id: 'email_only' }, { id: 'email_plus_name' }],
    enabled: false,
    defaultVariant: 'email_only',
  },
};
