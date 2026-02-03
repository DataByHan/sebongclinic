# Notice Image Sizes + Doctor Profile - Learnings

## 2026-02-03 Session (Completed)

### Image Size CSS Implementation
- **Pattern**: Scoped CSS rules using attribute selectors on `<img>` tags
- **Location**: `src/app/globals.css` @layer utilities (lines 67-95)
- **Key learning**: Tailwind Typography plugin is NOT enabled, so `.prose` class is just a utility class name for grouping. We add our own image sizing rules under that selector.
- **Mobile safety**: Always include `max-width: 100%` + `height: auto` + `display: block` + `margin: auto` for centering and responsiveness

### Doctor Section Refactor
- **Pattern**: Inline flex layout for heading + badge using `flex flex-wrap items-center gap-3`
- **Simplification**: Removed nested card structure (2 cards → 1 card); kept profile content, removed duplicate credential display
- **Design**: Badge uses `--jade` accent color with tinted background (`bg-[color:var(--jade)]/5`)
- **Accessibility**: Added `data-testid` attributes for both badge and profile card for e2e testing

### Toast UI Editor Integration
- **Command registration**: `editor.addCommand('wysiwyg', 'setNoticeImageSize', callback)`
- **ProseMirror pattern**: Use `tr.setNodeMarkup(pos, null, { ...attrs, 'data-notice-size': size })` to update node attributes
- **Image detection**: Search from cursor position both forward (`$from.nodeAfter`) and backward (`$from.nodeBefore`) to find image node
- **Error handling**: Alert message "이미지를 선택해 주세요." when no image selected
- **Toolbar insertion**: `insertToolbarItem({ groupIndex: 0, itemIndex: 999 }, {...})` appends to toolbar

### Test Coverage
- **Playwright patterns**: Use `expect(...).toBeVisible({ timeout: 30_000 })` instead of manual waits
- **Evidence location**: `.sisyphus/evidence/` directory for screenshots
- **Data attributes**: Essential for reliable DOM selection in tests
- **Test environment**: Cloudflare preview at http://localhost:8787 (via `npm run preview`)

## Conventions Discovered

- Section spacing: `py-24 md:py-40` (consistent across all sections)
- Component classes: `.flat-card`, `.flat-chip`, `.type-serif`, `.text-[color:var(--ink)]`
- CSS variables: `--paper`, `--paper-2`, `--ink`, `--muted`, `--line`, `--jade`, `--tangerine`
- File organization: Data in `src/lib/site.ts`, components in `src/app/`, styles in `globals.css`

## No Known Issues

- All tasks completed successfully
- Build passes (static export to `./out/`)
- Type checking clean (except expected .next/types rebuild artifacts)
- ESLint warnings are pre-existing (Next.js `<img>` vs `<Image>` recommendation)

