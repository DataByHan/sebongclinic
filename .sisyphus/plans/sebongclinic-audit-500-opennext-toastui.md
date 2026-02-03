# Sebong Clinic: Fix Prod API 500 via OpenNext (Workers) + Toast UI Editor Upgrade

## TL;DR

> **Quick Summary**: Fix production `/api/notices` 500 by moving deployment from deprecated `@cloudflare/next-on-pages` (Cloudflare Pages Functions) to a Cloudflare Worker built with OpenNext (`@opennextjs/cloudflare`). Then make the admin notice editor usable by enabling a minimal Toast UI toolbar and wiring image uploads to the existing `/api/upload` → R2 pipeline.
>
> **Deliverables**:
> - Staging Worker (`sebongclinic-staging`) deployed with separate D1 + R2
> - Production Worker (`sebongclinic`) deployed; `www.sebongclinic.co.kr` served by Worker (full cutover)
> - Production endpoints healthy: `/api/notices`, `/api/notices/[id]`, `/api/upload`, `/api/images/[...key]`
> - Admin editor toolbar enabled + image upload hook inserts returned image URL
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES (post-cutover editor work can run in parallel with monitoring)
> **Critical Path**: Staging deploy → staging smoke → production deploy + domain cutover → production smoke → editor upgrade → E2E verification

---

## Context

### Original Request (translated)
1) Audit project
2) Fix Backend API 500
3) Replace notice editor with Toast UI Editor

### Key Evidence
- Production failure on `GET https://www.sebongclinic.co.kr/api/notices` with missing bundle module:
  - `No such module "__next-on-pages-dist__/functions/api/async_hooks"`
- Root cause: deprecated `@cloudflare/next-on-pages` build/runtime incompatibility.

### Current State in Repo (already present)
- OpenNext config exists: `open-next.config.ts`
- Worker config exists: `wrangler.jsonc` (production bindings)
- OpenNext output is produced by scripts:
  - `npm run preview`: `opennextjs-cloudflare build && opennextjs-cloudflare preview`
  - `npm run deploy`: `opennextjs-cloudflare build && opennextjs-cloudflare deploy`
- API routes expected to run under OpenNext bindings:
  - `src/app/api/notices/route.ts`
  - `src/app/api/notices/[id]/route.ts`
  - `src/app/api/upload/route.ts`
  - `src/app/api/images/[...key]/route.ts`

### Decisions Confirmed
- Staging resources can be created (separate D1 + R2).
- Production cutover model: **full site on Worker** (www points to Worker).

### Secrets Handling (no secrets in repo)
- User will provide both staging + production `ADMIN_PASSWORD` values at execution time.
- Recommended: provide via environment variables (so passwords are not typed into prompts / logs):
  - `SEBONGCLINIC_ADMIN_PASSWORD_STAGING`
  - `SEBONGCLINIC_ADMIN_PASSWORD_PROD`

### Defaults Applied (override if needed)
- Staging names:
  - Worker: `sebongclinic-staging`
  - D1: `sebongclinic-db-staging`
  - R2: `sebongclinic-images-staging`
- Toast UI editor mode: WYSIWYG only (no Markdown toggle).
- Toolbar: minimal useful set (heading / bold / italic / ul / ol / link / image).
- Image policy: max 5MB; allow JPEG/PNG/GIF/WebP; reject SVG.

---

## Work Objectives

### Core Objective
Restore production API reliability by migrating to OpenNext + Workers, then deliver a practical admin notice editor (toolbar + image upload) without expanding scope.

### Must NOT Have (Guardrails)
- Do not add new UI libraries.
- Do not hardcode secrets (no password defaults committed).
- Do not introduce additional Cloudflare products (KV, Durable Objects, Queues) unless explicitly required.
- Do not expand “audit” into refactors; only fix what’s needed for the migration + editor.

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (no automated test suite)
- **Automated tests**: None
- **Primary verification**: agent-executed CLI verification (lint/tsc/build) + curl smoke tests + Playwright E2E

