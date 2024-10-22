import PCR from "puppeteer-chromium-resolver";

export async function crawl(searchTerm) {
  const options = {};
  const stats = await PCR(options);
  console.log(`Chrome Path: ${stats.executablePath}`);

  // Set up puppeteer
  // set headless = false for visualization debugging, set headless = true for production
  const browser = await stats.puppeteer.launch({
    headless: false,
    executablePath: stats.executablePath,
  });

  // Open a new page
  const page = await browser.newPage();
  // Set the user agent to a common browser user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
  );
  // The URL to scrape
  const url = `https://forums.redflagdeals.com/hot-deals-f9/`;

  // `documentloaded` means the loading icon on the left of the tab is resolved
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Wait for the search bar to load
  await page.waitForSelector("#search_keywords");

  // type the search term into the search bar
  await page.type("#search_keywords", searchTerm);

  // submit the search term
  await page.keyboard.press("Enter");

  // Wait for the links to load after the search term is submitted
  await page.waitForSelector("h2.topictitle");

  // Get the titles of the links
  let titles = null;
  try {
    titles = await page.$$eval("h2.topictitle a", (links) =>
      links.map((link) => link.textContent.trim())
    );
  } catch (error) {
    console.log("Error:", error);
  }

  // close puppeteer
  await browser.close();
  return titles;
}
