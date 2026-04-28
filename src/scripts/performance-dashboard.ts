import type { LighthousePageResult, ScoreKey, MetricKey } from '../types/lighthouse';

interface I18nConfig {
  na: string;
  noSnapshot: string;
  locale: string;
}

const SCORE_KEYS: ScoreKey[] = ['performance', 'accessibility', 'bestPractices', 'seo'];
const METRIC_KEYS: MetricKey[] = ['lcp', 'tbt', 'cls', 'fcp', 'ttfb'];
const BADGE_BASE_CLASS =
  'mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset';

const scoreClassName = (value: number | null | undefined): string => {
  if (typeof value !== 'number') {
    return 'bg-stone-100 text-stone-700 ring-stone-200';
  }

  if (value >= 90) {
    return 'bg-emerald-100 text-emerald-800 ring-emerald-200';
  }

  if (value >= 50) {
    return 'bg-amber-100 text-amber-800 ring-amber-200';
  }

  return 'bg-rose-100 text-rose-800 ring-rose-200';
};

const normalizePath = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed =
      value.startsWith('http://') || value.startsWith('https://')
        ? new URL(value)
        : new URL(value, window.location.origin);
    let pathname = parsed.pathname || '/';
    const hasFileExtension = /\/[^/]+\.[^/]+$/.test(pathname);
    if (!hasFileExtension && !pathname.endsWith('/')) {
      pathname += '/';
    }
    return pathname;
  } catch {
    return null;
  }
};

const isTechnicalPath = (path: string | null): boolean => {
  if (!path) {
    return true;
  }

  const lowered = path.toLowerCase();
  if (lowered === '/404/' || lowered.endsWith('/404/')) {
    return true;
  }

  if (lowered.endsWith('.xml') || lowered.endsWith('.txt') || lowered.endsWith('.asc')) {
    return true;
  }

  if (lowered.includes('/sitemap')) {
    return true;
  }

  if (lowered.endsWith('/rss.xml')) {
    return true;
  }

  if (lowered.startsWith('/pgp/')) {
    return true;
  }

  if (lowered === '/robots.txt' || lowered === '/humans.txt') {
    return true;
  }

  return false;
};

const normalizeSitemapUrl = (url: string): string => {
  if (!url.startsWith('http')) {
    return url;
  }

  try {
    const parsed = new URL(url);
    // If the sitemap contains absolute URLs pointing to the production site,
    // we rewrite them to the current origin to avoid CORS issues during
    // local development or Lighthouse CI audits.
    if (parsed.origin !== window.location.origin) {
      return `${window.location.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // Fallback to original URL
  }
  return url;
};

const fetchXml = async (url: string): Promise<string> => {
  const normalizedUrl = normalizeSitemapUrl(url);
  const response = await fetch(normalizedUrl, {
    headers: { Accept: 'application/xml,text/xml' },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch sitemap: ${normalizedUrl}`);
  }

  return response.text();
};

const parseSitemapLocations = (
  xml: string
): { kind: 'index' | 'urlset' | 'invalid'; locations: string[] } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  if (doc.querySelector('parsererror')) {
    return { kind: 'invalid', locations: [] };
  }

  const sitemapLocations = [...doc.querySelectorAll('sitemap > loc')]
    .map(node => node.textContent?.trim())
    .filter((loc): loc is string => Boolean(loc));

  if (sitemapLocations.length > 0) {
    return { kind: 'index', locations: sitemapLocations };
  }

  const pageLocations = [...doc.querySelectorAll('url > loc')]
    .map(node => node.textContent?.trim())
    .filter((loc): loc is string => Boolean(loc));

  return { kind: 'urlset', locations: pageLocations };
};

const fetchSitemapPaths = async (): Promise<string[]> => {
  const roots = ['/sitemap-index.xml', '/sitemap.xml'];
  const discoveredPaths = new Set<string>();

  for (const rootUrl of roots) {
    try {
      const rootXml = await fetchXml(rootUrl);
      const rootParsed = parseSitemapLocations(rootXml);

      if (rootParsed.kind === 'urlset') {
        for (const location of rootParsed.locations) {
          const path = normalizePath(location);
          if (path && !isTechnicalPath(path)) {
            discoveredPaths.add(path);
          }
        }
        break;
      }

      if (rootParsed.kind === 'index') {
        const nestedXmlList = await Promise.all(
          rootParsed.locations.map(async location => {
            try {
              return await fetchXml(location);
            } catch {
              return null;
            }
          })
        );

        for (const nestedXml of nestedXmlList) {
          if (!nestedXml) {
            continue;
          }

          const nestedParsed = parseSitemapLocations(nestedXml);
          if (nestedParsed.kind !== 'urlset') {
            continue;
          }

          for (const location of nestedParsed.locations) {
            const path = normalizePath(location);
            if (path && !isTechnicalPath(path)) {
              discoveredPaths.add(path);
            }
          }
        }

        break;
      }
    } catch {
      continue;
    }
  }

  return [...discoveredPaths].sort((a, b) => a.localeCompare(b));
};

