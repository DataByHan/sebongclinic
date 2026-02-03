# How to Unblock Tasks 5-6: Cloudflare API Token Required

## TL;DR

You need a **Cloudflare API Token** to complete the deployment. Once you provide it, Tasks 5-6 will take ~30 minutes.

---

## Step 1: Create Cloudflare API Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Select **"Create Custom Token"**
4. Configure permissions:
   - **D1**: Edit
   - **R2**: Edit
5. Click **"Continue to Summary"**
6. Click **"Create Token"**
7. **Copy the token** (you'll only see it once!)

---

## Step 2: Export Token to Environment

```bash
export CLOUDFLARE_API_TOKEN='<paste-your-token-here>'
```

Verify it's set:
```bash
echo $CLOUDFLARE_API_TOKEN
# Should output your token
```

---

## Step 3: Run Tasks 5-6

### Task 5: Staging Deployment (15 minutes)

```bash
cd /home/han/project/sebongclinic

# Set staging admin password (choose a strong password)
export SEBONGCLINIC_ADMIN_PASSWORD_STAGING='your-staging-password'

# Deploy staging
npm run deploy -- --env staging

# Verify staging is live
curl -i https://sebongclinic-staging.workers.dev/api/notices
# Should return 200 with JSON
```

### Task 6: Production Deployment (15 minutes)

```bash
# Set production admin password (choose a strong password)
export SEBONGCLINIC_ADMIN_PASSWORD_PROD='your-production-password'

# Deploy production
npm run deploy

# Verify production is live
curl -i https://www.sebongclinic.co.kr/api/notices
# Should return 200 with JSON (no 500 error!)
```

---

## Verification Checklist

After deployment, verify everything works:

### Staging Verification
```bash
# List notices (should return 200)
curl -i https://sebongclinic-staging.workers.dev/api/notices

# Test wrong password (should return 401)
curl -i -X POST https://sebongclinic-staging.workers.dev/api/notices \
  -H 'Content-Type: application/json' \
  -d '{"title":"test","content":"test","password":"wrong"}'

# Test image upload with wrong password (should return 401)
curl -i -X POST https://sebongclinic-staging.workers.dev/api/upload \
  -F 'password=wrong' \
  -F 'file=@public/favicon.ico'
```

### Production Verification
```bash
# List notices (should return 200, NOT 500!)
curl -i https://www.sebongclinic.co.kr/api/notices

# Test wrong password (should return 401)
curl -i -X POST https://www.sebongclinic.co.kr/api/notices \
  -H 'Content-Type: application/json' \
  -d '{"title":"test","content":"test","password":"wrong"}'

# View public notices page
curl -i https://www.sebongclinic.co.kr/notices
```

---

## What Gets Deployed

### Staging Worker
- **Name**: `sebongclinic-staging`
- **URL**: `https://sebongclinic-staging.workers.dev`
- **Database**: `sebongclinic-db-staging` (separate from production)
- **Images**: `sebongclinic-images-staging` (separate from production)

### Production Worker
- **Name**: `sebongclinic`
- **URL**: `https://www.sebongclinic.co.kr` (custom domain)
- **Database**: `sebongclinic-db` (existing)
- **Images**: `sebongclinic-images` (existing)

---

## Troubleshooting

### "You are not authenticated"
```bash
# Make sure you exported the token
echo $CLOUDFLARE_API_TOKEN
# If empty, re-export it:
export CLOUDFLARE_API_TOKEN='<your-token>'
```

### "D1_ERROR: no such table"
```bash
# Schema wasn't applied. The deployment script should do this automatically,
# but if it fails, apply manually:
wrangler d1 execute sebongclinic-db-staging --file=./db/schema.sql
```

### "Unauthorized" on POST /api/notices
```bash
# You're using the wrong password. Make sure you set the correct one:
export SEBONGCLINIC_ADMIN_PASSWORD_STAGING='your-password'
npm run deploy -- --env staging
```

### "Worker not found" or 404
```bash
# Deployment might still be in progress. Wait 30 seconds and try again.
# If it persists, check:
wrangler deployments list
```

---

## After Deployment

### Run E2E Tests
```bash
# Start local preview
npm run preview

# In another terminal, run E2E test
npx playwright test e2e/task-9-admin-notice.e2e.spec.mjs
```

### Monitor Production
- Keep Cloudflare Pages as rollback target (do NOT delete)
- Monitor for 48 hours before decommissioning Pages
- Check logs in Cloudflare Dashboard

### Next Steps
1. Test admin editor with real images
2. Verify all images load correctly
3. Test on mobile devices
4. Monitor error rates

---

## Rollback Procedure (If Something Goes Wrong)

If production breaks after deployment:

1. **Option A**: Revert to Pages
   - Go to Cloudflare Dashboard
   - Remove custom domain mapping from Worker
   - Map `www.sebongclinic.co.kr` back to Pages

2. **Option B**: Deploy previous Worker version
   - Check `wrangler deployments list`
   - Deploy previous version if available

3. **Option C**: Verify Pages is still working
   ```bash
   # Find Pages URL
   wrangler pages project list
   
   # Test Pages
   curl -i https://<project>.pages.dev/
   ```

---

## Questions?

Refer to these files for more details:
- `.sisyphus/BOULDER_CONTINUATION_FINAL_STATUS.md` - Full status report
- `.sisyphus/plans/sebongclinic-audit-500-opennext-toastui.md` - Original plan
- `.sisyphus/notepads/sebongclinic-audit-500-opennext-toastui/` - Learnings & issues

---

**Status**: Ready for deployment  
**Estimated Time**: 30 minutes (15 min staging + 15 min production)  
**Blocker**: Cloudflare API Token (user-side)
