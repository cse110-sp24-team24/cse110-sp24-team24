import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import path from "node:path";
import { app, BrowserWindow } from "electron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  await app.whenReady();
  createWindow();

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "./scripts/preload.js"),
    },
  });
  win.loadFile("./index.html");
};

main();
