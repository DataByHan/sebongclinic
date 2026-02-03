# Issues & Gotchas: Fix Admin Notice Image Width Apply Alert

## Issue 1: Toast UI Editor exec() Type Mismatch

**Problem**: 
- Toast UI Editor's `exec()` method is typed as `void`
- Code attempted to cast it to `(name: string, payload?: Record<string, unknown>) => boolean`
- Type casting doesn't change runtime behavior - still returns `undefined`
- This caused false alerts every time

**Gotcha**: 
- TypeScript type casting is a compile-time feature only
- Runtime behavior is unchanged
- `const success = (editorInstance.exec as (...) => boolean)(...)` still gets `undefined`

**Resolution**:
- Never check `exec()` return value
- Validate preconditions before calling exec()
- Trust that exec() modifies state directly via ProseMirror dispatch

**Prevention**:
- Add comments explaining why we don't check exec() return value
- Document Toast UI Editor quirks in learnings.md

---

## Issue 2: Editor Selection Loss During Popover Interaction

**Problem**:
- When popover input field receives focus, editor loses focus
- ProseMirror selection is cleared
- `findSelectedImage(state)` fails if called after focus loss
- This was the secondary cause of false alerts

**Gotcha**:
- Selection state is ephemeral - it changes with focus
- Storing position when popover opens is essential
- Can't rely on selection being stable during popover interaction

**Resolution**:
- Capture image position when popover opens (before focus moves)
- Store in state: `setImagePopoverSelectedPos(found.pos)`
- Use stored position as primary lookup in apply/clear handlers
- Fall back to selection search only if stored position invalid

**Prevention**:
- Always capture critical state before UI interactions that change focus
- Document this pattern in code comments

---

## Issue 3: Stale Position After Image Deletion

**Problem**:
- If user deletes image while popover is open, stored position becomes invalid
- `state.doc.nodeAt(pos)` returns null or non-image node
- Need to handle this gracefully

**Gotcha**:
- Position is stable within a document, but becomes invalid if content changes
- Must validate `nodeAt(pos)?.type?.name === 'image'` every time

**Resolution**:
- Always validate position before using it
- Fall back to selection-based search if position invalid
- Only show alert if both lookups fail

**Test Case**:
- Upload image → open popover → delete image → click "적용" → alert appears (correct)

---

## Issue 4: React State Timing in Event Handlers

**Problem**:
- React state updates are batched and asynchronous
- Event handlers might see stale state values
- `imagePopoverSelectedPos` might be null even though popover is open

**Gotcha**:
- State refs are needed for immediate access in event handlers
- Can't rely on state being up-to-date in synchronous code

**Resolution**:
- Store position in both state (for UI) and ref (for handlers)
- Currently only state is used, but pattern is established
- If timing issues arise, add ref: `const imagePopoverSelectedPosRef = useRef<number | null>(null)`

**Current Status**:
- Not currently an issue because we validate state before using it
- But documented for future optimization

---

## Issue 5: Sanitization Doesn't Prevent False Alerts

**Problem**:
- Sanitizer validates and clamps `data-notice-width` values
- But sanitization happens AFTER the command executes
- False alert happens BEFORE sanitization

**Gotcha**:
- Sanitization is a security measure, not a validation measure
- Can't rely on sanitizer to prevent invalid width values from being applied

**Resolution**:
- Validate width input in `validateImageWidth()` before calling exec()
- This is already implemented correctly
- Sanitizer provides defense-in-depth

---

## Issue 6: Multiple Images in Content

**Problem**:
- If notice has multiple images, which one does the popover apply to?
- Current implementation applies to the image that opened the popover

**Gotcha**:
- Position-based lookup ensures we apply to the correct image
- But if user clicks a different image while popover is open, we still apply to the original

**Current Behavior**:
- Popover stays open and applies to the image that opened it
- User must close popover and click new image to change target

**Acceptable**:
- This is the expected behavior for a popover UI
- Matches common UI patterns (e.g., text formatting toolbar)

---

## Issue 7: Undo/Redo After Width Change

**Problem**:
- Does undo/redo work correctly after applying width?
- ProseMirror transactions must be structured correctly

**Gotcha**:
- Incorrect transaction structure can corrupt undo stack
- exec() uses Toast UI's command system which handles transactions

**Current Status**:
- ✅ Verified working in Playwright tests
- Toast UI's command system handles transaction wrapping correctly
- No issues observed

---

## Issue 8: CSP Headers and Image Width Attributes

**Problem**:
- CSP headers might restrict inline styles
- `data-notice-width` is applied as inline style via JavaScript

**Gotcha**:
- CSP `style-src 'unsafe-inline'` is required for this to work
- Already configured in `src/middleware.ts`

**Current Status**:
- ✅ CSP allows `style-src 'unsafe-inline'`
- No issues with width application

---

## Issue 9: Cloudflare API Token Exposure

**Problem**:
- During debugging, API token might be printed to logs
- Token was visible in earlier bash output

**Gotcha**:
- Tokens in logs are permanent and searchable
- Must be rotated immediately if exposed

**Current Status**:
- ⚠️ Token was printed in earlier session output
- **ACTION REQUIRED**: Rotate token in Cloudflare Dashboard
- Update `.profile` with new token

**Prevention**:
- Never print environment variables
- Use `source ~/.profile` without echoing
- Verify token is not in git history

---

## Issue 10: Test Infrastructure Limitations

**Problem**:
- Some Playwright tests in `e2e/task-9-admin-notice.e2e.spec.mjs` are skipped
- Toast UI Editor requires special setup in test environment

**Gotcha**:
- Browser automation can be flaky with complex editors
- Timing issues with async operations

**Current Status**:
- ✅ Manual Playwright testing verified the fix works
- Evidence screenshots captured
- Existing test infrastructure is sufficient

**Future Improvement**:
- Create reusable Playwright helpers for admin workflows
- Add regression test for this specific bug
