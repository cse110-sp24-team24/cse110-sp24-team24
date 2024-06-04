// preload requires .mjs extension https://www.electronjs.org/docs/latest/tutorial/esm#esm-preload-scripts-must-have-the-mjs-extension
import fileStorage from "./fileStorage.js";
import { contextBridge } from "electron";

let notes = null; // Array to store notes for displaying (can factor in notes storage later)
await defineNotesIfNull();
contextBridge.exposeInMainWorld("notes", {
  createNote,
  readNotes,
  readNote,
  updateNote,
  deleteNote,
});

/**
 * Randomly generate a unique ID that will be used to identify each note
 * See https://stackoverflow.com/questions/3231459/how-can-i-create-unique-ids-with-javascript
 *
 * @returns {string} ID
 */
function generateID() {
  let ID = "id" + Math.random().toString(16).slice(2);
  return ID;
}

//createNote
async function createNote(title, content, tags, date) {
  //TODO createNewID for the note and add id as a property of the note {id: someID, data:{note....}}
  defineNotesIfNull();
  let newID = generateID();
  await updateNote(newID, title, content, tags, date);
  return newID;
}

//readNote
function readNotes() {
  return Object.values(notes);
}
function readNote(noteID) {
  return notes[noteID];
}

//updateNote
async function updateNote(noteID, title, content, tags, date) {
  defineNotesIfNull();
  let newNote = {
    ID: noteID,
    title: title,
    content: content,
    tags: tags,
    date: date,
  };
  notes[newNote.ID] = newNote;
  updateFileStorage();
}

//deleteNote()
async function deleteNote(noteID) {
  defineNotesIfNull();
  delete notes[noteID];
  updateFileStorage();
}

async function defineNotesIfNull() {
  if (notes == null) {
    try {
      notes = await fileStorage.readNotesFile();
    } catch (err) {
      console.error(err);
      throw new Error(`Unable to load notes from file system. ${err}`);
    }
  }
  return notes;
}

async function updateFileStorage() {
  try {
    await fileStorage.updateNotesFile(notes);
  } catch (err) {
    console.error(err);
    throw new Error(`Unable to save notes to file system. ${err}`);
  }
}
