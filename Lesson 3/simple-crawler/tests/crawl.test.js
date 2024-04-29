require('dotenv').config({ path: '../.env.local' });

describe('SimpleCrawlerTask Tests', () => {
  it('should successfully crawl Google News', async () => {
    const SimpleCrawlerTask = require('../crawler/SimpleCrawlerTask');
    const searchTerm = 'Car';
    const task = new SimpleCrawlerTask(searchTerm);

    const value = await task.crawl();

    expect(value).not.toBe(null);
  });
});
