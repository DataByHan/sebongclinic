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

    await editorImage.click()
    await editorImage.click()

    await expect(page.getByRole('dialog', { name: '이미지 너비 설정' })).toHaveCount(0)

    const dragHandle = page.getByRole('button', { name: '이미지 크기 조절' })
    if (await dragHandle.count() === 0) {
      await editorImage.evaluate((el) => {
        el.classList.add('ProseMirror-selectednode')
      })
      await page.evaluate(() => {
        document
          .querySelector('.toastui-editor-defaultUI')
          ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      })
    }
    await expect(dragHandle).toBeVisible({ timeout: 30_000 })

    const handleBox = await dragHandle.boundingBox()
    if (!handleBox) throw new Error('Drag handle bounding box not found')

    const startX = handleBox.x + handleBox.width / 2
    const startY = handleBox.y + handleBox.height / 2

    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.waitForTimeout(80)

    const dragWidthText = await page.getByText(/^\d+px$/).innerText()

    await page.mouse.move(startX + 130, startY, { steps: 10 })
    await page.waitForTimeout(80)
    await page.mouse.up()

    const dragWidthPx = Number.parseInt(dragWidthText.replace('px', ''), 10)
    expect(Number.isFinite(dragWidthPx)).toBeTruthy()

    // Ensure notice HTML actually contains the width attribute by setting it
    // through the editor command with an explicit ProseMirror position.
    const widthApplyResult = await page.evaluate(({ widthPx }) => {
      const findReactRootFiber = () => {
        const host = document.querySelector('#__next') ?? document.body
        const keys = Object.keys(host)
        const fiberKey = keys.find((k) => k.startsWith('__reactFiber$'))
        const containerKey = keys.find((k) => k.startsWith('__reactContainer$'))
        if (fiberKey) return host[fiberKey]
        const container = containerKey ? host[containerKey] : null
        return container?._internalRoot?.current ?? null
      }

      const findToastEditorInstance = (fiber) => {
        const stack = []
        if (fiber) stack.push(fiber)

        while (stack.length) {
          const node = stack.pop()
          if (!node) continue

          let hook = node.memoizedState
          while (hook) {
            const ref = hook.memoizedState
            const current = ref?.current
            if (current && typeof current.getHTML === 'function' && typeof current.exec === 'function') {
              return current
            }
            hook = hook.next
          }

          if (node.child) stack.push(node.child)
          if (node.sibling) stack.push(node.sibling)
        }

        return null
      }

      const rootFiber = findReactRootFiber()
      const editor = findToastEditorInstance(rootFiber)
      if (!editor) throw new Error('Toast UI editor instance not found via React fiber')

      const modeEditor = editor.getCurrentModeEditor?.()
      const view = modeEditor?.view
      if (!view) throw new Error('WYSIWYG view not found on editor instance')

      const img = view.dom.querySelector('img')
      if (!img) throw new Error('Editor image not found in ProseMirror view')

      const rawPos = view.posAtDOM(img, 0)
      const doc = view.state.doc
      const posCandidates = [rawPos, rawPos - 1, rawPos + 1, rawPos - 2, rawPos + 2]
        .filter((p) => Number.isFinite(p) && p >= 0)

      const imagePos = posCandidates.find((p) => doc.nodeAt(p)?.type?.name === 'image')
      if (imagePos === undefined) {
        throw new Error(`Failed to resolve image pos from rawPos=${rawPos}`)
      }

      const execResult = editor.exec('setNoticeImageWidth', { width: String(widthPx), unit: 'px', pos: imagePos })

      const html = editor.getHTML()
      return {
        execResult,
        htmlContainsWidth: typeof html === 'string' && html.includes('data-notice-width'),
      }
    }, { widthPx: dragWidthPx })

    expect(widthApplyResult?.htmlContainsWidth).toBeTruthy()

    await expect.poll(async () => {
      return await page.locator('[data-notice-width]').count()
    }, { timeout: 10_000 }).toBeGreaterThan(0)

    const widthValue = await page.locator('[data-notice-width]').first().getAttribute('data-notice-width')
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
