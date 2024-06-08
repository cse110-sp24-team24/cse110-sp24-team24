const notesAPI = window.notes;
let activeNoteID = null;

// Declare variables in the global scope
let underlineButton,
  italicButton,
  boldButton,
  noteEditor,
  noteTitle,
  noteContent,
  noteTags,
  noteDate,
  saveNoteButton,
  deleteNoteButton,
  cancelButton,
  insertCodeButton,
  addNoteButton,
  searchInput,
  notesContainer;

document.addEventListener("DOMContentLoaded", () => {
  initializeNoteApp();
});

function initializeNoteApp() {
  // Get DOM elements
  //Note Editor Elements
  noteEditor = document.getElementById("noteEditor");
  noteTitle = document.getElementById("noteTitle");
  noteContent = document.getElementById("noteContent");
  noteTags = document.getElementById("noteTags");
  noteDate = document.getElementById("noteDate");
  saveNoteButton = document.getElementById("saveNoteButton");
  deleteNoteButton = document.getElementById("deleteNoteButton");
  cancelButton = document.getElementById("cancelButton");

  saveNoteButton.addEventListener("click", saveActiveNote);
  deleteNoteButton.addEventListener("click", deleteActiveNote);
  cancelButton.addEventListener("click", hideNoteEditor);

  //Toolbar Elements
  underlineButton = document.getElementById("makeUnderlineButton");
  italicButton = document.getElementById("makeItalicButton");
  boldButton = document.getElementById("makeBoldButton");
  insertCodeButton = document.getElementById("insertCodeBlockButton");

  underlineButton.addEventListener("click", function () {
    applyStyle("underline");
  });
  italicButton.addEventListener("click", function () {
    applyStyle("italic");
  });
  boldButton.addEventListener("click", function () {
    applyStyle("bold");
  });
  insertCodeButton.addEventListener("click", insertCode);
  noteContent.addEventListener("keydown", loadStyle);
  noteContent.addEventListener("focus", loadStyle);

  //Other Elements
  addNoteButton = document.getElementById("addNoteButton");
  searchInput = document.getElementById("searchInput");
  notesContainer = document.getElementById("notesContainer");

  addNoteButton.addEventListener("click", () => showNoteEditor());
  searchInput.addEventListener("input", filterNotes);

  // toggle text styling buttons on and off when selecting into styled or nonstyled text
  noteContent.addEventListener("mouseup", toggleStyleOnSelect);

  // Event listeners for the note editor with code blocks
  noteContent.addEventListener("keydown", (event) => specEditCodeBlock(event));

  renderNotes();
}

/**
 * Show note editor that uses default params when adding new note,
 * and pass in existing note to edit existing one
 * noteEditor DOM element is shown, and if existing note is edited,
 * its existing data is displayed
 * @param {object} note
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

/**
 * Hide the note editor set the activeNoteID to null and clear editor for next time the noteEditor is displayed.
 */
function hideNoteEditor() {
  activeNoteID = null;
  noteEditor.classList.add("hidden"); // Hide the note editor
  clearNoteEditor();

  boldButton.className = "off";
  italicButton.className = "off";
  underlineButton.className = "off";
  document.execCommand("removeFormat", false, null);
}

/**
 * Empties out note editor input areas for next use after hiding.
 */
function clearNoteEditor() {
  noteTitle.value = "";
  noteContent.innerHTML = "";
  noteTags.value = "";
  noteDate.value = new Date().toISOString().substring(0, 10); // Set to today's date
}

