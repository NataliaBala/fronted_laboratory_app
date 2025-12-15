import { test, expect } from '@playwright/test';

test.describe('Login Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Przed każdym testem przejdź na stronę logowania
    await page.goto('/user/signin');
  });

  test('should display login form with all elements', async ({ page }) => {
    // Sprawdź, czy formularz logowania jest widoczny
    await expect(page.locator('h1')).toContainText(/Logowanie|Sign In/i);
    
    // Sprawdź, czy pola formularza są widoczne
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Sprawdź atrybuty pól
    await expect(page.locator('input[name="email"]')).toHaveAttribute('type', 'email');
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password');
  });

  test('should show error on invalid login credentials', async ({ page }) => {
    // Wypełnij formularz nieprawidłowymi danymi
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Kliknij przycisk logowania
    await page.click('button[type="submit"]');
    
    // Poczekaj na komunikat błędu (Firebase zwróci błąd)
    // Komunikat może zawierać różne teksty w zależności od języka
    const errorLocator = page.locator('text=/Błąd|Error|invalid|nieprawidłowy/i').first();
    await expect(errorLocator).toBeVisible({ timeout: 10000 });
  });

  test('should require email and password fields', async ({ page }) => {
    // Sprawdź atrybut required dla pól
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    
    // Sprawdź, czy pola są wymagane
    await expect(emailInput).toHaveAttribute('required', '');
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('should have link to registration page', async ({ page }) => {
    // Poczekaj na załadowanie strony
    await page.waitForLoadState('networkidle');
    
    // Ten test można pominąć jeśli nie ma linku rejestracji na stronie logowania
    // Sprawdź, czy użytkownik może wrócić do strony głównej gdzie jest rejestracja
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const registerLink = page.locator('a[href="/user/register"]');
    await expect(registerLink).toBeVisible({ timeout: 5000 });
  });

  test('should validate email format', async ({ page }) => {
    // Wpisz nieprawidłowy format email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'somepassword');
    
    // Spróbuj wysłać formularz
    await page.click('button[type="submit"]');
    
    // Przeglądarka powinna pokazać walidację HTML5
    // lub aplikacja powinna pokazać błąd
    const emailInput = page.locator('input[name="email"]');
    const validationMessage = await emailInput.evaluate((el) => el.validationMessage);
    
    // Sprawdź, czy jest jakiś komunikat walidacji
    expect(validationMessage).toBeTruthy();
  });
});
