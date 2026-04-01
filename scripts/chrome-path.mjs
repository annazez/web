import { chromium } from '@playwright/test';

process.stdout.write(chromium.executablePath());
