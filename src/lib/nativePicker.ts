/**
 * Coordinates the browser's native date/time pickers so only ONE picker is
 * ever open.
 *
 * macOS (Safari & Chrome) keeps the previous picker alive when `showPicker()`
 * is called again while it is still open. That stale popover floats on top of
 * the neighbouring date field, so a click meant for the right-hand field
 * edits the left-hand one and the calendar looks like it never closes.
 */

let activeInput: HTMLInputElement | null = null;
let activeContainer: HTMLElement | null = null;
let listenersBound = false;

/** Re-anchors the popover on the input and immediately dismisses it. */
function forceClose(input: HTMLInputElement | null) {
  if (!input || input.disabled) return;
  try {
    input.focus({ preventScroll: true });
    input.blur();
  } catch {
    try {
      input.blur();
    } catch {}
  }
}

function closeActive() {
  const input = activeInput;
  activeInput = null;
  activeContainer = null;
  forceClose(input);
}

function isInsideActive(target: Node | null) {
  if (!target) return false;
  if (activeContainer && activeContainer.contains(target)) return true;
  if (activeInput && activeInput.contains(target)) return true;
  return false;
}

function bindGlobalListeners() {
  if (listenersBound || typeof document === 'undefined') return;
  listenersBound = true;

  // Any click outside the open field dismisses the picker before the click
  // is handled, so the next field can open a fresh picker safely.
  document.addEventListener(
    'pointerdown',
    (e) => {
      if (!activeInput) return;
      if (isInsideActive(e.target as Node | null)) return;
      closeActive();
    },
    true
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeActive();
  });

  window.addEventListener('blur', closeActive);
}

/** Dismisses any picker that belongs to a different field. */
export function dismissOtherNativePickers(input?: HTMLInputElement | null) {
  if (activeInput && activeInput !== input) closeActive();
}

/** Force-closes the tracked picker (optionally only when it matches). */
export function closeNativePicker(input?: HTMLInputElement | null) {
  if (input && input !== activeInput) return;
  closeActive();
}

export function openNativePicker(
  input?: HTMLInputElement | null,
  container?: HTMLElement | null
) {
  if (!input || input.disabled) return;
  bindGlobalListeners();

  // A second click on the same field toggles the picker closed instead of
  // leaving it stuck open.
  if (activeInput === input) {
    closeActive();
    return;
  }

  // Always get rid of whatever is open BEFORE opening a new picker.
  closeActive();

  const active = document.activeElement;
  if (active instanceof HTMLElement && active !== input) {
    try {
      active.blur();
    } catch {}
  }

  activeInput = input;
  activeContainer = container || input.parentElement;

  requestAnimationFrame(() => {
    if (activeInput !== input) return;
    try {
      if (typeof input.showPicker === 'function') {
        input.showPicker();
      } else {
        input.focus({ preventScroll: true });
      }
    } catch {
      try {
        input.focus({ preventScroll: true });
      } catch {}
    }
  });
}
