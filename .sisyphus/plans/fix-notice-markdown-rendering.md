# Fix Notice Markdown Rendering in GET APIs

## TL;DR

> **Quick Summary**: Ensure markdown-format notices (`notices.format = 'markdown'`) always return rendered HTML from GET endpoints by unconditionally rendering `content_md ?? content` via `marked()` with per-notice error isolation and a safe visible `<pre>` fallback.
>
> **Deliverables**:
> - Updated GET logic in `src/app/api/notices/route.ts` and `src/app/api/notices/[id]/route.ts`
> - (Optional but recommended) Playwright coverage that asserts rendered headings (no raw `#`) for markdown notices
>
> **Estimated Effort**: Short
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Update list GET + detail GET 4 Update/confirm E2E/QA 4 TS/Lint/Build verification

---

## Context

### Original Request
- Admin editor saves markdown notices correctly, but the notice list can show raw markdown instead of rendered HTML.

### Root Cause (confirmed)
- Both GET handlers implement conservative fallback rendering.
- If `marked()` throws or fallback conditions do not run, `renderedHtml` remains raw markdown and gets returned (sanitized, but still raw markdown text).

### Confirmed Data Model
- `format` is a per-notice D1 DB field (`notices.format`, default `html`).
- API response includes: `content` (should be rendered HTML), `format`, and `content_md` (raw source for markdown notices).

### Existing Security Posture
- Server sanitizes notice HTML in API routes via `sanitizeNoticeHtml()`.
- Client (`src/app/notices/page.tsx`) re-sanitizes before `dangerouslySetInnerHTML` (defense-in-depth).

---

## Work Objectives

### Core Objective
- For every notice row where `format === 'markdown'`, always compute `content` as rendered HTML derived from `content_md` when present, otherwise from `content` (legacy), and never return raw markdown text unless it is escaped inside a `<pre>` fallback.

### Concrete Deliverables
- `src/app/api/notices/route.ts`: Replace the existing markdown fallback block in GET mapping with unconditional markdown render + error fallback.
- `src/app/api/notices/[id]/route.ts`: Apply the identical fix in the single-notice GET handler.

### Definition of Done
- `curl -s http://localhost:3000/api/notices | jq -r '.notices[] | select(.format=="markdown") | .content' | head -n 1` contains rendered HTML tags (e.g. `<h1>`) and does not contain raw markdown headings like `# Heading`.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` all succeed.

### Must NOT Have (Guardrails)
- Do not change DB schema, migrations, or add new dependencies.
- Do not change POST/PUT behavior, request payloads, or API response shape.
- Do not remove sanitization. Continue sanitizing server-side output.
- Do not change behavior for `format === 'html'` notices.

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: YES (Playwright E2E in `e2e/`)
- **Automated tests**: Tests-after (add/adjust E2E if needed)
- **Framework**: Playwright

### Agent-Executed QA Scenarios (API + UI)

Scenario: Markdown notice renders as headings in public notices list
  Tool: Playwright (playwright skill)
  Preconditions: `npm run dev` running on `http://localhost:3000`; `ADMIN_PASSWORD` available for admin UI; clean-ish DB is OK.
  Steps:
    1. Navigate to: `http://localhost:3000/admin-8f3a9c2d4b1e`
    2. Fill admin password input with `process.env.ADMIN_PASSWORD`
    3. Create a new notice with title `E2E Markdown Heading` and markdown body:
       - `# Heading\n## H2\n### H3`
    4. Submit/save notice; wait for success toast/indicator.
    5. Navigate to: `http://localhost:3000/notices`
    6. Locate the notice item for title `E2E Markdown Heading`.
    7. Assert: within that notice content, there exists an `h1` with text `Heading`.
    8. Assert: notice content text does NOT contain a line starting with `# `.
    9. Screenshot: `.sisyphus/evidence/notice-markdown-renders-headings.png`
  Expected Result: Heading elements render; no raw markdown markers visible.

Scenario: API returns HTML for markdown notices
  Tool: Bash (curl + jq)
  Preconditions: Dev server running on `http://localhost:3000`.
  Steps:
    1. `curl -s http://localhost:3000/api/notices | jq -r '.notices[] | select(.title=="E2E Markdown Heading") | .content'`
    2. Assert: output contains `<h1>` (or `<h2>/<h3>` depending on notice).
    3. Assert: output does NOT contain a leading `# ` heading marker for that notice.
  Expected Result: Returned `.content` is HTML.

---

## Execution Strategy

### Parallel Execution Waves

Wave 1 (Start Immediately):
- Task 1: Baseline reproduction + evidence capture
- Task 2: Implement fix in list GET (`src/app/api/notices/route.ts`)
- Task 3: Implement fix in detail GET (`src/app/api/notices/[id]/route.ts`)

Wave 2 (After Wave 1):
- Task 4: Add/adjust Playwright E2E coverage for markdown rendering in list (optional but recommended)

Wave 3 (After Wave 2):
- Task 5: Run full verification commands (tsc/lint/build + e2e subset)

Critical Path: Task 2 + Task 3 4 Task 5

---

## TODOs (Execution Order)

- [ ] 1. Reproduce current failure and capture baseline evidence

  **What to do**:
  - Run dev server.
  - Create a markdown notice (admin UI) with `# Heading` etc.
  - Observe that the notices list shows raw markdown (baseline).
  - Capture evidence via screenshot and API output.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `playwright`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 2 and 3)
  - **Parallel Group**: Wave 1

  **References**:
  - `src/app/notices/page.tsx` - Public notices list rendering uses `dangerouslySetInnerHTML` with sanitized `notice.content`.
  - `e2e/task-9-admin-notice.e2e.spec.mjs` - Existing admin+notice E2E patterns (login, create notice, assertions).

  **Acceptance Criteria**:
  - [ ] Evidence captured: `.sisyphus/evidence/baseline-raw-markdown.png`
  - [ ] `curl -s http://localhost:3000/api/notices | jq -r '.notices[] | select(.format=="markdown") | .content' | head -n 1` shows raw markdown markers (e.g. `# `) for at least one markdown notice (baseline).

