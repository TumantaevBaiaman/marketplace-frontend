import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test('loads and shows product list', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Marketplace/i)
    await expect(page.locator('.topnav')).toBeVisible()
  })

  test('header has login button', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Войти' })).toBeVisible()
  })

  test('header login link goes to admin login', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Войти' }).click()
    await expect(page).toHaveURL('/admin/login')
  })
})
