import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setConsent } from '../lib/consent';
import { AudienceProvider, useAudience } from './AudienceContext';

const INTEREST_STORAGE_KEY = 'travellini_interest_profile';

function InterestProbe() {
  const { interest, setInterest } = useAudience();
  return (
    <>
      <output>{interest ?? 'nessun interesse'}</output>
      <button type="button" onClick={() => setInterest('fuori-rotta')}>
        Scegli fuori rotta
      </button>
    </>
  );
}

function renderProbe() {
  return render(
    <MemoryRouter>
      <AudienceProvider>
        <InterestProbe />
      </AudienceProvider>
    </MemoryRouter>
  );
}

describe('AudienceProvider consent', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setConsent({ analytics: false, marketing: false, personalization: false });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('keeps an explicit interest in memory until consent, then clears it on revocation', async () => {
    renderProbe();

    fireEvent.click(screen.getByRole('button', { name: 'Scegli fuori rotta' }));

    expect(screen.getByText('fuori-rotta')).toBeInTheDocument();
    expect(window.localStorage.getItem(INTEREST_STORAGE_KEY)).toBeNull();

    setConsent({ analytics: false, marketing: false, personalization: true });

    await waitFor(() => {
      expect(window.localStorage.getItem(INTEREST_STORAGE_KEY)).toContain('fuori-rotta');
    });

    setConsent({ analytics: false, marketing: false, personalization: false });

    await waitFor(() => {
      expect(screen.getByText('nessun interesse')).toBeInTheDocument();
    });
    expect(window.localStorage.getItem(INTEREST_STORAGE_KEY)).toBeNull();
  });
});
