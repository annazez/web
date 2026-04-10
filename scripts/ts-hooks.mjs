/**
 * Custom ESM loader hook that adds `.ts` extension fallback resolution.
 * This allows source files that use extensionless imports (e.g. `./dictionary`)
 * to be resolved correctly when running tests with `node --experimental-strip-types`.
 */
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'astro:content') {
    return {
      url: `file://${process.cwd()}/tests/unit/__mocks__/astro-content.mjs`,
      shortCircuit: true,
    };
  }

  if (specifier.startsWith('node:') || specifier.startsWith('http')) {
    return nextResolve(specifier, context);
  }

  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND') {
      try {
        return await nextResolve(specifier + '.ts', context);
      } catch {
        // fall through and rethrow the original error
      }
    }
    throw err;
  }
}
