import { expect, test } from '@playwright/test';

test.describe('Command Palette', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/lab/');
    // Wait for the command-palette script to bind its keydown listener
    await page.waitForFunction(() => {
      const w = window as unknown as Record<string, boolean>;
      return w['__bindOnce_command_palette'] === true;
    });
    // Click the body to ensure the page has focus
    await page.locator('body').click();
  });

  test('opens with ? key, navigates to #arch with A, closes with Esc', async ({ page }) => {
    const dialog = page.locator('#command-palette');

    // Palette should be closed initially
    await expect(dialog).not.toHaveAttribute('open');

    // Press ? to open
    await page.keyboard.press('?');
    await expect(dialog).toHaveAttribute('open', '');

    // Press A to navigate to #arch
    await page.keyboard.press('a');
    await expect(page).toHaveURL(/#arch$/);

    // Dialog should close after selecting a mode
    await expect(dialog).not.toHaveAttribute('open');

    // Open palette again
    await page.keyboard.press('?');
    await expect(dialog).toHaveAttribute('open', '');

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(dialog).not.toHaveAttribute('open');
  });

  test('navigates to #audit with U key', async ({ page }) => {
    await page.keyboard.press('?');
    const dialog = page.locator('#command-palette');
    await expect(dialog).toHaveAttribute('open', '');

    await page.keyboard.press('u');
    await expect(page).toHaveURL(/#audit$/);
    await expect(dialog).not.toHaveAttribute('open');
  });

  test('navigates to #layers with L key', async ({ page }) => {
    await page.keyboard.press('?');
    const dialog = page.locator('#command-palette');
    await expect(dialog).toHaveAttribute('open', '');

    await page.keyboard.press('l');
    await expect(page).toHaveURL(/#layers$/);
    await expect(dialog).not.toHaveAttribute('open');
  });

  test('clears hash with H key (return home)', async ({ page }) => {
    await page.goto('/en/#arch');
    await page.waitForFunction(() => {
      const w = window as unknown as Record<string, boolean>;
      return w['__bindOnce_command_palette'] === true;
    });
    await page.locator('body').click();

    await page.keyboard.press('?');
    const dialog = page.locator('#command-palette');
    await expect(dialog).toHaveAttribute('open', '');

    await page.keyboard.press('h');
    await expect(dialog).not.toHaveAttribute('open');

    // Hash should be cleared
    const url = page.url();
    expect(url).not.toContain('#');
  });

  test('does not open when typing in an input field', async ({ page }) => {
    // Inject a temporary input into the page
    await page.evaluate(() => {
      const input = document.createElement('input');
      input.id = 'test-input';
      input.type = 'text';
      document.body.appendChild(input);
    });

    await page.locator('#test-input').focus();
    await page.keyboard.press('?');

    const dialog = page.locator('#command-palette');
    await expect(dialog).not.toHaveAttribute('open');
  });
});
