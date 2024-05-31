import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import path from "path";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = path.join(__dirname, "../data/data.json"); // HACK there should be a consistent way to start from the top level directory and not start from __dirname

//TODO create tests
/**
 * Save the notes to local storage. 
 * @param {object[]} notes 
 */
async function saveNotes(notes) {
  const jsonData = JSON.stringify(notes);
  try {
    await fs.writeFile(dataPath, jsonData);
  } catch (error) {
    console.error(error);
  }
}

// Implement reading notes from the file system
/** 
 * Return the notes saved in local storage.
 * @returns {object[]}
 */
async function readNotes() {
    try {
      const data = await fs.readFile(dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(error);
      return [];
    }
}

export default { saveNotes, readNotes }; //access via import fileStorage from ./fileStorage.js
