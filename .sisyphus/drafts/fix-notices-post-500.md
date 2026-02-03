# Draft: Fix 500 on POST /api/notices

## Requirements (confirmed)
- Goal: produce a minimal-change, step-by-step plan to fix 500 error on `POST /api/notices` triggered from admin page.
- Must use existing patterns; do not add dependencies.
- Must not modify files or run commands during planning.
- Must include: specific files, hypotheses to verify, checks for env + D1 access, JSON parsing, validation.
- Must include: verification steps (LSP diagnostics; build/typecheck steps listed as commands for executor).

## Known Context
- Admin UI: `src/app/admin-8f3a9c2d4b1e/page.tsx` does `fetch` POST `/api/notices` with `{ title, content, password }`.
- API handler: `src/app/api/notices/route.ts` uses Cloudflare D1 via `getRequestContext().env.DB` and checks `ADMIN_PASSWORD` (default `'sebong2025'`).
- Symptom: 500 Internal Server Error on POST in production: `https://www.sebongclinic.co.kr/api/notices`.

## Code Findings (observed)
- `src/app/api/notices/route.ts`:
  - `export const runtime = 'edge'`
  - `ADMIN_PASSWORD` read via `process.env.ADMIN_PASSWORD || 'sebong2025'`.
  - `getDB()` tries `getRequestContext().env.DB`, falls back to `(request as any).env.DB`, otherwise throws `D1 database binding not found`.
  - `POST` does `await request.json()` then checks `password`, then checks `title/content`, then `INSERT INTO notices (title, content) VALUES (?, ?)` and returns `{ id: result.meta.last_row_id, title, content }`.
- `src/app/admin-8f3a9c2d4b1e/page.tsx`:
  - `handleSubmit()` uses `fetch('/api/notices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, password }) })`.
  - On non-OK: if 401 -> logs out; else `await res.json().catch(() => ({}))` then alerts.
- `db/schema.sql` creates `notices` with `created_at/updated_at` defaults.
- `package.json` deploy flow uses `npx @cloudflare/next-on-pages` (`pages:build`) and `wrangler pages deploy .vercel/output/static`.

## Tooling Constraints / Gaps
- `lsp_diagnostics` currently unavailable because `typescript-language-server` is not installed in this environment.
  - Plan must include fallback verification via `npx tsc --noEmit`, `npm run build`, and `npm run lint`.

## Working Hypotheses (to verify)
- H1: D1 binding missing/misnamed in production (`env.DB` undefined) causing runtime throw.
- H2: Handler throws during `request.json()` (empty body, invalid JSON, missing `Content-Type`).
- H3: SQL/migration mismatch in D1 (table missing / schema mismatch) causing D1 error.
- H4: Password check path throws due to missing `ADMIN_PASSWORD` expectations or unhandled branches.
- H5: Route deployed differently (static export / Pages Functions) so runtime context not available.

## Open Questions
- Do you have Cloudflare logs (Pages Functions / Workers) showing stack trace for the 500?
- Does 500 happen for ALL POSTs or only specific payload sizes (large `content`) / characters?

## Scope Boundaries
- INCLUDE: debug + fix POST handler/admin submit flow to return correct 2xx/4xx and stop 500s.
- EXCLUDE: adding new dependencies; redesigning admin UI; major refactor.
