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
  let newId = generateID();
  await updateNote(newId, title, content, tags, date);
  return newId;
}

//readNote
async function readNotes() {
  initNotesIfNull();
  return notes;
}
async function readNote(noteId) {
    initNotesIfNull();
    return notes[noteId];
  }

//updateNote
async function updateNote(noteId, title, content, tags, date) {
  initNotesIfNull();
  let newNote = {
    id: generateID(),
    title: title,
    content: content,
    tags: tags,
    date: date,
  };
  notes[newNote.id] = newNote;
  updateFileStorage();
}

//deleteNote()
async function deleteNote(noteId) {
  initNotesIfNull();
  delete notes[noteId];
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
