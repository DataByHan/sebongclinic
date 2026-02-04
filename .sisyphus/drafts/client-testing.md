# Draft: Client-side Testing Enablement

## Original Request
- "이 프로젝트를 Client에서 Test 할 수 있게 해줘"

## Working Interpretation (needs confirmation)
- "Client" could mean: local dev machine/browser, a non-server static build, or testing a deployed/staging site.

## Requirements (confirmed)
- Local PC E2E testing (Playwright)
- Scope: full coverage (notices + admin + upload + images)

## Constraints / Guardrails
- Keep existing project conventions (Next.js 14 App Router, TS, Tailwind, Cloudflare Workers via OpenNext).
- Prefer Playwright for E2E when UI flows are involved.

## Research Findings
- Existing infra: Playwright E2E tests in `e2e/` (no `playwright.config.*` found; tests use env vars directly)
- Base URL: tests default to `http://localhost:3000` but support `E2E_BASE_URL`
- Full feature E2E (notices CRUD + upload/images) requires Cloudflare bindings (D1 `DB`, R2 `IMAGES`) + `ADMIN_PASSWORD`
- Best local runtime for full E2E: `npm run preview` (Workers preview; typically `http://localhost:8787`)
- `npm run dev` is fine for static/UI-only but not for D1/R2-backed API routes

## Candidate Local E2E Flow (draft)
- One-time: `npx playwright install`
- One-time/local secret: `wrangler secret put ADMIN_PASSWORD --local`
- Run app: `npm run preview`
- Run tests: `E2E_BASE_URL=http://localhost:8787 npx playwright test`

## Open Questions
- What does "Client" mean in your context?
- What kind of tests do you want to run (manual local smoke test vs automated Playwright vs both)?
- Should tests run without Cloudflare D1/R2 bindings (mock/stub), or with `wrangler`/preview bindings?

## Decisions Made
- Client 의미: Local PC E2E (Playwright)
- E2E scope: full (D1 + R2 포함)
- Execution UX: one-command (npm script via Playwright `webServer`)
- Cloudflare access: wrangler login 가능
- Admin UI scope: UI 최소 + API 기반 seed/검증 (Toast UI editor 직접 조작은 제외)

## Test Data Decision
- Strategy: self-seed + cleanup (recommended)

## Scope Boundaries
- INCLUDE: (pending)
- EXCLUDE: (pending)
