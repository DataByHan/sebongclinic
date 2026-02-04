# Fix Published Notices Showing Raw Markdown

## TL;DR

> **Quick Summary**: Fix the case where notices render raw Markdown on `/notices` after saving by making the API **defensively render Markdown** when `format='markdown'` but `content_md` is missing/empty.
>
> **Deliverables**:
> - API GET (list + detail) always returns `notice.content` as **sanitized HTML** for markdown notices, even in corrupted/legacy states.
> - Verification scenarios (curl + wrangler) prove the fallback works and does not regress `format='html'`.

**Estimated Effort**: Short
**Parallel Execution**: NO (small change, sequential)
**Critical Path**: Identify bad rows → Implement GET fallback → Verify with preview + D1

---

## Context

### Reported Symptom
- In the admin Toast UI Editor, Markdown preview looks correct.
- After saving, the published notice view shows the Markdown source (e.g. `# Title`, `- item`) instead of rendered HTML.

### What the Repo Currently Does (verified)
- Public page renders HTML from `notice.content`:
  - `src/app/notices/page.tsx` uses `dangerouslySetInnerHTML={{ __html: sanitizeNoticeHtml(notice.content) }}`
- Admin editor saves Markdown notices as:
  - `content_md = editor.getMarkdown()`
  - `content = sanitizeNoticeHtml(await marked(markdown))`
  - `format = 'markdown'`
  - `src/app/admin-8f3a9c2d4b1e/page.tsx`
- API GET (list) renders from `content_md` only when present; otherwise falls back to `content`:
  - `src/app/api/notices/route.ts`
- API GET (detail) has similar behavior:
  - `src/app/api/notices/[id]/route.ts`

### Most Likely Root Cause
If a row ends up in the state:
- `format = 'markdown'`
- `content_md` is `NULL`/empty
- `content` contains **raw Markdown** (not HTML)

Then the GET handler falls back to `content` and returns raw Markdown to the client; `/notices` dutifully renders it as plain text.

---

## Work Objectives

### Core Objective
Ensure that for markdown notices, API responses always provide `content` as **sanitized HTML**, even if the DB row is missing `content_md`.

### Scope
- IN:
  - Add a defensive fallback in API GET list + detail.
  - Add safe heuristics + error handling around fallback rendering.
  - Add agent-executable verification steps using Workers preview + D1.
- OUT:
  - Adding a client-side Markdown renderer library to `/notices`.
  - Changing Toast UI Editor UX.
  - Automatic production data migration (optional, separate task).

---

## Verification Strategy (MANDATORY)

All verification must be agent-executable (no human/manual checks).

### Test Decision
- **Infrastructure exists**: YES (Playwright in `e2e/`)
- **Automated tests**: Tests-after (keep this fix small; verification via curl/wrangler is sufficient; optional Playwright follow-up)

### Primary Verification Environment
Use Cloudflare Workers preview so D1/R2 bindings exist:
- Start: `npm run preview`
- Base URL: `http://localhost:8787`

---

## TODOs

### 1) Confirm DB Has "Broken" Rows (format=markdown but no content_md)

**What to do**:
- Check D1 for rows where `format='markdown'` and `content_md` is `NULL` or empty.
- Capture a single example row ID (if any) for deterministic verification.

**References**:
- `db/schema.sql` (columns: `format`, `content_md`, `content`)

**Agent-Executed QA Scenario (CLI / wrangler)**:
```
Scenario: Find markdown notices missing content_md
  Tool: Bash (wrangler)
  Preconditions: Wrangler configured; local D1 state exists (or use staging/prod explicitly)
  Steps:
    1. Run: npx wrangler d1 execute sebongclinic-db --command "SELECT id, title, format, length(content) AS content_len, length(content_md) AS content_md_len FROM notices WHERE format='markdown' AND (content_md IS NULL OR trim(content_md)='') ORDER BY id DESC LIMIT 5;"
    2. Assert: Query runs successfully (exit 0)
    3. Record: one example id if any rows returned
  Expected Result: We know whether the corrupted state exists and can reproduce
  Evidence: terminal output captured
```

**Acceptance Criteria**:
- The query executes successfully and output is captured.

---

### 2) Implement Defensive Markdown Rendering Fallback in API GET (List + Detail)

**What to do**:
- Update API GET handlers to guarantee that for `format='markdown'`, the returned `content` is HTML.
- Logic requirements:
  1. If `format='markdown'` and `content_md` is non-empty: render `marked(content_md)`.
  2. Else if `format='markdown'` and `content_md` is empty:
     - If `content.trim().startsWith('<')`: treat as already-HTML and use it (still sanitize).
     - Otherwise: treat `content` as markdown source and render `marked(content)`.
  3. Wrap the fallback `marked(...)` call in `try/catch`:
     - On error: log `console.error` and fall back to using raw `content` (still sanitized) so the endpoint never 500s.
- Keep defense-in-depth sanitization **after** rendering.

**Must NOT do**:
- Do not change `/notices` page rendering.
- Do not remove sanitization on read.
- Do not alter behavior for `format='html'`.

