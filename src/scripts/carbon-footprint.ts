const CALCULATION_DELAY_MS = 500;
const DEFAULT_TIMEOUT_MS = 5000;

const getSize = (entry: PerformanceEntry | null): number => {
  if (!entry) return 0;
  const timingEntry = entry as PerformanceResourceTiming;
  return (
    timingEntry.transferSize || timingEntry.encodedBodySize || timingEntry.decodedBodySize || 0
  );
};

const formatCarbonFootprint = (value: number): string =>
  value >= 0.01 ? `${value.toFixed(2)} g CO₂e` : `${value.toFixed(4)} g CO₂e`;

const getTimeoutMs = (valueElement: HTMLElement): number => {
  const parsedTimeout = Number.parseInt(valueElement.getAttribute('data-timeout-ms') ?? '', 10);
  return Number.isFinite(parsedTimeout) && parsedTimeout > 0 ? parsedTimeout : DEFAULT_TIMEOUT_MS;
};

const calculateCarbonValue = (): number | null => {
  const navigationEntries = performance.getEntriesByType('navigation');
  const navigationEntry = navigationEntries.length > 0 ? navigationEntries[0] : null;
  const resources = performance.getEntriesByType('resource');

  const navigationSize = getSize(navigationEntry);
  const bodySize = new TextEncoder().encode(document.body?.innerHTML || '').length;
  const totalSize = resources.reduce(
    (sum, entry) => sum + getSize(entry),
    navigationSize + bodySize
  );

  if (!Number.isFinite(totalSize) || totalSize <= 0) return null;

  return totalSize * 4.0e-7;
};

const renderCarbonFootprint = (valueElement: HTMLElement): Promise<void> => {
  const gramsCo2 = calculateCarbonValue();
  if (gramsCo2 === null) return Promise.reject(new Error('Carbon footprint unavailable'));

  valueElement.style.transition = 'opacity 0.3s ease';

  return new Promise<void>((resolve) => {
    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== 'opacity') return;
      valueElement.removeEventListener('transitionend', handleTransitionEnd);
      valueElement.textContent = formatCarbonFootprint(gramsCo2);
      valueElement.style.opacity = '1';
      resolve();
    };

    valueElement.addEventListener('transitionend', handleTransitionEnd);
    valueElement.style.opacity = '0';
  });
};

const initCarbonFootprint = (valueElement: HTMLElement): void => {
  const loadingText = valueElement.getAttribute('data-loading') || '...';
  valueElement.textContent = loadingText;
  valueElement.style.opacity = '1';

  const timeoutId = setTimeout(() => {
    renderCarbonFootprint(valueElement)
      .catch(() => {
        valueElement.parentElement?.style.setProperty('display', 'none');
      })
      .finally(() => {
        performance.clearResourceTimings();
      });
  }, CALCULATION_DELAY_MS);

  const timeoutMs = getTimeoutMs(valueElement);
  if (timeoutId) {
    setTimeout(() => {
      if (valueElement.textContent === loadingText) {
        valueElement.parentElement?.style.setProperty('display', 'none');
      }
    }, timeoutMs);
  }
};

document.addEventListener('astro:page-load', () => {
  const valueElement = document.getElementById('carbon-footprint-value');
  if (valueElement instanceof HTMLElement) {
    initCarbonFootprint(valueElement);
  }
});
