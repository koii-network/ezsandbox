# Part III. Building a Crawler

We've laid all the preliminary ground work, now we can get to the fun stuff! Simple-crawler provides you with a simple skeleton for building your own web crawler. We will fill in this template in this guide, but feel free to code your own logic if you feel confident!

Prerequisites:

- Understanding of IPFS
- Understanding of Puppeteer

## Building the Crawler Object

In `SimpleCrawlerTask.js` you'll notice there's a bare bones function `crawler()`. We'll implement our web crawling logic here using puppeteer, explaining as we go!

1. **Open Desired Page** - We first need to set up a new userAgent and navigate to the corresponding webpage that we are interesting in scraping. In this case, we're looking to scrape [redflagdeals](https://forums.redflagdeals.com/hot-deals-f9/`) as it provides a simple and static page with consistent styling of elements. This makes it a desirable target for web scraping. We can set the page with the following code:

```javascript
const page = await browser.newPage();
await page.setUserAgent(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
);

const url = `https://forums.redflagdeals.com/hot-deals-f9/`;

// Document loaded means the loading icon on the left of the tab is resolved
await page.goto(url, { waitUntil: "domcontentloaded" });
```

<br>

2. **Search w/ Specific Elements** - Every page that you web crawl will have a little different code. This is because we'll be crawling based on the `.css` selectors present for _that_ particular web page. You can use inspect element to view these selectors. In our case, we can access the search bar using the selector `#search_keywords`. Then, we can utilize the keyword that was provided as a task extension to filter our searches! Here's the code:

```javascript
// Wait for the selector to load
await page.waitForSelector("#search_keywords");

// Find the ID = search_keywords and type the search term from .env
await page.type("#search_keywords", this.searchTerm);

await page.keyboard.press("Enter");
```

<br>

3. **Grab Post Titles** - Now that we have filtered our search results, we move on to the scraping aspect. For this simple example, we'll grab every post header with its corresponding link. We'll store those pairs as a map then return it! Again, the selectors used will vary from website to website and you will have to investigate yourself before you're able to write code for a different webpage. Here's the last bit of code:

```javascript
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

## Using the Crawler Object

Now that we've defined the crawler object, we can make use of it from our `submission.js` file. Find the `task()` function and write the following code:

```javascript
const newTask = new SimpleCrawlerTask(process.env.KEYWORD);
const newTitles = await newTask.crawl();
await namespaceWrapper.storeSet("titles", newTitles);
```

As you can see, we're simply instantiating the object with the corresponding `KEYWORD` secret that has been provided (either by you locally, or by a user on the node). Once the object is created, we start the crawl, fetch the titles, then store them!

Just like that, you've successfully created your very own web crawler! This template is very customizable and relatively simple. As you encounter more dynamic webpages, you may find it more difficult to web crawl. If you're concerned about websites with logging in, cookies, or dynamic content, we recommend checking out our [Twitter Archiver!](https://github.com/koii-network/task-X)

<br>
<br>

You've reached the end of this lesson which means you're now able to create your very own web crawler for any simple webpage! The next lesson will discuss data sharing and replication incentives.

[Click here to start Lesson 4](../README.md)
