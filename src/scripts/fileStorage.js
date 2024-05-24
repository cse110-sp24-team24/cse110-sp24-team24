import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import path from "path";
import fs from "fs/promises"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = path.join(__dirname, "../data/data.json"); // HACK there should be a consistent way to start from the top level directory and not start from __dirname

//TODO create comments
//TODO create tests
async function saveNotes(notes){
    const jsonData = JSON.stringify(notes);
    try{
        await fs.writeFile(dataPath,jsonData);
    }
    catch(error){
        console.error(error);
    }
}

async function readNotes(){
}

export default {saveNotes, readNotes}; //access via import fileStorage from ./fileStorage.js