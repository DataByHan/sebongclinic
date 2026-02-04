# Notice Images: Drag Resize (Remove Popup)

## TL;DR

> **Quick Summary**: Remove the image width popover from the admin notice editor and make image resizing work via a drag handle on the selected image, persisting width safely via `data-notice-width`.
>
> **Deliverables**:
> - Admin editor: no “이미지 너비” popup; drag handle resizes selected image and persists width
> - Width persistence: `data-notice-width="{n}px"` (aspect ratio preserved via `height:auto`)
> - Playwright: E2E covers “no popup”, drag resize, clamp enforcement, and public persistence
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 2 waves
> **Critical Path**: Admin editor refactor → E2E update → full verification

---

## Context

### Original Request
- 공지사항 글 작성 시 이미지 업로드 후, 이미지를 선택하면 Drag로 사이즈 조절 가능하게.
- 이미지 선택 시 “Size 조절 Popup” 기능은 폐기.

### Confirmed Decisions
- **Resize behavior**: aspect ratio preserved (width-only; `height:auto`).
- **Clamp range**: px 120–1200 (must align with sanitizer/runtime clamping).

### Repo Findings (key files)
- Admin editor: `src/app/admin-8f3a9c2d4b1e/page.tsx`
- Sanitizer (img allowlist + `data-notice-width` clamp): `src/lib/sanitize.ts`
- Runtime application of widths: `src/lib/apply-notice-image-width.ts`
- Public rendering: `src/app/notices/page.tsx`
- Upload API: `src/app/api/upload/route.ts`
- Image serve API: `src/app/api/images/[...key]/route.ts`
- E2E baseline: `e2e/task-9-admin-notice.e2e.spec.mjs`

### Metis Review (guardrails applied)
- Prevent scope creep: do not “improve” other editor UX; only remove popover and harden drag-resize.
- Watch for event listener leaks (document-level listeners).

---

## Work Objectives

### Core Objective
In the admin notice editor, selecting an uploaded image shows a drag handle that resizes the image width and persists it via `data-notice-width`, without any width popover UI.

### Must Have
- Clicking/selecting an image does **not** open the width popup.
- Drag handle appears for the selected image and allows drag resizing.
- Drag-resize persists to stored HTML as `data-notice-width="{n}px"`.
- Clamp enforcement: min 120px, max 1200px.
- Public notices render at the saved width (and still never overflow container due to `max-width:100%`).

### Must NOT Have (Guardrails)
- No new dependencies.
- No changes to upload/storage or image serving routes (R2).
- No new sanitizer attributes (keep the existing allowlist).
- No undo/redo enhancements; no mobile/touch resizing work in this task.
- No numeric width popup/inputs (the popover is removed; drag is the UX).

---

## Verification Strategy (MANDATORY)

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> All acceptance criteria are verified by agent-run commands and Playwright scenarios.

### Test Decision
- **Infrastructure exists**: YES (Playwright E2E)
- **Automated tests**: Tests-after (update/enable Playwright coverage)
- **Framework**: `npx playwright test`

### Agent-Executed QA Tooling
- Frontend/UI: Playwright (screenshots to `.sisyphus/evidence/`)
- Type/Build safety: `npx tsc --noEmit`, `npm run lint`, `npm run build`

---

## Execution Strategy

Wave 1:
- Task 1: Admin editor refactor (remove popover, drag-resize only)

Wave 2 (after Wave 1):
- Task 2: Playwright E2E update to cover drag-resize + persistence

Critical Path: Task 1 → Task 2

---

## TODOs

