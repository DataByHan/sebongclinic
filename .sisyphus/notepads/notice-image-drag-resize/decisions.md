2026-02-04
- Removed the image width popover state machine entirely; selection now only drives the resize handle.
- On mouseup after drag, persist width via `exec('setNoticeImageWidth', { width, unit: 'px' })` relying on current selection.
