import { identity } from '../data/identity';

const ADDITIONAL_ALLOWED_HOSTS = [
  'telperion.cz',
  'lumi.zezulka.me',
  // /uses page tool links
  'fedoraproject.org',
  'code.visualstudio.com',
  'neovim.io',
  'ghostty.org',
  'fishshell.com',
  'starship.rs',
  'www.mozilla.org',
  'nodejs.org',
  'astro.build',
  'podman.io',
  'caddyserver.com',
  'woodpecker-ci.org',
];

const ALLOWED_EXTERNAL_HOSTS = new Set([
  ...Object.values(identity)
    .filter(val => typeof val === 'string' && val.startsWith('http'))
    .map(u => new URL(u).hostname),
  ...ADDITIONAL_ALLOWED_HOSTS,
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