### Always-Run Commands
```bash
npm run lint
npx tsc --noEmit
npm run build
```

### Evidence Location
- Screenshots / logs: `.sisyphus/evidence/`

---

## Execution Strategy

Wave 1 (Deployment Safety)
- Task 5: staging deploy + smoke tests
- Task 6: production deploy + domain cutover + smoke tests + rollback readiness

Wave 2 (Editor)
- Task 7 & 8: editor toolbar + upload hook
- Task 9: Playwright E2E

Critical Path: 5 → 6 → 9

---

## TODOs

> Note: Tasks 1–4 are already completed in the current working tree. They remain listed for completeness and for a clean end-to-end verification trail.

- [x] 1. Audit report (report-only)

  **References**:
  - `AGENTS.md` - project constraints and commands
  - `AUDIT-REPORT.md` - report output

  **Acceptance Criteria**:
  - `AUDIT-REPORT.md` exists and documents lint/tsc/audit findings.

- [x] 2. OpenNext migration skeleton (deps + scripts + config)

  **References**:
  - `package.json` - `preview`/`deploy` scripts
  - `wrangler.jsonc` - Worker entry + production bindings
  - `open-next.config.ts` - OpenNext required config
  - `public/_headers` - caching rules for `/_next/static/*`

  **Acceptance Criteria**:
  - `npm run preview` builds `.open-next/worker.js` and `.open-next/assets`

- [x] 3. Migrate API route handlers to OpenNext bindings

  **References**:
  - `src/app/api/notices/route.ts` - D1 read/write + password check
  - `src/app/api/notices/[id]/route.ts` - CRUD by id
  - `src/app/api/upload/route.ts` - multipart upload + R2 put
  - `src/app/api/images/[...key]/route.ts` - R2 get + caching headers
  - `src/types/cloudflare.d.ts` - Cloudflare env types

  **Acceptance Criteria**:
  - `npm run build` succeeds (no TS errors)

- [x] 4. Local Workers-runtime smoke test (OpenNext preview)

  **References**:
  - `db/schema.sql` - D1 schema required for notices

  **Acceptance Criteria**:
  - `npm run preview` starts
  - Applying schema fixes local D1: `npx wrangler d1 execute sebongclinic-db --local --file=./db/schema.sql`
  - `GET /api/notices` returns 200 after schema apply

