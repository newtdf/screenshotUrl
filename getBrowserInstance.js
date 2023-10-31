import chromium from '@sparticuz/chromium'
import puppeteer from "puppeteer-core";
export async function getBrowserInstance() {
	const executablePath = await chromium.executablePath();
	if (!executablePath) {
		// running locally
		const puppeteerLocal = await import('puppeteer').then((m) => {
      return m.default;
    });
		return await puppeteerLocal.launch({
			ignoreDefaultArgs: ['--disable-extensions'],
			args: chromium.args,
			headless: "new",
			defaultViewport: {
				width: 1280,
				height: 720
			},
			ignoreHTTPSErrors: true
		});
	}
	return await puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath: executablePath,
		headless: chromium.headless,
		ignoreHTTPSErrors: true
	});
}