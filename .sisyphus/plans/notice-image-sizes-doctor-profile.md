# Notice Image Size Presets + Doctor Profile Layout

## TL;DR

> **Quick Summary**: Add per-image size presets (S/M/L/Full) to the notice admin editor (Toast UI), persist sizing via a `data-notice-size` attribute on `<img>`, and style consistently on both admin preview + public `/notices`. Update the homepage doctor section to show an inline "한의학박사" badge next to "김형규 원장" and simplify the right column to a single, cleaner Profile card.
>
> **Deliverables**:
> - Notice editor: image size preset control (S/M/L/Full) + persisted markup
> - Notice render: CSS rules that apply size presets + prevent mobile overflow
> - Homepage doctor section: inline badge + right column = Profile-only
> - Playwright: extend existing e2e to cover image sizing + doctor section
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES (2 waves)
> **Critical Path**: Toast UI command + CSS -> Playwright updates -> build/lint/tsc

---

## Context

### Original Request (Korean)
- 공지사항 글을 작성할 때 이미지 사이즈를 변경할 수 있도록
- 원장소개 섹션에서
  - "김형규 원장" 옆에 "한의학박사" 표시를 예쁘게 넣기
  - 오른쪽에는 Profile만 예쁘게 나오게 바꾸기

### Repo Reality (verified)

**Notice authoring + render pipeline**
- Admin editor: `src/app/admin-8f3a9c2d4b1e/page.tsx` (Toast UI Editor, WYSIWYG)
- Content storage: HTML string in D1 via `src/app/api/notices/route.ts` (+ `[id]/route.ts`)
- Public render: `src/app/notices/page.tsx` uses `dangerouslySetInnerHTML`
- Image upload/serve: `src/app/api/upload/route.ts` -> R2, served by `src/app/api/images/[...key]/route.ts`

**Doctor section**
- `src/app/page.tsx` `section#doctor`
- Right column currently: two stacked cards ("한의학박사+name" and "Doctor's Profile")

**Testing**
- Playwright exists with a working spec: `e2e/task-9-admin-notice.e2e.spec.mjs`
- No unit test suite; rely on Playwright + `npm run build` + `npm run lint` + `npx tsc --noEmit`

### Metis Review (guardrails applied)
- Keep scope tight: no captions/alignment/lightbox for images.
- Hardcode allowed size values (S/M/L/Full) via CSS, do not allow arbitrary user-driven sizing.
- Ensure mobile-safe behavior: `max-width: 100%` always.
- Handle UX edge case: size preset clicked with no image selected.
- Note security: `dangerouslySetInnerHTML` implies XSS risk if admins can inject scripts. This plan does NOT add full sanitization (out of scope) but avoids introducing new injection surfaces.

---

## Work Objectives

### Core Objective
Enable notice authors to set per-image size presets at write time (admin editor), and ensure consistent responsive rendering in public notices; refresh the doctor section UI with an inline credential badge and a profile-only right column.

### Scope
- IN:
  - Toast UI editor toolbar/popup for image size presets
  - Persist size choice in saved HTML (`data-notice-size` on `<img>`)
  - CSS for public notices and editor preview so preset sizes actually render
  - Doctor section markup refresh limited to badge + right column card restructure
  - Playwright e2e updates to cover these flows
- OUT:
  - Image alignment (left/center/right), captions, lightbox, zoom
  - Arbitrary width input (px/% entry)
  - Overhauling notice typography beyond image-related CSS
  - Full HTML sanitization pipeline (documented risk)

### Defaults Applied (explicit)
- Image preset mapping (hardcoded):
  - S: 320px
  - M: 480px
  - L: 640px
  - Full: 100%
- Attribute name for persistence: `data-notice-size="sm|md|lg|full"`
- Unsized images (existing content): render responsively with `max-width: 100%` and no preset width.
- Doctor Profile heading: keep English-ish label as currently used ("Doctor's Profile"), but restructure content; if desired later, change to Korean without changing layout.
- Note on `.prose`: Tailwind Typography plugin is not enabled in `tailwind.config.ts` (plugins: `[]`). We still keep the existing `className="prose"` usages and add our own scoped CSS rules for images under `.prose img`.

