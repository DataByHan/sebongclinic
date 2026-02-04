import path from 'node:path'
import fs from 'node:fs/promises'
import { test, expect } from '@playwright/test'

const adminPath = '/admin-8f3a9c2d4b1e'
const noticesPath = '/notices'

const baseUrl = process.env.E2E_BASE_URL ?? 'http://localhost:3000'
const password = process.env.ADMIN_PASSWORD ?? ''

const evidenceDir = path.join(process.cwd(), '.sisyphus', 'evidence')
const evidence = {
  toolbar: path.join(evidenceDir, 'task-9-admin-toolbar.png'),
  uploaded: path.join(evidenceDir, 'task-9-uploaded-image.png'),
  imagePublic: path.join(evidenceDir, 'task-9-image-public.png'),
  gfmPublic: path.join(evidenceDir, 'task-7-gfm-public.png'),
  xssSanitized: path.join(evidenceDir, 'task-7-xss-sanitized.png'),
  markdownHeadings: path.join(evidenceDir, 'task-9-markdown-headings-render.png'),
}

async function loginAdmin(page) {
  if (!password) throw new Error('Missing admin password env: set ADMIN_PASSWORD')
  await page.goto(`${baseUrl}${adminPath}`, { waitUntil: 'networkidle' })
  await page.locator('input[type="password"]').fill(password)
  await page.getByRole('button', { name: '로그인' }).click()
  await page.waitForLoadState('networkidle')

  const toolbar = page.locator('.toastui-editor-toolbar')
  await expect(toolbar).toBeVisible({ timeout: 60_000 })
  return toolbar
}

