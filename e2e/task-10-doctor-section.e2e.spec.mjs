import path from 'node:path'
import { test, expect } from '@playwright/test'

const baseUrl = process.env.E2E_BASE_URL ?? 'http://localhost:3000'
const evidenceDir = path.join(process.cwd(), '.sisyphus', 'evidence')
const evidence = {
  doctorSection: path.join(evidenceDir, 'task-10-doctor-section.png'),
}

test.describe('Doctor section layout and attributes (task 10)', () => {
  test('verifies doctor section structure, badge visibility, and profile card', async ({ page }) => {
    test.setTimeout(120_000)

    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })

    // Scroll to doctor section
    const doctorSection = page.locator('section#doctor')
    await expect(doctorSection).toBeVisible({ timeout: 30_000 })
    await doctorSection.scrollIntoViewIfNeeded()

    // Verify doctor credential badge is visible
    const credentialBadge = page.locator('[data-testid="doctor-credential-badge"]')
    await expect(credentialBadge).toBeVisible({ timeout: 30_000 })
    await expect(credentialBadge).toContainText('한의학박사')

    // Verify h2 contains doctor name and title
    const doctorHeading = doctorSection.locator('h2').first()
    await expect(doctorHeading).toBeVisible({ timeout: 30_000 })
    await expect(doctorHeading).toContainText('김형규')
    await expect(doctorHeading).toContainText('원장')

    // Verify doctor profile card is visible
    const profileCard = page.locator('[data-testid="doctor-profile-card"]')
    await expect(profileCard).toBeVisible({ timeout: 30_000 })

    // Verify "한의학박사" appears exactly once in the section (badge only, not in card)
    const credentialTexts = doctorSection.locator('text=한의학박사')
    const credentialCount = await credentialTexts.count()
    expect(credentialCount).toBe(1)

    // Verify profile card contains expected content
    await expect(profileCard).toContainText('Doctor\'s Profile')
    await expect(profileCard).toContainText('경희대학교')

    // Take screenshot
    await page.screenshot({ path: evidence.doctorSection, fullPage: true })
  })
})
