## Admin Notice Editor Refactor (Markdown Mode)

### Changes Made
1. **Removed custom preview panel** - Eliminated external "게시 미리보기" section
2. **Removed image resize functionality** - Deleted all drag-resize UI and ProseMirror commands
3. **Simplified to Markdown mode** - Editor now uses `initialEditType: 'markdown'` with `previewStyle: 'vertical'`
4. **Added Markdown storage** - Notices now save both `content` (HTML) and `content_md` (Markdown source)
5. **Backwards compatibility** - Legacy HTML notices can still be edited (detected by missing `content_md`)

### Code Removed
- State: `previewHtml`, `isDragging`, `dragStart`, `dragCurrentWidth`, `resizeHandlePos`
- Refs: `previewRef`, `resizeHandleRef`
- Functions: `updateResizeHandlePosition`, `updateSelectedImageHandle`, `handleResizeStart`
- ProseMirror utilities: `parseNoticeImageSizePayload`, `selectionToImageNode`, `findSelectedImage`, etc.
- Custom commands: `setNoticeImageSize`, `setNoticeImageWidth`
- Event listeners: mouseup/keyup/focusin/click for image selection
- JSX: Resize handle UI, preview panel section

### New Flow
1. User types in Markdown mode with built-in vertical preview
2. On save:
   - Get Markdown: `editor.getMarkdown()`
   - Get HTML: `editor.getHTML()` → sanitize
   - Send: `{ title, content, content_md, format: 'markdown', password }`
3. On edit:
   - Markdown notices: Load with `editor.setMarkdown(notice.content_md)`
   - Legacy HTML: Load with `editor.setHTML(notice.content)` + warning

### Key Patterns
- **Format detection**: `const isMarkdownNotice = !!notice.content_md`
- **Conditional save**: Legacy HTML edits save as `format: 'html'` (no `content_md`)
- **Editor height**: Increased to `500px` (was `300px`) for better preview visibility
- **Image upload**: Unchanged - still uses `addImageBlobHook` with `/api/upload`

### Verification
- TypeScript: ✅ Zero errors
- Build: ✅ Succeeds
- Bundle size: Admin page is 2.92 kB (reduced)

## Task 6: Public Page Rendering Verification (2026-02-04)

### Key Finding
**Public notices page requires NO code changes.** The existing rendering logic is format-agnostic and already handles both legacy HTML and new Markdown notices correctly.

### Rendering Architecture
1. **API Layer (GET /api/notices):**
   - Fetches all notices from D1 database
   - Sanitizes `content` field on read (defense-in-depth)
   - Returns both `format` and `content_md` fields
   - Public page receives pre-sanitized HTML

2. **Public Page (src/app/notices/page.tsx):**
   - Uses `dangerouslySetInnerHTML` with `sanitizeNoticeHtml()` wrapper
   - Format-agnostic: works with both HTML and Markdown-converted HTML
   - No changes needed

3. **Sanitization (src/lib/sanitize.ts):**
   - Whitelist includes all GFM tags: `table`, `thead`, `tbody`, `tr`, `th`, `td`, `del`, `input`
   - Attributes allowed: `align` (tables), `type="checkbox"`, `checked`, `disabled` (task lists)
   - Security: event handlers blocked, JavaScript URLs blocked, safe URL validation

### Rendering Flow
- **Legacy HTML:** Admin creates → API stores → API sanitizes → Page renders ✅
- **Markdown:** Admin creates → Editor converts to HTML with GFM → API stores + sanitizes → Page renders ✅

### Guarantees
- Legacy HTML notices continue to render without modification
- Markdown notices with GFM (tables, task lists, strikethrough) render correctly
- Double-sanitized (API + page component) for security
- No breaking changes to existing rendering code

### Conclusion
The public notices page is already correctly configured. No code changes needed.
