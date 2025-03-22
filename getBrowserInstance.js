import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

/**
 * Launches a browser instance using Puppeteer or Chromium based on the runtime environment.
 * @param {Object} viewport - The desired viewport size (e.g., { width: 1200, height: 800 }).
 * @returns {Promise<*>} - A Promise resolving to the launched browser instance.
 */
export async function getBrowserInstance(viewport = { width: 1368, height: 768 }) {
  try {
    // Check if running in a serverless environment (e.g., Vercel)
    const isServerless = process.env.VERCEL === '1';

    if (isServerless) {
      // Serverless environment: Use @sparticuz/chromium
      const executablePath = await chromium.executablePath();
      if (!executablePath) {
        throw new Error('Chromium executable path is not available.');
      }

      return await puppeteer.launch({
        args: chromium.args,
        defaultViewport: viewport,
        executablePath: executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    } else {
      // Local development: Use Puppeteer
      const puppeteerLocal = await import('puppeteer').then((m) => m.default);
      return await puppeteerLocal.launch({
        ignoreDefaultArgs: ['--disable-extensions'],
        args: chromium.args,
        headless: true,
        defaultViewport: viewport,
        ignoreHTTPSErrors: true,
      });
    }
  } catch (error) {
    // Log the error and re-throw it for upstream handling
    console.error('Failed to launch browser:', error.message);
    throw error;
  }
}
