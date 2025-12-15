import { test, expect } from '@playwright/test';

test.describe('Authentication Flow Tests', () => {
  
  // Test 2: Sprawdzanie przekierowania niezalogowanych użytkowników
  test('should redirect unauthenticated users to login page', async ({ page }) => {
    // Spróbuj przejść bezpośrednio do chronionej strony profilu
    await page.goto('/protected/user/profile');
    
    // Poczekaj na przekierowanie do strony logowania
    // Aplikacja powinna automatycznie przekierować do /user/signin
    await page.waitForURL(/\/user\/signin/, { timeout: 10000 });
    
    // Sprawdź, czy jesteśmy na stronie logowania
    await expect(page).toHaveURL(/\/user\/signin/);
    await expect(page.locator('h1')).toContainText(/Logowanie|Sign In/i);
    
    // Sprawdź, czy formularz logowania jest widoczny
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  // Test 3: Sprawdzanie dostępu do strony zmiany hasła bez logowania
  test('should protect change password page from unauthorized access', async ({ page }) => {
    // Spróbuj przejść bezpośrednio do strony zmiany hasła
    await page.goto('/protected/user/changepassowrd');
    
    // Poczekaj na przekierowanie do strony logowania
    await page.waitForURL(/\/user\/signin/, { timeout: 10000 });
    
    // Sprawdź, czy jesteśmy na stronie logowania
    await expect(page).toHaveURL(/\/user\/signin/);
    
    // Sprawdź, czy nie mamy dostępu do treści chronionej strony
    await expect(page.locator('h1')).not.toContainText(/Zmień hasło|Change Password/i);
    await expect(page.locator('h1')).toContainText(/Logowanie|Sign In/i);
  });

  // Test 4 (bonus): Sprawdzanie, czy kalendarz jest dostępny tylko dla zalogowanych
  test('should show calendar only for authenticated users', async ({ page }) => {
    // Przejdź na stronę główną jako niezalogowany użytkownik
    await page.goto('/');
    
    // Sprawdź, czy widoczny jest link do logowania (nie przycisk Menu)
    await expect(page.locator('text=/Zaloguj się|Sign In/i')).toBeVisible();
    
    // Sprawdź, czy NIE ma przycisku Menu (tylko dla zalogowanych)
    await expect(page.locator('button:has-text("Menu")')).not.toBeVisible();
    
    // Sprawdź, czy NIE ma przycisku Kalendarz na stronie głównej
    await expect(page.locator('button:has-text("Kalendarz")')).not.toBeVisible();
  });

});

test.describe('Protected Routes Access Control', () => {
  
  // Test sprawdzający wszystkie chronione ścieżki
  const protectedRoutes = [
    '/protected/user/profile',
    '/protected/user/changepassowrd',
    '/protected'
  ];

  for (const route of protectedRoutes) {
    test(`should redirect from ${route} when not authenticated`, async ({ page }) => {
      // Spróbuj przejść do chronionej strony
      await page.goto(route);
      
      // Poczekaj na przekierowanie do strony logowania
      await page.waitForURL(/\/user\/signin/, { timeout: 10000 });
      
      // Sprawdź, czy jesteśmy na stronie logowania
      await expect(page).toHaveURL(/\/user\/signin/);
    });
  }
});
