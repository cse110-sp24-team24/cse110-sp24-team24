// preload requires .mjs extension https://www.electronjs.org/docs/latest/tutorial/esm#esm-preload-scripts-must-have-the-mjs-extension
import { contextBridge, ipcRenderer } from "electron";

// //CHANGED
// // Override the confirm function to send a message to the main process
// window.confirm = async (message) => {
//   // Send a message to the main process to trigger the confirmation dialog
//   const confirmed = await ipcRenderer.invoke("confirm-dialog", message);
//   return confirmed;
// };

// // Expose other functions or variables as needed
// // Example:
// contextBridge.exposeInMainWorld("myAPI", {
//   // Functions or variables to expose
// });
// //CHANGED

let notes = null;
await readAndDefineNotesIfNull();
// Provide context bridge to expose file to render.js
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

/**
 * Create a new note, generating a noteID, and save it to file storage.
 * @param {string} title
 * @param {string} content
 * @param {string} tags
 * @param {object} date
 * @returns {string}
 */
async function createNote(title, content, tags, date) {
  readAndDefineNotesIfNull();
  let newID = generateID();
  await updateNote(newID, title, content, tags, date);
  return newID;
}

/**
 * Return all notes as an array.
 * @returns {object[]}
 */
function readNotes() {
  return Object.values(notes);
}
/**
 * Return note based on noteID.
 * @param {string} noteID
 * @returns {object}
 */
function readNote(noteID) {
  return notes[noteID];
}

/**
 * Override the note specified by noteID with the specified parameters and update file storage.
 * @param {string} noteID
 * @param {string} title
 * @param {string} content
 * @param {string} tags
 * @param {obejct} date
 */
async function updateNote(noteID, title, content, tags, date) {
  readAndDefineNotesIfNull();
  let newNote = {
    ID: noteID,
    title: title,
    content: content,
    tags: tags,
    date: date,
  };
  notes[newNote.ID] = newNote;
  updateNotesFile();
}

/**
 * Delete the note specified by noteID and update file storage.
 * @param {object} noteID
 */
async function deleteNote(noteID) {
  readAndDefineNotesIfNull();
  delete notes[noteID];
  updateNotesFile();
}

/**
 * Define local representation of notes from file storage if notes is not already defined.
 * @returns {object}
 */
async function readAndDefineNotesIfNull() {
  if (notes == null) {
    try {
      notes = await ipcRenderer.invoke("fileStorage:readNotesFile");
    } catch (err) {
      console.error(err);
      throw new Error(`Unable to load notes from file system. ${err}`);
    }
  }
  return notes;
}

/**
 * Update file storage representation of notes with local representation of notes.
 */
async function updateNotesFile() {
  try {
    await ipcRenderer.invoke("fileStorage:updateNotesFile", notes);
  } catch (err) {
    console.error(err);
    throw new Error(`Unable to save notes to file system. ${err}`);
  }
}
