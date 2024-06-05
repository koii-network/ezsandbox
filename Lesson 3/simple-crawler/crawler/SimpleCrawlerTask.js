const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const PCR = require('puppeteer-chromium-resolver');

class SimpleCrawlerTask {
  constructor(searchTerm) {
    this.searchTerm = searchTerm;
  }

  async retrieveAndValidateFile(cid, filename = 'dealsData.json') {
    const client = new KoiiStorageClient();

    try {
      const upload = await client.getFile(cid, filename);
      return !!upload;
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
    let titles = null;

    // Set up puppeteer, set headless = false for visualization debugging, set headless = true for production
    const browser = await stats.puppeteer.launch({
      headless: false,
      executablePath: stats.executablePath,
    });

    // YOUR CODE HERE

    return titles;
  }
}

module.exports = SimpleCrawlerTask;
