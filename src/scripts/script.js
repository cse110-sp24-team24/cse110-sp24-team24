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
]; // Array to store notes for displaying (can factor in notes storage later)
let tags = [
  {
    content: "",
    color: "",
  },
];
notes = JSON.parse(localStorage.getItem("notes")) || [];
tags = JSON.parse(localStorage.getItem("tags")) || [];
let editingNoteIndex = null; // Index of the note currently being edited

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
tagCreateButton.addEventListener("click", addTag);

//Event Listener for clicking tag dropdown button
tagDropdownButton.addEventListener("click", () => {
  if (tagDropdownContainer.classList.contains("hidden")) {
    showTagDropdown();
  } else {
    hideTagDropdown();
  }
});

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

document.addEventListener("click", (event) => {
  if (
    !tagDropdownContainer.contains(event.target) &&
    !tagDropdownButton.contains(event.target)
  ) {
    hideTagDropdown();
  }
});

document.addEventListener("click", (event) => {
  if (
    !filterDropdownContainer.contains(event.target) &&
    !filterButton.contains(event.target)
  ) {
    hideFilterDropdown();
  }
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

// Hide note editor and clear note editor fields
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

/* Also deletes note from "notes" array, but uses button from
 * render list. Notes in list correspond to index, which is passed in
 * to aid with deletion
 * @param {event} event
 * @param {number} index
 */
// function deleteNoteByIndex(event, index) {
//   event.stopPropagation(); // Prevent click event from propagating to parent elements
//   if (confirm("Are you sure you want to delete this note?")) {
//     notes.splice(index, 1); // Remove note from array

//     // Save the remaining notes back to local storage
//     localStorage.setItem("notes", JSON.stringify(notes));

//     renderNotes();
//   }
// }
/* Add a tag to the list
 */
function addTag() {
  const tagText = noteTags.value.trim();
  const tagColor = noteTags.style.backgroundColor;
  if (tagText === "") {
    alert("Tag input cannot be empty if you want to add a tag.");
    return;
  }

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
  //remove this because, its saving ter tags to the note, even when you hit cancel
  /*
  // Add the new tag to the tags array of the currently edited note
  if (editingNoteIndex !== null) {
    notes[editingNoteIndex].tags.push({
      content: tagText,
      color: tagColor,
    });
  }
  */

  tags.push({ content: tagText, color: tagColor });
  localStorage.setItem("tags", JSON.stringify(tags));

  // Save the tags
  //localStorage.setItem("notes", JSON.stringify(notes));

  // Clear the input
  noteTags.value = "";
  // Clear color of input box for tags
  noteTags.style.backgroundColor = "";
}

function removeTag(tagElement, tagText) {
  // Remove the tag element from the DOM
  tagElement.remove();

  // Remove the tag from the tags array of the currently edited note
  if (editingNoteIndex !== null) {
    const tagIndex = notes[editingNoteIndex].tags.findIndex(
      (tag) => tag.content === tagText
    );
    if (tagIndex > -1) {
      notes[editingNoteIndex].tags.splice(tagIndex, 1);
    }

    // Save the updated notes
    //localStorage.setItem("notes", JSON.stringify(notes));
  }
}

function showTagDropdown() {
  tagDropdownContainer.classList.remove("hidden");
  tagDropdownButton.innerHTML = "&#9652;"; // Change icon to up arrow
  loadTags();
}

function hideTagDropdown() {
  tagDropdownContainer.classList.add("hidden");
  tagDropdownButton.innerHTML = "&#9662;"; // Change icon to down arrow
}

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

  if (editingNoteIndex !== null) {
    notes[editingNoteIndex].tags.push({
      content: tag.content,
      color: tag.color,
    });
  }

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

    noteElement.innerHTML = `
      <div class="note-header">
        <h2>${note.title}</h2>
        <button class="delete-note" aria-label="Delete Note" onclick="deleteNoteByIndex(event, ${index})">🗑️</button>
      </div>
      <p>${note.content}</p>
      <small>${note.date} - Tags: ${note.tags.map((tag) => tag.content).join(", ")}</small>
    `;
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

function showFilterDropdown() {
  filterDropdownContainer.classList.remove("hidden");
  filterDropdownContainer.classList.add("visible");
  filterButton.innerHTML = "&#9652;"; // Change icon to up arrow
  loadFilterTags();
}

function hideFilterDropdown() {
  filterDropdownContainer.classList.add("hidden");
  filterDropdownContainer.classList.remove("visible");
  filterButton.innerHTML = "&#9662;"; // Change icon to filter icon
}

// Load tags from localStorage and populate the filter dropdown
function loadFilterTags() {
  tags = JSON.parse(localStorage.getItem("tags"));
  filterDropdownList.innerHTML = ""; // Clear existing items

  tags.forEach((tag) => {
    const tagItem = document.createElement("li");
    tagItem.textContent = tag.content;
    tagItem.style.backgroundColor = tag.color;
    tagItem.addEventListener("click", () => filterNotesByTag(tag.content));
    filterDropdownList.appendChild(tagItem);
  });
}

// Filter notes by the selected tag
function filterNotesByTag(selectedTag) {
  const filteredNotes = notes.filter((note) =>
    note.tags.some((tag) => tag.content === selectedTag)
  );
  renderNotes(filteredNotes);
  hideFilterDropdown();
}
