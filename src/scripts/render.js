const notesAPI = window.notes;
let activeNoteID = null;

// Declare variables in the module scope
// HACK the functions that rely on these variables should be rewritten to not rely on module scope as a precaution
let noteEditor,
  noteTitle,
  noteContent,
  noteTags,
  noteDate,
  saveNoteButton,
  deleteNoteButton,
  cancelButton,
  underlineButton,
  italicButton,
  boldButton,
  insertImgButton,
  insertCodeButton,
  addNoteButton,
  modeToggle,
  themePref,
  searchInput,
  notesContainer,
  tagList,
  tagDropdownList,
  tagDropdownContainer,
  tagDropdownButton,
  filterDropdownContainer,
  filterButton,
  filterDropdownList;

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
  insertImgButton = document.getElementById("insertImageButton");
  insertCodeButton = document.getElementById("insertCodeBlockButton");

  //Other Elements
  addNoteButton = document.getElementById("addNoteButton");
  searchInput = document.getElementById("searchInput");
  notesContainer = document.getElementById("notesContainer");
  modeToggle = document.getElementById("darkmode-toggle");

  // prevent listeners for note content / toolbar functions
  underlineButton.addEventListener("click", function () {
    applyStyle("underline");
  });
  italicButton.addEventListener("click", function () {
    applyStyle("italic");
  });
  boldButton.addEventListener("click", function () {
    applyStyle("bold");
  });
  insertImgButton.addEventListener("click", insertImg);
  insertCodeButton.addEventListener("click", insertCode);
  noteContent.addEventListener("input", loadStyle);
  noteContent.addEventListener("focus", function () {
    loadStyle();
    enableEditingButtons();
  });

  // gets the os/browser theme preferences on darkmode
  themePref = window.matchMedia("(prefers-color-scheme: dark)");

  // initialize theme preferences based on: previously selected theme / the user's default os/browser settings
  loadInitThemePreference();
  themePref.addEventListener("change", loadInitThemePreference);

  // reveals empty note editor when add note button is pressed
  addNoteButton.addEventListener("click", showNoteEditor);

  // filters listed notes by the given query
  searchInput.addEventListener("input", filterNotes);

  // toggle theme when dark/light mode switch is checked
  modeToggle.addEventListener("change", toggleTheme);

  const tagCreateButton = document.getElementById("tag-create");
  tagList = document.getElementById("tag-list");
  tagDropdownButton = document.getElementById("tag-dropdown");
  tagDropdownContainer = document.getElementById("tag-dropdown-container");
  tagDropdownList = document.getElementById("tag-dropdown-list");
  const tagColorButton = document.getElementById("tag-color");
  // event listeners for when user clicks around toggle text styling buttons on and off when selecting into styled or nonstyled text
  window.addEventListener("mousedown", function (event) {
    if (!noteEditor.contains(event.target)) {
      hideNoteEditor();
    } else if (noteContent.contains(event.target)) {
      toggleStyleOnSelect();
    } else if (
      !underlineButton.contains(event.target) &&
      !boldButton.contains(event.target) &&
      !italicButton.contains(event.target) &&
      !insertImgButton.contains(event.target) &&
      !insertCodeButton.contains(event.target)
    ) {
      disableEditingButtons();
    }
  });

  //Event Listener for clicking the create tag button
  tagCreateButton.addEventListener("click", function () {
    addTag();
    //reset the color drop down to the first option
    tagColorButton.selectedIndex = 0;
  });

  //Event Listener for clicking tag dropdown button
  tagDropdownButton.addEventListener("click", () => {
    if (tagDropdownContainer.classList.contains("hidden")) {
      showTagDropdown();
    } else {
      hideTagDropdown();
    }
  });

  // Event listener for tag color
  tagColorButton.addEventListener("change", (event) => {
    console.log(noteTags.style.backgroundColor); // fine
    console.log(event.target.value);
    noteTags.style.backgroundColor = event.target.value;
  });

  filterButton = document.getElementById("filterButton");
  filterDropdownContainer = document.getElementById(
    "filter-dropdown-container",
  );
  filterDropdownList = document.getElementById("filter-dropdown-list");

  // Event listener to display or hide the filter dropdown
  filterButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent click event from propagating
    if (filterDropdownContainer.classList.contains("hidden")) {
      showFilterDropdown();
    } else {
      hideFilterDropdown();
    }
  });

  const homeButton = document.getElementById("homeButton");
  // Event listener to bring user back to list view of all notes and reset search fields
  homeButton.addEventListener("click", () => {
    searchInput.value = ""; // Clear search input
    renderNotes(); // Render all notes
  });

  //Shortcuts for keys
  document.addEventListener("DOMContentLoaded", function () {
    //Shorcut "Enter" to add tag on click
    noteTags.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        addTag();
      }
    });
  });

  // Event listener to hide the tag dropdown if the user clicks outside
  document.addEventListener("click", (event) => {
    if (
      !tagDropdownContainer.contains(event.target) &&
      !tagDropdownButton.contains(event.target)
    ) {
      hideTagDropdown();
    }
  });

  // Event listener to hide the filter dropdown if the user clicks outside
  document.addEventListener("click", (event) => {
    if (
      !filterDropdownContainer.contains(event.target) &&
      !filterButton.contains(event.target)
    ) {
      hideFilterDropdown();
    }
  });

  //render the notes on page load
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
    tags: [
      {
        content: "",
        color: "",
      },
    ],
    date: new Date().toISOString().substring(0, 10),
  },
) {
  enableEditingButtons();

  activeNoteID = note.ID;
  noteTitle.value = note.title || "";
  noteContent.innerHTML = note.content || "";
  const codeBlocks = document.querySelectorAll("#noteContent .codeBlock");
  codeBlocks.forEach((codeBlock) => {
    addCodeBlockEventListener(codeBlock);
  });
  tagList.value = note.tags || "";
  noteDate.value = note.date || new Date().toISOString().substring(0, 10);
  noteEditor.classList.remove("hidden"); // Show the note editor
  tagList.innerHTML = "";

  // grab the prevoiusly added tags and repopulate if you are editing a note with tags already
  note.tags.forEach((tag) => {
    if (tag.content.trim() !== "") {
      const tagItem = document.createElement("li");
      tagItem.textContent = tag.content;
      tagItem.style.backgroundColor = tag.color;
      // tag.content, tag.color

      const removeButton = document.createElement("button");
      removeButton.className = "remove-tag-button";
      removeButton.innerHTML = "&#10005;"; // Unicode for "X"
      removeButton.addEventListener("click", () =>
        removeTag(tagItem, tag.content),
      );

      tagItem.appendChild(removeButton);
      tagList.appendChild(tagItem);
    }
  });
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
  tagList.innerHTML = "";
  noteDate.value = new Date().toISOString().substring(0, 10); // Set to today's date
  tagList.innerHTML = "";
}

