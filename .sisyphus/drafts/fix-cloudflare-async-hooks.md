# Draft: Fix Cloudflare async_hooks Import Error

## Requirements (confirmed)
- Cloudflare Pages Functions logs show: `No such module "__next-on-pages-dist__/functions/api/async_hooks" imported from "__next-on-pages-dist__/functions/api/notices.func.js"`.
- App must keep the notices admin system working (requires API routes: notices CRUD + upload + images).
- Deployment: Cloudflare Pages, auto-deploy on git push.
- Build pipeline: `@cloudflare/next-on-pages` output to `.vercel/output/static` (per `wrangler.toml` and `package.json`).
- No test suite; verification must be manual + command-driven checks.
- Must include cache clearing, precise commands, and rollback strategy.

## Technical Decisions
- Primary fix approach: downgrade Next.js from 15.5.2 to Next.js 14.x to avoid Next 15 edge runtime injecting `node:async_hooks` (unsupported on Workers).
- Ensure code compatibility with Next 14 by reverting Next 15-specific route handler `params: Promise<...>` patterns.

## Research Findings
- Next.js 15 edge runtime can inject `node:async_hooks` into route handler bundles; Cloudflare Workers does not support it (even with `nodejs_compat`).
- `@cloudflare/next-on-pages` is archived/deprecated; no reliable upstream fix expected.
- Repo contains Next 15-specific async params typing in route handlers:
  - `src/app/api/images/[...key]/route.ts`
  - `src/app/api/notices/[id]/route.ts`

## Scope Boundaries
- INCLUDE: fix the async_hooks runtime failure; keep existing API routes functional; keep current Pages + D1/R2 architecture.
- EXCLUDE: full migration to OpenNext; redesigning auth/security; restructuring data model; UI redesign.

## Open Questions
- None blocking (plan assumes downgrade-to-14 is acceptable as the lowest-change, highest-probability fix for current tooling).
