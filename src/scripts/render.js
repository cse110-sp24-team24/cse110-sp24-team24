//TODO rename noteTitle, Content, Tags and Date to reflect they are specifically for editor noteContent -> noteEditorContent
//TODO change renderNotes to use a function or for loop instead of copy pasted code 3 times
//TODO replace the brute force on click and innerHTML with webcomponents
const notesAPI = window.notes;
let activeNoteID = null;
document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  //Note Editor Elements
  const noteEditor = document.getElementById("noteEditor");
  const noteTitle = document.getElementById("noteTitle");
  const noteContent = document.getElementById("noteContent");
  const noteTags = document.getElementById("noteTags");
  const noteDate = document.getElementById("noteDate");
  const saveNoteButton = document.getElementById("saveNoteButton");
  const deleteNoteButton = document.getElementById("deleteNoteButton");
  const cancelButton = document.getElementById("cancelButton");

  saveNoteButton.addEventListener("click", saveActiveNote);
  deleteNoteButton.addEventListener("click", deleteActiveNote);
  cancelButton.addEventListener("click", hideNoteEditor);

  //Toolbar Elements
  const underlineButton = document.getElementById("makeUnderlineButton");
  const italicButton = document.getElementById("makeItalicButton");
  const boldButton = document.getElementById("makeBoldButton");

  underlineButton.addEventListener("click", function () {
    applyStyle("underline");
  });
  italicButton.addEventListener("click", function () {
    applyStyle("italic");
  });
  boldButton.addEventListener("click", function () {
    applyStyle("bold");
  });

  //Other Elements
  const addNoteButton = document.getElementById("addNoteButton");
  const searchInput = document.getElementById("searchInput");
  const notesContainer = document.getElementById("notesContainer");

  addNoteButton.addEventListener("click", () => showNoteEditor());
  searchInput.addEventListener("input", filterNotes);

  //start
  renderNotes();

  /* Show note editor that uses default params when adding new note,
   * and pass in existing note to edit existing one
   * noteEditor DOM element is shown, and if existing note is edited,
   * its existing data is displayed
   * @param {object} note
   * @param {number} index
   */
  function showNoteEditor(
    note = {
      ID: null,
      title: "",
      content: "",
      tags: "",
      date: new Date().toISOString().substring(0, 10),
    }
  ) {
    activeNoteID = note.ID;
    noteTitle.value = note.title;
    noteContent.innerHTML = note.content;
    noteTags.value = note.tags;
    noteDate.value = note.date;
    noteEditor.classList.remove("hidden"); // Show the note editor
  }

  // Hide note editor and clear note editor fields
  function hideNoteEditor() {
    activeNoteID = null;
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
  async function saveActiveNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.innerHTML.trim();
    const tags = noteTags.value.trim();
    const date = noteDate.value;

    if (!title || !content) {
      alert("Title and content cannot be empty.");
      return;
    }

    if (activeNoteID == null) {
      await notesAPI.createNote(title, content, tags, date);
    } else {
      await notesAPI.updateNote(activeNoteID, title, content, tags, date);
    }
    renderNotes();
    hideNoteEditor();
  }

  /* Delete note from "notes" array with browser confirmation
   * after deletion, notes are rerendered, and note editor is hidden
   * since note is deleted from editor screen
   */
  async function deleteActiveNote() {
    // event.stopPropagation(); // Prevent click event from propagating to parent elements
    deleteNote(activeNoteID);
  }

  async function deleteNote(noteID) {
    if (confirm("Are you sure you want to delete this note?")) {
      await notesAPI.deleteNote(noteID);
      hideNoteEditor();
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
    filteredTitleNotes = [],
    filteredTagNotes = [],
    filteredTextNotes = []
  ) {
    notesContainer.innerHTML = "<h2>Your Journals:</h2>"; // Clear previous notes

    if (
      filteredTitleNotes.length < 1 &&
      filteredTitleNotes.length < 1 &&
      filteredTitleNotes.length < 1
    ) {
      filteredTitleNotes = notesAPI.readNotes();
    }

    filteredTitleNotes.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.className = "note";
      noteElement.innerHTML = `
      <div class="note-header">
        <h2>${note.title}</h2>
        <button class="delete-note" aria-label="Delete Note"">🗑️</button> 
      </div>
      <p>${note.content}</p>
      <small>${note.date} - Tags: ${note.tags}</small>
    `;
      noteElement
        .querySelector("button")
        .addEventListener("click", async () => {
          event.stopPropagation()
          await deleteNote(note.ID);
        });
      noteElement.addEventListener("click", (event) => {
        showNoteEditor(note); // Edit note on click
      });
      notesContainer.appendChild(noteElement);
    });

    filteredTagNotes.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.className = "note";
      noteElement.innerHTML = `
      <div class="note-header">
        <h2>${note.title}</h2>
        <button class="delete-note" aria-label="Delete Note">🗑️</button>
      </div>
      <p>${note.content}</p>
      <small>${note.date} - Tags: ${note.tags}</small>
    `;
      noteElement
        .querySelector("button")
        .addEventListener("click", async (event) => {
          event.stopPropagation()
          await deleteNote(note.ID);
        });
      noteElement.addEventListener("click", () => {
        showNoteEditor(note); // Edit note on click
      });
      notesContainer.appendChild(noteElement);
    });

    filteredTextNotes.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.className = "note";
      noteElement.innerHTML = `
      <div class="note-header">
        <h2>${note.title}</h2>
        <button class="delete-note" aria-label="Delete Note">🗑️</button>
      </div>
      <p>${note.content}</p>
      <small>${note.date} - Tags: ${note.tags}</small>
    `;
      noteElement
        .querySelector("button")
        .addEventListener("click", async (event) => {
          event.stopPropagation()
          await deleteNote(note.ID);
        });
      noteElement.addEventListener("click", () => {
        showNoteEditor(note); // Edit note on click
      });
      notesContainer.appendChild(noteElement);
    });
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
    const notes = notesAPI.readNotes();

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
});