- [⚠️] 5. Create & Deploy Staging Worker (separate D1 + R2) [BLOCKED: CLOUDFLARE_API_TOKEN required]

  **What to do**:
  - Update `wrangler.jsonc` to add a staging environment (do not break production):
    - `env.staging.name = "sebongclinic-staging"`
    - `env.staging.d1_databases[0].binding = "DB"`
    - `env.staging.r2_buckets[0].binding = "IMAGES"`
    - Ensure staging points to **separate** resources:
      - D1 name: `sebongclinic-db-staging`
      - R2 bucket: `sebongclinic-images-staging`
  - Create staging resources (Cloudflare account must be authenticated in wrangler):
    - `wrangler d1 create sebongclinic-db-staging`
    - `wrangler r2 bucket create sebongclinic-images-staging`
  - Apply schema to staging D1:
    - `wrangler d1 execute sebongclinic-db-staging --file=./db/schema.sql`
      - If wrangler requires database id, use the returned id from `wrangler d1 create`.
  - Set staging secret:
    - Non-interactive (recommended):
      - `printf %s "$SEBONGCLINIC_ADMIN_PASSWORD_STAGING" | wrangler secret put ADMIN_PASSWORD --env staging`
    - Interactive (fallback):
      - `wrangler secret put ADMIN_PASSWORD --env staging` and paste the value
  - Deploy staging:
    - `npm run deploy -- --env staging`

  **Must NOT do**:
  - Do not reuse production DB/bucket.
  - Do not write secrets into `wrangler.jsonc`.

  **Recommended Agent Profile**:
  - Category: `unspecified-high`
  - Skills: `git-master` (optional; only if committing after staging config)

  **References**:
  - `wrangler.jsonc` - current production bindings (must extend safely)
  - `db/schema.sql` - required table(s)
  - `package.json` - `deploy` script
  - OpenNext bindings docs: https://opennext.js.org/cloudflare/bindings
  - Wrangler env docs: https://developers.cloudflare.com/workers/wrangler/configuration/#environments

  **Acceptance Criteria (agent-executable)**:
  - `wrangler whoami` exits 0
  - Staging deploy succeeds and produces a reachable URL (workers.dev is fine)
  - `curl -i https://<staging-host>/api/notices` → `200`
  - `curl -i -X POST https://<staging-host>/api/notices -H 'Content-Type: application/json' -d '{"title":"t","content":"c","password":"wrong"}'` → `401`
  - `curl -i -X POST https://<staging-host>/api/upload -F 'password=wrong' -F 'file=@public/favicon.ico'` → `401`

  **Notes**:
  - If `POST /api/notices` or `GET /api/notices` returns `D1_ERROR: no such table`, schema was not applied; re-run `wrangler d1 execute ... --file=./db/schema.sql`.

  **Agent-Executed QA Scenarios**:
  ```
  Scenario: Staging notices list responds
    Tool: Bash (curl)
    Preconditions: Staging Worker deployed
    Steps:
      1. curl -i https://<staging-host>/api/notices
      2. Assert: status 200
      3. Assert: body contains JSON key "notices"
    Evidence: .sisyphus/evidence/task-5-staging-notices.txt

  Scenario: Staging rejects wrong admin password
    Tool: Bash (curl)
    Preconditions: Staging Worker deployed
    Steps:
      1. POST /api/notices with password "wrong"
      2. Assert: status 401
      3. Assert: body contains "Unauthorized"
    Evidence: .sisyphus/evidence/task-5-staging-auth-401.txt
  ```

- [⚠️] 6. Production Deploy + Full Domain Cutover (www → Worker) [BLOCKED: Depends on Task 5]

  **What to do**:
  - Keep Cloudflare Pages project intact as rollback target (do NOT delete it).
  - Ensure production secret is set:
    - Non-interactive (recommended):
      - `printf %s "$SEBONGCLINIC_ADMIN_PASSWORD_PROD" | wrangler secret put ADMIN_PASSWORD`
    - Interactive (fallback):
      - `wrangler secret put ADMIN_PASSWORD` and paste the value
  - Deploy production Worker:
    - `npm run deploy`
  - Cut over `www.sebongclinic.co.kr` to the Worker:
    - Use config-based routes in `wrangler.jsonc` (agent-executable):
      - Add `routes` mapping: `www.sebongclinic.co.kr/*` with `zone_name: sebongclinic.co.kr`
      - Re-deploy
  - Verify rollback path:
    - Discover Pages hostname via CLI (agent-executable) and confirm it still serves the site:
      - `wrangler pages project list`
      - `curl -i https://<project>.pages.dev/` → 200

  **Guardrails**:
  - Do not remove Pages until the Worker is stable for at least 48 hours.

  **Recommended Agent Profile**:
  - Category: `unspecified-high`
  - Skills: (none)

  **References**:
  - `wrangler.jsonc` - production worker name is currently `sebongclinic`
  - Cloudflare custom domains docs: https://developers.cloudflare.com/workers/platform/triggers/custom-domains/

  **Acceptance Criteria (agent-executable)**:
  - `curl -i https://www.sebongclinic.co.kr/api/notices` → `200` (no 5xx)
  - `curl -i -X POST https://www.sebongclinic.co.kr/api/notices -H 'Content-Type: application/json' -d '{"title":"t","content":"c","password":"wrong"}'` → `401`
  - No runtime logs mention `__next-on-pages-dist__`
  - Rollback check (Pages still alive): `curl -i https://<pages-host>/` → `200`

  **Agent-Executed QA Scenarios**:
  ```
  Scenario: Production /api/notices no longer 500s
    Tool: Bash (curl)
    Preconditions: www mapped to Worker
    Steps:
      1. curl -i https://www.sebongclinic.co.kr/api/notices
      2. Assert: status 200
      3. Save response
    Evidence: .sisyphus/evidence/task-6-prod-notices.txt
  ```