---

## Verification Strategy (MANDATORY)

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> All verification steps must be runnable by the executing agent (Playwright + CLI commands). No “user manually checks”.

### Test Decision
- **Infrastructure exists**: YES (Playwright E2E only)
- **Automated tests**: Tests-after (add/extend Playwright specs)
- **Framework**: `@playwright/test` via `npx playwright test`

### Agent-Executed QA Scenarios (global)

Run environment (typical):
1) `npm ci`
2) Start Cloudflare preview server: `npm run preview` (expects `http://localhost:8787`)
3) Run tests: `npx playwright test`

Evidence location:
- Screenshots saved under `.sisyphus/evidence/` (follow existing naming pattern in `e2e/task-9-admin-notice.e2e.spec.mjs`).

---

## Execution Strategy

Wave 1 (can run in parallel):
- Task 1: Notice image size CSS (public + editor preview)
- Task 2: Doctor section UI update (badge + profile-only right column)

Wave 2 (after Wave 1):
- Task 3: Toast UI editor toolbar + command to set `data-notice-size`

Wave 3 (after Wave 2):
- Task 4: Extend Playwright tests for image sizing + doctor section
- Task 5: Full verification run (build/lint/tsc + Playwright)

Critical Path: Task 3 -> Task 4 -> Task 5

---

## TODOs

> Implementation + Verification are combined per task.

