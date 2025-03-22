import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

// Configure Chromium for serverless environments
chromium.setHeadlessMode = true; // Enable headless mode
chromium.setGraphicsMode = false; // Disable GPU/WebGL

export async function getBrowserInstance() {
  const executablePath = await chromium.executablePath();

  // Configuration for Puppeteer launch
  const launchOptions = {
    args: chromium.args,
    defaultViewport: {
      width: 1368,
      height: 768,
    },
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  };

  if (!executablePath) {
    // Running locally, use the full `puppeteer` package
    const puppeteerLocal = await import('puppeteer').then((m) => m.default);
    return await puppeteerLocal.launch({
      ...launchOptions,
      ignoreDefaultArgs: ['--disable-extensions'],
    });
  }

  // Running in a serverless environment, use `puppeteer-core` with the Chromium executable
  return await puppeteer.launch({
    ...launchOptions,
    executablePath,
  });
}
