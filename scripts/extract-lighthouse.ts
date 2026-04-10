import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type LighthouseReport = {
  fetchTime?: string;
  finalDisplayedUrl?: string;
  finalUrl?: string;
  requestedUrl?: string;
  categories?: {
    performance?: { score?: number | null };
    accessibility?: { score?: number | null };
    'best-practices'?: { score?: number | null };
    seo?: { score?: number | null };
  };
  audits?: Record<string, { displayValue?: string }>;
};

type LighthouseData = {
  generatedAt: string | null;
  url: string | null;
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
  lcp: string | null;
  tbt: string | null;
  cls: string | null;
  fcp: string | null;
  ttfb: string | null;
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), '..');
const lighthouseDir = path.join(repoRoot, '.lighthouseci');
const outputFile = path.join(repoRoot, 'src', 'data', 'lighthouse.json');

const logInfo = (message: string): void => {
  process.stdout.write(`${message}\n`);
};

const logError = (message: string): void => {
  process.stderr.write(`${message}\n`);
};

const toPercentScore = (value: number | null | undefined): number | null => {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  return Math.round(value * 100);
};

const getNewestLhrFile = async (): Promise<string | null> => {
  let entries: string[] = [];

  try {
    entries = await readdir(lighthouseDir);
  } catch {
    return null;
  }

  const lhrFiles = entries.filter(file => /^lhr-.*\.json$/i.test(file));
  if (lhrFiles.length === 0) return null;

  const lhrFilesWithMtime = await Promise.all(
    lhrFiles.map(async file => {
      const filePath = path.join(lighthouseDir, file);
      const info = await stat(filePath);
      return { filePath, mtimeMs: info.mtimeMs };
    })
  );

  lhrFilesWithMtime.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return lhrFilesWithMtime[0]?.filePath ?? null;
};

const extractMetric = (report: LighthouseReport, key: string): string | null => {
  return report.audits?.[key]?.displayValue ?? null;
};

const run = async (): Promise<void> => {
  const lhrFile = await getNewestLhrFile();

  if (!lhrFile) {
    logInfo('[extract-lighthouse] No lhr-*.json files found in .lighthouseci. Skipping.');
    process.exit(0);
  }

  const raw = await readFile(lhrFile, 'utf8');
  const report = JSON.parse(raw) as LighthouseReport;

  const output: LighthouseData = {
    generatedAt: report.fetchTime ?? null,
    url: report.finalDisplayedUrl ?? report.finalUrl ?? report.requestedUrl ?? null,
    performance: toPercentScore(report.categories?.performance?.score),
    accessibility: toPercentScore(report.categories?.accessibility?.score),
    bestPractices: toPercentScore(report.categories?.['best-practices']?.score),
    seo: toPercentScore(report.categories?.seo?.score),
    lcp: extractMetric(report, 'largest-contentful-paint'),
    tbt: extractMetric(report, 'total-blocking-time'),
    cls: extractMetric(report, 'cumulative-layout-shift'),
    fcp: extractMetric(report, 'first-contentful-paint'),
    ttfb: extractMetric(report, 'server-response-time'),
  };

  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

  logInfo(`[extract-lighthouse] Wrote ${outputFile} from ${path.basename(lhrFile)}.`);
};

run().catch(error => {
  logError('[extract-lighthouse] Failed to extract Lighthouse data.');
  logError(error instanceof Error ? (error.stack ?? error.message) : String(error));
  process.exit(1);
});
