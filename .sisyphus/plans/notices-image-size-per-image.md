# Notice Image Size: Per-Image Popover (px/%)

## TL;DR

> **Quick Summary**: Replace the Toast UI Editor toolbar-based image size presets with an image-selection popover that edits each image's width via numeric input (px/%), persisted in the HTML and safely rendered on the public notices page.
>
> **Deliverables**:
> - Admin editor: image-click popover for per-image width (px/%) and removal of the toolbar “Size” popup
> - Storage format: `data-notice-width="{number}{unit}"` on `<img>` (e.g., `300px`, `50%`)
> - Safe sanitization: whitelist + validate `data-notice-width` so malicious values are stripped
> - Rendering: apply width on both admin preview (published-preview panel) and public notices render
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES (2 waves)
> **Critical Path**: Sanitization & attribute spec → Admin popover UI → Rendering applier

---

## Context

### Original Request
"공지사항 이미지 사이즈 수정을 Toolbar에서 안하고, Image별로 하도록 만들어줘." + numeric input (px/%), popover near the image.

### Current Implementation (verified)
- Admin editor: `src/app/admin-8f3a9c2d4b1e/page.tsx`
  - Toast UI Editor is initialized in an effect.
  - A custom toolbar item “Size” is inserted (`insertToolbarItem`) and uses a popup UI (`createNoticeImageSizePopupBody`).
  - Clicking preset buttons calls `editor.exec('setNoticeImageSize', { size })`.
  - Custom command `setNoticeImageSize` sets `data-notice-size="sm|md|lg|full"` on the selected image node.
- Sanitization: `src/lib/sanitize.ts`
  - Uses `xss` (`FilterXSS`) whitelist; `<img>` allows `src`, `alt`, `data-notice-size`.
- Styling: `src/app/globals.css`
  - CSS sets widths for `data-notice-size` presets (320/480/640/100%).
- Public render: `src/app/notices/page.tsx`
  - Renders `sanitizeNoticeHtml(notice.content)` via `dangerouslySetInnerHTML`.

### Metis Review (applied)
- Security guardrail: do not introduce style-based XSS; validate width values both at sanitization-time and before applying to DOM.
- Backward compatibility: keep legacy `data-notice-size` working.
- UX edge cases: popover show/hide rules, ESC to dismiss, selection changes.

---

## Work Objectives

### Core Objective
Move image sizing control from a toolbar popup to a per-image popover and support arbitrary numeric widths in `px` or `%` without weakening XSS defenses.

### Concrete Deliverables
- Admin: click/select an image → popover appears near image with numeric width input + unit toggle (px/%)
- Persist: chosen width stored in notice HTML as `data-notice-width="300px"` or `data-notice-width="50%"`
- Render: images with `data-notice-width` display at that width on `/notices` and in an admin “게시 미리보기” panel (same styling as public)
- Legacy: existing `data-notice-size` continues to work exactly as before

### Must Have
- Strict validation: only allow `^\d+(\.\d+)?(px|%)$` (with bounds) for `data-notice-width`
- Popover is non-modal and does not break editor typing/selection
- Mobile-safe rendering remains: `max-width: 100%` and `height: auto`

### Must NOT Have (Guardrails)
- No `style` attribute whitelisting in sanitizer
- No string concatenation into `style="..."`; always set `element.style.width = validatedValue`
- No new dependencies
- No breaking changes to existing notices using `data-notice-size`

---

## Verification Strategy (MANDATORY)

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> All verification steps must be agent-executable (Playwright/Bash). No “user manually checks”.

### Test Decision
- **Infrastructure exists**: Partial (Playwright dependency exists; no configured test suite)
- **Automated tests**: None added by default
- **Primary verification**: Agent-executed Playwright QA + build/lint/typecheck

### Agent-Executed QA Scenarios
- Use Playwright to drive the admin UI (login with any non-empty password; do not rely on saving/upload).
- Validate sanitization by running the app and inspecting rendered DOM attributes (not by adding secrets).

---

## Execution Strategy

Wave 1 (Core Data + Security): Task 1

Wave 2 (UI + Rendering): Tasks 2-4 (mostly parallel, then quick integration pass)

Critical Path: 1 → 2 → 3

---

## TODOs

