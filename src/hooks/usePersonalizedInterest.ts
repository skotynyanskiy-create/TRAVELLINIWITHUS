import { useEffect, useState } from 'react';
import { useAudience } from '../context/AudienceContext';
import { getInferredInterest, onPersonalizationChange } from '../lib/personalization';

export function usePersonalizedInterest() {
  const { audience, interest: explicitInterest } = useAudience();
  const [, setRevision] = useState(0);

  useEffect(() => onPersonalizationChange(() => setRevision((value) => value + 1)), []);

  const inferredInterest = explicitInterest ? null : getInferredInterest(audience);
  return {
    interest: explicitInterest ?? inferredInterest,
    source: explicitInterest ? ('explicit' as const) : inferredInterest ? ('inferred' as const) : null,
  };
}
