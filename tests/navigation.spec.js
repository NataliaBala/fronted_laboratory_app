import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate from home to login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loginLink = page.locator('a[href="/user/signin"]');
    await expect(loginLink).toBeVisible({ timeout: 10000 });
    await loginLink.click();
    
    await page.waitForURL(/\/user\/signin/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/user\/signin/);
    await expect(page.locator('h1')).toContainText(/Logowanie/i);
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const registerLink = page.locator('a[href="/user/register"]');
    await expect(registerLink).toBeVisible({ timeout: 10000 });
    await registerLink.click();
    await page.waitForURL(/\/user\/register/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/user\/register/);
  });

  test('should show sidebar menu items', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('a[href="/"]')).toBeVisible();
    await expect(page.locator('a[href="/about"]')).toBeVisible();
  });

  test('should display footer with author credit', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/Natalia Bała/i);
    await expect(footer).toContainText(/2025/);
  });

  test('should keep sidebar visible on page navigation', async ({ page }) => {
    await page.goto('/');
    
    const sidebar = page.locator('nav, aside').first();
    await expect(sidebar).toBeVisible();
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    await expect(sidebar).toBeVisible();
  });
});