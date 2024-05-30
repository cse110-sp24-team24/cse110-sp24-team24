let notes = []; // Array to store notes for displaying (can factor in notes storage later)
let editingNoteID = null; // Index of the note currently being edited

// Get DOM elements
const addNoteButton = document.getElementById("addNoteButton");
const saveNoteButton = document.getElementById("saveNoteButton");
const deleteNoteButton = document.getElementById("deleteNoteButton");
const cancelButton = document.getElementById("cancelButton");
const searchInput = document.getElementById("searchInput");
const noteEditor = document.getElementById("noteEditor");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const noteTags = document.getElementById("noteTags");
const noteDate = document.getElementById("noteDate");
const notesContainer = document.getElementById("notesContainer");
const underlineButton = document.getElementById("makeUnderlineButton");
const italicButton = document.getElementById("makeItalicButton");
const boldButton = document.getElementById("makeBoldButton");

// Event listeners for adding, deleting and filtering notes
addNoteButton.addEventListener("click", () => {
  showNoteEditor();
});
saveNoteButton.addEventListener("click", saveNote);
deleteNoteButton.addEventListener("click", deleteNote);
cancelButton.addEventListener("click", hideNoteEditor);
searchInput.addEventListener("input", filterNotes);

// Event listeners for changing text styles within note editor
underlineButton.addEventListener("click", function () {
  applyStyle("underline");
});
italicButton.addEventListener("click", function () {
  applyStyle("italic");
});
boldButton.addEventListener("click", function () {
  applyStyle("bold");
});

// Call loadNotes when the page is loaded
window.onload = loadNotes;

// Function to be called when the page is loaded
async function loadNotes() {
  try {
    // Load notes from the file system
    const notesArray = await fileStorage.readNotes();

    // If the array is null (i.e., there were no notes in the file system), use an empty array
    notes = notesArray || [];

    renderNotes();
  } catch (error) {
    console.error("Failed to load notes:", error);
    notes = [];
    renderNotes();
  }
}

/**
 * Randomly generate a unique ID that will be used to identify each note
 * See https://stackoverflow.com/questions/3231459/how-can-i-create-unique-ids-with-javascript
 *
 * @returns {string} ID
 */
function createID() {
  let ID = "id" + Math.random().toString(16).slice(2);
  return ID;
}

/* Show note editor that uses default params when adding new note,
 * and pass in existing note to edit existing one
 * noteEditor DOM element is shown, and if existing note is edited,
 * its existing data is displayed
 * @param {object} note
 * @param {number} index
 */
function showNoteEditor(
  note = {
    uniqueID: "",
    title: "",
    content: "",
    tags: "",
    date: new Date().toISOString().substring(0, 10),
  }
) {
  editingNoteID = note.uniqueID;
  noteTitle.value = note.title;
  noteContent.innerHTML = note.content;
  noteTags.value = note.tags;
  noteDate.value = note.date;
  noteEditor.classList.remove("hidden"); // Show the note editor
}

// Hide note editor and clear note editor fields
function hideNoteEditor() {
  noteEditor.classList.add("hidden"); // Hide the note editor
  clearNoteEditor();
}

// Empties out note editor input areas for next use after hiding
function clearNoteEditor() {
  noteTitle.value = "";
  noteContent.innerHTML = ""; // Clears the prev content when making a new note
  noteTags.value = "";
  noteDate.value = new Date().toISOString().substring(0, 10); // Set to today's date
}

//
/* text styling buttons
 * @param {string} style
 */

function applyStyle(style) {
  //depreciated method to toggle text styling
  document.execCommand(style, false, null);
  /* directly apply html tags (doesn't work) keeping for reference in case
  console.log('clicked');
  const start = noteContent.selectionStart;
  const end = noteContent.selectionEnd;
  const selectedText = noteContent.innerHTML.substring(start, end);
  console.log(selectedText);
  let styledText;
  switch(style) {
    case 'underline':
      styledText = `<u>${selectedText}</u>`;
      break;
    case 'italic':
      styledText = `<i>${selectedText}</i>`;
      break;
    case 'bold':
      styledText = `<b>${selectedText}</b>`;
      break;
    default:
      styledText = selectedText;
  }
  //noteContent.setRangeText(styledText, start, end);*/

  //refocus on content editor
  noteContent.focus();
}

/* Save note values from note editor text input areas into a note object,
 * and updates note in "notes" array if already existing, or appends to
 * notes array if new
 * after saving, notes are rendered and note editor is hidden
 */

