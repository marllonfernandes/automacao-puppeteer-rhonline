const puppeteer = require("puppeteer");

(async () => {
  require("dotenv").config();
  const os = require("os");
  const osPlatform = os.platform(); // possible values are: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'

  let executablePath;
  if (/^win/i.test(osPlatform)) {
    executablePath =
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
  } else if (/^linux/i.test(osPlatform)) {
    executablePath = "/usr/bin/google-chrome";
  } else if (/^darwin/i.test(osPlatform)) {
    executablePath =
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();

  const context = browser.defaultBrowserContext();
  await context.overridePermissions(process.env.URL, ["geolocation"]);

  await page.goto(process.env.URL, { waitUntil: "networkidle2" });

  await page.setGeolocation({
    latitude: parseFloat(process.env.LATITUDE),
    longitude: parseFloat(process.env.LONGITUDE),
  });

  try {

    await page.locator(process.env.SELECTOR_CPF).fill(process.env.USER_LOGIN);
    await page
      .locator(process.env.SELECTOR_PASSWORD)
      .fill(process.env.PASSWORD_LOGIN);
    await page.locator(process.env.SELECTOR_SUBMIT).click();

    await timeout(5000)
    await browser.close();
  } catch (error) {
    console.log(error.message);
  }
})();

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}