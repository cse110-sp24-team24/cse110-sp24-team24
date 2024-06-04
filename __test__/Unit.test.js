// Need to run following commands to run the tests:
// npm install
// npm install --save-dev jest-environment-jsdom
// npm test

// Set up DOM elements
document.body.innerHTML = `
  <div id="notesContainer"></div>
  <div id="noteEditor" class="hidden"></div>
  <input type="text" id="noteTitle" />
  <div id="noteContent" contenteditable="true"></div>
  <input type="text" id="noteTags" />
  <input type="date" id="noteDate" />
  <input type="text" id="searchInput" />
  <button id="addNoteButton"></button>
  <button id="saveNoteButton"></button>
  <button id="deleteNoteButton"></button>
  <button id="cancelButton"></button>
  <button id="makeUnderlineButton"></button>
  <button id="makeItalicButton"></button>
  <button id="makeBoldButton"></button>
  <button id="insertCodeBlockButton"></button>
`;

// Mock global functions
global.alert = jest.fn();
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

// Mock document.execCommand
document.execCommand = jest.fn();

// Import the functions from the script
const { initializeNoteApp, clearNotes, loadNotes, saveNote, deleteNote, showNoteEditor, hideNoteEditor, clearNoteEditor, filterNotes, renderNotes, getNotes } = require('../src/scripts/script');

beforeAll(() => {
  initializeNoteApp();
});

describe('showNoteEditor', () => {
  it('should show the note editor with default values for a new note', () => {
    showNoteEditor();
    expect(noteTitle.value).toBe('');
    expect(noteContent.innerHTML).toBe('');
    expect(noteTags.value).toBe('');
    expect(noteDate.value).toBe(new Date().toISOString().substring(0, 10));
    expect(noteEditor.classList.contains('hidden')).toBe(false);
  });

  it('should show the note editor with values for an existing note', () => {
    const note = { title: 'Existing Note', content: 'Content', tags: 'Tag', date: '2023-05-27' };
    showNoteEditor(note, 0);

    expect(noteTitle.value).toBe(note.title);
    expect(noteContent.innerHTML).toBe(note.content);
    expect(noteTags.value).toBe(note.tags);
    expect(noteDate.value).toBe(note.date);
    expect(noteEditor.classList.contains('hidden')).toBe(false);
  });
});

describe('hideNoteEditor', () => {
  it('should hide the note editor and clear its fields', () => {
    hideNoteEditor();
    expect(noteEditor.classList.contains('hidden')).toBe(true);
    expect(noteTitle.value).toBe('');
    expect(noteContent.innerHTML).toBe('');
    expect(noteTags.value).toBe('');
    expect(noteDate.value).toBe(new Date().toISOString().substring(0, 10));
  });
});

describe('renderNotes', () => {
  it('should render the notes correctly', () => {
    clearNotes();
    renderNotes();
    expect(notesContainer.childElementCount).toBe(1);
    const note1 = { title: 'Existing Note', content: 'new stuff', tags: 'Tag', date: '2023-05-27' };
    const note2 = { title: '2', content: '2', tags: '2', date: '2023-05-27' };
    showNoteEditor();
    noteTitle.value = note1.title;
    noteContent.innerHTML = note1.content;
    noteTags.value = note1.tags;
    noteDate.value = note1.date;
    saveNote();
    showNoteEditor();
    noteTitle.value = note2.title;
    noteContent.innerHTML = note2.content;
    noteTags.value = note2.tags;
    noteDate.value = note2.date;
    saveNote();
    renderNotes();
    expect(notesContainer.childElementCount).toBe(3);
  });
});

describe('clearNoteEditor', () => {
  it('sets all input values to empty string', () => {
    const note = { title: 'Existing Note', content: 'new stuff', tags: 'Tag', date: '2023-05-27' };
    showNoteEditor();
    noteTitle.value = note.title;
    noteContent.innerHTML = note.content;
    noteTags.value = note.tags;
    noteDate.value = note.date;
    clearNoteEditor();
    expect(noteTitle.value).toBe('');
    expect(noteContent.innerHTML).toBe('');
    expect(noteTags.value).toBe('');
    expect(noteDate.value).toBe(new Date().toISOString().substring(0, 10));
  });
});

describe('loadandsaveNotes', () => {
  it('load notes into "notes" array after saving them', () => {
    clearNotes();
    const note = { title: 'Existing Note', content: 'new stuff', tags: 'Tag', date: '2023-05-27' };
    showNoteEditor();
    noteTitle.value = note.title;
    noteContent.innerHTML = note.content;
    noteTags.value = note.tags;
    noteDate.value = note.date;
    expect(getNotes()).toStrictEqual([]);
    saveNote();
    expect(getNotes()).toStrictEqual([{ title: 'Existing Note', content: 'new stuff', tags: 'Tag', date: '2023-05-27' }]);
    clearNotes();
    expect(getNotes()).toStrictEqual([]);
    loadNotes();
    expect(getNotes()).toStrictEqual([{ title: 'Existing Note', content: 'new stuff', tags: 'Tag', date: '2023-05-27' }]);
  });
});

describe('deleteNote', () => {
  it('delete note from notes array', () => {
    clearNotes();
    const note1 = { title: 'Existing Note', content: 'new stuff', tags: 'Tag', date: '2023-05-27' };
    const note2 = { title: '2', content: '2', tags: '2', date: '2023-05-27' };
    showNoteEditor();
    noteTitle.value = note1.title;
    noteContent.innerHTML = note1.content;
    noteTags.value = note1.tags;
    noteDate.value = note1.date;
    saveNote();
    expect(getNotes()).toStrictEqual([{ title: 'Existing Note', content: 'new stuff', tags: 'Tag', date: '2023-05-27' }]);
    showNoteEditor();
    noteTitle.value = note2.title;
    noteContent.innerHTML = note2.content;
    noteTags.value = note2.tags;
    noteDate.value = note2.date;
    saveNote();
    expect(getNotes()).toStrictEqual([{ title: 'Existing Note', content: 'new stuff', tags: 'Tag', date: '2023-05-27' }, { title: '2', content: '2', tags: '2', date: '2023-05-27' }]);
    showNoteEditor(note1, 0);
    // Mock the confirm dialog to simulate user clicking "OK"
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    deleteNote();
    expect(getNotes()).toStrictEqual([{ title: '2', content: '2', tags: '2', date: '2023-05-27' }]);
  });
});
