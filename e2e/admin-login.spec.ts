import { test, expect } from '@playwright/test'

test.describe('Admin Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')
  })

  test('shows login form', async ({ page }) => {
    await expect(page.getByText('Вход в систему')).toBeVisible()
    await expect(page.locator('#adm-email')).toBeVisible()
    await expect(page.locator('#adm-password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Войти в панель' })).toBeVisible()
  })

  test('shows error on wrong credentials', async ({ page }) => {
    await page.locator('#adm-email').fill('wrong@example.com')
    await page.locator('#adm-password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Войти в панель' }).click()

    await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 })
  })

  test('toggle password visibility', async ({ page }) => {
    const input = page.locator('#adm-password')
    const toggle = page.getByRole('button', { name: 'Показать пароль' })

    await expect(input).toHaveAttribute('type', 'password')
    await toggle.click()
    await expect(input).toHaveAttribute('type', 'text')
    await expect(page.getByRole('button', { name: 'Скрыть пароль' })).toBeVisible()
  })

  test('back link navigates to home', async ({ page }) => {
    await page.getByText('← Вернуться на сайт').click()
    await expect(page).toHaveURL('/')
  })
})
