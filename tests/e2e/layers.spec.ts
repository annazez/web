import { expect, test } from '@playwright/test';

test.describe('3D Exploded Layers Mode', () => {
  test('initializes mode correctly when navigating to #layers', async ({ page }) => {
    await page.goto('/en/lab/#layers');

    const pageShell = page.locator('#page-shell');

    // Wait for the default CSS variables to be set (async initialization)
    await page.waitForFunction(() => {
      const w = window as unknown as Window & { __layers_init?: boolean };
      return w.__layers_init === true;
    });

    expect(await pageShell.evaluate(el => el.style.getPropertyValue('--layers-rotate-x'))).toBe(
      '60deg'
    );
    expect(await pageShell.evaluate(el => el.style.getPropertyValue('--layers-rotate-z'))).toBe(
      '-30deg'
    );
    expect(await pageShell.evaluate(el => el.style.getPropertyValue('--layers-scale'))).toBe('0.8');
  });

  test('updates rotation transforms on pointer drag', async ({ page }) => {
    await page.goto('/en/lab/#layers');

    const pageShell = page.locator('#page-shell');

    // Initial state check - wait for initialization
    await page.waitForFunction(() => {
      const w = window as unknown as Window & { __layers_init?: boolean };
      return w.__layers_init === true;
    });

    expect(await pageShell.evaluate(el => el.style.getPropertyValue('--layers-rotate-x'))).toBe(
      '60deg'
    );
    expect(await pageShell.evaluate(el => el.style.getPropertyValue('--layers-rotate-z'))).toBe(
      '-30deg'
    );

    // Simulate pointer down and move
    await page.mouse.move(500, 500);
    await page.mouse.down();

    // Move mouse right and down to increase both Z and X rotation
    await page.mouse.move(600, 600);

    // The rotation Z increases with deltaX * 0.2: -30 + 100 * 0.2 = -10deg
    // The rotation X increases with deltaY * 0.2: 60 + 100 * 0.2 = 80deg
    expect(await pageShell.evaluate(el => el.style.getPropertyValue('--layers-rotate-z'))).toBe(
      '-10deg'
    );
    expect(await pageShell.evaluate(el => el.style.getPropertyValue('--layers-rotate-x'))).toBe(
      '80deg'
    );

    // Verify dragging class is added
    await expect(pageShell).toHaveClass(/layers-dragging/);

    // Mouse up
    await page.mouse.up();

    // Verify dragging class is removed
    await expect(pageShell).not.toHaveClass(/layers-dragging/);
  });

  test('updates scale transform on wheel zoom', async ({ page }) => {
    await page.goto('/en/lab/#layers');

    const pageShell = page.locator('#page-shell');

    // Initial state check - wait for initialization
    await page.waitForFunction(() => {
      const w = window as unknown as Window & { __layers_init?: boolean };
      return w.__layers_init === true;
    });

    expect(await pageShell.evaluate(el => el.style.getPropertyValue('--layers-scale'))).toBe('0.8');

    // Dispatch a wheel event using evaluate because page.mouse.wheel doesn't consistently trigger the DOM wheel event how we expect here
    await pageShell.evaluate(el => {
      const wheelEvent = new WheelEvent('wheel', {
        deltaY: -500,
        bubbles: true,
        cancelable: true,
      });
      el.dispatchEvent(wheelEvent);
    });

    // zoomFactor = Math.exp(-(-500) * 0.001) = Math.exp(0.5) ≈ 1.648
    // newScale = 0.8 * 1.648 ≈ 1.318

    // Just verifying it changes from default
    expect(await pageShell.evaluate(el => el.style.getPropertyValue('--layers-scale'))).not.toBe(
      '0.8'
    );

    const newScale = await pageShell.evaluate(el => el.style.getPropertyValue('--layers-scale'));
    expect(parseFloat(newScale)).toBeGreaterThan(0.8);
  });

  test('cleans up state and transforms when exiting mode', async ({ page }) => {
    await page.goto('/en/lab/#layers');

    const pageShell = page.locator('#page-shell');

    // Ensure it's applied
    await page.waitForFunction(() => {
      const w = window as unknown as Window & { __layers_init?: boolean };
      return w.__layers_init === true;
    });
    expect(await pageShell.evaluate(el => el.style.getPropertyValue('--layers-scale'))).toBe('0.8');

    // Exit mode by changing hash to trigger the hashchange event (which triggers cleanup)
    // Avoid page.goto('/en/') as it causes a full page reload and bypasses testing the cleanup function.
    await page.evaluate(() => {
      window.location.hash = '';
    });

    // Ensure CSS variables are removed
    expect(await pageShell.evaluate(el => el.style.getPropertyValue('--layers-scale'))).toBe('');
    expect(await pageShell.evaluate(el => el.style.getPropertyValue('--layers-rotate-x'))).toBe('');
    expect(await pageShell.evaluate(el => el.style.getPropertyValue('--layers-rotate-z'))).toBe('');
  });
});