/**
 * Toggle note content styling button's class to "on" or "off"
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

/**
 * update the formatting to reflect the toolbar button indicators
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

function toggleStyleOnSelect() {
  if (getClosestAncestorEl("u")) {
    underlineButton.className = "on";
  } else {
    underlineButton.className = "off";
  }
  if (getClosestAncestorEl("b")) {
    boldButton.className = "on";
  } else {
    boldButton.className = "off";
  }
  if (getClosestAncestorEl("i")) {
    italicButton.className = "on";
  } else {
    italicButton.className = "off";
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
  codeContainer.contentEditable = "true";
  codeBlock.append(codeEl);
  codeContainer.append(codeBlock);

  //zerowidthspace so that user can continue typing after code block
  const zeroWidthSpace = document.createTextNode("\u200B");
  const initText = document.createTextNode("// write code here... ");

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
    range.insertNode(initText);
    range.setStartAfter(initText);
    range.setEndAfter(initText);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

function specEditCodeBlock(event) {
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
      //event.preventDefault();

      // empty the code block container
      selectedInCodeBlock.innerHTML = "";

      // remove the zerowidthspace text node after the code block
      if (selectedInCodeBlock.nextSibling.data == "\u200B")
        selectedInCodeBlock.nextSibling.remove();

      // remove the code block element
      selectedInCodeBlock.remove();
    }
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

/**
 * Save note values from note editor text input areas into a note object,
 * and updates note in "notes" array if already existing, or appends to
 * notes array if new after saving, notes are rendered and note editor is hidden
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

  try {
    if (activeNoteID == null) {
      await notesAPI.createNote(title, content, tags, date);
    } else {
      await notesAPI.updateNote(activeNoteID, title, content, tags, date);
    }
    renderNotes();
    hideNoteEditor();
  } catch (error) {
    console.error("Error saving note:", error);
  }
}

/**
 * Delete note based on the active Note with browser confirmation
 * after deletion, notes are rerendered, and note editor is hidden
 * since note is deleted from editor screen
 */
async function deleteActiveNote() {
  deleteNote(activeNoteID);
}

/**
 * Delete note specified by the noteId passed in with browser confirmation
 * after deletion, notes are rerendered, and note editor is hidden. Rerender the view accordingly.
 * @param {string} noteID
 */
async function deleteNote(noteID) {
  if (confirm("Are you sure you want to delete this note?")) {
    try {
      await notesAPI.deleteNote(noteID);
      hideNoteEditor();
      renderNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }
}

/**
 * Create a DOM element for a given note.
 *
 * @param {object} note - The note object containing the note's data.
 * @returns {HTMLElement} The created DOM element representing the note.
 */
function createNoteElement(note) {
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
      event.stopPropagation();
      await deleteNote(note.ID);
    });
  noteElement.addEventListener("click", () => {
    showNoteEditor(note); // Edit note on click
  });
  return noteElement;
}

/**
 * Render notes to the notes container
 * Renders all notes if no search filter, but can be filtered
 * to reduce search.
 * Appends notes to the notes container in the order of filtering,
 * which is by title, then tags, then text
 * each note displays all related text, as well as an edit and delete button
 * @param {object[]} filteredTitleNotes
 * @param {object[]} filteredTagNotes
 * @param {object[]} filteredTextNotes
 */
function renderNotes(
  filteredTitleNotes = [],
  filteredTagNotes = [],
  filteredTextNotes = []
) {
  notesContainer.innerHTML = "<h2>Your Journals:</h2>";

  // Ensure notesAPI.readNotes() returns an array
  if (!Array.isArray(filteredTitleNotes)) {
    filteredTitleNotes = [];
  }

  if (!Array.isArray(filteredTagNotes)) {
    filteredTagNotes = [];
  }

  if (!Array.isArray(filteredTextNotes)) {
    filteredTextNotes = [];
  }

  if (
    !filteredTitleNotes.length &&
    !filteredTagNotes.length &&
    !filteredTextNotes.length
  ) {
    filteredTitleNotes = notesAPI.readNotes();
  }

  [...filteredTitleNotes, ...filteredTagNotes, ...filteredTextNotes].forEach(
    (note) => {
      notesContainer.appendChild(createNoteElement(note));
    }
  );
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

  const filteredTitleNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(query)
  );
  const filteredTagNotes = notes.filter(
    (note) =>
      note.tags.toLowerCase().includes(query) &&
      !filteredTitleNotes.includes(note)
  );
  const filteredTextNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(query) &&
      !filteredTitleNotes.includes(note) &&
      !filteredTagNotes.includes(note)
  );

  // Render filtered notes
  renderNotes(filteredTitleNotes, filteredTagNotes, filteredTextNotes);
}

module.exports = {
  initializeNoteApp,
  showNoteEditor,
  hideNoteEditor,
  clearNoteEditor,
  saveActiveNote,
  deleteActiveNote,
  deleteNote,
  renderNotes,
  filterNotes,
  createNoteElement,
  getClosestAncestorEl,
};
