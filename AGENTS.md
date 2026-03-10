# AGENTS.md

Agent guidelines for the Sebong Clinic website codebase.

---

## Project Overview

**Type:** Korean medicine clinic website with notice CMS  
**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS  
**Editor:** Toast UI Editor (`@toast-ui/editor`) for admin notice writing  
**Deployment:** Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`) with D1 + R2  
**Primary Domain:** `https://www.sebongclinic.co.kr`  
**Worker Name:** `sebongclinic`  
**Design Direction:** Flat, minimal, scrollytelling, Korean aesthetic

This project is **not** static-export-only anymore. It uses Next App Router API routes running on Workers (D1/R2 bindings).

---

## Runtime Architecture

### Frontend
- Single-page style homepage (`/`) with anchored sections.
- Dedicated notices page (`/notices`) that fetches from `/api/notices`.
- Hidden admin route for notice CRUD: `/admin-8f3a9c2d4b1e`.

### Backend (App Router API)
- `GET/POST /api/notices` - list and create notices.
- `GET/PUT/DELETE /api/notices/[id]` - read/update/delete single notice.
- `POST /api/upload` - image upload to R2.
- `GET /api/images/[...key]` - image delivery from R2 (`notices/` prefix only).

### Data Stores
- **D1 (`DB`)**: notice metadata/content (`db/schema.sql`).
- **R2 (`IMAGES`)**: uploaded notice images.
- **Secret (`ADMIN_PASSWORD`)**: admin auth password.

---

## Build / Lint / Test Commands

```bash
# Development
npm run dev

# Production (Next.js)
npm run build
npm run start

# Cloudflare (OpenNext)
npm run preview
npm run deploy

# Quality
npm run lint
npx tsc --noEmit

# E2E (Playwright)
npx playwright install
npx playwright test
npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs
npx playwright test e2e/task-10-doctor-section.e2e.spec.mjs
npx playwright show-report
```

Notes:
- `preview`/`deploy` run OpenNext build and patch generated handler via `postbuild:opennext`.
- E2E tests expect `ADMIN_PASSWORD` to be available for admin scenarios.
- `E2E_BASE_URL` can target deployed or local environment.

---

## Project Structure (Current)

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    robots.ts
    sitemap.ts
    notices/
      layout.tsx
      page.tsx
    admin-8f3a9c2d4b1e/
      layout.tsx
      page.tsx
    api/
      notices/
        route.ts
        [id]/route.ts
      upload/route.ts
      images/[...key]/route.ts
  components/
    Reveal.tsx
    KakaoMap.tsx
  lib/
    site.ts
    sanitize.ts
    security.ts
    apply-notice-image-width.ts
  types/
    cloudflare.d.ts
    kakao-maps.d.ts
    next-on-pages.d.ts

db/
  schema.sql

e2e/
  task-9-admin-notice.e2e.spec.mjs
  task-10-doctor-section.e2e.spec.mjs
