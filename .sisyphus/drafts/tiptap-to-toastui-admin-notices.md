# Draft: Replace TipTap with Toast UI Editor (Admin Notices)

## Requirements (confirmed)
- Replace TipTap editor with Toast UI Editor in `src/app/admin-8f3a9c2d4b1e/page.tsx`.
- Remove editor-related toolbar controls (image add + formatting buttons like bold/italic/etc.).
- Preserve existing admin flow: login gate, list rendering, create/edit/delete, and submission to `/api/notices`.
- Minimal changes; follow existing project conventions (Next.js App Router + Tailwind).

## Current Implementation Findings (observed)
- `src/app/admin-8f3a9c2d4b1e/page.tsx` is a client component using TipTap:
  - `useEditor` + `EditorContent` with `StarterKit` + `@tiptap/extension-image`.
  - Custom toolbar buttons call `editor.chain().focus().toggleBold()` etc.
  - Custom image upload UI (`이미지 추가`) + drag-and-drop handler posts to `/api/upload` and inserts `<img>` into editor.
  - Submission currently uses HTML: `const html = editor.getHTML()` and sends `{ title, content: html, password }`.
  - Edit loads HTML into editor: `editor?.commands.setContent(notice.content)`.
- Notice display pages render HTML directly:
  - `src/app/notices/page.tsx` uses `dangerouslySetInnerHTML={{ __html: notice.content }}`.
  - `src/app/admin-8f3a9c2d4b1e/page.tsx` list view also uses `dangerouslySetInnerHTML`.
- APIs:
  - `src/app/api/notices/route.ts` expects `content: string` (no format validation) and stores it.
  - `src/app/api/notices/[id]/route.ts` updates/deletes similarly.
  - `src/app/api/upload/route.ts` is image upload to R2, guarded by password.

## Constraints
- Planning-only session: no file modifications, no dependency changes, no commands.

## Technical Decisions (pending)
- Content format to store after migration: keep HTML (minimal change) vs switch to Markdown.
- Toolbar removal interpretation: remove *custom* toolbar only vs ensure Toast UI built-in toolbar is hidden/empty.
- Image handling: keep `/api/upload` unused (just remove UI) vs explicitly disable any editor image hooks.

## Research Findings
- Pending: Toast UI Editor React integration details from librarian.

## Open Questions
- Should notices continue to be stored as HTML (recommended for minimal change), or is it acceptable to migrate to Markdown and add rendering changes?
- When you say “remove toolbar buttons”, do you want:
  - (A) no toolbar at all
  - (B) a very minimal toolbar (e.g. undo/redo only)

## Scope Boundaries
- INCLUDE: admin editor swap + content-handling migration steps + UI toolbar removal.
- EXCLUDE: redesign of admin page, auth hardening, API schema changes, new editor features.
