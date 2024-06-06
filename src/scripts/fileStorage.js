//TODO create tests
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import path from "path";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = path.join(__dirname, "../data/data.json"); // HACK there should be a consistent way to start from the top level directory and not start from __dirname

/**
 * Save the notes to file storage.
 * @param {object} notes
 */
async function updateNotesFile(notes) {
  const jsonData = JSON.stringify(notes);
  try {
    await fs.writeFile(dataPath, jsonData);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Return the notes saved in file storage.
 * @returns {object}
 */
async function readNotesFile() {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return {};
  }
}

export default { updateNotesFile, readNotesFile }; //access via import fileStorage from ./fileStorage.js