**References**:
- `src/app/api/notices/route.ts` (GET list; current fallback uses `n.content` directly)
- `src/app/api/notices/[id]/route.ts` (GET detail; align behavior with list)
- `src/lib/sanitize.ts` (must sanitize final HTML)

**Agent-Executed QA Scenarios**:

```
Scenario: API list returns HTML for normal markdown notice
  Tool: Bash (wrangler + curl)
  Preconditions: Workers preview running on http://localhost:8787; D1 local state accessible
  Steps:
    1. Insert a normal markdown notice row (content_md present, content already HTML):
       npx wrangler d1 execute sebongclinic-db --command "INSERT INTO notices (title, content, format, content_md, created_at, updated_at) VALUES ('MD normal', '<h1>Title</h1><ul><li>item</li></ul>', 'markdown', '# Title\n\n- item', datetime('now'), datetime('now'));"
    2. GET: curl -s http://localhost:8787/api/notices
    3. Assert: response contains "MD normal" and "<h1>" and does NOT contain "# Title"
  Expected Result: Normal markdown notice always returns HTML in JSON `notices[].content`
  Evidence: terminal output + response body captured

Scenario: API list returns HTML for broken markdown notice (no content_md)
  Tool: Bash (wrangler + curl)
  Preconditions: Workers preview running; D1 accessible via wrangler
  Steps:
    1. Insert a broken markdown notice row (content_md NULL, content contains raw markdown):
       npx wrangler d1 execute sebongclinic-db --command "INSERT INTO notices (title, content, format, content_md, created_at, updated_at) VALUES ('MD broken', '# Title\n\n- item', 'markdown', NULL, datetime('now'), datetime('now'));"
    2. GET: curl -s http://localhost:8787/api/notices
    3. Assert: response contains "MD broken" and contains "<h1>Title</h1>" (or "<ul>")
    4. Assert: response does NOT contain "# Title\n\n- item" for that notice (raw markdown should not leak)
  Expected Result: Fallback renders markdown stored in `content` into HTML before returning
  Evidence: terminal output + response body captured

Scenario: API detail endpoint returns HTML for broken markdown notice
  Tool: Bash (node + curl)
  Preconditions: Workers preview running; the 'MD broken' row exists from previous scenario
  Steps:
    1. Resolve id: node -e "fetch('http://localhost:8787/api/notices').then(r=>r.json()).then(j=>{const n=j.notices.find(x=>x.title==='MD broken'); if(!n) process.exit(2); console.log(n.id)})"
    2. GET: curl -s http://localhost:8787/api/notices/{id}
    3. Assert: response contains "<h1>Title</h1>" (or "<ul>") and does NOT contain raw "# Title"
  Expected Result: Detail GET mirrors list GET behavior
  Evidence: terminal output + response body captured
```

**Acceptance Criteria**:
- In both endpoints:
  - No state exists where `format='markdown'` causes raw Markdown to be returned as `content`.
  - `content` returned is always sanitized HTML.

---

### 3) Regression Check: HTML Notices Unchanged

**What to do**:
- Ensure `format='html'` notices continue to return `content` unchanged (except sanitization), and are not passed through `marked()`.

**References**:
- `src/app/api/notices/route.ts`
- `src/app/api/notices/[id]/route.ts`

**Agent-Executed QA Scenario (curl)**:
```
Scenario: HTML notice content is not markdown-rendered
  Tool: Bash (wrangler + curl)
  Preconditions: Workers preview running; D1 accessible via wrangler
  Steps:
    1. Insert an html notice row:
       npx wrangler d1 execute sebongclinic-db --command "INSERT INTO notices (title, content, format, content_md, created_at, updated_at) VALUES ('HTML control', '<p>Plain HTML</p>', 'html', NULL, datetime('now'), datetime('now'));"
    2. GET: curl -s http://localhost:8787/api/notices
    3. Assert: response contains "HTML control" and contains "<p>Plain HTML</p>"
  Expected Result: HTML notices behave as before
  Evidence: response body captured
```

**Acceptance Criteria**:
- `format='html'` notices show no behavior change.

---

### 4) Optional: Data Backfill / Cleanup (NOT required for fix)

**What to do**:
- If many broken rows exist, optionally backfill `content_md` for those rows and/or fix `content` to rendered HTML.
- This is optional and should be executed only after confirming the desired migration policy.

**Acceptance Criteria**:
- Optional task only; do not run automatically during the hotfix unless explicitly requested.

---

## Success Criteria

### Verification Commands
```bash
# Workers preview
npm run preview

# Confirm broken-row count (if any)
npx wrangler d1 execute sebongclinic-db --command "SELECT COUNT(*) AS n FROM notices WHERE format='markdown' AND (content_md IS NULL OR trim(content_md)='');"

# API list returns HTML (spot-check)
curl -s http://localhost:8787/api/notices | grep -q "<h1>" && echo "OK: HTML headings present"

# Sanity: API response shape
curl -s http://localhost:8787/api/notices | grep -q '"notices"' && echo "OK: response includes notices[]"
```

### Final Checklist
- [x] Markdown notices always render as HTML on `/notices` after save
- [x] Corrupted state (`format='markdown'` + missing `content_md`) no longer leaks raw Markdown
- [x] `format='html'` notices unchanged
- [x] No new client-side markdown rendering library added
