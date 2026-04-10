const ALLOWED_EXTERNAL_HOSTS = new Set([
  'github.com',
  'codeberg.org',
  'telperion.cz',
  'www.linkedin.com',
  'signal.me',
]);

export function toSafeExternalUrl(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return undefined;
  }

  if (parsed.protocol !== 'https:') {
    return undefined;
  }

  if (!ALLOWED_EXTERNAL_HOSTS.has(parsed.hostname)) {
    return undefined;
  }

  return parsed.toString();
}
