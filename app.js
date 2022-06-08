const puppeteer = require("puppeteer");

(async () => {

  require("dotenv").config();
  const os = require("os")
  const osPlatform = os.platform(); // possible values are: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
  const selectorCPF = "input[type=text]";
  const selectorPWD = "input[type=password]";
  const selectorSubmit =
  "body > app-root > div > div > app-login > div.po-sm-12.po-md-6.po-lg-6.po-xl-6.login-container > div > form > po-button > button";
  
  let executablePath;
  if (/^win/i.test(osPlatform)) {
    executablePath = "";
  } else if (/^linux/i.test(osPlatform)) {
    executablePath = "/usr/bin/google-chrome";
  } else if(/^darwin/i.test(osPlatform)){
    executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
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

  const coords = await page.evaluate(
    () =>
      new Promise((resolve) =>
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) =>
            resolve({ latitude, longitude })
        )
      )
  );
  // console.log(coords);
  // console.log(process.env.USER_LOGIN);
  // console.log(process.env.PASSWORD_LOGIN);

  await page.waitForSelector(selectorCPF, { visible: true });
  await page.focus(selectorCPF);
  page.keyboard.type(process.env.USER_LOGIN, { delay: 50 });

  await timeout(1000);
  await page.focus(selectorPWD);
  page.keyboard.type(process.env.PASSWORD_LOGIN, { delay: 50 });

  await timeout(1000);
  const btnEntrar = await page.$(selectorSubmit);
  if (btnEntrar) {
    await btnEntrar.click();
  } else {
    console.log("btn entrar não localizado!");
    await browser.close();
    return;
  }

  await timeout(3000);
  const selectorMenu =
    "body > app-root > div > div > div.po-wrapper > po-menu > div.po-menu-mobile.po-clickable > span";
  // await page.waitForSelector(selectorMenu, { visible: true });
  const menu = await page.$(selectorMenu);
  if (menu) {
    await menu.click();
  } else {
    console.log("menu não localizado!");
    await browser.close();
    return;
  }

  await timeout(1000);
  const selectorPonto =
    "body > app-root > div > div > div.po-wrapper > po-menu > div.po-menu > nav > div > div > div:nth-child(3) > po-menu-item > div > div.po-menu-item.po-menu-icon-container.po-menu-item-grouper-down > div";
  const menuPonto = await page.$(selectorPonto);
  if (menuPonto) {
    await menuPonto.click();
  } else {
    console.log("menuBaterPonto não localizado!");
    await browser.close();
    return;
  }

  await timeout(1000);
  const selectorPontoRelogio =
    "body > app-root > div > div > div.po-wrapper > po-menu > div.po-menu > nav > div > div > div:nth-child(3) > po-menu-item > div > div.po-menu-sub-items > div:nth-child(3) > po-menu-item > a > div > div";
  const menuPontoRelogio = await page.$(selectorPontoRelogio);
  if (menuPontoRelogio) {
    await menuPontoRelogio.click();
  } else {
    console.log("menuPontoRelogio não localizado!");
    await browser.close();
    return;
  }

  // const element = await page.$(selectorCSS);
  // const rect = await page.evaluate((element) => {
  //   const { top, left, bottom, right } = element.getBoundingClientRect();
  //   return { top, left, bottom, right };
  // }, element);
  // await page.mouse.move(parseInt(rect.top), parseInt(rect.left));
  // await page.waitFor(1000);
  // await page.mouse.click(parseInt(rect.top), parseInt(rect.left));
  // console.log(rect);
  await timeout(10000);
  await browser.close();
})();

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
