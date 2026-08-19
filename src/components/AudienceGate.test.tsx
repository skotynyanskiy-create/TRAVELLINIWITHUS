import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AudienceProvider } from '../context/AudienceContext';
import { setConsent } from '../lib/consent';
import AudienceGate from './AudienceGate';

const { trackAnalyticsEventMock } = vi.hoisted(() => ({
  trackAnalyticsEventMock: vi.fn(),
}));

vi.mock('../services/analytics', () => ({
  trackAnalyticsEvent: (...args: unknown[]) => trackAnalyticsEventMock(...args),
}));

function renderGate() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <AudienceProvider>
        <AudienceGate />
      </AudienceProvider>
    </MemoryRouter>
  );
}

function revealGate() {
  act(() => {
    vi.advanceTimersByTime(1200);
  });
}

describe('AudienceGate analytics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    window.sessionStorage.clear();
    setConsent({ analytics: false, marketing: false, personalization: false });
    trackAnalyticsEventMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('waits for analytics consent and tracks the view only once', () => {
    renderGate();
    revealGate();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(trackAnalyticsEventMock).not.toHaveBeenCalled();

    act(() => {
      setConsent({ analytics: true, marketing: false, personalization: false });
    });
    act(() => {
      setConsent({ analytics: true, marketing: false, personalization: false });
    });

    expect(trackAnalyticsEventMock).toHaveBeenCalledTimes(1);
    expect(trackAnalyticsEventMock).toHaveBeenCalledWith('audience_gate_view', {
      entry_path: '/',
    });
  });

  it('records the selected audience without changing the gate flow', () => {
    setConsent({ analytics: true, marketing: false, personalization: false });
    renderGate();
    revealGate();
    trackAnalyticsEventMock.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /Family/i }));

    expect(trackAnalyticsEventMock).toHaveBeenCalledWith('audience_gate_select', {
      entry_path: '/',
      audience: 'family',
    });
  });

  it('records an explicit dismissal', () => {
    setConsent({ analytics: true, marketing: false, personalization: false });
    renderGate();
    revealGate();
    trackAnalyticsEventMock.mockClear();

    fireEvent.click(screen.getByRole('button', { name: 'Decido dopo' }));

    expect(trackAnalyticsEventMock).toHaveBeenCalledWith('audience_gate_dismiss', {
      entry_path: '/',
      method: 'button',
    });
  });

  it('records Escape as a separate dismissal method', () => {
    setConsent({ analytics: true, marketing: false, personalization: false });
    renderGate();
    revealGate();
    trackAnalyticsEventMock.mockClear();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(trackAnalyticsEventMock).toHaveBeenCalledWith('audience_gate_dismiss', {
      entry_path: '/',
      method: 'escape',
    });
  });
});
