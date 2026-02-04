# Notice Markdown Editor Rebuild (Sebong Clinic)

## TL;DR

> **Quick Summary**: Rebuild the admin notice editor to be **Markdown-first (GFM)** with **in-editor preview** and **image upload**, while keeping existing notices intact.
>
> **Core Strategy**: Store **Markdown source** for new notices, but keep rendering pipeline **HTML + sanitize** for public display to avoid preview/publish drift.
>
> **Deliverables**:
> - D1 schema supports dual-format notices (legacy HTML + new Markdown).
> - Admin editor: Toast UI Editor (Markdown) + image upload + no external preview panel.
> - API: accepts Markdown + derived HTML; returns both formats for editing.
> - Sanitizer supports GFM output (tables, task lists, strikethrough, code fences).
> - Playwright E2E updated to verify the full pipeline.
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES (2 waves)
> **Critical Path**: DB schema → API contract → Admin editor → Sanitizer updates → E2E

---

## Context

### Original Request (Korean)
- "공지사항 게시글 작성을 위한 Text Editor 전체 기능 재 구축"
- 이미지 첨부 가능
- 모든 Markdown 문법 가능 (결정: GFM 기준)
- 미리보기는 Text Editor 내에서만
- 가장 다루기 편한 Text Editor 사용
- 사용한 Markdown 결과 그대로 게시글 작성

### Current Implementation Snapshot (verified)
- Admin editor is already Toast UI Editor and uses **HTML storage** today: `src/app/admin-8f3a9c2d4b1e/page.tsx`.
- Notices table is `db/schema.sql` with `notices(id,title,content,created_at,updated_at)`; `content` is HTML.
- Rendering is HTML via `dangerouslySetInnerHTML` + `sanitizeNoticeHtml`: `src/app/notices/page.tsx` + `src/lib/sanitize.ts`.
- Upload pipeline already exists: `src/app/api/upload/route.ts` → `src/app/api/images/[...key]/route.ts`.
- Existing E2E test covers current editor including custom image resize: `e2e/task-9-admin-notice.e2e.spec.mjs`.

### Decisions Locked In
- Keep **Toast UI Editor**.
- Keep existing notices as **HTML**.
- New notices: **Markdown source stored** (GFM), and the **published result must match** what the editor produced.
- Remove custom image resize/width authoring UI (no drag handle, no `data-notice-width` authoring).
- Update/extend Playwright E2E tests.

---

## Work Objectives

### Core Objective
Make notice authoring Markdown-first (GFM) with integrated preview and image uploads, while preserving public rendering safety and backwards compatibility.

### Concrete Deliverables
- D1 schema supports: legacy HTML notices + Markdown notices.
- API supports CRUD for both formats.
- Admin editor UI saves Markdown source + derived sanitized HTML.
- Public `/notices` continues to render sanitized HTML reliably.
- Sanitizer supports GFM output (tables/task lists/strikethrough/code fences).
- E2E proves: create Markdown notice → image upload → public render; and legacy HTML notices still render.

### Definition of Done
- `npx tsc --noEmit` passes.
- `npm run lint` passes.
- `npm run build` passes.
- `npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs` passes (updated).

---

## Verification Strategy (MANDATORY)

All acceptance criteria must be agent-executable (Playwright + CLI). No manual verification steps.

### Test Decision
- **Infrastructure exists**: YES (Playwright in `e2e/`)
- **Automated tests**: Tests-after (update existing E2E + add coverage inside it)

---

## Execution Strategy

### Wave Plan

Wave 1 (Data + Contract):
- Task 1 (DB schema)
- Task 2 (Types)
- Task 3 (API)

Wave 2 (UI + Security + QA):
- Task 4 (Admin editor rebuild)
- Task 5 (Sanitizer/GFM HTML whitelist)
- Task 6 (Public rendering compatibility checks)
- Task 7 (Playwright E2E updates)
- Task 8 (Full verification commands)

Critical Path: 1 → 3 → 4 → 5 → 7 → 8

---

## TODOs

### 1) D1 Schema: Add Markdown Support Columns

