//TODO create tests
import fs from "fs/promises";
import path from "node:path";

/**
 * Save the notes to file storage.
 * @param {object} data
 * @param {string} dir
 * @param {string} file 
 */
async function updateFile(data, dir, file) {
  const jsonData = JSON.stringify(data);
  try {
    await createDirIfNotExists(dir);
    await fs.writeFile(path.join(dir, file), jsonData);
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
    await createDirIfNotExists(dir);
    const data = await fs.readFile(path.join(dir, file), "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return {};
  }
}

async function createDirIfNotExists(dir){
  fs.access(dir, fs.constants.F_OK, (err) => {
    if(err){
      fs.mkdir(dir)
    } 
  });
}

export default { updateFile, readFile }; //access via import fileStorage from ./fileStorage.js
