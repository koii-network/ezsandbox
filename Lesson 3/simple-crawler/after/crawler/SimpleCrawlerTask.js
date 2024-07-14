const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const PCR = require('puppeteer-chromium-resolver');

class SimpleCrawlerTaskClass {
  constructor(searchTerm) {
    this.searchTerm = searchTerm;
  }

  async retrieveAndValidateFile(cid, filename = 'dealsData.json') {
    // instantiate the storage client
    const client = new KoiiStorageClient();

    try {
      // get the uploaded file using the IPFS CID we stored earlier and the filename (in this case, `dealsData.json`)
      const upload = await client.getFile(cid, filename);
      // return whether or not the file exists
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

    // Set up puppeteer
    // set headless = false for visualization debugging, set headless = true for production
    const browser = await stats.puppeteer.launch({
      headless: false,
      executablePath: stats.executablePath,
    });

    const page = await browser.newPage();
      await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
    );

    const url = `https://forums.redflagdeals.com/hot-deals-f9/`;

    // `documentloaded` means the loading icon on the left of the tab is resolved
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Wait for the search bar to load
    await page.waitForSelector("#search_keywords");

    // type the search term into the search bar
    await page.type("#search_keywords", this.searchTerm);

    // submit the search term
    await page.keyboard.press("Enter");

    // Wait for the links to load after the search term is submitted
    await page.waitForSelector("h2.post_subject");

    // Get the titles of the links
    let titles = null;
    try {
      titles = await page.$$eval("h2.post_subject a", (links) =>
        links.map((link) => link.textContent.trim())
      );
    } catch (error) {
      console.log("Error:", error);
    }

    // close puppeteer
    await browser.close();

    return titles;
  }
}

const SimpleCrawlerTask = new SimpleCrawlerTaskClass();
module.exports = SimpleCrawlerTask;