- [x] 1. Remove image width popover; keep drag-resize on selected image

  **What to do**:
  - In `src/app/admin-8f3a9c2d4b1e/page.tsx`, delete popover state and UI:
    - State vars: `imagePopoverOpen`, `imagePopoverTop`, `imagePopoverLeft`, `imagePopoverSelectedKey`, `imagePopoverSelectedPos`, `imageWidthInput`, `imageWidthUnit`, `imageWidthError` (see `src/app/admin-8f3a9c2d4b1e/page.tsx#L110`).
    - Popover helpers: `closeImagePopover` (`src/app/admin-8f3a9c2d4b1e/page.tsx#L147`), `updateImagePopoverPosition` (`src/app/admin-8f3a9c2d4b1e/page.tsx#L168`), and popover-only `useEffect` listeners (`src/app/admin-8f3a9c2d4b1e/page.tsx#L371`).
    - Popover JSX: `role="dialog" aria-label="이미지 너비 설정"` block (`src/app/admin-8f3a9c2d4b1e/page.tsx#L864`).
  - Replace `syncImagePopoverFromSelection` (`src/app/admin-8f3a9c2d4b1e/page.tsx#L212`) with a selection sync that ONLY:
    - Detects whether an image is selected (via `.ProseMirror-selectednode`).
    - Updates `resizeHandlePos` using `updateResizeHandlePosition` (`src/app/admin-8f3a9c2d4b1e/page.tsx#L195`).
    - Clears `resizeHandlePos` on deselect.
  - Update click/selection listeners so clicking an image does NOT open anything, but does update the resize handle position:
    - Listener wiring currently at `src/app/admin-8f3a9c2d4b1e/page.tsx#L519`.
  - Ensure the resize handle renders whenever `resizeHandlePos` is set (remove `!imagePopoverOpen` condition):
    - Current render condition: `src/app/admin-8f3a9c2d4b1e/page.tsx#L836`.
  - Align drag clamp to sanitizer/runtime clamp (px 120–1200):
    - Current drag clamp is 50–5000 in `src/app/admin-8f3a9c2d4b1e/page.tsx#L452`.
    - Set to min 120, max 1200.
  - On mouseup, persist width via the existing editor command:
    - `instance.addCommand('wysiwyg', 'setNoticeImageWidth', ...)` (`src/app/admin-8f3a9c2d4b1e/page.tsx#L603`)
    - Use payload `{ width: String(n), unit: 'px' }` and resolve the correct image with `findSelectedImage()` (`src/app/admin-8f3a9c2d4b1e/page.tsx#L35`).
  - Ensure drag-resize does not depend on removed popover vars (`imagePopoverSelectedPos`, `imageWidthInput`, `imageWidthUnit`, etc.).

  **Must NOT do**:
  - Don’t change `src/lib/sanitize.ts` behavior or allow new attributes.
  - Don’t add new UI (inputs, modals, toolbars).
  - Don’t alter upload flow.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Single-file refactor but complex editor interaction and event lifecycle.
  - **Skills**: `frontend-ui-ux`
    - `frontend-ui-ux`: interaction UX sanity and minimal visual changes.
  - **Skills Evaluated but Omitted**:
    - `playwright`: reserved for the E2E task.

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References**:
  - `src/app/admin-8f3a9c2d4b1e/page.tsx#L110` - popover state to remove.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx#L212` - current selection→popover sync; replace with handle-only sync.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx#L195` - `updateResizeHandlePosition()` logic for handle placement.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx#L425` - `handleResizeStart()`.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx#L449` - document mousemove/mouseup wiring; adjust clamp and persistence.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx#L603` - `setNoticeImageWidth` command; must remain attribute-based.
  - `src/lib/sanitize.ts#L41` - img allowlist (only `data-notice-width` persists).
  - `src/lib/sanitize.ts#L65` - px clamp 120–1200 (must match editor drag clamp).

  **Acceptance Criteria**:
  - [ ] Admin editor contains no `role="dialog"` / `aria-label="이미지 너비 설정"` UI.
  - [ ] Dragging the handle sets `data-notice-width` on the selected image to a `px` value.
  - [ ] Dragging beyond bounds clamps:
    - Below min → `data-notice-width="120px"`
    - Above max → `data-notice-width="1200px"`
  - [ ] `npm run build` succeeds.
  - [ ] `npx tsc --noEmit` succeeds.
  - [ ] `npm run lint` succeeds.

  **Agent-Executed QA Scenarios (Playwright)**:
  
  Scenario: Selecting image shows handle and no popover
    Tool: Playwright
    Preconditions: `npm run dev` running; `ADMIN_PASSWORD` set.
    Steps:
      1. Navigate to: `http://localhost:3000/admin-8f3a9c2d4b1e`
      2. Fill: `input[type="password"]` with env password
      3. Click: `button:has-text("로그인")`
      4. Wait for: `.toastui-editor-toolbar` visible
      5. Upload an image (see Task 2 fixture) and wait for `.toastui-editor-contents img`.
      6. Click the image to select it.
      7. Assert: `page.getByRole('dialog', { name: '이미지 너비 설정' })` count is 0.
      8. Assert: `page.getByRole('button', { name: '이미지 크기 조절' })` is visible.
      9. Screenshot: `.sisyphus/evidence/task-1-no-popover-handle.png`
    Expected Result: No popover; resize handle visible.

