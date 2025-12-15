import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate from home to login page', async ({ page }) => {
    // Przejdź na stronę główną
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Znajdź i kliknij link "Zaloguj się"
    const loginLink = page.locator('a[href="/user/signin"]');
    await expect(loginLink).toBeVisible({ timeout: 10000 });
    await loginLink.click();
    
    // Sprawdź, czy URL zmienił się na /user/signin
    await page.waitForURL(/\/user\/signin/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/user\/signin/);
    
    // Sprawdź, czy znajduje się nagłówek "Logowanie"
    await expect(page.locator('h1')).toContainText(/Logowanie/i);
  });

  test('should navigate to registration page', async ({ page }) => {
    // Przejdź na stronę główną
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Kliknij link do rejestracji
    const registerLink = page.locator('a[href="/user/register"]');
    await expect(registerLink).toBeVisible({ timeout: 10000 });
    await registerLink.click();
    
    // Sprawdź URL
    await page.waitForURL(/\/user\/register/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/user\/register/);
  });

  test('should show sidebar menu items', async ({ page }) => {
    // Przejdź na stronę główną
    await page.goto('/');
    
    // Sprawdź, czy menu boczne zawiera podstawowe linki
    await expect(page.locator('a[href="/"]')).toBeVisible(); // Strona główna
    await expect(page.locator('a[href="/about"]')).toBeVisible(); // O nas
  });

  test('should display footer with author credit', async ({ page }) => {
    // Przejdź na stronę główną
    await page.goto('/');
    
    // Sprawdź, czy stopka zawiera informację o autorze
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/Natalia Bała/i);
    await expect(footer).toContainText(/2025/);
  });

  test('should keep sidebar visible on page navigation', async ({ page }) => {
    // Przejdź na stronę główną
    await page.goto('/');
    
    // Sprawdź, czy sidebar jest widoczny
    const sidebar = page.locator('nav, aside').first();
    await expect(sidebar).toBeVisible();
    
    // Przejdź do innej strony
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    // Sprawdź, czy sidebar nadal jest widoczny
    await expect(sidebar).toBeVisible();
  });
});