function saveNote() {
  const title = noteTitle.value.trim();
  const content = noteContent.innerHTML.trim();
  const tags = noteTags.value.trim();
  const date = noteDate.value;

  // If editing existing note, use its ID, otherwise create a new ID
  const uniqueID = editingNoteID || createID();

  if (!title || !content) {
    alert("Title and content cannot be empty.");
    return;
  }

  const note = { uniqueID, title, content, tags, date };

  const existingNoteIndex = notes.findIndex((n) => n.uniqueID === uniqueID);

  if (existingNoteIndex !== -1) {
    notes[existingNoteIndex] = note;
  } else {
    notes.push(note);
  }

  /** 
  if (editingNoteIndex !== null) {
    notes[editingNoteIndex] = note; // Update existing note
  } else {
    notes.push(note); // Add new note
  }
  */

  // Save notes to the file system
  fileStorage
    .saveNotes(notes)
    .then(() => {
      renderNotes();
      hideNoteEditor();
    })
    .catch((error) => {
      console.error("Failed to save notes:", error);
    });
}

/* Delete note from "notes" array with browser confirmation
 * after deletion, notes are rerendered, and note editor is hidden
 * since note is deleted from editor screen
 */
function deleteNote() {
  const noteIndex = notes.findIndex((note) => note.uniqueID === editingNoteID);

  if (noteIndex !== -1) {
    if (confirm("Are you sure you want to delete this note?")) {
      notes.splice(noteIndex, 1); // Remove note from array

      // Save the remaining notes back to local storage
      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes();
      hideNoteEditor();
    }
  }

  /**
  if (editingNoteIndex !== null) {
    if (confirm("Are you sure you want to delete this note?")) {
      notes.splice(editingNoteIndex, 1); // Remove note from array

      // Save the remaining notes back to local storage
      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes();
      hideNoteEditor();
    }
  }
  */
}

// !!! NOTEEE Do we still need deleteNoteByIndex() ?
//            We are using deleteNote to delete notes via their uniqueID rather than index

/* Also deletes note from "notes" array, but uses button from
 * render list. Notes in list correspond to index, which is passed in
 * to aid with deletion
 * @param {event} event
 * @param {number} index
 */
function deleteNoteByIndex(event, uniqueID) {
  event.stopPropagation(); // Prevent click event from propagating to parent elements
  if (confirm("Are you sure you want to delete this note?")) {
    notes = notes.filter((note) => note.uniqueID !== uniqueID); // Remove note from array

    // Save the remaining notes back to local storage
    localStorage.setItem("notes", JSON.stringify(notes));

    renderNotes();
  }
}

/* Render notes to the notes container
 * Renders all notes if no search filter, but can be filtered
 * to reduce search.
 * Appends notes to the notes container in the order of filtering,
 * which is by title, then tags, then text
 * each note displays all related text, as well as an edit and delete button
 * @param {list} filteredtitleNotes
 * @param {list} filteredtagNotes
 * @param {list} filteredtextNotes
 */

function renderNotes(
  filteredtitleNotes = notes,
  filteredtagNotes = [],
  filteredtextNotes = []
) {
  notesContainer.innerHTML = "<h2>Your Journals:</h2>"; // Clear previous notes

  filteredtitleNotes.forEach((note) => {
    const noteElement = createNoteElement(note);
    noteElement.addEventListener("click", () => {
      showNoteEditor(note); // Edit note on click
    });
    notesContainer.appendChild(noteElement);
  });

  filteredtagNotes.forEach((note) => {
    const noteElement = createNoteElement(note);
    noteElement.addEventListener("click", () => {
      showNoteEditor(note); // Edit note on click
    });
    notesContainer.appendChild(noteElement);
  });

  filteredtextNotes.forEach((note) => {
    const noteElement = createNoteElement(note);
    noteElement.addEventListener("click", () => {
      showNoteEditor(note); // Edit note on click
    });
    notesContainer.appendChild(noteElement);
  });
}

function createNoteElement(note) {
  const noteElement = document.createElement("div");
  noteElement.className = "note";
  noteElement.innerHTML = `
    <div class="note-header">
      <h2>${note.title}</h2>
      <button class="delete-note" aria-label="Delete Note" onclick="deleteNote('${note.uniqueID}')">🗑️</button>
    </div>
    <p>${note.content}</p>
    <small>${note.date} - Tags: ${note.tags}</small>
    `;
  return noteElement;
}

/**
 * Filter notes based on search input
 * Filters by title first, then tags and then text
 * the three filters have no overlap, and highest of order
 * takes the note if search filter works for multiple of tag, title, text
 * this occurs on input of search filter change, and new notes are automatically
 * rendered after filtering
 */
function filterNotes() {
  const query = searchInput.value.toLowerCase();

  let filteredtitleNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(query)
  );
  let filteredtagNotes = notes.filter(
    (note) =>
      note.tags.toLowerCase().includes(query) &&
      !filteredtitleNotes.includes(note)
  );
  let filteredtextNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(query) &&
      !filteredtitleNotes.includes(note) &&
      !filteredtagNotes.includes(note)
  );

  // Render filtered notes
  renderNotes(filteredtitleNotes, filteredtagNotes, filteredtextNotes);
}
