# AGENTS.md

Agent guidelines for the Sebong Clinic website codebase.

---

## Project Overview

**Type:** Korean medicine clinic website  
**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS  
**Deployment:** Static export (`output: 'export'`) → Cloudflare Pages  
**Domain:** www.sebongclinic.co.kr  
**Design Philosophy:** Flat, minimal, scrollytelling with Korean aesthetic

---

## Build / Lint / Test Commands

```bash
# Development
npm run dev              # Start dev server at localhost:3000

# Production
npm run build            # Build static export to ./out/
npm run start            # Serve production build locally

# Quality
npm run lint             # ESLint (next/core-web-vitals)
```

**No test suite configured.** Manual verification required.

### Pre-deployment Checklist
1. `npm run build` succeeds without errors
2. Check `./out/` directory contains expected files
3. Images in `public/img/` copied to `out/img/`
4. No TypeScript errors (`npx tsc --noEmit`)

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata, <html>/<body>)
│   ├── page.tsx            # Homepage (main single-page scroll)
│   ├── globals.css         # CSS vars, custom Tailwind components
│   └── notices/page.tsx    # Static notices page
├── components/
│   ├── Reveal.tsx          # Intersection Observer scroll animation
│   └── KakaoMap.tsx        # Kakao Maps SDK integration
├── lib/
│   └── site.ts             # Centralized site config & data
└── types/
    └── kakao-maps.d.ts     # Global type definitions
```

**Key principle:** Centralize data in `src/lib/site.ts`. Components consume, don't define.

---

## Code Style Guidelines

### 1. Imports

**Order:** React → Next.js → Third-party → Local (types → components → lib)

```typescript
// ✅ Correct
import { useEffect, useRef } from 'react'
import type { Metadata } from 'next'
import Reveal from '@/components/Reveal'
import { site } from '@/lib/site'

// ❌ Wrong
import { site } from '@/lib/site'
import Reveal from '@/components/Reveal'
import { useEffect, useRef } from 'react'
```

**Path Aliases:** Use `@/` for all src imports (configured in tsconfig.json)

```typescript
// ✅ Correct
import { site } from '@/lib/site'

// ❌ Wrong
import { site } from '../lib/site'
```

### 2. TypeScript

**Strictness:** `strict: true` in tsconfig.json. No exceptions.

**Type Imports:** Use `import type` for type-only imports

```typescript
// ✅ Correct
import type { Metadata, Viewport } from 'next'

// ❌ Wrong
import { Metadata, Viewport } from 'next'
```

**Props Types:** Define inline for single-use, extract for reuse

```typescript
// ✅ Single-use component
export default function MyComponent({ title, children }: {
  title: string
  children: React.ReactNode
}) {
  // ...
}

// ✅ Reusable type
type RevealProps = {
  children: React.ReactNode
  className?: string
  delayMs?: number
}
export default function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  // ...
}
```

**Type Narrowing:** Use `satisfies` for const assertions with type checking

```typescript
// ✅ Correct (type-safe + const inference)
export const site = {
  specialties: [/* ... */] satisfies Specialty[],
  externalLinks: [/* ... */] satisfies ExternalLink[],
} as const

// ❌ Wrong (loses literal types)
export const site: SiteConfig = { /* ... */ }
```

**Never suppress errors:** No `any`, `@ts-ignore`, `@ts-expect-error` allowed.

### 3. React Patterns

**Client Components:** Mark with `'use client'` directive at top of file

```typescript
// ✅ Correct
'use client'

import { useState } from 'react'
```

**Cleanup Pattern:** Use cancellation flags in async effects

```typescript
// ✅ Correct
useEffect(() => {
  let cancelled = false

  const fetchData = async () => {
    const result = await fetch(/* ... */)
    if (cancelled) return  // Prevent state update after unmount
    setState(result)
  }

  fetchData()
  return () => { cancelled = true }
}, [])
```

**State Machines:** Use discriminated unions for loading states

```typescript
// ✅ Correct
type LoadState = 'idle' | 'loading' | 'ready' | 'error'
const [state, setState] = useState<LoadState>('idle')
```

### 4. Styling (Tailwind + CSS Variables)

**Design System:** Custom CSS vars defined in `globals.css`

```css
:root {
  --paper: #f6f5f1;        /* Primary background */
  --paper-2: #f2f1ec;      /* Secondary background */
  --ink: #0f172a;          /* Primary text */
  --muted: #475569;        /* Secondary text */
  --line: rgba(15, 23, 42, 0.14);  /* Borders */
  --jade: #1f6f5b;         /* Accent green */
  --tangerine: #e0563a;    /* Accent orange */
}
```

**Use vars in Tailwind:** `[color:var(--variable)]` syntax

```tsx
// ✅ Correct
<div className="bg-[color:var(--paper)] text-[color:var(--ink)]">

// ❌ Wrong (hardcoded colors)
<div className="bg-gray-100 text-gray-900">
```

**Custom Component Classes:** Defined in `@layer components` in globals.css

- `.frame` - Content container with max-width
- `.flat-card` - Card with border + white bg
- `.flat-chip` - Pill-shaped badge
- `.flat-link` - Underlined link with hover
- `.cta` - Primary button (filled)
- `.cta-ghost` - Secondary button (outlined)
- `.type-sans` - Sans-serif font (Noto Sans KR)
- `.type-serif` - Serif font (Nanum Myeongjo)

**Dynamic Classes:** Use array join pattern

```tsx
// ✅ Correct
<div className={[
  'base-classes',
  condition ? 'conditional-class' : '',
  className ?? '',
].join(' ')}>

// ❌ Wrong (hard to read)
<div className={`base ${condition ? 'conditional' : ''} ${className || ''}`}>
```

**Spacing Consistency:** Section spacing is **always** `py-24 md:py-40`

```tsx
// ✅ Correct
<section className="scroll-mt-24 py-24 md:py-40">

