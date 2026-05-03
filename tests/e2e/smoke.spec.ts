import { expect, test } from '@playwright/test';

test('renders English homepage', async ({ page }) => {
  await page.goto('/en/');
  await expect(page).toHaveTitle(/Anna Zezulka/i);
  await expect(page.getByRole('heading', { level: 1, name: 'Anna Zezulka' })).toBeVisible();
});

test('can switch language from EN to CS', async ({ page }) => {
  await page.goto('/en/');

  // Open the language picker by clicking the summary.
  await page.locator('summary[aria-label^="Language:"]').click();

  // Now click the 'CS' link.
  await page.locator('a[aria-label="Language: CS"]').click();

  await expect(page).toHaveURL(/\/cs\/$/);
  await expect(page.getByText(/Junior|vývojářka/i).first()).toBeVisible();
});

test('404 page has recovery links', async ({ page }) => {
  await page.goto('/missing-page');
  await expect(page.getByRole('heading', { level: 1, name: '404' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'EN', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Domu|Domů|Home/i }).first()).toBeVisible();
});