/**
 * Toggle note content styling button's class to "on" or "off".
 * Button class represents style on UI for whether style is applied or not.
 * @param {HTMLElement} button - The button element to toggle.
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
  // make sure that the user is selected inside the note content and if so, they are not inside a code block; otherwise refocus on the note content and exit the function
  if (
    !getClosestAncestorEl("#noteContent") ||
    getClosestAncestorEl(".codeBlock")
  ) {
    return;
  }
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
  const bold = document.queryCommandState("bold");
  const italic = document.queryCommandState("italic");
  const underline = document.queryCommandState("underline");
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
 * When the user selects into styled text, toggles the style on/off
 */
function toggleStyleOnSelect() {
  // make sure that the user is selected inside the note content and if so, they are not inside a code block; otherwise turn all buttons off
  if (
    !getClosestAncestorEl("#noteContent") ||
    getClosestAncestorEl(".codeBlock")
  ) {
    disableEditingButtons();
    return;
  }

  // check if inside styled text
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
    return;
  }

  // create code block element
  const codeBlock = document.createElement("textarea");
  codeBlock.className = "codeBlock";
  codeBlock.spellcheck = false;
  addCodeBlockEventListener(codeBlock);

  //zerowidthspace so that user can continue typing after code block
  const zeroWidthSpace = document.createTextNode("\u200B");
  const initText = document.createTextNode("// write code here... ");

  //insert code block and select into code block
  const sel = window.getSelection();
  if (sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(codeBlock);
    range.collapse(false);
    range.insertNode(zeroWidthSpace);
    range.setStart(codeBlock, 0);
    range.setEnd(codeBlock, 0);
    range.insertNode(initText);
    codeBlock.focus();
    range.setStartAfter(initText);
    range.setEndAfter(initText);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/**
 * Allows for customized reactions to certain events on code blocks (specific ways to delete/edit code blocks) by attaching event listeners to a given code block
 * @param {*} codeBlock takes in the code block to attach event listeners to
 */
function addCodeBlockEventListener(codeBlock) {
  // event listener to make sure that codeblock textarea value is saved into the innercontent to be saved in filesystem
  codeBlock.addEventListener("input", () => {
    codeBlock.textContent = codeBlock.value;
    codeBlock.value = codeBlock.textContent;
  });

  // event listener for 'tab' and 'delete' for specified behavior
  codeBlock.addEventListener("keydown", (event) => {
    // when 'tab' is entered, make sure that it does not default to tab navigation and isntead inserts a tab into the codeblock content
    if (event.key.toLowerCase() == "tab") {
      event.preventDefault();
      const start = codeBlock.selectionStart;
      const end = codeBlock.selectionEnd;
      codeBlock.value =
        codeBlock.value.substring(0, start) +
        "\t" +
        codeBlock.value.substring(end);
      codeBlock.selectionStart = start + 1;
      codeBlock.selectionEnd = start + 1;
    }

    //when 'delete' is entered, make sure that if the codeblock is empty, then delete the codeblock itself and remove its accompanying zero width space
    if (
      event.key.toLowerCase() == "delete" ||
      event.key.toLowerCase() == "backspace"
    ) {
      if (codeBlock.value.trim() == "") {
        event.preventDefault();
        codeBlock.innerHTML = "";
        if (codeBlock.nextSibling.data == "\u200B")
          codeBlock.nextSibling.remove();
        codeBlock.remove();
        noteContent.focus();
      }
    }
  });

  // turn off text styling when inside code block
  codeBlock.addEventListener("focus", () => {
    disableEditingButtons();
  });
}

/**
 * When the user presses teh insert image button, inserts a prompt for an image url, if it is valid an image will display in that position
 */
function insertImg() {
  // check if user is selected in code block or not selected in note content
  if (
    !getClosestAncestorEl("#noteContent") ||
    getClosestAncestorEl(".codeBlock")
  ) {
    noteContent.focus();
    return;
  }

  // get user selection
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);

  // create url input query for user
  const urlInput = document.createElement("input");
  urlInput.type = "url";
  urlInput.size = "40";
  urlInput.className = "urlInput";
  urlInput.placeholder = "type image url then press 'enter'";
  let imgUrl = "";

  // when user presses 'enter' the url input will disappear and be replaced with an image (if the url is valid)
  urlInput.addEventListener("keyup", (event) => {
    if (event.key.toLowerCase() == "enter") {
      event.preventDefault();
      imgUrl = urlInput.value;
      noteContent.focus();
      if (imgUrl) {
        const img = document.createElement("img");
        img.src = imgUrl;
        range.insertNode(img);
      }
    }
  });

  // when the user presses out of the input prompt, removes the input prompt from the content
  urlInput.addEventListener("focusout", () => {
    urlInput.remove();
  });

  // insert the url input
  range.deleteContents();
  range.insertNode(urlInput);
  urlInput.focus();
}

