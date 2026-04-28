const CALCULATION_DELAY_MS = 500;
const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Sustainable Web Design model v4 carbon intensity:
 * approximately 0.4 g CO2e per MB transferred end-to-end.
 * See: https://sustainablewebdesign.org/estimating-digital-emissions/
 */
const G_CO2E_PER_BYTE = 4.0e-7;

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

/**
 * Calculates the estimated carbon footprint of the current page transfer.
 *
 * NOTE: This figure is an estimate based on network transfer size only.
 * It does not account for device-side energy consumption, upstream embodied
 * emissions of infrastructure, or offset programs.
 */
const calculateCarbonValue = (): number | null => {
  const navigationEntries = performance.getEntriesByType('navigation');
  const navigationEntry = navigationEntries.length > 0 ? navigationEntries[0] : null;
  const resources = performance.getEntriesByType('resource');

  const navigationSize = getSize(navigationEntry);
  const totalSize = resources.reduce((sum, entry) => sum + getSize(entry), navigationSize);

  if (!Number.isFinite(totalSize) || totalSize <= 0) return null;

  return totalSize * G_CO2E_PER_BYTE;
};

const renderCarbonFootprint = async (valueElement: HTMLElement): Promise<void> => {
  const gramsCo2 = calculateCarbonValue();
  if (gramsCo2 === null) throw new Error('Carbon footprint unavailable');

  valueElement.style.transition = 'opacity 0.3s ease';

  const handleTransitionEnd = (event: TransitionEvent) => {
    if (event.propertyName === 'opacity') {
      valueElement.textContent = formatCarbonFootprint(gramsCo2);
      valueElement.style.opacity = '1';
      valueElement.removeEventListener('transitionend', handleTransitionEnd);
    }
  };

  valueElement.addEventListener('transitionend', handleTransitionEnd);
  valueElement.style.opacity = '0';
};

const initCarbonFootprint = (valueElement: HTMLElement): void => {
  const loadingText = valueElement.getAttribute('data-loading') || '...';
  valueElement.textContent = loadingText;
  valueElement.style.opacity = '1';

  // We wait CALCULATION_DELAY_MS before starting the calculation to ensure
  // most secondary resources (images, fonts) have started their transfer
  // and are visible to the Performance API.
  const timeoutId = setTimeout(() => {
    renderCarbonFootprint(valueElement)
      .catch(() => {
        valueElement.parentElement?.style.setProperty('display', 'none');
      })
      .finally(() => {
        // We avoid clearing resource timings to ensure that subsequent
        // monitoring tools (like Lighthouse) can still access them.
      });
  }, CALCULATION_DELAY_MS);

  // Safety timeout: If the footprint hasn't rendered within timeoutMs,
  // we hide it to avoid leaving the "loading" state visible indefinitely.
  // Note: This runs in parallel with the CALCULATION_DELAY_MS timer.
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
