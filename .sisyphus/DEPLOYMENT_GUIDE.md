# Deployment Guide - Sebong Clinic OpenNext Migration

## Prerequisites

Before deploying, ensure you have:
1. Cloudflare account with access to sebongclinic.co.kr domain
2. Cloudflare API token with D1 Edit and R2 Edit permissions
3. Node.js and npm installed
4. Git access to the repository

## Deployment Steps

### Step 1: Set Environment Variables

```bash
# Set Cloudflare API token
export CLOUDFLARE_API_TOKEN='<your-api-token>'

# Set admin passwords
export SEBONGCLINIC_ADMIN_PASSWORD_STAGING='<staging-password>'
export SEBONGCLINIC_ADMIN_PASSWORD_PROD='<production-password>'
```

### Step 2: Create Staging Resources (Task 5)

```bash
# Create staging D1 database
npm exec wrangler -- d1 create sebongclinic-db-staging

# Capture the database_id from the output and update wrangler.jsonc
# Replace PLACEHOLDER_STAGING_DB_ID with the actual ID

# Create staging R2 bucket
npm exec wrangler -- r2 bucket create sebongclinic-images-staging

# Apply schema to staging D1
npm exec wrangler -- d1 execute sebongclinic-db-staging --file=./db/schema.sql

# Set staging secret
printf %s "$SEBONGCLINIC_ADMIN_PASSWORD_STAGING" | npm exec wrangler -- secret put ADMIN_PASSWORD --env staging

# Deploy staging Worker
npm run deploy -- --env staging

# Capture staging URL from deployment output
# Test staging endpoints:
curl -i https://<staging-url>/api/notices
curl -i -X POST https://<staging-url>/api/notices -H 'Content-Type: application/json' -d '{"title":"test","content":"test","password":"wrong"}'
```

### Step 3: Production Deployment (Task 6)

```bash
# Set production secret
printf %s "$SEBONGCLINIC_ADMIN_PASSWORD_PROD" | npm exec wrangler -- secret put ADMIN_PASSWORD

# Deploy production Worker
npm run deploy

# Update wrangler.jsonc with custom domain routing (if needed)
# Add to wrangler.jsonc:
# "routes": [
#   {
#     "pattern": "www.sebongclinic.co.kr/*",
#     "zone_name": "sebongclinic.co.kr"
#   }
# ]

# Re-deploy with routes
npm run deploy

# Verify production endpoints
curl -i https://www.sebongclinic.co.kr/api/notices
curl -i https://www.sebongclinic.co.kr/api/notices/1
curl -i https://www.sebongclinic.co.kr/notices

# Verify rollback option (Pages still available)
wrangler pages project list
```

### Step 4: E2E Testing

```bash
# Run Playwright E2E test against staging
E2E_BASE_URL=https://<staging-url> npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs

# Run Playwright E2E test against production
E2E_BASE_URL=https://www.sebongclinic.co.kr npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs
```

### Step 5: Monitoring

```bash
# Monitor Worker logs
wrangler tail

# Check D1 database status
npm exec wrangler -- d1 info sebongclinic-db

# Check R2 bucket status
npm exec wrangler -- r2 bucket list
```

## Rollback Procedure

If production deployment fails:

```bash
# Option 1: Revert to previous Worker version
wrangler rollback

# Option 2: Restore Cloudflare Pages as primary
# Via Cloudflare Dashboard: Update custom domain mapping back to Pages

# Option 3: Verify Pages is still available
curl -i https://<project>.pages.dev/
```

## Troubleshooting

### D1 "no such table" error
```bash
# Apply schema to the database
npm exec wrangler -- d1 execute sebongclinic-db --file=./db/schema.sql
```

### R2 bucket not found
```bash
# List available buckets
npm exec wrangler -- r2 bucket list

# Create if missing
npm exec wrangler -- r2 bucket create sebongclinic-images
```

### Secret not set
```bash
# List secrets
npm exec wrangler -- secret list

# Set secret
printf %s "<password>" | npm exec wrangler -- secret put ADMIN_PASSWORD
```

### Worker deployment fails
```bash
# Check build output
npm run build

# Verify wrangler.jsonc syntax
npm exec wrangler -- publish --dry-run

# Check compatibility flags
npm exec wrangler -- publish --compatibility-flags nodejs_compat
```

## Success Criteria

After deployment, verify:

- [ ] `GET https://www.sebongclinic.co.kr/api/notices` returns 200
- [ ] `POST https://www.sebongclinic.co.kr/api/notices` with wrong password returns 401
- [ ] `POST https://www.sebongclinic.co.kr/api/upload` works with correct password
- [ ] `GET https://www.sebongclinic.co.kr/api/images/...` returns uploaded images
- [ ] `GET https://www.sebongclinic.co.kr/notices` displays public notices
- [ ] `GET https://www.sebongclinic.co.kr/admin-8f3a9c2d4b1e` shows login page
- [ ] Admin can create notice with image upload
- [ ] E2E tests pass against production
- [ ] Cloudflare Pages still available as rollback option

## Support

For issues during deployment:
1. Check `.sisyphus/notepads/sebongclinic-audit-500-opennext-toastui/` for learnings and known issues
2. Review `AUDIT-REPORT.md` for security and dependency information
3. Check `wrangler.jsonc` for binding configuration
4. Verify environment variables are set correctly