- [ ] 2. Fix markdown rendering logic in list GET handler

  **What to do**:
  - In `src/app/api/notices/route.ts` GET mapping, replace existing conditional fallback block with:
    - If `format !== 'markdown'`: leave `renderedHtml = n.content`.
    - If `format === 'markdown'`:
      - Compute `source = n.content_md?.trim() || n.content`.
      - If `source.trim()` is empty: set `renderedHtml = ''`.
      - Else `try { renderedHtml = await marked(source) } catch { renderedHtml = <escaped pre> }`.
      - Always sanitize: `sanitizeNoticeHtml(renderedHtml)`.
  - Fallback must escape at least `& < > " '` (default) and wrap in `<pre>`.
  - Log failures with notice id (structured JSON string is fine).

  **Must NOT do**:
  - Do not change JSON shape, DB queries, or how `format/content_md` are included.
  - Do not remove sanitization.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `git-master`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 3)
  - **Parallel Group**: Wave 1

  **References**:
  - `src/app/api/notices/route.ts` - Replace the block that currently logs `Markdown fallback failed:`.
  - `src/lib/sanitize.ts` - `sanitizeNoticeHtml()` whitelist includes `pre` (needed for fallback).

  **Acceptance Criteria**:
  - [ ] For markdown notices, GET path always attempts rendering with `marked()` using `content_md` preferentially.
  - [ ] On render error, response returns escaped `<pre>...</pre>` (not raw markdown) and does not crash the whole list.
  - [ ] `curl -s http://localhost:3000/api/notices | jq -r '.notices[] | select(.title=="E2E Markdown Heading") | .content'` contains `<h1>` and does not contain `# Heading`.

- [ ] 3. Apply the same markdown rendering fix to detail GET handler

  **What to do**:
  - Apply the identical logic from Task 2 to `src/app/api/notices/[id]/route.ts` GET handler.
  - Ensure per-notice error handling does not change response shape (`{ notice: ... }`).

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `git-master`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 2)
  - **Parallel Group**: Wave 1

  **References**:
  - `src/app/api/notices/[id]/route.ts` - Mirror the list routes rendering + fallback behavior.

  **Acceptance Criteria**:
  - [ ] `id=$(curl -s http://localhost:3000/api/notices | jq -r '.notices[] | select(.title=="E2E Markdown Heading") | .id' | head -n 1)` yields a numeric id.
  - [ ] `curl -s "http://localhost:3000/api/notices/${id}" | jq -r '.notice.content'` contains `<h1>` and does not contain `# Heading`.
  - [ ] HTML notices remain unchanged.

- [ ] 4. Add/adjust Playwright E2E coverage to prevent regression (recommended)

  **What to do**:
  - Extend `e2e/task-9-admin-notice.e2e.spec.mjs` (or add a small new spec) with an assertion that a markdown notice displays as headings on `/notices`.
  - Keep it minimal: create notice via admin UI; assert `h1` present and raw `#` not visible.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `playwright`

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on code changes)
  - **Parallel Group**: Wave 2

  **References**:
  - `e2e/task-9-admin-notice.e2e.spec.mjs` - Existing patterns for creating markdown notices and asserting rendered DOM.
  - `src/app/notices/page.tsx` - Rendering target under test.

  **Acceptance Criteria**:
  - [ ] `npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs` passes.
  - [ ] New assertion fails on baseline behavior (raw markdown) and passes after fix.

- [ ] 5. Run verification commands (typecheck, lint, build) and final API checks

  **What to do**:
  - Run:
    - `npx tsc --noEmit`
    - `npm run lint`
    - `npm run build`
  - Run a focused E2E (at least the notice test file) to ensure regression coverage.
  - Re-run the curl+jq checks from Success Criteria.
  - (Optional edge-runtime sanity) `npm run preview` and repeat the curl+jq checks against the preview base URL if it differs (commonly `http://localhost:8787`).

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `git-master`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` exits 0.
  - [ ] `npm run lint` exits 0.
  - [ ] `npm run build` exits 0.
  - [ ] `curl -s http://localhost:3000/api/notices | jq -r '.notices[] | select(.title=="E2E Markdown Heading") | .content'` contains `<h1>` and does not contain raw `# Heading`.

---

## Defaults Applied (override if needed)

- **Format trust**: Trust `notices.format` absolutely; if it says `markdown`, always attempt to render even if `content` already looks like HTML.
- **Empty markdown**: If `content_md?.trim()` is empty and `content.trim()` is empty, return `content: ''`.
- **Fallback escaping**: Escape `& < > " '` and wrap in `<pre>` (optionally `<pre><code>`).
- **Logging**: Log render failures with `noticeId` context using `console.error()` (structured JSON string recommended).

---

## References (for executor)

- `src/app/api/notices/route.ts` - List GET handler, markdown rendering fallback block.
- `src/app/api/notices/[id]/route.ts` - Detail GET handler, same markdown rendering logic.
- `src/lib/sanitize.ts` - `sanitizeNoticeHtml()` whitelist + URL guardrails; must remain in place.
- `src/app/notices/page.tsx` - Renders `notice.content` with `dangerouslySetInnerHTML` and re-sanitizes.
- `e2e/task-9-admin-notice.e2e.spec.mjs` - Existing markdown + sanitization E2E patterns to extend.
