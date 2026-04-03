/**
 * Initialize the 3D exploded layers mode.
 * Only called when user explicitly navigates to #layers hash.
 * All event listeners are registered here and cleanup is returned for disposal.
 */
export function initLayersMode() {
  const pageShell = document.getElementById('page-shell');
  if (!pageShell) return;

  const defaults = {
    rotateX: 60,
    rotateZ: -30,
    scale: 0.8,
  };

  const state = {
    ...defaults,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartRotateX: defaults.rotateX,
    dragStartRotateZ: defaults.rotateZ,
    suppressClick: false,
  };

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const applyLayersTransform = () => {
    pageShell.style.setProperty('--layers-rotate-x', `${state.rotateX}deg`);
    pageShell.style.setProperty('--layers-rotate-z', `${state.rotateZ}deg`);
    pageShell.style.setProperty('--layers-scale', String(state.scale));
  };

  const resetLayersTransform = () => {
    pageShell.style.removeProperty('--layers-rotate-x');
    pageShell.style.removeProperty('--layers-rotate-z');
    pageShell.style.removeProperty('--layers-scale');
  };

  const finishDrag = () => {
    if (!state.isDragging) return;
    state.isDragging = false;
    pageShell.classList.remove('layers-dragging');
    state.suppressClick = true;
    window.setTimeout(() => {
      state.suppressClick = false;
    }, 0);
  };

  const onPointerDown = (event: PointerEvent) => {
    if (window.location.hash !== '#layers' || event.button !== 0) return;

    state.isDragging = true;
    state.dragStartX = event.clientX;
    state.dragStartY = event.clientY;
    state.dragStartRotateX = state.rotateX;
    state.dragStartRotateZ = state.rotateZ;
    pageShell.classList.add('layers-dragging');

    if (pageShell.setPointerCapture) {
      pageShell.setPointerCapture(event.pointerId);
    }
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!state.isDragging || window.location.hash !== '#layers') return;

    const deltaX = event.clientX - state.dragStartX;
    const deltaY = event.clientY - state.dragStartY;

    state.rotateZ = state.dragStartRotateZ + deltaX * 0.2;
    state.rotateX = clamp(state.dragStartRotateX + deltaY * 0.2, 20, 80);
    applyLayersTransform();
  };

  const onWheel = (event: WheelEvent) => {
    if (window.location.hash !== '#layers') return;

    event.preventDefault();
    const zoomFactor = Math.exp(-event.deltaY * 0.001);
    state.scale = clamp(state.scale * zoomFactor, 0.45, 1.4);
    applyLayersTransform();
  };

  const onClick = (event: MouseEvent) => {
    if (!state.suppressClick) return;

    event.preventDefault();
    event.stopImmediatePropagation();
  };

  // Register all event listeners
  pageShell.addEventListener('pointerdown', onPointerDown);
  pageShell.addEventListener('pointermove', onPointerMove);
  pageShell.addEventListener('pointerup', finishDrag);
  pageShell.addEventListener('pointercancel', finishDrag);
  pageShell.addEventListener('lostpointercapture', finishDrag);
  pageShell.addEventListener('wheel', onWheel, { passive: false });
  pageShell.addEventListener('click', onClick, true);

  // Apply initial transform
  applyLayersTransform();

  // Return cleanup function for when mode is exited
  return function cleanup() {
    pageShell.removeEventListener('pointerdown', onPointerDown);
    pageShell.removeEventListener('pointermove', onPointerMove);
    pageShell.removeEventListener('pointerup', finishDrag);
    pageShell.removeEventListener('pointercancel', finishDrag);
    pageShell.removeEventListener('lostpointercapture', finishDrag);
    pageShell.removeEventListener('wheel', onWheel);
    pageShell.removeEventListener('click', onClick, true);

    state.isDragging = false;
    state.suppressClick = false;
    pageShell.classList.remove('layers-dragging');
    resetLayersTransform();
  };
}
