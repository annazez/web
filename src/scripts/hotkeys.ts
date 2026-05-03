/**
 * Global Keyboard Shortcut Handler.
 */
import { bindOnce } from './bind-once';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

function handleKeydown(e: KeyboardEvent): void {
  // Never intercept when typing in form fields
  if (isEditableTarget(e.target)) return;

  // Ignore when modifier keys are held (except Shift for ?)
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  // ? (Shift + /) — toggle palette
  if (e.key === '?') {
    e.preventDefault();
    const dialog = document.getElementById('command-palette') as HTMLDialogElement | null;
    if (!dialog) return;

    if (dialog.open) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }
}

bindOnce('global-hotkeys', () => {
  document.addEventListener('keydown', handleKeydown);
});
