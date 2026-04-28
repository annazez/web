/**
 * Ensures that a side-effect (e.g. attaching a global event listener)
 * is only executed once, even across Astro view transition swaps.
 *
 * It uses a global flag on the window object to track execution.
 */
export function bindOnce(key: string, bind: () => void): void {
  const globalKey = `__bindOnce_${key.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const _window = window as unknown as Record<string, boolean>;

  if (!_window[globalKey]) {
    bind();
    _window[globalKey] = true;
  }
}
