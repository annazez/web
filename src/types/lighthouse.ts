export interface LighthousePageResult {
  generatedAt: string | null;
  url: string | null;
  path: string;
  runs: number;
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
  lcp: string | null;
  tbt: string | null;
  cls: string | null;
  fcp: string | null;
  ttfb: string | null;
}

export interface LighthouseData {
  generatedAt: string | null;
  pages: LighthousePageResult[];
}

export type ScoreKey = 'performance' | 'accessibility' | 'bestPractices' | 'seo';
export type MetricKey = 'lcp' | 'tbt' | 'cls' | 'fcp' | 'ttfb';
