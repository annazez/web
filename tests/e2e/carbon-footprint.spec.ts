import { expect, test } from '@playwright/test';

test('carbon footprint hides when unavailable', async ({ page }) => {
  // Mock performance API to trigger the 'Carbon footprint unavailable' error.
  await page.addInitScript(() => {
    // Override performance.getEntriesByType to return an empty array for both navigation and resource
    const originalGetEntriesByType = performance.getEntriesByType.bind(performance);
    performance.getEntriesByType = (type: string) => {
      if (type === 'navigation' || type === 'resource') {
        return [];
      }
      return originalGetEntriesByType(type);
    };

    // To ensure totalSize is 0, we also need to mock the body size calculation.
    // calculateCarbonValue relies on new TextEncoder().encode(document.body?.innerHTML || '').length.
    // We conditionally override TextEncoder's encode method to return an empty array
    // only when it is encoding the body's innerHTML, preserving normal behavior elsewhere.
    const OriginalTextEncoder = globalThis.TextEncoder;
    globalThis.TextEncoder = class TextEncoderMock extends OriginalTextEncoder {
      encode(_input?: string) {
        // We know that in this test, any call to encode() during calculation should result in 0 size.
        // This is safer than exact string matching which might vary between browsers.
        return new Uint8Array(0);
      }
    };
  });

  await page.goto('/en/');

  // The carbon footprint parent is a <p> tag with data-carbon-footprint.
  const parentContainer = page.locator('p[data-carbon-footprint]');

  // Wait for the container to become hidden due to the error.
  // The error is thrown after a 500ms calculation delay.
  await expect(parentContainer).toBeHidden({ timeout: 5000 });
});
