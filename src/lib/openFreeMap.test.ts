import type { Map as MapLibreMap, MapStyleImageMissingEvent } from 'maplibre-gl';
import { describe, expect, it, vi } from 'vitest';
import { installOpenFreeMapStyleFallback, resolveOpenFreeMapStyleImage } from './openFreeMap';

function createMap(hasImage = false) {
  return {
    hasImage: vi.fn(() => hasImage),
    addImage: vi.fn(),
    on: vi.fn(),
  } as unknown as MapLibreMap;
}

describe('resolveOpenFreeMapStyleImage', () => {
  it('provides the missing OpenFreeMap city icon once', () => {
    const map = createMap();

    resolveOpenFreeMapStyleImage(map, 'circle-11');

    expect(map.addImage).toHaveBeenCalledWith(
      'circle-11',
      expect.objectContaining({ width: 11, height: 11, data: expect.any(Uint8Array) })
    );
  });

  it('does not replace available or unrelated style images', () => {
    const existingMap = createMap(true);
    const unrelatedMap = createMap();

    resolveOpenFreeMapStyleImage(existingMap, 'circle-11');
    resolveOpenFreeMapStyleImage(unrelatedMap, 'airport-11');

    expect(existingMap.addImage).not.toHaveBeenCalled();
    expect(unrelatedMap.addImage).not.toHaveBeenCalled();
  });

  it('registers one native listener that resolves the remote sprite reference', () => {
    const map = createMap();

    installOpenFreeMapStyleFallback(map);
    installOpenFreeMapStyleFallback(map);

    expect(map.on).toHaveBeenCalledTimes(1);
    expect(map.on).toHaveBeenCalledWith('styleimagemissing', expect.any(Function));

    const listener = vi.mocked(map.on).mock.calls[0][1] as (
      event: MapStyleImageMissingEvent
    ) => void;
    listener({ id: 'circle-11' } as MapStyleImageMissingEvent);

    expect(map.addImage).toHaveBeenCalledTimes(1);
  });
});
