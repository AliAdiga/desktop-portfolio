/**
 * What's currently being dragged.
 *
 * Framer Motion drags don't carry a DataTransfer the way native HTML5 drags do,
 * so the payload is parked in a module-level slot for the life of the gesture.
 * It's transient by design — set on drag start, taken on drop.
 */
/**
 * Always a move: the desktop, the dock and every folder are all nodes in one
 * tree, so dragging relocates a single node rather than copying it. That's what
 * keeps an app from ending up in two places at once.
 */
export type DragPayload = { kind: "move"; itemId: string };

let payload: DragPayload | null = null;

export function setDragPayload(next: DragPayload | null) {
  payload = next;
}

/** Read and clear the payload. */
export function takeDragPayload(): DragPayload | null {
  const p = payload;
  payload = null;
  return p;
}

/**
 * The folder id under a screen point, or null.
 *
 * Two things make this fiddlier than a single `elementFromPoint`:
 *
 * 1. The element being dragged sits directly under the cursor, so it is always
 *    the topmost hit. Anything marked `data-dragging` is skipped — otherwise a
 *    drop would resolve against the dragged item's own container instead of the
 *    folder underneath it, and silently no-op.
 * 2. Drop zones nest (a folder icon inside a folder window inside the desktop),
 *    so the plural form plus `closest` finds the innermost zone that actually
 *    sits under the pointer.
 */
export function folderIdAtPoint(x: number, y: number): string | null {
  if (typeof document === "undefined") return null;
  for (const el of document.elementsFromPoint(x, y)) {
    const node = el as HTMLElement;
    if (node.closest?.("[data-dragging]")) continue;
    const zone = node.closest?.("[data-drop-folder]");
    if (zone) return zone.getAttribute("data-drop-folder");
  }
  return null;
}
