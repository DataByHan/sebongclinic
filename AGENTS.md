# AGENTS.md

Agent guidelines for the Sebong Clinic website codebase.

---

## Project Overview

**Type:** Korean medicine clinic website  
**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS  
**Deployment:** Cloudflare Workers (via @opennextjs/cloudflare) with D1 Database + R2 Storage  
**Domain:** www.sebongclinic.co.kr  
**Worker URL:** sebongclinic.hanms-data.workers.dev  
**Design Philosophy:** Flat, minimal, scrollytelling with Korean aesthetic

---

## Build / Lint / Test Commands

```bash
# Development
npm run dev              # Start dev server at localhost:3000

# Production Build (Static Export)
npm run build            # Build static export to ./out/
npm run start            # Serve production build locally

# Cloudflare Workers Deployment
npm run preview          # Build and preview Workers deployment locally
npm run deploy           # Deploy to Cloudflare Workers (requires CLOUDFLARE_API_TOKEN)

# Quality
npm run lint             # ESLint (next/core-web-vitals)
npx tsc --noEmit         # TypeScript type checking

# E2E Tests (Playwright)
npx playwright install   # Install browsers (one-time setup)
npx playwright test      # Run all E2E tests
npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs  # Run specific test
npx playwright test --headed     # Run with visible browser
npx playwright test --debug      # Run in debug mode
npx playwright show-report       # View test report
```

**Test Infrastructure:** Playwright E2E tests configured in `/e2e/` directory.

### Pre-deployment Checklist
1. `npm run build` succeeds without errors
2. `npx tsc --noEmit` passes without TypeScript errors
3. `npm run lint` passes without ESLint errors
4. `npx playwright test` passes (E2E tests)
5. For Workers deployment: Check D1 database and R2 bucket bindings in `wrangler.jsonc`

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, <html>/<body>)
│   ├── page.tsx                # Homepage (main single-page scroll)
│   ├── globals.css             # CSS vars, custom Tailwind components
│   ├── notices/page.tsx        # Notices listing page (client component)
│   ├── admin-*/page.tsx        # Admin dashboard for notice management
│   └── api/
│       ├── notices/route.ts    # D1 Database API for notices CRUD
│       ├── upload/route.ts     # R2 Bucket API for image uploads
│       └── images/[...key]/route.ts  # Image serving from R2
├── components/
│   ├── Reveal.tsx              # Intersection Observer scroll animation
│   └── KakaoMap.tsx            # Kakao Maps SDK integration
├── lib/
│   ├── site.ts                 # Centralized site config & data
│   └── sanitize.ts             # XSS sanitization for user content
├── types/
│   ├── kakao-maps.d.ts         # Global type definitions for Kakao SDK
│   └── cloudflare.d.ts         # Cloudflare Workers types (D1, R2, env)
└── middleware.ts               # Security headers (CSP, X-Frame-Options)
e2e/
├── task-9-admin-notice.e2e.spec.mjs   # Admin notice editor E2E tests
└── task-10-doctor-section.e2e.spec.mjs # Doctor section E2E tests
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

### 5. API Routes & Database

**D1 Database:** SQLite database for notices

```typescript
// ✅ API route pattern (from src/app/api/notices/route.ts)
import type { NextRequest } from 'next/server'
import type { Notice } from '@/types/cloudflare'

export const runtime = 'edge'  // Required for Cloudflare Workers

export async function GET(request: NextRequest) {
  const env = process.env as unknown as CloudflareEnv
  const results = await env.DB.prepare('SELECT * FROM notices ORDER BY date DESC').all<Notice>()
  return Response.json(results.results)
}
```

**R2 Bucket:** Object storage for uploaded images

```typescript
// ✅ Image upload pattern (from src/app/api/upload/route.ts)
export async function POST(request: NextRequest) {
  const env = process.env as unknown as CloudflareEnv
  const key = `notices/${Date.now()}-${file.name}`
  await env.IMAGES.put(key, file)
  return Response.json({ url: `/api/images/${key}`, key })
}
```