- [ ] 1. Add CSS rules for notice image sizing (public + admin preview)

  **What to do**:
  - Add scoped CSS to `src/app/globals.css` for:
    - Public notice content container (currently uses `prose` class in `src/app/notices/page.tsx`)
    - Toast UI editor preview container (`.toastui-editor-contents`)
  - Ensure all images are mobile-safe:
    - `max-width: 100%`
    - `height: auto`
  - Apply preset widths via `data-notice-size` values:
    - `sm` -> 320px
    - `md` -> 480px
    - `lg` -> 640px
    - `full` -> 100%

  **Must NOT do**:
  - Do not introduce global `img { ... }` rules (must stay scoped).
  - Do not add typography overhaul; keep changes limited to image sizing/stability.
  - Do not use CSS `attr()` for widths.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: CSS scoping + responsive behavior.
  - **Skills**: `frontend-ui-ux`
    - `frontend-ui-ux`: helps keep styling consistent with existing palette/flat style.
  - **Skills Evaluated but Omitted**:
    - `playwright`: not needed for the CSS-only change itself (tests come later).

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 4, Task 5
  - **Blocked By**: None

  **References**:
  - `src/app/notices/page.tsx` - notice content is rendered inside `className="... prose ..."` and uses `dangerouslySetInnerHTML`.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx` - admin list preview also uses `prose` for HTML preview; editor content lives under `.toastui-editor-contents`.
  - `src/app/globals.css` - where design system CSS vars and component classes live; add scoped rules here.

  **Acceptance Criteria**:
  - [ ] CSS added only under scoped selectors (`.prose img...`, `.toastui-editor-contents img...`).
  - [ ] On mobile viewport (375px), any notice image does not overflow its container.
  - [ ] Preset attribute widths apply when `data-notice-size` is present.

  **Agent-Executed QA Scenarios**:
  ```
  Scenario: Sized notice images remain responsive on mobile
    Tool: Playwright
    Preconditions: Preview server running on http://localhost:8787
    Steps:
      1. Create a notice via admin (reuse the existing flow in `e2e/task-9-admin-notice.e2e.spec.mjs`):
         - Upload an image
         - Save
      2. Navigate to: http://localhost:8787/notices
      3. Set viewport: 375x800
      4. Locate: article containing the test title (e.g., "Test Notice") then find the first `img`
      5. Assert: image boundingBox width <= article content width
      6. Screenshot: .sisyphus/evidence/task-1-notice-img-mobile.png
    Expected Result: No horizontal overflow
    Evidence: .sisyphus/evidence/task-1-notice-img-mobile.png
  ```

- [ ] 2. Update homepage doctor section: inline "한의학박사" badge + right column Profile-only

  **What to do**:
  - In `src/app/page.tsx` `section#doctor`:
    - Update the `h2` to include an inline badge (small pill) "한의학박사" next to "{site.doctorName} 원장".
    - Simplify the right column:
      - Remove the separate "한의학박사 + name" inner card.
      - Keep a single, nicer "Profile" card (based on existing second card) with improved spacing/structure.
    - Add stable attributes for e2e selectors (recommended):
      - `data-testid="doctor-credential-badge"` on the "한의학박사" badge
      - `data-testid="doctor-profile-card"` on the right Profile card container
  - (Optional but recommended) Move profile content into `src/lib/site.ts` so it is not hardcoded in `src/app/page.tsx`.

  **Must NOT do**:
  - Do not change other homepage sections.
  - Do not introduce new UI libraries.
  - Do not change overall section spacing conventions (`py-24 md:py-40`).

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: precise, design-consistent layout/typography changes.
  - **Skills**: `frontend-ui-ux`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 4, Task 5
  - **Blocked By**: None

  **References**:
  - `src/app/page.tsx` - current doctor section markup and right column card structure.
  - `src/lib/site.ts` - has `doctorName`; add `doctorTitle`/profile data here if extracting.
  - `src/app/globals.css` - existing primitives like `.flat-card`, `.flat-chip`, `--jade`, `--paper-2`.

  **Acceptance Criteria**:
  - [ ] Home page renders "김형규 원장" with an inline "한의학박사" badge (same line on desktop; wraps gracefully on mobile).
  - [ ] Right column contains only one Profile card (no separate credential/name card).
  - [ ] `npm run build` still succeeds.

  **Agent-Executed QA Scenarios**:
  ```
  Scenario: Doctor section badge + profile-only card
    Tool: Playwright
    Preconditions: Preview server running on http://localhost:8787
    Steps:
      1. Navigate to: http://localhost:8787/
      2. Scroll to: section#doctor
      3. Assert: section#doctor h2 contains text "김형규" and "원장"
      4. Assert: locator `[data-testid="doctor-credential-badge"]` is visible and contains text "한의학박사"
      5. Assert: locator `[data-testid="doctor-profile-card"]` is visible
      6. Assert: `section#doctor` contains text "한의학박사" exactly once (badge only)
      7. Screenshot: .sisyphus/evidence/task-2-doctor-section.png
    Expected Result: Badge present; right side is Profile-only
    Evidence: .sisyphus/evidence/task-2-doctor-section.png
  ```

- [ ] 3. Add Toast UI editor control: image size presets (S/M/L/Full) persisted via `data-notice-size`

  **What to do**:
  - In `src/app/admin-8f3a9c2d4b1e/page.tsx` after editor creation:
    - Add a custom command for WYSIWYG mode that:
      - Detects the currently selected image node
      - Applies `data-notice-size` attribute via ProseMirror transaction (`tr.setNodeMarkup`)
      - Handles "no image selected" gracefully (show alert or toast)
    - Add a toolbar item (icon + popup) to choose preset sizes:
      - S / M / L / Full
      - Calls `editor.exec('setNoticeImageSize', { size: 'sm'|'md'|'lg'|'full' })`
      - Provide a stable accessible label for Playwright selectors (recommended): `tooltip: 'Image Size'` and/or `aria-label="Image Size"`.
  - Ensure attribute persists when:
    - saving notice (`getHTML()` output includes the attribute)
    - re-editing notice (`setHTML(notice.content)` preserves it)

  **Must NOT do**:
  - Do not allow arbitrary values beyond the four presets.
  - Do not add a new route, DB migration, or backend changes.
  - Do not rely on inline `style="width: ..."` (use `data-notice-size` + CSS).

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: non-trivial editor integration (ProseMirror transaction + toolbar customization).
  - **Skills**: (none required)
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: useful but optional; main risk is editor API correctness.

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 4, Task 5
  - **Blocked By**: Task 1 (CSS should exist so preview matches), Task 2 (independent but keep wave ordering)

  **References**:
  - `src/app/admin-8f3a9c2d4b1e/page.tsx` - current editor initialization, existing toolbar + image upload hook.
  - Toast UI docs: https://github.com/nhn/tui.editor/blob/master/docs/en/toolbar.md - `insertToolbarItem` usage.
  - Toast UI example: https://nhn.github.io/tui.editor/latest/tutorial-example15-customizing-toolbar-buttons
  - ProseMirror pattern reference (Toast UI source, external): `apps/editor/src/wysiwyg/plugins/task.ts` uses `tr.setNodeMarkup(...)`.

  **Acceptance Criteria**:
  - [ ] Toolbar shows an "Image Size" control with S/M/L/Full choices.
  - [ ] With an image selected, choosing a preset sets `data-notice-size` on that `<img>`.
  - [ ] With no image selected, choosing a preset does NOT throw; user gets a clear message.
  - [ ] Saving and re-opening a notice preserves the attribute.

  **Agent-Executed QA Scenarios**:
  ```
  Scenario: Apply "M" preset to uploaded image and persist
    Tool: Playwright
    Preconditions: Preview server running on http://localhost:8787
    Steps:
      1. Navigate to: http://localhost:8787/admin-8f3a9c2d4b1e
      2. Login with password (env or default used by existing spec)
      3. Create a notice with an uploaded image (reuse existing flow)
      4. Click the inserted image in editor
      5. Use the new size control -> choose "M"
      6. Assert: editor content img has attribute data-notice-size="md"
      7. Save notice
      8. Re-open notice for editing
      9. Assert: editor content img still has data-notice-size="md"
      10. Screenshot: .sisyphus/evidence/task-3-image-size-md.png
    Expected Result: Preset applied and persisted
    Evidence: .sisyphus/evidence/task-3-image-size-md.png
  ```

- [ ] 4. Extend Playwright e2e coverage for image sizing + doctor section

  **What to do**:
  - Extend `e2e/task-9-admin-notice.e2e.spec.mjs`:
    - After uploading image, apply a preset (e.g., M) and assert attribute exists.
    - After publishing, verify the public notice contains `img[data-notice-size="md"]` and it renders without overflow on mobile.
  - Add a new spec file for doctor section (recommended): `e2e/task-10-doctor-section.e2e.spec.mjs`.
    - Verify badge exists near doctor heading.
    - Verify right column only has Profile card.
    - Capture evidence screenshots.

  **Must NOT do**:
  - Do not add flaky assertions (avoid timing-based sleeps; use `expect(...).toBeVisible()` etc).

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `playwright`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 5
  - **Blocked By**: Task 3

  **References**:
  - `e2e/task-9-admin-notice.e2e.spec.mjs` - existing patterns for editor interactions + evidence screenshots.
  - `src/app/page.tsx` - doctor section DOM selectors.

  **Acceptance Criteria**:
  - [ ] `npx playwright test` passes locally against preview server.
  - [ ] Evidence screenshots are written under `.sisyphus/evidence/` for the new scenarios.

- [ ] 5. Full verification run (CI-like)

  **What to do**:
  - Run:
    - `npm run lint`
    - `npx tsc --noEmit`
    - `npm run build`
    - `npx playwright test`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `playwright`

  **Acceptance Criteria**:
  - [ ] All commands exit 0.

---

## Success Criteria

### Verification Commands
```bash
npm run lint
npx tsc --noEmit
npm run build

# in another terminal (or tmux): start preview server
npm run preview

# run Playwright against preview
npx playwright test
```

### Final Checklist
- [ ] Notice admin editor: image size presets apply to selected image
- [ ] Notice public page: sized images render correctly and remain responsive on mobile
- [ ] Doctor section: inline "한의학박사" badge + right column is Profile-only
- [ ] Playwright evidence captured under `.sisyphus/evidence/`
