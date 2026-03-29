/**
 * Playwright Global Setup — crea y persiste la sesión de administrador
 * una sola vez, para que todos los tests autenticados la reutilicen
 * vía `storageState`, evitando re-logins lentos en cada `beforeEach`.
 */
import { chromium, type FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto(`${baseURL}/auth/login`)

  // Usar las mismas credenciales que .env define
  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL ?? 'paolabolivarnievas@gmail.com')
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD ?? 'DevPassword123!')
  await page.click('button[type="submit"]')

  // Esperar a que la sesión esté activa
  await page.waitForURL(/\/admin\/dashboard/, { timeout: 20000 })

  // Guardar cookies y localStorage para reutilización
  await page.context().storageState({ path: 'tests/.auth/admin.json' })

  await browser.close()
}

export default globalSetup
