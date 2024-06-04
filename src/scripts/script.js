let notes = []; // Array to store notes for displaying (can factor in notes storage later)
let editingNoteIndex = null; // Index of the note currently being edited
let underlineButton = document.getElementById("makeUnderlineButton");
let italicButton = document.getElementById("makeItalicButton");
let boldButton = document.getElementById("makeBoldButton");

function initializeNoteApp() {
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
  const insertCodeButton = document.getElementById("insertCodeBlockButton");

  // Event listeners for adding, deleting and filtering notes
  addNoteButton.addEventListener("click", showNoteEditor);
  saveNoteButton.addEventListener("click", saveNote);
  deleteNoteButton.addEventListener("click", deleteNote);
  cancelButton.addEventListener("click", hideNoteEditor);
  searchInput.addEventListener("input", filterNotes);

  // Event listeners for changing text styles within note editor
  underlineButton.addEventListener("click", () => applyStyle("underline"));
  italicButton.addEventListener("click", () => applyStyle("italic"));
  boldButton.addEventListener("click", () => applyStyle("bold"));
  insertCodeButton.addEventListener("click", insertCode);
  noteContent.addEventListener("keydown", loadStyle);
  noteContent.addEventListener("focus", loadStyle);

  // Event listeners for the note editor with code blocks
  noteContent.addEventListener("keydown", (event) => {
    // if the selection is inside a code block, get the code block the section is in
    let selectedInCodeBlock = getClosestAncestorEl(".codeBlock");

    // get the user's selection
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);

    // if the tab key press occurs inside of a codeblock, the tab will replace the tab navigation functionality and instead produce a '\t' inside the code block
    if (event.key.toLowerCase() == "tab" && selectedInCodeBlock) {
      // prevent the default behavior of pressing tab
      event.preventDefault();

      // create and insert '\t' tab text node
      const tabNode = document.createTextNode("\t");
      range.insertNode(tabNode);

      // select after the tab text node
      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    // if the delete key press occurs inside of a codeblock, then make sure that if the codeblock is to be empty the codeblock is removed
    if (
      (event.key.toLowerCase() == "delete" ||
        event.key.toLowerCase() == "backspace") &&
      selectedInCodeBlock
    ) {
      const selectedText = range.toString().replace(/\s/g, "");
      const codeBlockText = selectedInCodeBlock.innerText.replace(/\s/g, "");
      // checks if the delete will delete the last character in the code block or at least all text in the code block is selected
      if (
        selectedInCodeBlock.innerText.length == 1 ||
        selectedText.indexOf(codeBlockText) >= 0
      ) {
        // prevent the default behavior of delete
        event.preventDefault();

        // empty the code block container
        selectedInCodeBlock.innerHTML = "";

        // remove the zerowidthspace text node after the code block
        if (selectedInCodeBlock.nextSibling.data == "\u200B")
          selectedInCodeBlock.nextSibling.remove();

        // remove the code block element
        selectedInCodeBlock.remove();
      }
    }
  });

  // Call loadNotes when the page is loaded
  window.onload = loadNotes;
}

/* Toggle note content styling button's class to "on" or "off"
 * button class represents style on UI for whether style is applied
 * or not
 * @param {DOM element} button
 */
function styleToggle(button) {
  if (button.className == "on") {
    button.className = "off";
  } else {
    button.className = "on";
  }
}

initializeNoteApp();

// clears notes array (for testing)
function clearNotes() {
  notes = [];
}

//returns notes array (for testing)
function getNotes() {
  return notes;
}

// Function to be called when the page is loaded
function loadNotes() {
  // Load notes from local storage
  const notesString = localStorage.getItem("notes");

  // Parse the JSON string to an array
  const notesArray = JSON.parse(notesString);

  // If the array is null (i.e., there were no notes in local storage), use an empty array
  notes = notesArray || [];

  renderNotes();
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
    title: "",
    content: "",
    tags: "",
    date: new Date().toISOString().substring(0, 10),
  },
  index = null
) {
  editingNoteIndex = index;
  noteTitle.value = note.title || "";
  noteContent.innerHTML = note.content || "";
  noteTags.value = note.tags || "";
  noteDate.value = note.date || new Date().toISOString().substring(0, 10);
  noteEditor.classList.remove("hidden"); // Show the note editor
}

// Hide note editor and clear note editor fields
function hideNoteEditor() {
  noteEditor.classList.add("hidden"); // Hide the note editor
  clearNoteEditor();

  boldButton.className = "off";
  italicButton.className = "off";
  underlineButton.className = "off";
  document.execCommand("removeFormat", false, null);
}

// Empties out note editor input areas for next use after hiding
function clearNoteEditor() {
  noteTitle.value = "";
  noteContent.innerHTML = ""; // Clears the prev content when making a new note
  noteTags.value = "";
  noteDate.value = new Date().toISOString().substring(0, 10); // Set to today's date
}

//
/**
 * Given a style in the form of a string (either "bold", "underline", or "italic"), toggle text styling in the respective format
 * @param {string} style - the style indicated by which button is pressed
 */