/**
 * disables all editing buttons
 */
function disableEditingButtons() {
  underlineButton.className = "off";
  underlineButton.disabled = true;
  boldButton.className = "off";
  boldButton.disabled = true;
  italicButton.className = "off";
  italicButton.disabled = true;

  insertCodeButton.disabled = true;
  insertImgButton.disabled = true;
}

/**
 * enables all editing buttons
 */
function enableEditingButtons() {
  underlineButton.disabled = false;
  boldButton.disabled = false;
  italicButton.disabled = false;

  insertCodeButton.disabled = false;
  insertImgButton.disabled = false;
}

/**
 * Given a string in the form of a css selector, search for any ancestor elements from the user's sleection that matches the given selector
 * @param {string} selector - css selector to search by for the ancestor elements
 * @returns {Element} The ancestor element that matches the given selector, null of not found
 */
function getClosestAncestorEl(selector) {
  // get user selection
  const sel = window.getSelection();

  // check surrounding ancestor nodes and get the nearest matching parent element up the DOM tree
  if (sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    let node = range.commonAncestorContainer;

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
  const tags = Array.from(tagList.getElementsByTagName("li")).map((li) => {
    return {
      content: li.childNodes[0].textContent.trim(),
      color: li.style.backgroundColor,
    };
  });
  const date = noteDate.value;

  if (!title || !content) {
    alert("Title and content cannot be empty.");
    return;
  }

  if (noteTags.value !== "") {
    alert("You should add the tag first.");
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

  const tagsContainer = document.createElement("div");
  tagsContainer.className = "tags-container";
  note.tags.forEach((tag) => {
    const tagElement = document.createElement("span");
    tagElement.className = "tag";
    tagElement.textContent = tag.content;
    tagElement.style.backgroundColor = tag.color;
    tagsContainer.appendChild(tagElement);
  });

  noteElement.innerHTML = `
      <div class="note-header">
        <h2>${note.title}</h2>
        <button class="delete-note" aria-label="Delete Note">🗑️</button>
      </div>
      <small>${note.date}</small>
    `;
  noteElement.appendChild(tagsContainer);
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
 * which is by title, then text
 * each note displays all related text, as well as an edit and delete button
 * @param {object[]} filteredTitleNotes
 * @param {object[]} filteredTextNotes
 */
function renderNotes(filteredTitleNotes = [], filteredTextNotes = []) {
  notesContainer.innerHTML = "<h2>Your Journals:</h2>";

  // Ensure notesAPI.readNotes() returns an array
  if (!Array.isArray(filteredTitleNotes)) {
    filteredTitleNotes = [];
  }

  if (!Array.isArray(filteredTextNotes)) {
    filteredTextNotes = [];
  }

  if (!filteredTitleNotes.length && !filteredTextNotes.length) {
    filteredTitleNotes = notesAPI.readNotes();
  }

  if (filteredTitleNotes.length > 0) {
    [...filteredTitleNotes].forEach((note) => {
      notesContainer.appendChild(createNoteElement(note));
    });
  }

  if (filteredTextNotes.length > 0) {
    [...filteredTextNotes].forEach((note) => {
      notesContainer.appendChild(createNoteElement(note));
    });
  }
}

/**
 * Filter notes based on search input
 * Filters by title first, then text
 * the two filters have no overlap, and highest of order
 * takes the note if search filter works for multiple of title, text
 * this occurs on input of search filter change, and new notes are automatically
 * rendered after filtering
 */
function filterNotes() {
  const query = searchInput.value.toLowerCase();
  const notes = notesAPI.readNotes();

  let filteredTitleNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(query),
  );

  let filteredTextNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(query) &&
      !filteredTitleNotes.includes(note),
  );

  if (filteredTitleNotes.length === 0 && filteredTextNotes.length === 0) {
    notesContainer.innerHTML = `<h2>Your Journals:</h2>
      <h3> There are no notes with this title or text.</h3>`;
  } else {
    renderNotes(filteredTitleNotes, filteredTextNotes);
  }

  hideFilterDropdown();
}

/**  Adds a tag to the note tags list
 * Tags are stored in the tags array, and are displayed in the tag list
 * The background color is also set from reading fromt he select tag color
 * Clear the input box of the tag, upon asdding the tag
 */
async function addTag() {
  // retrieve tags from local storage
  const tags = notesAPI.readTags();

  // tag data based on user input
  const tagText = noteTags.value.trim();
  const tagColor = noteTags.style.backgroundColor;
  if (tagText === "") {
    alert("Tag input cannot be empty if you want to add a tag.");
    return;
  }

  // check for tag duplication
  if (tags.some((tag) => tag.content === tagText && tag.color === tagColor)) {
    alert("Tag already exists in the dropdown box");
    return;
  }
  if (tags.some((tag) => tag.content === tagText)) {
    alert("Tag contains the same content, check drop down box");
    return;
  }

  // Add event listener to the add button
  const newTag = document.createElement("li");

  // Set the list item's content to the input's value
  newTag.textContent = tagText;

  // Set background COLOR
  newTag.style.backgroundColor = tagColor;

  // Create a remove button to remove the tag
  const removeButton = document.createElement("button");
  removeButton.className = "remove-tag-button";
  removeButton.innerHTML = "&#10005;"; // Unicode for "X"
  removeButton.addEventListener("click", () => removeTag(newTag, tagText));

  // Add the button to the tag list item
  newTag.appendChild(removeButton);

  // Add the list item to the list
  tagList.appendChild(newTag);

  try {
    await notesAPI.createTag(tagText, tagColor);
  } catch (error) {
    console.error("Error save tag", error);
  }

  // Clear the input
  noteTags.value = "";
  // Clear color of input box for tags
  noteTags.style.backgroundColor = "";

  /** reset tag color choice */
  const resetTagColor = document.querySelector("form");
  resetTagColor.reset();
}

/**
 * Remove the tag element from the DOM
 * @param {Element} tagElement
 */
function removeTag(tagElement) {
  tagElement.remove();
}

/**
 * Shows the tag dropdown
 * upon clicking the arrow button changes the icon to up arrow
 */
function showTagDropdown() {
  tagDropdownContainer.classList.remove("hidden");
  tagDropdownButton.innerHTML = "&#9652;"; // Change icon to up arrow
  loadTags();
}

/**
 * Hides the tag dropdown
 * Upon clicking the arrow button changes the icon to down arrow
 */
function hideTagDropdown() {
  tagDropdownContainer.classList.add("hidden");
  tagDropdownButton.innerHTML = "&#9662;"; // Change icon to down arrow
}

/**
 * Load tags from local storage and populate the tag dropdown
 */
function loadTags() {
  const tags = notesAPI.readTags();
  tagDropdownList.innerHTML = ""; // Clear existing items

  tags.forEach((tag) => {
    const tagItem = document.createElement("li");
    tagItem.textContent = tag.content;
    tagItem.style.backgroundColor = tag.color;
    tagItem.addEventListener("click", () => addTagFromDropdown(tag));
    tagDropdownList.appendChild(tagItem);
  });
}

/**
 * Adds the tag from the drop down list and populate the tag list
 * @param {string} tag
 */
function addTagFromDropdown(tag) {
  const notes = notesAPI.readNotes();
  const currNote = notes[activeNoteID];
  console.log(tag);
  console.log(currNote);
  if (currNote) {
    currNote.tags.forEach((currTag) => {
      if (currTag.content === tag.content && currTag.color === tag.color) {
        return;
      }
    });
  }

  if (
    Array.from(tagList.getElementsByTagName("li")).some(
      (li) =>
        li.childNodes[0].textContent.trim() === tag.content &&
        li.style.backgroundColor === tag.color,
    )
  ) {
    alert("Cannot add duplicate tag.");
    return;
  }
  const tagItem = document.createElement("li");
  tagItem.textContent = tag.content;
  tagItem.style.backgroundColor = tag.color;

  // Create a remove button to remove the tag
  const removeButton = document.createElement("button");
  removeButton.className = "remove-tag-button";
  removeButton.innerHTML = "&#10005;"; // Unicode for "X"
  removeButton.addEventListener("click", () =>
    removeTag(tagItem, tagItem.textContent),
  );

  // Add the button to the tag list item
  tagItem.appendChild(removeButton);
  tagList.appendChild(tagItem);

  hideTagDropdown();
}

/**
 * Shows the filter dropdown (trigerred by event listener)
 */
function showFilterDropdown() {
  if (filterDropdownContainer.classList.contains("hidden")) {
    filterDropdownContainer.classList.remove("hidden");
    filterDropdownContainer.classList.add("visible");
    filterButton.innerHTML = "&#9652;"; // Change icon to up arrow
    loadFilterTags();
  }
}

/**
 * This function hides the filter dropdown
 * (trigerred by event listener)
 */
function hideFilterDropdown() {
  if (filterDropdownContainer.classList.contains("visible")) {
    filterDropdownContainer.classList.add("hidden");
    filterDropdownContainer.classList.remove("visible");
    filterButton.innerHTML = "&#9662;"; // Change icon to filter icon
  }
}

/**
 * Load all the tags into the filter, called by showFilterDropdown() when user
 * clicks on dropdown button. Gets all the tags and creates a list item for
 * each one.
 */
function loadFilterTags() {
  const tags = notesAPI.readTags();
  filterDropdownList.innerHTML = ""; // Clear existing items

  tags.forEach((tag) => {
    const tagItem = document.createElement("li");
    tagItem.textContent = tag.content;
    tagItem.style.backgroundColor = tag.color;
    tagItem.addEventListener("click", () => filterNotesByTag(tagItem));
    filterDropdownList.appendChild(tagItem);
  });
}

/**
 * Filter the notes that are shown by a specific tag. Use the tag item that
 * is passed in and extract the relevant data from it, and then filter
 * using that data.
 * @param {HTMLLIElement} selectedTag
 */
function filterNotesByTag(selectedTag) {
  const notes = notesAPI.readNotes();
  const filteredNotes = notes.filter((note) =>
    note.tags.some(
      (tag) =>
        tag.content === selectedTag.textContent &&
        tag.color === selectedTag.style.backgroundColor,
    ),
  );

  if (filteredNotes.length === 0) {
    notesContainer.innerHTML = `<h2>Your Journals:</h2>
      <h3> There are no notes with this tag.</h3>`;
  } else {
    renderNotes(filteredNotes);
  }

  hideFilterDropdown();
}

/**
 * First checks the user's last saved theme setting, if there is no such setting then defaults to the os/browser theme preference
 */
function loadInitThemePreference() {
  // check local storage for saved theme
  const savedTheme = localStorage.getItem("theme");

  // toggle based on saved theme if exists, else toggle based on existing system preferences
  if (savedTheme && savedTheme == "dark") {
    modeToggle.checked = true;
  } else if (savedTheme && savedTheme == "light") {
    modeToggle.checked = false;
  } else {
    modeToggle.checked = themePref.matches;
  }
  toggleTheme();
}

/**
 * Toggles the theme based on the checked status of the theme switch, if checked then switches to dark theme, otherwise switches to light theme
 */
function toggleTheme() {
  if (modeToggle.checked) {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
  }
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
