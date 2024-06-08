const notesAPI = window.notes;
let activeNoteID = null;
document.addEventListener("DOMContentLoaded", () => {
  initializeNoteApp();
});

function initializeNoteApp() {
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
  const insertCodeButton = document.getElementById("insertCodeBlockButton");

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
  noteContent.addEventListener("keydown", (event) => specEditCodeBlock(event));
  noteContent.addEventListener("focus", loadStyle);
  noteContent.addEventListener("mouseup", toggleStyleOnSelect);

  //Other Elements
  const addNoteButton = document.getElementById("addNoteButton");
  const searchInput = document.getElementById("searchInput");
  const notesContainer = document.getElementById("notesContainer");

  addNoteButton.addEventListener("click", () => showNoteEditor());
  searchInput.addEventListener("input", filterNotes);

  const tagCreateButton = document.getElementById("tag-create");
  const tagList = document.getElementById("tag-list");
  const tagDropdownButton = document.getElementById("tag-dropdown");
  const tagDropdownContainer = document.getElementById(
    "tag-dropdown-container"
  );
  const tagDropdownList = document.getElementById("tag-dropdown-list");
  const tagColorButton = document.getElementById("tag-color");

  //Event Listener for clicking the create tag button
  tagCreateButton.addEventListener("click", () => {
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

  const filterButton = document.getElementById("filterButton");
  const filterDropdownContainer = document.getElementById(
    "filter-dropdown-container"
  );
  const filterDropdownList = document.getElementById("filter-dropdown-list");

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

  // Event listener to bring user back to list view of all notes and reset search fields
  homeButton.addEventListener("click", () => {
    searchInput.value = ""; // Clear search input
    renderNotes(notes); // Render all notes
  });

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
    }
  ) {
    activeNoteID = note.ID;
    noteTitle.value = note.title;
    noteContent.innerHTML = note.content;
    noteTags.value = note.tags;
    noteDate.value = note.date;
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
          removeTag(tagItem, tag.content)
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
    noteTags.value = "";
    noteDate.value = new Date().toISOString().substring(0, 10); // Set to today's date
    tagList.innerHTML = "";
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
      <p>${note.content}</p>
      <small>${note.date} - Tags: ${note.tags}</small>
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

    let filteredTitleNotes = notes.filter((note) =>
      note.title.toLowerCase().includes(query)
    );
    let filteredTagNotes = notes.filter(
      (note) =>
        note.tags.toLowerCase().includes(query) &&
        !filteredTitleNotes.includes(note)
    );
    let filteredTextNotes = notes.filter(
      (note) =>
        note.content.toLowerCase().includes(query) &&
        !filteredTitleNotes.includes(note) &&
        !filteredTagNotes.includes(note)
    );

    // Render filtered notes
    renderNotes(filteredTitleNotes, filteredTagNotes, filteredTextNotes);
  }

  /**  Adds a tag to the note tags list
   * Tags are stored in the tags array, and are displayed in the tag list
   * The background color is also set from reading fromt he select tag color
   * Clear the input box of the tag, upon asdding the tag
   */
  function addTag() {
    // retrieve tags from local storage
    // tags = JSON.parse(localStorage.getItem("tags")) || [];

    // retrieve tags from file
    // tags = loadTagsFromFile();

    // tag data based on user input
    const tagText = noteTags.value.trim();
    const tagColor = noteTags.style.backgroundColor;
    if (tagText === "") {
      alert("Tag input cannot be empty if you want to add a tag.");
      return;
    }

    // check for tag duplication
    if (tags.some((tag) => tag.content === tagText && tag.color === tagColor)) {
      alert("Cannot add duplicate tag.");
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

    tags.push({ content: tagText, color: tagColor });
    // localStorage.setItem("tags", JSON.stringify(tags));
    fileStorage.updateTagsFile(tags)

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
    console.log(tags);
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
   * Adds the tag fromt he drop down list and populate the tag list
   * @param {string} tag
   * @returns
   */
  function addTagFromDropdown(tag) {
    const currNote = notes[activeNoteID];
    console.log(tag);
    console.log(currNote);
    if (currNote) {
      currNote.tags.forEach((currTag) => {
        if (currTag.content === tag.content) {
          return;
        }
      });
    }

    if (
      Array.from(tagList.getElementsByTagName("li")).some(
        (li) =>
          li.childNodes[0].textContent.trim() === tag.content &&
          li.style.backgroundColor === tag.color
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
      removeTag(tagItem, tagItem.textContent)
    );

    // Add the button to the tag list item
    tagItem.appendChild(removeButton);
    tagList.appendChild(tagItem);

    //localStorage.setItem("notes", JSON.stringify(notes));
    hideTagDropdown();
  }

  /**
   * Shows the filter dropdown (trigerred by event listener)
   */
  function showFilterDropdown() {
    filterDropdownContainer.classList.remove("hidden");
    filterDropdownContainer.classList.add("visible");
    filterButton.innerHTML = "&#9652;"; // Change icon to up arrow
    loadFilterTags();
  }

  /**
   * This function hides the filter dropdown
   * (trigerred by event listener)
   */
  function hideFilterDropdown() {
    filterDropdownContainer.classList.add("hidden");
    filterDropdownContainer.classList.remove("visible");
    filterButton.innerHTML = "&#9662;"; // Change icon to filter icon
  }

  /**
   * Load all the tags into the filter, called by showFilterDropdown() when user
   * clicks on dropdown button. Gets all the tags and creates a list item for
   * each one.
   */
  function loadFilterTags() {
    filterDropdownList.innerHTML = ""; // Clear existing items

    tags.forEach((tag) => {
      const tagItem = document.createElement("li");
      tagItem.textContent = tag.content;
      tagItem.style.backgroundColor = tag.color;
      tagItem.addEventListener("click", () => filterNotes());
      filterDropdownList.appendChild(tagItem);
    });
  }

  //render the notes on page load
  renderNotes();

  return {
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
}

module.exports = initializeNoteApp;
