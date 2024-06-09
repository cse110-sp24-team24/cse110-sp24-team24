// Need to run the following commands to run the tests:
// npm install
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
  <button id="insertImageButton"></button>
  <button id="insertCodeBlockButton"></button>
  <input type="checkbox" id="darkmode-toggle">
`;

// Mock global functions
global.alert = jest.fn();
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

// Mock document.execCommand
document.execCommand = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock the notes API
window.notes = {
  createNote: jest.fn(),
  readNotes: jest.fn(() => []), // Return an empty array by default
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
};

const {
  initializeNoteApp,
  showNoteEditor,
  hideNoteEditor,
  clearNoteEditor,
  saveActiveNote,
  deleteActiveNote,
  deleteNote,
  renderNotes,
  filterNotes,
  createNoteElement
} = require('../src/scripts/render');

beforeAll(() => {
  initializeNoteApp();
});

beforeEach(() => {
  jest.clearAllMocks();
  document.getElementById("noteEditor").classList.add("hidden");
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").innerHTML = "";
  document.getElementById("noteTags").value = "";
  document.getElementById("noteDate").value = "";
  document.getElementById("searchInput").value = "";
  document.getElementById("notesContainer").innerHTML = "";
  activeNoteID = null; // Reset activeNoteID before each test
});

describe('showNoteEditor', () => {
  it('should show the note editor with default values for a new note', () => {
    showNoteEditor();
    expect(document.getElementById("noteTitle").value).toBe('');
    expect(document.getElementById("noteContent").innerHTML).toBe('');
    expect(document.getElementById("noteTags").value).toBe('');
    expect(document.getElementById("noteDate").value).toBe(new Date().toISOString().substring(0, 10));
    expect(document.getElementById("noteEditor").classList.contains('hidden')).toBe(false);
  });

  it('should show the note editor with values for an existing note', () => {
    const note = { ID: '1', title: 'Existing Note', content: 'Content', tags: 'Tag', date: '2023-05-27' };
    showNoteEditor(note);
    expect(document.getElementById("noteTitle").value).toBe(note.title);
    expect(document.getElementById("noteContent").innerHTML).toBe(note.content);
    expect(document.getElementById("noteTags").value).toBe(note.tags);
    expect(document.getElementById("noteDate").value).toBe(note.date);
    expect(document.getElementById("noteEditor").classList.contains('hidden')).toBe(false);
  });
});

describe('hideNoteEditor', () => {
  it('should hide the note editor and clear its fields', () => {
    hideNoteEditor();
    expect(document.getElementById("noteEditor").classList.contains('hidden')).toBe(true);
    expect(document.getElementById("noteTitle").value).toBe('');
    expect(document.getElementById("noteContent").innerHTML).toBe('');
    expect(document.getElementById("noteTags").value).toBe('');
    expect(document.getElementById("noteDate").value).toBe(new Date().toISOString().substring(0, 10));
  });
});

describe('renderNotes', () => {
  it('should render the notes correctly', () => {
    window.notes.readNotes.mockReturnValue([
      { ID: '1', title: 'Note 1', content: 'Content 1', tags: 'Tag1', date: '2023-05-27' },
      { ID: '2', title: 'Note 2', content: 'Content 2', tags: 'Tag2', date: '2023-05-28' }
    ]);

    renderNotes();
    expect(document.getElementById("notesContainer").childElementCount).toBe(3); // including the header
  });
});

describe('clearNoteEditor', () => {
  it('should clear all input values in the note editor', () => {
    const note = { ID: '1', title: 'Existing Note', content: 'Content', tags: 'Tag', date: '2023-05-27' };
    showNoteEditor(note);
    clearNoteEditor();
    expect(document.getElementById("noteTitle").value).toBe('');
    expect(document.getElementById("noteContent").innerHTML).toBe('');
    expect(document.getElementById("noteTags").value).toBe('');
    expect(document.getElementById("noteDate").value).toBe(new Date().toISOString().substring(0, 10));
  });
});

describe('saveActiveNote', () => {

  it('should call updateNote when saving an existing note', async () => {
    const note = { ID: '1', title: 'Existing Note', content: 'Content', tags: 'Tag', date: '2023-05-27' };
    showNoteEditor(note);
    document.getElementById("noteTitle").value = "Updated Note";
    document.getElementById("noteContent").innerHTML = "Updated Content";

    await saveActiveNote();
    expect(window.notes.updateNote).toHaveBeenCalledWith('1', "Updated Note", "Updated Content", "Tag", "2023-05-27");
  });
});

describe('deleteActiveNote', () => {
  it('should call deleteNote for the active note', async () => {
    const note = { ID: '1', title: 'Existing Note', content: 'Content', tags: 'Tag', date: '2023-05-27' };
    showNoteEditor(note);
    jest.spyOn(window, 'confirm').mockImplementation(() => true);

    await deleteActiveNote();
    expect(window.notes.deleteNote).toHaveBeenCalledWith('1');
  });
});

describe('deleteNote', () => {
  it('should call deleteNote for a specific note ID', async () => {
    const note = { ID: '2', title: 'Another Note', content: 'Content', tags: 'Tag', date: '2023-05-28' };
    jest.spyOn(window, 'confirm').mockImplementation(() => true);

    await deleteNote(note.ID);
    expect(window.notes.deleteNote).toHaveBeenCalledWith('2');
  });
});

describe('filterNotes', () => {
  it('should filter notes based on search input', () => {
    window.notes.readNotes.mockReturnValue([
      { ID: '1', title: 'Note 1', content: 'Content 1', tags: 'Tag1', date: '2023-05-27' },
      { ID: '2', title: 'Note 2', content: 'Content 2', tags: 'Tag2', date: '2023-05-28' }
    ]);

    document.getElementById("searchInput").value = 'Note 1';
    filterNotes();
    expect(document.getElementById("notesContainer").childElementCount).toBe(2); // including the header
  });
});
