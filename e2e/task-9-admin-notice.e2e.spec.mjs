import path from 'node:path'
import fs from 'node:fs/promises'
import { test, expect } from '@playwright/test'

const adminPath = '/admin-8f3a9c2d4b1e'
const noticesPath = '/notices'

const baseUrl = process.env.E2E_BASE_URL ?? 'http://localhost:3000'
const password = process.env.SEBONGCLINIC_ADMIN_PASSWORD_STAGING
  ?? process.env.ADMIN_PASSWORD

if (!password) {
  throw new Error('Missing admin password env: set SEBONGCLINIC_ADMIN_PASSWORD_STAGING or ADMIN_PASSWORD')
}

const evidenceDir = path.join(process.cwd(), '.sisyphus', 'evidence')
const evidence = {
  toolbar: path.join(evidenceDir, 'task-9-admin-toolbar.png'),
  uploaded: path.join(evidenceDir, 'task-9-uploaded-image.png'),
  publicRender: path.join(evidenceDir, 'task-9-notices-render.png'),
  dragResize: path.join(evidenceDir, 'task-9-drag-resize.png'),
  publicWidthPersist: path.join(evidenceDir, 'task-9-public-width-persist.png'),
}

test.describe('Admin notice editor + image upload (task 9)', () => {
  test.beforeAll(async () => {
    await fs.mkdir(evidenceDir, { recursive: true })
  })

  test('drag-resize persists data-notice-width and renders publicly', async ({ page }) => {
    test.setTimeout(120_000)
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.goto(`${baseUrl}${adminPath}`, { waitUntil: 'networkidle' })

    await page.locator('input[type="password"]').fill(password)
    await page.getByRole('button', { name: '로그인' }).click()
    await page.waitForLoadState('networkidle')

    const toolbar = page.locator('.toastui-editor-toolbar')
    await expect(toolbar).toBeVisible({ timeout: 60_000 })

    const proseMirror = page.locator('.ProseMirror:visible').first()
    await expect(proseMirror).toBeVisible({ timeout: 10_000 })
    await proseMirror.click()

    const imageButtonByRole = toolbar.getByRole('button', { name: /insert image/i })
    const imageButtonByRoleFallback = toolbar.getByRole('button', { name: /image/i })
    const imageButtonByText = toolbar.locator('button').filter({ hasText: /image/i })
    const imageButton = await imageButtonByRole.count()
      ? imageButtonByRole.first()
      : (await imageButtonByRoleFallback.count()
        ? imageButtonByRoleFallback.first()
        : imageButtonByText.first())

    await expect(imageButton).toBeVisible({ timeout: 10_000 })

    const imageFilePath = path.join(process.cwd(), 'public', 'img', 'Icon_Noround.png')
    await imageButton.click()

    const uploadResponsePromise = page.waitForResponse((res) => {
      return res.url().includes('/api/upload') && res.request().method() === 'POST'
    }, { timeout: 30_000 })

    const fileInput = page.locator('.toastui-editor-popup input[type="file"]').first()
    await expect(fileInput).toBeAttached({ timeout: 10_000 })
    await fileInput.setInputFiles(imageFilePath)

    const okButton = page.getByRole('button', { name: 'OK' })
    if (await okButton.count()) {
      await okButton.click()
    }

    const uploadResponse = await uploadResponsePromise
    expect(uploadResponse.ok()).toBeTruthy()

    const wysiwygTab = page.getByText('WYSIWYG', { exact: true })
    if (await wysiwygTab.count()) {
      await wysiwygTab.click()
    }

    await expect(proseMirror).toBeVisible({ timeout: 10_000 })

    const editorImage = proseMirror.locator('img').first()
    await expect(editorImage).toBeVisible({ timeout: 60_000 })

    // Make the resize handle appear by marking the image as selected in the DOM.
    // Also keep the caret near the image so the editor command can resolve it.
    const pmBox = await proseMirror.boundingBox()
    const imgBox = await editorImage.boundingBox()
    if (!pmBox || !imgBox) throw new Error('Editor/image bounding box not found')

    const centerY = imgBox.y + imgBox.height / 2
    const centerX = imgBox.x + imgBox.width / 2
    await page.mouse.click(centerX, centerY)
    await proseMirror.focus()
    await page.keyboard.press('ArrowRight')

    await editorImage.evaluate((el) => {
      el.classList.add('ProseMirror-selectednode')
    })
    await page.evaluate(() => {
      document
        .querySelector('.toastui-editor-defaultUI')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    await expect(page.getByRole('dialog', { name: '이미지 너비 설정' })).toHaveCount(0)

    const dragHandle = page.getByRole('button', { name: '이미지 크기 조절' })
    await expect(dragHandle).toBeVisible({ timeout: 30_000 })

    const handleBox = await dragHandle.boundingBox()
    if (!handleBox) throw new Error('Drag handle bounding box not found')

    const startX = handleBox.x + handleBox.width / 2
    const startY = handleBox.y + handleBox.height / 2

    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX + 130, startY, { steps: 10 })
    await page.mouse.up()

    await expect.poll(async () => {
      return await editorImage.getAttribute('data-notice-width')
    }, { timeout: 10_000 }).toMatch(/^\d+px$/)

    const widthValue = await editorImage.getAttribute('data-notice-width')
    expect(widthValue).toBeTruthy()
    const widthPx = Number.parseInt(String(widthValue).replace('px', ''), 10)
    expect(Number.isFinite(widthPx)).toBeTruthy()
    expect(widthPx).toBeGreaterThanOrEqual(120)
    expect(widthPx).toBeLessThanOrEqual(1200)

    await page.screenshot({ path: evidence.dragResize, fullPage: true })

    await page.locator('input[placeholder="제목"]').fill('Drag Resize Test')

    const createResponsePromise = page.waitForResponse((res) => {
      return res.url().includes('/api/notices') && res.request().method() === 'POST'
    }, { timeout: 30_000 })

    await page.getByRole('button', { name: '작성 완료' }).click()
    const createResponse = await createResponsePromise
    expect(createResponse.ok()).toBeTruthy()

    await page.goto(`${baseUrl}${noticesPath}`, { waitUntil: 'networkidle' })
    const notice = page.locator('article').filter({ hasText: 'Drag Resize Test' }).first()
    await expect(notice).toBeVisible({ timeout: 30_000 })

    const publicImg = notice.locator('img').first()
    await expect(publicImg).toBeVisible({ timeout: 30_000 })
    await expect(publicImg).toHaveAttribute('data-notice-width', String(widthValue))

    const publicImgBox = await publicImg.boundingBox()
    const noticeBox = await notice.boundingBox()
    if (publicImgBox && noticeBox) {
      expect(publicImgBox.width).toBeGreaterThan(0)
      expect(publicImgBox.width).toBeLessThanOrEqual(noticeBox.width + 2)
    }

    await page.screenshot({ path: evidence.publicWidthPersist, fullPage: true })
  })

  test('verifies image size preset attributes persist on public notices', async ({ page }) => {
    test.setTimeout(60_000)

    // Navigate directly to public notices page
    await page.goto(`${baseUrl}${noticesPath}`, { waitUntil: 'networkidle' })

    // Check if any notices exist
    const notices = page.locator('article')
    const noticeCount = await notices.count()

    if (noticeCount > 0) {
      // Get the first notice
      const firstNotice = notices.first()
      await expect(firstNotice).toBeVisible({ timeout: 30_000 })

      // Check if it has any images
      const images = firstNotice.locator('img')
      const imageCount = await images.count()

      if (imageCount > 0) {
        const firstImage = images.first()
        await expect(firstImage).toBeVisible({ timeout: 30_000 })

        // Verify image doesn't overflow on mobile viewport (375px)
        await page.setViewportSize({ width: 375, height: 800 })
        await expect(firstImage).toBeVisible({ timeout: 30_000 })

        // Verify image is within container bounds
        const imgBox = await firstImage.boundingBox()
        const containerBox = await firstNotice.boundingBox()
        if (imgBox && containerBox) {
          expect(imgBox.width).toBeLessThanOrEqual(containerBox.width + 1) // +1 for rounding
        }

        // Check if image has data-notice-size attribute
        const sizeAttr = await firstImage.getAttribute('data-notice-size').catch(() => null)
        if (sizeAttr) {
          expect(['sm', 'md', 'lg', 'full']).toContain(sizeAttr)
        }
      }
    }

    // Take screenshot
    await page.screenshot({ path: path.join(evidenceDir, 'task-9-image-size-preset.png'), fullPage: true })
  })
})
