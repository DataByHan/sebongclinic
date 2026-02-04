2026-02-03
- Toast UI WYSIWYG image node selection can be detected via `.ProseMirror-selectednode` (works well for per-image UI).
- To read current ProseMirror state from Toast UI, `editor.getCurrentModeEditor().view.state` is accessible via a narrow cast.
- For a non-modal popover, `position: fixed` + viewport clamping avoids scroll container math.
