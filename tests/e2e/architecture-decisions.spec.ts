import { test, expect } from '@playwright/test';

test.describe('Architecture Decisions page', () => {
  test('lists at least 4 ADRs on the English page', async ({ page }) => {
    await page.goto('/en/architecture-decisions/');

    // Page title
    await expect(
      page.getByRole('heading', { level: 1, name: 'Architecture Decisions' })
    ).toBeVisible();

    // Should show both project headings
    await expect(page.getByRole('heading', { level: 2, name: 'Telperion' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Mental Health App' })).toBeVisible();

    // Should have at least 4 ADR cards (h3 headings)
    const adrHeadings = page.getByRole('heading', { level: 3 });
    await expect(adrHeadings).toHaveCount(4);
  });

  test('renders the Czech version', async ({ page }) => {
    await page.goto('/cs/architecture-decisions/');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Architektonická rozhodnutí' })
    ).toBeVisible();
  });

  test('filter chips are present', async ({ page }) => {
    await page.goto('/en/architecture-decisions/');

    // Filter navigation should exist
    const filterNav = page.locator('nav.adr-filters');
    await expect(filterNav).toBeVisible();

    // Should have tag chips
    const chips = filterNav.locator('.adr-chip');
    const count = await chips.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
