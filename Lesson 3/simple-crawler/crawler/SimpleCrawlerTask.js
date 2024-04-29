const puppeteer = require('puppeteer');
const fs = require('fs');
const { SpheronClient, ProtocolEnum } = require('@spheron/storage');
const PCR = require('puppeteer-chromium-resolver');

class SimpleCrawlerTask {
  constructor(searchTerm) {
    this.searchTerm = searchTerm;
    this.spheronApiKey = process.env.Spheron_Storage;
    if (!this.spheronApiKey) {
      throw new Error(
        'Spheron_API_KEY is not set in the environment variables',
      );
    }
  }

  async retrieveAndValidateFile(cid) {
    const client = new SpheronClient({ token: this.spheronApiKey });

    try {
      const upload = await client.getUpload(uploadId);
      if (upload) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to download or validate file from IPFS:', error);
      throw error;
    }
  }

  async crawl() {
    this.isRunning = true;
    const options = {};
    const stats = await PCR(options);
    console.log(`Chrome Path: ${stats.executablePath}`);

    // Set up puppeteer, set headless = false for visualization debugging, set headless = true for production
    const browser = await stats.puppeteer.launch({
      headless: false,
      executablePath: stats.executablePath,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    );

    const url = `https://forums.redflagdeals.com/hot-deals-f9/`;

    // Document loaded means the loading icon on the left of the tab is resolved
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Wait for the selector to load
    await page.waitForSelector('#search_keywords');

    // Find the ID = search_keywords and type the search term from .env
    await page.type('#search_keywords', this.searchTerm);

    await page.keyboard.press('Enter');

    await page.waitForSelector('h2.post_subject');

    // Get the titles of the links
    let titles = null;
    try {
      titles = await page.$$eval('h2.post_subject a', links =>
        links.map(link => link.textContent.trim()),
      );
    } catch (error) {
      console.log('Error:', error);
    }
    return titles;
  }
}

module.exports = SimpleCrawlerTask;
