2026-02-04
- `ast-grep` CLI not available in this environment; used `ast_grep_search` tool to verify zero references instead.
- Existing Playwright suite does not include popover-absence assertions; ran `e2e/task-9-admin-notice.e2e.spec.mjs` as smoke.

- `npm run lint` / `npm run build` currently report a non-fatal `@next/next/no-img-element` warning in `src/app/page.tsx`.
