
## Task 5 Blocker: Cloudflare API Token Required (2026-02-03)

**Issue**: Wrangler D1 creation requires `CLOUDFLARE_API_TOKEN` environment variable.

**Evidence**: 
- Command: `npm exec wrangler -- d1 create sebongclinic-db-staging`
- Error: Missing `CLOUDFLARE_API_TOKEN` environment variable

**Root Cause**: 
- User authenticated via `npm exec wrangler -- login` (browser-based), but non-interactive CLI commands (like D1 creation) require an API token.

**Resolution Required**:
1. User must create a Cloudflare API token with D1 permissions
2. Export: `export CLOUDFLARE_API_TOKEN='<token>'`
3. Then retry Task 5a

**Workaround** (if API token unavailable):
- Use Cloudflare dashboard to create D1/R2 manually
- Update `wrangler.jsonc` with the resource IDs
- Skip to Task 5b (schema application)

## Task 9 Blocker: Admin Toast UI Editor Does Not Initialize After Login (2026-02-03)

**Issue**: After clicking "로그인", the admin page shows title input + save button, but the Toast UI editor UI (toolbar/content area) never appears. This blocks formatting and image upload end-to-end verification.

**Evidence**:
- Playwright run: `npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs --browser=chromium --workers=1`
- Failure: `.toastui-editor-toolbar` not found within 30s.
- DOM inspection after login shows no `toastui-` classes at all.

**Root Cause**:
- `src/app/admin-8f3a9c2d4b1e/page.tsx` initializes the editor in a `useEffect(() => { ... }, [])`.
- The editor root `<div ref={editorRootRef} />` is only rendered when `isAuthenticated === true` (login form returns early), so on first mount `editorRootRef.current` is `null` and the effect exits early, never re-running.

**Fix (requires source change; not done in Task 9)**:
- Re-run editor init when authenticated (e.g. depend on `isAuthenticated` and guard with `if (!isAuthenticated) return`), or avoid conditional early return so the editor root exists on initial mount.

**Impact on Task 9 Acceptance**:
- Required screenshots with toolbar/editor image cannot be produced because the editor never renders.
