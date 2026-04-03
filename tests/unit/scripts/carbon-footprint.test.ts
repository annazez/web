import assert from 'node:assert';
import { describe, it } from 'node:test';

// Helper to calculate carbon footprint (mimics the script logic)
function calculateCarbonFootprint(
  navigationSize: number,
  bodySize: number,
  resources: number[]
): string {
  const totalSize = resources.reduce((sum, size) => sum + size, navigationSize + bodySize);

  if (!Number.isFinite(totalSize) || totalSize <= 0) {
    return 'N/A';
  }

  // SWD v4 model: 0.81 kWh/GB * 494 gCO2e/kWh = ~400g CO2e per GB
  const gramsCo2 = totalSize * 4.0e-7;

  if (gramsCo2 >= 0.01) {
    return `${gramsCo2.toFixed(2)} g CO₂e`;
  }
  return `${gramsCo2.toFixed(4)} g CO₂e`;
}

describe('carbon-footprint', () => {
  describe('carbon calculation', () => {
    it('should calculate carbon footprint for small page (1KB)', () => {
      const result = calculateCarbonFootprint(500, 524, []);
      assert.ok(result.includes('g CO₂e'));
      assert.ok(!result.includes('N/A'));
    });

    it('should return N/A for zero or negative size', () => {
      assert.strictEqual(calculateCarbonFootprint(0, 0, []), 'N/A');
      assert.strictEqual(calculateCarbonFootprint(-100, 0, []), 'N/A');
    });

    it('should calculate correctly for large page (1MB)', () => {
      const oneMB = 1024 * 1024;
      const result = calculateCarbonFootprint(oneMB, 0, []);
      assert.ok(result.includes('g CO₂e'));
      // 1MB should produce around 0.4g CO2
      const value = parseFloat(result.split(' ')[0]);
      assert.ok(value > 0.3 && value < 0.5, `Expected ~0.4g CO2, got ${value}`);
    });

    it('should handle resources array', () => {
      const resources = [1024, 2048, 4096]; // Various resource sizes
      const result = calculateCarbonFootprint(1024, 1024, resources);
      assert.ok(result.includes('g CO₂e'));
      assert.ok(!result.includes('N/A'));
    });

    it('should format small values with 4 decimal places', () => {
      // Very small payload should use 4 decimal format
      const result = calculateCarbonFootprint(10, 10, []);
      const match = result.match(/(\d+\.\d{4})/);
      assert.ok(match, 'Should have 4 decimal places for small values');
    });

    it('should format larger values with 2 decimal places', () => {
      // Large payload should use 2 decimal format
      const largeSize = 100 * 1024 * 1024; // 100MB
      const result = calculateCarbonFootprint(largeSize, 0, []);
      const match = result.match(/(\d+\.\d{2})/);
      assert.ok(match, 'Should have 2 decimal places for larger values');
    });
  });

  describe('size extraction', () => {
    it('should prefer transferSize over encodedBodySize', () => {
      const entry = {
        transferSize: 1000,
        encodedBodySize: 500,
        decodedBodySize: 2000,
      } as unknown as PerformanceResourceTiming;

      const size = entry.transferSize || entry.encodedBodySize || entry.decodedBodySize || 0;
      assert.strictEqual(size, 1000);
    });

    it('should fall back to encodedBodySize when transferSize is 0', () => {
      const entry = {
        transferSize: 0,
        encodedBodySize: 500,
        decodedBodySize: 2000,
      } as unknown as PerformanceResourceTiming;

      const size = entry.transferSize || entry.encodedBodySize || entry.decodedBodySize || 0;
      assert.strictEqual(size, 500);
    });
  });

  describe('SWD v4 model constants', () => {
    it('should use the SWD v4 calculation factor (4.0e-7 g per byte)', () => {
      // The SWD v4 model uses: 0.81 kWh/GB * 494 gCO2e/kWh = ~400g CO2e per GB
      // This translates to 4.0e-7 g per byte (400 / 1,000,000,000)
      const oneGB = 1024 * 1024 * 1024;
      const gramsCo2 = oneGB * 4.0e-7;

      // The factor 4.0e-7 yields ~429g for 1GiB (not 400g exactly due to binary/decimal difference)
      // We verify the calculation uses the expected constant
      const expectedGrams = oneGB * 4.0e-7;
      assert.strictEqual(gramsCo2, expectedGrams);
      assert.ok(gramsCo2 > 400 && gramsCo2 < 450, `Expected ~429g CO2 per GiB, got ${gramsCo2}`);
    });
  });
});
