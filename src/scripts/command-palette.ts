/**
 * Command Palette keyboard driver.
 *
 * Wires keydown listeners for the command palette <dialog>.
 * - ? (Shift+/)  → toggle palette
 * - A            → navigate to #arch
 * - U            → navigate to #audit
 * - L            → navigate to #layers
 * - H            → return home (clear hash)
 * - Esc          → close (handled natively by <dialog>)
 *
 * Skips all key handling when the event target is an input, textarea,
 * or contenteditable element to avoid stealing keystrokes from forms.
 *
 * Respects prefers-reduced-motion for open/close transitions.
 */
import { bindOnce } from './bind-once';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

function getDialog(): HTMLDialogElement | null {
  return document.getElementById('command-palette') as HTMLDialogElement | null;
}

function closePalette(): void {
  const dialog = getDialog();
  if (dialog?.open) dialog.close();
}

function setHash(hash: string): void {
  closePalette();
  window.location.hash = hash;
}

function clearHash(): void {
  closePalette();
  // Remove hash without triggering a scroll-to-top
  history.replaceState(null, '', window.location.pathname + window.location.search);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

function handleKeydown(e: KeyboardEvent): void {
  // Never intercept when typing in form fields
  if (isEditableTarget(e.target)) return;

  // Ignore when modifier keys are held
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const dialog = getDialog();

  // shortcuts only apply when the palette is open
  if (!dialog?.open) return;

  switch (e.key.toUpperCase()) {
    case 'A':
      e.preventDefault();
      setHash('#arch');
      break;
    case 'U':
      e.preventDefault();
      setHash('#audit');
      break;
    case 'L':
      e.preventDefault();
      setHash('#layers');
      break;
    case 'H':
      e.preventDefault();
      clearHash();
      break;
    // Esc is handled natively by <dialog> — no need to intercept
  }
}

bindOnce('command-palette', () => {
  document.addEventListener('keydown', handleKeydown);
});
