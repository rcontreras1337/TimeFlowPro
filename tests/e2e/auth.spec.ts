import { test, expect } from '@playwright/test'

/**
 * Tests E2E para autenticación con Google OAuth
 *
 * NOTA: Estos tests se ejecutan solo localmente, NO en GitHub Actions
 *
 * @ticket T-1-02
 */

test.describe('Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/login')
  })

  test('debe mostrar la página de login correctamente', async ({ page }) => {
    // Verificar que la página carga
    await expect(page).toHaveURL(/.*login/)

    // Verificar título o encabezado de login
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
  })

  test('debe tener botón de login con Google', async ({ page }) => {
    // Buscar botón de Google
    const googleButton = page.getByRole('button', { name: /google/i })

    // Verificar que existe y es visible
    await expect(googleButton).toBeVisible()
    await expect(googleButton).toBeEnabled()
  })

  test.fixme('botón de Google debe iniciar flujo OAuth', async ({ page }) => {
    // Click en el botón de Google
    const googleButton = page.getByRole('button', { name: /google/i })

    // Preparar para interceptar la navegación
    const navigationPromise = page.waitForURL(/.*accounts\.google\.com.*|.*supabase.*auth.*/)

    // Click en el botón
    await googleButton.click()

    // Verificar que redirige a Google OAuth o al callback de Supabase
    await navigationPromise
  })

  test('usuario no autenticado no puede acceder al dashboard', async ({ page }) => {
    // Intentar acceder al dashboard directamente
    await page.goto('/dashboard')

    // Debería redirigir a login
    await expect(page).toHaveURL(/.*login.*/)
  })
})

test.describe('Página principal', () => {
  test('debe cargar la landing page', async ({ page }) => {
    await page.goto('/')

    // Verificar que la página carga correctamente
    await expect(page).toHaveTitle(/TimeFlowPro/i)
  })

  test('debe tener enlace a login', async ({ page }) => {
    await page.goto('/')

    // Buscar enlace o botón de login
    const loginLink = page.getByRole('link', { name: /iniciar sesión|login/i })

    await expect(loginLink).toBeVisible()
  })
})
