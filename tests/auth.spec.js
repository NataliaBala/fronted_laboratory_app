import { test, expect } from '@playwright/test';

test.describe('Authentication Flow Tests', () => {
  
  test('should redirect unauthenticated users to login page', async ({ page }) => {
    await page.goto('/protected/user/profile');
    
    await page.waitForURL(/\/user\/signin/, { timeout: 10000 });
    
    await expect(page).toHaveURL(/\/user\/signin/);
    await expect(page.locator('h1')).toContainText(/Logowanie|Sign In/i);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should protect change password page from unauthorized access', async ({ page }) => {
    await page.goto('/protected/user/changepassowrd');
    
    await page.waitForURL(/\/user\/signin/, { timeout: 10000 });
    
    await expect(page).toHaveURL(/\/user\/signin/);
    await expect(page.locator('h1')).not.toContainText(/Zmień hasło|Change Password/i);
    await expect(page.locator('h1')).toContainText(/Logowanie|Sign In/i);
  });

  test('should show calendar only for authenticated users', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=/Zaloguj się|Sign In/i')).toBeVisible();
    
    await expect(page.locator('button:has-text("Menu")')).not.toBeVisible();
    await expect(page.locator('button:has-text("Kalendarz")')).not.toBeVisible();
  });

});

test.describe('Protected Routes Access Control', () => {
  
  const protectedRoutes = [
    '/protected/user/profile',
    '/protected/user/changepassowrd',
    '/protected'
  ];

  for (const route of protectedRoutes) {
    test(`should redirect from ${route} when not authenticated`, async ({ page }) => {
      await page.goto(route);
      
      await page.waitForURL(/\/user\/signin/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/user\/signin/);
    });
  }
});
