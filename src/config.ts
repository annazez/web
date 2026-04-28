const RAW_SITE_URL = import.meta.env.SITE_URL;

if (!RAW_SITE_URL && import.meta.env.PROD) {
  // eslint-disable-next-line no-console
  console.warn(
    'WARNING: SITE_URL environment variable is not set. Falling back to https://zezulka.me.'
  );
}

/**
 * The canonical URL of the site.
 * NOTE: This must be set as an environment variable (SITE_URL) in CI for production builds.
 * The fallback is provided as a safety net but is not the intended target for local dev.
 */
export const SITE_URL = RAW_SITE_URL || 'https://zezulka.me';
