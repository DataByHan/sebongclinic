# Fix Admin Notice Image Width Apply Alert

## TL;DR

> **Quick Summary**: Fix the admin notice editor so that clicking **"적용"** in the **"이미지 너비"** popover updates the selected image width instead of showing a false **"이미지를 선택해 주세요."** alert.
>
> **Deliverables**:
> - Admin editor reliably applies `data-notice-width` to the intended image during new notice creation.
> - No false "이미지를 선택해 주세요." alert when an image was the source of the popover.
> - Deployment to production Workers verified.
>
> **Estimated Effort**: Short
> **Parallel Execution**: NO (single flow)
> **Critical Path**: Repro → Fix apply handler (don’t rely on exec return) → QA → Deploy

---

## Context

### Original Request
- 공지사항 새 공지를 작성할 때 사진 첨부 후 이미지 사이즈(너비) 변경하려고 하면 "이미지를 선택해 주세요."가 뜨므로 해결.

### Interview Summary
- Confirmed: alert occurs when clicking **"적용"** in the **"이미지 너비"** popover.

### Current Implementation Notes
- Admin editor: `src/app/admin-8f3a9c2d4b1e/page.tsx`.
- Popover selection capture exists (`imagePopoverSelectedPos`), and the `setNoticeImageWidth` command supports optional `pos` payload.
- **Bug source**: UI attempts to treat `editorInstance.exec()` as returning `boolean` and shows alert when it is falsy.
  - In Toast UI Editor, `exec()` is implemented/typed as `void`, so this “success” check is invalid and causes false failures.

### Metis Review (Applied Guardrails)
- Do not rely on `exec()` return value.
- Validate target image via stored `pos` (and selection fallback) before showing the alert.
- Handle edge cases: stale `pos`, multiple images, image deleted while popover is open.
- Add agent-executed QA (Playwright) and verify build/type/lint.
- Security/process: avoid leaking Cloudflare API tokens; rotate if exposed.

---

## Work Objectives

### Core Objective
Make the image width popover apply/clear operations target the correct image reliably, even if editor focus/selection changes, and only show the "이미지를 선택해 주세요." alert when there truly is no target image.

### Must Have
- Clicking "적용" updates the image’s `data-notice-width` (and the preview reflects it via runtime application).
- No false alert when the popover was opened from a real image.

### Must NOT Have (Guardrails)
- MUST NOT check “success” from `editor.exec()` return value.
- MUST NOT introduce new dependencies.
- MUST NOT weaken sanitization or allow unsafe attribute injection.

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: YES (Playwright in `e2e/`)
- **Automated tests**: Tests-after (prefer adding an E2E regression if feasible)
- **Agent-Executed QA**: REQUIRED

### Agent-Executed QA Scenarios (MANDATORY)

Scenario: Apply image width during new notice creation
  Tool: Playwright (playwright skill)
  Preconditions: Deployed site reachable; admin password present as env (`ADMIN_PASSWORD`)
  Steps:
    1. Navigate to: `https://sebongclinic.hanms-data.workers.dev/admin-8f3a9c2d4b1e`
    2. Fill: `input[type="password"]` with admin password
    3. Click: role=button name="로그인"
    4. Upload an image using the Toast UI image toolbar (or set file input)
    5. Click the inserted `img` inside `.toastui-editor-contents`
    6. In the popover, fill width input with `300` and keep unit `px`
    7. Click: role=button name="적용"
    8. Assert: no dialog/alert appears with text "이미지를 선택해 주세요."
    9. Assert: editor HTML contains `data-notice-width="300px"` on the clicked image (or clamped value per sanitizer rules)
    10. Screenshot: `.sisyphus/evidence/admin-image-width-apply.png`
  Expected Result: Width is applied and persists in editor HTML; no false alert