```

---

## Core Conventions

### 1) Imports and Paths
- Use `@/` alias for `src/*` imports.
- Use `import type` for type-only imports.
- Keep imports grouped and stable (framework, external, local).

### 2) TypeScript
- `strict: true` is required.
- Do not suppress errors with `@ts-ignore` / `@ts-expect-error`.
- Avoid `any`; use specific unions and typed payload parsing.

### 3) React / Next
- Add `'use client'` only where hooks/browser APIs are required.
- Keep home page as server component unless interactivity is needed.
- API routes should use `NextRequest`/`NextResponse` patterns already present.

### 4) Styling
- Tailwind + CSS variables in `src/app/globals.css`.
- Prefer design tokens (`--paper`, `--ink`, `--line`, etc.) over hardcoded colors.
- Reuse existing utility/component classes: `.frame`, `.flat-card`, `.flat-chip`, `.cta`, `.cta-ghost`, `.flat-link`.

### 5) Site Data
- Centralize clinic content in `src/lib/site.ts`.
- Page components should consume data, not duplicate literals.

---

## Notice Content Pipeline

### Format Model
- Supported formats: `html` and `markdown` (`Notice['format']`).
- Markdown notices store source in `content_md` and rendered/sanitized HTML in `content`.

### Sanitization
- All notice HTML must pass through `sanitizeNoticeHtml` in `src/lib/sanitize.ts`.
- Allowed tags/attrs are tightly scoped.
- URL attributes are validated to block `javascript:` and unsafe schemes.
- Event-handler attributes (`on*`) are stripped.

### Markdown Rendering
- `marked` is used for markdown-to-HTML rendering in API handlers.
- Rendering failures fallback to escaped `<pre>` output.

### Image Width Handling
- Custom width metadata is represented with `data-notice-width`.
- Sanitizer validates/clamps values.
- Runtime width application uses `applyNoticeImageWidths`.

---

## Security Model

### Auth
- Admin auth is password-based via `ADMIN_PASSWORD` secret.
- Comparisons use timing-safe hash comparison (`timingSafeEqualString`).
- Failed auth includes small delay (`sleep(250)`) to reduce brute-force signal.

### Origin Protection
- Mutating endpoints enforce same-origin checks via `isSameOriginRequest`.

### Headers
- Middleware sets CSP and security headers globally:
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy`
  - `Permissions-Policy`
- Admin/API routes get stricter robot indexing controls (`X-Robots-Tag`).

### Caching
- Sensitive API responses set `Cache-Control: no-store`.
- Public R2 image responses are immutable cached.

---

## Cloudflare / OpenNext Operations

### Required Bindings (`wrangler.jsonc`)
- `DB` -> D1 database
- `IMAGES` -> R2 bucket
- `ADMIN_PASSWORD` -> secret (set via `wrangler secret put ADMIN_PASSWORD`)

### Environments
- Production worker: `sebongclinic`
- Staging worker: `sebongclinic-staging`

### Config Files
- `wrangler.jsonc` - worker/runtime/bindings config
- `open-next.config.ts` - OpenNext config entrypoint
- `next.config.js` - Next config (`images.unoptimized = true`)

---

## SEO / Metadata

- Canonical and OG/Twitter metadata are configured in `src/app/layout.tsx` and `src/app/notices/layout.tsx`.
- `robots.ts` disallows the admin route.
- `sitemap.ts` includes `/` and `/notices`.
- Structured data (`MedicalBusiness`) is injected in root layout.

---

## Database Schema Notes

Current D1 table (`db/schema.sql`):
- `notices(id, title, content, created_at, updated_at, format, content_md)`
- Index on `created_at DESC`

When updating schema:
- Keep API route SQL in sync.
- Preserve backward compatibility for old `html` notices.

---

## Testing Guidelines

### Unit/Type/Lint
- Run at minimum:
  - `npm run lint`
  - `npx tsc --noEmit`

### E2E Coverage
- `task-9-admin-notice` validates:
  - admin login
  - markdown/GFM rendering
  - XSS stripping
  - image upload and public render
- `task-10-doctor-section` validates key doctor section layout and copy.

For admin E2E tests, ensure `ADMIN_PASSWORD` is set.

---

## Change Rules for Agents

### Always Do
1. Follow existing patterns in modified file first.
2. Keep Korean user-facing copy tone consistent.
3. Sanitize any user-generated HTML content.
4. Preserve security checks on mutating API endpoints.
5. Run lint/typecheck after code edits.

### Never Do
- Do not expose secrets or tokens in repo files.
- Do not remove sanitizer/security middleware for convenience.
- Do not bypass auth/origin checks in admin APIs.
- Do not replace `@/` imports with deep relative imports.
- Do not introduce new UI frameworks without explicit request.

---

## Quick Task Playbooks

### Update clinic info (phone/address/hours/links)
1. Edit `src/lib/site.ts`.
2. Verify homepage + notices page still render correctly.
3. Run lint/typecheck.

### Add/adjust notice API behavior
1. Update `src/app/api/notices/route.ts` and/or `[id]/route.ts`.
2. Keep `Notice` type in `src/types/cloudflare.d.ts` aligned.
3. Validate sanitizer and markdown behavior.
4. Run lint/typecheck and relevant E2E tests.

### Change upload policy
1. Edit `src/app/api/upload/route.ts` (`MAX_FILE_SIZE`, `ALLOWED_TYPES`).
2. Keep `/api/images/[...key]` constraints aligned.
3. Verify via admin image upload flow (Playwright task-9).

---

## Git / Delivery Notes

- Use small, focused changes.
- Keep commit messages concise and purpose-driven.
- Do not commit `.env*`, token files, or generated artifacts unless explicitly requested.

---

## Last Verified Snapshot

- Verified against repository state on: **2026-03-10**
- Key versions from `package.json`:
  - Next.js `14.2.35`
  - TypeScript `5.3.3`
  - Tailwind `3.4.1`
  - OpenNext Cloudflare `0.6.6`