- [ ] 1. Define `data-notice-width` attribute + sanitize it safely

  **What to do**:
  - Add `data-notice-width` to `<img>` whitelist in `src/lib/sanitize.ts`.
  - In `onTagAttr`, add explicit handling for `tag === 'img' && name === 'data-notice-width'`:
    - Accept only a strict width string (recommend: `^\d+(\.\d+)?(px|%)$`).
    - Apply bounds (defaults):
      - `%`: clamp to `[10, 100]`
      - `px`: clamp to `[120, 1200]`
    - If invalid, drop the attribute.
    - If valid but out of bounds, replace with clamped value.
  - Keep existing `data-notice-size` behavior unchanged.

  **Must NOT do**:
  - Do not whitelist `style`.
  - Do not allow arbitrary strings (no `;`, `(`, `)`, quotes) to pass through.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: small, localized security change.
  - **Skills**: (none)
  - **Skills Evaluated but Omitted**:
    - `playwright`: not needed for code change itself.

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 2)
  - **Parallel Group**: Wave 2 preparation
  - **Blocks**: Task 3 (render applier relies on sanitized values)
  - **Blocked By**: None

  **References**:
  - `src/lib/sanitize.ts` - Current whitelist + URL validation; add `data-notice-width` and sanitize it in `onTagAttr`.
  - `src/app/globals.css` - Existing `data-notice-size` sizing rules that must remain.

  **Acceptance Criteria**:
  - [ ] `npm run lint` passes.
  - [ ] `npx tsc --noEmit` passes.
  - [ ] Running this ad-hoc sanitizer check produces safe output (no `javascript:` and no injected CSS):

    ```bash
    rm -rf .sisyphus/tmp-sanitize-test
    npx tsc --pretty false --module commonjs --target es2020 --esModuleInterop \
      --outDir .sisyphus/tmp-sanitize-test --rootDir src src/lib/sanitize.ts
    node -e "const { sanitizeNoticeHtml } = require('./.sisyphus/tmp-sanitize-test/lib/sanitize.js'); const out = sanitizeNoticeHtml('<img src=\\"/x\\" data-notice-width=\\"100px; background:url(javascript:alert(1))\\" />'); console.log(out); if (out.includes('javascript:') || out.includes('data-notice-width=\\"100px;')) process.exit(1)"
    ```

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Sanitizer drops malicious data-notice-width
    Tool: Bash
    Preconditions: npm install already done
    Steps:
      1. rm -rf .sisyphus/tmp-sanitize-test
      2. npx tsc --pretty false --module commonjs --target es2020 --esModuleInterop --outDir .sisyphus/tmp-sanitize-test --rootDir src src/lib/sanitize.ts
      3. node -e "const { sanitizeNoticeHtml } = require('./.sisyphus/tmp-sanitize-test/lib/sanitize.js'); console.log(sanitizeNoticeHtml('<img src=\\"/x\\" data-notice-width=\\"100px; background:url(javascript:alert(1))\\" />'))"
      4. Assert stdout does NOT contain "javascript:" and does NOT contain "data-notice-width=\"100px;"
    Expected Result: Output HTML is safe and attribute is removed or normalized
    Evidence: .sisyphus/evidence/task-1-sanitize-width.txt (capture stdout)
  ```

- [ ] 2. Add admin popover UI for per-image width (px/%)

  **What to do**:
  - In `src/app/admin-8f3a9c2d4b1e/page.tsx`:
    - Remove the toolbar “Size” popup insertion (`insertToolbarItem`) and its popup body creator.
    - Add a popover component (plain JSX) that appears when an image in the editor is clicked/selected.
    - Popover fields:
      - Numeric input (string) for width value
      - Unit toggle: `px` / `%`
      - Buttons: Apply, Clear (removes `data-notice-width`), Close
    - Interaction rules:
      - Show popover when clicking an image in the editor content.
      - Close on `Esc` and on outside click.
      - If selection changes to a different image, move popover + update values.
      - If no image selected, hide popover.
    - Add a new Toast UI custom command (e.g., `setNoticeImageWidth`) that sets/removes `data-notice-width` on the selected image node.
      - When setting numeric width, remove `data-notice-size` to avoid conflicting rules (numeric takes precedence).
  - Styling: use existing Tailwind + CSS vars patterns; keep it visually consistent with admin cards.

  **Must NOT do**:
  - Do not require image upload for testing (use URL insert).
  - Do not block editing (popover is non-modal).

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: UI + editor integration + selection edge cases.
  - **Skills**: `frontend-ui-ux`
    - Reason: popover UX/positioning, keyboard/focus behavior.
  - **Skills Evaluated but Omitted**:
    - `playwright`: use later for QA, not for implementation.

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 3)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 4 (final QA pass)
  - **Blocked By**: Task 1 (attribute spec + sanitizer)

  **References**:
  - `src/app/admin-8f3a9c2d4b1e/page.tsx:12` - Existing `NoticeImageSize` approach to replace.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx:28` - `findSelectedImage()` selection logic to reuse for width command.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx:57` - Current toolbar popup creation to remove.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx:164` - Existing `addCommand` pattern to follow.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx:183` - Current `insertToolbarItem` to remove.

  **Acceptance Criteria**:
  - [ ] Clicking an image inside the Toast UI editor shows a popover within viewport.
  - [ ] Setting width `50%` results in the selected image node having `data-notice-width="50%"`.
  - [ ] Setting width `300px` results in `data-notice-width="300px"`.
  - [ ] Clear removes `data-notice-width` from the selected image.
  - [ ] Esc closes popover; clicking outside closes popover.

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Admin popover applies width to selected image
    Tool: Playwright
    Preconditions: npm run dev running on http://localhost:3000
    Steps:
      1. Navigate to: http://localhost:3000/admin-8f3a9c2d4b1e
      2. Fill password input with "dummy" and click "로그인"
      3. In Toast UI toolbar, click the image button and insert by URL: https://placehold.co/640x360.png
      4. Click the inserted image in the editor
      5. Assert popover visible (e.g., data-testid="notice-image-popover")
      6. Enter width value: "50" and unit: "%" then click Apply
      7. Assert editor DOM contains an <img> with attribute data-notice-width="50%"
      8. Screenshot: .sisyphus/evidence/task-2-popover-apply.png
    Expected Result: Image is tagged with data-notice-width and popover remains usable
    Evidence: .sisyphus/evidence/task-2-popover-apply.png

  Scenario: Popover clears width
    Tool: Playwright
    Preconditions: Image already inserted and popover open
    Steps:
      1. Click Clear
      2. Assert selected image no longer has data-notice-width
      3. Screenshot: .sisyphus/evidence/task-2-popover-clear.png
    Expected Result: Attribute removed
    Evidence: .sisyphus/evidence/task-2-popover-clear.png
  ```