**What to do**:
- Extend the notices schema in `db/schema.sql` to support dual format.
- Introduce:
  - `format TEXT NOT NULL DEFAULT 'html'` (values: `'html' | 'markdown'`)
  - `content_md TEXT` (nullable) to store Markdown source for `format='markdown'`
- Plan and execute a D1 migration so existing rows become `format='html'` without changing `content`.

**Must NOT do**:
- Do not rewrite existing HTML content.
- Do not remove/rename existing `content` column (keep stable for public rendering).

**Recommended Agent Profile**:
- Category: `unspecified-high` (schema + API contract changes)
- Skills: none required

**Parallelization**:
- Can Run In Parallel: YES (with Task 2)
- Blocks: Task 3, Task 4

**References**:
- `db/schema.sql` - current `notices` schema (single `content` TEXT).
- `src/app/api/notices/route.ts` - assumes `content` always exists and is HTML.

**Acceptance Criteria (agent-executable)**:
- A migration path is defined (file-based SQL or `wrangler d1 execute` command) and documented in the PR/notes.
- Query shows new columns exist:
  - Command (example, production): `wrangler d1 execute sebongclinic-db --command "PRAGMA table_info(notices);"`
  - Command (example, staging): `wrangler d1 execute sebongclinic-db-staging --command "PRAGMA table_info(notices);" --env staging`
  - Expected: rows include `format` and `content_md`.

**Agent-Executed QA Scenario (CLI)**:
```
Scenario: Schema contains format/content_md
  Tool: Bash (wrangler)
  Preconditions: Wrangler configured to target the same D1 database used by the project
  Steps:
    1. Execute: wrangler d1 execute sebongclinic-db --command "PRAGMA table_info(notices);"
    2. Assert: output includes column name "format"
    3. Assert: output includes column name "content_md"
  Expected Result: D1 schema supports dual-format notices
  Evidence: terminal output captured in CI logs
```

---

### 2) Update Notice Types to Include New Fields

**What to do**:
- Update Notice type to include:
  - `format: 'html' | 'markdown'`
  - `content_md?: string | null`

**References**:
- `src/types/cloudflare.d.ts` - current `Notice` type used across admin + public pages.

**Acceptance Criteria**:
- `npx tsc --noEmit` passes after type updates.

---

### 3) API: Store Sanitized HTML + Optional Markdown Source

**What to do**:
- Update CRUD endpoints to support the new fields while keeping backwards compatibility.
- POST/PUT should accept JSON body like:
  - Legacy HTML notice:
    - `{ title, content: <html>, password, format: 'html' }`
  - Markdown notice:
    - `{ title, content: <html-from-editor>, content_md: <markdown>, password, format: 'markdown' }`
- Enforce:
  - Always sanitize `content` with `sanitizeNoticeHtml()` before storage.
  - `format='markdown'` requires `content_md` (non-empty) and `content` (non-empty).
  - `format='html'` requires `content` (non-empty); `content_md` must be null/ignored.
- GET endpoints should return `{ notices: Notice[] }` / `{ notice: Notice }` including `format` and `content_md`.
- Keep security patterns unchanged: same-origin check + timing-safe password compare.

**Must NOT do**:
- Do not remove defense-in-depth sanitize-on-read.

**References**:
- `src/app/api/notices/route.ts` - current GET sanitizes on read; POST sanitizes on write.
- `src/app/api/notices/[id]/route.ts` - PUT/DELETE patterns.
- `src/lib/sanitize.ts` - current whitelist (needs expansion in Task 5).

**Acceptance Criteria**:
- `GET /api/notices` returns objects containing `format`.
- `POST /api/notices` with `format='markdown'` persists `content_md` and returns sanitized HTML in `content`.

**Agent-Executed QA Scenario (API via Playwright request or curl)**:
```
Scenario: Create markdown notice via API
  Tool: Bash (curl)
  Preconditions: dev server running on http://localhost:3000, ADMIN_PASSWORD set
  Steps:
    1. POST /api/notices with JSON including format=markdown, content_md and content
    2. Assert: HTTP 201
    3. Assert: response.content does not include <script
  Expected Result: Markdown notices can be created and stored safely
  Evidence: response body captured
```