- [x] 7. Enable Toast UI Editor Toolbar (minimal set)

  **What to do**:
  - Update the Toast UI Editor init in `src/app/admin-8f3a9c2d4b1e/page.tsx`:
    - Keep `initialEditType: 'wysiwyg'`
    - Configure toolbar items: heading, bold, italic, ul, ol, link, image
  - Keep persistence as HTML: `editor.getHTML()`

  **Recommended Agent Profile**:
  - Category: `visual-engineering`
  - Skills: `frontend-ui-ux`

  **References**:
  - `src/app/admin-8f3a9c2d4b1e/page.tsx` - editor init + password state
  - Toast UI docs: https://github.com/nhn/tui.editor

  **Acceptance Criteria (agent-executable)**:
  - `npm run build` succeeds
  - Playwright: toolbar buttons are visible on `/admin-8f3a9c2d4b1e`

- [x] 8. Add Toast UI Image Upload Hook (POST /api/upload → insert URL)

  **What to do**:
  - Wire Toast UI editor image hook (e.g. `addImageBlobHook`) to:
    - Build `FormData` with `file` and `password`
    - `fetch('/api/upload', { method: 'POST', body: formData })`
    - On success: insert returned `url` into editor content
    - On 401: show Korean message and abort
  - Add client-side validation (size/type) consistent with backend.

  **Recommended Agent Profile**:
  - Category: `visual-engineering`
  - Skills: `frontend-ui-ux`

  **References**:
  - `src/app/api/upload/route.ts` - request fields + response shape
  - `src/app/api/images/[...key]/route.ts` - served URL behavior
  - `src/app/notices/page.tsx` - rendering uses `dangerouslySetInnerHTML`

  **Acceptance Criteria (agent-executable)**:
  - Local preview (`npm run preview`) + correct password:
    - Uploading an image via editor results in an `<img src="/api/images/...">` (or returned URL) inserted into HTML
  - Wrong password surfaces Korean error (no insert)

- [x] 9. End-to-End Verification (Playwright)

  **What to do**:
  - Run Playwright against staging first, then production:
    - Open `/admin-8f3a9c2d4b1e`
    - Create a notice with formatted text + one uploaded image
    - Save
    - Verify `/notices` renders the new notice and the image loads (200)

  **Recommended Agent Profile**:
  - Category: `unspecified-high`
  - Skills: `playwright`

  **Acceptance Criteria (agent-executable)**:
  - Screenshots exist:
    - `.sisyphus/evidence/task-9-admin-toolbar.png`
    - `.sisyphus/evidence/task-9-uploaded-image.png`
    - `.sisyphus/evidence/task-9-notices-render.png`
  - Playwright assertions pass (editor visible, notice visible, image request returns 200)

---

## Commit Strategy (Optional)

- Commit A: `fix: migrate to opennext cloudflare workers` (wrangler/open-next/api)
- Commit B: `feat: enable toast ui toolbar and image uploads` (admin editor)

---

## Rollback Procedure (If Production Breaks)

1) Keep the Cloudflare Pages project intact (do not delete).
2) If www is mapped to Worker and it fails, roll back by:
   - Repointing custom domain mapping back to Pages (dashboard), OR
   - Deploying the previous Worker version (if using versions), OR
   - Temporarily mapping www to Pages host as emergency.
3) Verify:
   - `curl -i https://www.sebongclinic.co.kr/` → 200
   - `curl -i https://www.sebongclinic.co.kr/api/notices` → 200/expected (depending on target)
