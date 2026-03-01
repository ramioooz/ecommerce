import { expect, test } from '@playwright/test';

const runtimeErrorMarker = 'Application error: a client-side exception has occurred';

test.describe('Frontend Smoke Journey', () => {
  test('guest routes load without runtime crash marker', async ({ page }) => {
    const routes = ['/', '/products', '/cart', '/orders', '/profile', '/auth/login', '/auth/register'];

    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('body')).not.toContainText(runtimeErrorMarker);
    }
  });

  test('register and navigate authenticated sections without crashes', async ({ page }) => {
    const timestamp = Date.now();
    const firstName = 'Playwright';
    const lastName = 'Tester';
    const email = `playwright_${timestamp}@example.com`;
    const password = 'Password123!';

    await page.goto('/auth/register');
    const inputs = page.locator('input');
    await inputs.nth(0).fill(firstName);
    await inputs.nth(1).fill(lastName);
    await inputs.nth(2).fill(email);
    await inputs.nth(3).fill(password);
    await page.getByRole('button', { name: 'Create Account' }).click();

    await page.waitForURL('/');
    await expect(page.locator('body')).not.toContainText(runtimeErrorMarker);

    const signedInLabel = page.locator('text=Signed in as').first();
    await expect(signedInLabel).toBeVisible();
    await expect(signedInLabel).not.toContainText('Signed in as User');

    const routes = ['/products', '/cart', '/orders', '/profile'];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('body')).not.toContainText(runtimeErrorMarker);
      await expect(page.locator('body')).not.toContainText('Please login to view your');
    }
  });
});