Scenario: Image deleted while popover open
  Tool: Playwright
  Preconditions: Same as above
  Steps:
    1. Upload image, open width popover
    2. Delete the image (select and backspace/undo) so it’s removed from the doc
    3. Click "적용"
    4. Assert: alert/dialog contains "이미지를 선택해 주세요."
    5. Screenshot: `.sisyphus/evidence/admin-image-width-apply-no-image.png`
  Expected Result: Alert appears only when there is truly no target image

---

## TODOs

- [x] 1) Reproduce and pinpoint the false alert condition

  **What to do**:
  - Reproduce on production and local dev.
  - Confirm that `applyImageWidth()` currently treats `editorInstance.exec()` as returning boolean and uses that to show the alert.

  **References**:
  - `src/app/admin-8f3a9c2d4b1e/page.tsx:241` - `applyImageWidth()` / `clearImageWidth()` currently assigns `const success = (editorInstance.exec as ...)` and alerts when falsy.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx:417` - `setNoticeImageWidth` command already accepts optional `pos` and falls back to `findSelectedImage`.

  **Acceptance Criteria**:
  - Agent can reproduce: "적용" shows "이미지를 선택해 주세요." even after opening popover from an image.

- [x] 2) Fix popover apply/clear to avoid `exec()` return checks and validate target image properly

  **What to do**:
  - Remove any boolean casting/return-value checks around `editorInstance.exec()`.
  - Determine target image as follows:
    - Prefer stored `pos` captured when popover opened.
    - Validate via current editor state: `state.doc.nodeAt(pos)?.type?.name === 'image'`.
    - If invalid, optionally fall back to selection-based search (`findSelectedImage(state)`), and if found, update stored `pos` and continue.
    - Only if both fail: show "이미지를 선택해 주세요." and do not call `exec()`.
  - (Strongly recommended) store the selected pos in a ref (`useRef`) as well as state to avoid React state timing issues.

  **Must NOT do**:
  - Must not show the alert based on `exec()` return value.

  **References**:
  - `src/app/admin-8f3a9c2d4b1e/page.tsx:92` - `getWysiwygEditorState()` helper to access ProseMirror state.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx:35` - `findSelectedImage()` helper.

  **Acceptance Criteria**:
  - Clicking "적용" after opening popover from an image applies width and does not show the alert.
  - If the image is removed while the popover is open, "적용" shows the alert.

- [x] 3) QA + regression check + deploy

  **What to do**:
  - Run type/lint checks.
  - Run agent-executed Playwright scenarios.
  - Deploy to production Workers.

  **References**:
  - `src/lib/sanitize.ts:65` - sanitizer clamps/validates `data-notice-width`.
  - `src/lib/apply-notice-image-width.ts` - runtime application of `data-notice-width` to `style.width`.
  - `e2e/task-9-admin-notice.e2e.spec.mjs` - existing admin notice Playwright test patterns (note: some tests are skipped).

  **Acceptance Criteria**:
  - `npx tsc --noEmit` exits 0
  - `npm run lint` exits 0 (warnings ok)
  - Playwright QA scenarios complete with evidence screenshots under `.sisyphus/evidence/`
  - Production deploy successful; verify on `https://sebongclinic.hanms-data.workers.dev`

---

## Commit + Deploy Strategy

- Commit 1: `fix: apply image width without false selection alert`
  - Files: `src/app/admin-8f3a9c2d4b1e/page.tsx`
- Deploy:
  - Ensure `CLOUDFLARE_API_TOKEN` is loaded from your shell profile (do not print it).
  - Prefer: `npm run deploy` (OpenNext build + deploy)
  - If you need explicit environment control: run OpenNext build, then `npx wrangler deploy --env ""`.

---

## Security Note (Action Item)

- If a Cloudflare API token was ever printed to logs or shared, **revoke/rotate it immediately** in Cloudflare Dashboard and update local shell profile accordingly.

---

## Success Criteria

- Creating a new notice, uploading an image, opening the "이미지 너비" popover from that image, and clicking "적용" updates the image width without showing a false "이미지를 선택해 주세요." alert.
- Public rendering remains sanitized and width is clamped per `src/lib/sanitize.ts` / `src/lib/apply-notice-image-width.ts`.