async function setToastEditorMarkdown(page, markdown) {
  await page.evaluate(({ markdown: md }) => {
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
          if (current && typeof current.setMarkdown === 'function' && typeof current.getMarkdown === 'function') {
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

    editor.setMarkdown(md)
  }, { markdown })
}

async function createNoticeFromAdmin(page, { title, markdown }) {
  await setToastEditorMarkdown(page, markdown)

  await page.locator('input[placeholder="제목"]').fill(title)

  const createResponsePromise = page.waitForResponse((res) => {
    return res.url().includes('/api/notices') && res.request().method() === 'POST'
  }, { timeout: 30_000 })

  await page.getByRole('button', { name: '작성 완료' }).click()
  const createResponse = await createResponsePromise
  expect(createResponse.ok()).toBeTruthy()
}

async function findNoticeArticle(page, { titleSubstring }) {
  await page.goto(`${baseUrl}${noticesPath}`, { waitUntil: 'networkidle' })
  const notice = page.locator('article').filter({ hasText: titleSubstring }).first()
  await expect(notice).toBeVisible({ timeout: 30_000 })
  return notice
}

test.describe('Admin notice editor (GFM/XSS) + image upload (task 9)', () => {
  test.beforeAll(async () => {
    await fs.mkdir(evidenceDir, { recursive: true })
  })

  test('Create GFM notice and verify public render', async ({ page }) => {
    test.setTimeout(120_000)
    test.skip(!password, 'Missing ADMIN_PASSWORD')
    await page.setViewportSize({ width: 1280, height: 900 })

    await loginAdmin(page)

    const now = Date.now()
    const title = `GFM Test ${now}`
    const markdown = [
      '# GFM Test',
      '',
      'Task list:',
      '- [ ] todo item',
      '- [x] done item',
      '',
      'Table:',
      '',
      '| a | b |',
      '|---|---|',
      '| 1 | 2 |',
      '',
      'Strike: ~~strike text~~',
      '',
      '```js',
      'const x = 1',
      'console.log(x)',
      '```',
      '',
    ].join('\n')

    await createNoticeFromAdmin(page, { title, markdown })

    const notice = await findNoticeArticle(page, { titleSubstring: title })
    await expect(notice.locator('table')).toBeVisible({ timeout: 30_000 })
    await expect.poll(async () => {
      return await notice.locator('input[type="checkbox"]').count()
    }, { timeout: 30_000 }).toBeGreaterThan(0)
    await expect(notice.locator('del')).toContainText('strike text')

    await page.screenshot({ path: evidence.gfmPublic, fullPage: true })
  })

  test('XSS is stripped', async ({ page }) => {
    test.setTimeout(120_000)
    test.skip(!password, 'Missing ADMIN_PASSWORD')
    await page.setViewportSize({ width: 1280, height: 900 })

    await loginAdmin(page)

    const now = Date.now()
    const title = `XSS Test ${now}`
    const markdown = [
      '# XSS Test',
      '',
      '<script>alert("xss")</script>',
      '',
      '<img src="x" onerror="alert(1)" />',
      '',
      '[bad link](javascript:alert(1))',
      '',
    ].join('\n')

    await createNoticeFromAdmin(page, { title, markdown })

    const notice = await findNoticeArticle(page, { titleSubstring: title })
    const html = await notice.evaluate((el) => el.innerHTML)
    const lower = String(html).toLowerCase()
    expect(lower.includes('<script')).toBeFalsy()
    expect(lower.includes('onerror=')).toBeFalsy()
    expect(lower.includes('javascript:')).toBeFalsy()

    await page.screenshot({ path: evidence.xssSanitized, fullPage: true })
  })

  test('Image upload still works and renders publicly', async ({ page }) => {
    test.setTimeout(120_000)
    test.skip(!password, 'Missing ADMIN_PASSWORD')
    await page.setViewportSize({ width: 1280, height: 900 })

    const toolbar = await loginAdmin(page)
    await page.screenshot({ path: evidence.toolbar, fullPage: true })

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
    await page.screenshot({ path: evidence.uploaded, fullPage: true })

    const title = `Image Upload Test ${Date.now()}`
    await page.locator('input[placeholder="제목"]').fill(title)

    const createResponsePromise = page.waitForResponse((res) => {
      return res.url().includes('/api/notices') && res.request().method() === 'POST'
    }, { timeout: 30_000 })

    await page.getByRole('button', { name: '작성 완료' }).click()
    const createResponse = await createResponsePromise
    expect(createResponse.ok()).toBeTruthy()

     const notice = await findNoticeArticle(page, { titleSubstring: title })
     await expect(notice.locator('img').first()).toBeVisible({ timeout: 30_000 })
     await page.screenshot({ path: evidence.imagePublic, fullPage: true })
   })

   test('Markdown headings render as HTML (not raw text)', async ({ page }) => {
     test.setTimeout(120_000)
     test.skip(!password, 'Missing ADMIN_PASSWORD')
     await page.setViewportSize({ width: 1280, height: 900 })

     await loginAdmin(page)

     const now = Date.now()
     const title = `Markdown Headings Test ${now}`
     const markdown = [
       '# Heading',
       '## H2',
       '### H3',
     ].join('\n')

     await createNoticeFromAdmin(page, { title, markdown })

     const notice = await findNoticeArticle(page, { titleSubstring: title })
     
     // Assert: h1 element exists with text "Heading"
     await expect(notice.locator('h1')).toContainText('Heading')
     
     // Assert: h2 element exists with text "H2"
     await expect(notice.locator('h2')).toContainText('H2')
     
     // Assert: h3 element exists with text "H3"
     await expect(notice.locator('h3')).toContainText('H3')
     
     // Assert: raw markdown text is NOT visible in notice content
     const noticeContent = notice.locator('.notice-content')
     const contentHtml = await noticeContent.evaluate((el) => el.innerHTML)
     expect(contentHtml.includes('# Heading')).toBeFalsy()
     expect(contentHtml.includes('## H2')).toBeFalsy()
     expect(contentHtml.includes('### H3')).toBeFalsy()

     await page.screenshot({ path: evidence.markdownHeadings, fullPage: true })
   })
})
