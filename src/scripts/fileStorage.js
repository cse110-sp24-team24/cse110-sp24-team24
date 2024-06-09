//TODO create tests
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const notesDataPath = path.join(__dirname, "../data/notes.json"); // HACK there should be a consistent way to start from the top level directory and not start from __dirname
const tagsDataPath = path.join(__dirname, "../data/tags.json");

/**
 * Save the notes to file storage.
 * @param {object} data
 * @param {string} dir
 * @param {string} file 
 */
async function updateFile(data, dir, file) {
  const jsonData = JSON.stringify(data);
  try {
    await fs.writeFile(notesDataPath, jsonData);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Return the notes saved in file storage.
 * @param {string} dir
 * @param {string} file 
 * @returns {object}
 */
async function readFile(dir, file) {
  try {
    const data = await fs.readFile(notesDataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return {};
  }
}

/**
 * Save the tags to file storage.
 * @param {object} tags
 */
async function updateTagsFile(tags) {
  const jsonData = JSON.stringify(tags);
  try {
    await fs.writeFile(tagsDataPath, jsonData);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Return the tags saved in file storage.
 * @returns {object}
 */
async function readTagsFile() {
  try {
    const data = await fs.readFile(tagsDataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return {};
  }
}

export default { updateNotesFile, readNotesFile, updateTagsFile, readTagsFile }; //access via import fileStorage from ./fileStorage.js