// ❌ Wrong (inconsistent)
<section className="py-16">
```

### 5. Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `Reveal`, `KakaoMap` |
| Files | kebab-case (pages), PascalCase (components) | `page.tsx`, `Reveal.tsx` |
| Variables | camelCase | `isVisible`, `delayMs` |
| Types/Interfaces | PascalCase | `RevealProps`, `LoadState` |
| CSS Classes | kebab-case | `.flat-card`, `.cta-ghost` |
| CSS Variables | kebab-case | `--paper`, `--ink` |

### 6. Error Handling

**User-facing errors:** Show friendly Korean messages

```tsx
// ✅ Correct
{state === 'error' ? '지도를 불러오지 못했습니다.' : '지도를 불러오는 중…'}
```

**Async errors:** Silent catch with state updates

```typescript
// ✅ Correct
try {
  await loadKakaoScript(appKey)
  setState('ready')
} catch {
  if (cancelled) return
  setState('error')
}
```

**Never throw uncaught errors** that would break the entire app.

---

## External Integrations

### Kakao Maps SDK

**Loading Pattern:** Dynamic script loading with `autoload=false`

```typescript
// See src/components/KakaoMap.tsx for reference implementation
const script = document.createElement('script')
script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`
script.onload = () => {
  window.kakao.maps.load(() => resolve())
}
```

**Type Safety:** Global types in `src/types/kakao-maps.d.ts`

```typescript
declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void
        // ...
      }
    }
  }
}
```

**API Key:** Stored in component as const (not .env, since static export)

---

## Design Constraints

### Non-Negotiable Rules

1. **No external UI libraries:** Tailwind only. No Shadcn, MUI, etc.
2. **Flat design only:** No heavy shadows, 3D effects, or gradients (except mesh bg)
3. **Static export:** No server-side APIs, dynamic routes, or image optimization
4. **No TypeScript suppression:** No `any`, `@ts-ignore`, `@ts-expect-error`
5. **Consistent spacing:** All sections use `py-24 md:py-40`
6. **Scrollytelling:** Use `<Reveal>` component for scroll animations

### Visual Guidelines

- **Font:** Noto Sans KR (sans), Nanum Myeongjo (serif)
- **Colors:** Use CSS vars only (never hardcode hex/rgb)
- **Borders:** `border-[color:var(--line)]` everywhere
- **Rounded corners:** `rounded-2xl` for cards/buttons
- **Animations:** Subtle, performance-first (transform + opacity only)

---

## Common Tasks

### Adding New Section

1. **Structure:** Copy existing section pattern from `src/app/page.tsx`
2. **Spacing:** Use `py-24 md:py-40`
3. **Scroll target:** Add `id="section-name"` and `scroll-mt-24`
4. **Animation:** Wrap content in `<Reveal>` components
5. **Data:** Store in `src/lib/site.ts`, not inline

### Modifying Site Data

**Always edit `src/lib/site.ts`**, never hardcode in components.

```typescript
// ✅ Correct
export const site = {
  name: '세봉(世奉)한의원',
  specialties: [/* ... */],
  hours: [/* ... */],
}
```

### Adding Images

1. Place in `public/img/` directory
2. Reference as `/img/filename.jpg` (not `./img/...`)
3. Images auto-copied to `out/img/` during build
4. Use `<img>` tag (Next.js `<Image>` incompatible with static export)

---

## Git Workflow

**Commit Style:** Conventional Commits

```bash
# ✅ Examples
git commit -m "feat: add specialty card images"
git commit -m "style: adjust section spacing to py-40"
git commit -m "fix: correct Kakao Maps API key"
git commit -m "refactor: extract site config to lib/site.ts"
```

**Push Behavior:** Auto-deploys to Cloudflare Pages on push to `master`.

---

## Agent-Specific Notes

### When Making Changes

1. **Check existing patterns first** - Don't introduce new conventions
2. **Run build after edits** - `npm run build` must succeed
3. **Verify types** - `npx tsc --noEmit` should pass
4. **Test locally** - Run `npm run dev` and check browser
5. **Match design system** - Use CSS vars, custom classes, consistent spacing

### What NOT to Do

❌ Install new dependencies without asking  
❌ Change TypeScript config (strict mode is required)  
❌ Use inline styles (Tailwind classes only)  
❌ Modify `next.config.js` (static export required)  
❌ Create new design patterns (follow existing)  
❌ Break responsive layout (test mobile views)  

### Debugging Checklist

| Issue | Check |
|-------|-------|
| Build fails | TypeScript errors? ESLint errors? |
| Images missing | Files in `public/img/`? Correct path `/img/...`? |
| Styles broken | Using CSS vars? Custom classes imported? |
| Kakao Map not loading | API key correct? Domain registered in Kakao console? |
| Layout broken on mobile | Using responsive classes (`md:`, `lg:`)? |

---

## FAQ

**Q: Can I use Next.js `<Image>` component?**  
A: No. Static export requires `images.unoptimized = true`, so use plain `<img>` tags.

**Q: Where should I add new pages?**  
A: Create in `src/app/{route}/page.tsx`. Follow App Router conventions.

**Q: Can I use `useState` in page.tsx?**  
A: No, it's a Server Component. Extract client logic to separate component with `'use client'`.

**Q: How do I change colors?**  
A: Edit CSS variables in `src/app/globals.css` `:root` block. Never hardcode colors.

**Q: Why no .env file?**  
A: Static export means no server. All config must be build-time constants.

---

**Last Updated:** 2026-02-03  
**Codebase Version:** Next.js 14, TypeScript 5.3, Tailwind 3.4
