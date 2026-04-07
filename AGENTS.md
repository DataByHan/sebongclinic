# AGENTS.md

Operational guide for coding agents working in `sebongclinic`.

## Project Snapshot

- Stack: Next.js 14 App Router + TypeScript + Tailwind CSS.
- Runtime/deploy: Cloudflare Workers via `@opennextjs/cloudflare`.
- Data/storage: Cloudflare D1 (`DB`) + R2 (`IMAGES`).
- Main app code: `src/app`, shared logic: `src/lib`, shared types: `src/types`.
- E2E tests: `e2e/*.spec.mjs` (Playwright).

## Source of Truth Files

- Scripts/dependencies: `package.json`
- TS config: `tsconfig.json`
- Lint config: `.eslintrc.json`
- Worker config/secrets notes: `wrangler.jsonc`
- Styling tokens/utilities: `src/app/globals.css`
- Security/sanitization: `src/lib/security.ts`, `src/lib/sanitize.ts`

## Commands (Build/Lint/Test)

### Install

```bash
npm install
```

### Dev and build

```bash
npm run dev
npm run build
npm run start
```

### Lint and typecheck

```bash
npm run lint
npx tsc --noEmit
```

### Cloudflare preview/deploy

```bash
npm run preview
npm run deploy
```

Notes:
- `preview` and `deploy` run OpenNext Cloudflare build plus postbuild patching.
- `deploy` needs `CLOUDFLARE_API_TOKEN`.
- `ADMIN_PASSWORD` must be provisioned via `wrangler secret put ADMIN_PASSWORD`.

### Playwright tests

```bash
npx playwright install
npx playwright test
npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs
npx playwright test --grep "Markdown headings"
npx playwright test --headed
npx playwright test --debug
npx playwright show-report
```

Single-test guidance:
- Single file: `npx playwright test e2e/<file>.spec.mjs`
- Single named test: `npx playwright test --grep "test name"`

Environment for E2E:
- `ADMIN_PASSWORD` is required for admin flows (tests skip without it).
- Optional `E2E_BASE_URL` (defaults to `http://localhost:3000`).
- Example:

```bash
E2E_BASE_URL=https://sebongclinic-staging.hanms-data.workers.dev ADMIN_PASSWORD=... npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs
```

## Recommended Validation Order

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Run Playwright after the above for user-facing or API behavior changes.

## Code Style and Conventions

### Imports

- Prefer order: React/Next -> third-party -> local aliases.
- Use type-only imports with `import type`.
- Use `@/` path aliases (configured in `tsconfig.json`); avoid deep relative imports.

### TypeScript

- `strict: true` is enabled; keep code fully type-safe.
- Do not use `any`, `@ts-ignore`, or `@ts-expect-error`.
- Keep API/body parsing typed from `unknown` and validate before use.
- Use narrow unions for state and format values (for example `'idle' | 'loading' | 'ready' | 'error'`).

### Naming

- Components/types: PascalCase.
- Variables/functions: camelCase.
- Route segments and utility CSS classes: kebab-case where applicable.
- Keep names domain-specific (`sanitizeNoticeHtml`, `isSameOriginRequest`, `noStoreHeaders`).

### React / Next patterns

- Client components must start with `'use client'`.
- In async effects, use cancellation guards to avoid state updates after unmount.
- Prefer small helper functions for parsing/validation in route handlers.
- Keep metadata/viewport exports in App Router layouts when needed.

### API route patterns (current repo)

- Use `NextRequest`/`NextResponse` handlers under `src/app/api/**/route.ts`.
- Access bindings through `getCloudflareContext().env` (not legacy `process.env` casting).
- Enforce origin checks on mutating endpoints with `isSameOriginRequest`.
- Apply `noStoreHeaders` to API responses handling admin/content mutations.
- Return structured JSON errors with explicit HTTP status codes.

### Security and content handling

- Sanitize user-generated HTML with `sanitizeNoticeHtml` before rendering.
- Do not pass unsanitized HTML to `dangerouslySetInnerHTML`.
- Keep CSP and security headers in `src/middleware.ts` aligned with integrations (Kakao, Cloudflare insights).
- Preserve timing-safe secret comparison utilities in `src/lib/security.ts`.

### Styling

- Use Tailwind utilities plus shared classes in `globals.css` (`.frame`, `.flat-card`, `.flat-chip`, `.cta`).
- Prefer CSS variables (`--paper`, `--ink`, `--line`, `--jade`, etc.) over hardcoded ad-hoc colors.
- Keep section spacing consistent (`py-24 md:py-40` is the existing rhythm in landing sections).
- Follow current dynamic class pattern with array `.join(' ')` for readability.

### Error handling

- Never swallow failures silently in routes.
- Log actionable server-side errors with context via `console.error`.
- Show user-facing fallback messages in Korean where UI currently does so.
- Fail closed for invalid payloads (400/403) and return stable response shapes.

## Testing Expectations by Change Type

- UI-only edits: `npm run lint` + relevant Playwright spec.
- API/security/data edits: `npx tsc --noEmit` + `npm run lint` + `npm run build` + relevant Playwright specs.
- Deployment-related edits: also run `npm run preview` before `npm run deploy`.

## Cursor/Copilot Rules

- No `.cursorrules` file found.
- No `.cursor/rules/` directory found.
- No `.github/copilot-instructions.md` found.

If these files are added later, treat them as higher-priority agent instructions and merge them into this guide.

## Practical Do/Don't

Do:
- Match existing patterns before introducing new abstractions.
- Keep changes minimal, typed, and verifiable.
- Prefer extending existing utilities over duplicating logic.

Don't:
- Introduce new dependencies without strong need.
- Bypass sanitization or origin checks for convenience.
- Change deployment/runtime assumptions casually.
