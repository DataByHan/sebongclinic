# Notice Markdown Render Fix - Learnings

## 2026-02-04 Session: Markdown Rendering Fix (Ongoing)

### Task 1: Database Check
- **Status**: COMPLETE
- **Finding**: No broken rows exist in local D1 (no `format='markdown'` with empty `content_md`)
- **Implication**: Issue must occur during new notice creation or editing

### Task 2: Implemented Defensive Fallback Rendering
- **Status**: COMPLETE
- **Added fallback logic to API GET handlers** (both list and detail)
- When `format='markdown'` and `content_md` is empty:
  - Check if `content` starts with `<` (already HTML)
  - If not, treat as markdown source and render via `marked()`
  - Wrap fallback in try-catch for robustness
  - Always sanitize output before returning
- **Files modified**:
  - `src/app/api/notices/route.ts` (lines 41-52)
  - `src/app/api/notices/[id]/route.ts` (lines 47-58)
- **Verification**: TypeScript zero errors, build succeeds, lint passes

### Task 3: Verification with Test Data
- **Status**: COMPLETE
- **Created 3 test notices**:
  1. **MD normal**: format='markdown', content_md populated, content already HTML
  2. **MD broken**: format='markdown', content_md=NULL, content=raw markdown (injected for testing)
  3. **HTML control**: format='html', content=plain HTML
- **API Response Verification**:
  - ✅ MD normal: Returns HTML (`<h1>` present), no raw markdown
  - ✅ MD broken: Fallback rendered it! Returns HTML (`<h1>` present), no raw markdown
  - ✅ HTML control: Unchanged, returns plain HTML unmodified
  - ✅ Detail endpoint (`/api/notices/[id]`) mirrors list behavior
- **Conclusion**: Fallback rendering works correctly; raw markdown no longer leaks to client

### Key Technical Insight
The fallback detection uses `!content.trim().startsWith('<')` to distinguish:
- Already-HTML content (starts with `<`) → use as-is (still sanitize)
- Markdown content (doesn't start with `<`) → render via `marked()`
This simple heuristic correctly handles both normal and broken states.

### Next Steps
- Optional: Create Playwright E2E test for markdown rendering on `/notices` page
- Optional: Data cleanup/backfill for any existing broken rows in production
