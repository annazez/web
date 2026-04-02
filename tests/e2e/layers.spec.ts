import { expect, test } from '@playwright/test';

test('layers mode applies 3D transform CSS variables when navigating to #layers', async ({
  page,
}) => {
  await page.goto('/en/#layers');

  const pageShell = page.locator('#page-shell');
  await expect(pageShell).toBeVisible();

  // The layers script should apply CSS custom properties for the 3D transform
  await expect(pageShell).toHaveCSS('--layers-rotate-x', '60deg');
  await expect(pageShell).toHaveCSS('--layers-rotate-z', '-30deg');
  await expect(pageShell).toHaveCSS('--layers-scale', '0.8');
});

test('layers mode cleans up when hash changes away from #layers', async ({ page }) => {
  await page.goto('/en/#layers');

  const pageShell = page.locator('#page-shell');
  await expect(pageShell).toBeVisible();

  // Confirm transform variables were set
  await expect(pageShell).toHaveCSS('--layers-rotate-x', '60deg');

  // Navigate away from #layers
  await page.evaluate(() => {
    window.location.hash = '';
  });

  // After cleanup the CSS custom properties should be removed
  await expect(pageShell).not.toHaveCSS('--layers-rotate-x', '60deg');
});
