const updateCarbonFootprint = () => {
  const valueElement = document.getElementById('carbon-footprint-value');
  if (!valueElement) return;

  const loadingText = valueElement.getAttribute('data-loading') || '...';
  if (valueElement.textContent === '') {
    valueElement.textContent = loadingText;
  }

  const navigationEntries = performance.getEntriesByType('navigation');
  const navigationEntry = navigationEntries.length > 0 ? navigationEntries[0] : null;
  const resources = performance.getEntriesByType('resource');

  const getSize = (entry: PerformanceEntry | null) => {
    if (!entry) return 0;

    if (
      'transferSize' in entry &&
      'encodedBodySize' in entry &&
      'decodedBodySize' in entry
    ) {
      const timingEntry = entry as PerformanceResourceTiming;
      return (
        timingEntry.transferSize ||
        timingEntry.encodedBodySize ||
        timingEntry.decodedBodySize ||
        0
      );
    }
    return 0;
  };

  const navigationSize = getSize(navigationEntry);
  const bodySize = new TextEncoder().encode(document.body?.innerHTML || '').length;

  const totalSize = resources.reduce((sum, entry) => {
    return sum + getSize(entry);
  }, navigationSize + bodySize);

  if (!Number.isFinite(totalSize) || totalSize <= 0) {
    valueElement.textContent = 'N/A';
    return;
  }

  // SWD v4 model: 0.81 kWh/GB * 494 gCO2e/kWh = ~400g CO2e per GB (4.0e-7 g per byte)
  const gramsCo2 = totalSize * 4.0e-7;

  const formatCarbonFootprint = (value: number) => {
    if (value >= 0.01) {
      return `${value.toFixed(2)} g CO₂e`;
    }

    return `${value.toFixed(4)} g CO₂e`;
  };

  valueElement.style.opacity = '0';
  valueElement.style.transition = 'opacity 0.3s ease';

  setTimeout(() => {
    valueElement.textContent = formatCarbonFootprint(gramsCo2);
    valueElement.style.opacity = '1';
    performance.clearResourceTimings();
  }, 150);
};

document.addEventListener('astro:page-load', () => {
  const valueElement = document.getElementById('carbon-footprint-value');
  if (valueElement) {
    const loadingText = valueElement.getAttribute('data-loading') || '...';
    valueElement.textContent = loadingText;
    valueElement.style.opacity = '1';
  }
  setTimeout(updateCarbonFootprint, 500);
});
