export interface LighthouseData {
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
}
