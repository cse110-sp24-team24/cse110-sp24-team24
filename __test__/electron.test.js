describe("Testing Window Functionality", () => {
  //launch the app check its on darwin
  //if you close a window with pupeteer confirm the app is still running and make sure you can stil open it
});
import { app, BrowserWindow, ipcMain } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";


const main = async () => {
  await pie.initialize(app);
  const browser = await pie.connect(app, puppeteer);
 
  const window = new BrowserWindow();
  const url = "https://example.com/";
  await window.loadURL(url);
 
  const page = await pie.getPage(browser, window);
  console.log(page.url());
  window.destroy();
};

main();