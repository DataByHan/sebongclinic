# Learnings: Fix Admin Notice Image Width Apply Alert

## Session: ses_3dc3177cbffeH48TlLgC2IA0Bt + ses_3dbf945b6ffe4dCazXezUZO2DS
## Date: 2026-02-03

## Problem Pattern: Toast UI Editor exec() Return Value Misuse

### The Bug
- **Location**: `src/app/admin-8f3a9c2d4b1e/page.tsx` lines 241-288 (applyImageWidth) and 295-340 (clearImageWidth)
- **Symptom**: Clicking "적용" in image width popover always shows "이미지를 선택해 주세요." alert, even when image is selected
- **Root Cause**: Code attempted to check `editorInstance.exec()` return value as boolean
  - Toast UI Editor's `exec()` is typed/implemented as `void`
  - Type casting to `boolean` doesn't change runtime behavior
  - `undefined` (void return) is falsy → always triggers alert

### The Fix Pattern
**NEVER rely on `exec()` return value for success/failure detection.**

Instead:
1. **Validate preconditions BEFORE calling exec()**
   - Check if target image exists in editor state
   - Use stored position (captured when popover opened) as primary lookup
   - Fall back to selection-based search if stored position invalid
   - Only show alert if BOTH lookups fail

2. **Call exec() only after validation succeeds**
   - No need to check return value
   - exec() modifies editor state directly via ProseMirror dispatch

### Code Pattern (Correct)
```typescript
// ✅ CORRECT: Validate BEFORE exec()
const state = getWysiwygEditorState(editorInstance)
if (!state) {
  alert('이미지를 선택해 주세요.')
  return
}

let found = null
if (imagePopoverSelectedPos !== null) {
  const nodeAt = state.doc.nodeAt(imagePopoverSelectedPos)
  if (nodeAt?.type?.name === 'image') {
    found = { pos: imagePopoverSelectedPos, node: nodeAt }
  }
}

if (!found) {
  found = findSelectedImage(state)
}

if (!found) {
  alert('이미지를 선택해 주세요.')
  return
}

// Safe to call - we know image exists
editorInstance.exec('setNoticeImageWidth', { width, unit, pos: found.pos })
```

### Code Pattern (Incorrect - DO NOT USE)
```typescript
// ❌ WRONG: Checking exec() return value
const success = (editorInstance.exec as (...) => boolean)('setNoticeImageWidth', {...})
if (!success) {
  alert('이미지를 선택해 주세요.')  // Always triggers!
  return
}
```

## Toast UI Editor Quirks

### exec() Method
- **Type**: `void` (not `boolean`)
- **Behavior**: Modifies editor state directly via ProseMirror dispatch
- **Return Value**: Always `undefined` (void)
- **Success Detection**: Cannot use return value; must validate preconditions

### Selection Loss During Popover Interaction
- When popover input field receives focus, editor loses focus
- ProseMirror selection is cleared
- `findSelectedImage(state)` will fail if called after focus loss
- **Solution**: Capture image position when popover opens, store in state/ref

### Position-Based Image Lookup
- ProseMirror uses position-based node access: `state.doc.nodeAt(pos)`
- Position is stable within a document (doesn't change unless content is edited)
- If image is deleted, `nodeAt(pos)` returns null or non-image node
- **Pattern**: Always validate `nodeAt(pos)?.type?.name === 'image'`

## Sanitization & Validation

### data-notice-width Attribute
- **Sanitizer**: `src/lib/sanitize.ts:65` validates and clamps values
- **Pattern**: `^\d+(?:\.\d+)?(px|%)$`
- **Clamping Rules**:
  - Percentage: [10, 100]
  - Pixels: [120, 1200]
- **Runtime Application**: `src/lib/apply-notice-image-width.ts` applies to `style.width`

### Security Note
- Width values are validated at both sanitization and runtime
- No XSS risk from width attribute injection
- Sanitizer strips invalid values silently

## Testing Insights

### Playwright E2E Testing
- **Infrastructure**: Exists in `e2e/task-9-admin-notice.e2e.spec.mjs`
- **Admin Auth**: Requires `ADMIN_PASSWORD` env variable
- **Image Upload**: Toast UI's `addImageBlobHook` handles file upload to R2
- **Popover Interaction**: Must wait for image to fully render before clicking

### QA Scenarios Verified
1. ✅ Upload image → open popover → apply width → no false alert
2. ✅ Delete image while popover open → apply → alert appears (correct)
3. ✅ TypeScript clean, ESLint clean, LSP diagnostics clean

## Deployment Notes

### Cloudflare Workers
- **Build**: `npm run deploy` runs OpenNext build + wrangler deploy
- **Environment**: Production uses `-e ""` (top-level environment)
- **Bindings**: D1 Database (notices), R2 Bucket (images), Assets
- **Token**: `CLOUDFLARE_API_TOKEN` must be in shell profile (never print)

### Version Control
- **Commits**: Atomic, single-file changes preferred
- **Messages**: Conventional commits (fix:, feat:, refactor:)
- **Verification**: Always run `npx tsc --noEmit && npm run lint` before push

## Recommendations for Future Work

1. **Add Debug Mode**: Consider adding `DEBUG_IMAGE_COMMANDS` flag to log validation steps
2. **Extract Shared Logic**: If `setNoticeImageSize` has similar issues, extract common image lookup helper
3. **Document Toast UI Quirks**: Add comments explaining why we don't check exec() return value
4. **Test Helpers**: Create reusable Playwright helpers for admin workflows (login, upload, etc.)

## Related Files
- Implementation: `src/app/admin-8f3a9c2d4b1e/page.tsx`
- Sanitization: `src/lib/sanitize.ts`
- Runtime Application: `src/lib/apply-notice-image-width.ts`
- E2E Tests: `e2e/task-9-admin-notice.e2e.spec.mjs`
- Plan: `.sisyphus/plans/fix-admin-notice-image-width-popover.md`
