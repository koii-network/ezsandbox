# Part III. Building a Crawler

We've laid all the preliminary ground work, now we can get to the fun stuff! Simple-crawler provides you with a simple skeleton for building your own web crawler. We will fill in this template in this guide, but feel free to code your own logic if you feel confident!

Prerequisites:

- Understanding of IPFS
- Understanding of Puppeteer

## Building the Crawler Object

```javascript
const page = await browser.newPage();
await page.setUserAgent(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
);

const url = `https://forums.redflagdeals.com/hot-deals-f9/`;

// Document loaded means the loading icon on the left of the tab is resolved
await page.goto(url, { waitUntil: "domcontentloaded" });

// Wait for the selector to load
await page.waitForSelector("#search_keywords");

// Find the ID = search_keywords and type the search term from .env
await page.type("#search_keywords", this.searchTerm);

await page.keyboard.press("Enter");

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
```
