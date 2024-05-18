let newNote = {
  id: "2",
  title: "Meeting Agenda",
  date: new Date(),
  tags: ["meeting", "agenda"],
  content: "Discuss quarterly goals and progress.",
};

//Save button
const saveNoteButton = document.getElementById("SaveButton");
saveNoteButton.addEventListener("click", () => saveNote(newNote));

//Delete button
let deleteButton = document.getElementById("DeleteButton");
deleteButton.addEventListener("click", function () {
  // Call the DeleteNote function with the id of the note you want to delete
  DeleteNote(newNote.id);
});

function saveNote(note) {
  localStorage.setItem("notes", JSON.stringify(note));
}

function DeleteNote(noteId) {
  // Grab the existing notes from local storage
  let notes = JSON.parse(localStorage.getItem("notes"));

  // Filter out the note with the given id
  notes = notes.filter((note) => note.id !== noteId);

  // Save the remaining notes back to local storage
  localStorage.setItem("notes", JSON.stringify(notes));
}
