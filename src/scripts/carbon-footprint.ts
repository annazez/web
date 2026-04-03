const CALCULATION_DELAY_MS = 500;
const RENDER_DELAY_MS = 150;
const DEFAULT_TIMEOUT_MS = 5000;

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => {
    window.setTimeout(resolve, ms);
  });

const getSize = (entry: PerformanceEntry | null): number => {
  if (!entry) return 0;

  if ('transferSize' in entry && 'encodedBodySize' in entry && 'decodedBodySize' in entry) {
    const timingEntry = entry as PerformanceResourceTiming;
    return (
      timingEntry.transferSize || timingEntry.encodedBodySize || timingEntry.decodedBodySize || 0
    );
  }
  return 0;
};

const formatCarbonFootprint = (value: number): string => {
  if (value >= 0.01) {
    return `${value.toFixed(2)} g CO₂e`;
  }

  return `${value.toFixed(4)} g CO₂e`;
};

const getCarbonContainer = (valueElement: HTMLElement): HTMLElement => {
  const container = valueElement.closest('[data-carbon-footprint]');
  if (container instanceof HTMLElement) {
    return container;
  }

  return valueElement;
};

const hideCarbonFootprint = (valueElement: HTMLElement): void => {
  getCarbonContainer(valueElement).style.display = 'none';
};

const showCarbonFootprint = (valueElement: HTMLElement): void => {
  getCarbonContainer(valueElement).style.display = '';
};

const getTimeoutMs = (valueElement: HTMLElement): number => {
  const timeoutAttr = valueElement.getAttribute('data-timeout-ms') ?? '';
  const parsedTimeout = Number.parseInt(timeoutAttr, 10);

  return Number.isFinite(parsedTimeout) && parsedTimeout > 0 ? parsedTimeout : DEFAULT_TIMEOUT_MS;
};

const calculateCarbonValue = (): number | null => {
  const navigationEntries = performance.getEntriesByType('navigation');
  const navigationEntry = navigationEntries.length > 0 ? navigationEntries[0] : null;
  const resources = performance.getEntriesByType('resource');

  const navigationSize = getSize(navigationEntry);
  const bodySize = new TextEncoder().encode(document.body?.innerHTML || '').length;

  const totalSize = resources.reduce((sum, entry) => {
    return sum + getSize(entry);
  }, navigationSize + bodySize);

  if (!Number.isFinite(totalSize) || totalSize <= 0) {
    return null;
  }

  // SWD v4 model: 0.81 kWh/GB * 494 gCO2e/kWh = ~400g CO2e per GB (4.0e-7 g per byte)
  return totalSize * 4.0e-7;
};

const withTimeout = <T>(operation: Promise<T>, timeoutMs: number): Promise<T> =>
  new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error('Carbon footprint timeout'));
    }, timeoutMs);

    operation.then(
      value => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      error => {
        window.clearTimeout(timeoutId);
        reject(error);
      }
    );
  });

const renderCarbonFootprint = async (valueElement: HTMLElement): Promise<void> => {
  const gramsCo2 = calculateCarbonValue();
  if (gramsCo2 === null) {
    throw new Error('Carbon footprint unavailable');
  }

  valueElement.style.opacity = '0';
  valueElement.style.transition = 'opacity 0.3s ease';

  await delay(RENDER_DELAY_MS);
  valueElement.textContent = formatCarbonFootprint(gramsCo2);
  valueElement.style.opacity = '1';
  performance.clearResourceTimings();
};

const updateCarbonFootprint = async (): Promise<void> => {
  const valueElement = document.getElementById('carbon-footprint-value');
  if (!(valueElement instanceof HTMLElement)) return;

  const loadingText = valueElement.getAttribute('data-loading') || '...';
  valueElement.textContent = loadingText;
  valueElement.style.opacity = '1';
  showCarbonFootprint(valueElement);

  try {
    await withTimeout(renderCarbonFootprint(valueElement), getTimeoutMs(valueElement));
  } catch {
    hideCarbonFootprint(valueElement);
  }
};

document.addEventListener('astro:page-load', () => {
  const valueElement = document.getElementById('carbon-footprint-value');
  if (!(valueElement instanceof HTMLElement)) return;

  const loadingText = valueElement.getAttribute('data-loading') || '...';
  valueElement.textContent = loadingText;
  valueElement.style.opacity = '1';
  showCarbonFootprint(valueElement);

  window.setTimeout(() => {
    void updateCarbonFootprint();
  }, CALCULATION_DELAY_MS);
});