function applyStyle(style) {
  //depreciated method to toggle text styling
  if (style == "bold") {
    styleToggle(boldButton);
  }

  if (style == "underline") {
    styleToggle(underlineButton);
  }
  if (style == "italic") {
    styleToggle(italicButton);
  }
  noteContent.focus();
}

/* update the formatting to reflect the toolbar button indicators
 * on every note content input and click
 */
function loadStyle() {
  var bold = document.queryCommandState("bold");
  var italic = document.queryCommandState("italic");
  var underline = document.queryCommandState("underline");
  if (underlineButton.className == "on") {
    if (!underline) {
      document.execCommand("underline", false, null);
    }
  } else {
    if (underline) {
      document.execCommand("underline", false, null);
    }
  }

  if (boldButton.className == "on") {
    if (!bold) {
      document.execCommand("bold", false, null);
    }
  } else {
    if (bold) {
      document.execCommand("bold", false, null);
    }
  }

  if (italicButton.className == "on") {
    if (!italic) {
      document.execCommand("italic", false, null);
    }
  } else {
    if (italic) {
      document.execCommand("italic", false, null);
    }
  }
}

/**
 * called when insert code block button is clicked: inserts a code block into where the user is selected in the note contents
 */
function insertCode() {
  // make sure that the user is selected inside the note content and if so, they are not inside a code block; otherwise refocus on the note content and exit the function
  if (
    !getClosestAncestorEl("#noteContent") ||
    getClosestAncestorEl(".codeBlock")
  ) {
    noteContent.focus();
    return;
  }

  // create code block element
  const codeContainer = document.createElement("div");
  codeContainer.className = "codeBlock";
  const codeBlock = document.createElement("pre");
  const codeEl = document.createElement("code");
  codeEl.contentEditable = "true";
  codeEl.innerText = "// write code here...";
  codeBlock.append(codeEl);
  codeContainer.append(codeBlock);

  //zerowidthspace so that user can continue typing after code block
  const zeroWidthSpace = document.createTextNode("\u200B");

  //insert code block and select into code block
  const sel = window.getSelection();
  if (sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(codeContainer);
    range.collapse(false);
    range.insertNode(zeroWidthSpace);
    range.setStart(codeEl, 0);
    range.setEnd(codeEl, 0);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/**
 * Given a string in the form of a css selector, search for any ancestor elements from the user's sleection that matches the given selector
 * @param {string} selector - css selector to search by for the ancestor elements
 * @returns {Element} The ancestor element that matches the given selector, null of not found
 */
function getClosestAncestorEl(selector) {
  const sel = window.getSelection();
  if (sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    let node = range.startContainer;

    if (node.nodeType != Node.ELEMENT_NODE) {
      node = node.parentElement;
    }

    while (node && node != document) {
      if (node.matches(selector)) {
        return node;
      } else {
        node = node.parentElement;
      }
    }
  }
  return null;
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

  if (!title || !content) {
    alert("Title and content cannot be empty.");
    return;
  }

  const note = { title, content, tags, date };

  if (editingNoteIndex !== null) {
    notes[editingNoteIndex] = note; // Update existing note
  } else {
    notes.push(note); // Add new note
  }
  // Save notes to local storage
  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes();
  hideNoteEditor();
}

/* Delete note from "notes" array with browser confirmation
 * after deletion, notes are rerendered, and note editor is hidden
 * since note is deleted from editor screen
 */
function deleteNote() {
  if (editingNoteIndex !== null) {
    if (confirm("Are you sure you want to delete this note?")) {
      notes.splice(editingNoteIndex, 1); // Remove note from array

      // Save the remaining notes back to local storage
      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes();
      hideNoteEditor();
    }
  }
}

/* Also deletes note from "notes" array, but uses button from
 * render list. Notes in list correspond to index, which is passed in
 * to aid with deletion
 * @param {event} event
 * @param {number} index
 */
function deleteNoteByIndex(event, index) {
  event.stopPropagation(); // Prevent click event from propagating to parent elements
  if (confirm("Are you sure you want to delete this note?")) {
    notes.splice(index, 1); // Remove note from array

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
  notesContainer.innerHTML = "<h2>Your Journals:</h2>";

  const renderNote = (note, index) => {
    const noteElement = document.createElement("div");
    noteElement.className = "note";
    noteElement.innerHTML = `
      <div class="note-header">
        <h2>${note.title}</h2>
        <button class="delete-note" aria-label="Delete Note" onclick="deleteNoteByIndex(event, ${index})">🗑️</button>
      </div>
      <small>Date: ${note.date} &nbsp &nbsp Tags: ${note.tags}</small>
    `;
    noteElement.addEventListener("click", () => {
      showNoteEditor(note, index);
    });
    notesContainer.appendChild(noteElement);
  };

  filteredtitleNotes.forEach(renderNote);
  filteredtagNotes.forEach(renderNote);
  filteredtextNotes.forEach(renderNote);
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

// Export functions and variables for testing
module.exports = {
  initializeNoteApp,
  loadNotes,
  saveNote,
  deleteNote,
  showNoteEditor,
  hideNoteEditor,
  clearNoteEditor,
  filterNotes,
  renderNotes,
  clearNotes,
  getNotes,
};
