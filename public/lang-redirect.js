const normalizeLangCode = value =>
  typeof value === 'string' && value.trim() ? value.trim().split('-')[0].toLowerCase() : '';

const parseSupportedLangs = value => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeLangCode).filter(Boolean);
    }
  } catch {
    // Ignore non-JSON values and fall back to comma-separated parsing.
  }

  return value
    .split(',')
    .map(lang => normalizeLangCode(lang))
    .filter(Boolean);
};

const getInjectedLocaleConfig = () => {
  const currentScript = document.currentScript;
  const htmlDataset = document.documentElement.dataset;
  const supportedMeta = document.querySelector('meta[name="supported-langs"]');
  const defaultMeta = document.querySelector('meta[name="default-lang"]');

  const supportedLangs = parseSupportedLangs(
    currentScript?.dataset?.supportedLangs ||
      htmlDataset.supportedLangs ||
      supportedMeta?.getAttribute('content') ||
      ''
  );

  const injectedDefaultLang = normalizeLangCode(
    currentScript?.dataset?.defaultLang ||
      htmlDataset.defaultLang ||
      defaultMeta?.getAttribute('content') ||
      document.documentElement.lang ||
      ''
  );

  const defaultLang =
    (injectedDefaultLang && supportedLangs.includes(injectedDefaultLang) && injectedDefaultLang) ||
    supportedLangs[0] ||
    injectedDefaultLang;

  return { supportedLangs, defaultLang };
};

const { supportedLangs, defaultLang } = getInjectedLocaleConfig();

const preferred =
  Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language || defaultLang;

const prefLangCode = normalizeLangCode(preferred);

const targetLang = supportedLangs.includes(prefLangCode) ? prefLangCode : defaultLang;

if (targetLang) {
  window.location.replace(`/${targetLang}/`);
}
