import { describe, it, expect, vi, afterEach } from 'vitest';
import { shareContent } from './share';

describe('share util', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses navigator.share when available', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      share: shareMock,
    });

    const result = await shareContent({
      title: 'Test',
      url: 'https://travelliniwithus.it/posto/1',
    });
    expect(result).toBe(true);
    expect(shareMock).toHaveBeenCalledWith({
      title: 'Test',
      url: 'https://travelliniwithus.it/posto/1',
    });
  });

  it('falls back to clipboard when navigator.share is not available', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const result = await shareContent({
      title: 'Test',
      url: 'https://travelliniwithus.it/posto/1',
    });
    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('https://travelliniwithus.it/posto/1');
  });

  it('returns false if user cancels native share (AbortError)', async () => {
    const abortError = new Error('Share canceled');
    abortError.name = 'AbortError';
    const shareMock = vi.fn().mockRejectedValue(abortError);

    vi.stubGlobal('navigator', {
      share: shareMock,
    });

    const result = await shareContent({
      title: 'Test',
      url: 'https://travelliniwithus.it/posto/1',
    });
    expect(result).toBe(false);
  });
});
