import electron from "electron";
import puppeteer from "puppeteer";

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
  
(async () => {
  try {
    const app = await puppeteer.launch({
      executablePath: electron,
      args: ["."],
      headless: false,
    });
    const pages = await app.pages();
    const [page] = pages;

    await page.setViewport({ width: 1200, height: 700 });
    await delay(5000);
    const image = await page.screenshot();
    console.log(image);
    await page.close();
    await delay(2000);

    await app.close();
  } catch (error) {
    console.error(error);
  }
})();
