const en = {
  'role.title': 'Software Architect',
  'hero.manifesto':
    'I create architecture that leaves no room for chaos. Systems must be uncompromisingly optimized, secure, and aligned with moral values for the greater good. Now in the era of AI, I am dedicated to building a web that is not only fast and secure but also ethical and sustainable.',
  'hero.status': 'Currently running only the',
  'hero.layer': 'core',
  'hero.layerSuffix': 'layer.',
  '404.message': 'Page not found',
  '404.return': 'Home',
} as const;

export type TranslationKey = keyof typeof en;
export type TranslationDictionary = Record<TranslationKey, string>;

export default en;
