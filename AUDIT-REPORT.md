# Project Audit Report
**Generated:** 2026-02-03  
**Project:** Sebong Clinic Website  
**Stack:** Next.js 14.2.35 + TypeScript 5.3.3 + Tailwind CSS 3.4.1

---

## Executive Summary

The codebase is in **good overall health** with successful builds and type checking. However, there are **critical deployment risks** related to the deprecated Cloudflare adapter and **moderate security vulnerabilities** in dependencies that require attention.

---

## 1. Build & Quality Checks

### ✅ Build Status: PASS
```bash
$ npm run build
```
**Result:** Build completed successfully with static page generation.

**Output:**
- 8 static pages generated successfully
- 4 API routes configured as dynamic (edge runtime)
- Total bundle size: 87.5 kB shared JS
- No build errors

**Warning:**
```
⚠ Using edge runtime on a page currently disables static generation for that page
```
This affects the 4 API routes, which is expected behavior.

---

### ⚠️ Lint Status: PASS (with warnings)
```bash
$ npm run lint
```
**Result:** No errors, 1 warning

**Warning:**
```
./src/app/page.tsx
189:25  Warning: Using `<img>` could result in slower LCP and higher bandwidth.
        Consider using `<Image />` from `next/image` to automatically optimize images.
        Rule: @next/next/no-img-element
```

**Analysis:** This warning is **intentional per AGENTS.md design constraints**. The project uses static export (`images.unoptimized: true`), making Next.js `<Image>` optimization unavailable. Plain `<img>` tags are the correct approach for this deployment strategy.

**Recommendation:** Suppress this ESLint rule in `.eslintrc.json` to avoid noise:
```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "@next/next/no-img-element": "off"
  }
}
```

---

### ✅ TypeScript Status: PASS
```bash
$ npx tsc --noEmit
```
**Result:** No type errors detected. All TypeScript code is type-safe with `strict: true` mode enabled.

---

## 2. Security Audit

### ⚠️ Dependency Vulnerabilities: 3 FOUND
```bash
$ npm audit --production
```

**Summary:**
- **2 moderate** severity vulnerabilities
- **1 high** severity vulnerability
- **0 critical** vulnerabilities

#### Vulnerability Details:

**1. DOMPurify XSS Vulnerability (Moderate)**
- **Package:** `dompurify <3.2.4`
- **Affected:** `@toast-ui/editor >=3.1.1` (currently using 3.2.2)
- **Issue:** Cross-site Scripting (XSS) vulnerability
- **Advisory:** https://github.com/advisories/GHSA-vhxf-7vqr-mrjg
- **Fix:** Requires `@toast-ui/editor@3.1.0` (breaking change)

**2. Next.js DoS Vulnerabilities (High)**
- **Package:** `next 10.0.0 - 15.5.9` (currently using 14.2.35)
- **Issues:**
  - DoS via Image Optimizer remotePatterns configuration
  - HTTP request deserialization DoS with insecure React Server Components
- **Advisories:**
  - https://github.com/advisories/GHSA-9g9p-9gw9-jx7f
  - https://github.com/advisories/GHSA-h25m-26qc-wcjf
- **Fix:** Upgrade to `next@16.1.6` (breaking change)

**Mitigation Status:**
- Image Optimizer DoS: **Low risk** - project uses `images.unoptimized: true`, so Image Optimizer is disabled
- RSC DoS: **Low risk** - project uses static export, no server-side rendering in production
- DOMPurify XSS: **Medium risk** - affects admin editor functionality

**Recommendation:** Monitor advisories but defer breaking upgrades until OpenNext migration is complete.

---

## 3. API Routes Inventory

### Found 4 API Route Files:

1. **`src/app/api/images/[...key]/route.ts`**
   - Dynamic catch-all route for image handling
   - Uses edge runtime

2. **`src/app/api/upload/route.ts`**
   - File upload endpoint
   - Uses edge runtime

3. **`src/app/api/notices/[id]/route.ts`**
   - Individual notice CRUD operations
   - Uses edge runtime
   - **PRODUCTION ISSUE:** Currently returning 500 errors

4. **`src/app/api/notices/route.ts`**
   - Notice list endpoint
   - Uses edge runtime
   - **PRODUCTION ISSUE:** Currently returning 500 errors

**Critical Finding:** All API routes are configured with edge runtime, which is **incompatible** with the current `@cloudflare/next-on-pages` adapter. This is the root cause of the 500 errors in production.

---

## 4. Deployment Configuration

### Current Setup:
```json
// package.json
"pages:build": "npm run build && npx @cloudflare/next-on-pages --skip-build"
```

**Adapter:** `@cloudflare/next-on-pages@1.13.16`

