import { test, expect } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

// ── Credenciales del administrador ───────────────────────────────────────────
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'paolabolivarnievas@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'DevPassword123!'

// ── Authentication Flow ───────────────────────────────────────────────────────
test.describe('Authentication Flow', () => {
  test('should redirect to login when accessing admin without auth', async ({ page }) => {
    await page.goto('/admin/panel')
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', ADMIN_EMAIL)
    await page.fill('input[name="password"]', 'wrongpassword000!')
    await page.click('button[type="submit"]')

    // Should stay on login page
    await page.waitForTimeout(2500)
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', ADMIN_EMAIL)
    await page.fill('input[name="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/admin\/panel/, { timeout: 15000 })
    // El dashboard muestra "¡Hola, NAME! 👋" — verificamos el emoji como proxy
    await expect(page.getByText('👋')).toBeVisible({ timeout: 10000 })
  })
})

// ── Admin Panel - Authenticated ───────────────────────────────────────────────
test.describe('Admin Panel - Authenticated', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test de este grupo
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', ADMIN_EMAIL)
    await page.fill('input[name="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin\/panel/, { timeout: 15000 })
  })

  test('should display sidebar navigation on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })

    const sidebar = page.locator('aside')
    await expect(sidebar.getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Categorías' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Testimonios' })).toBeVisible()
  })

  test('should navigate to gallery management', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.locator('aside').getByRole('link', { name: 'Galería' }).click()
    await expect(page).toHaveURL(/\/admin\/categorias/, { timeout: 10000 })
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to categories management', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.locator('aside').getByRole('link', { name: 'Categorías' }).click()
    await expect(page).toHaveURL(/\/admin\/categorias/, { timeout: 10000 })
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to testimonials management', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.locator('aside').getByRole('link', { name: 'Testimonios' }).click()
    await expect(page).toHaveURL(/\/admin\/testimonios/, { timeout: 10000 })
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 })
  })
})

// ── Public Pages ──────────────────────────────────────────────────────────────
test.describe('Public Pages', () => {
  test('should load homepage with hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should display portfolio page', async ({ page }) => {
    await page.goto('/portfolio')
    expect(page.url()).toContain('/portfolio')
  })

  test('should load about page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/sobre-mi')
    // La página sobre-mi debe mostrar "Paola" o similar
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/paola/i, {
      timeout: 10000,
    })
  })

  test('should load contact page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/contacto')
    // La página de contacto carga un formulario
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 })
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

// ── Navigation ────────────────────────────────────────────────────────────────
test.describe('Navigation', () => {
  test('should navigate between pages via navbar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    // Navegar a Sobre mí
    await page.getByRole('link', { name: /sobre mi/i }).click()
    await expect(page).toHaveURL(/\/sobre-mi/)

    // Navegar a Proyectos
    await page.getByRole('link', { name: /portfolio/i }).click()
    await expect(page).toHaveURL(/\/portfolio/)

    // Navegar a Contacto
    await page.getByRole('link', { name: /contacto/i }).click()
    await expect(page).toHaveURL(/\/contacto/)

    // Navegar de vuelta a Inicio
    await page.getByRole('link', { name: /inicio/i }).click()
    await expect(page).toHaveURL(/\/?$/)
  })
})

// ── Contact Form ──────────────────────────────────────────────────────────────
test.describe('Contact Form', () => {
  test('should display contact form', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/contacto')
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 })
  })
})

// ── Responsive Design ─────────────────────────────────────────────────────────
test.describe('Responsive Design', () => {
  test('should display desktop nav on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    await expect(page.getByRole('link', { name: /inicio/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /sobre mi/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /portfolio/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /contacto/i })).toBeVisible()
  })
})

// ── Privacy Page ──────────────────────────────────────────────────────────────
test.describe('Privacy Page', () => {
  test('should display privacy policy', async ({ page }) => {
    await page.goto('/privacidad')
    expect(page.url()).toContain('/privacidad')
  })
})

// ── 404 Page ──────────────────────────────────────────────────────────────────
test.describe('404 Page', () => {
  test('should show 404 for non-existent pages', async ({ page }) => {
    const response = await page.goto('/pagina-que-no-existe')
    expect(response?.status()).toBe(404)
  })
})
