/**
 * System Modes Manager.
 * Handles bootstrapping and cleanup of specialized modes (#arch, #audit, #layers).
 */
import { bindOnce } from '../bind-once';

type ModeCleanup = () => void;

let activeCleanup: ModeCleanup | null = null;
let currentMode: string | null = null;

async function checkMode() {
  const hash = window.location.hash;
  if (hash === currentMode) return;

  // Cleanup previous mode
  if (activeCleanup) {
    activeCleanup();
    activeCleanup = null;
  }

  currentMode = hash;

  // Initialize new mode
  switch (hash) {
    case '#layers': {
      const { init } = await import('./layers');
      activeCleanup = init() || null;
      break;
    }
    case '#arch': {
      const { init } = await import('./arch');
      activeCleanup = init() || null;
      break;
    }
    case '#audit': {
      const { init } = await import('./audit');
      activeCleanup = init() || null;
      break;
    }
  }
}

export function initModes() {
  window.addEventListener('hashchange', checkMode);

  // Re-check on page load (Astro View Transitions)
  document.addEventListener('astro:page-load', () => {
    // If a mode was active, ensure it re-binds to the new DOM
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }
    currentMode = null; // Force re-check
    checkMode();
  });

  // Initial check
  checkMode();
}

bindOnce('system-modes-manager', () => {
  initModes();
});
