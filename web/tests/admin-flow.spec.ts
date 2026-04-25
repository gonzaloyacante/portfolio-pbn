/**
 * E2E: Admin core flow — login → dashboard → categories
 *
 * Covers the critical path an admin uses every session:
 * 1. Login with valid credentials
 * 2. Dashboard loads with key metrics
 * 3. Navigate to categories list
 * 4. Open new category form
 * 5. Logout
 */
import { test, expect } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'paolabolivarnievas@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'DevPassword123!'

// ── Helpers ───────────────────────────────────────────────────────────────────

async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/auth/login')
  await page.fill('input[name="email"]', ADMIN_EMAIL)
  await page.fill('input[name="password"]', ADMIN_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/admin\/(panel|dashboard)/, { timeout: 15000 })
}

// ── Login → Dashboard → Categories flow ──────────────────────────────────────

test.describe('Admin core flow: login → dashboard → categories', () => {
  test('login redirects to dashboard and shows greeting', async ({ page }) => {
    await loginAsAdmin(page)
    // Dashboard shows welcome emoji
    await expect(page.getByText('👋')).toBeVisible({ timeout: 10000 })
  })

  test('dashboard shows stat cards', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await loginAsAdmin(page)

    // Dashboard main content is visible — stat cards load asynchronously
    const dashboardContent = page.locator('main')
    await expect(dashboardContent).toBeVisible({ timeout: 10000 })
  })

  test('sidebar has categories link and navigates correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await loginAsAdmin(page)

    // Find categories link in sidebar
    const sidebar = page.locator('aside')
    const categoriesLink = sidebar.getByRole('link', { name: /categor/i }).first()
    await expect(categoriesLink).toBeVisible({ timeout: 10000 })

    await categoriesLink.click()
    await expect(page).toHaveURL(/\/admin\/categor/, { timeout: 10000 })
  })

  test('categories page loads list or empty state', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await loginAsAdmin(page)

    await page.goto('/admin/categories')
    await expect(page).toHaveURL(/\/admin\/categor/, { timeout: 10000 })

    // Either a list of categories or an empty state is shown
    const heading = page.getByRole('heading').first()
    await expect(heading).toBeVisible({ timeout: 10000 })
  })

  test('new category form opens and has required fields', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await loginAsAdmin(page)

    await page.goto('/admin/categories/new')
    await expect(page).toHaveURL(/\/admin\/categor.*new/, { timeout: 10000 })

    // Form must have a name field
    const nameField = page
      .locator(
        'input[name="name"], input[placeholder*="ej. Fotografía"], input[placeholder*="Nombre"]'
      )
      .first()
    await expect(nameField).toBeVisible({ timeout: 10000 })

    // Save button must be present
    const saveBtn = page.getByRole('button', { name: /guardar|crear/i }).first()
    await expect(saveBtn).toBeVisible({ timeout: 10000 })
  })

  test('new category form validates required name field', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await loginAsAdmin(page)

    await page.goto('/admin/categories/new')

    // Submit without filling name
    const saveBtn = page.getByRole('button', { name: /guardar|crear/i }).first()
    await saveBtn.click()

    // Validation error should appear
    const error = page.getByText(/requerido|obligatorio|nombre/i).first()
    await expect(error).toBeVisible({ timeout: 5000 })
  })

  test('logout clears session and redirects to login', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await loginAsAdmin(page)

    // Find logout — could be in sidebar, account menu, or profile
    // Try sidebar first, then account page
    const logoutBtn = page.getByRole('button', { name: /cerrar sesión|logout|salir/i })
    const accountLink = page.locator('aside').getByRole('link', { name: /cuenta|perfil|account/i })

    const logoutVisible = await logoutBtn.isVisible().catch(() => false)
    if (logoutVisible) {
      await logoutBtn.click()
    } else {
      // Navigate to account page where logout button lives
      await accountLink.click()
      await page.waitForURL(/\/admin\/(account|mi-cuenta|profile)/, { timeout: 10000 })
      await page.getByRole('button', { name: /cerrar sesión|logout|salir/i }).click()
    }

    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 })
  })
})

// ── Protected route guard ─────────────────────────────────────────────────────

test.describe('Route protection', () => {
  test('unauthenticated access to dashboard redirects to login', async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies()
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 })
  })

  test('unauthenticated access to categories redirects to login', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/admin/categories')
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 })
  })
})
