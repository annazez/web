import { expect, test } from '@playwright/test';

test('lab web-vitals budget for homepage', async ({ page }) => {
  await page.goto('/en/', { waitUntil: 'domcontentloaded' });
  await page.reload({ waitUntil: 'networkidle' });

  const metrics = await page.evaluate(async () => {
    const getNavigationMetric = (name: keyof PerformanceNavigationTiming) => {
      const nav = performance.getEntriesByType('navigation').at(-1) as
        | PerformanceNavigationTiming
        | undefined;
      return nav ? nav[name] : 0;
    };

    const lcpEntry = performance.getEntriesByType('largest-contentful-paint').slice(-1)[0] as
      | PerformanceEntry
      | undefined;

    return {
      domContentLoaded: getNavigationMetric('domContentLoadedEventEnd'),
      loadEventEnd: getNavigationMetric('loadEventEnd'),
      lcp: lcpEntry?.startTime ?? 0,
    };
  });

  expect(metrics.domContentLoaded).toBeLessThan(5000);
  expect(metrics.loadEventEnd).toBeLessThan(4000);
  expect(metrics.lcp).toBeLessThan(2500);
});