- [x] 2. Update Playwright E2E to cover drag-resize persistence via `data-notice-width`

  **What to do**:
  - Update `e2e/task-9-admin-notice.e2e.spec.mjs`:
    - Replace the invalid upload fixture (`public/favicon.ico`, currently `.ico`) with a valid image file:
      - Use existing repo asset: `public/img/Icon_Noround.png`.
    - Add/enable a test that:
      - Logs into admin
      - Uploads image
      - Clicks image → verifies no popover
      - Drags resize handle and asserts editor image has `data-notice-width` within 120–1200px
      - Saves notice and verifies on `/notices` page the image retains `data-notice-width`
    - Add screenshots to `.sisyphus/evidence/`.
  - Ensure tests use stable selectors:
    - Resize handle is accessible via role+label: `getByRole('button', { name: '이미지 크기 조절' })`.
    - Popover absence via dialog label: `getByRole('dialog', { name: '이미지 너비 설정' })`.

  **Must NOT do**:
  - Don’t rely on fragile “last toolbar button” selectors.
  - Don’t require manual verification.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: E2E needs careful waits/selectors for Toast UI.
  - **Skills**: `playwright`
    - `playwright`: author stable interaction tests + screenshots.
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: not needed for tests.

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2
  - **Blocks**: Final verification
  - **Blocked By**: Task 1

  **References**:
  - `e2e/task-9-admin-notice.e2e.spec.mjs#L23` - currently skipped full-flow test.
  - `e2e/task-9-admin-notice.e2e.spec.mjs#L65` - invalid `.ico` upload fixture; replace.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx#L836` - resize handle (`aria-label="이미지 크기 조절"`).
  - `src/app/admin-8f3a9c2d4b1e/page.tsx#L864` - popover dialog label to assert absence.
  - `src/lib/sanitize.ts#L65` + `src/lib/apply-notice-image-width.ts#L24` - clamp rules.
  - `src/app/notices/page.tsx#L68` - public render uses `sanitizeNoticeHtml()`.

  **Acceptance Criteria**:
  - [ ] `npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs` → PASS.
  - [ ] Evidence screenshots exist:
    - `.sisyphus/evidence/task-9-no-popover-handle.png`
    - `.sisyphus/evidence/task-9-drag-resize.png`
    - `.sisyphus/evidence/task-9-public-width-persist.png`

  **Agent-Executed QA Scenarios (Playwright)**:

  Scenario: Drag resize persists to public notice
    Tool: Playwright
    Preconditions: Dev server on `http://localhost:3000`; env `ADMIN_PASSWORD` set.
    Steps:
      1. Open admin page; login.
      2. Upload `public/img/Icon_Noround.png` via image toolbar.
      3. Click the inserted image to select.
      4. Assert: no dialog `이미지 너비 설정` exists.
      5. Drag handle to increase width by ~200px.
      6. Assert: selected image `data-notice-width` matches `/^\d+px$/` and is within [120,1200].
      7. Screenshot: `.sisyphus/evidence/task-9-drag-resize.png`
      8. Fill title `Drag Resize Test` and click `작성 완료`.
      9. Navigate `/notices`, find the article with title, locate its first `img`.
     10. Assert: public image has the same `data-notice-width` attribute.
     11. Screenshot: `.sisyphus/evidence/task-9-public-width-persist.png`
    Expected Result: Width attribute persists and renders publicly.

---

## Commit Strategy

- Single commit after Task 2:
  - Message: `feat: resize notice images by drag (remove popover)`
  - Verify before commit: `npm run lint && npx tsc --noEmit && npm run build && npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs`

---

## Success Criteria

### Verification Commands
```bash
npm run lint
npx tsc --noEmit
npm run build

# E2E (requires local dev server)
npm run dev -- --port 3000 & DEV_PID=$!
until curl -fsS http://localhost:3000 >/dev/null; do sleep 0.2; done
npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs
kill $DEV_PID
```

### Final Checklist
- [x] Admin editor: selecting image shows drag handle, no width popover.
- [x] Drag clamp matches sanitizer/runtime clamp (120–1200).
- [x] Public notices preserve and apply `data-notice-width`.
- [x] Lint, types, build, and E2E pass.
