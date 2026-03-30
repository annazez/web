import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['node_modules/', 'dist/', '.astro/', '.eslintcache'],
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'astro/no-unused-css-selector': 'warn',
      'astro/no-conflict-set-directives': 'error',
      'astro/no-unused-define-vars-in-style': 'warn',
    },
  },
];