**Environment Types:** Defined in `src/types/cloudflare.d.ts`

```typescript
declare global {
  interface CloudflareEnv {
    DB: D1Database           // Notices database
    IMAGES: R2Bucket         // Image storage
    ADMIN_PASSWORD: string   // Admin auth secret
  }
}
```

### 6. Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `Reveal`, `KakaoMap` |
| Files | kebab-case (pages), PascalCase (components) | `page.tsx`, `Reveal.tsx` |
| Variables | camelCase | `isVisible`, `delayMs` |
| Types/Interfaces | PascalCase | `RevealProps`, `LoadState` |
| CSS Classes | kebab-case | `.flat-card`, `.cta-ghost` |
| CSS Variables | kebab-case | `--paper`, `--ink` |

### 6. Security & Content Sanitization

**XSS Prevention:** All user-generated HTML must be sanitized

```typescript
// ✅ Correct (from src/lib/sanitize.ts)
import xss from 'xss'

export function sanitizeNoticeHtml(html: string): string {
  return xss(html, {
    whiteList: {
      p: ['style'],
      strong: [],
      em: [],
      u: [],
      h1: ['style'], h2: ['style'], h3: ['style'],
      ul: [], ol: [], li: [],
      img: ['src', 'alt', 'style', 'width', 'height', 'data-image-size'],
      a: ['href', 'target', 'rel'],
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style'],
  })
}

// Usage in component
import { sanitizeNoticeHtml } from '@/lib/sanitize'
<div dangerouslySetInnerHTML={{ __html: sanitizeNoticeHtml(notice.content) }} />
```

**CSP Configuration:** Set in `src/middleware.ts` for all routes

```typescript
// Required CSP directives:
"script-src 'self' 'unsafe-inline' https://dapi.kakao.com https://t1.daumcdn.net"
"connect-src 'self' https://dapi.kakao.com https://t1.daumcdn.net"
"img-src 'self' data: blob: https:"
```

**Admin Authentication:** Password-based admin access (secret stored in Cloudflare)

```typescript
// Set secret: wrangler secret put ADMIN_PASSWORD
// Access in API: const password = env.ADMIN_PASSWORD
```

### 7. Error Handling

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

**Deployment:** Run `npm run deploy` to deploy to Cloudflare Workers.  
**Environments:** Production (`sebongclinic`) and Staging (`sebongclinic-staging`) configured in `wrangler.jsonc`.  
**Required:** `CLOUDFLARE_API_TOKEN` environment variable must be set.

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
| Kakao Map not loading | API key correct? CSP allows `t1.daumcdn.net`? Domain registered? |
| Layout broken on mobile | Using responsive classes (`md:`, `lg:`)? |
| API routes fail | Runtime set to `'edge'`? Env types correct? |
| Tests fail | Browsers installed? `E2E_BASE_URL` set? Admin password configured? |

---

## FAQ

**Q: Can I use Next.js `<Image>` component?**  
A: Yes, but only with `images.unoptimized = true`. Prefer `<img>` for static assets.

**Q: Where should I add new pages?**  
A: Create in `src/app/{route}/page.tsx`. Follow App Router conventions.

**Q: Can I use `useState` in page.tsx?**  
A: Only if marked with `'use client'`. Server components don't support hooks.

**Q: How do I change colors?**  
A: Edit CSS variables in `src/app/globals.css` `:root` block. Never hardcode colors.

**Q: How do I access D1/R2 in API routes?**  
A: `const env = process.env as unknown as CloudflareEnv` then use `env.DB` or `env.IMAGES`.

**Q: How do I run tests locally?**  
A: `npx playwright install` (first time), then `npx playwright test`. Set `E2E_BASE_URL` if testing deployed site.

**Q: Where are secrets stored?**  
A: Use `wrangler secret put SECRET_NAME`. Access via `env.SECRET_NAME` in Workers.

---

**Last Updated:** 2026-02-03  
**Codebase Version:** Next.js 14, TypeScript 5.3, Tailwind 3.4
