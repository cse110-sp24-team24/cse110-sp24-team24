let notes = []; // Array to store notes
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
const boldButton = document.getElementById("makeBoldButton")

// Event listeners
addNoteButton.addEventListener("click", () => {
  showNoteEditor();
});
saveNoteButton.addEventListener("click", saveNote);
deleteNoteButton.addEventListener("click", deleteNote);
cancelButton.addEventListener("click", hideNoteEditor);
searchInput.addEventListener("input", filterNotes);

underlineButton.addEventListener("click", function() {applyStyle('underline');});
italicButton.addEventListener("click", function() {applyStyle('italic');});
boldButton.addEventListener("click", function() {applyStyle('bold');});

// Show note editor with optional note data and index
function showNoteEditor(note = { title: "", content: "", tags: "", date: new Date().toISOString().substring(0, 10) }, index = null) {
  editingNoteIndex = index;
  noteTitle.value = note.title;
  noteContent.innerHTML = note.content;
  noteTags.value = note.tags;
  noteDate.value = note.date;
  noteEditor.classList.remove("hidden"); // Show the note editor
}

// Hide note editor and clear fields
function hideNoteEditor() {
  noteEditor.classList.add("hidden"); // Hide the note editor
  clearNoteEditor();
}

// Clear note editor fields
function clearNoteEditor() {
  noteTitle.value = "";
  noteContent.innerHTML = ""; // Clears the prev content when making a new note
  noteTags.value = "";
  noteDate.value = new Date().toISOString().substring(0, 10); // Set to today's date
}

// text styling buttons
function applyStyle(style) 
{
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


// Save note and update notes array
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

  renderNotes();
  hideNoteEditor();
}

// Delete note and update notes array
function deleteNote() {
  if (editingNoteIndex !== null) {
    if (confirm("Are you sure you want to delete this note?")) {
      notes.splice(editingNoteIndex, 1); // Remove note from array
      renderNotes();
      hideNoteEditor();
    }
  }
}

// Delete note by index
function deleteNoteByIndex(event, index) {
  event.stopPropagation(); // Prevent click event from propagating to parent elements
  if (confirm("Are you sure you want to delete this note?")) {
    notes.splice(index, 1); // Remove note from array
    renderNotes();
  }
}

// Render notes to the container
function renderNotes(filteredtitleNotes = notes, filteredtagNotes = [], filteredtextNotes = []) {
  notesContainer.innerHTML = "<h2>Your Journals:</h2>"; // Clear previous notes

  filteredtitleNotes.forEach((note, index) => {
    const noteElement = document.createElement("div");
    noteElement.className = "note";
    noteElement.innerHTML = `
      <div class="note-header">
        <h2>${note.title}</h2>
        <button class="delete-note" aria-label="Delete Note" onclick="deleteNoteByIndex(event, ${index})">🗑️</button>
      </div>
      <p>${note.content}</p>
      <small>${note.date} - Tags: ${note.tags}</small>
    `;
    noteElement.addEventListener("click", () => {
      showNoteEditor(note, index); // Edit note on click
    });
    notesContainer.appendChild(noteElement);
  });

  filteredtagNotes.forEach((note, index) => {
    const noteElement = document.createElement("div");
    noteElement.className = "note";
    noteElement.innerHTML = `
      <div class="note-header">
        <h2>${note.title}</h2>
        <button class="delete-note" aria-label="Delete Note" onclick="deleteNoteByIndex(event, ${index})">🗑️</button>
      </div>
      <p>${note.content}</p>
      <small>${note.date} - Tags: ${note.tags}</small>
    `;
    noteElement.addEventListener("click", () => {
      showNoteEditor(note, index); // Edit note on click
    });
    notesContainer.appendChild(noteElement);
  });


  filteredtextNotes.forEach((note, index) => {
    const noteElement = document.createElement("div");
    noteElement.className = "note";
    noteElement.innerHTML = `
      <div class="note-header">
        <h2>${note.title}</h2>
        <button class="delete-note" aria-label="Delete Note" onclick="deleteNoteByIndex(event, ${index})">🗑️</button>
      </div>
      <p>${note.content}</p>
      <small>${note.date} - Tags: ${note.tags}</small>
    `;
    noteElement.addEventListener("click", () => {
      showNoteEditor(note, index); // Edit note on click
    });
    notesContainer.appendChild(noteElement);
  });
}


// Filter notes based on search input
function filterNotes() {
  const query = searchInput.value.toLowerCase();

  let filteredtitleNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(query)
  );
  let filteredtagNotes = notes.filter(
    (note) =>
      note.tags.toLowerCase().includes(query) &&
      (!filteredtitleNotes.includes(note))
  );
  let filteredtextNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(query) &&
      (!filteredtitleNotes.includes(note)) &&
      (!filteredtagNotes.includes(note))
  );

  // Render filtered notes
  renderNotes(filteredtitleNotes, filteredtagNotes, filteredtextNotes);
}
