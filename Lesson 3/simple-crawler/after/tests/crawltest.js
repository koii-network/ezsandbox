const SimpleCrawlerTask = require('../crawler/SimpleCrawlerTask'); // Adjust the path as necessary
require('dotenv').config({ path: '../.env.local' });
async function testCrawl() {
  console.log('Starting test for SimpleCrawlerTest.crawl()');

  const searchTerm = 'Car';
  const task = new SimpleCrawlerTask(searchTerm);
  try {
    const titles = await task.crawl();
    console.log('Crawl completed successfully.');
    console.log('Retrieved titles:', titles);
  } catch (error) {
    console.error('Crawl failed:', error);
  }
}

testCrawl();
