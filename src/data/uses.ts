/**
 * /uses page data — IndieWeb tradition (see uses.tech).
 *
 * Each category maps to a Surface card on the page.
 * Items with a `url` will render as external links via toSafeExternalUrl.
 *
 * TODO: Replace placeholder values with your actual setup.
 */

export interface UsesItem {
  name: string;
  note?: string;
  url?: string;
}

export interface UsesCategory {
  /** Translation key for the category heading, e.g. 'uses.cat.hardware' */
  categoryKey: string;
  items: UsesItem[];
}

const uses: UsesCategory[] = [
  {
    categoryKey: 'uses.cat.hardware',
    items: [
      { name: 'ThinkPad T14s Gen 4', note: 'AMD Ryzen 7 PRO, 32 GB RAM' },
      { name: 'LG 27UK850-W', note: '27″ 4K USB-C monitor' },
      { name: 'Keychron K3', note: 'Low-profile mechanical, brown switches' },
    ],
  },
  {
    categoryKey: 'uses.cat.os',
    items: [
      {
        name: 'Fedora Workstation',
        note: 'Rolling-ish, GNOME desktop',
        url: 'https://fedoraproject.org',
      },
      { name: 'Fedora Server', note: 'Self-hosted services' },
    ],
  },
  {
    categoryKey: 'uses.cat.editor',
    items: [
      { name: 'VS Code', note: 'Primary editor', url: 'https://code.visualstudio.com' },
      { name: 'Neovim', note: 'Terminal editing & quick fixes', url: 'https://neovim.io' },
    ],
  },
  {
    categoryKey: 'uses.cat.terminal',
    items: [
      { name: 'Ghostty', note: 'GPU-accelerated terminal', url: 'https://ghostty.org' },
      { name: 'fish', note: 'Interactive shell', url: 'https://fishshell.com' },
      { name: 'starship', note: 'Cross-shell prompt', url: 'https://starship.rs' },
    ],
  },
  {
    categoryKey: 'uses.cat.browser',
    items: [
      { name: 'Firefox', note: 'Primary browser', url: 'https://www.mozilla.org/firefox/' },
      { name: 'Chromium', note: 'Testing & DevTools' },
    ],
  },
  {
    categoryKey: 'uses.cat.languages',
    items: [
      { name: 'TypeScript', note: 'Primary language' },
      { name: 'Node.js', note: 'Runtime', url: 'https://nodejs.org' },
      { name: 'Astro', note: 'This site', url: 'https://astro.build' },
      { name: 'Python', note: 'Scripting & automation' },
    ],
  },
  {
    categoryKey: 'uses.cat.infra',
    items: [
      { name: 'Podman', note: 'Rootless containers', url: 'https://podman.io' },
      { name: 'Caddy', note: 'Reverse proxy & auto-TLS', url: 'https://caddyserver.com' },
      { name: 'Woodpecker CI', note: 'Self-hosted CI/CD', url: 'https://woodpecker-ci.org' },
    ],
  },
];

export default uses;
