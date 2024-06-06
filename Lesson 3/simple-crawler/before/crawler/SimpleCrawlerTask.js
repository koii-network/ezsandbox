const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const PCR = require('puppeteer-chromium-resolver');

class SimpleCrawlerTask {
  constructor(searchTerm) {
    this.searchTerm = searchTerm;
  }

  async retrieveAndValidateFile(cid, filename = 'dealsData.json') {
    // YOUR CODE HERE
  }

  async crawl() {
    this.isRunning = true;
    const options = {};
    const stats = await PCR(options);
    console.log(`Chrome Path: ${stats.executablePath}`);

    // Set up puppeteer
    // set headless = false for visualization debugging, set headless = true for production
    const browser = await stats.puppeteer.launch({
      headless: false,
      executablePath: stats.executablePath,
    });

    // YOUR CODE HERE

  }
}

module.exports = SimpleCrawlerTask;
