/**
 * This file contains the main Javascript for rendering the web journal. This
 * includes functionality to add and remove notes, add and remove tags, filter
 * by tags and a search bar, and more.
 */

// Array to store notes for displaying (can factor in notes storage later)
let notes = [
  {
    title: "",
    content: "",
    tags: {
      content: "",
      color: "",
    },
    date: new Date().toISOString().substring(0, 10),
  },
];

// Array of JSON objects to store tags
let tags = [
  {
    content: "",
    color: "",
  },
];

// Initially retrieving all the data from local storage.
notes = JSON.parse(localStorage.getItem("notes")) || [];
tags = JSON.parse(localStorage.getItem("tags")) || [];
let editingNoteIndex = null; // Index of the note currently being edited

// Getting the relevant DOM elements
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
const tagCreateButton = document.getElementById("tag-create");
const tagList = document.getElementById("tag-list");
const tagDropdownButton = document.getElementById("tag-dropdown");
const tagDropdownContainer = document.getElementById("tag-dropdown-container");
const tagDropdownList = document.getElementById("tag-dropdown-list");
const filterButton = document.getElementById("filterButton");
const filterDropdownContainer = document.getElementById(
  "filter-dropdown-container"
);
const filterDropdownList = document.getElementById("filter-dropdown-list");
const tagColorButton = document.getElementById("tag-color");
const homeButton = document.getElementById("homeButton");

// Event listener for tag color
tagColorButton.addEventListener("change", (event) => {
  console.log(noteTags.style.backgroundColor); // fine
  console.log(event.target.value);
  noteTags.style.backgroundColor = event.target.value;
});

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

// Event listener to display or hide the filter dropdown
filterButton.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent click event from propagating
  if (filterDropdownContainer.classList.contains("hidden")) {
    showFilterDropdown();
  } else {
    hideFilterDropdown();
  }
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

// Event listener to bring user back to list view of all notes and reset search fields
homeButton.addEventListener("click", () => {
  searchInput.value = ""; // Clear search input
  renderNotes(notes); // Render all notes
});

// Call loadNotes when the page is loaded
window.onload = loadNotes;

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
    tags: [
      {
        content: "",
        color: "",
      },
    ],
    date: new Date().toISOString().substring(0, 10),
  },
  index = null
) {
  editingNoteIndex = index;
  noteTitle.value = note.title;
  noteContent.innerHTML = note.content;
  noteDate.value = note.date;
  noteEditor.classList.remove("hidden"); // Show the note editor
  //noteTags.innerHTML = note.tags;
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
 * Hide note editor and clear note editor fields
 */
function hideNoteEditor() {
  noteEditor.classList.add("hidden"); // Hide the note editor
  clearNoteEditor();
}

// Empties out note editor input areas for next use after hiding
function clearNoteEditor() {
  noteTitle.value = "";
  noteContent.innerHTML = ""; // Clears the prev content when making a new note
  //noteTags.value = "";
  noteDate.value = new Date().toISOString().substring(0, 10); // Set to today's date
  // Clear the tags list
  tagList.innerHTML = "";
}

/* text styling buttons
 * @param {string} style
 */
function applyStyle(style) {
  //depreciated method to toggle text styling
  document.execCommand(style, false, null);

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
  const tags = Array.from(tagList.getElementsByTagName("li")).map((li) => {
    return {
      content: li.childNodes[0].textContent.trim(),
      color: li.style.backgroundColor,
    };
  });
  const date = noteDate.value;

  /*
   *Alert
   * if title or content of the note is empty
   * if the tag text box is not empty
   * You should add the tag in first
   */
  if (!title || !content) {
    alert("Title and content cannot be empty.");
    return;
  }

  if (noteTags.value !== "") {
    alert("You should add the tag first.");
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

/**  Adds a tag to the note tags list
 * Tags are stored in the tags array, and are displayed in the tag list
 * The background color is also set from reading fromt he select tag color
 * Clear the input box of the tag, upon asdding the tag
 */
function addTag() {
  // retrieve tags from local storage
  tags = JSON.parse(localStorage.getItem("tags")) || [];

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
  localStorage.setItem("tags", JSON.stringify(tags));

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
  const currNote = notes[editingNoteIndex];
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
function renderNotes(filteredNotes = notes) {
  notesContainer.innerHTML = "<h2>Your Journals:</h2>"; // Clear previous notes
  filteredNotes.forEach((note, index) => {
    const noteElement = document.createElement("div");
    noteElement.className = "note";

    // Create a container for tags
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
        <button class="delete-note" aria-label="Delete Note" onclick="deleteNoteByIndex(event, ${index})">🗑️</button>
      </div>
      <p>${note.content}</p>
      <small>${note.date}</small>
    `;
    // Append the tags container to the note element
    noteElement.appendChild(tagsContainer);
    noteElement.addEventListener("click", () => {
      showNoteEditor(note, index); // Edit note on click
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

  let filteredtitleNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(query)
  );

  // Render filtered notes
  renderNotes(filteredtitleNotes);
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
  tags = JSON.parse(localStorage.getItem("tags")) || [];
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
  const filteredNotes = notes.filter((note) =>
    note.tags.some(
      (tag) =>
        tag.content === selectedTag.textContent &&
        tag.color === selectedTag.style.backgroundColor
    )
  );

  if (filteredNotes.length === 0) {
    notesContainer.innerHTML = `<h2>Your Journals:</h2>
      <h3> There are no notes with this tag.</h3>`;
  } else {
    renderNotes(filteredNotes);
  }

  hideFilterDropdown();
}

// Export functions and variables for testing
module.exports = {
  loadNotes,
  saveNote,
  deleteNote,
  showNoteEditor,
  hideNoteEditor,
  clearNoteEditor,
  filterNotes,
  renderNotes,
  addTag,
  showTagDropdown,
  hideTagDropdown,
  removeTag,
  loadTags,
  addTagFromDropdown,
};