/**
 * Centralized Content Security Policy definition.
 *
 * @param {Object} options
 * @param {string} options.themeScriptHash - The SHA-256 hash of the inline theme bootstrap script.
 * @returns {string}
 */
export function buildCsp({ themeScriptHash }) {
  const directives = {
    'default-src': ["'self'"],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
    'form-action': ["'self'"],
    'script-src': ["'self'", `'sha256-${themeScriptHash}'`],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': ["'self'"],
  };

  return (
    Object.entries(directives)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ') + ';'
  );
}