---

### 4) Admin Editor: Markdown-First Save, In-Editor Preview Only

**What to do**:
- Refactor `src/app/admin-8f3a9c2d4b1e/page.tsx`:
  - Remove the separate "게시 미리보기" panel (`previewHtml` state + `previewRef` DOM + `dangerouslySetInnerHTML`).
  - Remove custom image resize handle and related ProseMirror commands/state.
  - Keep Toast UI Editor in Markdown mode with built-in preview (e.g., `previewStyle: 'vertical'`).
  - Ensure preview is sanitized consistently:
    - Prefer using Toast UI option `customHTMLSanitizer` wired to `sanitizeNoticeHtml`.
  - On submit for Markdown notices:
    - `content_md = editor.getMarkdown()`
    - `content_html = sanitizeNoticeHtml(editor.getHTML())`
    - Send: `{ title, content: content_html, content_md, format: 'markdown', password }`
  - For editing legacy HTML notices:
    - Keep legacy edit path (format='html') using `setHTML(notice.content)` and saving as HTML.
    - Show a clear UI warning in the editor header when editing a legacy HTML notice.

**Must NOT do**:
- Do not build a new standalone preview UI; use editor preview only.
- Do not implement drag-resize or width preset features.

**References**:
- `src/app/admin-8f3a9c2d4b1e/page.tsx` - current: separate preview panel at lines ~623-630; drag handle UI at ~94-220 and ~594-620; save uses `getHTML()` at ~481-498.
- `src/app/api/upload/route.ts` - current upload contract used by `addImageBlobHook`.

**Acceptance Criteria**:
- Admin page shows only the editor's own preview (no extra "게시 미리보기" section).
- Creating a new notice stores `format='markdown'` and `content_md`.
- Image insert still works through `/api/upload`.

**Agent-Executed QA Scenarios (Playwright)**:
```
Scenario: Editor preview is inside editor only
  Tool: Playwright
  Preconditions: Dev server running on http://localhost:3000
  Steps:
    1. Navigate to http://localhost:3000/admin-8f3a9c2d4b1e
    2. Fill input[type="password"] with ADMIN_PASSWORD
    3. Click button[name="로그인"]
    4. Assert: .toastui-editor-defaultUI is visible
    5. Assert: page does NOT contain heading text "게시 미리보기"
  Expected Result: No separate preview section exists
  Evidence: screenshot .sisyphus/evidence/task-4-no-external-preview.png

Scenario: Save Markdown notice uses Markdown source
  Tool: Playwright
  Preconditions: Logged in admin
  Steps:
    1. Fill title input[placeholder="제목"] with "GFM Notice"
    2. Type markdown into the editor (markdown mode):
       "# Title\n\n- [x] done\n- [ ] todo\n\n|a|b|\n|-|-|\n|1|2|\n\n~~strike~~"
    3. Click button[name="작성 완료"]
    4. Wait for POST /api/notices response
    5. Assert: response JSON includes content_md (or the DB contains it)
  Expected Result: Markdown source is persisted
  Evidence: screenshot .sisyphus/evidence/task-4-create-markdown.png
```

---

### 5) Sanitizer: Allow GFM Output Safely

**What to do**:
- Update `src/lib/sanitize.ts` whitelist to preserve HTML output from GFM Markdown:
  - Add: `table`, `thead`, `tbody`, `tr`, `th`, `td`, `del`, `input`
  - Allow safe attrs:
    - `th`: `align` (optional)
    - `td`: `align` (optional)
    - `input`: `type`, `checked`, `disabled` (only allow `type="checkbox"`)
- Add validation in `onTagAttr` for input:
  - Only allow checkbox inputs (strip everything else).
- Keep existing safety checks for URLs and `on*` handlers.

**Must NOT do**:
- Do not allow arbitrary styles.
- Do not allow arbitrary input types.

**References**:
- `src/lib/sanitize.ts` - current whitelist lacks table/input/del.

