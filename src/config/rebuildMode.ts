/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const REBUILD_MODE = true;

export const PUBLIC_ROUTES: ReadonlyArray<string> = ['/'];

/**
 * Checks if a given path is allowed to be accessed under REBUILD_MODE.
 * Standard query params and hashes are stripped before checks.
 */
export function isRoutePublic(path: string): boolean {
  if (!REBUILD_MODE) return true;

  // Clean path from query and hash
  const cleanPath = path.split('?')[0].split('#')[0].toLowerCase();

  // Strict match or starts with matching sub-route
  return PUBLIC_ROUTES.some((r) => {
    const route = r.toLowerCase();
    if (route === '/') {
      return cleanPath === '/';
    }
    return cleanPath === route || cleanPath.startsWith(`${route}/`);
  });
}