- [ ] 3. Apply `data-notice-width` at render-time (admin + public)

  **What to do**:
  - Add a small shared helper (new or existing `src/lib/*`) that:
    - Finds `img[data-notice-width]` within a container
    - Validates value (same rules as sanitizer)
    - Applies `img.style.width = validatedWidth` and keeps `maxWidth: 100%` / `height: auto`
  - Public notices page (`src/app/notices/page.tsx`): after render, run the applier on each notice content container.
  - Admin page: add a “게시 미리보기” panel that renders `sanitizeNoticeHtml(editor.getHTML())` inside a `.prose` container, and run the applier on that container (this avoids needing DB/password for QA).

  **Must NOT do**:
  - Do not parse arbitrary CSS; only accept `number + unit`.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: (none)

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 2 once Task 1 done)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 4
  - **Blocked By**: Task 1

  **References**:
  - `src/app/notices/page.tsx:60` - `dangerouslySetInnerHTML` container where applier should target.
  - `src/app/globals.css:66` - baseline image rules (`max-width: 100%`, etc.).
  - `src/lib/sanitize.ts` - reuse the exact same validation rules.

  **Acceptance Criteria**:
  - [ ] In admin “게시 미리보기”, an image with `data-notice-width="50%"` has computed width ~50% of the preview container (Playwright assertion).
  - [ ] On `/notices`, runtime applier code path exists (verified by code reference + successful build).

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Admin published-preview applies width via JS applier
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to /admin-8f3a9c2d4b1e and login with dummy password
      2. Insert image by URL
      3. Apply width 300px via popover
      4. Assert the “게시 미리보기” panel contains img[data-notice-width="300px"]
      5. Assert computedStyle.width of that img is close to 300px (within tolerance)
      6. Screenshot: .sisyphus/evidence/task-3-preview-width.png
    Expected Result: data-notice-width takes effect at runtime in preview
    Evidence: .sisyphus/evidence/task-3-preview-width.png
  ```

- [ ] 4. Final integration + regression checks

  **What to do**:
  - Ensure legacy `data-notice-size` still works (CSS unchanged).
  - Verify popover and toolbar changes do not break basic editor actions (bold/italic/list/link/image).
  - Run quality gates.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `playwright`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Final step
  - **Blocks**: None
  - **Blocked By**: Tasks 1-3

  **References**:
  - `src/app/globals.css` - keep `data-notice-size` styles.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx` - verify toolbarItems remain.

  **Acceptance Criteria**:
  - [ ] `npm run lint` passes
  - [ ] `npx tsc --noEmit` passes
  - [ ] `npm run build` passes
  - [ ] Playwright QA scenarios from Tasks 2-3 pass (screenshots captured)

---

## Commit Strategy

- 1 commit recommended:
  - `feat: move notice image sizing to per-image popover`
  - Verification: `npm run lint && npx tsc --noEmit && npm run build`

---

## Success Criteria

### Verification Commands
```bash
npm run lint
npx tsc --noEmit
npm run build
```

### Final Checklist
- [ ] Toolbar “Size” popup removed from admin
- [ ] Image-click popover supports numeric px/% and persists as `data-notice-width`
- [ ] Sanitizer strips invalid/malicious `data-notice-width` values
- [ ] Public notices render applies `data-notice-width` safely
- [ ] Legacy `data-notice-size` continues to render as before
