import fileStorage from "./fileStorage";
import { contextBridge } from "electron";

let notes = null; // Array to store notes for displaying (can factor in notes storage later)
await initNotesIfNull();
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
  initNotesIfNull();
  let newID = generateID();
  await updateNote(newID, title, content, tags, date);
  return newID;
}

//readNote
async function readNotes() {
  initNotesIfNull();
  return notes;
}
async function readNote(noteID) {
    initNotesIfNull();
    return notes[noteID];
  }

//updateNote
async function updateNote(noteID, title, content, tags, date) {
  initNotesIfNull();
  let newNote = {
    ID: generateID(),
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
  initNotesIfNull();
  delete notes[noteID];
}

async function initNotesIfNull() {
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
    await fileStorage.updateNotesFile();
  } catch (err) {
    console.error(err);
    throw new Error(`Unable to save notes to file system. ${err}`);
  }
}
