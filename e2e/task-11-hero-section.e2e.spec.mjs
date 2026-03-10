import path from 'node:path'
import { test, expect } from '@playwright/test'

const baseUrl = process.env.E2E_BASE_URL ?? 'http://localhost:3000'
const evidenceDir = path.join(process.cwd(), '.sisyphus', 'evidence')
const evidence = {
  heroDesktop: path.join(evidenceDir, 'task-11-hero-desktop.png'),
  heroMobile: path.join(evidenceDir, 'task-11-hero-mobile.png'),
}

test.describe('Hero section layout and updated copy (task 11)', () => {
  test('verifies hero section structure, updated copy, and 4-step process card on desktop', async ({ page }) => {
    test.setTimeout(120_000)

    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })

    // Get hero section (first section in main)
    const heroSection = page.locator('main > section:not([id])').first()
    await expect(heroSection).toBeVisible({ timeout: 30_000 })

    // Verify chip with specialty areas
    const chip = heroSection.locator('.flat-chip').first()
    await expect(chip).toBeVisible({ timeout: 30_000 })
    await expect(chip).toContainText('전문 진료 영역 : 근골격계 · 면역 기능 · 여성 질환 · 불임 등')

    // Verify h1 title
    const heroTitle = heroSection.locator('h1').first()
    await expect(heroTitle).toBeVisible({ timeout: 30_000 })
    await expect(heroTitle).toContainText('세봉(世奉)은')
    await expect(heroTitle).toContainText('몸의 흐름을')
    await expect(heroTitle).toContainText('다시 정렬합니다.')

    // Verify hero paragraph content
    const heroParagraph = heroSection.locator('p').first()
    await expect(heroParagraph).toBeVisible({ timeout: 30_000 })
    await expect(heroParagraph).toContainText('근골격계·관절 질환')
    await expect(heroParagraph).toContainText('40여 년의 임상 경험')

    // Verify CTA buttons (scoped to hero section)
    const ctaButtons = heroSection.locator('.cta, .cta-ghost')
    await expect(ctaButtons).toHaveCount(3, { timeout: 30_000 })
    await expect(ctaButtons.first()).toContainText('오시는 길')

    // Verify 4-step process card
    const processCard = heroSection.locator('.flat-card').first()
    await expect(processCard).toBeVisible({ timeout: 30_000 })
    await expect(processCard).toContainText('🩺세봉한의원 진료 과정')

    // Verify all 4 step labels
    const stepLabels = processCard.locator('.type-serif').filter({ hasText: /체질·면역 진단|전신 경락 에너지 분석|병변 경락 및 원인 경락 확인|맞춤 치료 설명 및 시행/ })
    await expect(stepLabels).toHaveCount(4, { timeout: 30_000 })

    // Verify specific step labels
    await expect(processCard).toContainText('체질·면역 진단')
    await expect(processCard).toContainText('전신 경락 에너지 분석')
    await expect(processCard).toContainText('병변 경락 및 원인 경락 확인')
    await expect(processCard).toContainText('맞춤 치료 설명 및 시행')

    // Verify step descriptions exist
    await expect(processCard).toContainText('MFT 진단 시스템을 통해')
    await expect(processCard).toContainText('24전신 경락 에너지 흐름')

    // Take desktop screenshot
    await page.screenshot({ path: evidence.heroDesktop, fullPage: true })
  })

  test('verifies hero section structure and copy on mobile viewport', async ({ page }) => {
    test.setTimeout(120_000)

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })

    // Get hero section (first section in main)
    const heroSection = page.locator('main > section:not([id])').first()
    await expect(heroSection).toBeVisible({ timeout: 30_000 })

    // Verify chip with specialty areas
    const chip = heroSection.locator('.flat-chip').first()
    await expect(chip).toBeVisible({ timeout: 30_000 })
    await expect(chip).toContainText('전문 진료 영역 : 근골격계 · 면역 기능 · 여성 질환 · 불임 등')

    // Verify h1 title
    const heroTitle = heroSection.locator('h1').first()
    await expect(heroTitle).toBeVisible({ timeout: 30_000 })
    await expect(heroTitle).toContainText('세봉(世奉)은')
    await expect(heroTitle).toContainText('몸의 흐름을')
    await expect(heroTitle).toContainText('다시 정렬합니다.')

    // Verify hero paragraph content
    const heroParagraph = heroSection.locator('p').first()
    await expect(heroParagraph).toBeVisible({ timeout: 30_000 })
    await expect(heroParagraph).toContainText('근골격계·관절 질환')

    // Verify 4-step process card is visible on mobile
    const processCard = heroSection.locator('.flat-card').first()
    await expect(processCard).toBeVisible({ timeout: 30_000 })
    await expect(processCard).toContainText('🩺세봉한의원 진료 과정')

    // Verify all 4 step labels on mobile
    await expect(processCard).toContainText('체질·면역 진단')
    await expect(processCard).toContainText('전신 경락 에너지 분석')
    await expect(processCard).toContainText('병변 경락 및 원인 경락 확인')
    await expect(processCard).toContainText('맞춤 치료 설명 및 시행')

    // Take mobile screenshot
    await page.screenshot({ path: evidence.heroMobile, fullPage: true })
  })
})
