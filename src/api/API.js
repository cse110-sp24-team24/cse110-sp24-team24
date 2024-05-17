function saveNote(note) {
  localStorage.setItem("notes", JSON.stringify(note));
}

let newNote = {
  id: "2",
  title: "Meeting Agenda",
  date: new Date(),
  tags: ["meeting", "agenda"],
  content: "Discuss quarterly goals and progress.",
};

saveNote(newNote);


function DeletNote(note) {
  
}
