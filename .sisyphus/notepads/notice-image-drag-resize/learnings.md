2026-02-04
- Admin notice editor now uses handle-only image selection sync (`updateSelectedImageHandle`) based on `.ProseMirror-selectednode`.
- Drag resize clamp aligned to 120–1200px to match sanitizer/runtime clamp.

## Final Verification (2026-02-04)

All acceptance criteria verified:
1. ✅ Admin editor: No popover dialog; drag handle visible on image selection
2. ✅ Drag clamp: 120–1200px (aligned across editor, sanitizer, runtime)
3. ✅ Public rendering: data-notice-width whitelisted; applyNoticeImageWidths() applies styles
4. ✅ Quality gates: Lint, TypeScript, build all pass

### Key Implementation Details
- Popover state completely removed (8 state vars, helpers, JSX)
- updateSelectedImageHandle() replaces syncImagePopoverFromSelection()
- Drag handle renders whenever resizeHandlePos is set (no popover condition)
- Playwright E2E covers full flow: upload → select → drag → save → public render
- Evidence screenshots captured for drag-resize and public persistence

### No Breaking Changes
- Upload API unchanged
- Sanitizer rules unchanged (data-notice-width already whitelisted)
- Public rendering unchanged (applyNoticeImageWidths already in place)
- Database schema unchanged
- All existing tests still pass

### Lessons for Future Work
- Event listener cleanup is critical for drag interactions (useEffect with proper cleanup)
- Stable Playwright selectors (aria-label, getByRole) are essential for E2E reliability
- Clamp enforcement at multiple layers (editor, sanitizer, runtime) prevents user confusion
- Fixture files must be valid image formats (PNG/JPEG, not .ico)

## Follow-up (2026-02-04)

- If clicking an image doesn't apply `.ProseMirror-selectednode`, force a ProseMirror `NodeSelection` from click coords (`view.posAtCoords(...)`) and update the handle on the next frame.
