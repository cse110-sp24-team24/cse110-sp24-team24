// preload requires .mjs extension https://www.electronjs.org/docs/latest/tutorial/esm#esm-preload-scripts-must-have-the-mjs-extension
import fileStorage from "./fileStorage.js";
import { contextBridge } from "electron";

let notes = null;
let tags = null;
await defineNotesIfNull();
await defineTagsIfNull();
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
  defineNotesIfNull();
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
  defineTagsIfNull();
  let newTag = {
    content: content,
    color: color,
  };
  tags.append(newTag);
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
 * @param {obejct} date
 */
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

/**
 * Delete the note specified by noteID and update file storage.
 * @param {object} noteID
 */
async function deleteNote(noteID) {
  defineNotesIfNull();
  delete notes[noteID];
  updateFileStorage();
}

/**
 * Define local representation of notes from file storage if notes is not already defined.
 * @returns {object}
 */
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

/**
 * Define local representation of tags from file storage if tags is not already defined.
 * @returns {object}
 */
async function defineTagsIfNull() {
  if (tags == null) {
    try {
      tags = await fileStorage.readTagsFile();
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
async function updateFileStorage() {
  try {
    await fileStorage.updateNotesFile(notes);
    await fileStorage.updateTagsFile(tags);
  } catch (err) {
    console.error(err);
    throw new Error(`Unable to save notes to file system. ${err}`);
  }
}
