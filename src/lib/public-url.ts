/**
 * Helper to get the public website URL.
 * Automatically adapts:
 * - If VITE_PUBLIC_WEB_URL is configured in env, use it.
 * - If running on production domain (e.g. cendekiaamanah.sch.id), use window.location.origin.
 * - Otherwise fallback to http://localhost:3000 for local dev.
 */
export function getPublicWebUrl(): string {
  const envUrl = import.meta.env.VITE_PUBLIC_WEB_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return origin;
    }
  }

  return 'http://localhost:3000';
}
