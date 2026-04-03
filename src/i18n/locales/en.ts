const en = {
  'role.title': 'Software Architect',
  'hero.manifesto':
    'I create architecture that leaves no room for chaos. Systems must be uncompromisingly optimized, secure, and aligned with moral values for the greater good. Now in the era of AI, I am dedicated to building a web that is not only fast and secure but also ethical and sustainable.',
  'hero.minimalByDesign': 'Minimal by design.',
  'hero.inventory': 'Inventory',
  'projects.title': 'Projects',
  'projects.subtitle':
    'A selection of work that demonstrates my approach to architecture and design.',
  'projects.visit': 'Visit',
  'projects.source': 'Code',
  'projects.telperion.description':
    'Website for Telperion, a Czech environmental organization dedicated to educating young people about climate and sustainable living. Features bilingual support and interactive components.',
  'projects.personalWeb.description':
    'My personal portfolio website. A minimalist, privacy-first design with fast performance, zero tracking, and clean architecture.',
  'seo.home': 'Home',
  'seo.workspace': 'Inventory',
  'seo.404': 'Not Found',
  'footer.downloadCv': 'Download CV',
  'footer.carbonFootprint': 'Carbon footprint:',
  'footer.loading': 'calculating...',
  '404.message': 'Page not found',
  '404.return': 'Home',
} as const;

export type TranslationKey = keyof typeof en;
export type TranslationDictionary = Record<TranslationKey, string>;

export default en;
