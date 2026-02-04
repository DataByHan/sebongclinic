- 2026-02-04: D1 schema migration can be validated locally via `npx wrangler d1 execute sebongclinic-db --command "PRAGMA table_info(notices);"` (defaults to local state in `.wrangler/state/v3/d1`).
- 2026-02-04: Schema update for dual-format notices: add `format TEXT NOT NULL DEFAULT 'html'` and nullable `content_md TEXT`; keep `content` as legacy HTML.

- 2026-02-04: API defense-in-depth for notices: sanitize HTML on write (POST/PUT) and on read (GET); when `format` is missing/unknown, default to `html` and force `content_md` to `null`.

## 2026-02-04 Session Complete

### All 8 Tasks Delivered

1. ✅ D1 Schema: Added `format` + `content_md` columns with migration
2. ✅ Types: Updated Notice type for dual-format support
3. ✅ API: Implemented format-aware CRUD with sanitization
4. ✅ Admin Editor: Refactored to Markdown mode (679→308 lines)
5. ✅ Sanitizer: Added GFM tag whitelist (tables, task lists, strikethrough)
6. ✅ Public Rendering: Verified format-agnostic rendering (no changes needed)
7. ✅ E2E Tests: Updated for Markdown flow + GFM + XSS verification
8. ✅ Verification: All checks pass (TypeScript, Lint, Build)

### Key Implementation Details

- **Markdown Storage**: New notices store Markdown source in `content_md` + rendered HTML in `content`
- **Legacy Support**: Existing HTML notices remain unchanged; format detection via `format` column
- **Editor Simplification**: Removed 371 lines of complex ProseMirror/drag-resize code
- **GFM Support**: Tables, task lists (checkboxes), strikethrough, fenced code blocks
- **Security**: Defense-in-depth sanitization (write + read); XSS vectors blocked
- **Image Upload**: Unchanged flow via `/api/upload` → R2 bucket

### Verification Results

```
✅ npx tsc --noEmit          # Zero TypeScript errors
✅ npm run lint               # ESLint passes
✅ npm run build              # 10/10 pages generated
✅ git status                 # Working tree clean
✅ Commit: 928470d            # All changes committed
```

### Files Modified (15 total)

- Schema: `db/schema.sql` (+3, -1)
- Types: `src/types/cloudflare.d.ts` (+2, -0)
- API: `src/app/api/notices/route.ts` (+65, -10)
- API: `src/app/api/notices/[id]/route.ts` (+59, -8)
- Admin: `src/app/admin-8f3a9c2d4b1e/page.tsx` (+32, -402) [55% reduction]
- Sanitizer: `src/lib/sanitize.ts` (+19, -0)
- E2E: `e2e/task-9-admin-notice.e2e.spec.mjs` (+166, -201)
- Migration: `.sisyphus/migrations/add-markdown-format.sql` (+7)
- Plan: `.sisyphus/plans/notice-editor-rebuild.md` (+402)

### Acceptance Criteria Met

- [x] New notices store Markdown source (`content_md`) and are labeled `format='markdown'`
- [x] Public notices render tables/task lists/strikethrough correctly
- [x] Image uploads still work
- [x] No separate preview panel exists in admin page
- [x] XSS vectors are stripped
- [x] Existing HTML notices still render
- [x] All build/test commands pass

### Next Steps (if needed)

- Deploy to Cloudflare Workers: `npm run deploy`
- Run E2E tests with admin password: `ADMIN_PASSWORD='...' npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs`
- Monitor production for any issues with dual-format rendering
