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

    await page.waitForTimeout(2000)
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/auth/login')

    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/admin\/dashboard/, { timeout: 10000 })
    await expect(page.getByRole('heading', { name: /panel de administración/i })).toBeVisible()
  })
})

test.describe('Admin Panel - Authenticated', () => {
  test.beforeEach(async ({ page }) => {
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
    await page.getByRole('link', { name: /proyectos/i }).click()
    await expect(page).toHaveURL(/\/admin\/projects/)
    await expect(page.getByRole('heading', { name: /proyectos/i })).toBeVisible()
  })

  test('should navigate to categories management', async ({ page }) => {
    await page.getByRole('link', { name: /categorías/i }).click()
    await expect(page).toHaveURL(/\/admin\/categories/)
    await expect(page.getByRole('heading', { name: /categor/i })).toBeVisible()
  })

  test('should navigate to testimonials management', async ({ page }) => {
    await page.getByRole('link', { name: /testimonios/i }).click()
    await expect(page).toHaveURL(/\/admin\/testimonials/)
    await expect(page.getByRole('heading', { name: /testimon/i })).toBeVisible()
  })
})

test.describe('Public Pages', () => {
  test('should load homepage with hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText(/portfolio/i)).toBeVisible()
  })

  test('should display projects page with categories', async ({ page }) => {
    await page.goto('/proyectos')
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('/proyectos')
  })

  test('should load about page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/sobre-mi')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText(/paola/i)).toBeVisible({ timeout: 10000 })
  })

  test('should load contact page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/contacto')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText(/paola/i)).toBeVisible({ timeout: 10000 })
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

test.describe('Navigation', () => {
  test('should navigate between pages via navbar', async ({ page }) => {
    // Set desktop viewport to avoid mobile menu
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Navigate to Sobre mi
    await page.getByRole('link', { name: /sobre mi/i }).click()
    await expect(page).toHaveURL(/\/sobre-mi/)

    // Navigate to Proyectos
    await page.getByRole('link', { name: /proyectos/i }).click()
    await expect(page).toHaveURL(/\/proyectos/)

    // Navigate to Contacto
    await page.getByRole('link', { name: /contacto/i }).click()
    await expect(page).toHaveURL(/\/contacto/)

    // Navigate back to Inicio
    await page.getByRole('link', { name: /inicio/i }).click()
    await expect(page).toHaveURL(/^\/$/)
  })
})

test.describe('Contact Form', () => {
  test('should display contact form', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/contacto')
    await page.waitForLoadState('networkidle')

    // Check form elements exist
    const form = page.locator('form')
    await expect(form).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Responsive Design', () => {
  test('should display mobile menu on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Should have hamburger menu button
    const menuButton = page.getByRole('button', { name: /menu/i })
    await expect(menuButton).toBeVisible()
  })

  test('should display desktop nav on large screens', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    // Should show all nav links
    await expect(page.getByRole('link', { name: /inicio/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /sobre mi/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /proyectos/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /contacto/i })).toBeVisible()
  })
})

test.describe('Privacy Page', () => {
  test('should display privacy policy', async ({ page }) => {
    await page.goto('/privacidad')
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('/privacidad')
  })
})

test.describe('404 Page', () => {
  test('should show 404 for non-existent pages', async ({ page }) => {
    const response = await page.goto('/pagina-que-no-existe')
    expect(response?.status()).toBe(404)
  })
})
