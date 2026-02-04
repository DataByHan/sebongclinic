2026-02-04
- Removed the image width popover state machine entirely; selection now only drives the resize handle.
- On mouseup after drag, persist width via `exec('setNoticeImageWidth', { width, unit: 'px' })` relying on current selection.

- To make handle visibility reliable, ensure image clicks produce a ProseMirror node selection by dispatching `NodeSelection` from click coordinates (no DOM event re-simulation).