**Acceptance Criteria**:
- Given rendered HTML containing `<table>`/`<del>`/`<input type="checkbox" disabled checked>`, sanitizer preserves the structure while stripping unsafe attrs.

---

### 6) Public Notices Rendering: Preserve Legacy + Show Markdown Output

**What to do**:
- Keep public rendering path as HTML (`notice.content`) to avoid drift and avoid bundling a new markdown renderer.
- Ensure `GET /api/notices` continues to return sanitized HTML in `content` for both formats.
- Ensure legacy HTML notices remain unchanged.

**References**:
- `src/app/notices/page.tsx` - uses `dangerouslySetInnerHTML` with `sanitizeNoticeHtml(notice.content)`.
- `src/app/api/notices/route.ts` - sanitize on read.

**Acceptance Criteria**:
- `/notices` page renders:
  - tables as `<table>`
  - task lists as `<input type="checkbox">`
  - strikethrough as `<del>`
  for newly created Markdown notices.

---

### 7) Playwright E2E: Update Existing Test for New Behavior

**What to do**:
- Update `e2e/task-9-admin-notice.e2e.spec.mjs`:
  - Remove assertions around drag-resize and `data-notice-width` persistence.
  - Add assertions for GFM rendering on public page.
  - Keep image upload check, but assert that the created notice on `/notices` shows the uploaded image.
  - Add an XSS regression scenario to ensure sanitizer strips dangerous content.

**References**:
- `e2e/task-9-admin-notice.e2e.spec.mjs` - currently heavily coupled to drag handle + `data-notice-width`.
- `src/app/admin-8f3a9c2d4b1e/page.tsx` - editor DOM selectors used by test.
- `src/lib/sanitize.ts` - XSS behavior.

**Acceptance Criteria**:
- `npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs` passes.
- Evidence screenshots saved under `.sisyphus/evidence/` (update filenames if needed).

**Agent-Executed QA Scenarios (Playwright)**:
```
Scenario: Create GFM notice and verify public render
  Tool: Playwright
  Preconditions: Dev server running; ADMIN_PASSWORD available
  Steps:
    1. Admin login
    2. Create notice titled "GFM Test"
    3. Insert markdown containing: table, task list, ~~strike~~, fenced code
    4. Save
    5. Navigate to /notices
    6. Locate article containing "GFM Test"
    7. Assert: article has table element
    8. Assert: article has input[type="checkbox"] elements
    9. Assert: article has del element containing strike text
    10. Screenshot: .sisyphus/evidence/task-7-gfm-public.png
  Expected Result: Public page matches editor-produced HTML output

Scenario: XSS is stripped
  Tool: Playwright
  Preconditions: Admin logged in
  Steps:
    1. Create notice titled "XSS Test"
    2. Insert markdown containing inline HTML with onerror, script tag, javascript: link
    3. Save
    4. Go to /notices and locate "XSS Test"
    5. Assert: innerHTML does NOT contain "<script" nor "onerror=" nor "javascript:"
    6. Screenshot: .sisyphus/evidence/task-7-xss-sanitized.png
  Expected Result: Sanitizer blocks common XSS vectors
```

---

### 8) Full Verification Pass

**What to do**:
- Run:
  - `npx tsc --noEmit`
  - `npm run lint`
  - `npm run build`
  - `npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs`

**Acceptance Criteria**:
- All commands exit 0.

---

## Commit Strategy (suggested)

- Commit A: `feat: add markdown fields to notices schema` (schema + types)
- Commit B: `feat: support markdown notices in API` (API contract)
- Commit C: `feat: rebuild admin notice editor for markdown-first` (UI)
- Commit D: `fix: allow gfm tags in notice sanitizer` (sanitize)
- Commit E: `test: update admin notice editor e2e for markdown` (Playwright)

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit
npm run lint
npm run build
npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs
```

### Final Checklist
- [ ] New notices store Markdown source (`content_md`) and are labeled `format='markdown'`.
- [ ] Public notices render tables/task lists/strikethrough correctly.
- [ ] Image uploads still work.
- [ ] No separate preview panel exists in admin page.
- [ ] XSS vectors are stripped.
- [ ] Existing HTML notices still render.
