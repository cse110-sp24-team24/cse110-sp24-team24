// preload requires .mjs extension https://www.electronjs.org/docs/latest/tutorial/esm#esm-preload-scripts-must-have-the-mjs-extension
import { contextBridge, ipcRenderer } from "electron";

let notes = null;
let tags = null;
await readAndDefineNotesIfNull();
await readAndDefineTagsIfNull();
// Provide context bridge to expose file to render.js
contextBridge.exposeInMainWorld("notes", {
  createNote,
  createTag,
  readNotes,
  readNote,
  readTags,
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
 * Create a new tag with color and content, and save to file storage.
 * @param {string} content
 * @param {string} color
 */
async function createTag(content, color) {
  readAndDefineTagsIfNull();
  let newTag = {
    content: content,
    color: color,
  };
  tags[content] = newTag;
  updateNotesFile();
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
 * Return all tags as an array
 * @returns {object[]}
 */
function readTags() {
  return Object.values(tags);
}

/**
 * Override the note specified by noteID with the specified parameters and update file storage.
 * @param {string} noteID
 * @param {string} title
 * @param {string} content
 * @param {string} tags
 * @param {object} date
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
 * Define local representation of tags from file storage if tags is not already defined.
 * @returns {object}
 */
async function readAndDefineTagsIfNull() {
  if (tags == null) {
    try {
      tags = await ipcRenderer.invoke("fileStorage:readTagsFile");
    } catch (err) {
      console.error(err);
      throw new Error(`Unable to load tags from file system. ${err}`);
    }
  }
  return tags;
}

/**
 * Update file storage representation of notes with local representation of notes.
 */
async function updateNotesFile() {
  try {
    await ipcRenderer.invoke("fileStorage:updateNotesFile", notes);
    await ipcRenderer.invoke("fileStorage:updateTagsFile", tags);
  } catch (err) {
    console.error(err);
    throw new Error(`Unable to save notes to file system. ${err}`);
  }
}
