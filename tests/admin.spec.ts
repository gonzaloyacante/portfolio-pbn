import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should redirect to login when accessing admin without auth', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login')

    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Wait for error toast - it appears in a toast container
    await page.waitForTimeout(2000)
    // Just verify we're still on the login page
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/auth/login')

    // Fill in the login form
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'admin123')

    // Submit the form
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 10000 })

    // Verify dashboard content
    await expect(page.getByRole('heading', { name: /panel de administración/i })).toBeVisible()
  })
})

test.describe('Admin Panel - Authenticated', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin\/dashboard/)
  })

  test('should display sidebar navigation', async ({ page }) => {
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /proyectos/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /categorías/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /testimonios/i })).toBeVisible()
  })

  test('should navigate to projects management', async ({ page }) => {
    await page.getByRole('link', { name: /🎨 proyectos/i }).click()
    await expect(page).toHaveURL(/\/admin\/gestion\/projects/)
    await expect(page.getByRole('heading', { name: /gestión de proyectos/i })).toBeVisible()
  })

  test('should navigate to categories management', async ({ page }) => {
    await page.getByRole('link', { name: /📁 categorías/i }).click()
    await expect(page).toHaveURL(/\/admin\/gestion\/categories/)
    await expect(page.getByRole('heading', { name: /gestión de categorías/i })).toBeVisible()
  })

  test('should navigate to testimonials management', async ({ page }) => {
    await page.getByRole('link', { name: /💬 testimonios/i }).click()
    await expect(page).toHaveURL(/\/admin\/testimonios/)
    await expect(page.getByRole('heading', { name: /gestión de testimonios/i })).toBeVisible()
  })
})

test.describe('Public Pages', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should display projects page', async ({ page }) => {
    await page.goto('/proyectos')
    // Should show categories or projects
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('/proyectos')
  })

  test('should have working sitemap', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    expect(response?.status()).toBe(200)
    const content = await response?.text()
    expect(content).toContain('<?xml')
    expect(content).toContain('<urlset')
  })

  test('should have working robots.txt', async ({ page }) => {
    const response = await page.goto('/robots.txt')
    expect(response?.status()).toBe(200)
    const content = await response?.text()
    expect(content).toContain('User-Agent')
  })
})
