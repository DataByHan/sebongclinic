
## Task: Add Markdown Headings E2E Test

### Completion Summary
✅ Added new Playwright E2E test to `e2e/task-9-admin-notice.e2e.spec.mjs`
✅ Test verifies markdown headings render as HTML `<h1>`, `<h2>`, `<h3>` elements
✅ Test confirms raw markdown markers (`#`, `##`, `###`) are NOT visible
✅ All 4 tests in file pass (including new test)
✅ Screenshot saved to `.sisyphus/evidence/task-9-markdown-headings-render.png`

### Test Implementation Details

**Test Name:** "Markdown headings render as HTML (not raw text)"
**Location:** `e2e/task-9-admin-notice.e2e.spec.mjs:247-283`

**Test Flow:**
1. Login to admin UI with password
2. Create notice with markdown body: `# Heading\n## H2\n### H3`
3. Navigate to `/notices` page
4. Find notice by title substring
5. Assert h1 element contains "Heading"
6. Assert h2 element contains "H2"
7. Assert h3 element contains "H3"
8. Assert raw markdown text NOT in `.notice-content` innerHTML
9. Save screenshot to evidence directory

**Key Assertions:**
- `await expect(notice.locator('h1')).toContainText('Heading')`
- `await expect(notice.locator('h2')).toContainText('H2')`
- `await expect(notice.locator('h3')).toContainText('H3')`
- `expect(contentHtml.includes('# Heading')).toBeFalsy()`
- `expect(contentHtml.includes('## H2')).toBeFalsy()`
- `expect(contentHtml.includes('### H3')).toBeFalsy()`

### Test Patterns Used
- `loginAdmin(page)` - Admin authentication helper
- `createNoticeFromAdmin(page, { title, markdown })` - Notice creation helper
- `findNoticeArticle(page, { titleSubstring })` - Notice lookup helper
- `test.setTimeout(120_000)` - Extended timeout for slow operations
- `test.skip(!password, 'Missing ADMIN_PASSWORD')` - Skip guard
- `page.setViewportSize({ width: 1280, height: 900 })` - Viewport setup
- `page.screenshot({ path: evidence.markdownHeadings, fullPage: true })` - Evidence capture

### Test Results
```
Running 4 tests using 1 worker

  ✓  1 Create GFM notice and verify public render (2.5s)
  ✓  2 XSS is stripped (2.7s)
  ✓  3 Image upload still works and renders publicly (4.3s)
  ✓  4 Markdown headings render as HTML (not raw text) (2.5s)

  4 passed (13.0s)
```

### Evidence
- Screenshot: `.sisyphus/evidence/task-9-markdown-headings-render.png` (41KB)
- Shows three headings rendered with proper typography (no raw markdown markers visible)

### Verification Checklist
✅ Test file syntax valid (no TypeScript errors)
✅ Test passes when run: `npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs --grep "Markdown headings"`
✅ All existing tests still pass
✅ Screenshot captured successfully
✅ Test follows existing code patterns and conventions
✅ Test uses correct helper functions
✅ Test has proper timeout and skip guards
✅ Test has both positive and negative assertions

