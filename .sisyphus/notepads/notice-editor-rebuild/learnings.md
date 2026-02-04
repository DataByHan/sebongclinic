- 2026-02-04: D1 schema migration can be validated locally via `npx wrangler d1 execute sebongclinic-db --command "PRAGMA table_info(notices);"` (defaults to local state in `.wrangler/state/v3/d1`).
- 2026-02-04: Schema update for dual-format notices: add `format TEXT NOT NULL DEFAULT 'html'` and nullable `content_md TEXT`; keep `content` as legacy HTML.

- 2026-02-04: API defense-in-depth for notices: sanitize HTML on write (POST/PUT) and on read (GET); when `format` is missing/unknown, default to `html` and force `content_md` to `null`.
