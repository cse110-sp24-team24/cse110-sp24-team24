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

// Event listeners
addNoteButton.addEventListener("click", () => {
  showNoteEditor();
});
saveNoteButton.addEventListener("click", saveNote);
deleteNoteButton.addEventListener("click", deleteNote);
cancelButton.addEventListener("click", hideNoteEditor);
searchInput.addEventListener("input", filterNotes);

// Show note editor with optional note data and index
function showNoteEditor(note = { title: "", content: "", tags: "", date: new Date().toISOString().substring(0, 10) }, index = null) {
  editingNoteIndex = index;
  noteTitle.value = note.title;
  noteContent.value = note.content;
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
  noteContent.value = "";
  noteTags.value = "";
  noteDate.value = new Date().toISOString().substring(0, 10); // Set to today's date
}

// Save note and update notes array
function saveNote() {
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();
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
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.toLowerCase().includes(query)
  );

  renderNotes(filteredNotes); // Render filtered notes
}
