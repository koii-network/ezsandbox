# Lesson 3: Secrets & Config

## Part III. Building a Crawler

![Lesson 3](https://github.com/koii-network/ezsandbox/assets/66934242/5cc14e75-0c0a-4625-b809-dc12af7d49a1)

Before we start writing our own crawler code, it's helpful to understand how to structure a web crawler task on Koii. We've [previously covered IPFS](../Lesson%202/PartIII.md), so this should be fairly straightforward. We've provided a skeleton for you to use in `simple-crawler/before` and `simple-crawler/after contains the complete crawler.

Prerequisites:

- General understanding of IPFS, see [Lesson 2, Part 3](../Lesson%202/PartIII.md) if you need a refresher
- Understanding of [Puppeteer](https://pptr.dev/)

### Headless Mode

Puppeteer is a browser than can be controlled programmatically. Because it is designed to be automated, it has a `headless` mode which allows it to run silently, without running a visible browser window. We have [set `headless` to `false`](./simple-crawler/before/crawler/SimpleCrawlerTask.js#L22) so you'll be able to see the browser automation working, but if you don't need to see it, you can set `headless` to `true` instead. You should always set `headless: true` if you are deploying the task.

### Environment variables

The task we're building here doesn't require any login info, but we'll be asking the user for a keyword they want to search for. add the following to the `config-task.yml` in the requirementsTags:

```yaml
- type: TASK_VARIABLE
  value: "KEYWORD"
  description: "keyword to search for"
```

**NOTE**: If you're testing locally, make sure to also add `KEYWORD` to your .env.

### Building the Crawler

We've provided a [crawl function](./simple-crawler/task/crawler.js) you can use to scrape [redflagdeals](https://forums.redflagdeals.com/hot-deals-f9/`). If you examine this code, you'll notice it's only useful for the site we're scraping; scraping code must always be customized for your specific use case.

### Using the Crawler

Use the crawler in your task function to search for the keyword you defined in your `.env` file and save the results to IPFS. You may want to use the file utilities from [the previous lesson](../Lesson%202/file-sharing/task/fileUtils.js). ([Answer here](./simple-crawler/task/1-task.js))

### Submitting

Submit your CID. ([Answer here](./simple-crawler/task/2-submission.js))

### Auditing

Let's do a little more with our audit this time:

1. Retrieve the file from IPFS and verify it exists.
2. Check that the file content is a non-empty string, then parse it as JSON.
3. Check that the content of the file is an array with at least one entry.
4. Check that each value within the array is a string.

> [!WARNING]
>
> Our audits are getting better but they could still be improved significantly. See if you can spot some of the possible problems with this audit - how could someone exploit it?

[Answer here](./simple-crawler/task/3-audit.js)

Just like that, you've successfully created your very own web crawler! This template is very customizable and relatively simple. As you encounter more dynamic webpages, you may find it more difficult to web crawl. If you're concerned about websites with logging in, cookies, or dynamic content, we recommend checking out our [Twitter Archiver!](https://github.com/koii-network/task-X)

[Click here to start Lesson 4](../Lesson%204//README.md)
