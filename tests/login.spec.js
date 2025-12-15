import { test, expect } from '@playwright/test';

test.describe('Login Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/user/signin');
  });

  test('should display login form with all elements', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/Logowanie|Sign In/i);
    
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toHaveAttribute('type', 'email');
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password');
  });

  test('should show error on invalid login credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    await page.click('button[type="submit"]');
    const errorLocator = page.locator('text=/Błąd|Error|invalid|nieprawidłowy/i').first();
    await expect(errorLocator).toBeVisible({ timeout: 10000 });
  });

  test('should require email and password fields', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    await expect(emailInput).toHaveAttribute('required', '');
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('should have link to registration page', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const registerLink = page.locator('a[href="/user/register"]');
    await expect(registerLink).toBeVisible({ timeout: 5000 });
  });

  test('should validate email format', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'somepassword');
    
    await page.click('button[type="submit"]');
    
    const emailInput = page.locator('input[name="email"]');
    const validationMessage = await emailInput.evaluate((el) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });
});
