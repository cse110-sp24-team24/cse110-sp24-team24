import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import path from "path";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = path.join(__dirname, "../data/data.json"); // HACK there should be a consistent way to start from the top level directory and not start from __dirname

//take notes and save it to data.json
function saveNotes() {
    fs.writeFile(path.join());
    console.log(dataDirectory);
}

//return an array from data.json
// function readNotes() {
//     console.log("test");
// }
