let notes = [];
let editingNoteIndex = null;

document.getElementById("addNoteButton").addEventListener("click", () => {
  showNoteEditor();
});

document.getElementById("saveNoteButton").addEventListener("click", saveNote);
document
  .getElementById("deleteNoteButton")
  .addEventListener("click", deleteNote);
document
  .getElementById("cancelButton")
  .addEventListener("click", hideNoteEditor);
document.getElementById("searchInput").addEventListener("input", filterNotes);

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
  document.getElementById("noteTitle").value = note.title;
  document.getElementById("noteContent").value = note.content;
  document.getElementById("noteTags").value = note.tags;
  document.getElementById("noteDate").value = note.date;
  document.getElementById("noteEditor").classList.remove("hidden");
}

function hideNoteEditor() {
  document.getElementById("noteEditor").classList.add("hidden");
}

function saveNote() {
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;
  const tags = document.getElementById("noteTags").value;
  const date = document.getElementById("noteDate").value;

  const note = { title, content, tags, date };

  if (editingNoteIndex !== null) {
    notes[editingNoteIndex] = note;
  } else {
    notes.push(note);
  }

  renderNotes();
  hideNoteEditor();
}

function deleteNote() {
  if (editingNoteIndex !== null) {
    notes.splice(editingNoteIndex, 1);
  }

  renderNotes();
  hideNoteEditor();
}

function renderNotes(filteredNotes = notes) {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "<h2>Your Journals:</h2>";

  filteredNotes.forEach((note, index) => {
    const noteElement = document.createElement("div");
    noteElement.className = "note";
    noteElement.innerHTML = `
            <h2>${note.title}</h2>
            <p>${note.content}</p>
            <small>${note.date} - Tags: ${note.tags}</small>
        `;
    noteElement.addEventListener("click", () => {
      showNoteEditor(note, index);
    });

    notesContainer.appendChild(noteElement);
  });
}

function filterNotes() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.toLowerCase().includes(query)
  );

  renderNotes(filteredNotes);
}
