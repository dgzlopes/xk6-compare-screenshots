import { chromium } from 'k6/experimental/browser';
import { compareScreenshots } from './lib.js';

export default async function () {
  const browser = chromium.launch({
    headless: false,
    timeout: '60s',
  });
  const page = browser.newPage();

  try {
    await page.goto('https://grafana.com/');
    try {
      compareScreenshots(page);
    } catch (e) {
      console.log(`Screenshot comparison failed: ${e}`);
    }
    
  } finally {
    page.close();
    browser.close();
  }
}
