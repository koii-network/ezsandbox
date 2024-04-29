async function testCrawl() {
    const PCR = require("puppeteer-chromium-resolver");
    const options = {revision: '1199997'};//revision: '1199997'
    const stats = await PCR(options);
    console.log(stats.executablePath)
    const browser = await stats.puppeteer.launch({
        headless: false,
        args: ["--no-sandbox"],
        executablePath: stats.executablePath
    }).catch(function(error) {
        console.log(error);
    });
    const page = await browser.newPage();
    await page.goto("https://www.npmjs.com/package/puppeteer-chromium-resolver");
    await browser.close();
}
testCrawl();