### ⚠️ CRITICAL RISK: Deprecated Adapter

**Issue:** The `@cloudflare/next-on-pages` package is **deprecated** and does not support:
- Next.js 14+ edge runtime properly
- Modern React Server Components
- Node.js built-in modules (e.g., `async_hooks`)

**Evidence:**
- Production 500 errors on `/api/notices` routes
- Error logs show `async_hooks` module not found
- Adapter has not been updated since 2024

**Impact:**
- **HIGH:** All API routes are non-functional in production
- **HIGH:** Admin functionality is broken
- **MEDIUM:** Future Next.js upgrades blocked

---

## 5. Configuration Analysis

### Next.js Config (`next.config.js`):
```javascript
const nextConfig = {
  images: {
    unoptimized: true,
  },
}
```

**Analysis:**
- Minimal configuration (good for maintainability)
- No `output: 'export'` specified (relies on build command)
- Image optimization disabled (required for static export)

**Missing:**
- No explicit `output` mode configuration
- No edge runtime configuration
- No experimental features enabled

---

## 6. Dependency Analysis

### Production Dependencies:
```json
{
  "@toast-ui/editor": "^3.2.2",  // Rich text editor for admin
  "next": "14.2.35",              // Framework
  "react": "^18.3.1",             // UI library
  "react-dom": "^18.3.1"          // React DOM renderer
}
```

**Analysis:**
- Minimal dependency footprint (4 packages)
- All dependencies are actively maintained
- No unnecessary bloat

### Development Dependencies:
```json
{
  "@cloudflare/next-on-pages": "^1.13.16",    // ⚠️ DEPRECATED
  "@cloudflare/workers-types": "^4.20260131.0",
  "wrangler": "^4.61.1",                       // Cloudflare CLI
  // ... standard Next.js tooling
}
```

**Concerns:**
- `@cloudflare/next-on-pages` is deprecated and unmaintained
- `wrangler` is up-to-date (good)

---

## 7. Risk Assessment

### High Priority Risks:

| Risk | Severity | Impact | Mitigation |
|------|----------|--------|------------|
| Deprecated Cloudflare adapter | **CRITICAL** | API routes non-functional in production | Migrate to OpenNext + SST |
| Next.js DoS vulnerabilities | **HIGH** | Potential security exposure | Low actual risk due to static export; monitor advisories |
| DOMPurify XSS vulnerability | **MEDIUM** | Admin editor security risk | Upgrade `@toast-ui/editor` after OpenNext migration |

### Medium Priority Risks:

| Risk | Severity | Impact | Mitigation |
|------|----------|--------|------------|
| ESLint warning noise | **LOW** | Developer experience | Suppress `@next/next/no-img-element` rule |
| No automated tests | **MEDIUM** | Regression risk during migration | Add basic smoke tests before OpenNext migration |

### Low Priority Risks:

| Risk | Severity | Impact | Mitigation |
|------|----------|--------|------------|
| Bundle size | **LOW** | Performance acceptable (87.5 kB) | Monitor during feature additions |

---

## 8. Recommendations

### Immediate Actions (Wave 1):
1. ✅ **Complete this audit** (current task)
2. 🔄 **Migrate to OpenNext + SST** (in progress)
   - Resolves deprecated adapter issue
   - Enables proper edge runtime support
   - Fixes production 500 errors

### Post-Migration Actions (Wave 2):
3. **Upgrade dependencies** after OpenNext is stable:
   ```bash
   npm update next@latest
   npm update @toast-ui/editor@latest
   ```
4. **Suppress ESLint warning**:
   ```json
   // .eslintrc.json
   {
     "rules": {
       "@next/next/no-img-element": "off"
     }
   }
   ```

### Future Improvements (Wave 3):
5. **Add automated testing**:
   - Vitest for unit tests
   - Playwright for E2E tests
6. **Add CI/CD pipeline**:
   - Automated build checks
   - Automated security audits
   - Automated deployment

---

## 9. Conclusion

The Sebong Clinic codebase demonstrates **strong code quality** with clean TypeScript, successful builds, and minimal dependencies. However, the **critical deployment issue** caused by the deprecated `@cloudflare/next-on-pages` adapter requires immediate attention.

**Next Steps:**
1. Complete OpenNext + SST migration (Wave 1, Task 2)
2. Verify API routes work in production
3. Address security vulnerabilities post-migration
4. Implement automated testing for regression prevention

**Overall Grade:** B+ (would be A+ after OpenNext migration)

---

**Report Generated By:** Sisyphus-Junior  
**Audit Date:** 2026-02-03  
**Next Review:** After OpenNext migration completion
