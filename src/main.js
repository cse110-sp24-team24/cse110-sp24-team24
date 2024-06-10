import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import path from "node:path";
import { app, BrowserWindow, ipcMain } from "electron";

import fileStorage from "./scripts/fileStorage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  await app.whenReady();
  createWindow();

  app.on("window-all-closed", () => {
    ipcMain.removeHandler("fileStorage:readNotesFile");
    ipcMain.removeHandler("fileStorage:updateNotesFile");
    ipcMain.removeHandler("fileStorage:readTagsFile");
    ipcMain.removeHandler("fileStorage:updateTagsFile");
    if (process.platform !== "darwin") app.quit();
  });
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}

const createWindow = () => {
  const notesDataPath = path.join(app.getPath("documents"), "Purrfect-Notes");
  ipcMain.handle("fileStorage:readNotesFile", async () => {
    return await fileStorage.readFile(notesDataPath, "notes.json");
  });

  ipcMain.handle("fileStorage:updateNotesFile", async (event, notes) => {
    await fileStorage.updateFile(notes, notesDataPath, "notes.json");
  });

  ipcMain.handle("fileStorage:readTagsFile", async () => {
    return await fileStorage.readTagsFile(notesDataPath, "tags.json");
  });

  ipcMain.handle("fileStorage:updateTagsFile", async (event, notes) => {
    await fileStorage.updateTagsFile(notes, notesDataPath, "tags.json");
  });

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "./scripts/preload.mjs"),
      nodeIntegration: true,
    },
  });

  win.loadFile(path.join(__dirname, "index.html"));
};

main();