export function initPerformanceDashboard(): void {
  const dashboards = document.querySelectorAll('[data-lighthouse-dashboard]');

  for (const dashboard of dashboards) {
    if (!(dashboard instanceof HTMLElement)) {
      continue;
    }

    const i18nElement = dashboard.querySelector('script[type="application/json"][data-i18n]');
    const i18nConfig: I18nConfig = i18nElement
      ? JSON.parse(i18nElement.textContent || '{}')
      : { na: 'N/A', noSnapshot: 'No snapshot', locale: 'en-GB' };

    const resultsElement = dashboard.querySelector('script[type="application/json"][data-results]');
    const resultsByPath: Record<string, LighthousePageResult> = resultsElement
      ? JSON.parse(resultsElement.textContent || '{}')
      : {};

    const resultEntries = Object.values(resultsByPath).filter(
      (entry): entry is LighthousePageResult => entry !== null && typeof entry.path === 'string'
    );

    const select = dashboard.querySelector('[data-page-select]');
    const pagePathNode = dashboard.querySelector('[data-page-path]');
    const pageUrlNode = dashboard.querySelector('[data-page-url]');
    const pageTimeNode = dashboard.querySelector('[data-page-time]');
    const pageRunsNode = dashboard.querySelector('[data-page-runs]');

    if (
      !(select instanceof HTMLSelectElement) ||
      !(pagePathNode instanceof HTMLElement) ||
      !(pageUrlNode instanceof HTMLElement) ||
      !(pageTimeNode instanceof HTMLElement) ||
      !(pageRunsNode instanceof HTMLElement)
    ) {
      continue;
    }

    const parseTimestamp = (value: string | null): string => {
      if (!value) {
        return i18nConfig.na;
      }

      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString(i18nConfig.locale);
    };

    const setOptions = (paths: string[]) => {
      const previousValue = select.value;
      select.innerHTML = '';

      for (const path of paths) {
        const option = document.createElement('option');
        option.value = path;
        option.textContent = path;
        select.append(option);
      }

      const fallbackValue =
        previousValue && paths.includes(previousValue) ? previousValue : (paths[0] ?? '');

      select.value = fallbackValue;
    };

    const setPageDetails = (path: string | null) => {
      const entry = path ? resultsByPath[path] : null;

      pagePathNode.textContent = path || i18nConfig.na;
      pageUrlNode.textContent = entry?.url ?? i18nConfig.na;
      pageTimeNode.textContent = parseTimestamp(entry?.generatedAt ?? null);
      pageRunsNode.textContent =
        typeof entry?.runs === 'number' ? String(entry.runs) : i18nConfig.na;

      for (const scoreKey of SCORE_KEYS) {
        const badge = dashboard.querySelector(`[data-score-badge="${scoreKey}"]`);
        if (!(badge instanceof HTMLElement)) {
          continue;
        }

        const scoreValue = entry?.[scoreKey];
        badge.textContent = typeof scoreValue === 'number' ? String(scoreValue) : i18nConfig.na;
        badge.className = `${BADGE_BASE_CLASS} ${scoreClassName(scoreValue)}`;
      }

      for (const metricKey of METRIC_KEYS) {
        const metricNode = dashboard.querySelector(`[data-metric-value="${metricKey}"]`);
        if (!(metricNode instanceof HTMLElement)) {
          continue;
        }

        const metricValue = entry?.[metricKey];
        metricNode.textContent = metricValue ?? i18nConfig.na;
      }
    };

    const initialPaths = [...new Set(resultEntries.map(entry => entry.path))].sort((a, b) =>
      a.localeCompare(b)
    );
    setOptions(initialPaths);
    setPageDetails(select.value || null);

    select.addEventListener('change', () => {
      setPageDetails(select.value || null);
    });

    fetchSitemapPaths()
      .then(sitemapPaths => {
        if (sitemapPaths.length === 0) {
          return;
        }

        const mergedPaths = [...new Set([...initialPaths, ...sitemapPaths])].sort((a, b) =>
          a.localeCompare(b)
        );
        setOptions(mergedPaths);
        setPageDetails(select.value || null);
      })
      .catch(() => {
        // Keep initial page list if sitemap fetch fails.
      });
  }
}
