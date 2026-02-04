2026-02-04
- No automated e2e currently verifies "no width popover appears" on image click/selection.

- Toast UI WYSIWYG selection behavior can be inconsistent; if `.ProseMirror-selectednode` is not applied on image click, the resize handle logic depends on explicitly setting `NodeSelection`.
